import React, { useEffect, useState } from 'react';
import { Eye, Edit2, Download } from 'lucide-react';
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

interface ScenarioPreviewProps {
  scenarioId: string;
}

interface Character {
  id: string;
  name: string;
  role?: string;
  backstory?: string;
  goal?: string;
}

interface Timeline {
  id: string;
  event_time: string;
  event_description: string;
}

interface Card {
  id: string;
  card_type: string;
  title: string;
  content: string;
  assigned_to_character_id?: string;
}

interface Scenario {
  id: string;
  title: string;
  description?: string;
}

export default function ScenarioPreview({ scenarioId }: ScenarioPreviewProps) {
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [timelines, setTimelines] = useState<Timeline[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    loadData();
  }, [scenarioId]);

  async function loadData() {
    try {
      setLoading(true);
      const [scenarioData, charsData, timelinesData, cardsData] = await Promise.all([
        getScenario(scenarioId),
        getCharacters(scenarioId),
        getTimelines(scenarioId),
        getCards(scenarioId),
      ]);

      setScenario(scenarioData);
      setCharacters(charsData);
      setTimelines(timelinesData.sort((a, b) => a.event_time.localeCompare(b.event_time)));
      setCards(cardsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleExportMainStory() {
    if (!scenario) return;

    try {
      setExporting(true);
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
      setExporting(false);
    }
  }

  if (loading) {
    return (
      <div className="text-center text-slate-300 py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        読み込み中...
      </div>
    );
  }

  if (!scenario) {
    return (
      <div className="text-center text-red-400 py-12">
        シナリオが見つかりません
      </div>
    );
  }

  const cardsByType = cards.reduce(
    (acc, card) => {
      if (!acc[card.card_type]) {
        acc[card.card_type] = [];
      }
      acc[card.card_type].push(card);
      return acc;
    },
    {} as Record<string, Card[]>
  );

  const cardTypeLabels: Record<string, string> = {
    clue: '手がかり',
    item: 'アイテム',
    information: '情報',
    secret: '秘密',
    evidence: '証拠',
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-800 rounded-lg p-8 border border-slate-700">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-white mb-2">{scenario.title}</h1>
            {scenario.description && (
              <p className="text-slate-300 text-lg">{scenario.description}</p>
            )}
          </div>
          <div className="flex gap-2 ml-4">
            <a
              href={`/mystery/scenario/edit/${scenarioId}`}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded flex items-center gap-2 transition"
            >
              <Edit2 size={18} />
              編集
            </a>
            <button
              onClick={handleExportMainStory}
              disabled={exporting}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded flex items-center gap-2 transition"
            >
              <Download size={18} />
              PDF出力
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="text-slate-400 text-sm font-semibold mb-2">キャラクター数</div>
          <div className="text-3xl font-bold text-white">{characters.length}</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="text-slate-400 text-sm font-semibold mb-2">タイムラインイベント</div>
          <div className="text-3xl font-bold text-white">{timelines.length}</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="text-slate-400 text-sm font-semibold mb-2">カード総数</div>
          <div className="text-3xl font-bold text-white">{cards.length}</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="text-slate-400 text-sm font-semibold mb-2">カードタイプ</div>
          <div className="text-3xl font-bold text-white">{Object.keys(cardsByType).length}</div>
        </div>
      </div>

      {/* Timeline Section */}
      {timelines.length > 0 && (
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-6">タイムライン</h2>
          <div className="space-y-4">
            {timelines.map((event, index) => (
              <div key={event.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="bg-blue-600 text-white font-bold rounded-full w-10 h-10 flex items-center justify-center text-sm">
                    {index + 1}
                  </div>
                  {index < timelines.length - 1 && (
                    <div className="w-0.5 h-12 bg-slate-600 mt-2"></div>
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                    <div className="font-bold text-white text-lg mb-2">{event.event_time}</div>
                    <p className="text-slate-300">{event.event_description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Characters Section */}
      {characters.length > 0 && (
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-6">登場人物</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {characters.map((character) => (
              <div key={character.id} className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                <h3 className="text-lg font-bold text-white mb-2">{character.name}</h3>
                {character.role && (
                  <p className="text-sm text-slate-400 mb-2">
                    <strong>役割：</strong> {character.role}
                  </p>
                )}
                {character.backstory && (
                  <p className="text-sm text-slate-300 mb-2">
                    <strong>背景：</strong> {character.backstory}
                  </p>
                )}
                {character.goal && (
                  <p className="text-sm text-slate-300">
                    <strong>目的：</strong> {character.goal}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cards Section */}
      {cards.length > 0 && (
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-6">カード</h2>
          <div className="space-y-6">
            {Object.entries(cardsByType).map(([type, typeCards]) => (
              <div key={type}>
                <h3 className="text-lg font-bold text-white mb-3">
                  {cardTypeLabels[type] || type}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {typeCards.map((card) => (
                    <div key={card.id} className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                      <h4 className="text-lg font-bold text-white mb-2">{card.title}</h4>
                      <p className="text-slate-300 text-sm mb-3">{card.content}</p>
                      {card.assigned_to_character_id && (
                        <p className="text-xs text-slate-400">
                          <strong>割り当て先：</strong>{' '}
                          {characters.find((c) => c.id === card.assigned_to_character_id)?.name || 'Unknown'}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
