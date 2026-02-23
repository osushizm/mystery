import React, { useEffect, useState } from 'react';
import { Download, FileText } from 'lucide-react';
import {
  getScenario,
  getCharacters,
  getTimelines,
  getCards,
} from '../../utils/api';
import {
  createMainStoryPDF,
  createCharacterSheetPDF,
  createClueCardsPDF,
} from '../../utils/pdf-export';

interface PDFExporterProps {
  scenarioId: string;
}

export default function PDFExporter({ scenarioId }: PDFExporterProps) {
  const [loading, setLoading] = useState(false);
  const [scenario, setScenario] = useState<any>(null);
  const [characters, setCharacters] = useState<any[]>([]);
  const [timelines, setTimelines] = useState<any[]>([]);
  const [cards, setCards] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, [scenarioId]);

  async function loadData() {
    try {
      const [scenarioData, charsData, timelinesData, cardsData] = await Promise.all([
        getScenario(scenarioId),
        getCharacters(scenarioId),
        getTimelines(scenarioId),
        getCards(scenarioId),
      ]);

      setScenario(scenarioData);
      setCharacters(charsData);
      setTimelines(timelinesData);
      setCards(cardsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  }

  async function handleExportMainStory() {
    if (!scenario) return;

    try {
      setLoading(true);
      const pdfDataUrl = createMainStoryPDF(
        scenario.title,
        scenario.description || '',
        timelines,
        characters
      );

      const link = document.createElement('a');
      link.href = pdfDataUrl;
      link.download = `${scenario.title}_メインストーリー.pdf`;
      link.click();
    } catch (error) {
      console.error('Failed to export main story:', error);
      alert('PDFの出力に失敗しました');
    } finally {
      setLoading(false);
    }
  }

  async function handleExportCharacterSheets() {
    if (!scenario || characters.length === 0) return;

    try {
      setLoading(true);

      // Create a PDF for each character
      characters.forEach((character) => {
        const pdfDataUrl = createCharacterSheetPDF(scenario.title, character);

        const link = document.createElement('a');
        link.href = pdfDataUrl;
        link.download = `${scenario.title}_${character.name}_シート.pdf`;
        link.click();

        // Add a small delay between downloads
        setTimeout(() => {}, 100);
      });
    } catch (error) {
      console.error('Failed to export character sheets:', error);
      alert('PDFの出力に失敗しました');
    } finally {
      setLoading(false);
    }
  }

  async function handleExportClueCards() {
    if (!scenario || cards.length === 0) return;

    try {
      setLoading(true);
      const pdfDataUrl = createClueCardsPDF(scenario.title, cards);

      const link = document.createElement('a');
      link.href = pdfDataUrl;
      link.download = `${scenario.title}_カード.pdf`;
      link.click();
    } catch (error) {
      console.error('Failed to export clue cards:', error);
      alert('PDFの出力に失敗しました');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <FileText size={20} />
        PDF出力
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={handleExportMainStory}
          disabled={loading || !scenario}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded flex items-center justify-center gap-2 transition"
        >
          <Download size={18} />
          メインストーリー
        </button>

        <button
          onClick={handleExportCharacterSheets}
          disabled={loading || characters.length === 0}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded flex items-center justify-center gap-2 transition"
        >
          <Download size={18} />
          キャラクターシート
        </button>

        <button
          onClick={handleExportClueCards}
          disabled={loading || cards.length === 0}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded flex items-center justify-center gap-2 transition"
        >
          <Download size={18} />
          カード
        </button>
      </div>

      {loading && (
        <p className="text-slate-300 text-sm mt-4 text-center">
          PDFを生成中です...
        </p>
      )}

      <div className="mt-4 text-sm text-slate-400 space-y-1">
        <p>• <strong>メインストーリー</strong>: シナリオの概要、タイムライン、登場人物を含むPDF</p>
        <p>• <strong>キャラクターシート</strong>: 各キャラクターの詳細情報を個別PDFで出力</p>
        <p>• <strong>カード</strong>: 手がかりやアイテムなどのカードを印刷用レイアウトで出力</p>
      </div>
    </div>
  );
}
