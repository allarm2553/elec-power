/**
 * =========================================================================
 * ⚡ Master Google Apps Script (All-in-One: Units 1 - 7)
 * วิชา อิเล็กทรอนิกส์กำลัง (Power Electronics 30105-2019)
 * =========================================================================
 * 
 * สคริปต์กลางตัวเดียวสำหรับจัดการทั้ง 7 หน่วยการเรียนรู้
 * - ใช้กับ Google Sheet เพียง 1 ไฟล์
 * - ได้รับ Web App URL เพียง 1 ลิงก์ แล้วนำไปใส่ในช่อง "URL กลาง" ของระบบ
 * - แยกแท็บชีตอัตโนมัติ 7 แท็บ (Unit 1 ถึง Unit 7) ตรงคอลัมน์เป๊ะ 100%
 * - ระบบป้องกันการส่งงานซ้ำแยกรายหน่วยและรายรหัสนักศึกษา (Anti-Duplicate)
 * - บันทึกคะแนนแบบตัวเลขล้วน (Pure Numeric) เพื่อให้สูตรคำนวณและตัดเกรดได้ทันที
 * - มีฟังก์ชัน setupAllUnitHeaders() ให้กดรันครั้งเดียวเพื่อจัดระเบียบหัวตารางครบ 7 หน่วย
 * 
 * ขั้นตอนการติดตั้ง:
 * 1. เปิด Google Sheet (ไฟล์ "คะแนนทดสอบ" หรือสร้างใหม่)
 * 2. เมนู ส่วนขยาย (Extensions) > Apps Script
 * 3. ลบโค้ดเดิมทั้งหมด แล้ววางโค้ดชุดนี้ลงไป
 * 4. กดปุ่ม การทำให้ใช้งานได้ (Deploy) > จัดการการทำให้ใช้งานได้ (Manage deployments)
 * 5. กดไอคอนรูปดินสอ (Edit) > เลือก Version: การทำให้ใช้งานได้รายการใหม่ (New version) แล้วกด Deploy
 * 6. (แนะนำ) ใน Apps Script เลือกฟังก์ชัน setupAllUnitHeaders แล้วกด "เรียกใช้ (Run)" 1 ครั้ง
 * =========================================================================
 */

