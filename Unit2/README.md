# ⚡ Unit 2: วงจรเรียงกระแสควบคุมแรงดันได้ (Phase-Controlled Rectifiers)
### หลักสูตรประกาศนียบัตรวิชาชีพชั้นสูง (ปวส.) สาขาวิชาช่างอิเล็กทรอนิกส์ / ไฟฟ้ากำลัง
### รหัสวิชา 30105-2019 อิเล็กทรอนิกส์กำลัง (Power Electronics)

---

## 🎯 วัตถุประสงค์การเรียนรู้ (Learning Objectives)

1. เข้าใจโครงสร้างสารกึ่งตัวนำ 4 ชั้น ($P_1-N_1-P_2-N_2$) ของ **SCR (Silicon Controlled Rectifier)** และกลไกการนำกระแสแบบ Two-Transistor Analogy
2. เข้าใจการทำงานของวงจรสร้างสัญญาณกระตุ้นเกต (Gate Triggering Circuits) เช่น UJT Relaxation Oscillator และวงจรตรวจจับจุดตัดศูนย์ (Zero-Crossing Detector)
3. สามารถวิเคราะห์และคำนวณวงจรเรียงกระแส 1 เฟสควบคุมได้ ทั้งแบบครึ่งคลื่น (Half-Wave), บริดจ์กึ่งควบคุม (Semi-Controlled), และบริดจ์ควบคุมสมบูรณ์ (Fully-Controlled)
4. สามารถวิเคราะห์และคำนวณวงจรเรียงกระแส 3 เฟสควบคุมได้ (3-Pulse และ 6-Pulse Graetz Bridge) พร้อมลำดับการทริกเกอร์ SCR 6 ตัว
5. สังเกตและวิเคราะห์ผลกระทบของโหลดความต้านทาน ($R$), โหลดความเหนี่ยวนำ ($R-L$), และการต่อไดโอดฟรีวีล ($D_{FWD}$) เพื่อป้องกันแรงดันย้อนกลับติดลบ
6. วิเคราะห์คุณภาพไฟฟ้า: ค่าแรงดันเฉลี่ย $V_{dc}$, ค่าประสิทธิผล $V_{rms}$, Total Harmonic Distortion ($THD$), Ripple Factor ($RF$), และ Displacement Power Factor ($DPF = \cos\alpha$)
7. บันทึกผลการทดลองเสมือนจริงและส่งคะแนนเข้าสู่ระบบ Google Sheets ของครูผู้สอน

---

## 🧭 โครงสร้าง 5 แท็บการเรียนรู้ (5-Tab Structure)

* **Tab 1: โครงสร้างและการกระตุ้นนำกระแส SCR (SCR Physics & Triggering)**
  - แบบจำลองฟิสิกส์สารกึ่งตัวนำ 4 ชั้น ($P_1-N_1-P_2-N_2$)
  - แบบจำลองทรานซิสเตอร์คู่ (Two-Transistor Analogy: $Q_1$ PNP + $Q_2$ NPN)
  - วงจรทริกเกอร์เกต: UJT Relaxation Oscillator และ Zero-Crossing Detector (ZCD)
  - พารามิเตอร์สำคัญ: $I_H$ (Holding Current), $I_L$ (Latching Current), $V_{BO}, dv/dt, di/dt$

* **Tab 2: วงจรเรียงกระแส 1 เฟสควบคุมได้ (1-Phase Controlled Rectifiers)**
  - 1-Phase Half-Wave (1 SCR)
  - 1-Phase Semi-Controlled Bridge (2 SCR + 2 Diode + FWD)
  - 1-Phase Fully-Controlled Bridge (4 SCR)
  - ปรับโหลด $R, R-L$, และโหมดใส่ไดโอดฟรีวีล ($+D_{FWD}$)

* **Tab 3: วงจรเรียงกระแส 3 เฟสในงานอุตสาหกรรม (3-Phase Controlled Rectifiers)**
  - 3-Phase Half-Wave (3-Pulse Converter, 3 SCR)
  - 3-Phase Full-Wave Bridge (6-Pulse Graetz Bridge, 6 SCR)
  - Firing Sequence Map: ลำดับการจุดเกตคู่ SCR ($T_1 \dots T_6$)
  - Rectification Mode ($0^\circ \le \alpha < 90^\circ$) vs Inversion Mode ($90^\circ < \alpha \le 150^\circ$)

* **Tab 4: ห้องทดลองเสมือนและวิเคราะห์คุณภาพไฟฟ้า (Virtual Lab & Power Quality)**
  - **Interactive 2D CAD Schematic**: แผนภาพวงจรพร้อมแอนิเมชันกระแสไหลตามจังหวะ SCR นำกระแสจริง
  - **Virtual 4-Channel Oscilloscope**:
    - CH1: แรงดันไฟสลับขาเข้า ($V_{in}$)
    - CH2: พัลส์จุดชนวนเกต ($V_{gate}$)
    - CH3: แรงดันเอาต์พุตตกคร่อมโหลด ($V_{load}$)
    - CH4: แรงดันตกคร่อมตัวไทริสเตอร์ ($V_{AK}$)
  - **FFT Harmonics Analyzer**: แสดงแท่งสเปกตรัมฮาร์มอนิกส์ ($f_0, 2f_0, 3f_0, 6f_0$), $THD_v$, $THD_i$, Power Factor ($PF$), Displacement Factor ($DPF$)
  - สวิตช์ RUN / STOP (Freeze รูปคลื่น) และสวิตช์เปิด/ปิดแต่ละแชนแนล

* **Tab 5: แบบประเมินผลและบันทึกใบงาน (Workpiece Assessment & Google Sheets)**
  - แบบทดสอบวัดผลประเมินผล 5 ข้อ พร้อมเฉลยอธิบายขั้นตอนคำนวณ
  - ตารางบันทึกผลการทดสอบ Q-Point & Firing Angle Sweep ($\alpha = 0^\circ \dots 150^\circ$)
  - ส่งข้อมูลผลแลปเข้า Google Sheet ของครูผู้สอนผ่าน Google Apps Script (`Code.gs`)

---

## 🚀 การรันใช้งานเซิร์ฟเวอร์ Local

```bash
# รันผ่าน Master Portal (พอร์ต 8082)
cd /Users/allarmmac/myjob_folder/MyLaB/Elec_Power
node server.js
# เข้าใช้งาน: http://localhost:8082/unit2/ หรือ http://localhost:8082/rectifier/

# หรือรันผ่าน Standalone Server ของ Unit 2 (พอร์ต 3012)
cd Unit2
node server.js
# เข้าใช้งาน: http://localhost:3012/
```
