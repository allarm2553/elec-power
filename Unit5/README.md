# ⚡ หน่วยที่ 5: ติดตั้งและทดสอบระบบเครื่องสำรองไฟฟ้าและไฟฉุกเฉิน (UPS & Emergency Power Lab)
## หลักสูตรประกาศนียบัตรวิชาชีพชั้นสูง (ปวส.) รหัสวิชา 30105-2019 อิเล็กทรอนิกส์กำลัง (Power Electronics)
**เวลาจัดการเรียนรู้:** 10 ชั่วโมง (ทฤษฎี 4 ชม. / ปฏิบัติ 6 ชม.)

---

## 🎯 จุดประสงค์เชิงพฤติกรรม & มาตรฐานสมรรถนะ
1. **ด้านความรู้ (Knowledge):**
   - อธิบายความแตกต่างของสถาปัตยกรรม UPS: Standby/Offline, Line-Interactive (AVR) และ True Online Double-Conversion
   - อธิบายกลไกการสลับแหล่งจ่ายไฟฟ้าด้วย Static Transfer Switch (STS) และปรากฏการณ์ Transfer Time
   - อธิบายหลักการชาร์จแบตเตอรี่แบบ 3-Stage Smart Charger (Bulk CC $\to$ Absorption CV $\to$ Float)
   - อธิบายวงจรตรวจจับไฟดับและขับหลอดไฟฉุกเฉิน LED อัตโนมัติ (มอก. 1102)

2. **ด้านทักษะ (Skill):**
   - คำนวณขนาดพิกัดกำลังของ UPS (kVA และ kW) ตามขนาดโหลดและค่าเพาเวอร์แฟกเตอร์ (PF)
   - คำนวณระยะเวลาสำรองไฟ (Backup Runtime in minutes/hours) จากความจุแบตเตอรี่ ($Ah$)
   - ใช้งาน Virtual Oscilloscope ตรวจวัดเวลาถ่ายโอนแหล่งจ่าย (Transfer Time in ms) ขณะเกิดสภาวะไฟฟ้าดับ (Blackout Simulation)
   - บันทึกผลการทดลองลงตาราง Data Logger ส่งออกข้อมูลเป็น CSV และส่งคะแนนเข้า Google Sheets

3. **ด้านจิตพิสัย (Attitude):**
   - ตระหนักถึงความสำคัญของระบบไฟฟ้าสำรองในสถานที่สำคัญ เช่น โรงพยาบาล ศูนย์ข้อมูล (Data Center) และระบบความปลอดภัยอัคคีภัย

---

## 📐 สมการคำนวณและทฤษฎีหลัก

### 1. การคำนวณพิกัดกำลังไฟฟ้า (Apparent Power S & Real Power P)
- $$S (\text{VA}) = \frac{P (\text{W})}{PF}$$
- กำหนดให้เลือกขนาดพิกัด UPS เผื่ออัตราการขยายตัว (Safety Margin 20% - 25%):
  $$S_{UPS} \ge 1.25 \times \sum S_{load}$$

### 2. การคำนวณระยะเวลาสำรองไฟฟ้า (Backup Runtime)
- $$t_{backup} (\text{hours}) = \frac{N \times V_{bat} \times C_{Ah} \times \eta \times DoD}{P_{load}}$$
  - $N$: จำนวนก้อนแบตเตอรี่ที่ต่ออนุกรม
  - $V_{bat}$: แรงดันระบุต่อก้อน (12 V)
  - $C_{Ah}$: ความจุแบตเตอรี่ (Amp-hour)
  - $\eta$: ประสิทธิภาพของอินเวอร์เตอร์ (ปกติ 85% - 92%)
  - $DoD$: ระดับความลึกของการคายประจุ (Depth of Discharge ปกติ 70% - 80% สำหรับ VRLA)

### 3. ระบบชาร์จแบตเตอรี่ 3 สเตจ (3-Stage Smart Charging)
- **Stage 1 (Bulk - CC):** กระแสชาร์จคงที่ $I_{chg} \approx 0.1C - 0.2C$ จนกระทั่งแรงดันขึ้นถึง 14.4 V (ต่อบล็อก 12V)
- **Stage 2 (Absorption - CV):** คุมแรงดันคงที่ 14.4 V จนกระทั่งกระแสชาร์จลดลงต่ำกว่า $0.02C$
- **Stage 3 (Float):** ลดแรงดันลงมารักษาประจุคงที่ที่ 13.5 V - 13.8 V เพื่อป้องกันแบตเตอรี่บวมและสูญเสียน้ำกลั่น

---

## 💻 การเข้าใช้งานและการทดสอบระบบ (Local Server)
1. **ผ่าน Master Portal (พอร์ตหลัก):**
   ```bash
   node server.js
   ```
   เข้าใช้งานที่: [http://localhost:8082/unit5/](http://localhost:8082/unit5/)
2. **ผ่าน Standalone Server:**
   ```bash
   node Unit5/server.js
   ```
   เข้าใช้งานที่: [http://localhost:3015/](http://localhost:3015/)
