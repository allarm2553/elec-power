/**
 * Google Apps Script สำหรับ Unit 4: วงจรอินเวอร์เตอร์แปลงผันไฟฟ้า (DC-to-AC Inverters)
 * วิชา อิเล็กทรอนิกส์กำลัง (Power Electronics 30105-2019)
 * 
 * วิธีติดตั้ง:
 * 1. เปิด Google Sheets ใหม่
 * 2. ไปที่ Extensions > Apps Script (ส่วนขยาย > Apps Script)
 * 3. ลบโค้ดเดิมแล้ววางโค้ดชุดนี้ลงไป
 * 4. กด Deploy > New deployment (การทำให้ใช้งานได้ > การทำให้ใช้งานได้รายการใหม่)
 * 5. เลือกประเภท: Web app (เว็บแอป)
 * 6. ตั้งค่า:
 *    - Execute as: Me (ฉัน)
 *    - Who has access: Anyone (ทุกคน)
 * 7. คัดลอก Web App URL นำไปวางในระบบใบงาน หรือแนบต่อท้าย URL ด้วย ?gas=WEB_APP_URL
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // สร้าง Header แถวแรกถ้าชีตยังว่างเปล่า
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "ประทับเวลา (Timestamp)",
        "ชื่อ-นามสกุล (Name)",
        "รหัสนักศึกษา (Student ID)",
        "กลุ่ม/ตอนเรียน (Class Group)",
        "โครงสร้างวงจร (Topology)",
        "Modulation Index (m_a)",
        "ความถี่ขาออก (f_out Hz)",
        "ความถี่สวิตชิ่ง (f_sw kHz)",
        "Dead-Time (µs)",
        "แรงดันเอาต์พุต V_rms (V)",
        "กระแสเอาต์พุต I_rms (A)",
        "ค่าความผิดเพี้ยนฮาร์มอนิก (THD %)",
        "คะแนนแบบทดสอบ (Quiz Score)",
        "สถานะการส่งงาน (Status)"
      ]);
      
      // จัดรูปแบบหัวตาราง
      var headerRange = sheet.getRange(1, 1, 1, 14);
      headerRange.setBackground("#1e1b4b");
      headerRange.setFontColor("#c084fc");
      headerRange.setFontWeight("bold");
      headerRange.setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
    }
    
    var data = JSON.parse(e.postData.contents);
    var studentId = String(data.studentId || "").trim();

    if (!studentId || studentId === "-") {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: "กรุณาระบุรหัสประจำตัวนักศึกษา"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 🔒 ตรวจสอบการส่งซ้ำในระบบ Google Sheet
    var dupCheck = checkDuplicate(studentId);
    if (dupCheck.duplicate) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "duplicate",
        duplicate: true,
        message: dupCheck.message
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    var score = 0;
    if (data.quizScore !== undefined && data.quizScore !== null && !isNaN(Number(data.quizScore))) {
      score = Number(data.quizScore);
    } else if (typeof data.quizScore === 'string') {
      var match = data.quizScore.match(/(\d+)\s*\/\s*\d+/);
      if (match) {
        score = Number(match[1]);
      }
    }
    
    var row = [
      new Date(),
      data.studentName || "-",
      studentId,
      data.studentGroup || "-",
      data.topology || "1-Phase Full Bridge",
      data.ma || 0.8,
      data.fout || 50,
      data.fsw || 10,
      data.deadtime || 1.5,
      data.vrms || 0,
      data.irms || 0,
      data.thd || 0,
      score,
      data.status || "Submitted"
    ];
    
    sheet.appendRow(row);
    var lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 13, 1, 1).setHorizontalAlignment("center").setNumberFormat("0");
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "บันทึกผลการทดลอง Unit 4 สำเร็จ",
      row: sheet.getLastRow()
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

/**
 * ตรวจสอบว่ารหัสประจำตัวนี้เคยส่งแบบทดสอบ/ผลการทดลองในหน่วยที่ 4 หรือไม่
 */
function checkDuplicate(studentId) {
  if (!studentId || String(studentId).trim() === "" || String(studentId).trim() === "-") {
    return { duplicate: false };
  }
  
  var cleanId = String(studentId).trim();
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRow = sheet.getLastRow();
  
  if (lastRow > 1) {
    // คอลัมน์ที่ 3 คือ Student ID (แถว 2 ถึง lastRow)
    var ids = sheet.getRange(2, 3, lastRow - 1, 1).getValues();
    for (var i = 0; i < ids.length; i++) {
      if (String(ids[i][0]).trim() === cleanId) {
        return {
          duplicate: true,
          row: i + 2,
          message: "❌ รหัสประจำตัว " + cleanId + " เคยส่งผลงานในหน่วยที่ 4 ไปแล้ว (ไม่อนุญาตให้ส่งซ้ำ)"
        };
      }
    }
  }
  
  return { duplicate: false };
}

function doGet(e) {
  var params = e ? e.parameter : {};
  if (params && params.action === "check" && params.studentId) {
    var result = checkDuplicate(params.studentId);
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService.createTextOutput(JSON.stringify({
    status: "online",
    message: "Unit 4 Inverters Apps Script is active."
  })).setMimeType(ContentService.MimeType.JSON);
}
