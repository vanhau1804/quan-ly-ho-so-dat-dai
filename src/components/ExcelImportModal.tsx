'use client';

import React, { useState } from 'react';
import { LandRecord } from '@/types';
import { parseExcelToRecords, downloadExcelTemplate } from '@/lib/excel';
import {
  X,
  Upload,
  FileSpreadsheet,
  Download,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';

interface ExcelImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (importedRecords: LandRecord[]) => void;
  existingRecords: LandRecord[];
}

export const ExcelImportModal: React.FC<ExcelImportModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess,
  existingRecords,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [parsedPreview, setParsedPreview] = useState<LandRecord[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const records = await parseExcelToRecords(file, existingRecords);
      if (records.length === 0) {
        setErrorMessage('File Excel không chứa dòng dữ liệu hợp lệ nào.');
      } else {
        setParsedPreview(records);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Không thể đọc file Excel. Vui lòng đảm bảo đúng định dạng .xlsx hoặc .xls');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmImport = () => {
    if (parsedPreview.length === 0) return;
    onImportSuccess(parsedPreview);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Nhập Danh Sách Hồ Sơ Từ Excel (.xlsx)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Tự động nhận diện 6 nhóm trường dữ liệu và khởi tạo checklist giấy tờ theo loại hồ sơ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Hướng dẫn & Tải file mẫu */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Bạn chưa có file Excel theo đúng cấu trúc chuẩn?
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Tải file Excel mẫu có sẵn các tiêu đề cột chuẩn (Khách hàng, Thửa đất, Tiến độ, Tài chính...) để nhập liệu nhanh.
              </p>
            </div>
            <button
              type="button"
              onClick={downloadExcelTemplate}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg shadow-2xs transition-colors shrink-0 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5 text-slate-500" />
              <span>Tải file Excel mẫu</span>
            </button>
          </div>

          {/* Vùng kéo thả chọn file */}
          <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-8 text-center bg-slate-50/50 hover:bg-blue-50/20 transition-all">
            <input
              type="file"
              id="excelFileInput"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="excelFileInput"
              className="cursor-pointer flex flex-col items-center justify-center"
            >
              <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
                <Upload className="h-6 w-6" />
              </div>
              <span className="text-sm font-semibold text-slate-800">
                {selectedFile ? selectedFile.name : 'Nhấp để chọn file Excel hoặc kéo thả vào đây'}
              </span>
              <span className="text-xs text-slate-400 mt-1">
                Hỗ trợ định dạng .xlsx, .xls (tối đa 20MB)
              </span>
            </label>
          </div>

          {/* Trạng thái Loading */}
          {isLoading && (
            <div className="flex items-center justify-center gap-2 py-4 text-xs font-medium text-slate-600">
              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
              <span>Đang đọc dữ liệu các sheet trong file Excel...</span>
            </div>
          )}

          {/* Thông báo lỗi */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs text-rose-700">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Bảng xem trước dữ liệu được trích xuất */}
          {parsedPreview.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>
                  Đã nhận diện thành công: <strong className="text-emerald-700">{parsedPreview.length}</strong> hồ sơ
                </span>
                <span className="text-slate-400 text-[11px]">
                  Danh mục giấy tờ đã tự động phân bổ theo từng loại hồ sơ
                </span>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-x-auto max-h-56">
                <table className="min-w-full divide-y divide-slate-200 text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold sticky top-0">
                    <tr>
                      <th className="py-2 px-3 text-left">Mã HS</th>
                      <th className="py-2 px-3 text-left">Khách hàng</th>
                      <th className="py-2 px-3 text-left">Loại hồ sơ</th>
                      <th className="py-2 px-3 text-left">Thửa / Tờ</th>
                      <th className="py-2 px-3 text-left">Giá trị HĐ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {parsedPreview.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-mono font-medium text-blue-700">{item.id}</td>
                        <td className="py-2 px-3 font-medium text-slate-900">{item.customerName}</td>
                        <td className="py-2 px-3 text-slate-600">{item.recordType}</td>
                        <td className="py-2 px-3 text-slate-600">Thửa {item.plotNumber}, Tờ {item.mapSheetNumber}</td>
                        <td className="py-2 px-3 font-medium text-slate-800">
                          {new Intl.NumberFormat('vi-VN').format(item.serviceFee)} đ
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-lg transition-colors"
          >
            Đóng
          </button>
          <button
            type="button"
            disabled={parsedPreview.length === 0}
            onClick={handleConfirmImport}
            className={`inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white rounded-lg transition-all shadow-md ${
              parsedPreview.length > 0
                ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25 cursor-pointer'
                : 'bg-slate-300 cursor-not-allowed'
            }`}
          >
            <CheckCircle className="h-4 w-4" />
            <span>Nạp {parsedPreview.length} hồ sơ vào hệ thống</span>
          </button>
        </div>
      </div>
    </div>
  );
};
