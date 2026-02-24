import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Edit2, Save, X, Lightbulb, Search } from 'lucide-react';
import {
  getCards,
  createCard,
  deleteCard,
  updateCard,
  getCharacters,
  getScenario,
} from '../../utils/api';

interface Card {
  id: string;
  card_type: string;
  title: string;
  content: string;
  assigned_to_character_id?: string;
}

interface Character {
  id: string;
  name: string;
}

interface Scenario {
  id: string;
  title: string;
}

interface ClueManagerProps {
  scenarioId: string;
}

export default function ClueManager({ scenarioId }: ClueManagerProps) {
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [clues, setClues] = useState<Card[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [newClueTitle, setNewClueTitle] = useState('');
  const [newClueContent, setNewClueContent] = useState('');
  const [newClueCharId, setNewClueCharId] = useState('');
  const [editingClueId, setEditingClueId] = useState<string | null>(null);
  const [editingClueData, setEditingClueData] = useState<Partial<Card>>({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, [scenarioId]);

  async function loadData() {
    try {
      setLoading(true);
      const [scenarioData, cardsData, charsData] = await Promise.all([
        getScenario(scenarioId),
        getCards(scenarioId),
        getCharacters(scenarioId),
      ]);

      setScenario(scenarioData);
      // Filter only clues
      setClues(cardsData.filter((card) => card.card_type === 'clue'));
      setCharacters(charsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateClue(e: React.FormEvent) {
    e.preventDefault();
    if (!newClueTitle.trim() || !newClueContent.trim()) return;

    try {
      await createCard(scenarioId, {
        card_type: 'clue',
        title: newClueTitle,
        content: newClueContent,
        assigned_to_character_id: newClueCharId || undefined,
      });
      setNewClueTitle('');
      setNewClueContent('');
      setNewClueCharId('');
      loadData();
    } catch (error) {
      console.error('Failed to create clue:', error);
    }
  }

  async function handleDeleteClue(clueId: string) {
    if (!confirm('この手がかりを削除してもよろしいですか？')) return;

    try {
      await deleteCard(scenarioId, clueId);
      loadData();
    } catch (error) {
      console.error('Failed to delete clue:', error);
    }
  }

  async function handleUpdateClue(clueId: string) {
    try {
      await updateCard(scenarioId, clueId, editingClueData);
      setEditingClueId(null);
      setEditingClueData({});
      loadData();
    } catch (error) {
      console.error('Failed to update clue:', error);
    }
  }

  const filteredClues = clues.filter(
    (clue) =>
      clue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clue.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="text-center text-slate-300 py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        読み込み中...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
          <Lightbulb size={32} className="text-yellow-400" />
          手がかり管理
        </h1>
        {scenario && (
          <p className="text-slate-400">
            シナリオ: <strong>{scenario.title}</strong>
          </p>
        )}
      </div>

      {/* Create Clue Form */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-4">新しい手がかりを追加</h2>
        <form onSubmit={handleCreateClue} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              手がかりのタイトル
            </label>
            <input
              type="text"
              value={newClueTitle}
              onChange={(e) => setNewClueTitle(e.target.value)}
              placeholder="例：犯人の足跡、目撃者の証言"
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              手がかりの内容
            </label>
            <textarea
              value={newClueContent}
              onChange={(e) => setNewClueContent(e.target.value)}
              placeholder="手がかりの詳細な説明を入力してください"
              rows={4}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              割り当てキャラクター（オプション）
            </label>
            <select
              value={newClueCharId}
              onChange={(e) => setNewClueCharId(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">割り当てなし</option>
              {characters.map((char) => (
                <option key={char.id} value={char.id}>
                  {char.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded flex items-center justify-center gap-2 transition"
          >
            <Plus size={20} />
            手がかりを追加
          </button>
        </form>
      </div>

      {/* Search */}
      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="手がかりを検索..."
            className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Clues List */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">
          登録済み手がかり ({filteredClues.length})
        </h2>
        {filteredClues.length === 0 ? (
          <div className="text-center text-slate-400 py-12 bg-slate-800 rounded-lg border border-slate-700">
            {clues.length === 0
              ? '手がかりがまだ登録されていません'
              : '検索条件に一致する手がかりはありません'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredClues.map((clue) => (
              <div
                key={clue.id}
                className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition flex flex-col"
              >
                {editingClueId === clue.id ? (
                  <div className="space-y-3 flex-1">
                    <input
                      type="text"
                      value={editingClueData.title || ''}
                      onChange={(e) =>
                        setEditingClueData({
                          ...editingClueData,
                          title: e.target.value,
                        })
                      }
                      placeholder="タイトル"
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                    />
                    <textarea
                      value={editingClueData.content || ''}
                      onChange={(e) =>
                        setEditingClueData({
                          ...editingClueData,
                          content: e.target.value,
                        })
                      }
                      placeholder="内容"
                      rows={3}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateClue(clue.id)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-3 rounded flex items-center justify-center gap-1 transition text-sm"
                      >
                        <Save size={14} />
                        保存
                      </button>
                      <button
                        onClick={() => {
                          setEditingClueId(null);
                          setEditingClueData({});
                        }}
                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-3 rounded flex items-center justify-center gap-1 transition text-sm"
                      >
                        <X size={14} />
                        キャンセル
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-3">
                      <span className="inline-block bg-yellow-600 text-white text-xs font-semibold px-2 py-1 rounded">
                        手がかり
                      </span>
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-2">
                      {clue.title}
                    </h4>
                    <p className="text-slate-300 text-sm mb-3 flex-1">
                      {clue.content}
                    </p>
                    {clue.assigned_to_character_id && (
                      <p className="text-xs text-slate-400 mb-3">
                        <strong>割り当て先：</strong>{' '}
                        {characters.find((c) => c.id === clue.assigned_to_character_id)
                          ?.name || 'Unknown'}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingClueId(clue.id);
                          setEditingClueData(clue);
                        }}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded flex items-center justify-center gap-1 transition text-sm"
                      >
                        <Edit2 size={14} />
                        編集
                      </button>
                      <button
                        onClick={() => handleDeleteClue(clue.id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-3 rounded flex items-center justify-center gap-1 transition text-sm"
                      >
                        <Trash2 size={14} />
                        削除
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
