const SHEET_NAME = "Responses";

function doPost(e) {
  const sheet = getOrCreateSheet_();
  const params = e.parameter || {};
  const answers = parseAnswers_(params.answers);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
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
    ]);
  }

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
