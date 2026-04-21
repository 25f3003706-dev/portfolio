/* 
   HOW TO USE:
   1. Open your Google Sheet.
   2. Go to Extensions > Apps Script.
   3. Delete any existing code and paste this script below.
   4. Click "Deploy" > "New Deployment".
   5. Select "Web App".
   6. Set "Execute as" to "Me".
   7. Set "Who has access" to "Anyone".
   8. Click "Deploy", authorize the script, and copy the "Web App URL".
*/

const SHEET_NAME = 'Sheet1'; // Make sure this matches your sheet tab name

function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
    
    // Get form data
    const data = JSON.parse(e.postData.contents);
    
    // Create timestamp
    const timestamp = new Date();
    
    // Append row (Matches: Timestamp, Name, Email, Phone, Message)
    sheet.appendRow([
      timestamp,
      data.name,
      data.email,
      data.phone,
      data.message
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ 
      result: 'success', 
      message: 'Data appended successfully' 
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      result: 'error', 
      error: error.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
