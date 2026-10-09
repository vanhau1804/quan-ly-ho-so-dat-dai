import * as XLSX from 'xlsx';
import { LandRecord, RecordType, RecordStatus } from '@/types';
import {
  RECORD_TYPE_CONFIG,
  RECORD_STATUS_CONFIG,
  createDefaultDocumentList,
} from '@/constants/documentRequirements';
import { generateNextRecordId } from './storage';

export function exportRecordsToExcel(records: LandRecord[]): void {
  const data = records.map((r, index) => {
    const totalDocs = r.documents.length;
    const submittedDocs = r.documents.filter((d) => d.submitted).length;

    return {
      'STT': index + 1,
      'Mã hồ sơ': r.id,
      'Khách hàng': r.customerName,
      'CCCD / MST': r.customerIdNumber,
      'Số điện thoại': r.customerPhone,
      'Địa chỉ khách hàng': r.customerAddress,
      'Người đồng sở hữu': r.coOwnerName || '',
      'Loại hồ sơ': RECORD_TYPE_CONFIG[r.recordType]?.label || r.recordType,
      'Địa chỉ thửa đất': r.landAddress,
      'Số thửa': r.plotNumber,
      'Tờ bản đồ': r.mapSheetNumber,
      'Diện tích (m²)': r.area,
      'Loại đất': r.landType,
      'Số GCN (Sổ đỏ/hồng)': r.certificateNumber,
      'Giấy tờ đã nộp': `${submittedDocs}/${totalDocs}`,
      'Ngày tiếp nhận': r.receivedDate,
      'Người phụ trách': r.assignedOfficer,
      'Cơ quan xử lý': r.processingAgency,
      'Trạng thái': RECORD_STATUS_CONFIG[r.status]?.label || r.status,
      'Ngày nộp cơ quan': r.submittedDate || '',
      'Ngày hẹn trả KQ': r.expectedReturnDate || '',
      'Ngày trả thực tế': r.actualReturnDate || '',
      'Giá trị HĐ (VNĐ)': r.serviceFee,
      'Tạm ứng (VNĐ)': r.depositAmount,
      'Đã thanh toán (VNĐ)': r.paidAmount,
      'Còn lại (VNĐ)': r.remainingAmount,
      'Ghi chú tài chính': r.paymentNotes || '',
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(data);

  // Căn chỉnh độ rộng cột cơ bản
  const colWidths = [
    { wch: 6 }, // STT
    { wch: 15 }, // Mã HS
    { wch: 22 }, // Khách hàng
    { wch: 16 }, // CCCD
    { wch: 14 }, // SĐT
    { wch: 30 }, // Địa chỉ KH
    { wch: 20 }, // Đồng sở hữu
    { wch: 25 }, // Loại HS
    { wch: 35 }, // Địa chỉ đất
    { wch: 10 }, // Số thửa
    { wch: 12 }, // Tờ BĐ
    { wch: 14 }, // Diện tích
    { wch: 18 }, // Loại đất
    { wch: 20 }, // Số GCN
    { wch: 16 }, // Giấy tờ đã nộp
    { wch: 14 }, // Ngày nhận
    { wch: 20 }, // Phụ trách
    { wch: 30 }, // Cơ quan
    { wch: 20 }, // Trạng thái
    { wch: 15 }, // Ngày nộp
    { wch: 15 }, // Hẹn trả
    { wch: 15 }, // Thực tế
    { wch: 18 }, // Giá trị HĐ
    { wch: 16 }, // Tạm ứng
    { wch: 18 }, // Đã thanh toán
    { wch: 16 }, // Còn lại
    { wch: 25 }, // Ghi chú
  ];
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Hồ sơ Đất đai');

  const now = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(workbook, `Danh_sach_ho_so_dat_dai_${now}.xlsx`);
}

// Hàm tải file mẫu Excel trắng chuẩn để người dùng nhập liệu
export function downloadExcelTemplate(): void {
  const templateData = [
    {
      'Mã hồ sơ (Bỏ trống sẽ tự sinh)': 'HS-2026-010',
      'Khách hàng': 'Nguyễn Văn A',
      'CCCD / MST': '001099123456',
      'Số điện thoại': '0988776655',
      'Địa chỉ khách hàng': 'Số 12 Hoàng Hoa Thám, Ba Đình, Hà Nội',
      'Người đồng sở hữu': 'Trần Thị B (Vợ)',
      'Loại hồ sơ (chuyen_nhuong, tang_cho, thua_ke, cap_lan_dau, cap_doi...)': 'chuyen_nhuong',
      'Địa chỉ thửa đất': 'Thôn 1, Xã Tiên Phương, Huyện Chương Mỹ, Hà Nội',
      'Số thửa': '12',
      'Tờ bản đồ': '5',
      'Diện tích (m²)': 150.5,
      'Loại đất': 'ONT',
      'Số GCN (Sổ đỏ/hồng)': 'CD 123456',
      'Ngày tiếp nhận (YYYY-MM-DD)': '2026-03-10',
      'Người phụ trách': 'Nguyễn Văn Minh',
      'Cơ quan xử lý': 'VP Đăng ký đất đai Chương Mỹ',
      'Trạng thái (tiep_nhan, dang_xu_ly, cho_thue, cho_bo_sung, hoan_thanh)': 'dang_xu_ly',
      'Ngày nộp cơ quan (YYYY-MM-DD)': '2026-03-11',
      'Ngày hẹn trả KQ (YYYY-MM-DD)': '2026-03-25',
      'Giá trị HĐ (VNĐ)': 15000000,
      'Tiền tạm ứng (VNĐ)': 5000000,
      'Đã thanh toán (VNĐ)': 5000000,
      'Ghi chú': 'Hồ sơ chuyển nhượng có yếu tố đo đạc lại',
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(templateData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Mau_Nhap_Ho_So');
  XLSX.writeFile(workbook, 'Mau_nhap_lieu_ho_so_dat_dai.xlsx');
}

// Chuyển đổi nhãn tiếng Việt sang RecordType
function parseRecordType(val: string | undefined): RecordType {
  if (!val) return 'chuyen_nhuong';
  const v = val.toLowerCase().trim();
  if (v.includes('chuyen_nhuong') || v.includes('chuyển nhượng') || v.includes('mua bán')) return 'chuyen_nhuong';
  if (v.includes('tang_cho') || v.includes('tặng cho')) return 'tang_cho';
  if (v.includes('thua_ke') || v.includes('thừa kế')) return 'thua_ke';
  if (v.includes('cap_lan_dau') || v.includes('lần đầu') || v.includes('cấp mới')) return 'cap_lan_dau';
  if (v.includes('cap_doi') || v.includes('cấp lại') || v.includes('đổi sổ')) return 'cap_doi';
  if (v.includes('chuyen_muc_dich') || v.includes('mục đích') || v.includes('lên thổ')) return 'chuyen_muc_dich';
  if (v.includes('the_chap') || v.includes('thế chấp')) return 'the_chap';
  if (v.includes('xoa_the_chap') || v.includes('giải chấp') || v.includes('xóa chấp')) return 'xoa_the_chap';
  if (v.includes('tach') || v.includes('hợp thửa')) return 'tach_hop_thua';
  if (v.includes('cho_thue') || v.includes('thuê')) return 'cho_thue';
  if (v.includes('gop_von') || v.includes('góp vốn')) return 'gop_von';
  return 'chuyen_nhuong';
}

// Chuyển đổi trạng thái tiếng Việt sang RecordStatus
function parseRecordStatus(val: string | undefined): RecordStatus {
  if (!val) return 'tiep_nhan';
  const v = val.toLowerCase().trim();
  if (v.includes('tiep_nhan') || v.includes('mới tiếp nhận') || v.includes('tiếp nhận')) return 'tiep_nhan';
  if (v.includes('dang_xu_ly') || v.includes('đang xử lý') || v.includes('đang làm')) return 'dang_xu_ly';
  if (v.includes('cho_thue') || v.includes('thuế') || v.includes('thông báo thuế')) return 'cho_thue';
  if (v.includes('cho_bo_sung') || v.includes('bổ sung') || v.includes('thiếu')) return 'cho_bo_sung';
  if (v.includes('hoan_thanh') || v.includes('xong') || v.includes('có kết quả')) return 'hoan_thanh';
  if (v.includes('da_tra') || v.includes('trả khách') || v.includes('đóng')) return 'da_tra_khach';
  return 'tiep_nhan';
}

// Đọc file Excel người dùng tải lên và chuyển thành LandRecord[]
export async function parseExcelToRecords(
  file: File,
  existingRecords: LandRecord[]
): Promise<LandRecord[]> {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];

  // Chuyển thành dạng json thô
  const rawData = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet);
  const now = new Date().toISOString();

  const tempRecords = [...existingRecords];
  const importedRecords: LandRecord[] = [];

  for (const row of rawData) {
    // Tìm các trường dựa trên nhiều khả năng đặt tên cột
    const customerName = String(row['Khách hàng'] || row['Họ tên'] || row['Tên KH'] || row['Khách Hàng'] || 'Khách hàng mới');
    const customerIdNumber = String(row['CCCD / MST'] || row['CCCD'] || row['CMND'] || row['Số CCCD'] || '');
    const customerPhone = String(row['Số điện thoại'] || row['SĐT'] || row['Điện thoại'] || '');
    const customerAddress = String(row['Địa chỉ khách hàng'] || row['Địa chỉ KH'] || row['Địa chỉ'] || '');
    const coOwnerName = String(row['Người đồng sở hữu'] || row['Đồng sở hữu'] || '');

    const recordTypeRaw = String(row['Loại hồ sơ'] || row['Loại thủ tục'] || row['Công việc'] || 'chuyen_nhuong');
    const recordType = parseRecordType(recordTypeRaw);

    const landAddress = String(row['Địa chỉ thửa đất'] || row['Địa chỉ đất'] || row['Vị trí'] || '');
    const plotNumber = String(row['Số thửa'] || row['Thửa'] || '');
    const mapSheetNumber = String(row['Tờ bản đồ'] || row['Tờ BĐ'] || row['Tờ'] || '');
    const area = Number(row['Diện tích (m²)'] || row['Diện tích'] || 0) || 0;
    const landType = String(row['Loại đất'] || 'ONT');
    const certificateNumber = String(row['Số GCN (Sổ đỏ/hồng)'] || row['Số GCN'] || row['Số sổ'] || '');

    const receivedDate = String(row['Ngày tiếp nhận'] || row['Ngày nhận'] || now.slice(0, 10));
    const assignedOfficer = String(row['Người phụ trách'] || row['Chuyên viên'] || 'Chuyên viên thụ lý');
    const processingAgency = String(row['Cơ quan xử lý'] || row['Cơ quan'] || 'Chi nhánh VP Đăng ký đất đai');
    const statusRaw = String(row['Trạng thái'] || row['Tình trạng'] || 'tiep_nhan');
    const status = parseRecordStatus(statusRaw);
    const submittedDate = row['Ngày nộp cơ quan'] || row['Ngày nộp'] ? String(row['Ngày nộp cơ quan'] || row['Ngày nộp']) : undefined;
    const expectedReturnDate = row['Ngày hẹn trả KQ'] || row['Ngày hẹn trả'] || row['Hạn trả'] ? String(row['Ngày hẹn trả KQ'] || row['Ngày hẹn trả'] || row['Hạn trả']) : undefined;

    const serviceFee = Number(row['Giá trị HĐ (VNĐ)'] || row['Giá trị HĐ'] || row['Chi phí'] || 0) || 0;
    const depositAmount = Number(row['Tiền tạm ứng (VNĐ)'] || row['Tạm ứng'] || 0) || 0;
    const paidAmount = Number(row['Đã thanh toán (VNĐ)'] || row['Đã thanh toán'] || row['Đã thu'] || depositAmount) || 0;
    const remainingAmount = Math.max(0, serviceFee - paidAmount);

    let paymentStatus: LandRecord['paymentStatus'] = 'chua_thanh_toan';
    if (paidAmount >= serviceFee && serviceFee > 0) {
      paymentStatus = 'da_tat_toan';
    } else if (paidAmount > 0) {
      paymentStatus = 'da_tam_ung';
    }

    // Kiểm tra mã hồ sơ nếu có sẵn trong file hoặc tự sinh
    let id = String(row['Mã hồ sơ'] || row['Mã HS'] || '').trim();
    if (!id || id.startsWith('HS-2026-010')) {
      id = generateNextRecordId(tempRecords);
    }

    const defaultDocs = createDefaultDocumentList(recordType);

    const newRecord: LandRecord = {
      id,
      createdAt: now,
      updatedAt: now,
      customerName,
      customerIdNumber,
      customerPhone,
      customerAddress,
      coOwnerName: coOwnerName || undefined,
      recordType,
      landAddress,
      plotNumber,
      mapSheetNumber,
      area,
      landType,
      certificateNumber,
      documents: defaultDocs,
      receivedDate,
      assignedOfficer,
      processingAgency,
      status,
      submittedDate,
      expectedReturnDate,
      progressLogs: [
        {
          id: `log_import_${Date.now()}`,
          date: receivedDate,
          status,
          note: `Hồ sơ được nhập tự động từ file Excel: ${file.name}`,
          officer: assignedOfficer,
        },
      ],
      serviceFee,
      depositAmount,
      paidAmount,
      remainingAmount,
      paymentStatus,
      paymentNotes: String(row['Ghi chú'] || ''),
    };

    tempRecords.push(newRecord);
    importedRecords.push(newRecord);
  }

  return importedRecords;
}