// โครงสร้างหัวตารางและธีมสีประจำแต่ละหน่วย (Unit 1 - Unit 7)
var UNIT_CONFIGS = {
  1: {
    name: "Unit 1 - Switching Devices",
    bg: "#0f172a", fg: "#38bdf8",
    headers: [
      "Timestamp (วัน-เวลา)", 
      "Student Name (ชื่อ-สกุล)", 
      "Student ID (รหัสนักศึกษา)",
      "Group (กลุ่มเรียน)", 
      "Activity (กิจกรรม/อุปกรณ์)", 
      "Quiz Score (คะแนนแบบทดสอบ)",
      "Status / Note (สถานะ/หมายเหตุ)"
    ]
  },
  2: {
    name: "Unit 2 - Controlled Rectifiers",
    bg: "#0c1b33", fg: "#34d399",
    headers: [
      "Timestamp (วัน-เวลา)", 
      "Student Name (ชื่อ-สกุล)", 
      "Student ID (รหัสนักศึกษา)",
      "Group (กลุ่มเรียน)", 
      "Circuit Topology (ชนิดวงจร)", 
      "Firing Angle α (มุมจุดชนวน)",
      "V_dc (V)", 
      "I_dc (A)", 
      "Quiz Score (คะแนนแบบทดสอบ)", 
      "Status / Note (สถานะ/หมายเหตุ)"
    ]
  },
  3: {
    name: "Unit 3 - DC-DC Converters",
    bg: "#1e293b", fg: "#38bdf8",
    headers: [
      "Timestamp (วัน-เวลา)", 
      "Student Name (ชื่อ-สกุล)", 
      "Student ID (รหัสนักศึกษา)",
      "Group (กลุ่มเรียน)", 
      "Topology (ชนิดวงจร)", 
      "Duty Cycle (D %)",
      "Switching Freq (kHz)", 
      "Inductor L (µH)", 
      "Mode (CCM/DCM)",
      "V_out (V)", 
      "I_out (A)", 
      "Efficiency (%)", 
      "Quiz Score (คะแนนแบบทดสอบ)", 
      "Status (สถานะ)"
    ]
  },
  4: {
    name: "Unit 4 - Inverters",
    bg: "#1e1b4b", fg: "#c084fc",
    headers: [
      "Timestamp (วัน-เวลา)", 
      "Student Name (ชื่อ-สกุล)", 
      "Student ID (รหัสนักศึกษา)",
      "Group (กลุ่มเรียน)", 
      "Topology (โครงสร้างวงจร)", 
      "m_a (Modulation Index)",
      "f_out (Hz)", 
      "f_sw (kHz)", 
      "Dead-Time (µs)", 
      "V_rms (V)", 
      "I_rms (A)",
      "THD (%)", 
      "Quiz Score (คะแนนแบบทดสอบ)", 
      "Status (สถานะ)"
    ]
  },
  5: {
    name: "Unit 5 - UPS & Emergency",
    bg: "#3b0764", fg: "#f472b6",
    headers: [
      "Timestamp (วัน-เวลา)", 
      "Student Name (ชื่อ-สกุล)", 
      "Student ID (รหัสนักศึกษา)",
      "Group (กลุ่มเรียน)", 
      "Topology (ระบบ UPS)", 
      "Transfer Time (ms)",
      "Load Power (W)", 
      "Battery (Ah)", 
      "Backup Time (min)",
      "Charge Stage (สเตจการชาร์จ)", 
      "Emergency Lamp (ไฟฉุกเฉิน)", 
      "Quiz Score (คะแนนแบบทดสอบ)", 
      "Status (สถานะ)"
    ]
  },
  6: {
    name: "Unit 6 - Motor Drive & VFD",
    bg: "#451a03", fg: "#f59e0b",
    headers: [
      "Timestamp (วัน-เวลา)", 
      "Student Name (ชื่อ-สกุล)", 
      "Student ID (รหัสนักศึกษา)",
      "Group (กลุ่มเรียน)", 
      "Control Mode (โหมดควบคุม)", 
      "Set Freq (Hz)",
      "Target RPM", 
      "Actual RPM", 
      "Motor Current (A)", 
      "Torque (Nm)",
      "V/f Ratio (V/Hz)", 
      "Acc/Dec (s)", 
      "Fault Status (สถานะฟอลต์)", 
      "Quiz Score (คะแนนแบบทดสอบ)", 
      "Status (สถานะ)"
    ]
  },
  7: {
    name: "Unit 7 - PLC & Maintenance",
    bg: "#064e3b", fg: "#6ee7b7",
    headers: [
      "Timestamp (วัน-เวลา)", 
      "Student Name (ชื่อ-สกุล)", 
      "Student ID (รหัสนักศึกษา)",
      "Group (กลุ่มเรียน)", 
      "Modbus Command (คำสั่ง Modbus)", 
      "Set Freq (Hz)", 
      "RPM & Current (ความเร็ว/กระแส)",
      "LOTO Status (สถานะ LOTO)", 
      "DC Bus Discharge (V)", 
      "Thermoscan Temp (°C)", 
      "Hotspot ΔT / NETA",
      "Fault Diagnosis (การวินิจฉัยฟอลต์)", 
      "Quiz Score (คะแนนแบบทดสอบ)", 
      "Status (สถานะ)"
    ]
  }
};

