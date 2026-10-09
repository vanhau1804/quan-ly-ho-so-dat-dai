'use client';

import React from 'react';
import { Search, X, Filter } from 'lucide-react';
import { RecordType, RecordStatus } from '@/types';
import { RECORD_TYPE_CONFIG, RECORD_STATUS_CONFIG } from '@/constants/documentRequirements';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedType: RecordType | 'all';
  onTypeChange: (type: RecordType | 'all') => void;
  selectedStatus: RecordStatus | 'all';
  onStatusChange: (status: RecordStatus | 'all') => void;
  officers: string[];
  selectedOfficer: string;
  onOfficerChange: (officer: string) => void;
  onResetFilters: () => void;
  totalFiltered: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedStatus,
  onStatusChange,
  officers,
  selectedOfficer,
  onOfficerChange,
  onResetFilters,
  totalFiltered,
}) => {
  const hasActiveFilters =
    searchQuery !== '' ||
    selectedType !== 'all' ||
    selectedStatus !== 'all' ||
    selectedOfficer !== 'all';

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs mb-6">
      <div className="flex flex-col lg:flex-row gap-3">
        {/* Ô tìm kiếm từ khóa */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm theo Mã hồ sơ, Tên khách, SĐT, CCCD, Số thửa, Tờ BĐ..."
            className="block w-full pl-9 pr-8 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Lọc theo Loại hồ sơ */}
        <div className="w-full sm:w-auto min-w-[200px]">
          <select
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value as RecordType | 'all')}
            className="w-full py-2 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700"
          >
            <option value="all">Tất cả loại hồ sơ</option>
            {Object.entries(RECORD_TYPE_CONFIG).map(([key, item]) => (
              <option key={key} value={key}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        {/* Lọc theo Trạng thái */}
        <div className="w-full sm:w-auto min-w-[180px]">
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value as RecordStatus | 'all')}
            className="w-full py-2 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700"
          >
            <option value="all">Tất cả trạng thái</option>
            {Object.entries(RECORD_STATUS_CONFIG).map(([key, item]) => (
              <option key={key} value={key}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        {/* Lọc theo Người phụ trách */}
        {officers.length > 0 && (
          <div className="w-full sm:w-auto min-w-[180px]">
            <select
              value={selectedOfficer}
              onChange={(e) => onOfficerChange(e.target.value)}
              className="w-full py-2 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700"
            >
              <option value="all">Tất cả cán bộ phụ trách</option>
              {officers.map((off) => (
                <option key={off} value={off}>
                  {off}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Nút Xóa bộ lọc */}
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
          >
            <Filter className="h-3.5 w-3.5" />
            <span>Xóa lọc</span>
          </button>
        )}
      </div>

      <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
        <span>
          Đang hiển thị <strong className="text-slate-800 font-semibold">{totalFiltered}</strong> hồ sơ
        </span>
      </div>
    </div>
  );
};
