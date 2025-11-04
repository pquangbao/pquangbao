import React from 'react';
import { FilterIcon } from './icons/Icons';
import { User } from '../types';

interface FilterProps {
  filters: {
    requester: string;
    supplier: string;
    startDate: string;
    endDate: string;
  };
  onFilterChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onClearFilters: () => void;
  users: User[];
  suppliers: string[];
  currentUser: User;
}

const Filter: React.FC<FilterProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  users,
  suppliers,
  currentUser,
}) => {
  const isPrivilegedUser = currentUser.role === 'Manager' || currentUser.role === 'Admin';
  const requesters = users.map(u => u.name);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <FilterIcon className="h-5 w-5 mr-2 text-gray-500" />
        Bộ Lọc Đơn Hàng
      </h2>
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${isPrivilegedUser ? 'lg:grid-cols-4' : 'lg:grid-cols-2'} gap-4`}>
        {isPrivilegedUser && (
          <>
            <div>
              <label htmlFor="requesterFilter" className="block text-sm font-medium text-gray-700">Người Yêu Cầu</label>
              <input
                type="text"
                id="requesterFilter"
                name="requester"
                list="requesters-list"
                value={filters.requester}
                onChange={onFilterChange}
                className="mt-1 block w-full bg-white text-black border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Tất cả"
                aria-label="Filter by requester"
              />
              <datalist id="requesters-list">
                {requesters.map(r => <option key={r} value={r} />)}
              </datalist>
            </div>
            <div>
              <label htmlFor="supplierFilter" className="block text-sm font-medium text-gray-700">Nhà Cung Cấp</label>
              <select
                id="supplierFilter"
                name="supplier"
                value={filters.supplier}
                onChange={onFilterChange}
                className="mt-1 block w-full bg-white text-black border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                aria-label="Filter by supplier"
              >
                <option value="">Tất cả</option>
                {suppliers.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </>
        )}
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Từ Ngày</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={filters.startDate}
            onChange={onFilterChange}
            className="mt-1 block w-full bg-white text-black border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            aria-label="Filter start date"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">Đến Ngày</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={filters.endDate}
            onChange={onFilterChange}
            min={filters.startDate}
            className="mt-1 block w-full bg-white text-black border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            aria-label="Filter end date"
          />
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <button
          onClick={onClearFilters}
          className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          Xóa bộ lọc
        </button>
      </div>
    </div>
  );
};

export default Filter;