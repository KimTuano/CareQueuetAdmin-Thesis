<template>
  <div class="layout">
    <!-- ── SIDEBAR ── -->
    <aside :class="['sidebar', { collapsed: sidebarCollapsed }]">
      <div class="sidebar-logo">
        <img src="../assets/CareQueueLogo.svg" alt="CareQueue" class="sidebar-logo-img" />
      </div>
      <nav class="sidebar-nav">

        <router-link
          v-if="isAdmin || doctorCan('view_dashboard')"
          to="/dashboard" class="nav-item" active-class="active">
          <span class="nav-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
          </span>
          <span class="nav-label">Dashboard</span>
        </router-link>

        <router-link
          v-if="isAdmin || doctorCan('view_schedule')"
          to="/schedule" class="nav-item" active-class="active">
          <span class="nav-icon"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg></span>
          <span class="nav-label">Schedule</span>
        </router-link>

        <template v-if="isAdmin || doctorCan('book_appointment') || doctorCan('view_appointments') || doctorCan('view_queue')">
          <div class="nav-item nav-dropdown" :class="{ open: appointmentsOpen }" @click="appointmentsOpen = !appointmentsOpen">
            <span class="nav-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </span>
            <span class="nav-label">Appointments</span>
            <svg class="nav-arrow" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </div>
          <div class="nav-sub" v-show="appointmentsOpen">
            <router-link v-if="isAdmin || doctorCan('book_appointment')" to="/appointments/book" class="nav-sub-item" active-class="active">Book Appointment</router-link>
            <router-link v-if="isAdmin || doctorCan('view_appointments')" to="/appointments/all" class="nav-sub-item" active-class="active">All Appointments</router-link>
            <router-link v-if="isAdmin || doctorCan('view_queue')" to="/appointments/queue" class="nav-sub-item" active-class="active">Queue</router-link>
          </div>
        </template>

        <router-link v-if="isAdmin || doctorCan('view_medical_records')" to="/medical-records" class="nav-item" active-class="active">
          <span class="nav-icon"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg></span>
          <span class="nav-label">Medical Records</span>
        </router-link>

        <router-link v-if="isAdmin || doctorCan('view_patients')" to="/patients" class="nav-item" active-class="active">
          <span class="nav-icon"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg></span>
          <span class="nav-label">Patients</span>
        </router-link>

        <router-link v-if="isAdmin" to="/adding-doctor" class="nav-item" active-class="active">
          <span class="nav-icon"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg></span>
          <span class="nav-label">Doctors List</span>
        </router-link>

        <router-link v-if="isAdmin" to="/doctor-access" class="nav-item" active-class="active">
          <span class="nav-icon"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg></span>
          <span class="nav-label">Access Control</span>
        </router-link>

        <router-link v-if="isAdmin" to="/sms-blast" class="nav-item" active-class="active">
          <span class="nav-icon"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg></span>
          <span class="nav-label">SMS Blast</span>
        </router-link>

        <div v-if="!isAdmin" class="role-tag">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
          <span class="nav-label">Doctor Account</span>
        </div>

      </nav>
    </aside>

    <!-- ── MAIN ── -->
    <div class="main-wrapper">

      <!-- TOPBAR -->
      <header class="topbar">
        <div class="topbar-left">
          <button class="hamburger" @click="sidebarCollapsed = !sidebarCollapsed">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>

        <div class="topbar-right">
          <div class="topbar-btn notif-wrapper" @click="notifOpen = !notifOpen" v-click-outside="() => notifOpen = false">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
            <span class="notif-badge">3</span>
            <div class="dropdown notif-dropdown" v-show="notifOpen" @click.stop>
              <div class="dropdown-header"><span>Notifications</span><a href="#" class="mark-read">Mark all read</a></div>
              <div class="notif-item unread"><div class="notif-dot"></div><div><p class="notif-title">New appointment booked</p><p class="notif-time">2 minutes ago</p></div></div>
              <div class="notif-item unread"><div class="notif-dot"></div><div><p class="notif-title">Dr. Yambao is now available</p><p class="notif-time">15 minutes ago</p></div></div>
              <div class="notif-item unread"><div class="notif-dot"></div><div><p class="notif-title">Patient queue updated</p><p class="notif-time">1 hour ago</p></div></div>
              <div class="notif-item"><div class="notif-dot read"></div><div><p class="notif-title">Medical record updated</p><p class="notif-time">Yesterday</p></div></div>
            </div>
          </div>

          <div class="account-wrapper" @click="accountOpen = !accountOpen" v-click-outside="() => accountOpen = false">
            <div class="account-avatar">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
            <div class="dropdown account-dropdown" v-show="accountOpen" @click.stop>
              <div class="dropdown-header account-info">
                <p class="account-name">{{ currentUser.name }}</p>
                <p class="account-email">{{ currentUser.email }}</p>
                <span class="role-pill" :class="isAdmin ? 'admin' : 'doctor'">{{ isAdmin ? 'Admin' : 'Doctor' }}</span>
              </div>
              <hr class="dropdown-divider"/>
              <button class="dropdown-item" @click="goTo('edit-account')">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                Edit Account
              </button>
              <button class="dropdown-item" @click="goTo('settings')">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                Settings
              </button>
              <hr class="dropdown-divider"/>
              <button class="dropdown-item logout" @click="handleLogout">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- ── ACCESS DENIED ── -->
      <main v-if="!canAccess" class="content">
        <div class="access-denied">
          <div class="access-denied-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
          </div>
          <h2 class="access-denied-title">Access Restricted</h2>
          <p class="access-denied-msg">You don't have permission to view All Appointments. Please contact your administrator to request access.</p>
        </div>
      </main>

      <!-- ── PAGE CONTENT ── -->
      <main v-else class="content">
        <div class="page-header">
          <h1 class="page-title">All Appointments</h1>
          <p class="breadcrumb">Appointments / All Appointments</p>
        </div>

        <div class="table-card">
          <!-- ── LOADING / ERROR states ── -->
          <div v-if="loadingAppointments" class="state-box">
            <div class="spinner"></div>
            <p>Loading appointments…</p>
          </div>
          <div v-else-if="fetchError" class="state-box error-box">
            <p>⚠️ {{ fetchError }}</p>
            <button class="retry-btn" @click="fetchAppointments">Retry</button>
          </div>

          <!-- ── TABLE ── -->
          <template v-else>
            <div class="toolbar">
              <div class="toolbar-left">
                <div class="search-box">
                  <input type="text" v-model="searchId" placeholder="Search ID" class="search-input" />
                  <button class="search-btn"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg></button>
                </div>
                <div class="search-box">
                  <input type="text" v-model="searchName" placeholder="Search Name" class="search-input" />
                  <button class="search-btn"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg></button>
                </div>
              </div>
              <!-- Refresh button -->
              <button class="refresh-btn" @click="fetchAppointments" title="Refresh">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                Refresh
              </button>
            </div>

            <table class="records-table">
              <thead>
                <tr>
                  <th>Appt ID</th>
                  <th>Name</th>
                  <th>Doctor</th>
                  <th>Mobile</th>
                  <th>Date &amp; Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="appt in filteredAppointments" :key="appt.id">
                  <td>{{ appt.appointment_id }}</td>
                  <td>{{ appt.first_name }} {{ appt.last_name }}</td>
                  <td>{{ appt.doctor || '—' }}</td>
                  <td>{{ appt.mobile || '—' }}</td>
                  <td class="date-cell">
                    {{ formatDate(appt.appointment_date) }}
                    <span v-if="appt.appointment_time"> · {{ formatTime(appt.appointment_time) }}</span>
                  </td>
                  <td>
                    <span class="status-badge" :class="appt.status">{{ appt.status }}</span>
                  </td>
                  <td>
                    <div class="action-btns">
                      <template v-if="isAdmin || doctorCan('manage_appointments')">
                        <button class="btn-arrive" @click="updateStatus(appt, 'arrived')">Arrive</button>
                        <button class="btn-approve" @click="updateStatus(appt, 'approved')">Approve</button>
                        <button class="btn-cancel" @click="cancelAppt(appt)">Cancel</button>
                      </template>
                      <span v-else class="badge-view-only">View Only</span>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredAppointments.length === 0">
                  <td colspan="7" class="empty-row">No appointments found.</td>
                </tr>
              </tbody>
            </table>

            <div class="pagination">
              <button class="page-btn" :disabled="currentPage === 1" @click="currentPage--">‹</button>
              <button v-for="p in totalPages" :key="p" class="page-btn" :class="{ active: p === currentPage }" @click="currentPage = p">{{ p }}</button>
              <button class="page-btn" :disabled="currentPage === totalPages" @click="currentPage++">›</button>
            </div>
          </template>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8000'

