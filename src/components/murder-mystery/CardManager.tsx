import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Edit2, Save, X, Tag } from 'lucide-react';
import {
  getCards,
  createCard,
  deleteCard,
  updateCard,
  getCharacters,
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

interface CardManagerProps {
  scenarioId: string;
}

const CARD_TYPES = ['clue', 'item', 'information', 'secret', 'evidence'];
const CARD_TYPE_LABELS: Record<string, string> = {
  clue: '手がかり',
  item: 'アイテム',
  information: '情報',
  secret: '秘密',
  evidence: '証拠',
};

const CARD_TYPE_COLORS: Record<string, string> = {
  clue: 'bg-purple-600',
  item: 'bg-yellow-600',
  information: 'bg-blue-600',
  secret: 'bg-red-600',
  evidence: 'bg-green-600',
};

export default function CardManager({ scenarioId }: CardManagerProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCardType, setNewCardType] = useState('clue');
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardContent, setNewCardContent] = useState('');
  const [newCardCharId, setNewCardCharId] = useState('');
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [editingCardData, setEditingCardData] = useState<Partial<Card>>({});
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, [scenarioId]);

  async function loadData() {
    try {
      setLoading(true);
      const cardsData = await getCards(scenarioId);
      setCards(cardsData);

      const charsData = await getCharacters(scenarioId);
      setCharacters(charsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateCard(e: React.FormEvent) {
    e.preventDefault();
    if (!newCardTitle.trim() || !newCardContent.trim()) return;

    try {
      await createCard(scenarioId, {
        card_type: newCardType,
        title: newCardTitle,
        content: newCardContent,
        assigned_to_character_id: newCardCharId || undefined,
      });
      setNewCardType('clue');
      setNewCardTitle('');
      setNewCardContent('');
      setNewCardCharId('');
      loadData();
    } catch (error) {
      console.error('Failed to create card:', error);
    }
  }

  async function handleDeleteCard(cardId: string) {
    if (!confirm('このカードを削除してもよろしいですか？')) return;

    try {
      await deleteCard(scenarioId, cardId);
      loadData();
    } catch (error) {
      console.error('Failed to delete card:', error);
    }
  }

  async function handleUpdateCard(cardId: string) {
    try {
      await updateCard(scenarioId, cardId, editingCardData);
      setEditingCardId(null);
      setEditingCardData({});
      loadData();
    } catch (error) {
      console.error('Failed to update card:', error);
    }
  }

  const filteredCards =
    filterType === 'all' ? cards : cards.filter((c) => c.card_type === filterType);

  if (loading) {
    return <div className="text-center text-slate-300 py-8">読み込み中...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Create Card Form */}
      <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Tag size={20} />
          新しいカードを追加
        </h3>
        <form onSubmit={handleCreateCard} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                カードタイプ
              </label>
              <select
                value={newCardType}
                onChange={(e) => setNewCardType(e.target.value)}
                className="w-full px-4 py-2 bg-slate-600 border border-slate-500 rounded text-white focus:outline-none focus:border-blue-500"
              >
                {CARD_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {CARD_TYPE_LABELS[type]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                タイトル
              </label>
              <input
                type="text"
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                placeholder="カードのタイトル"
                className="w-full px-4 py-2 bg-slate-600 border border-slate-500 rounded text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              内容
            </label>
            <textarea
              value={newCardContent}
              onChange={(e) => setNewCardContent(e.target.value)}
              placeholder="カードの内容を入力してください"
              rows={3}
              className="w-full px-4 py-2 bg-slate-600 border border-slate-500 rounded text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              割り当てキャラクター（オプション）
            </label>
            <select
              value={newCardCharId}
              onChange={(e) => setNewCardCharId(e.target.value)}
              className="w-full px-4 py-2 bg-slate-600 border border-slate-500 rounded text-white focus:outline-none focus:border-blue-500"
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
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded flex items-center justify-center gap-2 transition"
          >
            <Plus size={20} />
            カードを追加
          </button>
        </form>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilterType('all')}
          className={`px-4 py-2 rounded font-semibold transition ${
            filterType === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          すべて
        </button>
        {CARD_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4 py-2 rounded font-semibold transition ${
              filterType === type
                ? `${CARD_TYPE_COLORS[type]} text-white`
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {CARD_TYPE_LABELS[type]}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <div>
        {filteredCards.length === 0 ? (
          <div className="text-center text-slate-400 py-8 bg-slate-800 rounded-lg border border-slate-700">
            カードがまだ登録されていません
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCards.map((card) => (
              <div
                key={card.id}
                className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition flex flex-col"
              >
                {editingCardId === card.id ? (
                  <div className="space-y-3 flex-1">
                    <select
                      value={editingCardData.card_type || ''}
                      onChange={(e) =>
                        setEditingCardData({
                          ...editingCardData,
                          card_type: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                    >
                      {CARD_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {CARD_TYPE_LABELS[type]}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={editingCardData.title || ''}
                      onChange={(e) =>
                        setEditingCardData({
                          ...editingCardData,
                          title: e.target.value,
                        })
                      }
                      placeholder="タイトル"
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                    />
                    <textarea
                      value={editingCardData.content || ''}
                      onChange={(e) =>
                        setEditingCardData({
                          ...editingCardData,
                          content: e.target.value,
                        })
                      }
                      placeholder="内容"
                      rows={2}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateCard(card.id)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-3 rounded flex items-center justify-center gap-1 transition text-sm"
                      >
                        <Save size={14} />
                        保存
                      </button>
                      <button
                        onClick={() => {
                          setEditingCardId(null);
                          setEditingCardData({});
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
                      <span
                        className={`inline-block ${CARD_TYPE_COLORS[card.card_type]} text-white text-xs font-semibold px-2 py-1 rounded`}
                      >
                        {CARD_TYPE_LABELS[card.card_type]}
                      </span>
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-2">
                      {card.title}
                    </h4>
                    <p className="text-slate-300 text-sm mb-3 flex-1">
                      {card.content}
                    </p>
                    {card.assigned_to_character_id && (
                      <p className="text-xs text-slate-400 mb-3">
                        <strong>割り当て先：</strong>{' '}
                        {characters.find((c) => c.id === card.assigned_to_character_id)
                          ?.name || 'Unknown'}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingCardId(card.id);
                          setEditingCardData(card);
                        }}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded flex items-center justify-center gap-1 transition text-sm"
                      >
                        <Edit2 size={14} />
                        編集
                      </button>
                      <button
                        onClick={() => handleDeleteCard(card.id)}
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
