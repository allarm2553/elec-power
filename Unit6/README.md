# ⚡ หน่วยที่ 6: วงจรควบคุมความเร็วมอเตอร์ในงานอุตสาหกรรม (Industrial Motor Speed Control)

ห้องปฏิบัติการวิศวกรรมอิเล็กทรอนิกส์กำลังเสมือนจริง (Interactive Web-Based Engineering Virtual Lab) ตามมาตรฐานหลักสูตรประกาศนียบัตรวิชาชีพชั้นสูง (ปวส.) **รหัสวิชา 30105-2019 อิเล็กทรอนิกส์กำลัง** 
จำนวนชั่วโมงเรียน: 10 ชั่วโมง (ทฤษฎี 4 ชม. / ปฏิบัติ 6 ชม.)

---

## 🎯 วัตถุประสงค์เชิงพฤติกรรม (Learning Objectives)

1. อธิบายและวิเคราะห์หลักการทำงานของวงจรขับมอเตอร์กระแสตรงแบบ 4 ควอดรันต์ (4-Quadrant DC Drive) ได้อย่างถูกต้อง
2. วิเคราะห์ความสัมพันธ์ของแรงดันและความถี่ $(V/f = \text{Constant})$ และผลของการชดเชยแรงบิด (Torque Boost) ในอินเวอร์เตอร์ขับมอเตอร์เหนี่ยวนำ 3 เฟส (VFD) ได้
3. ติดตั้งและตั้งค่าพารามิเตอร์ของอินเวอร์เตอร์ VFD ผ่านแป้นควบคุมดิจิทัลเสมือน (Virtual Digital Keypad) และวิเคราะห์สภาวะเร่ง/ชะลอความเร็ว (Acc/Dec Ramp) ได้
4. อธิบายลำดับการนำกระแสและการสวิตชิ่ง 6 สเต็ป (6-Step Commutation) ของมอเตอร์ไร้แปรงถ่าน (BLDC Motor) ร่วมกับเซนเซอร์ฮอลล์ 120° ได้
5. บันทึกผลการทดสอบ วิเคราะห์สัญญาณ และส่งรายงานข้อมูลผ่านระบบคลาวด์ Google Sheets ได้อย่างถูกต้อง

---

## 📑 โครงสร้างโมดูลการเรียนรู้ (5 Learning Modules)

### 1. การควบคุมมอเตอร์กระแสตรงแบบ 4 ควอดรันต์ (4-Quadrant DC Motor Drive)
- **Quadrant I (Forward Motoring)**: เดินหน้าขับเคลื่อน $(\omega > 0, T > 0)$
- **Quadrant II (Forward Regenerative Braking)**: เดินหน้าเบรกคืนพลังงาน $(\omega > 0, T < 0)$
- **Quadrant III (Reverse Motoring)**: ถอยหลังขับเคลื่อน $(\omega < 0, T < 0)$
- **Quadrant IV (Reverse Regenerative Braking)**: ถอยหลังเบรกคืนพลังงาน $(\omega < 0, T > 0)$
- เปรียบเทียบวงจรสวิตชิ่ง H-Bridge Bipolar/Unipolar PWM และ Dual Converter SCR

### 2. อินเวอร์เตอร์ VFD & การควบคุมอัตราส่วน V/f (VFD V/f Control Profile)
- การรักษาฟลักซ์แม่เหล็กคงที่ $\Phi_m = V_1 / (4.44 f_1 N_1 K_w)$
- โซนแรงบิดคงที่ (Constant Torque: $0 - 50\text{ Hz}$) เทียบกับ โซนกำลังคงที่ / ลดทอนฟลักซ์ (Field Weakening: $> 50\text{ Hz}$)
- การชดเชยแรงดันจุดออกตัว (Low Frequency Torque Boost) ป้องกันมอเตอร์ไม่มีแรง
- ผลกระทบของการตั้งค่า $V/f$ สูงเกินพิกัดจนแกนเหล็กอิ่มตัว (Core Saturation)

### 3. แป้นควบคุมดิจิทัลเสมือน & ปรับแต่งพารามิเตอร์ VFD (Virtual Digital Keypad & Parameter Tuning)
- แป้นควบคุมอุตสาหกรรม (VFD Digital Keypad): จอแสดงผล 7-Segment, ปุ่มกด RUN / STOP / FWD-REV / PROG / DATA, และ Digital Speed Knob
- ปรับตั้งพารามิเตอร์อุตสาหกรรม $P0\text{-}01$ ถึง $P0\text{-}08$
- จำลองการเร่ง/หน่วงความเร็ว (Acc/Dec Ramp Profile) และตรวจจับ Fault Alarm (`o.C.`, `o.U.`, `o.L.`)

### 4. การขับมอเตอร์ไร้แปรงถ่าน BLDC 6 สเต็ปคอมมิวเตชัน (BLDC Motor & Hall Sensor Commutation)
- มอเตอร์ BLDC 3 เฟส และการทำงานของเซนเซอร์ฮอลล์ 3 ตัว ($H_1, H_2, H_3$) ทำมุม 120° ทางไฟฟ้า
- ตารางความจริงคอมมิวเตชัน 6 ขั้น (6-Step Commutation Truth Table) กับอินเวอร์เตอร์ 6 สวิตช์
- ออสซิลโลสโคป 4 ช่องวัดสัญญาณเซนเซอร์ฮอลล์ และแรงดันเฟส Trapezoidal Back-EMF

### 5. แบบทดสอบวัดผล & บันทึกผลการทดลอง (Assessment & Workpiece Logger)
- แบบทดสอบวัดผลสัมฤทธิ์ 5 ข้อ พร้อมเฉลยอธิบายหลักวิศวกรรม
- ตารางบันทึกผลการทดลองดิจิทัล (Data Logger)
- เชื่อมต่อและส่งผลคะแนนเข้า Google Sheets ผ่าน Google Apps Script (`?gas=URL`)
- ฟังก์ชัน Export / พิมพ์รายงานใบงานการทดลอง

---

## 🚀 การเปิดใช้งาน

เปิดใช้งานผ่าน Master Portal:
```bash
node server.js
```
เข้าใช้งานผ่าน URL: [http://localhost:8082/unit6/](http://localhost:8082/unit6/)
