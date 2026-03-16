// ================================================================
// GYM TRACKER — Google Apps Script
// ================================================================
// HOW TO SET UP:
//   1. Open your Google Sheet
//   2. Click Extensions → Apps Script
//   3. Delete any existing code and paste this entire file
//   4. Click Save (floppy disk icon)
//   5. Click Deploy → New deployment
//   6. Type: "Web app"  |  Execute as: "Me"  |  Who has access: "Anyone"
//   7. Click Deploy → Authorise → Allow
//   8. Copy the Web App URL
//   9. Paste that URL into src/App.jsx where it says PASTE_YOUR_APPS_SCRIPT_URL_HERE
// ================================================================

const SHEET_NAME = "Workout Log";

// Called when the app sends a POST request (saving a set)
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = getOrCreateSheet();

    sheet.appendRow([
      data.savedAt || new Date().toISOString(),  // Timestamp
      data.user,                                  // adam or kelly
      data.day,                                   // Monday, Tuesday...
      data.exerciseId,                            // back_squat, deadlift...
      data.weight,                                // kg
      data.reps,                                  // reps or notes
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Called when the app loads (GET request) — returns last session data
function doGet(e) {
  try {
    const sheet = getOrCreateSheet();
    const rows = sheet.getDataRange().getValues();
    const headers = rows[0];
    const data = rows.slice(1).map(row => ({
      savedAt:    row[0] instanceof Date ? row[0].toISOString() : String(row[0]),
      user:       String(row[1]),
      day:        String(row[2]),
      exerciseId: String(row[3]),
      weight:     String(row[4]),
      reps:       String(row[5]),
    }));

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, data }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    // Add header row
    sheet.appendRow(["Timestamp", "Person", "Day", "Exercise", "Weight (kg)", "Reps/Notes"]);

    // Style the header row
    const headerRange = sheet.getRange(1, 1, 1, 6);
    headerRange.setBackground("#1a1a2e");
    headerRange.setFontColor("#f59e0b");
    headerRange.setFontWeight("bold");
    sheet.setFrozenRows(1);

    // Set column widths
    sheet.setColumnWidth(1, 200); // Timestamp
    sheet.setColumnWidth(2, 80);  // Person
    sheet.setColumnWidth(3, 100); // Day
    sheet.setColumnWidth(4, 180); // Exercise
    sheet.setColumnWidth(5, 100); // Weight
    sheet.setColumnWidth(6, 100); // Reps
  }

  return sheet;
}
