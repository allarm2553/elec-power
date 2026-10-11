/**
 * =========================================================================
 * ⚡ Master Google Apps Script (All-in-One: Units 1 - 7)
 * วิชา อิเล็กทรอนิกส์กำลัง (Power Electronics 30105-2019)
 * =========================================================================
 * 
 * สคริปต์กลางตัวเดียวสำหรับจัดการทั้ง 7 หน่วยการเรียนรู้
 * - ใช้กับ Google Sheet เพียง 1 ไฟล์
 * - ได้รับ Web App URL เพียง 1 ลิงก์ แล้วนำไปใส่ในช่อง "URL กลาง" ของระบบ
 * - แยกแท็บชีตอัตโนมัติ 7 แท็บ (Unit 1 ถึง Unit 7) พร้อมจัดรูปแบบหัวตารางสวยงาม
 * - ระบบป้องกันการส่งงานซ้ำแยกรายหน่วยและรายรหัสนักศึกษา (Anti-Duplicate)
 * 
 * ขั้นตอนการติดตั้ง:
 * 1. เปิด Google Sheet ใหม่ (ไฟล์เดียวจบทั้ง 7 หน่วย)
 * 2. เมนู ส่วนขยาย (Extensions) > Apps Script
 * 3. ลบโค้ดเดิมทั้งหมด แล้ววางโค้ดชุดนี้ลงไป
 * 4. กดปุ่ม การทำให้ใช้งานได้ (Deploy) > การทำให้ใช้งานได้รายการใหม่ (New deployment)
 * 5. เลือกประเภท: เว็บแอป (Web App)
 * 6. ตั้งค่า:
 *    - Execute as: ฉัน (Me)
 *    - Who has access: ทุกคน (Anyone)
 * 7. กด Deploy และคัดลอก "Web App URL" (ที่ลงท้ายด้วย /exec)
 * 8. นำ URL มากรอกในช่อง "Google Apps Script Web App URL กลาง" ในหน้าครูผู้สอน
 * =========================================================================
 */

