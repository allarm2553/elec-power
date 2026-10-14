/**
 * Google Apps Script สำหรับ Unit 7: ประยุกต์และบำรุงรักษาระบบอิเล็กทรอนิกส์กำลังในงานอุตสาหกรรม
 * (Applications & Maintenance of Industrial Power Electronics Systems)
 * วิชา อิเล็กทรอนิกส์กำลัง (Power Electronics 30105-2019)
 * 
 * วิธีติดตั้ง:
 * 1. เปิด Google Sheets ใหม่ (https://sheets.new)
 * 2. ไปที่ ส่วนขยาย > Apps Script (Extensions > Apps Script)
 * 3. ลบโค้ดเดิมทั้งหมดออก แล้ววางโค้ดชุดนี้ลงไป
 * 4. กดปุ่ม "การทำให้ใช้งานได้" > "การทำให้ใช้งานได้รายการใหม่" (Deploy > New deployment)
 * 5. เลือกประเภท: เว็บแอป (Web app)
 * 6. กำหนดค่า:
 *    - ดำเนินการในฐานะ (Execute as): ฉัน (Me)
 *    - ผู้ที่มีสิทธิ์เข้าถึง (Who has access): ทุกคน (Anyone)
 * 7. กด "ทำให้ใช้งานได้" (Deploy) แล้วคัดลอก Web App URL
 * 8. นำ URL ไปวางในหน้าแล็บ Unit 7 (ช่อง URL บันทึกผล) หรือส่งต่อให้นักเรียนด้วยลิงก์ ?gas=WEB_APP_URL
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
        "คำสั่ง Modbus RTU (Modbus Command)",
        "ความถี่สั่งการ (Set Frequency Hz)",
        "ความเร็วและกระแส (RPM & Current A)",
        "การตัดแยกพลังงาน LOTO (LOTO Status)",
        "แรงดันคายประจุ DC Bus (DC Bus Discharge V)",
        "ผลตรวจเทอร์โมสแกน (Thermoscan Max Temp °C)",
        "ผลต่างอุณหภูมิ ΔT (Hotspot ΔT °C / NETA Status)",
        "ผลวิเคราะห์ฟอลต์และการแก้ไข (Fault Diagnosis & Action)",
        "คะแนนแบบทดสอบ (Quiz Score)",
        "สถานะการส่งงาน (Status)"
      ]);
      
      // จัดรูปแบบหัวตาราง Emerald / Industrial Teal Theme
      var headerRange = sheet.getRange(1, 1, 1, 14);
      headerRange.setBackground("#064e3b");
      headerRange.setFontColor("#6ee7b7");
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
      data.modbusCommand || "Slave 01: FC06 (Preset Single Register)",
      data.setFrequency !== undefined ? data.setFrequency + " Hz" : "-",
      data.rpmAndCurrent || "-",
      data.lotoStatus || "Verified Zero Energy (LOTO 6-Step Done)",
      data.dcDischargeVoltage !== undefined ? data.dcDischargeVoltage + " V (<50V Safe)" : "-",
      data.thermoscanTemp !== undefined ? data.thermoscanTemp + " °C" : "-",
      data.deltaTStatus || "Normal (ΔT < 10°C)",
      data.faultDiagnosis || "Inverter Health Normal (No Active Faults)",
      score,
      data.status || "Submitted"
    ];
    
    sheet.appendRow(row);
    var lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 13, 1, 1).setHorizontalAlignment("center").setNumberFormat("0");
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "บันทึกผลการทดลองและรายงานชิ้นงาน Unit 7 สำเร็จ",
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

function doGet(e) {
  var studentId = e.parameter.studentId;
  if (studentId) {
    var check = checkDuplicate(studentId);
    return ContentService.createTextOutput(JSON.stringify(check))
      .setMimeType(ContentService.MimeType.JSON);
  }
  return ContentService.createTextOutput(JSON.stringify({
    status: "online",
    unit: 7,
    name: "ประยุกต์และบำรุงรักษาระบบอิเล็กทรอนิกส์กำลังในงานอุตสาหกรรม",
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * ฟังก์ชันตรวจสอบการส่งงานซ้ำของรหัสนักศึกษา (คอลัมน์ C)
 */
function checkDuplicate(studentId) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRow = sheet.getLastRow();
  
  if (lastRow <= 1) {
    return { duplicate: false };
  }
  
  var targetId = String(studentId).trim().toLowerCase();
  var idRange = sheet.getRange(2, 3, lastRow - 1, 1).getValues();
  
  for (var i = 0; i < idRange.length; i++) {
    var existingId = String(idRange[i][0]).trim().toLowerCase();
    if (existingId && existingId === targetId) {
      return {
        duplicate: true,
        message: "รหัสนักศึกษา " + studentId + " ได้ส่งงาน/ทำแบบทดสอบในหน่วยที่ 7 ไปแล้ว (ห้ามส่งซ้ำ)",
        submittedRow: i + 2
      };
    }
  }
  
  return { duplicate: false };
}