export default {
  name: 'AllAppointments',
  directives: {
    'click-outside': {
      mounted(el, binding) {
        el._clickOutside = (e) => { if (!el.contains(e.target)) binding.value(e) }
        document.addEventListener('click', el._clickOutside)
      },
      unmounted(el) { document.removeEventListener('click', el._clickOutside) }
    }
  },
  data() {
    return {
      sidebarCollapsed: false,
      notifOpen: false,
      accountOpen: false,
      appointmentsOpen: true,
      searchId: '',
      searchName: '',
      currentPage: 1,
      perPage: 11,

      // ── Appointment data from server ──────────────────────────
      appointments: [],
      loadingAppointments: false,
      fetchError: null,

      // ── Permission system ─────────────────────────────────────
      currentUser: JSON.parse(localStorage.getItem('user')) || { name: 'Admin', email: '' },
      livePerms: JSON.parse(localStorage.getItem('doctorPermissions') || '{}'),
    }
  },

  computed: {
    isAdmin() {
      return localStorage.getItem('role') === 'admin'
    },
    canAccess() {
      return this.isAdmin || this.doctorCan('view_appointments')
    },
    filtered() {
      let list = this.appointments
      if (this.searchId)   list = list.filter(a => String(a.appointment_id ?? a.id).toLowerCase().includes(this.searchId.toLowerCase()))
      if (this.searchName) list = list.filter(a => `${a.first_name} ${a.last_name}`.toLowerCase().includes(this.searchName.toLowerCase()))
      return list
    },
    filteredAppointments() {
      const start = (this.currentPage - 1) * this.perPage
      return this.filtered.slice(start, start + this.perPage)
    },
    totalPages() {
      return Math.max(1, Math.ceil(this.filtered.length / this.perPage))
    }
  },

  mounted() {
    // ── Fetch appointments as soon as the page loads ──────────
    if (this.canAccess) {
      this.fetchAppointments()
    }
  },

  methods: {
    doctorCan(key) { return !!this.livePerms[key] },

    // ── FETCH all appointments from backend ───────────────────
    async fetchAppointments() {
      this.loadingAppointments = true
      this.fetchError = null
      try {
        const res = await fetch(`${API_BASE}/appointments`)
        if (!res.ok) throw new Error(`Server error: ${res.status}`)
        this.appointments = await res.json()
      } catch (err) {
        console.error('Failed to fetch appointments:', err)
        this.fetchError = err.message || 'Could not load appointments.'
      } finally {
        this.loadingAppointments = false
      }
    },

    // ── UPDATE appointment status (arrive / approve) ──────────
    async updateStatus(appt, newStatus) {
      try {
        const res = await fetch(`${API_BASE}/appointments/${appt.id}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus })
        })
        if (!res.ok) throw new Error('Failed to update status')
        // Update locally so UI reflects change immediately
        appt.status = newStatus
      } catch (err) {
        alert('Error: ' + err.message)
      }
    },

    // ── CANCEL appointment ────────────────────────────────────
    async cancelAppt(appt) {
      if (!confirm(`Cancel appointment for ${appt.first_name} ${appt.last_name}?`)) return
      try {
        const res = await fetch(`${API_BASE}/appointments/${appt.id}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'cancelled' })
        })
        if (!res.ok) throw new Error('Failed to cancel')
        appt.status = 'cancelled'
      } catch (err) {
        alert('Error: ' + err.message)
      }
    },

    // ── FORMAT helpers ────────────────────────────────────────
    formatDate(dateStr) {
      if (!dateStr) return '—'
      const d = new Date(dateStr)
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    },
    formatTime(timeStr) {
      if (!timeStr) return ''
      // timeStr comes as "HH:MM:SS" from MySQL
      const [h, m] = timeStr.split(':').map(Number)
      const period = h >= 12 ? 'PM' : 'AM'
      const hour = h % 12 || 12
      return `${hour}:${String(m).padStart(2, '0')} ${period}`
    },

    goTo(page) {
      this.accountOpen = false
      if (page === 'edit-account') this.$router.push('/edit-profile')
      if (page === 'settings') alert('Settings coming soon')
    },
    handleLogout() {
      localStorage.removeItem('user')
      localStorage.removeItem('role')
      localStorage.removeItem('doctorPermissions')
      this.$router.push('/')
    },
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
.layout { display: flex; min-height: 100vh; font-family: 'Plus Jakarta Sans', sans-serif; background: #f0f4f8; }

.sidebar { width: 220px; min-height: 100vh; background: #1b2540; display: flex; flex-direction: column; transition: width 0.3s; overflow: hidden; flex-shrink: 0; }
.sidebar.collapsed { width: 64px; }
.sidebar.collapsed .sidebar-logo-text, .sidebar.collapsed .nav-label, .sidebar.collapsed .nav-arrow, .sidebar.collapsed .nav-sub { display: none; }
.sidebar-logo { display: flex; align-items: center; justify-content: center; border-bottom: 1px solid rgba(255,255,255,0.07); margin-bottom: -12px; }
.sidebar-logo-img { width: 60%; height: 60%; border-radius: 10px; object-fit: cover; background: white; padding: 2px; transition: width 0.3s ease, height 0.3s ease; }
.sidebar.collapsed .sidebar-logo-img { margin-top: 5px; margin-bottom: 5px; width: 40px; height: 40px; }
.sidebar-nav { padding: 12px 0; flex: 1; }
.nav-item { display: flex; align-items: center; gap: 12px; padding: 11px 16px; color: #94a3b8; text-decoration: none; font-size: 13.5px; font-weight: 500; cursor: pointer; transition: all 0.2s; border-left: 3px solid transparent; white-space: nowrap; }
.nav-item:hover { color: white; background: rgba(255,255,255,0.06); }
.nav-item.active { color: white; background: rgba(58,166,166,0.15); border-left-color: #3aa6a6; }
.nav-icon { flex-shrink: 0; display: flex; }
.nav-arrow { margin-left: auto; transition: transform 0.3s; }
.nav-dropdown.open .nav-arrow { transform: rotate(180deg); }
.nav-sub { padding-left: 46px; background: rgba(0,0,0,0.15); }
.nav-sub-item { display: block; padding: 9px 12px; color: #94a3b8; text-decoration: none; font-size: 13px; transition: color 0.2s; white-space: nowrap; }
.nav-sub-item:hover, .nav-sub-item.active { color: #3aa6a6; }
.role-tag { display: flex; align-items: center; gap: 8px; padding: 10px 16px; color: #64748b; font-size: 12px; font-weight: 500; margin-top: auto; border-top: 1px solid rgba(255,255,255,0.06); }

.main-wrapper { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.topbar { height: 60px; background: #3aa6a6; display: flex; align-items: center; justify-content: space-between; padding: 0 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); position: sticky; top: 0; z-index: 100; }
.hamburger { background: none; border: none; cursor: pointer; color: #ffffff; display: flex; padding: 6px; border-radius: 8px; transition: background 0.2s; }
.hamburger:hover { background: rgba(255,255,255,0.15); }
.topbar-right { display: flex; align-items: center; gap: 8px; }
.topbar-btn { position: relative; background: none; border: none; cursor: pointer; color: #ffffff; padding: 8px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
.topbar-btn:hover { background: rgba(255,255,255,0.15); }
.notif-badge { position: absolute; top: 4px; right: 4px; background: #ef4444; color: white; font-size: 9px; font-weight: 700; width: 16px; height: 16px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; }
.notif-wrapper { position: relative; }

.dropdown { position: absolute; top: calc(100% + 10px); right: 0; background: white; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.12); z-index: 200; overflow: hidden; animation: fadeDown 0.15s ease; }
@keyframes fadeDown { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
.dropdown-header { padding: 14px 16px; display: flex; justify-content: space-between; align-items: center; font-weight: 600; font-size: 13px; color: #1e293b; border-bottom: 1px solid #f1f5f9; }
.mark-read { font-size: 11px; color: #3aa6a6; text-decoration: none; font-weight: 500; }
.notif-dropdown { width: 300px; }
.notif-item { display: flex; align-items: flex-start; gap: 12px; padding: 12px 16px; cursor: pointer; transition: background 0.15s; }
.notif-item:hover { background: #f8fafc; }
.notif-item.unread { background: #f0fafa; }
.notif-dot { width: 8px; height: 8px; border-radius: 50%; background: #3aa6a6; margin-top: 5px; flex-shrink: 0; }
.notif-dot.read { background: #cbd5e1; }
.notif-title { font-size: 13px; color: #1e293b; font-weight: 500; }
.notif-time { font-size: 11px; color: #94a3b8; margin-top: 2px; }
.account-wrapper { position: relative; cursor: pointer; }
.account-avatar { width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.25); display: flex; align-items: center; justify-content: center; color: white; transition: background 0.2s; }
.account-wrapper:hover .account-avatar { background: rgba(255,255,255,0.35); }
.account-dropdown { width: 220px; }
.account-info { flex-direction: column; align-items: flex-start; gap: 2px; }
.account-name { font-size: 13px; font-weight: 600; color: #1e293b; }
.account-email { font-size: 11px; color: #94a3b8; }
.dropdown-divider { border: none; border-top: 1px solid #f1f5f9; }
.dropdown-item { display: flex; align-items: center; gap: 10px; width: 100%; padding: 11px 16px; background: none; border: none; text-align: left; font-size: 13px; color: #475569; cursor: pointer; font-family: inherit; transition: background 0.15s; }
.dropdown-item:hover { background: #f8fafc; color: #1e293b; }
.dropdown-item.logout { color: #ef4444; }
.dropdown-item.logout:hover { background: #fff5f5; }
.role-pill { display: inline-block; padding: 2px 10px; border-radius: 999px; font-size: 11px; font-weight: 600; margin-top: 4px; }
.role-pill.admin  { background: #e0f2f1; color: #00796b; }
.role-pill.doctor { background: #e8eaf6; color: #3949ab; }

.access-denied { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; text-align: center; gap: 16px; }
.access-denied-icon { width: 96px; height: 96px; border-radius: 50%; background: #fef2f2; display: flex; align-items: center; justify-content: center; color: #ef4444; }
.access-denied-title { font-size: 20px; font-weight: 700; color: #1e293b; }
.access-denied-msg { font-size: 14px; color: #64748b; max-width: 380px; line-height: 1.6; }

.content { padding: 28px; flex: 1; }
.page-title { font-size: 22px; font-weight: 700; color: #1e293b; }
.breadcrumb { font-size: 12px; color: #94a3b8; margin-top: 2px; }
.page-header { margin-bottom: 20px; }

.table-card { background: white; border-radius: 16px; padding: 24px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
.toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.toolbar-left { display: flex; gap: 12px; }
.search-box { display: flex; align-items: center; border: 1.5px solid #e2e8f0; border-radius: 8px; overflow: hidden; }
.search-box:focus-within { border-color: #3aa6a6; }
.search-input { padding: 8px 12px; border: none; outline: none; font-size: 13px; color: #475569; font-family: inherit; width: 160px; }
.search-btn { padding: 8px 12px; background: #3aa6a6; border: none; cursor: pointer; color: white; display: flex; align-items: center; }
.search-btn:hover { background: #2e8b8b; }
.refresh-btn { display: flex; align-items: center; gap: 6px; padding: 8px 14px; background: #f1f5f9; border: 1.5px solid #e2e8f0; border-radius: 8px; font-size: 13px; color: #475569; cursor: pointer; font-family: inherit; transition: all 0.2s; }
.refresh-btn:hover { background: #3aa6a6; color: white; border-color: #3aa6a6; }

/* Loading / Error states */
.state-box { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px; gap: 16px; color: #94a3b8; font-size: 14px; }
.error-box { color: #ef4444; }
.spinner { width: 32px; height: 32px; border: 3px solid #e2e8f0; border-top-color: #3aa6a6; border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.retry-btn { padding: 8px 20px; background: #3aa6a6; color: white; border: none; border-radius: 8px; cursor: pointer; font-family: inherit; font-size: 13px; }

.records-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
.records-table th { text-align: left; padding: 10px 16px; color: #64748b; font-weight: 600; font-size: 13px; border-bottom: 2px solid #f1f5f9; }
.records-table td { padding: 11px 16px; color: #475569; border-bottom: 1px solid #f8fafc; }
.records-table tr:hover td { background: #f8fafc; }
.date-cell { color: #475569; }

/* Status badge */
.status-badge { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 11px; font-weight: 600; text-transform: capitalize; }
.status-badge.waiting    { background: #fef9c3; color: #854d0e; }
.status-badge.approved   { background: #dcfce7; color: #166534; }
.status-badge.arrived    { background: #dbeafe; color: #1e40af; }
.status-badge.cancelled  { background: #fee2e2; color: #991b1b; }
.status-badge.completed  { background: #f3f4f6; color: #374151; }

.action-btns { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
.btn-arrive  { padding: 5px 12px; background: white; color: #3aa6a6; border: 1.5px solid #3aa6a6; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.2s; }
.btn-arrive:hover  { background: #3aa6a6; color: white; }
.btn-approve { padding: 5px 12px; background: white; color: #16a34a; border: 1.5px solid #16a34a; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.2s; }
.btn-approve:hover { background: #16a34a; color: white; }
.btn-cancel  { padding: 5px 12px; background: white; color: #ef4444; border: 1.5px solid #ef4444; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.2s; }
.btn-cancel:hover  { background: #ef4444; color: white; }
.badge-view-only { display: inline-block; padding: 4px 12px; background: #f1f5f9; color: #94a3b8; border-radius: 6px; font-size: 11px; font-weight: 600; }

.empty-row { text-align: center; color: #94a3b8; padding: 60px; font-size: 14px; }

.pagination { display: flex; justify-content: center; gap: 6px; margin-top: 20px; padding-top: 16px; border-top: 1px solid #f1f5f9; }
.page-btn { padding: 6px 12px; border: 1.5px solid #e2e8f0; background: white; border-radius: 6px; font-size: 13px; color: #475569; cursor: pointer; font-family: inherit; transition: all 0.2s; }
.page-btn:hover:not(:disabled) { border-color: #3aa6a6; color: #3aa6a6; }
.page-btn.active { background: #3aa6a6; color: white; border-color: #3aa6a6; }
.page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
</style>