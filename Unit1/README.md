# แอปการเรียนรู้อุปกรณ์สวิตชิ่งอิเล็กทรอนิกส์กำลัง (Power Switching Devices Lab)

แอปเว็บสื่อการสอนและห้องทดลองเสมือนจริงสำหรับ **อุปกรณ์สวิตชิ่งอิเล็กทรอนิกส์กำลัง (Power Switching Devices: Power Diode, BJT, Power MOSFET, IGBT)** แบบครบวงจร ใช้งานบน Dark Mode Glassmorphism UI ตามมาตรฐาน `bjt_app` พร้อมระบบจำลองฟิสิกส์เนื้อสารกึ่งตัวนำ Canvas แบบเรียลไทม์ และระบบเชื่อมต่อ Google Sheets

## การเริ่มต้นใช้งาน (Getting Started)

### การรันแบบ Local Server (Standalone)

```bash
# 1. เข้าไปยังโฟลเดอร์แอป
cd /Users/allarmmac/myjob_folder/MyLaB/Elec_Power/Unit1

# 2. เริ่มต้นเซิร์ฟเวอร์
npm start
# หรือ node server.js

# 3. เปิดเว็บเบราว์เซอร์
# http://localhost:3011/
```

### การรันผ่าน Master Portal (แนะนำ)

```bash
cd /Users/allarmmac/myjob_folder/MyLaB/Elec_Power
node server.js
# เข้าใช้งานผ่าน: http://localhost:8082/unit1/
```

## 5 โมดูลการเรียนรู้หลัก (5 Learning Modules)

1. **โครงสร้างอุปกรณ์ (Device Structure & Physics):**
   - จำลองโครงสร้างเนื้อสารกึ่งตัวนำแนวตั้ง (Vertical Structure): VDMOS / Trench MOSFET, IGBT 4-Layer ($p^+ - n^+ - n^- - p - n^+$), P-i-N Diode, Power BJT
   - อนิเมชันการเคลื่อนที่ของพาหะ (Electrons & Holes), การขยายตัวของ Depletion Region ในชั้น $n^-$ Drift, และปรากฏการณ์ Conductivity Modulation
   - แสดงผังขาจริง (Pinouts) และตัวถัง TO-220 / TO-247
2. **การไบอัสและกราฟคุณลักษณะ (Biasing & Characteristic Curves):**
   - การต่อวงจรไบอัสสวิตชิ่ง แหล่งจ่าย DC Bus ($V_{supply}$), โหลดความต้านทาน ($R_{load}$), และสัญญาณขับเกต/เบส
   - แสดงเส้นโหลดไฟตรง (DC Load Line) ตัดกับกลุ่มเส้นโค้งคุณลักษณะ (Family Curves)
   - คำนวณจุดทำงาน (Q-Point) และกำลังสูญเสียขณะนำกระแส ($P_{cond} = V \cdot I$) สดแบบเรียลไทม์
   - ตัวระบุสถานะ: Cut-off (OFF), Active (Linear), Saturation (ON), Breakdown
3. **พารามิเตอร์อุปกรณ์ (Parameters & Specs Glossary):**
   - คลังพารามิเตอร์สำคัญของแต่ละอุปกรณ์พร้อมแถบค้นหา: $R_{DS(on)}, V_{CE(sat)}, V_{GS(th)}, t_{rr}, Q_{rr}, Q_g, E_{on}, E_{off}, t_{tail}$
   - สูตรคำนวณกำลังสูญเสียและเกณฑ์การออกแบบในทางวิศวกรรม
4. **ห้องทดลองวงจรขับสวิตชิ่ง (Circuit Lab):**
   - จำลองวงจรขับเกตพร้อมตัวต้านทาน $R_G$, โหลดเหนี่ยวนำ (Inductive Load), และไดโอดฟรัวีลลิง
   - ออสซิลโลสโคป 4 แชนแนล แสดง Miller Plateau บน $V_{gate}$, แรงดัน $V_{switch}$, กระแส $I_{switch}$, และกำลังสูญเสีย $P(t) = V(t) \cdot I(t)$
5. **แบบทดสอบ & Google Sheets (Quiz & Sheets):**
   - แบบทดสอบวัดความเข้าใจ 4 ข้อพร้อมเฉลยละเอียด
   - ไฟล์ `Code.gs` สำหรับเชื่อมต่อ Google Spreadsheet บันทึกผลคะแนนและประวัติชิ้นงานอัตโนมัติ

## พอร์ตที่ใช้งาน

- **Port 3011** (สำหรับ Standalone Unit 1) หรือ **Port 8082/unit1/** (สำหรับ Master Portal)
