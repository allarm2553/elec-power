/**
 * =========================================================================
 * Power Switching Devices Learning Lab (Unit 1 & Multi-Unit Hub)
 * Google Apps Script Server Code (Code.gs)
 * Developed for Course 30105-2019 Power Electronics
 * =========================================================================
 * 
 * รองรับการแยกแท็บอัตโนมัติตามหน่วย (Unit 1 - Unit 7) ใน Google Sheet แผ่นเดียว
 * บันทึกคะแนนเป็นตัวเลขล้วน (Pure Number)
 */

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
    message: "Unit 1 & Multi-Unit Apps Script is active."
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
        success: false,
        status: "error",
        message: "No POST payload received"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var studentId = String(data.studentId || "").trim();
    var studentName = String(data.studentName || data.name || "").trim();
    var studentGroup = String(data.studentGroup || data.group || "").trim();

    if (!studentId || studentId === "-") {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
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
          success: false,
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
      success: true,
      status: "success",
      unit: unitTarget,
      sheetName: sheet.getName(),
      message: "บันทึกผลการทดลองและคะแนนเข้าแท็บ " + sheet.getName() + " สำเร็จเรียบร้อย",
      timestamp: timestamp
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

/**
 * ตรวจหาหน่วยการเรียนรู้จากข้อมูล
 */
function detectUnit(data) {
  if (data.unit !== undefined && data.unit !== null && !isNaN(Number(data.unit))) {
    var u = parseInt(data.unit, 10);
    if (u >= 1 && u <= 7) return u;
  }

  var fullText = [
    String(data.activity || ""),
    String(data.topology || ""),
    String(data.status || ""),
    String(data.controlMode || ""),
    String(data.modbusCommand || "")
  ].join(" ").toLowerCase();

  if (fullText.indexOf("หน่วยที่ 7") !== -1 || fullText.indexOf("unit 7") !== -1 || data.modbusCommand !== undefined || data.lotoStatus !== undefined || data.thermoscanTemp !== undefined) {
    return 7;
  }
  if (fullText.indexOf("หน่วยที่ 6") !== -1 || fullText.indexOf("unit 6") !== -1 || data.controlMode !== undefined || data.actualRpm !== undefined || data.vfRatio !== undefined) {
    return 6;
  }
  if (fullText.indexOf("หน่วยที่ 5") !== -1 || fullText.indexOf("unit 5") !== -1 || data.loadPower !== undefined || data.batteryAh !== undefined || data.emergencyStatus !== undefined) {
    return 5;
  }
  if (fullText.indexOf("หน่วยที่ 4") !== -1 || fullText.indexOf("unit 4") !== -1 || data.deadtime !== undefined || data.ma !== undefined || data.vrms !== undefined) {
    return 4;
  }
  if (fullText.indexOf("หน่วยที่ 3") !== -1 || fullText.indexOf("unit 3") !== -1 || data.dutyCycle !== undefined || data.inductance !== undefined || data.fsw !== undefined) {
    return 3;
  }
  if (fullText.indexOf("หน่วยที่ 2") !== -1 || fullText.indexOf("unit 2") !== -1 || fullText.indexOf("เรียงกระแส") !== -1 || fullText.indexOf("rectifier") !== -1 || data.alpha !== undefined || data.idc !== undefined) {
    return 2;
  }

  return 1;
}

/**
 * ดึงชีตหรือสร้างตารางประวัติผลการทดลองตามหน่วย
 */
function getOrCreateUnitSheet(ss, unitNum) {
  var configs = {
    1: {
      name: "Unit 1 - Switching Devices",
      bg: "#0f172a", fg: "#38bdf8",
      headers: [
        "Timestamp (วัน-เวลา)", "Student Name (ชื่อ-สกุล)", "Student ID (รหัสนักศึกษา)",
        "Group (กลุ่มเรียน)", "Activity (กิจกรรม/อุปกรณ์)", "Test Values / Score (คะแนน)",
        "Status / Note (สถานะ/หมายเหตุ)"
      ]
    },
    2: {
      name: "Unit 2 - Controlled Rectifiers",
      bg: "#0c1b33", fg: "#34d399",
      headers: [
        "Timestamp (วัน-เวลา)", "Student Name (ชื่อ-สกุล)", "Student ID (รหัสนักศึกษา)",
        "Group (กลุ่มเรียน)", "Circuit Topology (ชนิดวงจร)", "Firing Angle α (มุมจุดชนวน)",
        "V_dc (V)", "I_dc (A)", "Quiz Score (คะแนนแบบทดสอบ)", "Status / Note (สถานะ/หมายเหตุ)"
      ]
    },
    3: {
      name: "Unit 3 - DC-DC Converters",
      bg: "#1e293b", fg: "#38bdf8",
      headers: [
        "Timestamp (วัน-เวลา)", "Student Name (ชื่อ-สกุล)", "Student ID (รหัสนักศึกษา)",
        "Group (กลุ่มเรียน)", "Topology (ชนิดวงจร)", "Duty Cycle (D %)",
        "Switching Freq (kHz)", "Inductor L (µH)", "Mode (CCM/DCM)",
        "V_out (V)", "I_out (A)", "Efficiency (%)", "Quiz Score (คะแนนแบบทดสอบ)", "Status (สถานะ)"
      ]
    },
    4: {
      name: "Unit 4 - Inverters",
      bg: "#1e1b4b", fg: "#c084fc",
      headers: [
        "Timestamp (วัน-เวลา)", "Student Name (ชื่อ-สกุล)", "Student ID (รหัสนักศึกษา)",
        "Group (กลุ่มเรียน)", "Topology (โครงสร้าง)", "m_a (Modulation Index)",
        "f_out (Hz)", "f_sw (kHz)", "Dead-Time (µs)", "V_rms (V)", "I_rms (A)",
        "THD (%)", "Quiz Score (คะแนนแบบทดสอบ)", "Status (สถานะ)"
      ]
    },
    5: {
      name: "Unit 5 - UPS & Emergency",
      bg: "#3b0764", fg: "#f472b6",
      headers: [
        "Timestamp (วัน-เวลา)", "Student Name (ชื่อ-สกุล)", "Student ID (รหัสนักศึกษา)",
        "Group (กลุ่มเรียน)", "Topology (ระบบ UPS)", "Transfer Time (ms)",
        "Load Power (W)", "Battery (Ah)", "Backup Time (min)",
        "Charge Stage", "Emergency Lamp", "Quiz Score (คะแนนแบบทดสอบ)", "Status (สถานะ)"
      ]
    },
    6: {
      name: "Unit 6 - Motor Drive & VFD",
      bg: "#451a03", fg: "#f59e0b",
      headers: [
        "Timestamp (วัน-เวลา)", "Student Name (ชื่อ-สกุล)", "Student ID (รหัสนักศึกษา)",
        "Group (กลุ่มเรียน)", "Control Mode (โหมดควบคุม)", "Set Freq (Hz)",
        "Target RPM", "Actual RPM", "Motor Current (A)", "Torque (Nm)",
        "V/f Ratio", "Acc/Dec (s)", "Fault Status", "Quiz Score (คะแนนแบบทดสอบ)", "Status (สถานะ)"
      ]
    },
    7: {
      name: "Unit 7 - PLC & Maintenance",
      bg: "#064e3b", fg: "#6ee7b7",
      headers: [
        "Timestamp (วัน-เวลา)", "Student Name (ชื่อ-สกุล)", "Student ID (รหัสนักศึกษา)",
        "Group (กลุ่มเรียน)", "Modbus Command", "Set Freq (Hz)", "RPM & Current",
        "LOTO Status", "DC Bus Discharge (V)", "Thermoscan Temp (°C)", "Hotspot ΔT / NETA",
        "Fault Diagnosis", "Quiz Score (คะแนนแบบทดสอบ)", "Status (สถานะ)"
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

function appendUnitRow(sheet, unitNum, timestamp, studentName, studentId, studentGroup, data) {
  var row = [];
  var scoreCol = -1;

  if (unitNum === 1) {
    var score1 = parseNumericScore(data.quizScore !== undefined ? data.quizScore : data.result);
    row = [
      timestamp, studentName, studentId, studentGroup,
      data.activity || "หน่วยที่ 1 สวิตชิ่งกำลัง",
      score1,
      data.status || "ผ่านเกณฑ์"
    ];
    scoreCol = 6;
  } else if (unitNum === 2) {
    var score2 = parseNumericScore(data.quizScore !== undefined ? data.quizScore : data.result);
    row = [
      timestamp, studentName, studentId, studentGroup,
      data.topology || data.activity || "Controlled Rectifiers",
      data.alpha !== undefined && data.alpha !== "" ? data.alpha : "-",
      data.vdc !== undefined && data.vdc !== "" ? data.vdc : "-",
      data.idc !== undefined && data.idc !== "" ? data.idc : "-",
      score2,
      data.status || "Completed"
    ];
    scoreCol = 9;
  } else if (unitNum === 3) {
    var score3 = parseNumericScore(data.quizScore);
    row = [
      timestamp, studentName, studentId, studentGroup,
      data.topology || (data.topo ? data.topo.toUpperCase() : "Buck"),
      data.dutyCycle !== undefined ? data.dutyCycle : (data.duty !== undefined ? data.duty : 0),
      data.fsw !== undefined ? data.fsw : 50,
      data.inductance !== undefined ? data.inductance : (data.L !== undefined ? data.L : 100),
      data.mode || "CCM",
      data.vout !== undefined ? data.vout : 0,
      data.iout !== undefined ? data.iout : 0,
      data.efficiency !== undefined ? data.efficiency : 0,
      score3,
      data.status || "Completed"
    ];
    scoreCol = 13;
  } else if (unitNum === 4) {
    var score4 = parseNumericScore(data.quizScore);
    row = [
      timestamp, studentName, studentId, studentGroup,
      data.topology || (data.topo ? data.topo : "1-Phase Full Bridge"),
      data.ma !== undefined ? data.ma : 0.8,
      data.fout !== undefined ? data.fout : (data.fo !== undefined ? data.fo : 50),
      data.fsw !== undefined ? data.fsw : 10,
      data.deadtime !== undefined ? data.deadtime : 1.5,
      data.vrms !== undefined ? data.vrms : 0,
      data.irms !== undefined ? data.irms : 0,
      data.thd !== undefined ? data.thd : 0,
      score4,
      data.status || "Completed"
    ];
    scoreCol = 13;
  } else if (unitNum === 5) {
    var score5 = parseNumericScore(data.quizScore);
    row = [
      timestamp, studentName, studentId, studentGroup,
      data.topology || data.upsMode || "Online Double-Conversion",
      data.transferTime !== undefined ? data.transferTime : (data.transferMs !== undefined ? data.transferMs : 0),
      data.loadPower !== undefined ? data.loadPower : (data.loadWatt !== undefined ? data.loadWatt : 0),
      data.batteryAh !== undefined ? data.batteryAh : (data.battCap !== undefined ? data.battCap : 0),
      data.backupTime !== undefined ? data.backupTime : (data.backupMin !== undefined ? data.backupMin : 0),
      data.chargeStage || "Float",
      data.emergencyStatus || (data.emergLux !== undefined ? data.emergLux : "Normal"),
      score5,
      data.status || "Completed"
    ];
    scoreCol = 12;
  } else if (unitNum === 6) {
    var score6 = parseNumericScore(data.quizScore);
    row = [
      timestamp, studentName, studentId, studentGroup,
      data.controlMode || "VFD Inverter (V/f Control)",
      data.setFrequency !== undefined ? data.setFrequency : (data.setFreq !== undefined ? data.setFreq : "-"),
      data.targetRpm !== undefined ? data.targetRpm : 0,
      data.actualRpm !== undefined ? data.actualRpm : 0,
      data.motorCurrent !== undefined ? data.motorCurrent : (data.current !== undefined ? data.current : "-"),
      data.loadTorque !== undefined ? data.loadTorque : (data.torque !== undefined ? data.torque : "-"),
      data.vfRatio || "4.40 V/Hz",
      data.accDecTime || data.accDec || "5.0s / 5.0s",
      data.faultStatus || data.fault || "Normal (No Fault)",
      score6,
      data.status || "Submitted"
    ];
    scoreCol = 14;
  } else if (unitNum === 7) {
    var score7 = parseNumericScore(data.quizScore);
    row = [
      timestamp, studentName, studentId, studentGroup,
      data.modbusCommand || data.modbusCmd || "Slave 01: FC06",
      data.setFrequency !== undefined ? data.setFrequency : (data.freqHz !== undefined ? data.freqHz : "-"),
      data.rpmAndCurrent || data.rpmCurrent || "-",
      data.lotoStatus || (data.lotoDone ? "Verified Zero Energy" : "LOTO Incomplete"),
      data.dcDischargeVoltage !== undefined ? data.dcDischargeVoltage : (data.dcVolt !== undefined ? data.dcVolt : "-"),
      data.thermoscanTemp !== undefined ? data.thermoscanTemp : (data.thermoMaxTemp !== undefined ? data.thermoMaxTemp : "-"),
      data.deltaTStatus || (data.deltaT !== undefined ? data.deltaT : "Normal"),
      data.faultDiagnosis || (data.faultResolved ? "Cleared" : "Normal"),
      score7,
      data.status || "Submitted"
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
