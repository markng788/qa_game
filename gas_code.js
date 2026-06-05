/**
 * Google Apps Script 
 * 用於「闖關問答遊戲」後端，請複製此程式碼並部署在您的 Google Sheets 擴充功能 > Apps Script 中。
 * 部署時請選擇「網頁應用程式 (Web App)」，並將存取權限設為「任何人 (Anyone)」。
 */

const DB_SHEETS = {
  QUESTIONS: "題目",
  ANSWERS: "回答"
};

// 處理跨來源 GET 請求 (取得隨機題目)
function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const qSheet = ss.getSheetByName(DB_SHEETS.QUESTIONS);
    if (!qSheet) {
      return errorResponse("找不到「" + DB_SHEETS.QUESTIONS + "」工作表");
    }

    // 取得所有題目資料
    const data = qSheet.getDataRange().getValues();
    if (data.length <= 1) {
      return errorResponse("「題目」工作表中無題目資料");
    }

    // 欄位定義：題號、題目、A、B、C、D、解答
    const headers = data[0];
    const rows = data.slice(1);

    // 解析參數
    const questionCountParam = e && e.parameter && e.parameter.questionCount;
    const count = questionCountParam ? parseInt(questionCountParam, 10) : 5;

    // 隨機打亂並選取 N 題
    const shuffled = shuffleArray(rows);
    const selectedRows = shuffled.slice(0, Math.min(count, shuffled.length));

    // 格式化回傳格式 (不包含最後一個「解答」欄位)
    const questions = selectedRows.map(row => {
      return {
        id: row[0],      // 題號
        question: row[1], // 題目
        options: {
          A: row[2],     // A
          B: row[3],     // B
          C: row[4],     // C
          D: row[5]      // D
        }
      };
    });

    return successResponse({ questions: questions });
  } catch (error) {
    return errorResponse(error.toString());
  }
}

// 處理跨來源 POST 請求 (提交作答與計算成績)
function doPost(e) {
  try {
    // 解析傳入的 JSON 資料
    let postData;
    if (e && e.postData && e.postData.contents) {
      postData = JSON.parse(e.postData.contents);
    } else {
      return errorResponse("無效的 POST 請求內容");
    }

    const userId = postData.userId;
    const userAnswers = postData.answers; // 格式: { "題號1": "A", "題號2": "B" }
    const passThreshold = postData.passThreshold || 3;

    if (!userId) {
      return errorResponse("缺少 userId 參數");
    }
    if (!userAnswers) {
      return errorResponse("缺少 answers 參數");
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const qSheet = ss.getSheetByName(DB_SHEETS.QUESTIONS);
    const aSheet = ss.getSheetByName(DB_SHEETS.ANSWERS);

    if (!qSheet || !aSheet) {
      return errorResponse("找不到「題目」或「回答」工作表");
    }

    // 1. 取得所有題目與解答
    const qData = qSheet.getDataRange().getValues();
    const qHeaders = qData[0];
    const qRows = qData.slice(1);

    // 建立題目的正確答案 Map (題號 -> 正確答案)
    const answerKey = {};
    qRows.forEach(row => {
      const qId = row[0].toString();
      const correctAnswer = row[6].toString().trim().toUpperCase(); // 解答欄位
      answerKey[qId] = correctAnswer;
    });

    // 2. 計算答對題數
    let score = 0;
    let answeredQuestionsCount = 0;
    const answeredDetails = [];

    // 針對使用者提交的答案進行對照
    for (let qId in userAnswers) {
      const userAnswer = userAnswers[qId].toString().trim().toUpperCase();
      const correctAnswer = answerKey[qId];
      const isCorrect = userAnswer === correctAnswer;
      if (isCorrect) {
        score++;
      }
      answeredQuestionsCount++;
      answeredDetails.push({
        id: qId,
        userAnswer: userAnswer,
        correctAnswer: correctAnswer,
        isCorrect: isCorrect
      });
    }

    const passed = score >= passThreshold;

    // 3. 處理「回答」工作表記錄
    // 欄位順序: ID、闖關次數、總分、最高分、第一次通關分數、花了幾次通關、最近遊玩時間
    const aData = aSheet.getDataRange().getValues();
    const aHeaders = aData[0];
    const aRows = aData.slice(1);

    let userRowIndex = -1; // 1-based index 扣除標題後的相對位置，或直接在 sheet 中的 row 索引
    for (let i = 0; i < aRows.length; i++) {
      if (aRows[i][0].toString() === userId.toString()) {
        userRowIndex = i + 2; // +2 因為 0-based 且有 1 列標題
        break;
      }
    }

    const now = new Date();
    const formattedTime = Utilities.formatDate(now, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");

    let playCount = 1;
    let totalScore = score;
    let maxScore = score;
    let firstPassScore = passed ? score : "";
    let triesToPass = passed ? 1 : "";

    if (userRowIndex !== -1) {
      // 使用者已存在，更新數據
      const prevPlayCount = parseInt(aSheet.getRange(userRowIndex, 2).getValue() || 0, 10);
      const prevTotalScore = parseInt(aSheet.getRange(userRowIndex, 3).getValue() || 0, 10);
      const prevMaxScore = parseInt(aSheet.getRange(userRowIndex, 4).getValue() || 0, 10);
      const prevFirstPassScore = aSheet.getRange(userRowIndex, 5).getValue();
      const prevTriesToPass = aSheet.getRange(userRowIndex, 6).getValue();

      playCount = prevPlayCount + 1;
      totalScore = prevTotalScore + score;
      maxScore = Math.max(prevMaxScore, score);

      // 更新闖關次數、總分、最高分、最近時間
      aSheet.getRange(userRowIndex, 2).setValue(playCount);
      aSheet.getRange(userRowIndex, 3).setValue(totalScore);
      aSheet.getRange(userRowIndex, 4).setValue(maxScore);
      aSheet.getRange(userRowIndex, 7).setValue(formattedTime);

      // 檢查第一次通關紀錄
      const alreadyPassed = prevFirstPassScore !== "" && prevFirstPassScore !== "-";
      if (!alreadyPassed && passed) {
        // 先前沒有通關過，但這次通關了
        firstPassScore = score;
        triesToPass = playCount;
        aSheet.getRange(userRowIndex, 5).setValue(firstPassScore);
        aSheet.getRange(userRowIndex, 6).setValue(triesToPass);
      } else {
        // 保留原值
        firstPassScore = prevFirstPassScore;
        triesToPass = prevTriesToPass;
      }
    } else {
      // 使用者不存在，新增一列
      // 順序: ID、闖關次數、總分、最高分、第一次通關分數、花了幾次通關、最近遊玩時間
      aSheet.appendRow([
        userId,
        playCount,
        totalScore,
        maxScore,
        firstPassScore,
        triesToPass,
        formattedTime
      ]);
    }

    return successResponse({
      score: score,
      totalQuestions: answeredQuestionsCount,
      passed: passed,
      details: answeredDetails,
      stats: {
        userId: userId,
        playCount: playCount,
        totalScore: totalScore,
        maxScore: maxScore,
        firstPassScore: firstPassScore,
        triesToPass: triesToPass,
        lastPlayTime: formattedTime
      }
    });

  } catch (error) {
    return errorResponse(error.toString());
  }
}

// 輔助函式：打亂陣列
function shuffleArray(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// 輔助函式：包裝成功回應
function successResponse(data) {
  const result = { status: "success", data: data };
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// 輔助函式：包裝失敗回應
function errorResponse(message) {
  const result = { status: "error", message: message };
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}
