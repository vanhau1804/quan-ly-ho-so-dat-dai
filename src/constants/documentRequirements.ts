import { DocumentRequirement, RecordType, RecordStatus } from '@/types';

export const RECORD_TYPE_CONFIG: Record<
  RecordType,
  { label: string; code: string; color: string; badgeClass: string }
> = {
  chuyen_nhuong: {
    label: 'Chuyển nhượng (Mua bán)',
    code: 'CN',
    color: '#2563eb',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  tang_cho: {
    label: 'Tặng cho quyền SDĐ',
    code: 'TC',
    color: '#059669',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  thua_ke: {
    label: 'Thừa kế quyền SDĐ',
    code: 'TK',
    color: '#7c3aed',
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
  },
  cap_lan_dau: {
    label: 'Cấp Giấy chứng nhận lần đầu',
    code: 'CLD',
    color: '#ea580c',
    badgeClass: 'bg-orange-100 text-orange-800 border-orange-200',
  },
  cap_doi: {
    label: 'Cấp đổi / Cấp lại GCN',
    code: 'CD',
    color: '#0891b2',
    badgeClass: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  },
  chuyen_muc_dich: {
    label: 'Chuyển mục đích sử dụng đất',
    code: 'CMD',
    color: '#d97706',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  the_chap: {
    label: 'Đăng ký thế chấp vay vốn',
    code: 'TCV',
    color: '#e11d48',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
  },
  xoa_the_chap: {
    label: 'Xóa đăng ký thế chấp',
    code: 'XTC',
    color: '#4b5563',
    badgeClass: 'bg-gray-100 text-gray-800 border-gray-200',
  },
  tach_hop_thua: {
    label: 'Tách thửa / Hợp thửa đất',
    code: 'THT',
    color: '#4f46e5',
    badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  },
  cho_thue: {
    label: 'Cho thuê / Cho thuê lại',
    code: 'CT',
    color: '#0d9488',
    badgeClass: 'bg-teal-100 text-teal-800 border-teal-200',
  },
  gop_von: {
    label: 'Góp vốn bằng quyền SDĐ',
    code: 'GV',
    color: '#65a30d',
    badgeClass: 'bg-lime-100 text-lime-800 border-lime-200',
  },
};

export const RECORD_STATUS_CONFIG: Record<
  RecordStatus,
  { label: string; badgeClass: string; dotClass: string }
> = {
  tiep_nhan: {
    label: 'Mới tiếp nhận',
    badgeClass: 'bg-sky-50 text-sky-700 border-sky-300',
    dotClass: 'bg-sky-500',
  },
  dang_xu_ly: {
    label: 'Đang xử lý / Đo đạc',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-300',
    dotClass: 'bg-amber-500',
  },
  cho_thue: {
    label: 'Chờ thông báo thuế',
    badgeClass: 'bg-violet-50 text-violet-700 border-violet-300',
    dotClass: 'bg-violet-500',
  },
  cho_bo_sung: {
    label: 'Chờ bổ sung giấy tờ',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-300',
    dotClass: 'bg-rose-500',
  },
  hoan_thanh: {
    label: 'Đã hoàn thành',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-300',
    dotClass: 'bg-emerald-500',
  },
  da_tra_khach: {
    label: 'Đã trả khách / Đóng HS',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
    dotClass: 'bg-slate-400',
  },
};

// Danh mục mẫu giấy tờ tự động sinh theo từng loại hồ sơ
export const DEFAULT_DOCUMENTS_BY_TYPE: Record<RecordType, Omit<DocumentRequirement, 'submitted' | 'originalType' | 'files'>[]> = {
  chuyen_nhuong: [
    {
      id: 'doc_gcn_goc',
      name: 'Giấy chứng nhận (Sổ đỏ / Sổ hồng) bản gốc',
      required: true,
      description: 'Bản chính phôi sổ đỏ/sổ hồng để nộp đăng bộ sang tên',
    },
    {
      id: 'doc_cccd_2ben',
      name: 'CCCD của bên chuyển nhượng & bên nhận chuyển nhượng',
      required: true,
      description: 'Bản sao công chứng hoặc bản chụp CCCD gắn chip 2 mặt',
    },
    {
      id: 'doc_hon_nhan',
      name: 'Giấy đăng ký kết hôn / Giấy xác nhận độc thân',
      required: true,
      description: 'Chứng minh tài sản chung hay riêng của các bên',
    },
    {
      id: 'doc_hd_cong_chung',
      name: 'Hợp đồng chuyển nhượng quyền sử dụng đất có công chứng',
      required: true,
      description: 'Tối thiểu 03 bản chính công chứng',
    },
    {
      id: 'doc_to_khai_thue',
      name: 'Tờ khai thuế TNCN và Tờ khai lệ phí trước bạ',
      required: true,
      description: 'Kèm mã số thuế cá nhân của 2 bên',
    },
    {
      id: 'doc_trich_luc',
      name: 'Trích lục bản đồ địa chính / Mảnh trích đo thửa đất',
      required: false,
      description: 'Cần thiết nếu có thay đổi ranh giới hoặc diện tích',
    },
  ],

  tang_cho: [
    {
      id: 'doc_gcn_goc',
      name: 'Giấy chứng nhận (Sổ đỏ / Sổ hồng) bản gốc',
      required: true,
      description: 'Bản chính nộp để chỉnh lý trang 3,4 hoặc cấp đổi sổ',
    },
    {
      id: 'doc_hd_tang_cho',
      name: 'Hợp đồng tặng cho quyền sử dụng đất công chứng',
      required: true,
      description: 'Bản chính có công chứng viên chứng nhận',
    },
    {
      id: 'doc_cccd_2ben',
      name: 'CCCD của bên tặng cho & bên nhận tặng cho',
      required: true,
      description: 'Bản sao công chứng hoặc photo có bản chính đối chiếu',
    },
    {
      id: 'doc_quan_he_ruot_thit',
      name: 'Giấy tờ chứng minh quan hệ ruột thịt (để miễn thuế 100%)',
      required: true,
      description: 'Giấy khai sinh, ĐKKH, Giấy xác nhận thông tin cư trú',
    },
    {
      id: 'doc_to_khai_mien_thue',
      name: 'Tờ khai thuế TNCN và Lệ phí trước bạ (Đơn xin miễn thuế)',
      required: true,
      description: 'Theo quy định miễn thuế cho người thân thích ruột thịt',
    },
  ],

  thua_ke: [
    {
      id: 'doc_gcn_goc',
      name: 'Giấy chứng nhận (Sổ đỏ / Sổ hồng) bản gốc',
      required: true,
      description: 'Bản chính của người để lại di sản',
    },
    {
      id: 'doc_trich_luc_khai_tu',
      name: 'Trích lục khai tử của người để lại di sản',
      required: true,
      description: 'Bản sao trích lục khai tử do UBND cấp',
    },
    {
      id: 'doc_van_ban_thua_ke',
      name: 'Văn bản thỏa thuận phân chia di sản / Khai nhận di sản / Di chúc',
      required: true,
      description: 'Đã lập tại Văn phòng công chứng và niêm yết đủ ngày',
    },
    {
      id: 'doc_cccd_thua_ke',
      name: 'CCCD của tất cả những người thuộc hàng thừa kế',
      required: true,
      description: 'Bản sao có công chứng',
    },
    {
      id: 'doc_chung_minh_quan_he',
      name: 'Giấy khai sinh / ĐKKH chứng minh quan hệ thuộc hàng thừa kế',
      required: true,
      description: 'Cơ sở để miễn thuế TNCN và lệ phí trước bạ',
    },
  ],

  cap_lan_dau: [
    {
      id: 'doc_don_04dk',
      name: 'Đơn đăng ký, cấp Giấy chứng nhận (Mẫu 04/ĐK)',
      required: true,
      description: 'Theo quy định Luật Đất đai 2024',
    },
    {
      id: 'doc_giay_to_cu_137',
      name: 'Giấy tờ chứng minh quyền SDĐ theo Điều 137 Luật Đất đai 2024',
      required: true,
      description: 'Sổ trắng, Trích lục địa bộ, Giấy tạm giao, Sổ 299...',
    },
    {
      id: 'doc_trich_do_dia_chinh',
      name: 'Bản trích đo địa chính thửa đất / Bản vẽ hiện trạng',
      required: true,
      description: 'Do đơn vị có chức năng đo đạc địa chính lập',
    },
    {
      id: 'doc_xac_nhan_ubnd_xa',
      name: 'Văn bản xác nhận của UBND cấp xã (sử dụng ổn định, không tranh chấp)',
      required: true,
      description: 'Xác nhận nguồn gốc sử dụng đất và quy hoạch địa phương',
    },
    {
      id: 'doc_cccd_chu_dat',
      name: 'CCCD và xác nhận thông tin cư trú của chủ sử dụng đất',
      required: true,
      description: 'Bản sao công chứng',
    },
  ],

  cap_doi: [
    {
      id: 'doc_don_10dk',
      name: 'Đơn đề nghị cấp đổi / cấp lại Giấy chứng nhận (Mẫu 10/ĐK)',
      required: true,
      description: 'Theo mẫu mới quy định',
    },
    {
      id: 'doc_gcn_cu',
      name: 'Bản gốc Giấy chứng nhận đã cấp (Nếu là cấp đổi)',
      required: false,
      description: 'Trường hợp đổi sổ rách, nát, ố mờ hoặc đổi sang phôi mới',
    },
    {
      id: 'doc_niem_yet_mat_so',
      name: 'Giấy xác nhận đã niêm yết thông báo mất sổ 30 ngày tại xã (Nếu cấp lại)',
      required: false,
      description: 'Chỉ áp dụng với trường hợp bị mất Giấy chứng nhận',
    },
    {
      id: 'doc_trich_do_moi',
      name: 'Bản trích đo địa chính mới (nếu có biến động diện tích)',
      required: false,
      description: 'Khi đo đạc lại phát hiện diện tích thực tế khác diện tích sổ',
    },
    {
      id: 'doc_cccd_chu_so',
      name: 'CCCD của chủ sở hữu',
      required: true,
      description: 'Bản sao công chứng',
    },
  ],

  chuyen_muc_dich: [
    {
      id: 'doc_gcn_goc',
      name: 'Giấy chứng nhận (Sổ đỏ / Sổ hồng) bản gốc',
      required: true,
      description: 'Bản chính thửa đất xin chuyển mục đích',
    },
    {
      id: 'doc_don_xin_cmd',
      name: 'Đơn xin chuyển mục đích sử dụng đất',
      required: true,
      description: 'Nêu rõ diện tích và mục đích xin chuyển sang đất ở',
    },
    {
      id: 'doc_trich_luc_quy_hoach',
      name: 'Trích lục vị trí thửa đất & Giấy xác nhận phù hợp quy hoạch',
      required: true,
      description: 'Phù hợp Kế hoạch sử dụng đất hàng năm của cấp huyện',
    },
    {
      id: 'doc_cccd_chu_dat',
      name: 'CCCD của chủ sử dụng đất',
      required: true,
      description: 'Bản sao công chứng',
    },
  ],

  the_chap: [
    {
      id: 'doc_gcn_goc',
      name: 'Giấy chứng nhận (Sổ đỏ / Sổ hồng) bản gốc',
      required: true,
      description: 'Bản chính giao ngân hàng phong tỏa và đăng ký',
    },
    {
      id: 'doc_hd_the_chap',
      name: 'Hợp đồng thế chấp quyền sử dụng đất có công chứng',
      required: true,
      description: 'Kèm theo hợp đồng tín dụng vay vốn',
    },
    {
      id: 'doc_don_dk_bpbd',
      name: 'Phiếu yêu cầu đăng ký biện pháp bảo đảm',
      required: true,
      description: 'Mẫu theo quy định của Bộ Tư pháp',
    },
    {
      id: 'doc_cccd_chu_so_huu',
      name: 'CCCD của chủ sở hữu nhà đất và bên vay',
      required: true,
      description: 'Bản sao đối chiếu',
    },
  ],

  xoa_the_chap: [
    {
      id: 'doc_gcn_the_chap',
      name: 'Bản gốc Giấy chứng nhận (có ghi nội dung thế chấp)',
      required: true,
      description: 'Để xóa chứng nhận thế chấp tại Trang 4 hoặc Trang bổ sung',
    },
    {
      id: 'doc_don_xoa_bpbd',
      name: 'Phiếu yêu cầu xóa đăng ký biện pháp bảo đảm',
      required: true,
      description: 'Do ngân hàng hoặc bên bảo đảm ký',
    },
    {
      id: 'doc_vb_dong_y_xoa',
      name: 'Văn bản đồng ý xóa thế chấp / Giải chấp của Ngân hàng',
      required: true,
      description: 'Bản chính của tổ chức tín dụng',
    },
  ],

  tach_hop_thua: [
    {
      id: 'doc_gcn_goc',
      name: 'Giấy chứng nhận (Sổ đỏ / Sổ hồng) bản gốc',
      required: true,
      description: 'Bản gốc các thửa đất xin tách hoặc hợp',
    },
    {
      id: 'doc_don_tach_thua',
      name: 'Đơn đề nghị tách thửa / hợp thửa đất (Mẫu quy định)',
      required: true,
      description: 'Nêu rõ nhu cầu và kích thước các thửa mới hình thành',
    },
    {
      id: 'doc_ban_ve_tach_thua',
      name: 'Bản vẽ trích đo địa chính phân chia thửa đất / hợp thửa',
      required: true,
      description: 'Đảm bảo diện tích và bề rộng tối thiểu theo quy định của Tỉnh',
    },
    {
      id: 'doc_cccd_chu_dat',
      name: 'CCCD của người sử dụng đất',
      required: true,
      description: 'Bản sao công chứng',
    },
  ],

  cho_thue: [
    {
      id: 'doc_gcn_goc',
      name: 'Bản gốc Giấy chứng nhận quyền sử dụng đất',
      required: true,
      description: 'Chứng minh quyền của bên cho thuê',
    },
    {
      id: 'doc_hd_cho_thue',
      name: 'Hợp đồng cho thuê / cho thuê lại quyền SDĐ công chứng',
      required: true,
      description: 'Quy định thời hạn và điều kiện thanh toán',
    },
    {
      id: 'doc_phap_nhan_2ben',
      name: 'CCCD / Giấy chứng nhận đăng ký kinh doanh 2 bên',
      required: true,
      description: 'Bản sao công chứng',
    },
  ],

  gop_von: [
    {
      id: 'doc_gcn_goc',
      name: 'Bản gốc Giấy chứng nhận quyền sử dụng đất',
      required: true,
      description: 'Bản chính tài sản góp vốn',
    },
    {
      id: 'doc_hd_gop_von',
      name: 'Hợp đồng góp vốn bằng quyền sử dụng đất có công chứng',
      required: true,
      description: 'Kèm biên bản định giá tài sản góp vốn',
    },
    {
      id: 'doc_dkkd_doanh_nghiep',
      name: 'Giấy đăng ký doanh nghiệp của bên nhận góp vốn',
      required: true,
      description: 'Bản sao công chứng',
    },
    {
      id: 'doc_cccd_nguoi_gop',
      name: 'CCCD của người góp vốn',
      required: true,
      description: 'Bản sao công chứng',
    },
  ],
};

// Hàm tiện ích tạo danh sách checklist mặc định cho 1 loại hồ sơ
export function createDefaultDocumentList(type: RecordType): DocumentRequirement[] {
  const templateList = DEFAULT_DOCUMENTS_BY_TYPE[type] || DEFAULT_DOCUMENTS_BY_TYPE.chuyen_nhuong;
  return templateList.map((item) => ({
    ...item,
    submitted: false,
    originalType: 'original',
    files: [],
  }));
}
