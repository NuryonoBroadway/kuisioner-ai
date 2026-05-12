const SHEET_NAME = "Responses";
const HEADERS = [
  "submitted_at",
  "nama",
  "kampus",
  "fakultas",
  "semester",
  "q1",
  "q2",
  "q3",
  "q4",
  "q5",
  "q6",
  "q7",
  "q8",
  "q9",
  "q10",
  "average_score",
  "category",
  "opini"
];

function doPost(e) {
  const sheet = getOrCreateSheet_();
  const params = e.parameter || {};
  const answers = parseAnswers_(params.answers);

  ensureHeaderRow_(sheet);

  sheet.appendRow([
    params.submittedAt || "",
    params.nama || "",
    params.kampus || "",
    params.fakultas || "",
    params.semester || "",
    answers.q1 || "",
    answers.q2 || "",
    answers.q3 || "",
    answers.q4 || "",
    answers.q5 || "",
    answers.q6 || "",
    answers.q7 || "",
    answers.q8 || "",
    answers.q9 || "",
    answers.q10 || "",
    params.averageScore || "",
    params.category || "",
    params.opini || ""
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  const action = (e.parameter && e.parameter.action) || "";
  if (action !== "responses") {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, message: "Unsupported action" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const sheet = getOrCreateSheet_();
  ensureHeaderRow_(sheet);
  const responses = getResponses_(sheet);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, responses: responses }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }
  return sheet;
}

function parseAnswers_(value) {
  try {
    return JSON.parse(value || "{}");
  } catch (error) {
    return {};
  }
}

function ensureHeaderRow_(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
  }
}

function getResponses_(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) {
    return [];
  }

  const values = sheet.getRange(2, 1, lastRow - 1, HEADERS.length).getValues();
  return values.map(function(row) {
    return {
      submittedAt: row[0],
      nama: row[1],
      kampus: row[2],
      fakultas: row[3],
      semester: row[4],
      answers: {
        q1: toNumberOrEmpty_(row[5]),
        q2: toNumberOrEmpty_(row[6]),
        q3: toNumberOrEmpty_(row[7]),
        q4: toNumberOrEmpty_(row[8]),
        q5: toNumberOrEmpty_(row[9]),
        q6: toNumberOrEmpty_(row[10]),
        q7: toNumberOrEmpty_(row[11]),
        q8: toNumberOrEmpty_(row[12]),
        q9: toNumberOrEmpty_(row[13]),
        q10: toNumberOrEmpty_(row[14])
      },
      averageScore: Number(row[15]) || 0,
      category: row[16] || "",
      opini: row[17] || ""
    };
  });
}

function toNumberOrEmpty_(value) {
  if (value === "" || value === null || value === undefined) {
    return "";
  }
  return Number(value);
}
