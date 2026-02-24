import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Edit2, Eye } from 'lucide-react';
import { getScenarios, createScenario, deleteScenario } from '../../utils/api';

interface Scenario {
  id: string;
  title: string;
  description?: string;
}

export default function Dashboard() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

  useEffect(() => {
    loadScenarios();
  }, []);

  async function loadScenarios() {
    try {
      setLoading(true);
      const data = await getScenarios();
      setScenarios(data);
    } catch (error) {
      console.error('Failed to load scenarios:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateScenario(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      await createScenario({
        title: newTitle,
        description: newDescription,
      });
      setNewTitle('');
      setNewDescription('');
      loadScenarios();
    } catch (error) {
      console.error('Failed to create scenario:', error);
    }
  }

  async function handleDeleteScenario(id: string) {
    if (!confirm('このシナリオを削除してもよろしいですか？')) return;

    try {
      await deleteScenario(id);
      loadScenarios();
    } catch (error) {
      console.error('Failed to delete scenario:', error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">
          マーダーミステリー作成支援
        </h1>
        <p className="text-slate-300 mb-8">
          新しいシナリオを作成して、マーダーミステリーの世界を構築しましょう
        </p>

        {/* Create Scenario Form */}
        <div className="bg-slate-800 rounded-lg p-6 mb-8 border border-slate-700">
          <h2 className="text-xl font-semibold text-white mb-4">
            新しいシナリオを作成
          </h2>
          <form onSubmit={handleCreateScenario} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                シナリオタイトル
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="例：館での殺人事件"
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                説明
              </label>
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="シナリオの説明を入力してください"
                rows={3}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded flex items-center justify-center gap-2 transition"
            >
              <Plus size={20} />
              シナリオを作成
            </button>
          </form>
        </div>

        {/* Scenarios List */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">シナリオ一覧</h2>
          {loading ? (
            <div className="text-center text-slate-300">読み込み中...</div>
          ) : scenarios.length === 0 ? (
            <div className="text-center text-slate-400 py-8">
              シナリオがまだありません。上記のフォームで作成してください。
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {scenarios.map((scenario) => (
                <div
                  key={scenario.id}
                  className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-slate-600 transition"
                >
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {scenario.title}
                  </h3>
                  {scenario.description && (
                    <p className="text-slate-400 text-sm mb-4">
                      {scenario.description}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <a
                      href={`/mystery/scenario/view/${scenario.id}`}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded text-center flex items-center justify-center gap-2 transition"
                    >
                      <Eye size={16} />
                      表示
                    </a>
                    <a
                      href={`/mystery/scenario/edit/${scenario.id}`}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded text-center flex items-center justify-center gap-2 transition"
                    >
                      <Edit2 size={16} />
                      編集
                    </a>
                    <button
                      onClick={() => handleDeleteScenario(scenario.id)}
                      className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded flex items-center justify-center gap-2 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
