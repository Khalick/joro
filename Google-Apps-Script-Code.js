// Google Apps Script for Jura Resort Booking System
// Copy this entire code to your Google Apps Script project

function doPost(e) {
  try {
    // Get the active spreadsheet (make sure you have one created)
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // If no headers exist, create them
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, 8).setValues([
        ['Timestamp', 'Name', 'Email', 'Phone', 'Details', 'Source', 'Status', 'Notes']
      ]);
      // Format headers
      sheet.getRange(1, 1, 1, 8).setFontWeight('bold').setBackground('#4285f4').setFontColor('white');
    }
    
    // Parse the incoming data
    const data = e.parameter;
    
    // Create timestamp
    const timestamp = new Date().toLocaleString('en-US', {
      timeZone: 'Africa/Nairobi',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    
    // Prepare row data
    const rowData = [
      timestamp,
      data.name || 'N/A',
      data.email || 'N/A',
      data.phone || 'N/A',
      data.details || 'N/A',
      data.source || 'Website',
      'New',
      ''
    ];
    
    // Add data to sheet
    sheet.appendRow(rowData);
    
    // Send email notification to business
    sendEmailNotification({
      timestamp: timestamp,
      name: data.name,
      email: data.email,
      phone: data.phone,
      details: data.details,
      source: data.source
    });
    
    // Send confirmation email to customer
    sendCustomerConfirmation({
      customerEmail: data.email,
      customerName: data.name,
      bookingDetails: data.details,
      timestamp: timestamp
    });
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Booking recorded successfully',
        timestamp: timestamp
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error processing booking:', error);
    
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Failed to process booking: ' + error.message
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function sendEmailNotification(booking) {
  try {
    const subject = `🏨 New Jura Resort Booking - ${booking.name}`;
    const body = `
🏨 NEW BOOKING RECEIVED

📅 Date/Time: ${booking.timestamp}
👤 Customer Name: ${booking.name}
📧 Email: ${booking.email}
📱 Phone: ${booking.phone}
📍 Source: ${booking.source}

📋 Booking Details:
${booking.details}

---
Please contact the customer to confirm their reservation.

Jura Resort Management System
    `;
    
    // Send to your business email - REPLACE WITH YOUR ACTUAL EMAIL
    MailApp.sendEmail('your-email@example.com', subject, body);
    
  } catch (error) {
    console.error('Error sending business notification:', error);
  }
}

function sendCustomerConfirmation(details) {
  try {
    if (!details.customerEmail || details.customerEmail === 'N/A') {
      return; // Skip if no email provided
    }
    
    const subject = `✅ Booking Confirmation - Jura Resort`;
    const body = `
Dear ${details.customerName},

Thank you for your booking request at Jura Resort!

📅 Booking Time: ${details.timestamp}
📋 Your Request: ${details.bookingDetails}

🔔 NEXT STEPS:
Our team will review your request and contact you within 2 hours to confirm availability and provide final details.

📱 For immediate assistance, contact us:
Phone: +254 722 566 089
WhatsApp: +254 722 566 089

🏨 We look forward to welcoming you to Jura Resort on the beautiful shores of Lake Victoria!

Best regards,
Jura Resort Team
Lake Victoria, Migori County, Kenya
    `;
    
    MailApp.sendEmail(details.customerEmail, subject, body);
    
  } catch (error) {
    console.error('Error sending customer confirmation:', error);
  }
}

// Test function to verify setup
function testBooking() {
  const testData = {
    parameter: {
      name: 'Test Customer',
      email: 'test@example.com',
      phone: '+254712345678',
      details: 'Test booking for 2 people, dinner reservation',
      source: 'Test'
    }
  };
  
  const result = doPost(testData);
  console.log('Test result:', result.getContent());
}