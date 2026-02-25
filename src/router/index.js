import { createRouter, createWebHistory } from 'vue-router'
import App from '../App.vue'
import Dashboard from '../components/Dashboard.vue'
import Appointments from '../components/Appointments.vue'
import MedicalRecords from '../components/MedicalRecords.vue'
import Patients from '../components/Patients.vue'
import AddingDoctor from '../components/AddingDoctor.vue'
import BookAppointment  from '../components/BookAppointment.vue'
import AllAppointments  from '../components/AllAppointments.vue'
import Queue            from '../components/Queue.vue'
import EditProfile from '../components/EditProfile.vue'
import PatientRecord from '../components/Patientrecord.vue'
import Schedule from '../components/Schedule.vue'
import DoctorAccess from '../components/DoctorAccess.vue'
import SMSBlast from '../components/SMSBlast.vue'

// ── meta flags ───────────────────────────────────────────
// requiresAuth: true  → must be logged in
// adminOnly: true     → role === 'admin' only, blocks doctors hard
// permKey: 'xxx'      → doctor must have this specific permission key

const routes = [
  // ── Public ────────────────────────────────────────────
  {
    path: '/',
    component: App
  },

  // ── Shared (all logged-in users) ──────────────────────
  {
    path: '/dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/schedule',
    name: 'Schedule',
    component: Schedule,
    meta: { requiresAuth: true }
  },
  {
    path: '/edit-profile',
    component: EditProfile,
    meta: { requiresAuth: true }
  },

  // ── Appointments (permission-gated for doctors) ───────
  {
    path: '/appointments',
    component: Appointments,
    meta: { requiresAuth: true }
  },
  {
    path: '/appointments/book',
    component: BookAppointment,
    meta: { requiresAuth: true, permKey: 'book_appointment' }
  },
  {
    path: '/appointments/all',
    component: AllAppointments,
    meta: { requiresAuth: true, permKey: 'view_appointments' }
  },
  {
    path: '/appointments/queue',
    component: Queue,
    meta: { requiresAuth: true, permKey: 'view_queue' }
  },

  // ── Medical Records (permission-gated for doctors) ────
  {
    path: '/medical-records',
    component: MedicalRecords,
    meta: { requiresAuth: true, permKey: 'view_medical_records' }
  },
  {
    path: '/medical-records/:id',
    name: 'Patientrecord',
    component: PatientRecord,
    meta: { requiresAuth: true, permKey: 'view_patient_profile' }
  },

  // ── Patients (permission-gated for doctors) ───────────
  {
    path: '/patients',
    component: Patients,
    meta: { requiresAuth: true, permKey: 'view_patients' }
  },

  // ── Admin-only — doctors are hard-blocked ─────────────
  {
    path: '/adding-doctor',
    component: AddingDoctor,
    meta: { requiresAuth: true, adminOnly: true }
  },
  {
    path: '/doctor-access',
    name: 'DoctorAccess',
    component: DoctorAccess,
    meta: { requiresAuth: true, adminOnly: true }
  },
  {
    path: '/sms-blast',
    name: 'SMSBlast',
    component: SMSBlast,
    meta: { requiresAuth: true, adminOnly: true }
  },

  // ── Catch-all ─────────────────────────────────────────
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// ══════════════════════════════════════════════════════════
//  GLOBAL NAVIGATION GUARD
//  Runs before EVERY route change including direct URL entry
// ══════════════════════════════════════════════════════════
router.beforeEach((to, from, next) => {
  const role       = localStorage.getItem('role')   // 'admin' | 'doctor' | null
  const user       = localStorage.getItem('user')
  const isLoggedIn = !!user && !!role
  const isAdmin    = role === 'admin'
  const isDoctor   = role === 'doctor'

  // 1️⃣ Route requires login but user is not logged in → login page
  if (to.meta.requiresAuth && !isLoggedIn) {
    return next('/')
  }

  // 2️⃣ Already logged in, trying to visit login page → dashboard
  if (to.path === '/' && isLoggedIn) {
    return next('/dashboard')
  }

  // 3️⃣ Admin-only route → doctors are redirected away, always
  if (to.meta.adminOnly && isDoctor) {
    return next('/dashboard')
  }

  // 4️⃣ Permission-gated route → check doctor's stored permissions
  if (to.meta.permKey && isDoctor) {
    let perms = {}
    try {
      perms = JSON.parse(localStorage.getItem('doctorPermissions') || '{}')
    } catch {}
    if (!perms[to.meta.permKey]) {
      return next('/dashboard')
    }
  }

  // ✅ All checks passed — allow navigation
  next()
})

export default router