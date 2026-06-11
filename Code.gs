// ============================================================
//  RLB Contact Hub — Google Apps Script Backend
//  Sheet name: RLB Contact Hub
//  Sends email to: ogrlbdesigns@gmail.com
//  Deploy as: Web App → Anyone (no sign-in required)
// ============================================================

const RECIPIENT_EMAIL = 'ogrlbdesigns@gmail.com';
const SHEET_NAME      = 'RLB Contact Hub';

// ── Column headers (one row per submission) ──────────────────
const HEADERS = [
  'Timestamp',
  'Form Type',
  'Name',
  'Email',
  'App Name',
  'Device / Browser',
  'What Happened',
  'Error Code',
  'Frequency',
  'Series / Book',
  'Question Type',
  'Question',
  'Subject',
  'Feedback Type',
  'Rating',
  'Message',
  'Suggestion For',
  'Suggestion',
  'Credit Preference',
  'Inquiry Type',
  'Website / Social',
  'Audience Size',
  'Proposal',
  'Submitted At'
];

// ── Entry point ───────────────────────────────────────────────
function doPost(e) {
  try {
    let data = {};

    // Handle both JSON body and form-encoded POST (Google Sites iframe safety)
    if (e.postData && e.postData.type === 'application/json') {
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      data = e.parameter;
    }

    // Write to Google Sheet
    writeToSheet(data);

    // Send email notification
    sendEmailNotification(data);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ── Write a row to the Google Sheet ──────────────────────────
function writeToSheet(d) {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  let   sheet = ss.getSheetByName(SHEET_NAME);

  // Create sheet + header row on first run
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length)
         .setFontWeight('bold')
         .setBackground('#7a9e87')
         .setFontColor('#ffffff');
    sheet.setFrozenRows(1);
  }

  sheet.appendRow([
    new Date(),                        // Timestamp
    d.formType        || '',
    d.name            || '',
    d.email           || '',
    d.app_name        || '',           // App Issue
    d.device_browser  || '',
    d.what_happened   || '',
    d.error_code      || '',
    d.frequency       || '',
    d.series          || '',           // Book/Series
    d.question_type   || '',
    d.question        || '',
    d.subject         || '',           // Feedback
    d.feedback_type   || '',
    d.rating          || '',
    d.message         || '',
    d.suggestion_for  || '',           // Suggestion
    d.suggestion      || '',
    d.credit          || '',
    d.inquiry_type    || '',           // Collaboration
    d.website         || '',
    d.audience_size   || '',
    d.proposal        || '',
    d.submittedAt     || ''
  ]);
}

// ── Send email notification ───────────────────────────────────
function sendEmailNotification(d) {
  const formType = d.formType || 'Unknown';
  const name     = d.name     || 'Anonymous';
  const email    = d.email    || 'No email provided';

  const subject  = '[RLB Contact Hub] ' + formType + ' from ' + name;

  // Build the email body based on form type
  let body = '─────────────────────────────────────\n';
  body    += 'RLB CONTACT HUB — NEW SUBMISSION\n';
  body    += '─────────────────────────────────────\n\n';
  body    += 'Form Type : ' + formType + '\n';
  body    += 'Name      : ' + name + '\n';
  body    += 'Email     : ' + email + '\n';
  body    += 'Date/Time : ' + new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' }) + ' (Central)\n\n';

  if (formType === 'App Issue') {
    body += '── APP ISSUE DETAILS ──\n';
    body += 'App          : ' + (d.app_name       || '—') + '\n';
    body += 'Device/Browser: ' + (d.device_browser || '—') + '\n';
    body += 'What Happened: ' + (d.what_happened  || '—') + '\n\n';
    body += 'Error Code / Message:\n' + (d.error_code || '(none provided)') + '\n\n';
    body += 'Frequency    : ' + (d.frequency || '—') + '\n';
  }

  else if (formType === 'Book/Series') {
    body += '── BOOK / SERIES QUESTION ──\n';
    body += 'Series/Book  : ' + (d.series        || '—') + '\n';
    body += 'Question Type: ' + (d.question_type || '—') + '\n\n';
    body += 'Question:\n' + (d.question || '—') + '\n';
  }

  else if (formType === 'Feedback') {
    body += '── FEEDBACK / COMPLAINT ──\n';
    body += 'Subject      : ' + (d.subject       || '—') + '\n';
    body += 'Type         : ' + (d.feedback_type || '—') + '\n';
    body += 'Rating       : ' + (d.rating ? d.rating + ' / 5 stars' : 'Not rated') + '\n\n';
    body += 'Message:\n' + (d.message || '—') + '\n';
  }

  else if (formType === 'Suggestion') {
    body += '── SUGGESTION / FEATURE REQUEST ──\n';
    body += 'Suggestion For: ' + (d.suggestion_for || '—') + '\n';
    body += 'Credit Pref   : ' + (d.credit         || '—') + '\n\n';
    body += 'Suggestion:\n' + (d.suggestion || '—') + '\n';
  }

  else if (formType === 'Collaboration') {
    body += '── COLLABORATION / MEDIA INQUIRY ──\n';
    body += 'Inquiry Type : ' + (d.inquiry_type  || '—') + '\n';
    body += 'Website/Social: ' + (d.website      || '—') + '\n';
    body += 'Audience Size: ' + (d.audience_size || '—') + '\n\n';
    body += 'Proposal:\n' + (d.proposal || '—') + '\n';
  }

  body += '\n─────────────────────────────────────\n';
  body += 'Reply to this person at: ' + email + '\n';
  body += 'View all submissions in the "RLB Contact Hub" Google Sheet.\n';

  GmailApp.sendEmail(RECIPIENT_EMAIL, subject, body, {
    replyTo: email
  });
}

// ── Test function (run manually to verify setup) ─────────────
function testSubmission() {
  const testData = {
    formType      : 'App Issue',
    name          : 'Test User',
    email         : 'test@example.com',
    app_name      : 'Reading Journal',
    device_browser: 'Desktop — Chrome',
    what_happened : 'I clicked Recommendations and nothing happened.',
    error_code    : 'Uncaught TypeError: Cannot read property of undefined',
    frequency     : 'Every time',
    submittedAt   : new Date().toISOString()
  };
  writeToSheet(testData);
  sendEmailNotification(testData);
  Logger.log('Test submission complete — check your sheet and inbox!');
}
