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
  MapPin,
  Calendar,
  AlertCircle,
  Phone,
  CreditCard,
} from 'lucide-react';

interface RecordTableProps {
  records: LandRecord[];
  onViewDetail: (record: LandRecord) => void;
  onEdit: (record: LandRecord) => void;
  onDelete: (id: string) => void;
}

export const RecordTable: React.FC<RecordTableProps> = ({
  records,
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
        className: 'text-rose-700 bg-rose-50 border-rose-200 font-semibold',
      };
    }
    if (diffDays === 0) {
      return {
        text: 'Hạn trả: Hôm nay',
        className: 'text-amber-700 bg-amber-50 border-amber-200 font-semibold',
      };
    }
    if (diffDays <= 3) {
      return {
        text: `Còn ${diffDays} ngày`,
        className: 'text-amber-700 bg-amber-50 border-amber-200',
      };
    }
    return {
      text: `Hẹn: ${expectedReturnDate}`,
      className: 'text-slate-600 bg-slate-50 border-slate-200',
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
          <thead className="bg-slate-50/75 text-xs uppercase font-semibold text-slate-600 tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Mã hồ sơ</th>
              <th className="py-3.5 px-4">Khách hàng</th>
              <th className="py-3.5 px-4">Loại hồ sơ</th>
              <th className="py-3.5 px-4">Thông tin thửa đất</th>
              <th className="py-3.5 px-4">Giấy tờ nộp</th>
              <th className="py-3.5 px-4">Tiến độ & Hẹn trả</th>
              <th className="py-3.5 px-4">Tài chính</th>
              <th className="py-3.5 px-4 text-right">Thao tác</th>
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
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  {/* Cột 1: Mã hồ sơ */}
                  <td className="py-4 px-4 font-medium whitespace-nowrap">
                    <button
                      onClick={() => onViewDetail(r)}
                      className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors"
                      title="Nhấp để xem chi tiết hồ sơ"
                    >
                      {r.id}
                    </button>
                    <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{r.receivedDate}</span>
                    </div>
                  </td>

                  {/* Cột 2: Khách hàng */}
                  <td className="py-4 px-4">
                    <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                      <span>{r.customerName}</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 flex flex-col gap-0.5">
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3 text-slate-400" />
                        {r.customerPhone}
                      </span>
                      {r.customerIdNumber && (
                        <span className="flex items-center gap-1 text-[11px] text-slate-400">
                          <CreditCard className="h-3 w-3 text-slate-400" />
                          CCCD: {r.customerIdNumber}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Cột 3: Loại hồ sơ */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${
                        typeCfg?.badgeClass || 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {typeCfg?.label || r.recordType}
                    </span>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Phụ trách: {r.assignedOfficer || 'Chưa gán'}
                    </div>
                  </td>

                  {/* Cột 4: Thửa đất */}
                  <td className="py-4 px-4">
                    <div className="text-xs text-slate-900 font-medium flex items-center gap-2">
                      <span>
                        Thửa: <strong>{r.plotNumber || '—'}</strong>, Tờ:{' '}
                        <strong>{r.mapSheetNumber || '—'}</strong>
                      </span>
                      {r.area > 0 && (
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[11px] text-slate-600 font-semibold">
                          {r.area} m²
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 line-clamp-1 mt-0.5 flex items-center gap-1" title={r.landAddress}>
                      <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                      <span>{r.landAddress || 'Chưa cập nhật địa chỉ'}</span>
                    </div>
                  </td>

                  {/* Cột 5: Giấy tờ nộp */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-700">
                        {submittedDocs}/{totalDocs}
                      </span>
                      <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                        <div
                          className={`h-full rounded-full transition-all ${
                            submittedDocs === totalDocs
                              ? 'bg-emerald-500'
                              : submittedDocs > 0
                              ? 'bg-blue-500'
                              : 'bg-slate-300'
                          }`}
                          style={{
                            width: `${totalDocs > 0 ? (submittedDocs / totalDocs) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      {submittedDocs === totalDocs ? (
                        <span className="text-emerald-600 font-medium">Đủ giấy tờ</span>
                      ) : (
                        <span>Còn thiếu {totalDocs - submittedDocs} mục</span>
                      )}
                    </div>
                  </td>

                  {/* Cột 6: Tiến độ & Hạn trả */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          statusCfg?.dotClass || 'bg-slate-400'
                        }`}
                      />
                      <span
                        className={`inline-flex px-2 py-0.5 text-xs font-medium rounded border ${
                          statusCfg?.badgeClass || 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {statusCfg?.label || r.status}
                      </span>
                    </div>

                    {deadline && (
                      <div className="mt-1.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] border ${deadline.className}`}
                        >
                          <AlertCircle className="h-3 w-3" />
                          <span>{deadline.text}</span>
                        </span>
                      </div>
                    )}
                  </td>

                  {/* Cột 7: Tài chính */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="text-xs font-semibold text-slate-800">
                      Đã thu: {formatVND(r.paidAmount || 0)}
                    </div>
                    {r.remainingAmount > 0 ? (
                      <div className="text-[11px] text-rose-600 font-medium mt-0.5">
                        Nợ: {formatVND(r.remainingAmount)}
                      </div>
                    ) : (
                      <div className="text-[11px] text-emerald-600 font-medium mt-0.5">
                        ✓ Tất toán
                      </div>
                    )}
                  </td>

                  {/* Cột 8: Thao tác */}
                  <td className="py-4 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onViewDetail(r)}
                        title="Xem chi tiết"
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onEdit(r)}
                        title="Chỉnh sửa hồ sơ"
                        className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (
                            confirm(`Bạn có chắc chắn muốn xóa hồ sơ ${r.id} (${r.customerName})?`)
                          ) {
                            onDelete(r.id);
                          }
                        }}
                        title="Xóa hồ sơ"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
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