function doGet(e) {
  var params = e ? e.parameter : {};
  if (params && params.action === "check" && params.studentId) {
    var unitNum = params.unit ? parseInt(params.unit, 10) : 1;
    var result = checkDuplicateInUnit(unitNum, params.studentId);
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

    // ตรวจสอบการส่งซ้ำในหน่วยนี้ (Anti-Duplicate Check in Unit Tab)
    var rows = sheet.getDataRange().getValues();
    for (var r = 1; r < rows.length; r++) {
      if (String(rows[r][2]).trim() === studentId) {
        return ContentService.createTextOutput(JSON.stringify({
          status: "duplicate",
          duplicate: true,
          unit: unitTarget,
          message: "รหัสนักศึกษา " + studentId + " เคยบันทึกคะแนนในหน่วยที่ " + unitTarget + " แล้ว (ห้ามส่งซ้ำ)"
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }

    var timestamp = Utilities.formatDate(new Date(), "Asia/Bangkok", "dd/MM/yyyy HH:mm:ss");

    // บันทึกแถวข้อมูลตามโครงสร้างของแต่ละหน่วย พร้อมจัดรูปแบบตัวเลข
    appendUnitRow(sheet, unitTarget, timestamp, studentName, studentId, studentGroup, data);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      unit: unitTarget,
      sheetName: sheet.getName(),
      message: "บันทึกผลการทดลองและคะแนนเข้าแท็บ " + sheet.getName() + " สำเร็จเรียบร้อย",
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
  // 1. ตรวจสอบจากฟิลด์ data.unit โดยตรง
  if (data.unit !== undefined && data.unit !== null && !isNaN(Number(data.unit))) {
    var u = parseInt(data.unit, 10);
    if (u >= 1 && u <= 7) return u;
  }

  // 2. ตรวจสอบจากข้อความในกิจกรรมและตัวแปรเฉพาะ
  var fullText = [
    String(data.activity || ""),
    String(data.topology || ""),
    String(data.status || ""),
    String(data.controlMode || ""),
    String(data.modbusCommand || "")
  ].join(" ").toLowerCase();

  // Unit 7: PLC & ซ่อมบำรุง
  if (fullText.indexOf("หน่วยที่ 7") !== -1 || fullText.indexOf("unit 7") !== -1 || data.modbusCommand !== undefined || data.lotoStatus !== undefined || data.thermoscanTemp !== undefined || data.lotoDone !== undefined) {
    return 7;
  }

  // Unit 6: อินเวอร์เตอร์ขับมอเตอร์ VFD
  if (fullText.indexOf("หน่วยที่ 6") !== -1 || fullText.indexOf("unit 6") !== -1 || data.controlMode !== undefined || data.actualRpm !== undefined || data.vfRatio !== undefined || data.targetRpm !== undefined) {
    return 6;
  }

  // Unit 5: เครื่องสำรองไฟ UPS
  if (fullText.indexOf("หน่วยที่ 5") !== -1 || fullText.indexOf("unit 5") !== -1 || data.loadPower !== undefined || data.batteryAh !== undefined || data.emergencyStatus !== undefined || data.upsMode !== undefined) {
    return 5;
  }

  // Unit 4: วงจรอินเวอร์เตอร์ (Inverters)
  if (fullText.indexOf("หน่วยที่ 4") !== -1 || fullText.indexOf("unit 4") !== -1 || data.deadtime !== undefined || data.ma !== undefined || data.vrms !== undefined) {
    return 4;
  }

  // Unit 3: ดีซีชอปเปอร์ (DC Chopper / DC-DC)
  if (fullText.indexOf("หน่วยที่ 3") !== -1 || fullText.indexOf("unit 3") !== -1 || data.dutyCycle !== undefined || data.inductance !== undefined || data.fsw !== undefined || data.duty !== undefined) {
    return 3;
  }

  // Unit 2: วงจรเรียงกระแสควบคุมได้ (Controlled Rectifiers)
  if (fullText.indexOf("หน่วยที่ 2") !== -1 || fullText.indexOf("unit 2") !== -1 || fullText.indexOf("เรียงกระแส") !== -1 || fullText.indexOf("rectifier") !== -1 || data.alpha !== undefined || data.idc !== undefined) {
    return 2;
  }

  // เริ่มต้นเป็น Unit 1: สวิตชิ่งกำลัง
  return 1;
}

/**
 * ดึงหรือสร้าง Sheet Tab เฉพาะหน่วย พร้อมซิงค์หัวตารางให้ตรงคอลัมน์ 100%
 */
function getOrCreateUnitSheet(ss, unitNum) {
  var cfg = UNIT_CONFIGS[unitNum] || UNIT_CONFIGS[1];
  var sheet = ss.getSheetByName(cfg.name);

  if (!sheet) {
    sheet = ss.insertSheet(cfg.name);
  }

  // ถ้าแท็บยังว่าง หรือหัวตารางเดิมมีจำนวนคอลัมน์ไม่ครบ ให้อัปเดตแถวที่ 1 อัตโนมัติ
  if (sheet.getLastRow() === 0 || sheet.getLastColumn() < cfg.headers.length) {
    applyHeaderFormat(sheet, cfg);
  }

  return sheet;
}

/**
 * จัดรูปแบบแถวหัวตาราง (Row 1)
 */
function applyHeaderFormat(sheet, cfg) {
  sheet.getRange(1, 1, 1, cfg.headers.length).setValues([cfg.headers]);
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

/**
 * ⚡ สำหรับครูผู้สอน: ฟังก์ชันกด "เรียกใช้ (Run)" ครั้งเดียว
 * เพื่อสร้างหรืออัปเดตหัวตารางของทั้ง 7 หน่วยให้ตรงคอลัมน์ 100% สวยงามทันที!
 */
function setupAllUnitHeaders() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  for (var u = 1; u <= 7; u++) {
    var cfg = UNIT_CONFIGS[u];
    var sheet = ss.getSheetByName(cfg.name);
    if (!sheet) {
      sheet = ss.insertSheet(cfg.name);
    }
    applyHeaderFormat(sheet, cfg);
  }
  SpreadsheetApp.getActiveSpreadsheet().toast("อัปเดตหัวตารางทั้ง 7 หน่วยตรงคอลัมน์เรียบร้อยแล้ว!", "สำเร็จ");
}

/**
 * แยกแปลงคะแนนให้เป็นตัวเลขล้วน (Pure Number)
 */
function parseNumericScore(val) {
  if (val === undefined || val === null || val === "") return 0;
  if (typeof val === "number") return val;
  if (!isNaN(Number(val))) return Number(val);
  if (typeof val === "string") {
    var match = val.match(/(\d+)\s*\/\s*\d+/);
    if (match) return Number(match[1]);
    var num = parseFloat(val.replace(/[^0-9.]/g, ""));
    if (!isNaN(num)) return num;
  }
  return 0;
}

/**
 * เพิ่มแถวข้อมูลตามหน่วย — จับคู่คอลัมน์ 1-to-1 ตรงเป๊ะกับ Header ทุกหน่วย
 */
function appendUnitRow(sheet, unitNum, timestamp, studentName, studentId, studentGroup, data) {
  var row = [];
  var scoreCol = -1;

  if (unitNum === 1) {
    var score1 = parseNumericScore(data.quizScore !== undefined ? data.quizScore : data.result);
    row = [
      timestamp,                                                     // 1. Timestamp
      studentName,                                                   // 2. Student Name
      studentId,                                                     // 3. Student ID
      studentGroup,                                                  // 4. Group
      data.activity || "หน่วยที่ 1 สวิตชิ่งกำลัง",                     // 5. Activity
      score1,                                                        // 6. Quiz Score
      data.status || "ผ่านเกณฑ์"                                      // 7. Status / Note
    ];
    scoreCol = 6;
  } else if (unitNum === 2) {
    var score2 = parseNumericScore(data.quizScore !== undefined ? data.quizScore : data.result);
    row = [
      timestamp,                                                     // 1. Timestamp
      studentName,                                                   // 2. Student Name
      studentId,                                                     // 3. Student ID
      studentGroup,                                                  // 4. Group
      data.topology || data.activity || "Controlled Rectifiers",     // 5. Circuit Topology
      data.alpha !== undefined && data.alpha !== "" ? data.alpha : "-", // 6. Firing Angle α
      data.vdc !== undefined && data.vdc !== "" ? data.vdc : "-",    // 7. V_dc (V)
      data.idc !== undefined && data.idc !== "" ? data.idc : "-",    // 8. I_dc (A)
      score2,                                                        // 9. Quiz Score
      data.status || "Completed"                                     // 10. Status / Note
    ];
    scoreCol = 9;
  } else if (unitNum === 3) {
    var score3 = parseNumericScore(data.quizScore);
    row = [
      timestamp,                                                     // 1. Timestamp
      studentName,                                                   // 2. Student Name
      studentId,                                                     // 3. Student ID
      studentGroup,                                                  // 4. Group
      data.topology || (data.topo ? data.topo.toUpperCase() : "Buck"), // 5. Topology
      data.dutyCycle !== undefined ? data.dutyCycle : (data.duty !== undefined ? data.duty : 0), // 6. Duty Cycle
      data.fsw !== undefined ? data.fsw : 50,                        // 7. Switching Freq
      data.inductance !== undefined ? data.inductance : (data.L !== undefined ? data.L : 100),   // 8. Inductor L
      data.mode || "CCM",                                            // 9. Mode
      data.vout !== undefined ? data.vout : 0,                       // 10. V_out
      data.iout !== undefined ? data.iout : 0,                       // 11. I_out
      data.efficiency !== undefined ? data.efficiency : 0,           // 12. Efficiency
      score3,                                                        // 13. Quiz Score
      data.status || "Completed"                                     // 14. Status
    ];
    scoreCol = 13;
  } else if (unitNum === 4) {
    var score4 = parseNumericScore(data.quizScore);
    row = [
      timestamp,                                                     // 1. Timestamp
      studentName,                                                   // 2. Student Name
      studentId,                                                     // 3. Student ID
      studentGroup,                                                  // 4. Group
      data.topology || (data.topo ? data.topo : "1-Phase Full Bridge"), // 5. Topology
      data.ma !== undefined ? data.ma : 0.8,                         // 6. m_a
      data.fout !== undefined ? data.fout : (data.fo !== undefined ? data.fo : 50), // 7. f_out
      data.fsw !== undefined ? data.fsw : 10,                        // 8. f_sw
      data.deadtime !== undefined ? data.deadtime : 1.5,             // 9. Dead-Time
      data.vrms !== undefined ? data.vrms : 0,                       // 10. V_rms
      data.irms !== undefined ? data.irms : 0,                       // 11. I_rms
      data.thd !== undefined ? data.thd : 0,                         // 12. THD
      score4,                                                        // 13. Quiz Score
      data.status || "Completed"                                     // 14. Status
    ];
    scoreCol = 13;
  } else if (unitNum === 5) {
    var score5 = parseNumericScore(data.quizScore);
    row = [
      timestamp,                                                     // 1. Timestamp
      studentName,                                                   // 2. Student Name
      studentId,                                                     // 3. Student ID
      studentGroup,                                                  // 4. Group
      data.topology || data.upsMode || "Online Double-Conversion",   // 5. Topology
      data.transferTime !== undefined ? data.transferTime : (data.transferMs !== undefined ? data.transferMs : 0), // 6. Transfer Time
      data.loadPower !== undefined ? data.loadPower : (data.loadWatt !== undefined ? data.loadWatt : 0),           // 7. Load Power
      data.batteryAh !== undefined ? data.batteryAh : (data.battCap !== undefined ? data.battCap : 0),             // 8. Battery Ah
      data.backupTime !== undefined ? data.backupTime : (data.backupMin !== undefined ? data.backupMin : 0),       // 9. Backup Time
      data.chargeStage || "Float",                                   // 10. Charge Stage
      data.emergencyStatus || (data.emergLux !== undefined ? data.emergLux : "Normal"),                           // 11. Emergency Lamp
      score5,                                                        // 12. Quiz Score
      data.status || "Completed"                                     // 13. Status
    ];
    scoreCol = 12;
  } else if (unitNum === 6) {
    var score6 = parseNumericScore(data.quizScore);
    row = [
      timestamp,                                                     // 1. Timestamp
      studentName,                                                   // 2. Student Name
      studentId,                                                     // 3. Student ID
      studentGroup,                                                  // 4. Group
      data.controlMode || "VFD Inverter (V/f Control)",              // 5. Control Mode
      data.setFrequency !== undefined ? data.setFrequency : (data.setFreq !== undefined ? data.setFreq : "-"), // 6. Set Freq
      data.targetRpm !== undefined ? data.targetRpm : 0,             // 7. Target RPM
      data.actualRpm !== undefined ? data.actualRpm : 0,             // 8. Actual RPM
      data.motorCurrent !== undefined ? data.motorCurrent : (data.current !== undefined ? data.current : "-"), // 9. Motor Current
      data.loadTorque !== undefined ? data.loadTorque : (data.torque !== undefined ? data.torque : "-"),       // 10. Torque
      data.vfRatio || "4.40 V/Hz",                                   // 11. V/f Ratio
      data.accDecTime || data.accDec || "5.0s / 5.0s",               // 12. Acc/Dec
      data.faultStatus || data.fault || "Normal (No Fault)",         // 13. Fault Status
      score6,                                                        // 14. Quiz Score
      data.status || "Submitted"                                     // 15. Status
    ];
    scoreCol = 14;
  } else if (unitNum === 7) {
    var score7 = parseNumericScore(data.quizScore);
    row = [
      timestamp,                                                     // 1. Timestamp
      studentName,                                                   // 2. Student Name
      studentId,                                                     // 3. Student ID
      studentGroup,                                                  // 4. Group
      data.modbusCommand || data.modbusCmd || "Slave 01: FC06",      // 5. Modbus Command
      data.setFrequency !== undefined ? data.setFrequency : (data.freqHz !== undefined ? data.freqHz : "-"), // 6. Set Freq
      data.rpmAndCurrent || data.rpmCurrent || "-",                  // 7. RPM & Current
      data.lotoStatus || (data.lotoDone ? "Verified Zero Energy" : "LOTO Incomplete"), // 8. LOTO Status
      data.dcDischargeVoltage !== undefined ? data.dcDischargeVoltage : (data.dcVolt !== undefined ? data.dcVolt : "-"), // 9. DC Bus Discharge
      data.thermoscanTemp !== undefined ? data.thermoscanTemp : (data.thermoMaxTemp !== undefined ? data.thermoMaxTemp : "-"), // 10. Thermoscan Temp
      data.deltaTStatus || (data.deltaT !== undefined ? data.deltaT : "Normal"),       // 11. Hotspot ΔT
      data.faultDiagnosis || (data.faultResolved ? "Cleared" : "Normal"),             // 12. Fault Diagnosis
      score7,                                                        // 13. Quiz Score
      data.status || "Submitted"                                     // 14. Status
    ];
    scoreCol = 13;
  }

  sheet.appendRow(row);
  var lastRow = sheet.getLastRow();
  sheet.getRange(lastRow, 1, 1, 1).setHorizontalAlignment("center");
  sheet.getRange(lastRow, 3, 1, 1).setHorizontalAlignment("center");
  if (scoreCol > 0) {
    sheet.getRange(lastRow, scoreCol, 1, 1).setHorizontalAlignment("center").setNumberFormat("0");
  }
}

/**
 * ฟังก์ชันตรวจสอบการส่งซ้ำในแต่ละหน่วย
 */
function checkDuplicateInUnit(unitNum, studentId) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = getOrCreateUnitSheet(ss, parseInt(unitNum, 10));
  var rows = sheet.getDataRange().getValues();

  for (var i = 1; i < rows.length; i++) {
    if (String(rows[i][2]).trim() === String(studentId).trim()) {
      return {
        exists: true,
        duplicate: true,
        unit: unitNum,
        studentId: studentId,
        studentName: rows[i][1],
        timestamp: rows[i][0]
      };
    }
  }

  return { exists: false, duplicate: false, unit: unitNum, studentId: studentId };
}
