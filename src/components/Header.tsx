'use client';

import React from 'react';
import { User } from '@/types';
import {
  FileText,
  PlusCircle,
  FileSpreadsheet,
  Download,
  Upload,
  RefreshCw,
  LogOut,
  User as UserIcon,
} from 'lucide-react';

interface HeaderProps {
  onOpenCreateModal: () => void;
  onOpenImportModal: () => void;
  onExportExcel: () => void;
  onDownloadTemplate: () => void;
  onResetData: () => void;
  totalRecords: number;
  currentUser: User;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCreateModal,
  onOpenImportModal,
  onExportExcel,
  onDownloadTemplate,
  onResetData,
  totalRecords,
  currentUser,
  onLogout,
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
            
            {/* Hiển thị User */}
            <div className="flex items-center gap-2 px-3 py-1.5 mr-2 border-r border-slate-200">
              <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-200">
                <UserIcon className="h-4 w-4" />
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-slate-900">{currentUser.fullName}</div>
                <div className="text-[10px] uppercase font-semibold text-slate-500">
                  {currentUser.role === 'admin' ? 'Quản trị viên' : 
                   currentUser.role === 'manager' ? 'Quản lý' : 
                   'Chuyên viên'}
                </div>
              </div>
              <button
                onClick={onLogout}
                title="Đăng xuất"
                className="ml-2 p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>

            {(currentUser.role === 'admin' || currentUser.role === 'manager') && (
              <>
                <button
                  onClick={onResetData}
                  title="Khôi phục lại dữ liệu mẫu"
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
                >
                  <RefreshCw className="h-3.5 w-3.5 text-slate-500" />
                  <span className="hidden lg:inline">Dữ liệu mẫu</span>
                </button>

                <button
                  onClick={onDownloadTemplate}
                  title="Tải file Excel mẫu để nhập dữ liệu"
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors shadow-xs"
                >
                  <Download className="h-3.5 w-3.5 text-slate-500" />
                  <span className="hidden lg:inline">Mẫu Excel</span>
                </button>

                <button
                  onClick={onOpenImportModal}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors"
                >
                  <Upload className="h-3.5 w-3.5" />
                  <span className="hidden lg:inline">Nhập Excel</span>
                </button>
              </>
            )}

            <button
              onClick={onExportExcel}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-300 rounded-lg transition-colors"
            >
              <FileSpreadsheet className="h-3.5 w-3.5" />
              <span className="hidden lg:inline">Xuất Excel</span>
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
