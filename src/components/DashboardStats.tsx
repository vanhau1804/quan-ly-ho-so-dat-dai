'use client';

import React from 'react';
import { LandRecord } from '@/types';
import {
  FolderKanban,
  Clock,
  AlertTriangle,
  BadgeDollarSign,
  TrendingUp,
} from 'lucide-react';

interface DashboardStatsProps {
  records: LandRecord[];
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ records }) => {
  const total = records.length;
  const inProgress = records.filter(
    (r) => r.status === 'dang_xu_ly' || r.status === 'cho_thue' || r.status === 'tiep_nhan'
  ).length;
  const waitingDocuments = records.filter((r) => r.status === 'cho_bo_sung').length;
  const completed = records.filter((r) => r.status === 'hoan_thanh' || r.status === 'da_tra_khach').length;

  // Tính hồ sơ sắp đến hạn hoặc quá hạn an toàn cho Next.js SSR/prerender
  const [today, setToday] = React.useState<Date | null>(null);
  React.useEffect(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToday(d);
  }, []);

  const urgentOrOverdue = React.useMemo(() => {
    if (!today) return 0;
    return records.filter((r) => {
      if (r.status === 'hoan_thanh' || r.status === 'da_tra_khach' || !r.expectedReturnDate) {
        return false;
      }
      const expected = new Date(r.expectedReturnDate);
      const diffDays = Math.ceil((expected.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays <= 3; // Quá hạn hoặc còn <= 3 ngày
    }).length;
  }, [records, today]);

  // Tổng hợp tài chính
  const totalServiceFee = records.reduce((sum, r) => sum + (r.serviceFee || 0), 0);
  const totalPaid = records.reduce((sum, r) => sum + (r.paidAmount || 0), 0);
  const totalRemaining = records.reduce((sum, r) => sum + (r.remainingAmount || 0), 0);

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Thẻ 1: Tổng hồ sơ */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Tổng số hồ sơ
            </p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{total}</h3>
          </div>
          <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <FolderKanban className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-3 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
            <TrendingUp className="h-3.5 w-3.5" />
            {completed} Hoàn thành
          </span>
          <span className="text-slate-300">•</span>
          <span>{inProgress} Đang thụ lý</span>
        </div>
      </div>

      {/* Thẻ 2: Đang xử lý */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Đang giải quyết
            </p>
            <h3 className="text-2xl font-bold text-amber-600 mt-1">{inProgress}</h3>
          </div>
          <div className="h-10 w-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3 text-xs text-slate-500 flex items-center justify-between">
          <span>Tại VPĐKĐĐ / Thuế</span>
          {waitingDocuments > 0 && (
            <span className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-600 font-medium border border-rose-200">
              {waitingDocuments} chờ bổ sung
            </span>
          )}
        </div>
      </div>

      {/* Thẻ 3: Cảnh báo hạn hẹn trả */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Sắp / Quá hạn hẹn trả
            </p>
            <h3
              className={`text-2xl font-bold mt-1 ${
                urgentOrOverdue > 0 ? 'text-rose-600' : 'text-slate-900'
              }`}
            >
              {urgentOrOverdue}
            </h3>
          </div>
          <div
            className={`h-10 w-10 rounded-lg flex items-center justify-center ${
              urgentOrOverdue > 0
                ? 'bg-rose-50 text-rose-600 animate-pulse'
                : 'bg-slate-50 text-slate-400'
            }`}
          >
            <AlertTriangle className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3 text-xs text-slate-500">
          {urgentOrOverdue > 0 ? (
            <span className="text-rose-600 font-medium">Cần đôn đốc giải quyết khẩn cấp</span>
          ) : (
            <span className="text-emerald-600 font-medium">Tất cả hồ sơ đều đúng hạn</span>
          )}
        </div>
      </div>

      {/* Thẻ 4: Tài chính & Công nợ */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Công nợ cần thu
            </p>
            <h3 className="text-xl font-bold text-indigo-700 mt-1">
              {formatVND(totalRemaining)}
            </h3>
          </div>
          <div className="h-10 w-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <BadgeDollarSign className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3 text-xs text-slate-500 flex justify-between">
          <span>Đã thu: {formatVND(totalPaid)}</span>
          <span className="text-slate-400">/ {formatVND(totalServiceFee)}</span>
        </div>
      </div>
    </div>
  );
};