function doGet(e) {
  var params = e ? e.parameter : {};
  if (params && params.action === "check" && params.studentId && params.unit) {
    var result = checkDuplicateInUnit(params.unit, params.studentId);
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService.createTextOutput(JSON.stringify({
    status: "online",
    message: "⚡ Power Electronics Master Hub Apps Script (Units 1-7) is Active and Ready."
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(15000);

  try {
    var data = {};
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: "No POST payload received"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var studentId = String(data.studentId || "").trim();
    var studentName = String(data.studentName || data.name || "").trim();
    var studentGroup = String(data.studentGroup || data.group || "").trim();

    if (!studentId || studentId === "-") {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: "กรุณาระบุรหัสประจำตัวนักศึกษา"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var unitTarget = detectUnit(data);
    var sheet = getOrCreateUnitSheet(ss, unitTarget);

    // ตรวจสอบการส่งซ้ำในหน่วยนี้ (Anti-Duplicate Check)
    var rows = sheet.getDataRange().getValues();
    for (var r = 1; r < rows.length; r++) {
      if (String(rows[r][2]).trim() === studentId) {
        return ContentService.createTextOutput(JSON.stringify({
          status: "duplicate",
          message: "รหัสนักศึกษา " + studentId + " เคยบันทึกคะแนนในหน่วยนี้แล้ว (ห้ามส่งซ้ำ)"
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }

    var timestamp = Utilities.formatDate(new Date(), "Asia/Bangkok", "dd/MM/yyyy HH:mm:ss");

    // บันทึกแถวข้อมูลตามโครงสร้างของแต่ละหน่วย
    appendUnitRow(sheet, unitTarget, timestamp, studentName, studentId, studentGroup, data);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      unit: unitTarget,
      message: "บันทึกผลการทดลองและคะแนนเข้า " + sheet.getName() + " สำเร็จเรียบร้อย",
      timestamp: timestamp
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: "Internal Server Error: " + err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

/**
 * วิเคราะห์หาหน่วยการเรียนรู้จากฟิลด์ Payload ที่ส่งเข้ามา
 */
function detectUnit(data) {
  if (data.plcStatus !== undefined || data.lotoDone !== undefined || data.thermoMaxTemp !== undefined) {
    return 7;
  }
  if (data.logData !== undefined || (data.targetRpm !== undefined && data.vfRatio !== undefined)) {
    return 6;
  }
  if (data.upsMode !== undefined || data.emergLux !== undefined || data.transferMs !== undefined) {
    return 5;
  }
  if (data.deadtime !== undefined || data.ma !== undefined || data.mf !== undefined) {
    return 4;
  }
  if (data.topo !== undefined || data.fsw !== undefined || data.duty !== undefined) {
    return 3;
  }
  if (data.activity && (data.activity.indexOf("Unit 2") !== -1 || data.activity.indexOf("เรียงกระแส") !== -1)) {
    return 2;
  }
  return 1;
}

/**
 * ดึงหรือสร้าง Sheet Tab เฉพาะหน่วย พร้อมใส่ Header สวยงาม
 */
function getOrCreateUnitSheet(ss, unitNum) {
  var configs = {
    1: {
      name: "Unit 1 - Switching Devices",
      bg: "#0f172a", fg: "#38bdf8",
      headers: [
        "Timestamp (วัน-เวลา)", "Student Name (ชื่อ-สกุล)", "Student ID (รหัสนักศึกษา)",
        "Group (กลุ่มเรียน)", "Activity (กิจกรรม/อุปกรณ์)", "Test Values (ค่าที่วัดได้/คะแนน)",
        "Status / Note (สถานะ/หมายเหตุ)"
      ]
    },
    2: {
      name: "Unit 2 - Controlled Rectifiers",
      bg: "#0c1b33", fg: "#34d399",
      headers: [
        "Timestamp (วัน-เวลา)", "Student Name (ชื่อ-สกุล)", "Student ID (รหัสนักศึกษา)",
        "Group (กลุ่มเรียน)", "Activity (กิจกรรม/วงจร)", "Result & Score (ผลการทดสอบ/คะแนน)",
        "Evaluation (ผลการประเมิน)"
      ]
    },
    3: {
      name: "Unit 3 - DC-DC Converters",
      bg: "#1e293b", fg: "#38bdf8",
      headers: [
        "Timestamp (วัน-เวลา)", "Student Name (ชื่อ-สกุล)", "Student ID (รหัสนักศึกษา)",
        "Group (กลุ่มเรียน)", "Topology (ชนิดวงจร)", "Duty Cycle (D %)",
        "Switching Freq (kHz)", "Inductor L (µH)", "Mode (CCM/DCM)",
        "V_out (V)", "I_out (A)", "Efficiency (%)", "Quiz Score (คะแนน)", "Status (สถานะ)"
      ]
    },
    4: {
      name: "Unit 4 - Inverters",
      bg: "#1e1b4b", fg: "#c084fc",
      headers: [
        "Timestamp (วัน-เวลา)", "Student Name (ชื่อ-สกุล)", "Student ID (รหัสนักศึกษา)",
        "Group (กลุ่มเรียน)", "Topology (โครงสร้าง)", "m_a (Modulation Index)",
        "f_out (Hz)", "f_sw (kHz)", "Dead-Time (µs)", "V_rms (V)", "I_rms (A)",
        "THD (%)", "Quiz Score (คะแนน)", "Status (สถานะ)"
      ]
    },
    5: {
      name: "Unit 5 - UPS & Emergency",
      bg: "#3b0764", fg: "#f472b6",
      headers: [
        "Timestamp (วัน-เวลา)", "Student Name (ชื่อ-สกุล)", "Student ID (รหัสนักศึกษา)",
        "Group (กลุ่มเรียน)", "Topology (ระบบ UPS)", "Transfer Time (ms)",
        "Load Power (W)", "Battery (Ah)", "Backup Time (min)",
        "Charge Stage", "Emergency Lamp", "Quiz Score (คะแนน)", "Status (สถานะ)"
      ]
    },
    6: {
      name: "Unit 6 - Motor Drive & VFD",
      bg: "#451a03", fg: "#f59e0b",
      headers: [
        "Timestamp (วัน-เวลา)", "Student Name (ชื่อ-สกุล)", "Student ID (รหัสนักศึกษา)",
        "Group (กลุ่มเรียน)", "Control Mode (โหมดควบคุม)", "Set Freq (Hz)",
        "Target RPM", "Actual RPM", "Motor Current (A)", "Torque (Nm)",
        "V/f Ratio", "Acc/Dec (s)", "Fault Status", "Quiz Score (คะแนน)", "Status (สถานะ)"
      ]
    },
    7: {
      name: "Unit 7 - PLC & Maintenance",
      bg: "#064e3b", fg: "#6ee7b7",
      headers: [
        "Timestamp (วัน-เวลา)", "Student Name (ชื่อ-สกุล)", "Student ID (รหัสนักศึกษา)",
        "Group (กลุ่มเรียน)", "Modbus Command", "Set Freq (Hz)", "RPM & Current",
        "LOTO Status", "DC Bus Discharge (V)", "Thermoscan Temp (°C)", "Hotspot ΔT / NETA",
        "Fault Diagnosis", "Quiz Score (คะแนน)", "Status (สถานะ)"
      ]
    }
  };

  var cfg = configs[unitNum] || configs[1];
  var sheet = ss.getSheetByName(cfg.name);

  if (!sheet) {
    sheet = ss.insertSheet(cfg.name);
    sheet.appendRow(cfg.headers);

    var headerRange = sheet.getRange(1, 1, 1, cfg.headers.length);
    headerRange.setBackground(cfg.bg);
    headerRange.setFontColor(cfg.fg);
    headerRange.setFontWeight("bold");
    headerRange.setHorizontalAlignment("center");
    sheet.setFrozenRows(1);

    for (var i = 1; i <= cfg.headers.length; i++) {
      sheet.autoResizeColumn(i);
    }
  }

  return sheet;
}

/**
 * เพิ่มแถวข้อมูลตามหน่วย
 */
function appendUnitRow(sheet, unitNum, timestamp, studentName, studentId, studentGroup, data) {
  var row = [];

  if (unitNum === 1) {
    row = [
      timestamp, studentName, studentId, studentGroup,
      data.activity || "หน่วยที่ 1 สวิตชิ่งกำลัง",
      data.result || "-",
      data.status || "ส่งงานสมบูรณ์"
    ];
  } else if (unitNum === 2) {
    row = [
      timestamp, studentName, studentId, studentGroup,
      data.activity || "Unit 2 Rectifiers",
      data.result || "-",
      data.status || "ส่งงานสมบูรณ์"
    ];
  } else if (unitNum === 3) {
    row = [
      timestamp, studentName, studentId, studentGroup,
      data.topo ? data.topo.toUpperCase() : "-",
      data.duty !== undefined ? data.duty + " %" : "-",
      data.fsw !== undefined ? data.fsw + " kHz" : "-",
      data.L !== undefined ? data.L + " µH" : "-",
      data.mode || "-",
      data.vout !== undefined ? data.vout + " V" : "-",
      data.iout !== undefined ? data.iout + " A" : "-",
      data.efficiency !== undefined ? data.efficiency + " %" : "-",
      (data.quizScore !== undefined ? data.quizScore : "-") + " / " + (data.quizTotal || 5),
      data.status || "Completed"
    ];
  } else if (unitNum === 4) {
    row = [
      timestamp, studentName, studentId, studentGroup,
      data.topo || "Full-Bridge SPWM",
      data.ma !== undefined ? data.ma : "-",
      data.fo !== undefined ? data.fo + " Hz" : "-",
      data.fsw !== undefined ? data.fsw + " kHz" : "-",
      data.deadtime !== undefined ? data.deadtime + " µs" : "-",
      data.vrms !== undefined ? data.vrms + " V" : "-",
      data.irms !== undefined ? data.irms + " A" : "-",
      data.thd !== undefined ? data.thd + " %" : "-",
      (data.quizScore !== undefined ? data.quizScore : "-") + " / " + (data.quizTotal || 5),
      data.status || "Completed"
    ];
  } else if (unitNum === 5) {
    row = [
      timestamp, studentName, studentId, studentGroup,
      data.upsMode || "Online Double-Conversion",
      data.transferMs !== undefined ? data.transferMs + " ms" : "0 ms",
      data.loadWatt !== undefined ? data.loadWatt + " W" : "-",
      data.battCap !== undefined ? data.battCap + " Ah" : "-",
      data.backupMin !== undefined ? data.backupMin + " min" : "-",
      data.chargeStage || "Float Charge (13.6V)",
      data.emergLux !== undefined ? data.emergLux + " Lux" : "Normal",
      (data.quizScore !== undefined ? data.quizScore : "-") + " / " + (data.quizTotal || 5),
      data.status || "Completed"
    ];
  } else if (unitNum === 6) {
    var logsSummary = Array.isArray(data.logData) ? data.logData.length + " ชุดข้อมูล" : "-";
    row = [
      timestamp, studentName, studentId, studentGroup,
      data.controlMode || "VFD V/f Scalar",
      data.setFreq !== undefined ? data.setFreq + " Hz" : "-",
      data.targetRpm !== undefined ? data.targetRpm : "-",
      data.actualRpm !== undefined ? data.actualRpm : "-",
      data.current !== undefined ? data.current + " A" : "-",
      data.torque !== undefined ? data.torque + " Nm" : "-",
      data.vfRatio || "-",
      data.accDec || "5.0s / 5.0s",
      data.fault || "Normal (OK)",
      (data.quizScore !== undefined ? data.quizScore : "-") + " / " + (data.quizTotal || 5),
      data.status || "บันทึก " + logsSummary
    ];
  } else if (unitNum === 7) {
    row = [
      timestamp, studentName, studentId, studentGroup,
      data.modbusCmd || "01 06 20 00 00 01 (Run)",
      data.freqHz !== undefined ? data.freqHz + " Hz" : "-",
      data.rpmCurrent || "-",
      data.lotoDone ? "LOTO ผ่านสมบูรณ์ (Verified)" : "ยังไม่เสร็จสิ้น",
      data.dcVolt !== undefined ? data.dcVolt + " V" : "-",
      data.thermoMaxTemp !== undefined ? data.thermoMaxTemp + " °C" : "-",
      data.deltaT !== undefined ? data.deltaT + " °C (NETA Normal)" : "-",
      data.faultResolved ? "แก้ไขสำเร็จ (Cleared)" : "ปกติ",
      (data.quizScore !== undefined ? data.quizScore : "-") + " / " + (data.quizTotal || 10),
      data.status || "ผ่านเกณฑ์ตรวจซ่อมบำรุง"
    ];
  }

  sheet.appendRow(row);
}

/**
 * ฟังก์ชันตรวจสอบการส่งซ้ำ
 */
function checkDuplicateInUnit(unitNum, studentId) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = getOrCreateUnitSheet(ss, parseInt(unitNum, 10));
  var rows = sheet.getDataRange().getValues();

  for (var i = 1; i < rows.length; i++) {
    if (String(rows[i][2]).trim() === String(studentId).trim()) {
      return {
        exists: true,
        studentId: studentId,
        studentName: rows[i][1],
        timestamp: rows[i][0]
      };
    }
  }

  return { exists: false, studentId: studentId };
}
