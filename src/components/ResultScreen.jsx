import React from 'react';
import { Award, ShieldAlert, RotateCcw, BarChart3, Clock, Milestone } from 'lucide-react';

export default function ResultScreen({ resultData, onRestart, passThreshold }) {
  const { score, totalQuestions, passed, stats } = resultData;

  // 取得格式化時間 (只顯示日期與時間，去除時區雜訊)
  const formatTime = (timeStr) => {
    if (!timeStr) return '-';
    return timeStr;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* 警示條紋 */}
      <div className="mb-8">
        <div className={`warning-bar ${passed ? '' : 'danger'}`}></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        
        {/* 左側：主視覺 (CLEAR 或 FAILED) */}
        <div className="lg:col-span-1 flex flex-col justify-between">
          <div className={`eva-panel h-full flex flex-col justify-center items-center text-center p-8 ${passed ? 'success' : 'danger'}`}>
            {passed ? (
              <>
                <div className="w-20 h-20 bg-green-500/10 border border-green-500 rounded-full flex items-center justify-center mb-6 animate-bounce">
                  <Award className="text-green-500" size={40} />
                </div>
                <h1 className="text-4xl font-black neon-title text-green-500 tracking-wider mb-2">
                  STAGE CLEAR
                </h1>
                <p className="text-xs font-tech text-green-500/70 tracking-widest uppercase mb-6">
                  Mission Complete
                </p>
                <div className="speech-bubble w-full bg-green-500/5 border-green-500/30 text-xs">
                  <p className="text-green-500 font-bold mb-1">NERV 綜合評價：</p>
                  <p className="text-white">
                    您的認知波長與同步率極佳，已順利通過本測試，成功解鎖機甲限制器！
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-red-500/10 border border-red-500 rounded-full flex items-center justify-center mb-6 animate-pulse">
                  <ShieldAlert className="text-red-500" size={40} />
                </div>
                <h1 className="text-4xl font-black neon-title text-red-500 tracking-wider mb-2">
                  MISSION FAILED
                </h1>
                <p className="text-xs font-tech text-red-500/70 tracking-widest uppercase mb-6">
                  Critical Error / Synced Failed
                </p>
                <div className="speech-bubble w-full bg-red-500/5 border-red-500/30 text-xs">
                  <p className="text-red-500 font-bold mb-1">NERV 綜合評價：</p>
                  <p className="text-white">
                    分數低於通過門檻（需要答對 {passThreshold} 題）。請重整狀態重新連線測試。
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* 右側：數據統計區 */}
        <div className="lg:col-span-2">
          <div className="eva-panel h-full flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6 border-b border-orange-500/30 pb-3">
                <div className="flex items-center gap-2">
                  <BarChart3 className="text-orange-500" size={20} />
                  <span className="font-tech text-sm tracking-widest text-orange-500">PILOT STATS DATA</span>
                </div>
                <span className="tag">DATABASE CONNECTED</span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-orange-500/5 border border-orange-500/20 p-4">
                  <span className="block text-[10px] text-muted font-tech tracking-widest uppercase">本次得分</span>
                  <span className="text-3xl font-black text-white font-tech">
                    {score} <span className="text-sm text-muted">/ {totalQuestions} 題</span>
                  </span>
                </div>
                <div className="bg-orange-500/5 border border-orange-500/20 p-4">
                  <span className="block text-[10px] text-muted font-tech tracking-widest uppercase">通關結果</span>
                  <span className={`text-xl font-bold font-tech ${passed ? 'text-green-500' : 'text-red-500'}`}>
                    {passed ? 'SUCCESS (PASS)' : 'FAILED (REJECT)'}
                  </span>
                </div>
              </div>

              {/* 詳細歷程數據表 */}
              <h3 className="font-bold text-sm text-orange-500 tracking-wider mb-2 flex items-center gap-2">
                <Milestone size={16} /> 歷史存檔紀錄
              </h3>
              <table className="stats-table">
                <thead>
                  <tr>
                    <th>項目 / Metric</th>
                    <th>數值 / Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>駕駛員識別 ID (Pilot ID)</td>
                    <td className="font-bold text-white">{stats.userId}</td>
                  </tr>
                  <tr>
                    <td>累積挑戰次數 (Play Count)</td>
                    <td className="font-tech text-white">{stats.playCount} 次</td>
                  </tr>
                  <tr>
                    <td>歷史最高分 (Highest Score)</td>
                    <td className="font-tech text-white">{stats.maxScore} 題</td>
                  </tr>
                  <tr>
                    <td>首次通關分數 (First Pass Score)</td>
                    <td className="font-tech text-white">
                      {stats.firstPassScore !== "" && stats.firstPassScore !== undefined && stats.firstPassScore !== null
                        ? `${stats.firstPassScore} 題` 
                        : '尚未通關'}
                    </td>
                  </tr>
                  <tr>
                    <td>首次通關花了幾次 (Tries to Pass)</td>
                    <td className="font-tech text-white">
                      {stats.triesToPass !== "" && stats.triesToPass !== undefined && stats.triesToPass !== null
                        ? `${stats.triesToPass} 次挑戰` 
                        : '尚未通關'}
                    </td>
                  </tr>
                  <tr>
                    <td>最近測試時間 (Last Update)</td>
                    <td className="font-tech text-white text-xs flex items-center gap-1">
                      <Clock size={12} className="text-orange-500" />
                      {formatTime(stats.lastPlayTime)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 按鈕操作區 */}
            <div className="mt-6 flex gap-4">
              <button
                onClick={onRestart}
                className="eva-button w-full flex-1"
              >
                <RotateCcw size={16} /> 重新挑戰 (RETRY)
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* 底部警示條紋 */}
      <div className="mt-8">
        <div className={`warning-bar ${passed ? '' : 'danger'}`}></div>
      </div>
    </div>
  );
}
