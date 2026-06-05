import React, { useState, useEffect } from 'react';
import LoginScreen from './components/LoginScreen';
import QuizScreen from './components/QuizScreen';
import ResultScreen from './components/ResultScreen';
import { Terminal, ShieldAlert } from 'lucide-react';

// 環境變數設定
const GAS_URL = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL || '';
const PASS_THRESHOLD = parseInt(import.meta.env.VITE_PASS_THRESHOLD || '3', 10);
const QUESTION_COUNT = parseInt(import.meta.env.VITE_QUESTION_COUNT || '5', 10);

// Mock 題目庫（在未設定 GAS 網址時使用，或做為備援）
const MOCK_QUESTIONS = [
  {
    id: "1",
    question: "新世紀福音戰士中，EVA 初號機的專屬駕駛員是誰？",
    options: { A: "碇真嗣", B: "綾波零", C: "明日香", D: "渚薰" },
    answer: "A"
  },
  {
    id: "2",
    question: "經典動漫中，被稱為「鋼之鍊金術師」的人是？",
    options: { A: "阿爾馮斯·愛力克", B: "愛德華·愛力克", C: "羅伊·馬斯坦古", D: "修斯" },
    answer: "B"
  },
  {
    id: "3",
    question: "「隱藏著黑暗力量的鑰匙啊，在我面前顯示你真正的力量」是哪部動漫的經典台詞？",
    options: { A: "美少女戰士", B: "魔法公主", C: "庫洛魔法使", D: "魔法少女小圓" },
    answer: "C"
  },
  {
    id: "4",
    question: "動漫《死亡筆記本》中，主角夜神月拿到的筆記本原屬於哪位死神？",
    options: { A: "路克", B: "雷姆", C: "傑拉斯", D: "席多" },
    answer: "A"
  },
  {
    id: "5",
    question: "《火影忍者》中，主角漩渦鳴人最拿手、由第四代火影開創的忍術是？",
    options: { A: "千鳥", B: "寫輪眼", C: "螺旋丸", D: "天照" },
    answer: "C"
  },
  {
    id: "6",
    question: "下列何者是《Code Geass 反叛的魯路修》中魯路修所獲得的 Geass 能力？",
    options: { A: "絕對命令", B: "看穿未來", C: "記憶消除", D: "空間傳送" },
    answer: "A"
  },
  {
    id: "7",
    question: "《海賊王》中，主角魯夫所吃下的惡魔果實真實名稱是？",
    options: { A: "橡膠果實", B: "人人果實幻獸種尼卡型態", C: "火火果實", D: "震震果實" },
    answer: "B"
  },
  {
    id: "8",
    question: "《獵人》中，主角小傑的念能力屬於哪一個系統？",
    options: { A: "強化系", B: "變化系", C: "具現化系", D: "特質系" },
    answer: "A"
  },
  {
    id: "9",
    question: "《灌籃高手》中，湘北高中籃球隊的隊長是誰？",
    options: { A: "櫻木花道", B: "流川楓", C: "赤木剛憲", D: "宮城良田" },
    answer: "C"
  },
  {
    id: "10",
    question: "《幽遊白書》中，主角浦飯幽助的招牌必殺技是？",
    options: { A: "邪王炎殺黑龍波", B: "靈丸", C: "玫瑰鞭", D: "次元刀" },
    answer: "B"
  }
];

