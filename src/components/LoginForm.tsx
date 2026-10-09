'use client';

import React, { useState } from 'react';
import { User } from '@/types';
import { login } from '@/lib/storage';

interface LoginFormProps {
  onLoginSuccess: (user: User) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Vui lòng nhập tài khoản và mật khẩu.');
      return;
    }

    const user = await login(username, password);
    if (user) {
      onLoginSuccess(user);
    } else {
      setError('Tài khoản hoặc mật khẩu không đúng (Mật khẩu mặc định là: 123).');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Quản lý Hồ sơ Đất đai</h1>
          <p className="text-sm text-slate-500 mt-2">Đăng nhập hệ thống nội bộ</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Tài khoản
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập tên đăng nhập (vd: admin, manager, officer1)"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Mật khẩu
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu (123)"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {error && (
            <div className="text-sm text-rose-600 font-medium bg-rose-50 p-2 rounded-md border border-rose-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm mt-4"
          >
            Đăng nhập
          </button>
        </form>

        <div className="mt-8 text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
          <p className="font-semibold mb-1">Tài khoản demo:</p>
          <ul className="list-disc pl-4 space-y-0.5">
            <li><strong>admin</strong> (Quản trị viên) - 123</li>
            <li><strong>manager</strong> (Quản lý) - 123</li>
            <li><strong>officer1</strong> (Chuyên viên) - 123</li>
            <li><strong>officer2</strong> (Chuyên viên) - 123</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
