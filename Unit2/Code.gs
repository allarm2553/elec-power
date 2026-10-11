/**
 * Phase-Controlled Rectifiers Learning Lab (Unit 2)
 * Google Apps Script Server Code (Code.gs)
 * Developed for Course 30105-2019 Power Electronics
 */

function doGet(e) {
  var params = e ? e.parameter : {};
  if (params && params.action === "check" && params.studentId) {
    var result = checkDuplicate(params.studentId);
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService.createTextOutput(JSON.stringify({
    status: "online",
    message: "Unit 2 Controlled Rectifiers Apps Script is active."
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * ดึงชีตหรือสร้างตารางประวัติผลการทดลองและคะแนนของหน่วยที่ 2
 */
function getOrCreateSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetName = "Unit 2 - Controlled Rectifiers";
  var sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    // เพิ่มแถวหัวตาราง
    sheet.appendRow([
      "Timestamp (วัน-เวลา)", 
      "Student Name (ชื่อ-สกุล)", 
      "Student ID (รหัสนักศึกษา)",
      "Group (กลุ่มเรียน)",
      "Circuit Topology (ชนิดวงจร)", 
      "Firing Angle α (มุมจุดชนวน)",
      "V_dc (V)",
      "I_dc (A)",
      "THD / Score (THD หรือคะแนนสอบ)",
      "Status / Note (สถานะ/หมายเหตุ)"
    ]);
    
    // จัดแต่งฟอร์แมตหัวตาราง
    var range = sheet.getRange(1, 1, 1, 10);
    range.setFontWeight("bold");
    range.setBackground("#0f172a");
    range.setFontColor("#38bdf8");
    range.setHorizontalAlignment("center");
    sheet.setFrozenRows(1);
    
    for (var i = 1; i <= 10; i++) {
      sheet.autoResizeColumn(i);
    }
  }
  return sheet;
}

/**
 * ตรวจสอบว่ารหัสประจำตัวนี้เคยส่งแบบทดสอบ/ผลการทดลองในหน่วยที่ 2 หรือไม่
 */
function checkDuplicate(studentId) {
  if (!studentId || String(studentId).trim() === "" || String(studentId).trim() === "-") {
    return { duplicate: false };
  }
  
  var cleanId = String(studentId).trim();
  var sheet = getOrCreateSheet();
  var lastRow = sheet.getLastRow();
  
  if (lastRow > 1) {
    // คอลัมน์ที่ 3 คือ Student ID (แถว 2 ถึง lastRow)
    var ids = sheet.getRange(2, 3, lastRow - 1, 1).getValues();
    for (var i = 0; i < ids.length; i++) {
      if (String(ids[i][0]).trim() === cleanId) {
        return {
          duplicate: true,
          row: i + 2,
          message: "❌ รหัสประจำตัว " + cleanId + " เคยส่งผลงานในหน่วยที่ 2 ไปแล้ว (ไม่อนุญาตให้ส่งซ้ำ)"
        };
      }
    }
  }
  
  return { duplicate: false };
}

/**
 * บันทึกผลการทดสอบชิ้นงานหรือคะแนนแบบทดสอบลงใน Google Sheet
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var data = JSON.parse(e.postData.contents);
    var studentId = String(data.studentId || "").trim();

    if (!studentId || studentId === "-") {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        status: "error",
        message: "กรุณาระบุรหัสประจำตัวนักศึกษา"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 🔒 ตรวจสอบการส่งซ้ำในระบบ Google Sheet
    var dupCheck = checkDuplicate(studentId);
    if (dupCheck.duplicate) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        status: "duplicate",
        duplicate: true,
        message: dupCheck.message
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var sheet = getOrCreateSheet();
    var timestamp = new Date();
    
    sheet.appendRow([
      timestamp,
      data.name || "นักศึกษา",
      studentId,
      data.group || "-",
      data.topology || data.activity || "Controlled Rectifier Test",
      data.alpha || "-",
      data.vdc || "-",
      data.idc || "-",
      data.result || data.thd || "-",
      data.status || "Completed"
    ]);
    
    var lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1, 1, 1).setHorizontalAlignment("center");
    sheet.getRange(lastRow, 3, 1, 1).setHorizontalAlignment("center");
    sheet.getRange(lastRow, 6, 1, 1).setHorizontalAlignment("center");
    sheet.getRange(lastRow, 7, 1, 1).setHorizontalAlignment("center");
    sheet.getRange(lastRow, 8, 1, 1).setHorizontalAlignment("center");
    sheet.getRange(lastRow, 9, 1, 1).setHorizontalAlignment("center");

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      status: "success",
      message: "บันทึกผลการทดลอง Unit 2 ลง Google Sheet สำเร็จแล้ว!"
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      status: "error",
      message: "เกิดข้อผิดพลาด: " + err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
