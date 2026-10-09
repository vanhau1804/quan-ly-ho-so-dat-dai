'use client';

import React from 'react';
import { LandRecord } from '@/types';
import {
  RECORD_TYPE_CONFIG,
  RECORD_STATUS_CONFIG,
} from '@/constants/documentRequirements';
import {
  Eye,
  Edit2,
  Trash2,
  FileCheck2,
} from 'lucide-react';

import { User } from '@/types';

interface RecordTableProps {
  records: LandRecord[];
  currentUser?: User;
  onViewDetail: (record: LandRecord) => void;
  onEdit: (record: LandRecord) => void;
  onDelete: (id: string) => void;
}

export const RecordTable: React.FC<RecordTableProps> = ({
  records,
  currentUser,
  onViewDetail,
  onEdit,
  onDelete,
}) => {
  const formatVND = (val: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const [today, setToday] = React.useState<Date | null>(null);
  React.useEffect(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToday(d);
  }, []);

    const getDeadlineStatus = (expectedReturnDate?: string, status?: string) => {
    if (!today || !expectedReturnDate || status === 'hoan_thanh' || status === 'da_tra_khach') {
      return null;
    }
    const target = new Date(expectedReturnDate);
    const diffDays = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        text: `Quá hạn ${Math.abs(diffDays)} ngày`,
        className: 'text-rose-600 font-medium',
      };
    }
    if (diffDays === 0) {
      return {
        text: 'Hạn trả: Hôm nay',
        className: 'text-amber-600 font-medium',
      };
    }
    if (diffDays <= 3) {
      return {
        text: `Còn ${diffDays} ngày`,
        className: 'text-amber-600',
      };
    }
    return {
      text: `Hẹn: ${expectedReturnDate}`,
      className: 'text-slate-500',
    };
  };

  if (records.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
        <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 mb-3">
          <FileCheck2 className="h-8 w-8" />
        </div>
        <h3 className="text-base font-semibold text-slate-800">Không tìm thấy hồ sơ nào</h3>
        <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
          Không có kết quả khớp với điều kiện tìm kiếm hoặc bộ lọc hiện tại. Hãy thử thay đổi từ khóa hoặc tạo mới.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase font-medium text-slate-500 tracking-wider">
            <tr>
              <th className="py-4 px-5">Mã hồ sơ</th>
              <th className="py-4 px-5">Khách hàng</th>
              <th className="py-4 px-5">Loại hồ sơ</th>
              <th className="py-4 px-5">Thông tin thửa đất</th>
              <th className="py-4 px-5">Giấy tờ nộp</th>
              <th className="py-4 px-5">Tiến độ & Hẹn trả</th>
              <th className="py-4 px-5">Tài chính</th>
              <th className="py-4 px-5 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {records.map((r) => {
              const typeCfg = RECORD_TYPE_CONFIG[r.recordType];
              const statusCfg = RECORD_STATUS_CONFIG[r.status];
              const totalDocs = r.documents.length;
              const submittedDocs = r.documents.filter((d) => d.submitted).length;
              const deadline = getDeadlineStatus(r.expectedReturnDate, r.status);

              return (
                <tr
                  key={r.id}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  {/* Cột 1: Mã hồ sơ */}
                  <td className="py-4 px-5 whitespace-nowrap">
                    <button
                      onClick={() => onViewDetail(r)}
                      className="font-medium text-slate-900 hover:text-blue-600 transition-colors"
                      title="Nhấp để xem chi tiết hồ sơ"
                    >
                      {r.id}
                    </button>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {r.receivedDate}
                    </div>
                  </td>

                  {/* Cột 2: Khách hàng */}
                  <td className="py-4 px-5">
                    <div className="font-medium text-slate-900">
                      {r.customerName}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {r.customerPhone}
                    </div>
                  </td>

                  {/* Cột 3: Loại hồ sơ */}
                  <td className="py-4 px-5">
                    <div className="text-sm text-slate-800">
                      {typeCfg?.label || r.recordType}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      PT: {r.assignedOfficer || 'Chưa gán'}
                    </div>
                  </td>

                  {/* Cột 4: Thửa đất */}
                  <td className="py-4 px-5">
                    <div className="text-sm text-slate-900">
                      Thửa {r.plotNumber || '—'} / Tờ {r.mapSheetNumber || '—'}
                      {r.area > 0 && <span className="ml-1 text-slate-500">({r.area}m²)</span>}
                    </div>
                    <div className="text-xs text-slate-500 line-clamp-1 mt-0.5" title={r.landAddress}>
                      {r.landAddress || '—'}
                    </div>
                  </td>

                  {/* Cột 5: Giấy tờ nộp */}
                  <td className="py-4 px-5 whitespace-nowrap">
                    <div className="text-sm text-slate-800">
                      {submittedDocs}/{totalDocs}
                    </div>
                    <div className={`text-xs mt-0.5 ${submittedDocs === totalDocs ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {submittedDocs === totalDocs ? 'Đủ giấy tờ' : `Thiếu ${totalDocs - submittedDocs} mục`}
                    </div>
                  </td>

                  {/* Cột 6: Tiến độ & Hạn trả */}
                  <td className="py-4 px-5 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span className={`h-2 w-2 rounded-full ${statusCfg?.dotClass || 'bg-slate-400'}`} />
                      <span className="text-sm text-slate-800">
                        {statusCfg?.label || r.status}
                      </span>
                    </div>
                    {deadline && (
                      <div className={`text-xs mt-0.5 ${deadline.className}`}>
                        {deadline.text}
                      </div>
                    )}
                  </td>

                  {/* Cột 7: Tài chính */}
                  <td className="py-4 px-5 whitespace-nowrap">
                    <div className="text-sm text-slate-800">
                      {formatVND(r.paidAmount || 0)}
                    </div>
                    {r.remainingAmount > 0 ? (
                      <div className="text-xs text-rose-600 mt-0.5">
                        Nợ: {formatVND(r.remainingAmount)}
                      </div>
                    ) : (
                      <div className="text-xs text-emerald-600 mt-0.5">
                        Tất toán
                      </div>
                    )}
                  </td>

                  {/* Cột 8: Thao tác */}
                  <td className="py-4 px-5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onViewDetail(r)}
                        title="Xem chi tiết"
                        className="text-slate-400 hover:text-blue-600 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onEdit(r)}
                        title="Chỉnh sửa"
                        className="text-slate-400 hover:text-amber-600 transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      {(currentUser?.role === 'admin' || currentUser?.role === 'manager') && (
                        <button
                          onClick={() => {
                            if (confirm(`Bạn có chắc chắn muốn xóa hồ sơ ${r.id}?`)) {
                              onDelete(r.id);
                            }
                          }}
                          title="Xóa"
                          className="text-slate-400 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
