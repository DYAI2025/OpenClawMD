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
  
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = index;
    if (e.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
    else if (e.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') nextIndex = 0;
    else if (e.key === 'End') nextIndex = tabs.length - 1;
    else return;
    e.preventDefault();
    handleTabChange(tabs[nextIndex].id);
    (e.currentTarget.parentElement?.children[nextIndex] as HTMLElement)?.focus();
  };

  return (
    <div className="w-full">
      {/* Tab List */}
      <div role="tablist" className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-thin">
        {tabs.map((tab, index) => {
          const isActive = tab.id === activeTab;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => handleTabChange(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-[box-shadow,color] duration-250 ease-clay focus:outline-none focus-visible:ring-2 focus-visible:ring-clay-coral/50',
                isActive
                  ? 'bg-clay-mint text-clay-charcoal shadow-clay-inset'
                  : 'bg-clay-base text-clay-charcoal/70 shadow-clay hover:shadow-clay-lifted hover:text-clay-charcoal'
              )}
            >
              {tab.icon && <span className="w-4 h-4" aria-hidden="true">{tab.icon}</span>}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div role="tabpanel" id={`tabpanel-${activeTab}`} className="bg-clay-base rounded-xl shadow-clay border border-white/50 dark:border-white/[0.06] p-6">
        <div className="animate-scale-in">
          {activeTabData?.content}
        </div>
      </div>
    </div>
  );
};
