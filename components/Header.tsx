import React from 'react';
import { Folder } from '../types';
import { ArrowLeftIcon, ChevronRightIcon } from './icons';
import { SortControls } from './SortControls';

type SortKey = 'name' | 'size';
type SortOrder = 'asc' | 'desc';

interface HeaderProps {
  breadcrumbs: Folder[];
  onNavigateBack: () => void;
  onNavigateToCrumb: (index: number) => void;
  isRoot: boolean;
  sortKey: SortKey;
  sortOrder: SortOrder;
  onSortChange: (key: SortKey, order: SortOrder) => void;
}

export const Header: React.FC<HeaderProps> = ({ breadcrumbs, onNavigateBack, onNavigateToCrumb, isRoot, sortKey, sortOrder, onSortChange }) => {
  return (
    <header className="sticky top-0 bg-gray-900/80 backdrop-blur-sm z-10 p-4 border-b border-gray-700">
      <div className="max-w-7xl mx-auto flex items-center justify-between space-x-4">
        <div className="flex items-center space-x-4 min-w-0">
          {!isRoot && (
            <button 
              onClick={onNavigateBack}
              className="p-2 rounded-full hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 flex-shrink-0"
              aria-label="Go back"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
          )}
          <nav className="flex items-center text-sm md:text-base text-gray-400 overflow-x-auto whitespace-nowrap min-w-0">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.id}>
                <button 
                  onClick={() => onNavigateToCrumb(index)}
                  className={`px-2 py-1 rounded-md transition-colors truncate ${index === breadcrumbs.length - 1 ? 'text-white font-semibold' : 'hover:bg-gray-700'}`}
                >
                  {crumb.name}
                </button>
                {index < breadcrumbs.length - 1 && (
                  <ChevronRightIcon className="w-5 h-5 text-gray-600 flex-shrink-0" />
                )}
              </React.Fragment>
            ))}
          </nav>
        </div>
        <div className="flex-shrink-0">
          <SortControls sortKey={sortKey} sortOrder={sortOrder} onSortChange={onSortChange} />
        </div>
      </div>
    </header>
  );
};