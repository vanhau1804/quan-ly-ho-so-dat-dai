'use client';

import React from 'react';
import { User } from '@/types';
import { login, getAllUsers } from '@/lib/storage';

interface LoginFormProps {
  onLoginSuccess: (user: User) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const users = getAllUsers();

  const handleLogin = async (username: string) => {
    const user = await login(username);
    if (user) {
      onLoginSuccess(user);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Quản lý Hồ sơ Đất đai</h1>
          <p className="text-sm text-slate-500 mt-2">Đăng nhập hệ thống nội bộ</p>
        </div>

        <div className="space-y-3">
          {users.map((user) => (
            <button
              key={user.id}
              onClick={() => handleLogin(user.username)}
              className="w-full text-left px-5 py-4 border border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-colors flex items-center justify-between group"
            >
              <div>
                <div className="font-semibold text-slate-900 group-hover:text-blue-700">
                  {user.fullName}
                </div>
                <div className="text-sm text-slate-500">
                  Vai trò: <span className="capitalize">
                    {user.role === 'admin' ? 'Quản trị viên' : 
                     user.role === 'manager' ? 'Quản lý' : 
                     'Chuyên viên'}
                  </span>
                </div>
              </div>
              <div className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                →
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
