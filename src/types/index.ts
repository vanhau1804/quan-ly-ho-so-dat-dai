export type RecordType =
  | 'chuyen_nhuong'
  | 'tang_cho'
  | 'thua_ke'
  | 'cap_lan_dau'
  | 'cap_doi'
  | 'chuyen_muc_dich'
  | 'the_chap'
  | 'xoa_the_chap'
  | 'tach_hop_thua'
  | 'cho_thue'
  | 'gop_von';

export type RecordStatus =
  | 'tiep_nhan'
  | 'dang_xu_ly'
  | 'cho_thue'
  | 'cho_bo_sung'
  | 'hoan_thanh'
  | 'da_tra_khach';

export type PaymentStatus =
  | 'chua_thanh_toan'
  | 'da_tam_ung'
  | 'da_tat_toan';

export type OriginalType = 'original' | 'certified_copy' | 'copy';

export interface AttachedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  dataUrl?: string; // Base64 data for image/pdf preview
  uploadDate: string;
}

export interface DocumentRequirement {
  id: string;
  name: string;
  required: boolean;
  description?: string;
  submitted: boolean;
  originalType: OriginalType;
  note?: string;
  files: AttachedFile[];
}

export interface ProgressLog {
  id: string;
  date: string;
  status: RecordStatus;
  note: string;
  officer?: string;
}

export interface LandRecord {
  id: string; // Mã hồ sơ: HS-YYYY-XXX
  createdAt: string;
  updatedAt: string;

  // 1. Khách hàng
  customerName: string;
  customerIdNumber: string; // CCCD / MST
  customerPhone: string;
  customerAddress: string;
  coOwnerName?: string; // Người đồng sở hữu / vợ chồng

  // 2. Loại hồ sơ
  recordType: RecordType;

  // 3. Thông tin đất
  landAddress: string;
  plotNumber: string; // Số thửa
  mapSheetNumber: string; // Tờ bản đồ
  area: number; // m²
  landType: string; // ONT, ODT, CLN, LUC...
  certificateNumber: string; // Số GCN / Số phát hành phôi
  certificateBookNumber?: string; // Số vào sổ cấp GCN
  landNotes?: string;

  // 4. Giấy tờ đính kèm
  documents: DocumentRequirement[];

  // 5. Tiến độ xử lý
  receivedDate: string;
  assignedOfficer: string;
  processingAgency: string; // Chi nhánh VPĐKĐĐ, UBND xã, Chi cục Thuế...
  status: RecordStatus;
  submittedDate?: string; // Ngày nộp cơ quan
  expectedReturnDate?: string; // Ngày hẹn trả kết quả
  actualReturnDate?: string; // Ngày trả kết quả
  progressLogs: ProgressLog[];

  // 6. Tài chính
  serviceFee: number; // Giá trị hợp đồng dịch vụ
  depositAmount: number; // Tiền tạm ứng
  paidAmount: number; // Số tiền đã thanh toán
  remainingAmount: number; // Số tiền còn lại
  paymentStatus: PaymentStatus;
  paymentNotes?: string;
}
