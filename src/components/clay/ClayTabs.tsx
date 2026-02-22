import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

interface ClayTabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
}

export const ClayTabs: React.FC<ClayTabsProps> = ({
  tabs,
  defaultTab,
  onChange,
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);
  
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };
  
  const activeTabData = tabs.find(t => t.id === activeTab);
  
  return (
    <div className="w-full">
      {/* Tab List */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-thin">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-250 ease-clay focus:outline-none focus-visible:ring-2 focus-visible:ring-clay-coral/50',
                isActive 
                  ? 'bg-clay-mint text-clay-charcoal shadow-clay-inset' 
                  : 'bg-clay-base text-clay-charcoal/70 shadow-clay hover:shadow-clay-lifted hover:text-clay-charcoal'
              )}
            >
              {tab.icon && <span className="w-4 h-4">{tab.icon}</span>}
              {tab.label}
            </button>
          );
        })}
      </div>
      
      {/* Tab Content */}
      <div className="bg-clay-base rounded-xl shadow-clay border border-white/50 dark:border-white/[0.06] p-6">
        <div className="animate-scale-in">
          {activeTabData?.content}
        </div>
      </div>
    </div>
  );
};
