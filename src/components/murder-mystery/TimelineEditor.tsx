import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Edit2, Save, X, Clock } from 'lucide-react';
import {
  getTimelines,
  createTimeline,
  deleteTimeline,
  updateTimeline,
} from '../../utils/api';

interface TimelineEvent {
  id: string;
  event_time: string;
  event_description: string;
}

interface TimelineEditorProps {
  scenarioId: string;
}

export default function TimelineEditor({ scenarioId }: TimelineEditorProps) {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEventTime, setNewEventTime] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [editingEventData, setEditingEventData] = useState<Partial<TimelineEvent>>({});

  useEffect(() => {
    loadTimelines();
  }, [scenarioId]);

  async function loadTimelines() {
    try {
      setLoading(true);
      const data = await getTimelines(scenarioId);
      // Sort by time
      const sorted = data.sort((a, b) => a.event_time.localeCompare(b.event_time));
      setEvents(sorted);
    } catch (error) {
      console.error('Failed to load timelines:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateEvent(e: React.FormEvent) {
    e.preventDefault();
    if (!newEventTime.trim() || !newEventDesc.trim()) return;

    try {
      await createTimeline(scenarioId, {
        event_time: newEventTime,
        event_description: newEventDesc,
      });
      setNewEventTime('');
      setNewEventDesc('');
      loadTimelines();
    } catch (error) {
      console.error('Failed to create timeline:', error);
    }
  }

  async function handleDeleteEvent(eventId: string) {
    if (!confirm('このイベントを削除してもよろしいですか？')) return;

    try {
      await deleteTimeline(scenarioId, eventId);
      loadTimelines();
    } catch (error) {
      console.error('Failed to delete timeline:', error);
    }
  }

  async function handleUpdateEvent(eventId: string) {
    try {
      await updateTimeline(scenarioId, eventId, editingEventData);
      setEditingEventId(null);
      setEditingEventData({});
      loadTimelines();
    } catch (error) {
      console.error('Failed to update timeline:', error);
    }
  }

  if (loading) {
    return <div className="text-center text-slate-300 py-8">読み込み中...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Create Event Form */}
      <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Clock size={20} />
          新しいイベントを追加
        </h3>
        <form onSubmit={handleCreateEvent} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                時刻
              </label>
              <input
                type="text"
                value={newEventTime}
                onChange={(e) => setNewEventTime(e.target.value)}
                placeholder="例：10:00、午前10時"
                className="w-full px-4 py-2 bg-slate-600 border border-slate-500 rounded text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                イベント説明
              </label>
              <input
                type="text"
                value={newEventDesc}
                onChange={(e) => setNewEventDesc(e.target.value)}
                placeholder="例：被害者が発見される"
                className="w-full px-4 py-2 bg-slate-600 border border-slate-500 rounded text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded flex items-center justify-center gap-2 transition"
          >
            <Plus size={20} />
            イベントを追加
          </button>
        </form>
      </div>

      {/* Timeline Events */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">タイムライン</h3>
        {events.length === 0 ? (
          <div className="text-center text-slate-400 py-8 bg-slate-800 rounded-lg border border-slate-700">
            タイムラインイベントがまだ登録されていません
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((event, index) => (
              <div
                key={event.id}
                className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition"
              >
                {editingEventId === event.id ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={editingEventData.event_time || ''}
                        onChange={(e) =>
                          setEditingEventData({
                            ...editingEventData,
                            event_time: e.target.value,
                          })
                        }
                        placeholder="時刻"
                        className="px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                      />
                      <input
                        type="text"
                        value={editingEventData.event_description || ''}
                        onChange={(e) =>
                          setEditingEventData({
                            ...editingEventData,
                            event_description: e.target.value,
                          })
                        }
                        placeholder="イベント説明"
                        className="px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateEvent(event.id)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded flex items-center justify-center gap-2 transition"
                      >
                        <Save size={16} />
                        保存
                      </button>
                      <button
                        onClick={() => {
                          setEditingEventId(null);
                          setEditingEventData({});
                        }}
                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded flex items-center justify-center gap-2 transition"
                      >
                        <X size={16} />
                        キャンセル
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="inline-block bg-blue-600 text-white font-semibold px-3 py-1 rounded text-sm">
                          {event.event_time}
                        </span>
                        <span className="text-slate-400">#{index + 1}</span>
                      </div>
                      <p className="text-white">{event.event_description}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => {
                          setEditingEventId(event.id);
                          setEditingEventData(event);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
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
