import React, { useState } from 'react';
import { apiService } from '../services/apiService';
import { User } from '../types';

interface LoginModalProps {
  onLogin: (user: User) => void;
  onClose: () => void;
}

export default function LoginModal({ onLogin, onClose }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await apiService.login({ email, password });
      onLogin(user);
      onClose();
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#E4E3E0] border border-[#141414] p-8 rounded-2xl w-full max-w-md shadow-2xl">
        <h2 className="text-3xl font-bold tracking-tighter uppercase italic font-serif mb-6">Login</h2>
        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase font-bold mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border border-[#141414] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#141414]/20"
              required
            />
          </div>
          <div>
            <label className="block text-xs uppercase font-bold mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border border-[#141414] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#141414]/20"
              required
            />
          </div>
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-[#141414] py-2 rounded-lg hover:bg-white transition-colors uppercase text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-[#141414] text-white py-2 rounded-lg hover:bg-[#141414]/90 transition-colors uppercase text-xs font-bold"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
