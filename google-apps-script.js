/**
 * JURA RESORT BOOKING SYSTEM - GOOGLE APPS SCRIPT
 * 
 * This script receives booking data from your website forms and saves it to Google Sheets.
 * It also sends email notifications and can integrate with other services.
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to https://script.google.com/
 * 2. Create a new project
 * 3. Replace the default code with this script
 * 4. Update the SPREADSHEET_ID and EMAIL settings below
 * 5. Deploy as a web app with execute permissions for "Anyone"
 * 6. Copy the web app URL and replace YOUR_GOOGLE_SCRIPT_URL_HERE in your HTML files
 */

// ========== CONFIGURATION ==========
const CONFIG = {
  SPREADSHEET_ID: 'YOUR_SPREADSHEET_ID_HERE', // Replace with your Google Sheets ID
  SHEET_NAME: 'Bookings', // Name of the sheet tab
  NOTIFICATION_EMAIL: 'reservations@juraresort.com', // Email to receive notifications
  BUSINESS_NAME: 'Jura Resort',
  BUSINESS_PHONE: '+254 722 566 089'
};

/**
 * Main function to handle POST requests from website forms
 */
function doPost(e) {
  try {
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Add booking to spreadsheet
    const result = addBookingToSheet(data);
    
    // Send notification email
    sendNotificationEmail(data);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Booking recorded successfully',
        bookingId: result.bookingId
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error processing booking:', error);
    
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Failed to process booking',
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Add booking data to Google Sheets
 */
function addBookingToSheet(data) {
  try {
    // Open the spreadsheet
    const spreadsheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    
    // Get or create the bookings sheet
    let sheet = spreadsheet.getSheetByName(CONFIG.SHEET_NAME);
    if (!sheet) {
      sheet = spreadsheet.insertSheet(CONFIG.SHEET_NAME);
      
      // Add headers if this is a new sheet
      const headers = [
        'Booking ID',
        'Timestamp',
        'Name',
        'Email',
        'Contact',
        'Message/Details',
        'Source',
        'Status',
        'Follow-up Date',
        'Notes'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // Format headers
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#4CAF50');
      headerRange.setFontColor('white');
    }
    
    // Generate unique booking ID
    const bookingId = 'JR-' + new Date().getFullYear() + '-' + 
                     String(sheet.getLastRow()).padStart(4, '0');
    
    // Prepare row data
    const rowData = [
      bookingId,
      data.timestamp || new Date().toLocaleString(),
      data.name || '',
      data.email || '',
      data.contact || '',
      data.message || '',
      data.source || 'Website',
      data.status || 'Pending',
      '', // Follow-up date (empty for now)
      '' // Notes (empty for now)
    ];
    
    // Add the new booking
    sheet.appendRow(rowData);
    
    // Auto-resize columns for better visibility
    sheet.autoResizeColumns(1, rowData.length);
    
    console.log('Booking added successfully:', bookingId);
    return { bookingId: bookingId };
    
  } catch (error) {
    console.error('Error adding booking to sheet:', error);
    throw error;
  }
}

/**
 * Send email notification about new booking
 */
function sendNotificationEmail(data) {
  try {
    const subject = `🏨 New Booking Request - ${CONFIG.BUSINESS_NAME}`;
    
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #4CAF50; color: white; padding: 20px; text-align: center;">
          <h1>🏨 New Booking Request</h1>
          <p>${CONFIG.BUSINESS_NAME}</p>
        </div>
        
        <div style="padding: 20px; background: #f9f9f9;">
          <h2>📋 Booking Details</h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #ddd;">Name:</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.name}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #ddd;">Email:</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.email}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #ddd;">Contact:</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.contact}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #ddd;">Source:</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.source}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #ddd;">Timestamp:</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.timestamp}</td>
            </tr>
          </table>
          
          <h3>💬 Message/Details:</h3>
          <div style="background: white; padding: 15px; border-left: 4px solid #4CAF50; margin: 10px 0;">
            ${data.message}
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background: #e3f2fd; border-radius: 5px;">
            <h3>📞 Quick Actions:</h3>
            <p>
              <strong>Call:</strong> <a href="tel:${data.contact}">${data.contact}</a><br>
              <strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a><br>
              <strong>WhatsApp:</strong> <a href="https://wa.me/${data.contact.replace(/[^0-9]/g, '')}">Send WhatsApp Message</a>
            </p>
          </div>
        </div>
        
        <div style="background: #333; color: white; padding: 15px; text-align: center;">
          <p>📊 View all bookings in your <a href="https://docs.google.com/spreadsheets/d/${CONFIG.SPREADSHEET_ID}" style="color: #4CAF50;">Google Sheets Dashboard</a></p>
        </div>
      </div>
    `;
    
    // Send the email
    MailApp.sendEmail({
      to: CONFIG.NOTIFICATION_EMAIL,
      subject: subject,
      htmlBody: htmlBody
    });
    
    console.log('Notification email sent successfully');
    
  } catch (error) {
    console.error('Error sending notification email:', error);
    // Don't throw error here - booking should still be saved even if email fails
  }
}

/**
 * Test function to verify the setup
 */
function testBookingSystem() {
  const testData = {
    timestamp: new Date().toLocaleString(),
    name: 'Test Customer',
    email: 'test@example.com',
    contact: '+254700000000',
    message: 'Test booking for 2 people, tomorrow at 7 PM',
    source: 'Test',
    status: 'Test'
  };
  
  try {
    const result = addBookingToSheet(testData);
    sendNotificationEmail(testData);
    console.log('✅ Test completed successfully! Booking ID:', result.bookingId);
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

/**
 * Function to handle GET requests (for testing)
 */
function doGet() {
  return ContentService.createTextOutput('Jura Resort Booking System is running! ✅');
}

/**
 * Initialize the spreadsheet with proper formatting
 */
function initializeSpreadsheet() {
  try {
    const spreadsheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(CONFIG.SHEET_NAME);
    
    if (!sheet) {
      sheet = spreadsheet.insertSheet(CONFIG.SHEET_NAME);
    }
    
    // Clear existing content
    sheet.clear();
    
    // Add headers
    const headers = [
      'Booking ID',
      'Timestamp', 
      'Name',
      'Email',
      'Contact',
      'Message/Details',
      'Source',
      'Status',
      'Follow-up Date',
      'Notes'
    ];
    
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // Format headers
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#4CAF50');
    headerRange.setFontColor('white');
    headerRange.setHorizontalAlignment('center');
    
    // Set column widths
    sheet.setColumnWidth(1, 120); // Booking ID
    sheet.setColumnWidth(2, 150); // Timestamp
    sheet.setColumnWidth(3, 150); // Name
    sheet.setColumnWidth(4, 200); // Email
    sheet.setColumnWidth(5, 130); // Contact
    sheet.setColumnWidth(6, 300); // Message
    sheet.setColumnWidth(7, 100); // Source
    sheet.setColumnWidth(8, 100); // Status
    sheet.setColumnWidth(9, 120); // Follow-up
    sheet.setColumnWidth(10, 200); // Notes
    
    console.log('✅ Spreadsheet initialized successfully!');
    
  } catch (error) {
    console.error('❌ Error initializing spreadsheet:', error);
  }
}