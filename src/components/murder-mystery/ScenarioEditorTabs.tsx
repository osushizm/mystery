import React, { useState } from 'react';
import { Settings, Users, Clock, Tag } from 'lucide-react';
import ScenarioEditor from './ScenarioEditor';
import TimelineEditor from './TimelineEditor';
import CardManager from './CardManager';
import CharacterManager from './CharacterManager';

interface ScenarioEditorTabsProps {
  scenarioId: string;
}

export default function ScenarioEditorTabs({ scenarioId }: ScenarioEditorTabsProps) {
  const [activeTab, setActiveTab] = useState<'scenario' | 'characters' | 'timeline' | 'cards'>('scenario');

  const tabs = [
    { id: 'scenario', label: 'シナリオ基本情報', icon: Settings },
    { id: 'characters', label: 'キャラクター', icon: Users },
    { id: 'timeline', label: 'タイムライン', icon: Clock },
    { id: 'cards', label: 'カード管理', icon: Tag },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        <div className="flex border-b border-slate-700">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-4 font-semibold flex items-center justify-center gap-2 transition ${
                  isActive
                    ? 'bg-slate-700 text-white border-b-2 border-blue-600'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                <Icon size={18} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'scenario' && <ScenarioEditor scenarioId={scenarioId} />}
          {activeTab === 'characters' && <CharacterManager scenarioId={scenarioId} />}
          {activeTab === 'timeline' && <TimelineEditor scenarioId={scenarioId} />}
          {activeTab === 'cards' && <CardManager scenarioId={scenarioId} />}
        </div>
      </div>
    </div>
  );
}
