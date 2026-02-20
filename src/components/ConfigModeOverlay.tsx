import { useState, useEffect } from 'react';
import { X, Plus, Trash2, ArrowUp, ArrowDown, Download, Upload, RotateCcw } from 'lucide-react';
import { ClayButton, ClayCard } from '@/components/clay';
import { cn } from '@/lib/utils';

interface ConfigItem {
  id: string;
  label: string;
  url: string;
  style: 'round' | 'pill' | 'blob';
}

interface ConfigModeOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const STORAGE_KEY = 'openclaw-config-mode';

const defaultItems: ConfigItem[] = [
  { id: '1', label: 'Documentation', url: 'https://docs.openclaw.dev', style: 'pill' },
  { id: '2', label: 'GitHub', url: 'https://github.com/openclaw', style: 'round' },
  { id: '3', label: 'Support', url: 'https://support.openclaw.dev', style: 'blob' },
];

export const ConfigModeOverlay: React.FC<ConfigModeOverlayProps> = ({
  isOpen,
  onClose,
}) => {
  const [items, setItems] = useState<ConfigItem[]>([]);
  const [jsonImport, setJsonImport] = useState('');
  const [showImport, setShowImport] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setItems(parsed.items || defaultItems);
      } catch {
        setItems(defaultItems);
      }
    } else {
      setItems(defaultItems);
    }
  }, []);

  // Save to localStorage when items change
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ items }));
    }
  }, [items]);

  const addItem = () => {
    const newItem: ConfigItem = {
      id: Date.now().toString(),
      label: 'New Link',
      url: 'https://',
      style: 'pill',
    };
    setItems(prev => [...prev, newItem]);
  };

  const updateItem = (id: string, updates: Partial<ConfigItem>) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const moveItem = (id: string, direction: 'up' | 'down') => {
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return;
    
    if (direction === 'up' && index > 0) {
      const newItems = [...items];
      [newItems[index], newItems[index - 1]] = [newItems[index - 1], newItems[index]];
      setItems(newItems);
    } else if (direction === 'down' && index < items.length - 1) {
      const newItems = [...items];
      [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
      setItems(newItems);
    }
  };

  const resetToDefaults = () => {
    if (confirm('Reset all items to defaults? This cannot be undone.')) {
      setItems(defaultItems);
    }
  };

  const exportJson = () => {
    const data = JSON.stringify({ items }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'openclaw-config.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importJson = () => {
    try {
      const parsed = JSON.parse(jsonImport);
      if (parsed.items && Array.isArray(parsed.items)) {
        setItems(parsed.items);
        setJsonImport('');
        setShowImport(false);
        alert('Configuration imported successfully');
      } else {
        alert('Invalid configuration format');
      }
    } catch {
      alert('Invalid JSON');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-clay-charcoal/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <ClayCard padding="none" className="flex flex-col max-h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-clay-stone/30">
            <div>
              <h2 className="text-xl font-bold text-clay-charcoal">
                Config Mode
              </h2>
              <p className="text-sm text-clay-charcoal/60">
                Customize navigation links and button styles
              </p>
            </div>
            <ClayButton
              variant="round"
              color="stone"
              size="sm"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </ClayButton>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Actions */}
            <div className="flex flex-wrap gap-2 mb-6">
              <ClayButton
                variant="pill"
                color="mint"
                size="sm"
                onClick={addItem}
              >
                <Plus className="w-4 h-4" />
                Add Link
              </ClayButton>
              <ClayButton
                variant="pill"
                color="stone"
                size="sm"
                onClick={exportJson}
              >
                <Download className="w-4 h-4" />
                Export JSON
              </ClayButton>
              <ClayButton
                variant="pill"
                color="stone"
                size="sm"
                onClick={() => setShowImport(!showImport)}
              >
                <Upload className="w-4 h-4" />
                Import
              </ClayButton>
              <ClayButton
                variant="pill"
                color="sand"
                size="sm"
                onClick={resetToDefaults}
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </ClayButton>
            </div>

            {/* Import Area */}
            {showImport && (
              <div className="mb-6 p-4 bg-clay-sand/50 rounded-xl">
                <textarea
                  value={jsonImport}
                  onChange={(e) => setJsonImport(e.target.value)}
                  placeholder="Paste JSON configuration here..."
                  className="clay-input w-full h-32 text-sm font-mono mb-3"
                />
                <ClayButton
                  variant="pill"
                  color="mint"
                  size="sm"
                  onClick={importJson}
                >
                  Import Configuration
                </ClayButton>
              </div>
            )}

            {/* Items List */}
            <div className="space-y-3">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="p-4 bg-clay-base rounded-xl shadow-clay border border-white/50"
                >
                  <div className="grid sm:grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="text-xs text-clay-charcoal/60 mb-1 block">
                        Label
                      </label>
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) => updateItem(item.id, { label: e.target.value })}
                        className="clay-input w-full text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-clay-charcoal/60 mb-1 block">
                        URL
                      </label>
                      <input
                        type="url"
                        value={item.url}
                        onChange={(e) => updateItem(item.id, { url: e.target.value })}
                        className="clay-input w-full text-sm"
                      />
                    </div>
                  </div>

                  {/* Style Selection */}
                  <div className="mb-3">
                    <label className="text-xs text-clay-charcoal/60 mb-2 block">
                      Button Style
                    </label>
                    <div className="flex gap-2">
                      {(['round', 'pill', 'blob'] as const).map((style) => (
                        <button
                          key={style}
                          type="button"
                          onClick={() => updateItem(item.id, { style })}
                          className={cn(
                            'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                            item.style === style
                              ? 'bg-clay-mint shadow-clay-inset text-clay-charcoal'
                              : 'bg-clay-stone/50 text-clay-charcoal/60 hover:bg-clay-stone'
                          )}
                        >
                          {style.charAt(0).toUpperCase() + style.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-clay-stone/30">
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => moveItem(item.id, 'up')}
                        disabled={index === 0}
                        className="p-1.5 rounded-lg hover:bg-clay-stone/50 disabled:opacity-30 transition-colors"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveItem(item.id, 'down')}
                        disabled={index === items.length - 1}
                        className="p-1.5 rounded-lg hover:bg-clay-stone/50 disabled:opacity-30 transition-colors"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteItem(item.id)}
                      className="p-1.5 rounded-lg hover:bg-clay-coral/20 text-clay-coral transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {items.length === 0 && (
              <div className="text-center py-12">
                <p className="text-clay-charcoal/50">
                  No items yet. Click &quot;Add Link&quot; to get started.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-clay-stone/30">
            <ClayButton
              variant="blob"
              color="coral"
              className="w-full justify-center"
              onClick={onClose}
            >
              Save & Close
            </ClayButton>
          </div>
        </ClayCard>
      </div>
    </div>
  );
};
