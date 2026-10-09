import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Hệ Thống Quản Lý Hồ Sơ Đất Đai & Tiến Độ Dịch Vụ',
  description: 'Phần mềm quản lý hồ sơ giấy tờ đất đai, theo dõi tiến độ xử lý và tài chính dịch vụ nhà đất tại Việt Nam',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-100 text-slate-900">
        {children}
      </body>
    </html>
  );
}
