const express = require('express')
const cors = require('cors')
const mysql = require('mysql2')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const ExcelJS = require('exceljs')
const bcrypt = require('bcryptjs') 

const app = express()
app.use(cors())                // ✅ Allow all origins (mobile app + admin Vue)
app.use(express.json())

const uploadsDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir)
app.use('/uploads', express.static(uploadsDir))

const photoStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `doctor_${Date.now()}${ext}`)
  }
})
const uploadPhoto = multer({
  storage: photoStorage,
  limits: { fileSize: 1 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (['image/png', 'image/jpeg'].includes(file.mimetype)) cb(null, true)
    else cb(new Error('Only PNG and JPG images are allowed.'))
  }
})

const uploadImport = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
})

const db = mysql.createConnection({
  host: 'carequeue-admin.com',
  user: 'u211334565_admin',
  password: 'Carequeue2026',
  database: 'u211334565_carequeue'
})

db.connect(err => {
  if (err) {
    console.error('❌ MySQL connection failed:', err.message)
    process.exit(1)
  }
  console.log('✅ Connected to MySQL')
  createTables()
})

function createTables() {
  const sql1 = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`

  const sql2 = `
    CREATE TABLE IF NOT EXISTS doctors (
      id INT AUTO_INCREMENT PRIMARY KEY,
      doctor_id VARCHAR(20) UNIQUE,
      first_name VARCHAR(80) NOT NULL,
      last_name VARCHAR(80) NOT NULL,
      middle_name VARCHAR(80),
      name_extension VARCHAR(20),
      gender ENUM('Male','Female','Other') NOT NULL,
      date_of_birth DATE,
      religion VARCHAR(80),
      civil_status ENUM('Single','Married','Widowed','Separated'),
      landline VARCHAR(30),
      mobile VARCHAR(30) NOT NULL,
      email VARCHAR(150),
      address TEXT,
      specialization VARCHAR(120) NOT NULL,
      sub_specialization VARCHAR(120),
      hospital VARCHAR(150) NOT NULL,
      office VARCHAR(60) NOT NULL,
      license_number VARCHAR(60),
      years_experience INT,
      medical_school VARCHAR(150),
      status ENUM('IN','OUT') DEFAULT 'IN',
      photo_url VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`

  const sql3 = `
    CREATE TABLE IF NOT EXISTS patients (
      id INT AUTO_INCREMENT PRIMARY KEY,
      patient_id VARCHAR(20) UNIQUE,
      last_name VARCHAR(80) NOT NULL,
      first_name VARCHAR(80) NOT NULL,
      middle_name VARCHAR(80),
      name_extension VARCHAR(20),
      gender ENUM('Male','Female','Other'),
      date_of_birth DATE,
      age INT,
      religion VARCHAR(80),
      landline VARCHAR(30),
      mobile VARCHAR(30),
      email VARCHAR(150),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`

  const sql4 = `
    CREATE TABLE IF NOT EXISTS appointments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      appointment_id VARCHAR(20) UNIQUE,
      patient_id INT,
      patient_type ENUM('new','existing') DEFAULT 'new',
      last_name VARCHAR(80) NOT NULL,
      first_name VARCHAR(80) NOT NULL,
      middle_name VARCHAR(80),
      name_extension VARCHAR(20),
      gender ENUM('Male','Female','Other'),
      date_of_birth DATE,
      age INT,
      religion VARCHAR(80),
      landline VARCHAR(30),
      mobile VARCHAR(30),
      email VARCHAR(150),
      doctor VARCHAR(150),
      appointment_date DATE,
      appointment_time TIME,
      condition_notes TEXT,
      note TEXT,
      status ENUM('waiting','approved','cancelled','arrived','completed') DEFAULT 'waiting',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE SET NULL
    )`

  const sql5 = `
    CREATE TABLE IF NOT EXISTS doctor_accounts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      doctor_id INT NOT NULL UNIQUE,
      username VARCHAR(150) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      is_active TINYINT(1) DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
    )`

  const sql6 = `
    CREATE TABLE IF NOT EXISTS hospitals (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(200) NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`

  const sql7 = `
    CREATE TABLE IF NOT EXISTS specializations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(150) NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`

  const sql8 = `
    CREATE TABLE IF NOT EXISTS doctor_permissions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      doctor_id INT NOT NULL UNIQUE,
      view_dashboard TINYINT(1) DEFAULT 0,
      view_schedule TINYINT(1) DEFAULT 0,
      book_appointment TINYINT(1) DEFAULT 0,
      view_appointments TINYINT(1) DEFAULT 0,
      update_appt_status TINYINT(1) DEFAULT 0,
      view_queue TINYINT(1) DEFAULT 0,
      view_medical_records TINYINT(1) DEFAULT 0,
      view_patient_profile TINYINT(1) DEFAULT 0,
      print_records TINYINT(1) DEFAULT 0,
      view_patients TINYINT(1) DEFAULT 0,
      search_patients TINYINT(1) DEFAULT 0,
      view_doctors TINYINT(1) DEFAULT 0,
      edit_profile TINYINT(1) DEFAULT 0,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
    )`

  db.query(sql1, err => { if (err) console.error('❌ Users table:', err.message); else console.log('✅ Users table ready') })
  db.query(sql2, err => { if (err) console.error('❌ Doctors table:', err.message); else console.log('✅ Doctors table ready') })
  db.query(sql3, err => { if (err) console.error('❌ Patients table:', err.message); else console.log('✅ Patients table ready') })
  db.query(sql4, err => { if (err) console.error('❌ Appointments table:', err.message); else console.log('✅ Appointments table ready') })
  db.query(sql5, err => { if (err) console.error('❌ Doctor accounts table:', err.message); else console.log('✅ Doctor accounts table ready') })
  db.query(sql6, err => {
    if (err) { console.error('❌ Hospitals table:', err.message) }
    else { console.log('✅ Hospitals table ready'); seedHospitals() }
  })
  db.query(sql7, err => {
    if (err) { console.error('❌ Specializations table:', err.message) }
    else { console.log('✅ Specializations table ready'); seedSpecializations() }
  })
  db.query(sql8, err => { if (err) console.error('❌ Doctor permissions table:', err.message); else console.log('✅ Doctor permissions table ready') })
}

// ── SEED HOSPITALS ─────────────────────────────────────────
function seedHospitals() {
  const defaults = [
    'ANGELES UNIVERSITY FOUNDATION',
    'SACRED HEART MEDICAL CENTER',
    'ANGELES MEDICAL CENTER',
    'AMANDO L. GARCIA MEDICAL CENTER',
    'ST. CATHERINE OF ALEXANDRIA FOUNDATION AND MEDICAL CENTER'
  ]
  defaults.forEach(name => {
    db.query('INSERT IGNORE INTO hospitals (name) VALUES (?)', [name])
  })
}

// ── SEED SPECIALIZATIONS ───────────────────────────────────
function seedSpecializations() {
  const defaults = [
    'Adult & Pediatric Urology', 'Adult Pediatric - Allergology & Immunology',
    'Anesthesiology', 'Cardiology', 'Cardiovascular Surgery', 'Dermatology',
    'Diabetology', 'Emergency Medicine', 'Endocrinology', 'Family Medicine',
    'Gastroenterology', 'General Surgery', 'Geriatrics', 'Hematology',
    'Infectious Disease Specialist', 'Internal Medicine', 'Nephrology',
    'Neurology', 'Neurosurgery', 'Obstetrics & Gynecology', 'Oncology',
    'Ophthalmology', 'Orthopedic Surgery', 'Otolaryngology (ENT)', 'Pathology',
    'Pediatric - Infectious Disease', 'Pediatrics',
    'Physical Medicine & Rehabilitation', 'Plastic Surgery', 'Psychiatry',
    'Pulmonology', 'Radiology', 'Rheumatology', 'Urology', 'Vascular Surgery'
  ]
  defaults.forEach(name => {
    db.query('INSERT IGNORE INTO specializations (name) VALUES (?)', [name])
  })
}

// ── ID GENERATORS ──────────────────────────────────────────
function generateDoctorId(callback) {
  db.query('SELECT COUNT(*) AS total FROM doctors', (err, results) => {
    if (err) return callback(err)
    callback(null, `DR-${(results[0].total + 1).toString().padStart(5, '0')}`)
  })
}
function generatePatientId(callback) {
  db.query('SELECT COUNT(*) AS total FROM patients', (err, results) => {
    if (err) return callback(err)
    callback(null, `PT-${(results[0].total + 1).toString().padStart(5, '0')}`)
  })
}
function generateAppointmentId(callback) {
  db.query('SELECT COUNT(*) AS total FROM appointments', (err, results) => {
    if (err) return callback(err)
    callback(null, `AP-${(results[0].total + 1).toString().padStart(5, '0')}`)
  })
}

// ══════════════════════════════════════════════════════
//  AUTH ROUTES
// ══════════════════════════════════════════════════════

app.post('/register', async (req, res) => {
  const { name, email, password } = req.body
  if (!name || !email || !password)
    return res.status(400).json({ message: 'All fields are required.' })

  try {
    const password_hash = await bcrypt.hash(password, 10)
    db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, password_hash],
      (err) => {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY')
            return res.status(409).json({ message: 'Email already registered!' })
          return res.status(500).json({ message: 'Registration failed.' })
        }
        res.status(201).json({ message: 'Registration successful!' })
      }
    )
  } catch {
    res.status(500).json({ message: 'Server error during registration.' })
  }
})

app.post('/login', (req, res) => {
  const { email, password } = req.body

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Login failed.' })

    if (results.length > 0) {
      const user = results[0]
      let match = false
      if (user.password.startsWith('$2')) {
        match = await bcrypt.compare(password, user.password)
      } else {
        match = password === user.password
        if (match) {
          const hashed = await bcrypt.hash(password, 10)
          db.query('UPDATE users SET password = ? WHERE id = ?', [hashed, user.id])
        }
      }

      if (!match) return res.status(401).json({ message: 'Invalid email or password!' })

      return res.status(200).json({
        message: 'Login successful!',
        role: 'admin',
        user: { name: user.name, email: user.email, role: 'admin' }
      })
    }

    db.query(
      `SELECT da.*, d.id AS doctor_db_id,
              d.first_name, d.last_name, d.specialization, d.hospital
       FROM doctor_accounts da
       JOIN doctors d ON d.id = da.doctor_id
       WHERE da.username = ? AND da.is_active = 1`,
      [email],
      async (err2, results2) => {
        if (err2) return res.status(500).json({ message: 'Login failed.' })
        if (results2.length === 0)
          return res.status(401).json({ message: 'Invalid email or password!' })

        const doc = results2[0]
        let match = false
        if (doc.password.startsWith('$2')) {
          match = await bcrypt.compare(password, doc.password)
        } else {
          match = password === doc.password
          if (match) {
            const hashed = await bcrypt.hash(password, 10)
            db.query('UPDATE doctor_accounts SET password = ? WHERE id = ?', [hashed, doc.id])
          }
        }

        if (!match) return res.status(401).json({ message: 'Invalid email or password!' })

        db.query(
          'SELECT * FROM doctor_permissions WHERE doctor_id = ?',
          [doc.doctor_db_id],
          (err3, permRows) => {
            const permissions = permRows && permRows.length > 0 ? permRows[0] : {}
            return res.status(200).json({
              message: 'Login successful!',
              role: 'doctor',
              user: {
                name: `Dr. ${doc.first_name} ${doc.last_name}`,
                email: doc.username,
                role: 'doctor',
                doctor_id: doc.doctor_db_id,
                specialization: doc.specialization,
                hospital: doc.hospital,
                permissions
              }
            })
          }
        )
      }
    )
  })
})

// ── UPDATE PROFILE ─────────────────────────────────────
app.put('/update-profile', async (req, res) => {
  const { currentEmail, name, email, password } = req.body
  let sql = 'UPDATE users SET name = ?, email = ?'
  const params = [name, email]

  if (password) {
    const hashed = await bcrypt.hash(password, 10)
    sql += ', password = ?'
    params.push(hashed)
  }

  sql += ' WHERE email = ?'
  params.push(currentEmail)

  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json({ message: 'Update failed.' })
    if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found!' })
    res.status(200).json({ message: 'Profile updated!', user: { name, email } })
  })
})

app.get('/users', (req, res) => {
  db.query('SELECT id, name, email, created_at FROM users', (err, results) => {
    if (err) return res.status(500).json({ message: 'Failed to fetch users.' })
    res.json(results)
  })
})

// ══════════════════════════════════════════════════════
//  HOSPITALS ROUTES
// ══════════════════════════════════════════════════════

app.get('/hospitals', (req, res) => {
  db.query('SELECT * FROM hospitals ORDER BY name ASC', (err, results) => {
    if (err) return res.status(500).json({ message: 'Failed to fetch hospitals.' })
    res.json(results)
  })
})

app.post('/hospitals', (req, res) => {
  const { name } = req.body
  if (!name || !name.trim()) return res.status(400).json({ message: 'Hospital name is required.' })
  db.query('INSERT INTO hospitals (name) VALUES (?)', [name.trim().toUpperCase()], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'Hospital already exists.' })
      return res.status(500).json({ message: 'Failed to add hospital.' })
    }
    db.query('SELECT * FROM hospitals WHERE id = ?', [result.insertId], (err2, rows) => {
      res.status(201).json({ message: 'Hospital added!', hospital: rows[0] })
    })
  })
})

// ══════════════════════════════════════════════════════
//  SPECIALIZATIONS ROUTES
// ══════════════════════════════════════════════════════

app.get('/specializations', (req, res) => {
  db.query('SELECT * FROM specializations ORDER BY name ASC', (err, results) => {
    if (err) return res.status(500).json({ message: 'Failed to fetch specializations.' })
    res.json(results)
  })
})

app.post('/specializations', (req, res) => {
  const { name } = req.body
  if (!name || !name.trim()) return res.status(400).json({ message: 'Specialization name is required.' })
  db.query('INSERT INTO specializations (name) VALUES (?)', [name.trim()], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'Specialization already exists.' })
      return res.status(500).json({ message: 'Failed to add specialization.' })
    }
    db.query('SELECT * FROM specializations WHERE id = ?', [result.insertId], (err2, rows) => {
      res.status(201).json({ message: 'Specialization added!', specialization: rows[0] })
    })
  })
})

// ══════════════════════════════════════════════════════
//  DOCTOR ACCOUNTS ROUTES
// ══════════════════════════════════════════════════════

app.get('/doctor-accounts', (req, res) => {
  const sql = `
    SELECT da.*, d.first_name, d.last_name, d.doctor_id AS doc_ref_id, d.specialization, d.hospital
    FROM doctor_accounts da
    JOIN doctors d ON d.id = da.doctor_id
    ORDER BY da.created_at DESC
  `
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: 'Failed to fetch doctor accounts.' })
    res.json(results)
  })
})

app.get('/doctor-accounts/by-doctor/:doctorId', (req, res) => {
  db.query('SELECT * FROM doctor_accounts WHERE doctor_id = ?', [req.params.doctorId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Failed.' })
    if (results.length === 0) return res.status(404).json({ message: 'No account found.' })
    res.json(results[0])
  })
})

app.post('/doctor-accounts', (req, res) => {
  const { doctor_id, username, password } = req.body
  if (!doctor_id || !username || !password) {
    return res.status(400).json({ message: 'doctor_id, username, and password are required.' })
  }
  db.query(
    'INSERT INTO doctor_accounts (doctor_id, username, password) VALUES (?, ?, ?)',
    [doctor_id, username.trim().toLowerCase(), password],
    (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ message: 'This doctor already has an account, or the username is taken.' })
        }
        return res.status(500).json({ message: 'Failed to create doctor account.' })
      }

      db.query('UPDATE doctors SET status = ? WHERE id = ?', ['IN', doctor_id], (updateErr) => {
        if (updateErr) console.error('⚠️  Could not auto-update doctor status to IN:', updateErr.message)
      })

      db.query('SELECT * FROM doctor_accounts WHERE id = ?', [result.insertId], (err2, rows) => {
        res.status(201).json({ message: 'Doctor account created successfully!', account: rows[0] })
      })
    }
  )
})

app.put('/doctor-accounts/:id', (req, res) => {
  const { password, is_active } = req.body
  let parts = []
  const params = []
  if (password !== undefined)  { parts.push('password = ?');  params.push(password) }
  if (is_active !== undefined) { parts.push('is_active = ?'); params.push(is_active) }
  if (parts.length === 0) return res.status(400).json({ message: 'Nothing to update.' })
  params.push(req.params.id)
  db.query(`UPDATE doctor_accounts SET ${parts.join(', ')} WHERE id = ?`, params, (err, result) => {
    if (err) return res.status(500).json({ message: 'Failed to update account.' })
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Account not found.' })
    res.json({ message: 'Account updated.' })
  })
})

app.delete('/doctor-accounts/:id', (req, res) => {
  db.query('SELECT doctor_id FROM doctor_accounts WHERE id = ?', [req.params.id], (fetchErr, fetchRows) => {
    if (fetchErr || fetchRows.length === 0) {
      return db.query('DELETE FROM doctor_accounts WHERE id = ?', [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Failed to delete account.' })
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Account not found.' })
        res.json({ message: 'Doctor account deleted.' })
      })
    }

    const linkedDoctorId = fetchRows[0].doctor_id
    db.query('DELETE FROM doctor_accounts WHERE id = ?', [req.params.id], (err, result) => {
      if (err) return res.status(500).json({ message: 'Failed to delete account.' })
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Account not found.' })

      db.query('UPDATE doctors SET status = ? WHERE id = ?', ['OUT', linkedDoctorId], (updateErr) => {
        if (updateErr) console.error('⚠️  Could not revert doctor status to OUT:', updateErr.message)
      })

      res.json({ message: 'Doctor account deleted.' })
    })
  })
})

// ══════════════════════════════════════════════════════
//  DOCTOR PERMISSIONS ROUTES
// ══════════════════════════════════════════════════════

app.get('/doctor-permissions/:doctorId', (req, res) => {
  db.query('SELECT * FROM doctor_permissions WHERE doctor_id = ?', [req.params.doctorId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Failed to fetch permissions.' })
    if (results.length === 0) {
      return res.json({
        doctor_id: parseInt(req.params.doctorId),
        view_dashboard: 0, view_schedule: 0, book_appointment: 0,
        view_appointments: 0, update_appt_status: 0, view_queue: 0,
        view_medical_records: 0, view_patient_profile: 0, print_records: 0,
        view_patients: 0, search_patients: 0, view_doctors: 0, edit_profile: 0
      })
    }
    res.json(results[0])
  })
})

app.post('/doctor-permissions/:doctorId', (req, res) => {
  const doctorId = req.params.doctorId
  const {
    view_dashboard, view_schedule, book_appointment, view_appointments,
    update_appt_status, view_queue, view_medical_records, view_patient_profile,
    print_records, view_patients, search_patients, view_doctors, edit_profile
  } = req.body

  const sql = `
    INSERT INTO doctor_permissions
      (doctor_id, view_dashboard, view_schedule, book_appointment, view_appointments,
       update_appt_status, view_queue, view_medical_records, view_patient_profile,
       print_records, view_patients, search_patients, view_doctors, edit_profile)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      view_dashboard = VALUES(view_dashboard),
      view_schedule = VALUES(view_schedule),
      book_appointment = VALUES(book_appointment),
      view_appointments = VALUES(view_appointments),
      update_appt_status = VALUES(update_appt_status),
      view_queue = VALUES(view_queue),
      view_medical_records = VALUES(view_medical_records),
      view_patient_profile = VALUES(view_patient_profile),
      print_records = VALUES(print_records),
      view_patients = VALUES(view_patients),
      search_patients = VALUES(search_patients),
      view_doctors = VALUES(view_doctors),
      edit_profile = VALUES(edit_profile)
  `
  const vals = [
    doctorId,
    view_dashboard ? 1 : 0, view_schedule ? 1 : 0,
    book_appointment ? 1 : 0, view_appointments ? 1 : 0,
    update_appt_status ? 1 : 0, view_queue ? 1 : 0,
    view_medical_records ? 1 : 0, view_patient_profile ? 1 : 0,
    print_records ? 1 : 0, view_patients ? 1 : 0,
    search_patients ? 1 : 0, view_doctors ? 1 : 0, edit_profile ? 1 : 0
  ]
  db.query(sql, vals, (err) => {
    if (err) return res.status(500).json({ message: 'Failed to save permissions.' })
    res.json({ message: 'Permissions saved successfully.' })
  })
})

// ══════════════════════════════════════════════════════
//  DOCTORS ROUTES
//  ⚠️  IMPORTANT: POST /doctors/import MUST come before
//      GET/PUT/DELETE /doctors/:id to avoid route conflicts.
// ══════════════════════════════════════════════════════

app.get('/doctors', (req, res) => {
  const sql = `
    SELECT d.*, IF(da.id IS NOT NULL, 1, 0) AS has_account
    FROM doctors d
    LEFT JOIN doctor_accounts da ON da.doctor_id = d.id
    ORDER BY d.created_at DESC
  `
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: 'Failed to fetch doctors.' })
    res.json(results)
  })
})

// ── IMPORT DOCTORS (must be before /:id routes) ────────────
app.post('/doctors/import', uploadImport.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded.' })
  const filename = req.file.originalname.toLowerCase()
  let rows = []

  try {
    if (filename.endsWith('.csv')) {
      const text = req.file.buffer.toString('utf-8')
      const lines = text.split('\n').filter(l => l.trim())
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''))
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map(c => c.trim().replace(/"/g, ''))
        const obj = {}
        headers.forEach((h, idx) => { obj[h] = cols[idx] || '' })
        rows.push(obj)
      }
    } else {
      const workbook = new ExcelJS.Workbook()
      await workbook.xlsx.load(req.file.buffer)
      const sheet = workbook.worksheets[0]
      const headers = []
      sheet.eachRow((row, rowIndex) => {
        if (rowIndex === 1) {
          row.eachCell(cell => headers.push(cell.value?.toString().toLowerCase().trim() || ''))
        } else {
          const obj = {}
          row.eachCell((cell, colIndex) => {
            const key = headers[colIndex - 1]
            if (key) obj[key] = cell.value?.toString().trim() || ''
          })
          if (obj['first_name'] || obj['last_name']) rows.push(obj)
        }
      })
    }
  } catch (e) {
    return res.status(400).json({ message: 'Failed to parse file.' })
  }

  if (rows.length === 0) {
    return res.status(400).json({ message: 'The file is empty or has no valid data rows.' })
  }

  let imported = 0
  const errors = []

  const processRow = (i) => {
    if (i >= rows.length) {
      return res.status(201).json({
        message: `Import complete. ${imported} doctor(s) imported.`,
        count: imported,
        errors
      })
    }

    const row = rows[i]
    generateDoctorId((err, doctor_id) => {
      if (err) { errors.push(`Row ${i + 2}: Failed to generate ID`); return processRow(i + 1) }

      const sql = `
        INSERT INTO doctors
          (doctor_id, first_name, last_name, middle_name, name_extension, gender,
           date_of_birth, religion, civil_status, landline, mobile, email, address,
           specialization, sub_specialization, hospital, office, license_number,
           years_experience, medical_school, status)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`

      const vals = [
        doctor_id,
        row['first_name']         || '',
        row['last_name']          || '',
        row['middle_name']        || null,
        row['name_extension']     || null,
        row['gender']             || 'Male',
        row['date_of_birth']      || null,
        row['religion']           || null,
        row['civil_status']       || null,
        row['landline']           || null,
        row['mobile']             || '',
        row['email']              || null,
        row['address']            || null,
        row['specialization']     || '',
        row['sub_specialization'] || null,
        row['hospital']           || '',
        row['office']             || '',
        row['license_number']     || null,
        parseInt(row['years_experience']) || null,
        row['medical_school']     || null,
        'OUT'
      ]

      db.query(sql, vals, (err2) => {
        if (err2) errors.push(`Row ${i + 2}: ${err2.message}`)
        else imported++
        processRow(i + 1)
      })
    })
  }

  processRow(0)
})

// ── ADD DOCTOR (manual) ────────────────────────────────────
app.post('/doctors', uploadPhoto.single('photo'), (req, res) => {
  const {
    first_name, last_name, middle_name, name_extension, gender,
    date_of_birth, religion, civil_status, landline, mobile, email,
    address, specialization, sub_specialization, hospital, office,
    license_number, years_experience, medical_school, status
  } = req.body
  const photo_url = req.file ? `/uploads/${req.file.filename}` : null

  generateDoctorId((err, doctor_id) => {
    if (err) return res.status(500).json({ message: 'Failed to generate doctor ID.' })

    const sql = `
      INSERT INTO doctors
        (doctor_id, first_name, last_name, middle_name, name_extension, gender,
         date_of_birth, religion, civil_status, landline, mobile, email, address,
         specialization, sub_specialization, hospital, office, license_number,
         years_experience, medical_school, status, photo_url)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`

    const values = [
      doctor_id, first_name, last_name,
      middle_name || null, name_extension || null, gender,
      date_of_birth || null, religion || null, civil_status || null,
      landline || null, mobile, email || null, address || null,
      specialization, sub_specialization || null, hospital, office,
      license_number || null, years_experience || null,
      medical_school || null, status || 'IN', photo_url
    ]

    db.query(sql, values, (err, result) => {
      if (err) return res.status(500).json({ message: 'Failed to add doctor.' })
      db.query('SELECT * FROM doctors WHERE id = ?', [result.insertId], (err2, rows) => {
        if (err2) return res.status(500).json({ message: 'Doctor added but could not fetch record.' })
        res.status(201).json({ message: 'Doctor added successfully!', doctor: rows[0] })
      })
    })
  })
})

app.get('/doctors/:id', (req, res) => {
  db.query('SELECT * FROM doctors WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Failed to fetch doctor.' })
    if (results.length === 0) return res.status(404).json({ message: 'Doctor not found.' })
    res.json(results[0])
  })
})

// ── UPDATE DOCTOR ──────────────────────────────────────────
app.put('/doctors/:id', uploadPhoto.single('photo'), (req, res) => {
  const {
    first_name, last_name, middle_name, name_extension, gender,
    date_of_birth, religion, civil_status, landline, mobile, email,
    address, specialization, sub_specialization, hospital, office,
    license_number, years_experience, medical_school, status
  } = req.body

  let sql = `
    UPDATE doctors SET
      first_name=?, last_name=?, middle_name=?, name_extension=?, gender=?,
      date_of_birth=?, religion=?, civil_status=?, landline=?, mobile=?, email=?,
      address=?, specialization=?, sub_specialization=?, hospital=?, office=?,
      license_number=?, years_experience=?, medical_school=?, status=?`

  const values = [
    first_name, last_name,
    middle_name || null, name_extension || null, gender,
    date_of_birth || null, religion || null, civil_status || null,
    landline || null, mobile, email || null, address || null,
    specialization, sub_specialization || null, hospital, office,
    license_number || null, years_experience || null,
    medical_school || null, status || 'IN'
  ]

  if (req.file) { sql += ', photo_url=?'; values.push(`/uploads/${req.file.filename}`) }
  sql += ' WHERE id=?'
  values.push(req.params.id)

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ message: 'Failed to update doctor.' })
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Doctor not found.' })
    db.query('SELECT * FROM doctors WHERE id = ?', [req.params.id], (err2, rows) => {
      res.json({ message: 'Doctor updated!', doctor: rows[0] })
    })
  })
})

// ── DELETE DOCTOR ──────────────────────────────────────────
app.delete('/doctors/:id', (req, res) => {
  db.query('DELETE FROM doctors WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Failed to delete doctor.' })
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Doctor not found.' })
    res.json({ message: 'Doctor deleted.' })
  })
})

// ══════════════════════════════════════════════════════
//  PATIENTS ROUTES
// ══════════════════════════════════════════════════════

app.get('/patients', (req, res) => {
  db.query('SELECT * FROM patients ORDER BY created_at DESC', (err, results) => {
    if (err) return res.status(500).json({ message: 'Failed to fetch patients.' })
    res.json(results)
  })
})

app.get('/patients/search', (req, res) => {
  const { q } = req.query
  if (!q) return res.json([])
  const term = `%${q}%`
  db.query(
    `SELECT * FROM patients WHERE first_name LIKE ? OR last_name LIKE ? OR mobile LIKE ? OR email LIKE ? LIMIT 10`,
    [term, term, term, term],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Search failed.' })
      res.json(results)
    }
  )
})

app.get('/patients/:id', (req, res) => {
  db.query('SELECT * FROM patients WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Failed to fetch patient.' })
    if (results.length === 0) return res.status(404).json({ message: 'Patient not found.' })
    res.json(results[0])
  })
})

app.post('/patients', (req, res) => {
  const { last_name, first_name, middle_name, name_extension, gender, date_of_birth, age, religion, landline, mobile, email } = req.body
  generatePatientId((err, patient_id) => {
    if (err) return res.status(500).json({ message: 'Failed to generate patient ID.' })
    const sql = `INSERT INTO patients (patient_id,last_name,first_name,middle_name,name_extension,gender,date_of_birth,age,religion,landline,mobile,email) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`
    const values = [patient_id,last_name,first_name,middle_name||null,name_extension||null,gender||null,date_of_birth||null,age||null,religion||null,landline||null,mobile||null,email||null]
    db.query(sql, values, (err, result) => {
      if (err) return res.status(500).json({ message: 'Failed to add patient.' })
      db.query('SELECT * FROM patients WHERE id = ?', [result.insertId], (err2, rows) => {
        res.status(201).json({ message: 'Patient added!', patient: rows[0] })
      })
    })
  })
})

// ══════════════════════════════════════════════════════
//  APPOINTMENTS ROUTES
// ══════════════════════════════════════════════════════

app.get('/appointments', (req, res) => {
  db.query('SELECT * FROM appointments ORDER BY created_at DESC', (err, results) => {
    if (err) return res.status(500).json({ message: 'Failed to fetch appointments.' })
    res.json(results)
  })
})

app.get('/appointments/:id', (req, res) => {
  db.query('SELECT * FROM appointments WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Failed to fetch appointment.' })
    if (results.length === 0) return res.status(404).json({ message: 'Appointment not found.' })
    res.json(results[0])
  })
})

app.post('/appointments', (req, res) => {
  const {
    patient_id, patient_type, last_name, first_name, middle_name, name_extension,
    gender, date_of_birth, age, religion, landline, mobile, email,
    doctor, appointment_date, appointment_time, condition_notes, note
  } = req.body

  generateAppointmentId((err, appointment_id) => {
    if (err) return res.status(500).json({ message: 'Failed to generate appointment ID.' })

    const sql = `
      INSERT INTO appointments
        (appointment_id, patient_id, patient_type, last_name, first_name, middle_name,
         name_extension, gender, date_of_birth, age, religion, landline, mobile, email,
         doctor, appointment_date, appointment_time, condition_notes, note, status)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`

    const values = [
      appointment_id, patient_id || null, patient_type || 'new',
      last_name, first_name, middle_name || null, name_extension || null,
      gender || null, date_of_birth || null, age || null, religion || null,
      landline || null, mobile || null, email || null,
      doctor || null, appointment_date || null, appointment_time || null,
      condition_notes || null, note || null, 'waiting'
    ]

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error('Appointment insert error:', err)
        return res.status(500).json({ message: 'Failed to create appointment.' })
      }

      // Auto-create patient record for new patients
      if (patient_type === 'new') {
        generatePatientId((err2, pid) => {
          if (!err2) {
            db.query(
              `INSERT INTO patients (patient_id,last_name,first_name,middle_name,name_extension,gender,date_of_birth,age,religion,landline,mobile,email) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
              [pid,last_name,first_name,middle_name||null,name_extension||null,gender||null,date_of_birth||null,age||null,religion||null,landline||null,mobile||null,email||null],
              () => {}
            )
          }
        })
      }

      db.query('SELECT * FROM appointments WHERE id = ?', [result.insertId], (err2, rows) => {
        res.status(201).json({ message: 'Appointment created!', appointment: rows[0] })
      })
    })
  })
})

app.put('/appointments/:id/status', (req, res) => {
  const { status } = req.body
  db.query('UPDATE appointments SET status = ? WHERE id = ?', [status, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Failed to update status.' })
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Appointment not found.' })
    res.json({ message: `Appointment marked as ${status}.` })
  })
})

app.delete('/appointments/:id', (req, res) => {
  db.query('DELETE FROM appointments WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Failed to delete appointment.' })
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Appointment not found.' })
    res.json({ message: 'Appointment deleted.' })
  })
})

// ✅ Listen on all network interfaces so phone + admin can both connect
app.listen(8000, '0.0.0.0', () => console.log('🚀 Backend running on http://0.0.0.0:8000'))