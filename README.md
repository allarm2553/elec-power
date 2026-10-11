# ⚡ ศูนย์รวมการเรียนรู้อิเล็กทรอนิกส์กำลังเสมือนจริง (Power Electronics Web Learning Portal)

สื่อการสอนและห้องปฏิบัติการวิศวกรรมอิเล็กทรอนิกส์กำลังเสมือนจริงแบบครบวงจร (Interactive Web-Based Power Electronics Engineering Labs) ตามมาตรฐานหลักสูตรประกาศนียบัตรวิชาชีพชั้นสูง (ปวส.) **รหัสวิชา 30105-2019 อิเล็กทรอนิกส์กำลัง** 
ออกแบบภายใต้มาตรฐาน **Dark Glassmorphism UI**, จำลองฟิสิกส์และการสลับสวิตชิ่งด้วย **HTML5 Canvas Vector**, วิเคราะห์รูปคลื่นและฮาร์มอนิกส์แบบเรียลไทม์, และระบบบันทึกผลคะแนน/รายงานชิ้นงานผ่าน **Google Sheets** พร้อมระบบป้องกันการส่งงานซ้ำแยกรายหน่วย

---

## 📖 คู่มือการใช้งานระบบ (Manuals & Documentation)

* 📄 **คู่มือฉบับสมบูรณ์ (Markdown):** [MANUAL.md](MANUAL.md)
* 🌐 **คู่มือออนไลน์แบบอินเตอร์แอคทีฟ (Interactive Web Manual):** [http://localhost:8082/manual.html](http://localhost:8082/manual.html)

---

## 🌟 จุดเริ่มต้นการใช้งาน (Quick Start)

### การเปิดใช้งานผ่าน Master Unified Server

สามารถสตาร์ทเซิร์ฟเวอร์หลักที่ Root Directory เพียงคำสั่งเดียวเพื่อเข้าถึงทุกแอปพลิเคชัน:

```bash
# 1. เข้าสู่โฟลเดอร์หลัก
cd /Users/allarmmac/myjob_folder/MyLaB/Elec_Power

# 2. เริ่มต้น Master Server
node server.js
# หรือ
npm start
```

🌐 **เปิดเบราว์เซอร์เข้าสู่ Master Dashboard:** [http://localhost:8082/](http://localhost:8082/)  
📘 **เปิดหน้าคู่มือการใช้งาน:** [http://localhost:8082/manual.html](http://localhost:8082/manual.html)

---

## 📚 รายชื่อ 7 หน่วยการเรียนรู้และการเข้าถึง (Virtual Labs 1–7)

| ลำดับ | หน่วยการเรียนรู้ (Learning Unit) | โฟลเดอร์ | Sub-path (Server 8082) | ชิ้นงานหลัก (Workpiece) | เนื้อหาและจุดเด่นหลัก |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **1** | **ทดสอบและจำลองอุปกรณ์สวิตชิ่งกำลัง** | `Unit1` | [`/unit1/`](http://localhost:8082/unit1/) | รายงานผลทดสอบ & แบบจำลองสวิตชิ่ง | Curve Tracer (Diode, BJT, MOSFET, IGBT), Miller Plateau, กำลังสูญเสียสวิตชิ่ง |
| **2** | **วงจรเรียงกระแสควบคุมแรงดันได้** | `Unit2` | [`/unit2/`](http://localhost:8082/unit2/) | ชุดวงจรเรียงกระแส 1 เฟส & 3 เฟส | SCR Phase Control ($\alpha$-angle 0-180°), 1-Phase & 3-Phase 6-Pulse, FFT Harmonics |
| **3** | **วงจรแปลงผันไฟตรงดีซีสู่ดีซี** | `Unit3` | [`/unit3/`](http://localhost:8082/unit3/) | วงจร DC-to-DC Converter + Filter | Buck & Boost & Buck-Boost, ปรับ Duty Cycle PWM, CCM/DCM Mode, Ripple Analysis |
| **4** | **วงจรอินเวอร์เตอร์แปลงผันไฟฟ้า** | `Unit4` | [`/unit4/`](http://localhost:8082/unit4/) | อินเวอร์เตอร์ 1 & 3 เฟสขับโหลดไซน์ | SPWM Synthesis, 3-Phase 6-Pulse Full Bridge, Dead-Time ป้องกัน Shoot-through, THD Filter |
| **5** | **ระบบเครื่องสำรองไฟฟ้าและไฟฉุกเฉิน** | `Unit5` | [`/unit5/`](http://localhost:8082/unit5/) | ระบบ UPS & ชุดวงจรไฟฉุกเฉิน | จำลองไฟฟ้าดับวัด Transfer Time (ms), ระบบชาร์จ 3-Stage, คำนวณ Battery Sizing |
| **6** | **ควบคุมความเร็วมอเตอร์อุตสาหกรรม** | `Unit6` | [`/unit6/`](http://localhost:8082/unit6/) | ระบบไดรฟ์ DC, VFD และ BLDC | DC Drive 4 ควอดรันต์ (Regen Braking), VFD Inverter V/f Control, BLDC Motor Hall Sensors |
| **7** | **ประยุกต์และบำรุงรักษาระบบอิเล็กทรอนิกส์กำลัง** | `Unit7` | [`/unit7/`](http://localhost:8082/unit7/) | ระบบเชื่อมต่อ PLC & รายงานบำรุงรักษา PM | สั่งการ Modbus RTU & PLC RS-485, ขั้นตอน LOTO & คายประจุ DC Bus 540V, เทอร์โมสแกน NETA, ทดสอบ IGBT ไดโอด |

---

## 🛡️ ระบบป้องกันการส่งงานซ้ำแยกรายหน่วย (Unit-Isolated Anti-Duplicate)

ระบบใช้กลไกความปลอดภัยแบบ 2 ชั้น (Two-Layer Protection):
1. **Client-Side Live Validation:** 
   - จัดเก็บประวัติรหัสที่ส่งงานแล้วแยกตามกุญแจรายหน่วย (`submitted_student_ids_unit1` ถึง `unit7`)
   - ตรวจจับทันทีขณะพิมพ์ (`oninput`): แสดงป้ายเตือนสีแดงและล็อกปุ่มส่งทันทีหากเคยส่งงานในหน่วยนั้นแล้ว
   - **Unit Isolation:** นักศึกษาที่ส่งงานหน่วยที่ 1 สำเร็จ จะไม่ถูกบล็อกในหน่วยที่ 2–7
2. **Server-Side Verification (`Code.gs`):**
   - ฟังก์ชัน `checkDuplicate(studentId)` ตรวจสอบคอลัมน์ C (รหัสนักศึกษา) ใน Google Sheet
   - ปฏิเสธการเพิ่มแถวซ้ำและแจ้งเตือน `DUPLICATE_SUBMISSION`
3. **ระบบรีเซ็ตประวัติสำหรับครูผู้สอน:**
   - ปุ่มล้างแคชส่งซ้ำเฉพาะหน่วยในหน้าต่างครูผู้สอนของ Unit 1–7
   - ปุ่ม Master Reset ล้างประวัติทุกหน่วยพร้อมกันใน Master Portal

---

## 📊 ระบบบันทึกคะแนน Google Sheets (Google Apps Script)

ทุกแอปพลิเคชันมีระบบแบบทดสอบท้ายบทเรียนพร้อมเฉลยละเอียด และไฟล์ `Code.gs` สำหรับนำไปติดตั้งบน Google Apps Script เพื่อบันทึกคะแนนและข้อมูลผลการทดสอบของผู้เรียนเข้าสู่ Google Spreadsheet แบบเรียลไทม์

### 🔗 การส่งลิงก์ให้นักเรียนทำแบบทดสอบ (Teacher Link Sharing with `?gas=`)
เพื่อความสะดวกในการจัดการเรียนการสอน ครูผู้สอนสามารถส่งลิงก์ใบงานที่แนบ Google Apps Script Web App URL ไปให้นักเรียนได้ทันที โดยที่**นักเรียนไม่ต้องกรอกลิงก์เอง**:

```text
http://localhost:8082/unit1/?gas=https://script.google.com/macros/s/AKfycb.../exec
```

---

## 🚀 สถาปัตยกรรมการเผยแพร่บน GitHub Pages (Static Hosting Architecture)

โปรเจกต์นี้ได้รับการออกแบบและปรับปรุงให้รองรับการทำงานทั้งแบบ **Local Node.js Server** และ **GitHub Pages (100% Client-Side Static Hosting)** ได้อย่างสมบูรณ์แบบ:

1. **Fully Static Architecture:** 
   - ระบบทำงานด้วย Vanilla JS, HTML5 Canvas, CSS และ CDN ภายนอก (Font Awesome, Google Fonts, Chart.js) โดยไม่จำเป็นต้องพึ่งพา Node.js Server ในการรันบน Production
2. **Relative & Subpath-Aware Routing:**
   - ทรัพยากร ลิงก์ภายใน และการดาวน์โหลด `Code.gs` ทั้งหมดใช้ Relative Paths (`./Unit1/`, `../`, `Code.gs`) รองรับทั้ง Subpath URL ของ GitHub Pages (`https://<username>.github.io/<repo>/`) และ Custom Domain
3. **Google Sheets Cloud Integration:**
   - การบันทึกคะแนนและส่งผลการเรียนเชื่อมต่อโดยตรงระหว่าง Client Browser กับ Google Apps Script Web App URL จึงทำงานได้ทันทีบน GitHub Pages
4. **GitHub Pages Configurations Included:**
   - `.nojekyll`: ป้องกัน Jekyll parser ไม่ให้ข้ามไฟล์หรือโฟลเดอร์
   - `404.html`: หน้าจัดการข้อผิดพลาดดีไซน์ Dark Glassmorphism พร้อมระบบตรวจจับชื่อ Repository เพื่อพาผู้ใช้กลับสู่หน้าหลักอย่างถูกต้อง

### 📝 ขั้นตอนการนำขึ้น GitHub และเปิดใช้งาน GitHub Pages (เมื่อพร้อม)

> [!NOTE]
> ปัจจุบันโปรเจกต์เตรียมความพร้อมโครงสร้างทั้งหมดไว้ในเครื่องเรียบร้อยแล้ว เมื่อต้องการนำขึ้น GitHub ให้ปฏิบัติตามคำสั่งด้านล่างนี้:

```bash
# 1. สร้าง Git Repository ในเครื่อง (หากยังไม่มี)
git init
git add .
git commit -m "feat: complete PowerLab suite with GitHub Pages static support"

# 2. เชื่อมต่อไปยัง GitHub Repository ของคุณ
git branch -M main
git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO_NAME>.git
git push -u origin main

# 3. เปิดใช้งาน GitHub Pages บนเว็บ GitHub:
# ไปที่ Repository -> Settings -> Pages
# Build and deployment -> Source: Deploy from a branch
# Branch: main / Root (/) -> กด Save
```

หลังบันทึก ระบบจะ Deploy เว็บไซต์และสร้าง URL เช่น:  
`https://<YOUR_USERNAME>.github.io/<YOUR_REPO_NAME>/`

---

## 🛠️ Stack & Technologies

- **Frontend:** Vanilla JavaScript (ES6+), HTML5 Canvas 2D Vector Oscilloscope & Curve Tracer
- **Styling:** Dark Glassmorphism, Google Fonts (`Chakra Petch`, `Sarabun`, `JetBrains Mono`), Font Awesome 6
- **Hosting Support:** GitHub Pages Static Hosting & Local Node.js Native HTTP Server (`server.js`)
- **Database / Logging:** Google Apps Script + Google Sheets API & Printable Workpiece PDF Export
