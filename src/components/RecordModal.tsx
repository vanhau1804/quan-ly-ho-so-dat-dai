'use client';

import React, { useState, useEffect } from 'react';
import {
  LandRecord,
  RecordType,
  RecordStatus,
  DocumentRequirement,
  OriginalType,
  AttachedFile,
} from '@/types';
import {
  RECORD_TYPE_CONFIG,
  RECORD_STATUS_CONFIG,
  createDefaultDocumentList,
} from '@/constants/documentRequirements';
import {
  X,
  User,
  Layers,
  MapPin,
  Paperclip,
  Activity,
  DollarSign,
  Plus,
  Trash2,
  Upload,
  FileCheck,
  FileText,
  Info,
} from 'lucide-react';

interface RecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: LandRecord) => void;
  recordToEdit?: LandRecord | null;
  suggestedId: string;
}

export const RecordModal: React.FC<RecordModalProps> = ({
  isOpen,
  onClose,
  onSave,
  recordToEdit,
  suggestedId,
}) => {
  const [activeTab, setActiveTab] = useState<number>(1);

  // Nhóm 1: Khách hàng
  const [customerName, setCustomerName] = useState('');
  const [customerIdNumber, setCustomerIdNumber] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [coOwnerName, setCoOwnerName] = useState('');

  // Nhóm 2: Loại hồ sơ
  const [recordType, setRecordType] = useState<RecordType>('chuyen_nhuong');

  // Nhóm 3: Thông tin đất
  const [landAddress, setLandAddress] = useState('');
  const [plotNumber, setPlotNumber] = useState('');
  const [mapSheetNumber, setMapSheetNumber] = useState('');
  const [area, setArea] = useState<number | ''>('');
  const [landType, setLandType] = useState('ONT');
  const [certificateNumber, setCertificateNumber] = useState('');
  const [certificateBookNumber, setCertificateBookNumber] = useState('');
  const [landNotes, setLandNotes] = useState('');

  // Nhóm 4: Giấy tờ đính kèm động
  const [documents, setDocuments] = useState<DocumentRequirement[]>([]);
  const [newCustomDocName, setNewCustomDocName] = useState('');

  // Nhóm 5: Tiến độ xử lý
  const [recordId, setRecordId] = useState('');
  const [receivedDate, setReceivedDate] = useState('');
  const [assignedOfficer, setAssignedOfficer] = useState('');
  const [processingAgency, setProcessingAgency] = useState('Chi nhánh VP Đăng ký đất đai');
  const [status, setStatus] = useState<RecordStatus>('tiep_nhan');
  const [submittedDate, setSubmittedDate] = useState('');
  const [expectedReturnDate, setExpectedReturnDate] = useState('');
  const [actualReturnDate, setActualReturnDate] = useState('');
  const [newProgressNote, setNewProgressNote] = useState('');

  // Nhóm 6: Tài chính
  const [serviceFee, setServiceFee] = useState<number>(0);
  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [paymentNotes, setPaymentNotes] = useState('');

  // Tự động tính số tiền còn lại
  const remainingAmount = Math.max(0, (serviceFee || 0) - (paidAmount || 0));

  // Load dữ liệu khi mở modal (tạo mới hoặc sửa)
  useEffect(() => {
    if (recordToEdit) {
      setRecordId(recordToEdit.id);
      setCustomerName(recordToEdit.customerName);
      setCustomerIdNumber(recordToEdit.customerIdNumber);
      setCustomerPhone(recordToEdit.customerPhone);
      setCustomerAddress(recordToEdit.customerAddress);
      setCoOwnerName(recordToEdit.coOwnerName || '');

      setRecordType(recordToEdit.recordType);

      setLandAddress(recordToEdit.landAddress);
      setPlotNumber(recordToEdit.plotNumber);
      setMapSheetNumber(recordToEdit.mapSheetNumber);
      setArea(recordToEdit.area || '');
      setLandType(recordToEdit.landType || 'ONT');
      setCertificateNumber(recordToEdit.certificateNumber || '');
      setCertificateBookNumber(recordToEdit.certificateBookNumber || '');
      setLandNotes(recordToEdit.landNotes || '');

      setDocuments(recordToEdit.documents || []);

      setReceivedDate(recordToEdit.receivedDate);
      setAssignedOfficer(recordToEdit.assignedOfficer || '');
      setProcessingAgency(recordToEdit.processingAgency || 'Chi nhánh VP Đăng ký đất đai');
      setStatus(recordToEdit.status);
      setSubmittedDate(recordToEdit.submittedDate || '');
      setExpectedReturnDate(recordToEdit.expectedReturnDate || '');
      setActualReturnDate(recordToEdit.actualReturnDate || '');

      setServiceFee(recordToEdit.serviceFee || 0);
      setDepositAmount(recordToEdit.depositAmount || 0);
      setPaidAmount(recordToEdit.paidAmount || 0);
      setPaymentNotes(recordToEdit.paymentNotes || '');
    } else {
      // Khởi tạo mới
      const today = new Date().toISOString().slice(0, 10);
      setRecordId(suggestedId);
      setCustomerName('');
      setCustomerIdNumber('');
      setCustomerPhone('');
      setCustomerAddress('');
      setCoOwnerName('');

      setRecordType('chuyen_nhuong');
      setDocuments(createDefaultDocumentList('chuyen_nhuong'));

      setLandAddress('');
      setPlotNumber('');
      setMapSheetNumber('');
      setArea('');
      setLandType('ONT');
      setCertificateNumber('');
      setCertificateBookNumber('');
      setLandNotes('');

      setReceivedDate(today);
      setAssignedOfficer('Chuyên viên pháp lý');
      setProcessingAgency('Chi nhánh Văn phòng Đăng ký đất đai');
      setStatus('tiep_nhan');
      setSubmittedDate('');
      setExpectedReturnDate('');
      setActualReturnDate('');

      setServiceFee(10000000);
      setDepositAmount(5000000);
      setPaidAmount(5000000);
      setPaymentNotes('');
    }
    setActiveTab(1);
  }, [recordToEdit, suggestedId, isOpen]);

  // XỬ LÝ ĐIỂM CỐT LÕI: Khi người dùng đổi Loại hồ sơ, đổi bộ checklist tương ứng!
  const handleRecordTypeChange = (newType: RecordType) => {
    setRecordType(newType);
    const newDocList = createDefaultDocumentList(newType);
    setDocuments(newDocList);
  };

  // Cập nhật trạng thái từng giấy tờ trong checklist
  const handleToggleDocSubmitted = (docId: string) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === docId ? { ...d, submitted: !d.submitted } : d))
    );
  };

  const handleChangeDocOriginalType = (docId: string, origType: OriginalType) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === docId ? { ...d, originalType: origType } : d))
    );
  };

  // Upload file ảnh hoặc PDF vào giấy tờ
  const handleFileUpload = (docId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const newAttachedFile: AttachedFile = {
          id: `file_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          name: file.name,
          size: file.size,
          type: file.type,
          dataUrl,
          uploadDate: new Date().toISOString().slice(0, 10),
        };

        setDocuments((prev) =>
          prev.map((d) => {
            if (d.id === docId) {
              return {
                ...d,
                submitted: true, // Tự động đánh dấu đã nộp khi có file đính kèm
                files: [...(d.files || []), newAttachedFile],
              };
            }
            return d;
          })
        );
      };
      reader.readAsDataURL(file);
    });
  };

  // Xóa file đính kèm
  const handleRemoveFile = (docId: string, fileId: string) => {
    setDocuments((prev) =>
      prev.map((d) => {
        if (d.id === docId) {
          return {
            ...d,
            files: (d.files || []).filter((f) => f.id !== fileId),
          };
        }
        return d;
      })
    );
  };

  // Thêm mục giấy tờ tùy chỉnh phát sinh
  const handleAddCustomDoc = () => {
    if (!newCustomDocName.trim()) return;
    const newDoc: DocumentRequirement = {
      id: `custom_${Date.now()}`,
      name: newCustomDocName.trim(),
      required: false,
      submitted: false,
      originalType: 'original',
      files: [],
    };
    setDocuments((prev) => [...prev, newDoc]);
    setNewCustomDocName('');
  };

  // Xóa mục giấy tờ
  const handleRemoveDoc = (docId: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
  };

  // Lưu toàn bộ hồ sơ
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim()) {
      alert('Vui lòng nhập Họ tên khách hàng ở Nhóm 1!');
      setActiveTab(1);
      return;
    }
    if (!customerPhone.trim()) {
      alert('Vui lòng nhập Số điện thoại liên hệ của khách hàng!');
      setActiveTab(1);
      return;
    }

    const now = new Date().toISOString();
    let paymentStatus: LandRecord['paymentStatus'] = 'chua_thanh_toan';
    if (paidAmount >= serviceFee && serviceFee > 0) {
      paymentStatus = 'da_tat_toan';
    } else if (paidAmount > 0) {
      paymentStatus = 'da_tam_ung';
    }

    const newRecord: LandRecord = {
      id: recordId || suggestedId,
      createdAt: recordToEdit?.createdAt || now,
      updatedAt: now,

      // 1. Khách hàng
      customerName: customerName.trim(),
      customerIdNumber: customerIdNumber.trim(),
      customerPhone: customerPhone.trim(),
      customerAddress: customerAddress.trim(),
      coOwnerName: coOwnerName.trim() || undefined,

      // 2. Loại hồ sơ
      recordType,

      // 3. Thông tin đất
      landAddress: landAddress.trim(),
      plotNumber: plotNumber.trim(),
      mapSheetNumber: mapSheetNumber.trim(),
      area: Number(area) || 0,
      landType: landType.trim(),
      certificateNumber: certificateNumber.trim(),
      certificateBookNumber: certificateBookNumber.trim() || undefined,
      landNotes: landNotes.trim() || undefined,

      // 4. Giấy tờ đính kèm
      documents,

      // 5. Tiến độ xử lý
      receivedDate: receivedDate || now.slice(0, 10),
      assignedOfficer: assignedOfficer.trim(),
      processingAgency: processingAgency.trim(),
      status,
      submittedDate: submittedDate || undefined,
      expectedReturnDate: expectedReturnDate || undefined,
      actualReturnDate: actualReturnDate || undefined,
      progressLogs: recordToEdit?.progressLogs || [
        {
          id: `log_${Date.now()}`,
          date: receivedDate || now.slice(0, 10),
          status,
          note: newProgressNote.trim() || `Khởi tạo hồ sơ ${recordType}`,
          officer: assignedOfficer,
        },
      ],

      // 6. Tài chính
      serviceFee: Number(serviceFee) || 0,
      depositAmount: Number(depositAmount) || 0,
      paidAmount: Number(paidAmount) || 0,
      remainingAmount,
      paymentStatus,
      paymentNotes: paymentNotes.trim() || undefined,
    };

    onSave(newRecord);
    onClose();
  };

  if (!isOpen) return null;

  const TABS = [
    { id: 1, label: '1. Khách hàng', icon: User },
    { id: 2, label: '2. Loại hồ sơ', icon: Layers },
    { id: 3, label: '3. Thửa đất', icon: MapPin },
    { id: 4, label: `4. Giấy tờ (${documents.filter((d) => d.submitted).length}/${documents.length})`, icon: Paperclip },
    { id: 5, label: '5. Tiến độ', icon: Activity },
    { id: 6, label: '6. Tài chính', icon: DollarSign },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                {recordId || suggestedId}
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                {recordToEdit ? 'Chỉnh Sửa Hồ Sơ Đất Đai' : 'Tiếp Nhận Hồ Sơ Đất Đai Mới'}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Nhập và kiểm tra đầy đủ 6 nhóm dữ liệu quy chuẩn trước khi lưu trữ
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-white overflow-x-auto px-4 gap-1 text-xs font-medium">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-3 px-3.5 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'border-blue-600 text-blue-600 font-bold bg-blue-50/50'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: KHÁCH HÀNG */}
          {activeTab === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <User className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-slate-800 text-sm uppercase tracking-wider">
                  Nhóm 1: Thông tin Khách hàng / Chủ sở hữu
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Họ và tên khách hàng <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ví dụ: Nguyễn Văn Hùng"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Số CCCD / Mã số doanh nghiệp <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerIdNumber}
                    onChange={(e) => setCustomerIdNumber(e.target.value)}
                    placeholder="Số thẻ CCCD gắn chip 12 chữ số"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Số điện thoại liên hệ <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="0912 345 678"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Người đồng sở hữu / Vợ hoặc chồng (nếu có)
                  </label>
                  <input
                    type="text"
                    value={coOwnerName}
                    onChange={(e) => setCoOwnerName(e.target.value)}
                    placeholder="Ví dụ: Trần Thị Thu (Vợ)"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Địa chỉ thường trú / Liên hệ
                  </label>
                  <input
                    type="text"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    placeholder="Số nhà, đường/phố, phường/xã, quận/huyện, tỉnh/thành phố"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LOẠI HỒ SƠ */}
          {activeTab === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Layers className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-slate-800 text-sm uppercase tracking-wider">
                  Nhóm 2: Loại hồ sơ dịch vụ
                </h3>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2 text-xs text-amber-800">
                <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Lưu ý:</strong> Khi bạn thay đổi <strong>Loại hồ sơ</strong>, danh mục checklist ở tab{' '}
                  <strong>&quot;4. Giấy tờ đính kèm&quot;</strong> sẽ tự động cập nhật đúng chuẩn pháp lý của thủ tục đó!
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(RECORD_TYPE_CONFIG).map(([key, item]) => {
                  const isSelected = recordType === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleRecordTypeChange(key as RecordType)}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/30'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                          {item.code}
                        </span>
                        {isSelected && (
                          <span className="h-2 w-2 rounded-full bg-blue-600" />
                        )}
                      </div>
                      <div className="font-semibold text-sm text-slate-900 mt-1">
                        {item.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: THÔNG TIN ĐẤT */}
          {activeTab === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <MapPin className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-slate-800 text-sm uppercase tracking-wider">
                  Nhóm 3: Thông tin Thửa đất & Giấy chứng nhận
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Địa chỉ thửa đất <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={landAddress}
                    onChange={(e) => setLandAddress(e.target.value)}
                    placeholder="Ví dụ: Thửa 45, Tổ 3, Phường Mỹ Đình 2, Nam Từ Liêm, Hà Nội"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Số thửa đất
                  </label>
                  <input
                    type="text"
                    value={plotNumber}
                    onChange={(e) => setPlotNumber(e.target.value)}
                    placeholder="45"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tờ bản đồ số
                  </label>
                  <input
                    type="text"
                    value={mapSheetNumber}
                    onChange={(e) => setMapSheetNumber(e.target.value)}
                    placeholder="12"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Diện tích (m²)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={area}
                    onChange={(e) => setArea(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="95.5"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Loại đất (Ký hiệu mục đích SD)
                  </label>
                  <input
                    type="text"
                    value={landType}
                    onChange={(e) => setLandType(e.target.value)}
                    placeholder="ONT, ODT, CLN, LUC..."
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Số Giấy chứng nhận (Sổ đỏ/hồng)
                  </label>
                  <input
                    type="text"
                    value={certificateNumber}
                    onChange={(e) => setCertificateNumber(e.target.value)}
                    placeholder="CS 982134"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Số vào sổ cấp GCN
                  </label>
                  <input
                    type="text"
                    value={certificateBookNumber}
                    onChange={(e) => setCertificateBookNumber(e.target.value)}
                    placeholder="CH-00129"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ghi chú quy hoạch / Tình trạng pháp lý thửa đất
                  </label>
                  <textarea
                    rows={2}
                    value={landNotes}
                    onChange={(e) => setLandNotes(e.target.value)}
                    placeholder="Tình trạng tranh chấp, quy hoạch lộ giới, thế chấp ngân hàng..."
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: GIẤY TỜ ĐÍNH KÈM (ĐỘNG THEO LOẠI HỒ SƠ) */}
          {activeTab === 4 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Paperclip className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-slate-800 text-sm uppercase tracking-wider">
                    Nhóm 4: Danh mục Giấy tờ Đính kèm (Tự động theo loại hồ sơ)
                  </h3>
                </div>
                <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                  {RECORD_TYPE_CONFIG[recordType]?.label}
                </span>
              </div>

              {/* Danh sách checklist */}
              <div className="space-y-3">
                {documents.map((doc, idx) => (
                  <div
                    key={doc.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      doc.submitted
                        ? 'bg-emerald-50/40 border-emerald-200'
                        : 'bg-slate-50/70 border-slate-200'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-start gap-2.5">
                        <input
                          type="checkbox"
                          id={`chk_${doc.id}`}
                          checked={doc.submitted}
                          onChange={() => handleToggleDocSubmitted(doc.id)}
                          className="mt-1 h-4 w-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                        />
                        <div>
                          <label
                            htmlFor={`chk_${doc.id}`}
                            className="text-sm font-semibold text-slate-800 cursor-pointer flex items-center gap-2"
                          >
                            <span>{idx + 1}. {doc.name}</span>
                            {doc.required && (
                              <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 border border-rose-200">
                                Bắt buộc
                              </span>
                            )}
                          </label>
                          {doc.description && (
                            <p className="text-xs text-slate-500 mt-0.5">
                              {doc.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {/* Chọn loại bản */}
                        <select
                          value={doc.originalType}
                          onChange={(e) =>
                            handleChangeDocOriginalType(
                              doc.id,
                              e.target.value as OriginalType
                            )
                          }
                          className="text-xs py-1 px-2 border border-slate-200 bg-white rounded-md font-medium text-slate-700 focus:outline-none"
                        >
                          <option value="original">Bản chính</option>
                          <option value="certified_copy">Bản sao công chứng</option>
                          <option value="copy">Bản photo</option>
                        </select>

                        {/* Nút Upload ảnh/PDF */}
                        <label className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md cursor-pointer transition-colors">
                          <Upload className="h-3 w-3" />
                          <span>Tải file</span>
                          <input
                            type="file"
                            multiple
                            accept="image/*,application/pdf"
                            onChange={(e) => handleFileUpload(doc.id, e)}
                            className="hidden"
                          />
                        </label>

                        {/* Xóa nếu là custom doc */}
                        {doc.id.startsWith('custom_') && (
                          <button
                            type="button"
                            onClick={() => handleRemoveDoc(doc.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Danh sách tệp đính kèm của mục này */}
                    {doc.files && doc.files.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex flex-wrap gap-2">
                        {doc.files.map((file) => (
                          <div
                            key={file.id}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-md text-xs shadow-2xs"
                          >
                            <FileText className="h-3.5 w-3.5 text-blue-500" />
                            <span className="max-w-[150px] truncate font-medium text-slate-700" title={file.name}>
                              {file.name}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              ({(file.size / 1024).toFixed(0)} KB)
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveFile(doc.id, file.id)}
                              className="text-slate-400 hover:text-rose-600 ml-1"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Thêm mục giấy tờ tùy chỉnh phát sinh */}
              <div className="pt-2 flex items-center gap-2">
                <input
                  type="text"
                  value={newCustomDocName}
                  onChange={(e) => setNewCustomDocName(e.target.value)}
                  placeholder="Thêm giấy tờ phát sinh khác..."
                  className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddCustomDoc}
                  className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Thêm mục</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: TIẾN ĐỘ XỬ LÝ */}
          {activeTab === 5 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Activity className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-slate-800 text-sm uppercase tracking-wider">
                  Nhóm 5: Tiến độ Xử lý & Phân công Công việc
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Trạng thái hồ sơ
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as RecordStatus)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-semibold text-slate-800"
                  >
                    {Object.entries(RECORD_STATUS_CONFIG).map(([key, item]) => (
                      <option key={key} value={key}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Cán bộ / Chuyên viên phụ trách
                  </label>
                  <input
                    type="text"
                    value={assignedOfficer}
                    onChange={(e) => setAssignedOfficer(e.target.value)}
                    placeholder="Ví dụ: Lê Văn Minh (Chuyên viên Pháp lý)"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Cơ quan tiếp nhận giải quyết
                  </label>
                  <input
                    type="text"
                    value={processingAgency}
                    onChange={(e) => setProcessingAgency(e.target.value)}
                    placeholder="Chi nhánh Văn phòng Đăng ký đất đai / Thuế..."
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ngày tiếp nhận hồ sơ
                  </label>
                  <input
                    type="date"
                    value={receivedDate}
                    onChange={(e) => setReceivedDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ngày nộp vào cơ quan nhà nước
                  </label>
                  <input
                    type="date"
                    value={submittedDate}
                    onChange={(e) => setSubmittedDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ngày hẹn trả kết quả (Giấy hẹn)
                  </label>
                  <input
                    type="date"
                    value={expectedReturnDate}
                    onChange={(e) => setExpectedReturnDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ngày trả kết quả thực tế cho khách
                  </label>
                  <input
                    type="date"
                    value={actualReturnDate}
                    onChange={(e) => setActualReturnDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ghi chú tiến độ gần nhất
                  </label>
                  <input
                    type="text"
                    value={newProgressNote}
                    onChange={(e) => setNewProgressNote(e.target.value)}
                    placeholder="Đã đo đạc hiện trạng / Đang đợi thông báo thuế..."
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: TÀI CHÍNH */}
          {activeTab === 6 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <DollarSign className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-slate-800 text-sm uppercase tracking-wider">
                  Nhóm 6: Tài chính & Thanh toán Dịch vụ
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Giá trị hợp đồng dịch vụ (VNĐ)
                  </label>
                  <input
                    type="number"
                    step="500000"
                    value={serviceFee}
                    onChange={(e) => setServiceFee(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tiền tạm ứng khi nhận hồ sơ (VNĐ)
                  </label>
                  <input
                    type="number"
                    step="500000"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium text-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Số tiền khách đã thanh toán (VNĐ)
                  </label>
                  <input
                    type="number"
                    step="500000"
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-semibold text-emerald-700"
                  />
                </div>

                {/* Thẻ hiển thị số tiền còn lại tự động */}
                <div className="sm:col-span-3 p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs uppercase font-semibold text-slate-500">
                      Số tiền còn lại (Công nợ cần thu)
                    </span>
                    <h4
                      className={`text-2xl font-bold mt-0.5 ${
                        remainingAmount > 0 ? 'text-rose-600' : 'text-emerald-600'
                      }`}
                    >
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      }).format(remainingAmount)}
                    </h4>
                  </div>
                  <div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        remainingAmount === 0 && serviceFee > 0
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : paidAmount > 0
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : 'bg-slate-200 text-slate-700 border-slate-300'
                      }`}
                    >
                      {remainingAmount === 0 && serviceFee > 0
                        ? 'Đã tất toán 100%'
                        : paidAmount > 0
                        ? 'Đang có công nợ'
                        : 'Chưa thu tiền'}
                    </span>
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ghi chú điều khoản thanh toán
                  </label>
                  <textarea
                    rows={2}
                    value={paymentNotes}
                    onChange={(e) => setPaymentNotes(e.target.value)}
                    placeholder="Khách sẽ thanh toán 50% còn lại khi nhận kết quả Sổ đỏ..."
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Footer Modal */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <div className="flex gap-2">
              {activeTab > 1 && (
                <button
                  type="button"
                  onClick={() => setActiveTab((prev) => prev - 1)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  ← Nhóm trước
                </button>
              )}
              {activeTab < 6 && (
                <button
                  type="button"
                  onClick={() => setActiveTab((prev) => prev + 1)}
                  className="px-4 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  Nhóm kế tiếp →
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg transition-all shadow-md shadow-blue-500/25"
              >
                <FileCheck className="h-4 w-4" />
                <span>{recordToEdit ? 'Lưu Thay Đổi' : 'Lưu Hồ Sơ Mới'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
