import React, { useEffect, useState } from 'react';
import { Save, AlertCircle } from 'lucide-react';
import {
  getScenario,
  updateScenario,
} from '../../utils/api';

interface ScenarioEditorProps {
  scenarioId: string;
}

export default function ScenarioEditor({ scenarioId }: ScenarioEditorProps) {
  const [scenario, setScenario] = useState<{
    id: string;
    title: string;
    description?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingDescription, setEditingDescription] = useState('');
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [scenarioId]);

  async function loadData() {
    try {
      setLoading(true);
      const scenarioData = await getScenario(scenarioId);
      setScenario(scenarioData);
      setEditingTitle(scenarioData.title);
      setEditingDescription(scenarioData.description || '');
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateScenario() {
    if (!scenario) return;
    try {
      await updateScenario(scenario.id, {
        title: editingTitle,
        description: editingDescription,
      });
      setScenario({
        ...scenario,
        title: editingTitle,
        description: editingDescription,
      });
      setSaveMessage('シナリオを保存しました');
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error('Failed to update scenario:', error);
      setSaveMessage('保存に失敗しました');
    }
  }

  if (loading) {
    return <div className="text-center text-slate-300 py-8">読み込み中...</div>;
  }

  if (!scenario) {
    return <div className="text-center text-red-400 py-8">シナリオが見つかりません</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          タイトル
        </label>
        <input
          type="text"
          value={editingTitle}
          onChange={(e) => setEditingTitle(e.target.value)}
          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:border-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          説明
        </label>
        <textarea
          value={editingDescription}
          onChange={(e) => setEditingDescription(e.target.value)}
          rows={4}
          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:border-blue-500"
        />
      </div>
      <button
        onClick={handleUpdateScenario}
        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded flex items-center gap-2 transition"
      >
        <Save size={20} />
        保存
      </button>
      {saveMessage && (
        <div className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2">
          <AlertCircle size={16} />
          {saveMessage}
        </div>
      )}
    </div>
  );
}
