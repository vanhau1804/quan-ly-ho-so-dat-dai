'use client';

import React, { useState } from 'react';
import { LandRecord } from '@/types';
import {
  RECORD_TYPE_CONFIG,
  RECORD_STATUS_CONFIG,
} from '@/constants/documentRequirements';
import {
  X,
  Printer,
  Edit,
  User,
  MapPin,
  Paperclip,
  Activity,
  DollarSign,
  FileText,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';

interface RecordDetailModalProps {
  record: LandRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (record: LandRecord) => void;
  onUpdateStatus: (id: string, newStatus: LandRecord['status'], note: string) => void;
}

export const RecordDetailModal: React.FC<RecordDetailModalProps> = ({
  record,
  isOpen,
  onClose,
  onEdit,
  onUpdateStatus,
}) => {
  const [newLogNote, setNewLogNote] = useState('');
  const [selectedPreviewFile, setSelectedPreviewFile] = useState<{
    name: string;
    dataUrl?: string;
    type: string;
  } | null>(null);

  if (!isOpen || !record) return null;

  const typeCfg = RECORD_TYPE_CONFIG[record.recordType];
  const statusCfg = RECORD_STATUS_CONFIG[record.status];

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleQuickAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogNote.trim()) return;
    onUpdateStatus(record.id, record.status, newLogNote.trim());
    setNewLogNote('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-bold px-3 py-1 rounded-md bg-blue-100 text-blue-800 border border-blue-200">
              {record.id}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  {record.customerName}
                </h2>
                <span
                  className={`px-2 py-0.5 text-xs font-semibold rounded-md border ${
                    typeCfg?.badgeClass || 'bg-slate-100'
                  }`}
                >
                  {typeCfg?.label}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Ngày tiếp nhận: {record.receivedDate} • Người phụ trách: {record.assignedOfficer}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              title="In phiếu thông tin hồ sơ"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5 text-slate-500" />
              <span>In phiếu</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onEdit(record);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors cursor-pointer"
            >
              <Edit className="h-3.5 w-3.5" />
              <span>Chỉnh sửa</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Nội dung chi tiết */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Thanh trạng thái nổi bật */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span
                className={`h-3 w-3 rounded-full ${
                  statusCfg?.dotClass || 'bg-slate-400'
                }`}
              />
              <div>
                <span className="text-xs uppercase font-semibold text-slate-400">
                  Trạng thái hiện tại
                </span>
                <div className="text-sm font-bold text-slate-900 mt-0.5">
                  {statusCfg?.label}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs text-slate-600">
              <div>
                <span className="text-slate-400 block text-[11px]">Cơ quan thụ lý:</span>
                <span className="font-semibold text-slate-800">{record.processingAgency}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Ngày hẹn trả:</span>
                <span className="font-semibold text-slate-800">
                  {record.expectedReturnDate || 'Chưa có giấy hẹn'}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Khối 1: Thông tin Khách hàng */}
            <div className="p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-800 font-bold text-xs uppercase tracking-wider">
                <User className="h-4 w-4 text-blue-600" />
                <span>1. Thông tin Khách hàng</span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Họ và tên:</span>
                  <span className="font-semibold text-slate-900">{record.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Số CCCD / MST:</span>
                  <span className="font-mono font-medium text-slate-800">{record.customerIdNumber || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Số điện thoại:</span>
                  <span className="font-medium text-blue-600">{record.customerPhone}</span>
                </div>
                {record.coOwnerName && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Đồng sở hữu:</span>
                    <span className="font-medium text-slate-800">{record.coOwnerName}</span>
                  </div>
                )}
                <div>
                  <span className="text-slate-500 block mb-0.5">Địa chỉ thường trú:</span>
                  <span className="text-slate-800">{record.customerAddress || 'Chưa có'}</span>
                </div>
              </div>
            </div>

            {/* Khối 2: Thông tin Thửa đất */}
            <div className="p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-800 font-bold text-xs uppercase tracking-wider">
                <MapPin className="h-4 w-4 text-emerald-600" />
                <span>2. Thông tin Thửa đất</span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Số thửa / Tờ bản đồ:</span>
                  <span className="font-bold text-slate-900">
                    Thửa {record.plotNumber || '—'}, Tờ {record.mapSheetNumber || '—'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Diện tích:</span>
                  <span className="font-semibold text-emerald-700">{record.area} m²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Loại đất:</span>
                  <span className="font-medium text-slate-800">{record.landType || 'ONT'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Số Giấy chứng nhận:</span>
                  <span className="font-mono font-bold text-slate-800">
                    {record.certificateNumber || 'Đang cấp lần đầu'}
                  </span>
                </div>
                {record.certificateBookNumber && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Số vào sổ cấp GCN:</span>
                    <span className="font-mono text-slate-700">{record.certificateBookNumber}</span>
                  </div>
                )}
                <div>
                  <span className="text-slate-500 block mb-0.5">Vị trí thửa đất:</span>
                  <span className="text-slate-800">{record.landAddress}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Khối 3: Giấy tờ đính kèm & Files */}
          <div className="p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wider">
                <Paperclip className="h-4 w-4 text-purple-600" />
                <span>3. Danh mục Giấy tờ đã nộp ({record.documents.filter((d) => d.submitted).length}/{record.documents.length})</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {record.documents.map((doc, idx) => (
                <div
                  key={doc.id}
                  className={`p-3 rounded-lg border text-xs ${
                    doc.submitted
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <span
                        className={`mt-0.5 h-3.5 w-3.5 rounded-full flex items-center justify-center shrink-0 ${
                          doc.submitted ? 'text-emerald-600' : 'text-slate-300'
                        }`}
                      >
                        {doc.submitted ? (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        ) : (
                          <span className="h-2 w-2 rounded-full bg-slate-300" />
                        )}
                      </span>
                      <div>
                        <span className={`font-semibold ${doc.submitted ? 'text-slate-900' : 'text-slate-600'}`}>
                          {idx + 1}. {doc.name}
                        </span>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Hình thức: {doc.originalType === 'original' ? 'Bản chính' : doc.originalType === 'certified_copy' ? 'Sao y công chứng' : 'Photo'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Files đã tải lên */}
                  {doc.files && doc.files.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-slate-200/60 flex flex-wrap gap-1.5">
                      {doc.files.map((file) => (
                        <button
                          key={file.id}
                          type="button"
                          onClick={() => setSelectedPreviewFile(file)}
                          className="inline-flex items-center gap-1 px-2 py-0.5 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded text-[11px] text-blue-700 font-medium transition-colors cursor-pointer"
                        >
                          <FileText className="h-3 w-3" />
                          <span className="max-w-[120px] truncate">{file.name}</span>
                          <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Khối 4: Tài chính & Thanh toán */}
          <div className="p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-800 font-bold text-xs uppercase tracking-wider">
              <DollarSign className="h-4 w-4 text-amber-600" />
              <span>4. Thông tin Tài chính & Hợp đồng Dịch vụ</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-500 block">Giá trị dịch vụ:</span>
                <span className="text-base font-bold text-slate-900 mt-1 block">
                  {formatVND(record.serviceFee)}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-500 block">Tiền tạm ứng:</span>
                <span className="text-base font-semibold text-slate-800 mt-1 block">
                  {formatVND(record.depositAmount)}
                </span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                <span className="text-emerald-700 block">Đã thanh toán:</span>
                <span className="text-base font-bold text-emerald-800 mt-1 block">
                  {formatVND(record.paidAmount)}
                </span>
              </div>
              <div className="p-3 bg-rose-50 rounded-lg border border-rose-100">
                <span className="text-rose-700 block">Còn lại (Công nợ):</span>
                <span className="text-base font-bold text-rose-800 mt-1 block">
                  {formatVND(record.remainingAmount)}
                </span>
              </div>
            </div>

            {record.paymentNotes && (
              <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg">
                <strong>Ghi chú tài chính:</strong> {record.paymentNotes}
              </p>
            )}
          </div>

          {/* Khối 5: Lịch sử Tiến độ (Timeline) */}
          <div className="p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-800 font-bold text-xs uppercase tracking-wider">
              <Activity className="h-4 w-4 text-sky-600" />
              <span>5. Nhật ký Tiến độ Xử lý</span>
            </div>

            <div className="space-y-3 pl-2 border-l-2 border-blue-200 ml-2">
              {record.progressLogs.map((log) => (
                <div key={log.id} className="relative pl-4 text-xs">
                  <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-blue-600 ring-4 ring-white" />
                  <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                    <span className="font-semibold text-slate-700">{log.date}</span>
                    {log.officer && <span>• {log.officer}</span>}
                  </div>
                  <p className="text-slate-800 mt-0.5">{log.note}</p>
                </div>
              ))}
            </div>

            {/* Thêm ghi chú tiến độ nhanh */}
            <form onSubmit={handleQuickAddNote} className="mt-3 pt-3 border-t border-slate-100 flex gap-2">
              <input
                type="text"
                value={newLogNote}
                onChange={(e) => setNewLogNote(e.target.value)}
                placeholder="Ghi nhanh cập nhật tiến độ mới..."
                className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
              >
                Ghi nhật ký
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Modal Preview File (nếu người dùng bấm vào xem file đính kèm) */}
      {selectedPreviewFile && (
        <div className="fixed inset-0 z-60 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full p-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-semibold text-sm text-slate-900 truncate">
                {selectedPreviewFile.name}
              </h3>
              <button
                onClick={() => setSelectedPreviewFile(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto py-4 flex items-center justify-center min-h-[300px]">
              {selectedPreviewFile.dataUrl ? (
                selectedPreviewFile.type.includes('image') ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={selectedPreviewFile.dataUrl}
                    alt={selectedPreviewFile.name}
                    className="max-h-[65vh] object-contain rounded"
                  />
                ) : (
                  <iframe
                    src={selectedPreviewFile.dataUrl}
                    className="w-full h-[65vh] border-0"
                    title={selectedPreviewFile.name}
                  />
                )
              ) : (
                <div className="text-center text-slate-500 text-sm">
                  <FileText className="h-12 w-12 mx-auto text-slate-400 mb-2" />
                  <p>Tệp mô phỏng trong bản demo.</p>
                  <p className="text-xs text-slate-400 mt-1">
                    (Khi bạn tải ảnh hoặc PDF thật từ máy lên, bản xem trước sẽ hiển thị trực tiếp tại đây!)
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
