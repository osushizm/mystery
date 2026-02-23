import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import {
  getScenario,
  updateScenario,
  getCharacters,
  createCharacter,
  deleteCharacter,
  updateCharacter,
} from '../../utils/api';

interface Character {
  id: string;
  name: string;
  role?: string;
  backstory?: string;
  goal?: string;
}

interface ScenarioEditorProps {
  scenarioId: string;
}

export default function ScenarioEditor({ scenarioId }: ScenarioEditorProps) {
  const [scenario, setScenario] = useState<{
    id: string;
    title: string;
    description?: string;
  } | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingDescription, setEditingDescription] = useState('');
  const [newCharName, setNewCharName] = useState('');
  const [newCharRole, setNewCharRole] = useState('');
  const [editingCharId, setEditingCharId] = useState<string | null>(null);
  const [editingCharData, setEditingCharData] = useState<Partial<Character>>({});

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

      const charactersData = await getCharacters(scenarioId);
      setCharacters(charactersData);
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
    } catch (error) {
      console.error('Failed to update scenario:', error);
    }
  }

  async function handleCreateCharacter(e: React.FormEvent) {
    e.preventDefault();
    if (!newCharName.trim()) return;

    try {
      await createCharacter(scenarioId, {
        name: newCharName,
        role: newCharRole,
      });
      setNewCharName('');
      setNewCharRole('');
      loadData();
    } catch (error) {
      console.error('Failed to create character:', error);
    }
  }

  async function handleDeleteCharacter(characterId: string) {
    if (!confirm('このキャラクターを削除してもよろしいですか？')) return;

    try {
      await deleteCharacter(scenarioId, characterId);
      loadData();
    } catch (error) {
      console.error('Failed to delete character:', error);
    }
  }

  async function handleUpdateCharacter(characterId: string) {
    try {
      await updateCharacter(scenarioId, characterId, editingCharData);
      setEditingCharId(null);
      setEditingCharData({});
      loadData();
    } catch (error) {
      console.error('Failed to update character:', error);
    }
  }

  if (loading) {
    return <div className="text-center text-slate-300 py-8">読み込み中...</div>;
  }

  if (!scenario) {
    return <div className="text-center text-red-400 py-8">シナリオが見つかりません</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Scenario Info */}
        <div className="bg-slate-800 rounded-lg p-6 mb-8 border border-slate-700">
          <h1 className="text-3xl font-bold text-white mb-4">シナリオ編集</h1>
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
                rows={3}
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
          </div>
        </div>

        {/* Characters Section */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-4">キャラクター管理</h2>

          {/* Create Character Form */}
          <form onSubmit={handleCreateCharacter} className="mb-6 p-4 bg-slate-700 rounded">
            <h3 className="text-lg font-semibold text-white mb-3">
              新しいキャラクターを追加
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={newCharName}
                onChange={(e) => setNewCharName(e.target.value)}
                placeholder="キャラクター名"
                className="px-4 py-2 bg-slate-600 border border-slate-500 rounded text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                value={newCharRole}
                onChange={(e) => setNewCharRole(e.target.value)}
                placeholder="役割（例：容疑者、探偵）"
                className="px-4 py-2 bg-slate-600 border border-slate-500 rounded text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded flex items-center justify-center gap-2 transition"
            >
              <Plus size={20} />
              キャラクターを追加
            </button>
          </form>

          {/* Characters List */}
          <div className="space-y-3">
            {characters.length === 0 ? (
              <p className="text-slate-400">キャラクターがまだ登録されていません</p>
            ) : (
              characters.map((character) => (
                <div
                  key={character.id}
                  className="bg-slate-700 rounded p-4 border border-slate-600"
                >
                  {editingCharId === character.id ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editingCharData.name || ''}
                        onChange={(e) =>
                          setEditingCharData({
                            ...editingCharData,
                            name: e.target.value,
                          })
                        }
                        placeholder="キャラクター名"
                        className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white"
                      />
                      <input
                        type="text"
                        value={editingCharData.role || ''}
                        onChange={(e) =>
                          setEditingCharData({
                            ...editingCharData,
                            role: e.target.value,
                          })
                        }
                        placeholder="役割"
                        className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white"
                      />
                      <textarea
                        value={editingCharData.backstory || ''}
                        onChange={(e) =>
                          setEditingCharData({
                            ...editingCharData,
                            backstory: e.target.value,
                          })
                        }
                        placeholder="背景ストーリー"
                        rows={2}
                        className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white"
                      />
                      <textarea
                        value={editingCharData.goal || ''}
                        onChange={(e) =>
                          setEditingCharData({
                            ...editingCharData,
                            goal: e.target.value,
                          })
                        }
                        placeholder="目的・秘密"
                        rows={2}
                        className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateCharacter(character.id)}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded flex items-center justify-center gap-2 transition"
                        >
                          <Save size={16} />
                          保存
                        </button>
                        <button
                          onClick={() => {
                            setEditingCharId(null);
                            setEditingCharData({});
                          }}
                          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded flex items-center justify-center gap-2 transition"
                        >
                          <X size={16} />
                          キャンセル
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="text-lg font-semibold text-white">
                            {character.name}
                          </h4>
                          {character.role && (
                            <p className="text-sm text-slate-300">{character.role}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingCharId(character.id);
                              setEditingCharData(character);
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteCharacter(character.id)}
                            className="bg-red-600 hover:bg-red-700 text-white p-2 rounded"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
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
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
