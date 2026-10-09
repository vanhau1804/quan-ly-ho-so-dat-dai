'use client';

import React from 'react';
import {
  FileText,
  PlusCircle,
  FileSpreadsheet,
  Download,
  Upload,
  RefreshCw,
} from 'lucide-react';

interface HeaderProps {
  onOpenCreateModal: () => void;
  onOpenImportModal: () => void;
  onExportExcel: () => void;
  onDownloadTemplate: () => void;
  onResetData: () => void;
  totalRecords: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCreateModal,
  onOpenImportModal,
  onExportExcel,
  onDownloadTemplate,
  onResetData,
  totalRecords,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4 gap-4">
          {/* Logo & Tiêu đề */}
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  Quản Lý Hồ Sơ Đất Đai
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Vercel Ready
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Theo dõi tiến độ, danh mục giấy tờ động & tài chính dịch vụ nhà đất ({totalRecords} hồ sơ)
              </p>
            </div>
          </div>

          {/* Nhóm nút tác vụ nhanh */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onResetData}
              title="Khôi phục lại dữ liệu mẫu"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5 text-slate-500" />
              <span>Dữ liệu mẫu</span>
            </button>

            <button
              onClick={onDownloadTemplate}
              title="Tải file Excel mẫu để nhập dữ liệu"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors shadow-xs"
            >
              <Download className="h-3.5 w-3.5 text-slate-500" />
              <span>Mẫu Excel</span>
            </button>

            <button
              onClick={onOpenImportModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors"
            >
              <Upload className="h-3.5 w-3.5" />
              <span>Nhập Excel</span>
            </button>

            <button
              onClick={onExportExcel}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-300 rounded-lg transition-colors"
            >
              <FileSpreadsheet className="h-3.5 w-3.5" />
              <span>Xuất Excel</span>
            </button>

            <button
              onClick={onOpenCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg transition-all shadow-md shadow-blue-500/25"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Tạo Hồ Sơ Mới</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
