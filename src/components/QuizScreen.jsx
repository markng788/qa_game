import React, { useState, useEffect } from 'react';
import { ShieldAlert, Cpu, Award } from 'lucide-react';

export default function QuizScreen({
  questions,
  currentIndex,
  onNext,
  userId,
  bossInfo
}) {
  const currentQuestion = questions[currentIndex];
  const [selectedOption, setSelectedOption] = useState(null);
  const [bossMessage, setBossMessage] = useState('');

  // 關主台詞清單
  const selectionLines = [
    "哼... 決定是這個了嗎？不要後悔喔！",
    "喔？選了這個嗎？真是有趣的選擇。",
    "你確定... 這就是正確的解答？",
    "看來你對自己非常有自信嘛！",
    "哈哈！真的要選這個？可別怪我沒警告你！"
  ];

  // 每當切換題目時，重設選項與關主的初始台詞
  useEffect(() => {
    setSelectedOption(null);
    setBossMessage(bossInfo.intro);
  }, [currentIndex, bossInfo]);

  const handleOptionClick = (key) => {
    setSelectedOption(key);
    // 隨機選一句點選後的台詞
    const lineIndex = Math.floor((key.charCodeAt(0) + currentIndex) % selectionLines.length);
    setBossMessage(selectionLines[lineIndex]);
  };

  const handleConfirm = () => {
    if (!selectedOption) return;
    onNext(currentQuestion.id, selectedOption);
  };

  const progressPercentage = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* 頂部 HUD 狀態列 */}
      <div className="hud-bar border-b-2 border-orange-500 mb-6 flex flex-col md:flex-row gap-4 md:gap-0 justify-between items-center text-xs font-mono">
        <div className="flex items-center gap-6 text-orange-500">
          <div className="flex items-center gap-1">
            <Cpu className="animate-spin text-orange-500" size={16} style={{ animationDuration: '6s' }} />
            <span>PILOT ID: <span className="font-bold text-white">{userId}</span></span>
          </div>
          <span>STAGE: <span className="font-bold text-white">{String(currentIndex + 1).padStart(2, '0')} / {String(questions.length).padStart(2, '0')}</span></span>
        </div>
        
        {/* 進度條 */}
        <div className="w-full md:w-64 flex items-center gap-2">
          <span className="text-orange-500">SYNC:</span>
          <div className="hud-progress-container flex-1">
            <div 
              className="hud-progress-fill" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <span className="text-orange-500 font-bold">{Math.round(progressPercentage)}%</span>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="tag">DECRYPTING...</span>
          <span className="text-orange-500 font-tech">SYS: ACTIVE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* 左側：關主頭像與氣泡對話 */}
        <div className="md:col-span-1 flex flex-col items-center">
          <div className="avatar-card eva-panel w-full">
            <span className="tag red absolute top-3 right-3">BOSS</span>
            
            {/* 關主頭像 */}
            <div className="avatar-image-container mt-4">
              <img 
                src={bossInfo.avatarUrl} 
                alt={bossInfo.name} 
                className="w-full h-full"
              />
              <div className="avatar-overlay-grid"></div>
            </div>

            {/* 關主名稱 */}
            <h3 className="font-tech font-black text-lg text-orange-500 tracking-wider mb-1">
              {bossInfo.name}
            </h3>
            <p className="text-[10px] text-muted font-tech tracking-widest uppercase mb-3">
              {bossInfo.type} TYPE DEFENDER
            </p>

            {/* 氣泡對話 */}
            <div className="speech-bubble w-full text-sm text-left">
              <p className="text-orange-500 font-bold mb-1 font-tech">#{bossInfo.name} 說：</p>
              <p className="text-white font-medium italic">「{bossMessage}」</p>
            </div>
          </div>
        </div>

        {/* 右側：題目與選項區 */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <div className="eva-panel min-h-[160px] flex flex-col justify-between">
            <div className="absolute top-2 left-4 text-[10px] font-tech text-orange-500/50">
              QUESTION_DATA_STREAM // ID: {currentQuestion.id}
            </div>
            
            <div className="mt-4">
              <h2 className="text-xl font-bold text-white leading-relaxed">
                {currentQuestion.question}
              </h2>
            </div>

            <div className="mt-6 flex justify-between text-xs font-tech text-muted border-t border-orange-500/10 pt-3">
              <span>PRIORITY: H_LEVEL</span>
              <span>CAT: GENERAL_COMPATIBILITY</span>
            </div>
          </div>

          {/* 選項清單 */}
          <div className="flex flex-col gap-1">
            {Object.entries(currentQuestion.options).map(([key, value]) => {
              if (!value) return null; // 排除空選項
              const isSelected = selectedOption === key;
              return (
                <button
                  key={key}
                  onClick={() => handleOptionClick(key)}
                  className={`option-button eva-button ${isSelected ? 'selected' : ''}`}
                >
                  <span className="font-tech font-black text-orange-500 mr-4 bg-orange-500/10 px-2 py-0.5 border border-orange-500/30">
                    {key}
                  </span>
                  <span>{value}</span>
                </button>
              );
            })}
          </div>

          {/* 確認送出按鈕 */}
          <div className="flex justify-end mt-4">
            <button
              onClick={handleConfirm}
              disabled={!selectedOption}
              className={`eva-button px-10 transition-all ${
                selectedOption 
                  ? 'success shadow-[0_0_15px_rgba(0,255,115,0.3)] animate-pulse' 
                  : 'opacity-40 cursor-not-allowed'
              }`}
            >
              確認作答 / SUBMIT ANSWER
            </button>
          </div>
        </div>
      </div>

      {/* 底部裝飾性條紋 */}
      <div className="mt-12">
        <div className="warning-bar"></div>
      </div>
    </div>
  );
}