// 關主名稱清單
const BOSS_NAMES = {
  bottts: [
    "CYBER-01", "AEGIS-X", "TITAN-X9", "MECHA-ALPHA", "OMEGA-BOT",
    "SIGMA-5", "KRONOS", "TALOS", "DEIMOS", "PHOBOS",
    "GOLIATH", "BEHEMOTH", "NEBULA", "PULSAR", "VECTOR",
    "QUASAR", "SIRIUS", "ORION", "APEX-9", "NEXUS-V",
    "CYPHER", "DAEMON", "MAINFRAME", "GLITCH-BOT", "ZERO-ONE"
  ],
  lorelei: [
    "宮崎學姐", "結衣小姐", "拓海學長", "小櫻仙子", "涼介隊長",
    "薰君", "美咲同學", "奏太", "蓮少爺", "芽衣妹妹",
    "明日香虛擬體", "碇指令投影", "第三新東京守衛", "NERV 聯絡員", "適格者候補-A",
    "適格者候補-B", "模擬作戰 AI", "加持特工", "冬月副指令", "律子博士",
    "美里少校", "劍介", "東治", "真嗣克隆", "零號機 AI"
  ],
  adventurer: [
    "冒險者凱文", "大魔導士蘿絲", "遺蹟學者瓊斯", "遊俠羅賓", "聖騎士亞瑟",
    "狂戰士雷格納", "神射手溫蒂", "刺客艾吉歐", "鍊金術士拉爾", "吟遊詩人路克",
    "幻獸馴服師", "龍語者卡爾", "元素使莎拉", "符文鐵匠奧丁", "時空旅者韋恩",
    "暗影舞者傑克", "德魯伊法里奧", "光之牧師蓮娜", "寶藏獵人德瑞", "劍術大師武藏",
    "工程學者拉", "占星術士略", "星海領航員", "烈焰掌控者", "冰雪女王莎"
  ],
  pixel: [
    "8-BIT 勇者", "FC-01 守護者", "紅白機將軍", "像素駭客", "像素史萊姆",
    "街機之王", "GAMEBOY 少年", "懷舊指揮官", "代碼幽靈", "馬賽克大師",
    "復古電子羊", "像素黑武士", "位元法師", "2D 終結者", "低解析度魔王",
    "點陣圖幽靈", "霓虹光譜", "超任騎士", "磁碟機怪客", "像素狂熱者",
    "極光代碼", "位元組防線", "晶片音樂家", "像素女武神", "終極點陣"
  ]
};

const BOSS_INTROS = [
  "我是本關的守護者，你有把握答對這題嗎？",
  "哼，這題可沒那麼簡單，受死吧！",
  "想要通過這裡？先過我這關！",
  "警告：偵測到外來認知波長，啟動防禦機制！",
  "這可不是普通的難題，做好覺悟了嗎？"
];

