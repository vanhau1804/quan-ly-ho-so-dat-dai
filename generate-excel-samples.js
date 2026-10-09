const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const outputDir = 'C:\\Users\\Dell\\Desktop\\file_excel_mau_test';

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Hàm hỗ trợ xuất file Excel với độ rộng cột đẹp mắt
function saveExcelFile(filename, rows) {
  const worksheet = XLSX.utils.json_to_sheet(rows);

  worksheet['!cols'] = [
    { wch: 15 }, // Mã hồ sơ
    { wch: 25 }, // Khách hàng
    { wch: 18 }, // CCCD / MST
    { wch: 14 }, // SĐT
    { wch: 35 }, // Địa chỉ khách hàng
    { wch: 22 }, // Người đồng sở hữu
    { wch: 25 }, // Loại hồ sơ
    { wch: 38 }, // Địa chỉ thửa đất
    { wch: 10 }, // Số thửa
    { wch: 10 }, // Tờ bản đồ
    { wch: 15 }, // Diện tích (m²)
    { wch: 16 }, // Loại đất
    { wch: 20 }, // Số GCN
    { wch: 14 }, // Ngày tiếp nhận
    { wch: 20 }, // Người phụ trách
    { wch: 32 }, // Cơ quan xử lý
    { wch: 20 }, // Trạng thái
    { wch: 15 }, // Ngày nộp cơ quan
    { wch: 15 }, // Ngày hẹn trả KQ
    { wch: 18 }, // Giá trị HĐ (VNĐ)
    { wch: 16 }, // Tiền tạm ứng (VNĐ)
    { wch: 18 }, // Đã thanh toán (VNĐ)
    { wch: 30 }, // Ghi chú
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Ho_so');
  const fullPath = path.join(outputDir, filename);
  XLSX.writeFile(workbook, fullPath);
  console.log(`Created: ${fullPath}`);
}

// 1. Mẫu Hợp đồng Chuyển nhượng (Mua bán đất)
const sample1 = [
  {
    'Mã hồ sơ': 'HS-2026-101',
    'Khách hàng': 'Trần Văn Nam',
    'CCCD / MST': '001089012345',
    'Số điện thoại': '0912888999',
    'Địa chỉ khách hàng': 'Số 28 Phố Trung Hòa, Cầu Giấy, Hà Nội',
    'Người đồng sở hữu': 'Lê Thị Hoa (Vợ)',
    'Loại hồ sơ': 'Chuyển nhượng (Mua bán)',
    'Địa chỉ thửa đất': 'Thôn Phú Mỹ, Phường Mỹ Đình 2, Nam Từ Liêm, Hà Nội',
    'Số thửa': '68',
    'Tờ bản đồ': '15',
    'Diện tích (m²)': 110.5,
    'Loại đất': 'ONT',
    'Số GCN (Sổ đỏ/hồng)': 'CS 889977',
    'Ngày tiếp nhận': '2026-03-05',
    'Người phụ trách': 'Lê Văn Minh',
    'Cơ quan xử lý': 'Chi nhánh VPĐKĐĐ Nam Từ Liêm',
    'Trạng thái': 'Đang xử lý',
    'Ngày nộp cơ quan': '2026-03-06',
    'Ngày hẹn trả KQ': '2026-03-24',
    'Giá trị HĐ (VNĐ)': 18000000,
    'Tiền tạm ứng (VNĐ)': 9000000,
    'Đã thanh toán (VNĐ)': 9000000,
    'Ghi chú': 'Hồ sơ mua bán nhà đất thổ cư, đã công chứng tại VPCC Thăng Long',
  },
];

// 2. Mẫu Hợp đồng Tặng cho quyền sử dụng đất
const sample2 = [
  {
    'Mã hồ sơ': 'HS-2026-102',
    'Khách hàng': 'Nguyễn Thị Lan',
    'CCCD / MST': '079192004561',
    'Số điện thoại': '0903112233',
    'Địa chỉ khách hàng': 'Căn hộ 12B Tháp Sapphire, Bến Nghé, Quận 1, TP. HCM',
    'Người đồng sở hữu': 'Bố mẹ ruột tặng cho',
    'Loại hồ sơ': 'Tặng cho quyền SDĐ',
    'Địa chỉ thửa đất': 'Đường Quốc Hương, Phường Thảo Điền, TP. Thủ Đức, TP. HCM',
    'Số thửa': '24',
    'Tờ bản đồ': '3',
    'Diện tích (m²)': 250.0,
    'Loại đất': 'ODT',
    'Số GCN (Sổ đỏ/hồng)': 'BA 123789',
    'Ngày tiếp nhận': '2026-03-08',
    'Người phụ trách': 'Hoàng Quốc Việt',
    'Cơ quan xử lý': 'Chi nhánh VPĐKĐĐ TP. Thủ Đức',
    'Trạng thái': 'Mới tiếp nhận',
    'Ngày nộp cơ quan': '',
    'Ngày hẹn trả KQ': '2026-03-30',
    'Giá trị HĐ (VNĐ)': 12000000,
    'Tiền tạm ứng (VNĐ)': 5000000,
    'Đã thanh toán (VNĐ)': 5000000,
    'Ghi chú': 'Tặng cho giữa cha mẹ và con gái, làm thủ tục miễn thuế TNCN và lệ phí trước bạ',
  },
];

// 3. Mẫu Hồ sơ Khai nhận Thừa kế quyền sử dụng đất
const sample3 = [
  {
    'Mã hồ sơ': 'HS-2026-103',
    'Khách hàng': 'Vũ Đình Trọng',
    'CCCD / MST': '036087009812',
    'Số điện thoại': '0988665544',
    'Địa chỉ khách hàng': 'Số 45 Phố Lê Hồng Phong, TP. Thái Bình',
    'Người đồng sở hữu': 'Các đồng thừa kế hàng thứ nhất',
    'Loại hồ sơ': 'Thừa kế quyền SDĐ',
    'Địa chỉ thửa đất': 'Xã Vũ Phúc, TP. Thái Bình, Tỉnh Thái Bình',
    'Số thửa': '105',
    'Tờ bản đồ': '22',
    'Diện tích (m²)': 450.0,
    'Loại đất': 'ONT + CLN',
    'Số GCN (Sổ đỏ/hồng)': 'Sổ đỏ cũ NĐ 64/CP',
    'Ngày tiếp nhận': '2026-02-28',
    'Người phụ trách': 'Lê Văn Minh',
    'Cơ quan xử lý': 'Chi nhánh VPĐKĐĐ TP. Thái Bình & Chi cục Thuế',
    'Trạng thái': 'Chờ thông báo thuế',
    'Ngày nộp cơ quan': '2026-03-02',
    'Ngày hẹn trả KQ': '2026-03-20',
    'Giá trị HĐ (VNĐ)': 22000000,
    'Tiền tạm ứng (VNĐ)': 10000000,
    'Đã thanh toán (VNĐ)': 10000000,
    'Ghi chú': 'Khai nhận di sản thừa kế theo di chúc, đã niêm yết đủ 15 ngày tại UBND xã',
  },
];

// 4. Mẫu Hồ sơ Chuyển mục đích sử dụng đất (Lên thổ cư)
const sample4 = [
  {
    'Mã hồ sơ': 'HS-2026-104',
    'Khách hàng': 'Phạm Quang Hưng',
    'CCCD / MST': '074093001289',
    'Số điện thoại': '0977223344',
    'Địa chỉ khách hàng': 'Ấp 3, Xã Phú Chánh, TX. Tân Uyên, Bình Dương',
    'Người đồng sở hữu': '',
    'Loại hồ sơ': 'Chuyển mục đích sử dụng đất',
    'Địa chỉ thửa đất': 'Khu phố 1, Phường Tân Phước Khánh, TX. Tân Uyên, Bình Dương',
    'Số thửa': '312',
    'Tờ bản đồ': '45',
    'Diện tích (m²)': 500.0,
    'Loại đất': 'CLN (Xin chuyển 200m² lên ONT)',
    'Số GCN (Sổ đỏ/hồng)': 'CH 456123',
    'Ngày tiếp nhận': '2026-03-01',
    'Người phụ trách': 'Đặng Thanh Tâm',
    'Cơ quan xử lý': 'Phòng TN&MT TX. Tân Uyên',
    'Trạng thái': 'Đang xử lý',
    'Ngày nộp cơ quan': '2026-03-03',
    'Ngày hẹn trả KQ': '2026-04-05',
    'Giá trị HĐ (VNĐ)': 35000000,
    'Tiền tạm ứng (VNĐ)': 15000000,
    'Đã thanh toán (VNĐ)': 15000000,
    'Ghi chú': 'Xin chuyển 200m² cây lâu năm sang đất ở nông thôn, phù hợp quy hoạch 2026',
  },
];

// 5. Mẫu Hợp đồng Đăng ký Thế chấp vay vốn Ngân hàng
const sample5 = [
  {
    'Mã hồ sơ': 'HS-2026-105',
    'Khách hàng': 'Công ty TNHH Xây dựng Đông Á',
    'CCCD / MST': '0108998877',
    'Số điện thoại': '0918990011',
    'Địa chỉ khách hàng': 'Tầng 6 Tòa nhà Charmvit, Trần Duy Hưng, Cầu Giấy, Hà Nội',
    'Người đồng sở hữu': 'Đỗ Hoàng Long (Đại diện pháp luật)',
    'Loại hồ sơ': 'Đăng ký thế chấp vay vốn',
    'Địa chỉ thửa đất': 'Cụm Công nghiệp Quất Động, Huyện Thường Tín, Hà Nội',
    'Số thửa': '89',
    'Tờ bản đồ': '6',
    'Diện tích (m²)': 3200.0,
    'Loại đất': 'SKC',
    'Số GCN (Sổ đỏ/hồng)': 'CT 998811',
    'Ngày tiếp nhận': '2026-03-09',
    'Người phụ trách': 'Phan Thu Hà',
    'Cơ quan xử lý': 'Chi nhánh VPĐKĐĐ Huyện Thường Tín',
    'Trạng thái': 'Mới tiếp nhận',
    'Ngày nộp cơ quan': '',
    'Ngày hẹn trả KQ': '2026-03-12',
    'Giá trị HĐ (VNĐ)': 8000000,
    'Tiền tạm ứng (VNĐ)': 8000000,
    'Đã thanh toán (VNĐ)': 8000000,
    'Ghi chú': 'Đăng ký thế chấp quyền sử dụng đất tại Vietcombank để giải ngân vốn lưu động',
  },
];

// 6. File Tổng hợp gồm cả 5 loại hồ sơ
const allSamples = [...sample1, ...sample2, ...sample3, ...sample4, ...sample5];

saveExcelFile('01_Hop_dong_Chuyen_nhuong_dat.xlsx', sample1);
saveExcelFile('02_Hop_dong_Tang_cho_nha_dat.xlsx', sample2);
saveExcelFile('03_Ho_so_Khai_nhan_Thua_ke_dat.xlsx', sample3);
saveExcelFile('04_Ho_so_Chuyen_muc_dich_dat.xlsx', sample4);
saveExcelFile('05_Hop_dong_The_chap_vay_ngan_hang.xlsx', sample5);
saveExcelFile('00_Tong_hop_5_loai_ho_so_test.xlsx', allSamples);

console.log('Hoàn tất tạo 5 file Excel mẫu!');
