import React, { useState } from 'react';
import { ShieldAlert, Terminal, KeyRound } from 'lucide-react';

export default function LoginScreen({ onStart, isLoading }) {
  const [idInput, setIdInput] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!idInput.trim()) {
      setError('請輸入有效的 ID');
      return;
    }
    setError('');
    onStart(idInput.trim());
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4">
      <div className="eva-panel max-w-md w-full relative">
        {/* 頂部斜邊警告條 */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-500 to-amber-500"></div>
        
        {/* NERV 風格標籤 */}
        <div className="flex justify-between items-center mb-6 border-b border-orange-500 pb-3">
          <div className="flex items-center gap-2">
            <Terminal className="text-orange-500 animate-pulse" size={20} />
            <span className="font-tech text-sm tracking-widest text-orange-500">SYSTEM: NERV_LOGIN_v2.09</span>
          </div>
          <span className="tag">TOP SECRET</span>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-black neon-title mb-2 text-orange-500 tracking-wider">
            認知能力適性測驗
          </h1>
          <p className="text-xs font-tech text-muted tracking-widest uppercase">
            Cognitive Compatibility & Aptitude Test
          </p>
        </div>

        {/* 警示區塊 */}
        <div className="alert-flash p-4 mb-6 text-sm flex gap-3 items-start border border-orange-500/30 bg-orange-500/5">
          <ShieldAlert className="text-orange-500 shrink-0 mt-0.5" size={18} />
          <div>
            <p className="font-bold text-orange-500 mb-1">警告 / SECURITY WARNING</p>
            <p className="text-muted text-xs leading-relaxed">
              本測試系統僅限授權人員登入。輸入您的 ID 後，系統將隨機抽取題目並將答題數據（包括次數、最高分與時間）自動同步至 NERV 中央資料庫。
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-orange-500 mb-2 tracking-widest uppercase">
              請輸入個人識別 ID / PILOT IDENTIFICATION ID
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-orange-500/50">
                <KeyRound size={18} />
              </div>
              <input
                type="text"
                value={idInput}
                onChange={(e) => {
                  setIdInput(e.target.value);
                  if (error) setError('');
                }}
                className="eva-input pl-10"
                placeholder="例如: Shinji_Ikari"
                maxLength={30}
                disabled={isLoading}
              />
            </div>
            {error && (
              <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                <span>⚠️ {error}</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="eva-button w-full text-center"
          >
            {isLoading ? (
              <span className="flex items-center gap-2 justify-center">
                <span className="animate-spin h-4 w-4 border-2 border-orange-500 border-t-transparent rounded-full"></span>
                連線同步中...
              </span>
            ) : (
              '初始化連線 & 啟動測試'
            )}
          </button>
        </form>

        {/* 底部裝飾數字 */}
        <div className="mt-8 pt-4 border-t border-orange-500/10 flex justify-between text-[10px] font-tech text-muted">
          <span>CODE: 0x2F91A</span>
          <span>SYNC-RATE: 100%</span>
          <span>STATUS: ONLINE</span>
        </div>
      </div>
    </div>
  );
}
