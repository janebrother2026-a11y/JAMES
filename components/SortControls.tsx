import React from 'react';
import { SortAscendingIcon, SortDescendingIcon } from './icons';

type SortKey = 'name' | 'size';
type SortOrder = 'asc' | 'desc';

interface SortControlsProps {
  sortKey: SortKey;
  sortOrder: SortOrder;
  onSortChange: (key: SortKey, order: SortOrder) => void;
}

export const SortControls: React.FC<SortControlsProps> = ({ sortKey, sortOrder, onSortChange }) => {
  const handleKeyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSortChange(e.target.value as SortKey, sortOrder);
  };

  const handleOrderToggle = () => {
    onSortChange(sortKey, sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="flex items-center space-x-2">
      <select
        value={sortKey}
        onChange={handleKeyChange}
        className="bg-gray-700 border border-gray-600 rounded-md text-white text-sm px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Sort by"
      >
        <option value="name">Sort by Name</option>
        <option value="size">Sort by Size</option>
      </select>
      <button
        onClick={handleOrderToggle}
        className="p-2 rounded-md hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
      >
        {sortOrder === 'asc' ? <SortAscendingIcon /> : <SortDescendingIcon className="transform scale-y-[-1]" />}
      </button>
    </div>
  );
};