export default function App() {
  const [step, setStep] = useState('login'); // 'login' | 'loading' | 'quiz' | 'result'
  const [userId, setUserId] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [resultData, setResultData] = useState(null);
  
  // 100 個預載入關主清單
  const [bossList, setBossList] = useState([]);
  // 本次遊戲中各題目分配到的關主
  const [assignedBosses, setAssignedBosses] = useState([]);
  const [loadingMessage, setLoadingMessage] = useState('SYSTEM INIT...');

  // 初始化產生 100 個關主並預載入
  useEffect(() => {
    setLoadingMessage('正在預載入關主素材 (100% 同步中)...');
    const generated = [];
    const styles = ['bottts', 'lorelei', 'adventurer', 'pixel-art'];
    let preloadedCount = 0;

    for (let i = 0; i < 100; i++) {
      const styleIndex = Math.floor(i / 25);
      const style = styles[styleIndex];
      const nameList = BOSS_NAMES[style === 'pixel-art' ? 'pixel' : style];
      const name = nameList[i % 25];
      
      let typeName = 'MECHA';
      if (style === 'lorelei') typeName = 'COGNITIVE';
      if (style === 'adventurer') typeName = 'HERO';
      if (style === 'pixel-art') typeName = 'RETRO';

      const avatarUrl = `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(name)}`;
      
      generated.push({
        id: i,
        name,
        style,
        type: typeName,
        avatarUrl,
        intro: BOSS_INTROS[i % BOSS_INTROS.length]
      });

      // 預載入圖片到快取
      const img = new Image();
      img.src = avatarUrl;
      img.onload = () => {
        preloadedCount++;
      };
      img.onerror = () => {
        // 容錯，就算載入失敗也算完成
        preloadedCount++;
      };
    }
    
    setBossList(generated);
  }, []);

  // 登入並獲取題目
  const handleStartGame = async (id) => {
    setUserId(id);
    setStep('loading');
    setLoadingMessage('正在向 NERV 主機要求加密題目資料...');
    setAnswers({});
    setCurrentIndex(0);

    // 隨機分配本次遊戲關關主 (從 100 個中隨機抽選)
    if (bossList.length > 0) {
      const tempBosses = [...bossList];
      const shuffledBosses = tempBosses.sort(() => 0.5 - Math.random());
      setAssignedBosses(shuffledBosses.slice(0, QUESTION_COUNT));
    }

    if (!GAS_URL) {
      // 啟用 Mock 模式
      console.log('未設定 VITE_GOOGLE_APP_SCRIPT_URL，已自動啟用本地模擬 (Mock) 模式。');
      setTimeout(() => {
        const shuffledMock = [...MOCK_QUESTIONS].sort(() => 0.5 - Math.random());
        const selected = shuffledMock.slice(0, Math.min(QUESTION_COUNT, shuffledMock.length));
        
        // Mock 模式需要移除答案欄位
        const sanitized = selected.map(q => ({
          id: q.id,
          question: q.question,
          options: q.options
        }));

        setQuestions(sanitized);
        setStep('quiz');
      }, 1200);
      return;
    }

    try {
      const res = await fetch(`${GAS_URL}?questionCount=${QUESTION_COUNT}`, {
        method: 'GET'
      });
      const result = await res.json();
      
      if (result.status === 'success') {
        setQuestions(result.data.questions);
        setStep('quiz');
      } else {
        alert(`無法取得題目: ${result.message}`);
        setStep('login');
      }
    } catch (error) {
      console.error(error);
      alert(`連線至 GAS 後端失敗，將為您切換至 Mock 測試模式。`);
      // 容錯切換至 Mock
      const shuffledMock = [...MOCK_QUESTIONS].sort(() => 0.5 - Math.random());
      const selected = shuffledMock.slice(0, Math.min(QUESTION_COUNT, shuffledMock.length));
      const sanitized = selected.map(q => ({
        id: q.id,
        question: q.question,
        options: q.options
      }));
      setQuestions(sanitized);
      setStep('quiz');
    }
  };

  // 下一題或送出答案
  const handleNextQuestion = (questionId, selectedValue) => {
    const updatedAnswers = { ...answers, [questionId]: selectedValue };
    setAnswers(updatedAnswers);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // 已答完最後一題，送出成績
      submitAnswers(updatedAnswers);
    }
  };

  // 提交答案並計算成績
  const submitAnswers = async (finalAnswers) => {
    setStep('loading');
    setLoadingMessage('同步答題紀錄至 NERV 資料庫中...');

    if (!GAS_URL) {
      // Mock 提交與本地 LocalStorage 更新
      setTimeout(() => {
        // 計算答對題數
        let score = 0;
        const answerKey = {};
        MOCK_QUESTIONS.forEach(q => {
          answerKey[q.id] = q.answer;
        });

        Object.entries(finalAnswers).forEach(([qId, ans]) => {
          if (answerKey[qId] === ans) {
            score++;
          }
        });

        const passed = score >= PASS_THRESHOLD;
        const now = new Date();
        const formattedTime = now.getFullYear() + '-' + 
          String(now.getMonth() + 1).padStart(2, '0') + '-' + 
          String(now.getDate()).padStart(2, '0') + ' ' + 
          String(now.getHours()).padStart(2, '0') + ':' + 
          String(now.getMinutes()).padStart(2, '0') + ':' + 
          String(now.getSeconds()).padStart(2, '0');

        // 從 LocalStorage 載入歷史紀錄
        const localKey = `nerv_quiz_stat_${userId}`;
        const storedStats = localStorage.getItem(localKey);
        
        let playCount = 1;
        let totalScore = score;
        let maxScore = score;
        let firstPassScore = passed ? score : "";
        let triesToPass = passed ? 1 : "";

        if (storedStats) {
          const prev = JSON.parse(storedStats);
          playCount = prev.playCount + 1;
          totalScore = prev.totalScore + score;
          maxScore = Math.max(prev.maxScore, score);
          
          const alreadyPassed = prev.firstPassScore !== "" && prev.firstPassScore !== undefined;
          if (!alreadyPassed && passed) {
            firstPassScore = score;
            triesToPass = playCount;
          } else {
            firstPassScore = prev.firstPassScore || "";
            triesToPass = prev.triesToPass || "";
          }
        }

        const newStats = {
          userId,
          playCount,
          totalScore,
          maxScore,
          firstPassScore,
          triesToPass,
          lastPlayTime: formattedTime
        };

        localStorage.setItem(localKey, JSON.stringify(newStats));

        setResultData({
          score: score,
          totalQuestions: questions.length,
          passed: passed,
          stats: newStats
        });
        setStep('result');
      }, 1500);
      return;
    }

    try {
      const payload = {
        userId: userId,
        answers: finalAnswers,
        passThreshold: PASS_THRESHOLD
      };

      const res = await fetch(GAS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8' // GAS 接收 JSON 通常需要設成 text/plain 避免 CORS preflight 限制
        },
        body: JSON.stringify(payload)
      });
      
      const result = await res.json();
      
      if (result.status === 'success') {
        setResultData({
          score: result.data.score,
          totalQuestions: result.data.totalQuestions,
          passed: result.data.passed,
          stats: result.data.stats
        });
        setStep('result');
      } else {
        alert(`計算成績出錯: ${result.message}`);
        setStep('login');
      }
    } catch (error) {
      console.error(error);
      alert('上傳答案時發生連線錯誤，將為您輸出本地模擬結果。');
      // 本地 Mock 回退
      submitAnswersMockFallback(finalAnswers);
    }
  };

  // 連線失敗時的 Mock 備援
  const submitAnswersMockFallback = (finalAnswers) => {
    let score = 0;
    // 預設有些隨機對錯，或是全對
    score = Math.floor(Math.random() * (questions.length + 1));
    const passed = score >= PASS_THRESHOLD;
    const now = new Date().toLocaleString();

    const mockStats = {
      userId,
      playCount: 1,
      totalScore: score,
      maxScore: score,
      firstPassScore: passed ? score : "",
      triesToPass: passed ? 1 : "",
      lastPlayTime: now
    };

    setResultData({
      score,
      totalQuestions: questions.length,
      passed,
      stats: mockStats
    });
    setStep('result');
  };

  const handleRestart = () => {
    setStep('login');
    setAnswers({});
    setCurrentIndex(0);
    setResultData(null);
  };

  return (
    <div className="relative min-h-screen">
      {/* 2000s 動漫感背景線條與網格 */}
      <div className="grid-bg"></div>

      {/* 橫跨頁面的頂部警告條紋 */}
      <div className="warning-bar"></div>

      <main className="container mx-auto py-6">
        {step === 'login' && (
          <LoginScreen onStart={handleStartGame} isLoading={false} />
        )}

        {step === 'loading' && (
          <div className="loading-overlay">
            <div className="hex-grid"></div>
            <h2 className="text-xl font-bold font-tech text-orange-500 tracking-widest animate-pulse">
              {loadingMessage}
            </h2>
            <div className="mt-4 flex gap-1 justify-center">
              <span className="w-2 h-2 bg-orange-500 animate-ping" style={{ animationDelay: '0ms' }}></span>
              <span className="w-2 h-2 bg-orange-500 animate-ping" style={{ animationDelay: '200ms' }}></span>
              <span className="w-2 h-2 bg-orange-500 animate-ping" style={{ animationDelay: '400ms' }}></span>
            </div>
          </div>
        )}

        {step === 'quiz' && questions.length > 0 && (
          <QuizScreen
            questions={questions}
            currentIndex={currentIndex}
            onNext={handleNextQuestion}
            userId={userId}
            bossInfo={assignedBosses[currentIndex] || {
              name: "未知守護者",
              type: "UNKNOWN",
              avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=fallback",
              intro: "準備受死吧！"
            }}
          />
        )}

        {step === 'result' && resultData && (
          <ResultScreen
            resultData={resultData}
            onRestart={handleRestart}
            passThreshold={PASS_THRESHOLD}
          />
        )}
      </main>

      {/* 頁尾 NERV logo 與版權 */}
      <footer className="w-full text-center py-6 border-t border-orange-500/10 text-[10px] font-tech text-muted tracking-widest uppercase">
        <p>© 2026 NERV TECH LAB. COGNITIVE GAME UNIT.</p>
        <p className="mt-1 text-orange-500/40">AUTHORIZED PERSONNEL ONLY</p>
      </footer>
    </div>
  );
}
