# ⚡ หน่วยที่ 4: ประกอบและทดสอบวงจรอินเวอร์เตอร์แปลงผันไฟฟ้า (DC-to-AC Inverters Lab)
## หลักสูตรประกาศนียบัตรวิชาชีพชั้นสูง (ปวส.) รหัสวิชา 30105-2019 อิเล็กทรอนิกส์กำลัง (Power Electronics)
**เวลาจัดการเรียนรู้:** 15 ชั่วโมง (ทฤษฎี 6 ชม. / ปฏิบัติ 9 ชม.) — **หน่วยแกนหลัก (Core Unit)**

---

## 🎯 จุดประสงค์เชิงพฤติกรรม & มาตรฐานสมรรถนะ
1. **ด้านความรู้ (Knowledge):**
   - อธิบายหลักการสังเคราะห์สัญญาณไซน์พัลส์วิดธ์มอดูเลชัน (SPWM Synthesis)
   - อธิบายการทำงานของ Full-Bridge H-Inverter โหมด Bipolar และ Unipolar Switching
   - วิเคราะห์สาเหตุและกลไกการป้องกันการลัดวงจรขาบริดจ์ (Shoot-through Fault) ด้วย Dead-time
   - อธิบายการทำงานของวงจรอินเวอร์เตอร์ 3 เฟส 6 พัลส์ (180° และ 120° Conduction Modes)
   - อธิบายการออกแบบวงจรกรอง LC Low-Pass Filter เพื่อขจัดความถี่สวิตชิ่ง

2. **ด้านทักษะ (Skill):**
   - คำนวณค่าดัชนีการกล้ำทางแอมพลิจูด ($m_a$) และความถี่ ($m_f$)
   - คำนวณแรงดันเอาต์พุตพื้นฐาน ($V_{1,rms}$) และความผิดเพี้ยนฮาร์มอนิกรวม (THD%)
   - ตรวจวัดรูปคลื่น SPWM, แรงดันตกคร่อมสวิตช์, แรงดันเอาต์พุต และสเปกตรัม FFT ผ่าน Virtual Oscilloscope
   - บันทึกผลการทดลองลงตาราง Data Logger ส่งออกข้อมูลเป็น CSV และส่งคะแนนเข้า Google Sheets

3. **ด้านจิตพิสัย (Attitude):**
   - ปฏิบัติตามมาตรฐานความปลอดภัยในการควบคุม Dead-time เพื่อป้องกันการระเบิดเสียหายของอุปกรณ์สวิตชิ่งกำลัง

---

## 📐 สมการคำนวณและทฤษฎีหลัก

### 1. การสังเคราะห์สัญญาณ SPWM (Amplitude & Frequency Modulation Index)
- Amplitude Modulation Index:
  $$m_a = \frac{V_{ref}}{V_{tri}} = \frac{V_{control,peak}}{V_{carrier,peak}}$$
- Frequency Modulation Ratio:
  $$m_f = \frac{f_s}{f_1} = \frac{f_{carrier}}{f_{reference}}$$

### 2. แรงดันเอาต์พุต 1-Phase Inverter ($m_a \le 1.0$)
- แรงดันพีคของฮาร์มอนิกหลัก (Fundamental Peak Voltage):
  $$V_{1,peak} = m_a \cdot V_{dc}$$
- แรงดันประสิทธิผลของฮาร์มอนิกหลัก (Fundamental RMS Voltage):
  $$V_{1,rms} = \frac{m_a \cdot V_{dc}}{\sqrt{2}} \approx 0.707 \cdot m_a \cdot V_{dc}$$

### 3. อินเวอร์เตอร์ 3 เฟส บริดจ์ 6 พัลส์ (3-Phase Full-Bridge Inverter)
- แรงดันสาย-สาย (Line-to-Line RMS Voltage at fundamental):
  $$V_{LL,1,rms} = \frac{\sqrt{3}}{\sqrt{2}} \cdot m_a \cdot \frac{V_{dc}}{2} \approx 0.612 \cdot m_a \cdot V_{dc}$$

### 4. คุณภาพไฟฟ้าและความผิดเพี้ยนฮาร์มอนิกรวม (Total Harmonic Distortion)
- $$THD = \frac{\sqrt{\sum_{n=2}^{\infty} V_n^2}}{V_1} \times 100\%$$

---

## 💻 การเข้าใช้งานและการทดสอบระบบ (Local Server)
1. **ผ่าน Master Portal (พอร์ตหลัก):**
   ```bash
   node server.js
   ```
   เข้าใช้งานที่: [http://localhost:8082/unit4/](http://localhost:8082/unit4/)
2. **ผ่าน Standalone Server:**
   ```bash
   node Unit4/server.js
   ```
   เข้าใช้งานที่: [http://localhost:3014/](http://localhost:3014/)
