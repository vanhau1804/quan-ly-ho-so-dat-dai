'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { LandRecord, RecordType, RecordStatus, User } from '@/types';
import {
  getAllRecords,
  saveRecord,
  deleteRecord,
  importRecordsBatch,
  resetToDefaultRecords,
  generateNextRecordId,
  getCurrentUser,
  logout,
} from '@/lib/storage';
import { exportRecordsToExcel, downloadExcelTemplate } from '@/lib/excel';
import { Header } from '@/components/Header';
import { DashboardStats } from '@/components/DashboardStats';
import { FilterBar } from '@/components/FilterBar';
import { RecordTable } from '@/components/RecordTable';
import { RecordModal } from '@/components/RecordModal';
import { RecordDetailModal } from '@/components/RecordDetailModal';
import { ExcelImportModal } from '@/components/ExcelImportModal';
import { LoginForm } from '@/components/LoginForm';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [records, setRecords] = useState<LandRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Bộ lọc & Tìm kiếm
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedType, setSelectedType] = useState<RecordType | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<RecordStatus | 'all'>('all');
  const [selectedOfficer, setSelectedOfficer] = useState<string>('all');

  // Quản lý Modal
  const [isRecordModalOpen, setIsRecordModalOpen] = useState<boolean>(false);
  const [recordToEdit, setRecordToEdit] = useState<LandRecord | null>(null);
  const [selectedDetailRecord, setSelectedDetailRecord] = useState<LandRecord | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);

  // Tải dữ liệu ban đầu từ IndexedDB
  const loadRecords = async () => {
    setIsLoading(true);
    try {
      const data = await getAllRecords();
      setRecords(data);
    } catch (err) {
      console.error('Lỗi khi tải hồ sơ:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      setCurrentUser(getCurrentUser());
      await loadRecords();
    };
    init();
  }, []);

  // Danh sách các cán bộ phụ trách duy nhất để đưa vào bộ lọc
  const officerList = useMemo(() => {
    const set = new Set<string>();
    records.forEach((r) => {
      if (r.assignedOfficer && r.assignedOfficer.trim()) {
        set.add(r.assignedOfficer.trim());
      }
    });
    return Array.from(set);
  }, [records]);

  // Lọc dữ liệu theo các tiêu chí
  const filteredRecords = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return records.filter((r) => {
      // Nếu là chuyên viên, chỉ xem được hồ sơ của mình (hoặc hồ sơ chưa giao)
      if (currentUser?.role === 'officer') {
        if (r.assignedOfficer !== currentUser.fullName && r.assignedOfficer !== 'Chuyên viên pháp lý') {
          return false;
        }
      }

      // Tìm kiếm từ khóa
      if (q) {
        const matchName = r.customerName?.toLowerCase().includes(q);
        const matchId = r.id?.toLowerCase().includes(q);
        const matchPhone = r.customerPhone?.toLowerCase().includes(q);
        const matchCCCD = r.customerIdNumber?.toLowerCase().includes(q);
        const matchPlot = r.plotNumber?.toLowerCase().includes(q);
        const matchSheet = r.mapSheetNumber?.toLowerCase().includes(q);
        const matchAddress = r.landAddress?.toLowerCase().includes(q);
        const matchCert = r.certificateNumber?.toLowerCase().includes(q);

        if (
          !matchName &&
          !matchId &&
          !matchPhone &&
          !matchCCCD &&
          !matchPlot &&
          !matchSheet &&
          !matchAddress &&
          !matchCert
        ) {
          return false;
        }
      }

      // Lọc loại hồ sơ
      if (selectedType !== 'all' && r.recordType !== selectedType) {
        return false;
      }

      // Lọc trạng thái
      if (selectedStatus !== 'all' && r.status !== selectedStatus) {
        return false;
      }

      // Lọc cán bộ phụ trách
      if (selectedOfficer !== 'all' && r.assignedOfficer !== selectedOfficer) {
        return false;
      }

      return true;
    });
  }, [records, searchQuery, selectedType, selectedStatus, selectedOfficer, currentUser]);

  // Thao tác Lưu hồ sơ (Tạo mới hoặc Sửa)
  const handleSaveRecord = async (savedRecord: LandRecord) => {
    try {
      // Nếu người tạo là officer, tự động gán tên họ nếu hồ sơ mới hoặc chưa có người phụ trách
      if (currentUser?.role === 'officer' && (!savedRecord.assignedOfficer || savedRecord.assignedOfficer === 'Chuyên viên pháp lý')) {
        savedRecord.assignedOfficer = currentUser.fullName;
      }

      await saveRecord(savedRecord);
      await loadRecords();
    } catch (err) {
      console.error('Lỗi khi lưu hồ sơ:', err);
      alert('Không thể lưu hồ sơ vào cơ sở dữ liệu.');
    }
  };

  // Thao tác Xóa hồ sơ
  const handleDeleteRecord = async (id: string) => {
    if (currentUser?.role !== 'admin' && currentUser?.role !== 'manager') {
      alert('Bạn không có quyền xóa hồ sơ!');
      return;
    }
    try {
      await deleteRecord(id);
      await loadRecords();
    } catch (err) {
      console.error('Lỗi khi xóa hồ sơ:', err);
      alert('Không thể xóa hồ sơ.');
    }
  };

  // Cập nhật trạng thái và nhật ký từ trang chi tiết
  const handleUpdateStatus = async (
    id: string,
    newStatus: RecordStatus,
    note: string
  ) => {
    const current = records.find((r) => r.id === id);
    if (!current) return;

    const updated: LandRecord = {
      ...current,
      status: newStatus,
      updatedAt: new Date().toISOString(),
      progressLogs: [
        ...current.progressLogs,
        {
          id: `log_${Date.now()}`,
          date: new Date().toISOString().slice(0, 10),
          status: newStatus,
          note,
          officer: currentUser?.fullName || current.assignedOfficer,
        },
      ],
    };

    await handleSaveRecord(updated);
    setSelectedDetailRecord(updated);
  };

  // Nhập hồ sơ từ Excel thành công
  const handleImportSuccess = async (imported: LandRecord[]) => {
    try {
      await importRecordsBatch(imported);
      await loadRecords();
      alert(`Đã nạp thành công ${imported.length} hồ sơ vào hệ thống!`);
    } catch (err) {
      console.error('Lỗi import:', err);
      alert('Lỗi trong quá trình nạp hồ sơ từ Excel.');
    }
  };

  // Đặt lại dữ liệu mẫu ban đầu
  const handleResetData = async () => {
    if (currentUser?.role !== 'admin') {
      alert('Chỉ Quản trị viên (Admin) mới có quyền reset dữ liệu!');
      return;
    }
    if (
      confirm(
        'Bạn có chắc chắn muốn nạp lại bộ dữ liệu mẫu ban đầu? Toàn bộ các thay đổi cục bộ hiện tại sẽ được reset về mặc định.'
      )
    ) {
      await resetToDefaultRecords();
      await loadRecords();
    }
  };

  const [suggestedNextId, setSuggestedNextId] = useState('HS-2026-001');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSuggestedNextId(generateNextRecordId(records));
  }, [records]);

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <LoginForm onLoginSuccess={setCurrentUser} />;
  }

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* Header thanh điều hướng & tác vụ */}
      <Header
        onOpenCreateModal={() => {
          setRecordToEdit(null);
          setIsRecordModalOpen(true);
        }}
        onOpenImportModal={() => setIsImportModalOpen(true)}
        onExportExcel={() => exportRecordsToExcel(filteredRecords)}
        onDownloadTemplate={downloadExcelTemplate}
        onResetData={handleResetData}
        totalRecords={records.length}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Khối thống kê chỉ số Dashboard */}
        <DashboardStats records={filteredRecords} />

        {/* Thanh tìm kiếm và bộ lọc đa tiêu chí */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          officers={officerList}
          selectedOfficer={selectedOfficer}
          onOfficerChange={setSelectedOfficer}
          onResetFilters={() => {
            setSearchQuery('');
            setSelectedType('all');
            setSelectedStatus('all');
            setSelectedOfficer('all');
          }}
          totalFiltered={filteredRecords.length}
        />

        {/* Bảng dữ liệu hồ sơ đất đai */}
        {isLoading ? (
          <div className="bg-white rounded-xl border border-slate-200 p-16 flex flex-col items-center justify-center text-slate-500 shadow-xs">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-3" />
            <p className="text-sm font-medium">Đang tải cơ sở dữ liệu hồ sơ đất đai...</p>
          </div>
        ) : (
          <RecordTable
            records={filteredRecords}
            currentUser={currentUser}
            onViewDetail={(rec) => setSelectedDetailRecord(rec)}
            onEdit={(rec) => {
              setRecordToEdit(rec);
              setIsRecordModalOpen(true);
            }}
            onDelete={handleDeleteRecord}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Hệ thống Quản lý Hồ sơ Đất đai & Theo dõi Tiến độ Dịch vụ • Luật Đất đai 2024
          </span>
          <span className="text-slate-400">
            Dữ liệu lưu trữ an toàn trong IndexedDB của trình duyệt • Sẵn sàng triển khai Vercel
          </span>
        </div>
      </footer>

      {/* Modal Tạo mới / Chỉnh sửa hồ sơ (6 nhóm trường) */}
      <RecordModal
        isOpen={isRecordModalOpen}
        onClose={() => {
          setIsRecordModalOpen(false);
          setRecordToEdit(null);
        }}
        onSave={handleSaveRecord}
        recordToEdit={recordToEdit}
        suggestedId={suggestedNextId}
      />

      {/* Modal Xem chi tiết hồ sơ & In phiếu */}
      <RecordDetailModal
        record={selectedDetailRecord}
        isOpen={Boolean(selectedDetailRecord)}
        onClose={() => setSelectedDetailRecord(null)}
        onEdit={(rec) => {
          setSelectedDetailRecord(null);
          setRecordToEdit(rec);
          setIsRecordModalOpen(true);
        }}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Modal Nhập dữ liệu từ Excel (.xlsx) */}
      <ExcelImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportSuccess={handleImportSuccess}
        existingRecords={records}
      />
    </div>
  );
}
