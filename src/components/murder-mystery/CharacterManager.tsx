import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Edit2, Save, X, Users } from 'lucide-react';
import {
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

interface CharacterManagerProps {
  scenarioId: string;
}

export default function CharacterManager({ scenarioId }: CharacterManagerProps) {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
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
      const charactersData = await getCharacters(scenarioId);
      setCharacters(charactersData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
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

  return (
    <div className="space-y-6">
      {/* Create Character Form */}
      <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Users size={20} />
          新しいキャラクターを追加
        </h3>
        <form onSubmit={handleCreateCharacter} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                キャラクター名
              </label>
              <input
                type="text"
                value={newCharName}
                onChange={(e) => setNewCharName(e.target.value)}
                placeholder="例：探偵、容疑者A"
                className="w-full px-4 py-2 bg-slate-600 border border-slate-500 rounded text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                役割
              </label>
              <input
                type="text"
                value={newCharRole}
                onChange={(e) => setNewCharRole(e.target.value)}
                placeholder="例：容疑者、証人、探偵"
                className="w-full px-4 py-2 bg-slate-600 border border-slate-500 rounded text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded flex items-center justify-center gap-2 transition"
          >
            <Plus size={20} />
            キャラクターを追加
          </button>
        </form>
      </div>

      {/* Characters List */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">登録済みキャラクター</h3>
        {characters.length === 0 ? (
          <p className="text-slate-400 text-center py-8 bg-slate-800 rounded-lg border border-slate-700">
            キャラクターがまだ登録されていません
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {characters.map((character) => (
              <div
                key={character.id}
                className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition"
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
                      className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white text-sm"
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
                      className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white text-sm"
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
                      className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white text-sm"
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
                      className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white text-sm"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateCharacter(character.id)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded flex items-center justify-center gap-2 transition text-sm"
                      >
                        <Save size={16} />
                        保存
                      </button>
                      <button
                        onClick={() => {
                          setEditingCharId(null);
                          setEditingCharData({});
                        }}
                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded flex items-center justify-center gap-2 transition text-sm"
                      >
                        <X size={16} />
                        キャンセル
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-white">
                          {character.name}
                        </h4>
                        {character.role && (
                          <p className="text-sm text-slate-400 mt-1">{character.role}</p>
                        )}
                      </div>
                      <div className="flex gap-2 ml-2">
                        <button
                          onClick={() => {
                            setEditingCharId(character.id);
                            setEditingCharData(character);
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteCharacter(character.id)}
                          className="bg-red-600 hover:bg-red-700 text-white p-2 rounded transition"
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
