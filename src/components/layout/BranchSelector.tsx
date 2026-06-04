import { useState, useEffect, useRef } from 'react';
import { useBranchStore } from '@/features/gym';
import { Building2, ChevronDown, Check } from 'lucide-react';

export function BranchSelector() {
  const { branches, selectedBranch, setSelectedBranch, isLoading } = useBranchStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (isLoading && branches.length === 0) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-[var(--border-default)] bg-[var(--bg-hover)] animate-pulse">
        <Building2 size={14} className="text-[var(--text-muted)]" />
        <span className="text-[12px] text-[var(--text-muted)] font-medium">Loading branches...</span>
      </div>
    );
  }

  if (branches.length === 0) {
    return null;
  }

  const hasMultipleBranches = branches.length >= 2;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selector Trigger Button */}
      <button
        onClick={() => hasMultipleBranches && setIsOpen(!isOpen)}
        disabled={!hasMultipleBranches}
        className={`flex items-center gap-2.5 px-3 py-1.5 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-primary)] transition-all duration-200 select-none ${
          hasMultipleBranches 
            ? 'hover:bg-[var(--bg-hover)] cursor-pointer' 
            : 'cursor-default'
        }`}
      >
        <Building2 size={14} className="text-[var(--accent)] flex-shrink-0" />
        <div className="text-left min-w-[100px] max-w-[160px]">
          <div className="text-[12px] font-medium truncate leading-tight">
            {selectedBranch?.name || 'Select Branch'}
          </div>
          {selectedBranch?.city && (
            <div className="text-[9px] text-[var(--text-muted)] font-normal truncate">
              {selectedBranch.city}
            </div>
          )}
        </div>
        {hasMultipleBranches && (
          <ChevronDown 
            size={14} 
            className={`text-[var(--text-muted)] transition-transform duration-200 flex-shrink-0 ${
              isOpen ? 'transform rotate-180 text-[var(--accent)]' : ''
            }`} 
          />
        )}
      </button>

      {/* Floating Dropdown List */}
      {isOpen && hasMultipleBranches && (
        <div 
          className="absolute right-0 mt-1.5 w-64 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-surface)] shadow-lg z-50 overflow-hidden animate-fade-in"
          style={{ 
            boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.15)',
            backdropFilter: 'blur(8px)'
          }}
        >
          <div className="px-3 py-2 border-b border-[var(--border-default)] bg-[var(--bg-hover)]">
            <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]">
              Select Branch / Location
            </span>
          </div>
          
          <div className="max-h-60 overflow-y-auto py-1">
            {branches.map((branch) => {
              const isSelected = selectedBranch?.id === branch.id;
              return (
                <button
                  key={branch.id}
                  onClick={() => {
                    setSelectedBranch(branch);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[var(--bg-hover)] transition-colors duration-150 group`}
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <div className={`text-[12px] font-medium truncate leading-tight ${
                      isSelected ? 'text-[var(--accent)] font-semibold' : 'text-[var(--text-primary)]'
                    }`}>
                      {branch.name}
                    </div>
                    {branch.city && (
                      <div className="text-[10px] text-[var(--text-muted)] truncate mt-0.5">
                        {branch.city}
                      </div>
                    )}
                  </div>
                  {isSelected && (
                    <Check size={14} className="text-[var(--accent)] flex-shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
