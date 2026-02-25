<template>
  <div class="layout">

    <!-- ── SIDEBAR ── -->
    <aside :class="['sidebar', { collapsed: sidebarCollapsed }]">
      <div class="sidebar-logo">
        <img src="../assets/CareQueueLogo.svg" alt="CareQueue" class="sidebar-logo-img" />
      </div>
      <nav class="sidebar-nav">

        <router-link v-if="isAdmin || doctorCan('view_dashboard')" to="/dashboard" class="nav-item" active-class="active">
          <span class="nav-icon"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg></span>
          <span class="nav-label">Dashboard</span>
        </router-link>

        <router-link v-if="isAdmin || doctorCan('view_schedule')" to="/schedule" class="nav-item" active-class="active">
          <span class="nav-icon"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg></span>
          <span class="nav-label">Schedule</span>
        </router-link>

        <template v-if="isAdmin || doctorCan('book_appointment') || doctorCan('view_appointments') || doctorCan('view_queue')">
          <div class="nav-item nav-dropdown" :class="{ open: appointmentsOpen }" @click="appointmentsOpen = !appointmentsOpen">
            <span class="nav-icon"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></span>
            <span class="nav-label">Appointments</span>
            <svg class="nav-arrow" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
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
            <span class="notif-badge" v-if="waitingCount > 0">{{ waitingCount }}</span>
            <div class="dropdown notif-dropdown" v-show="notifOpen" @click.stop>
              <div class="dropdown-header">
                <span>Notifications</span>
                <a href="#" class="mark-read">Mark all read</a>
              </div>
              <div v-if="waitingCount > 0" class="notif-item unread">
                <div class="notif-dot"></div>
                <div><p class="notif-title">{{ waitingCount }} appointment(s) waiting</p><p class="notif-time">Pending approval</p></div>
              </div>
              <div v-if="doctorsIN > 0" class="notif-item unread">
                <div class="notif-dot"></div>
                <div><p class="notif-title">{{ doctorsIN }} doctor(s) currently IN</p><p class="notif-time">Available now</p></div>
              </div>
              <div class="notif-item">
                <div class="notif-dot read"></div>
                <div><p class="notif-title">{{ totalDoctors }} total doctors registered</p><p class="notif-time">In the system</p></div>
              </div>
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
              <button class="dropdown-item" @click="goTo('edit-profile')">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                Edit Account
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
          <p class="access-denied-msg">You don't have permission to view the Dashboard. Please contact your administrator to request access.</p>
        </div>
      </main>

      <!-- ── PAGE CONTENT ── -->
      <main v-else class="content">
        <div class="page-header">
          <h1 class="page-title">DASHBOARD</h1>
          <p class="breadcrumb">Home / Dashboard</p>
        </div>

        <!-- Profile Card -->
        <div class="profile-card">
          <div class="profile-avatar">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
          </div>
          <div class="profile-info">
            <h2>{{ currentUser.name }}</h2>
            <p>Email: {{ currentUser.email }}</p>
            <span class="profile-role-pill" :class="isAdmin ? 'admin' : 'doctor'">{{ isAdmin ? 'Admin' : 'Doctor' }}</span>
          </div>
          <div class="profile-meta">
            <div class="meta-item">
              <span class="meta-num">{{ doctorsIN }}</span>
              <span class="meta-label">Doctors IN</span>
            </div>
            <div class="meta-divider"></div>
            <div class="meta-item">
              <span class="meta-num">{{ waitingCount }}</span>
              <span class="meta-label">Waiting</span>
            </div>
            <div class="meta-divider"></div>
            <div class="meta-item">
              <span class="meta-num">{{ completedCount }}</span>
              <span class="meta-label">Completed</span>
            </div>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon teal">
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
            </div>
            <div class="stat-info">
              <span class="stat-number">{{ totalDoctors }}</span>
              <span class="stat-label">Total Doctors</span>
            </div>
            <div class="stat-sub">
              <span class="stat-badge in">{{ doctorsIN }} IN</span>
              <span class="stat-badge out">{{ doctorsOUT }} OUT</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon purple">
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            </div>
            <div class="stat-info">
              <span class="stat-number">{{ totalPatients }}</span>
              <span class="stat-label">Total Patients</span>
            </div>
            <div class="stat-sub">
              <span class="stat-text">Registered in system</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon orange">
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
            </div>
            <div class="stat-info">
              <span class="stat-number">{{ totalAppointments }}</span>
              <span class="stat-label">Appointments</span>
            </div>
            <div class="stat-sub">
              <span class="stat-badge waiting">{{ waitingCount }} waiting</span>
            </div>
          </div>
        </div>

        <!-- Bottom Grid -->
        <div class="bottom-grid">

          <!-- Chart Card -->
          <div class="chart-card">
            <div class="chart-header">
              <h3>Appointment Status Overview</h3>
            </div>
            <div class="status-bars">
              <div class="status-bar-item" v-for="s in appointmentStats" :key="s.label">
                <div class="bar-label-row">
                  <span class="bar-label">{{ s.label }}</span>
                  <span class="bar-count">{{ s.count }}</span>
                </div>
                <div class="bar-track">
                  <div class="bar-fill" :style="{ width: barWidth(s.count) + '%', background: s.color }"></div>
                </div>
              </div>
            </div>
            <div class="chart-divider"></div>
            <div class="pie-wrapper">
              <canvas ref="pieChart" width="160" height="160"></canvas>
              <div class="pie-legend">
                <div class="legend-item" v-for="s in appointmentStats" :key="s.label">
                  <span class="dot" :style="{ background: s.color }"></span>
                  {{ s.label }} ({{ s.count }})
                </div>
              </div>
            </div>
          </div>

          <!-- ══ Available Doctors Card with Smart Pagination ══ -->
          <div class="doctors-card">
            <div class="doctors-header">
              <h3>Available Doctors</h3>
              <span class="available-count">{{ doctorsIN }} available</span>
            </div>

            <input
              type="text"
              class="search-input"
              placeholder="Search doctor or office..."
              v-model="doctorSearch"
            />

            <div v-if="loadingData" class="loading-mini">Loading...</div>

            <template v-else>
              <table class="doctors-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Office</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="pagedDoctors.length === 0">
                    <td colspan="3" class="empty-doctors">No doctors found.</td>
                  </tr>
                  <tr v-for="doc in pagedDoctors" :key="doc.id">
                    <td>Dr. {{ doc.last_name }}, {{ doc.first_name }}</td>
                    <td>{{ doc.office }}</td>
                    <td><span :class="['status-badge', doc.status === 'IN' ? 'in' : 'out']">{{ doc.status }}</span></td>
                  </tr>
                  <!-- Fill empty rows so the table height stays stable -->
                  <tr
                    v-for="i in emptyRowCount"
                    :key="'empty-' + i"
                    class="placeholder-row"
                  >
                    <td colspan="3">&nbsp;</td>
                  </tr>
                </tbody>
              </table>

              <!-- ══ SMART PAGINATION ══ -->
              <div class="doc-pagination" v-if="docTotalPages > 1">
                <button
                  class="doc-page-btn nav-btn"
                  :disabled="docCurrentPage === 1"
                  @click="docCurrentPage--"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
                </button>

                <template v-for="(item, idx) in docPaginationItems" :key="idx">
                  <span v-if="item === '...'" class="doc-ellipsis">…</span>
                  <button
                    v-else
                    class="doc-page-btn"
                    :class="{ active: item === docCurrentPage }"
                    @click="docCurrentPage = item"
                  >{{ item }}</button>
                </template>

                <button
                  class="doc-page-btn nav-btn"
                  :disabled="docCurrentPage === docTotalPages"
                  @click="docCurrentPage++"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                </button>

                <span class="doc-page-info">{{ docCurrentPage }} / {{ docTotalPages }}</span>
              </div>
              <!-- ══ END PAGINATION ══ -->

            </template>
          </div>

        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

const DOC_PER_PAGE = 7  // rows visible per page in the doctors card

export default {
  name: 'Dashboard',

  directives: {
    'click-outside': {
      mounted(el, binding) {
        el._clickOutside = (e) => { if (!el.contains(e.target)) binding.value(e) }
        document.addEventListener('click', el._clickOutside)
      },
      unmounted(el) {
        document.removeEventListener('click', el._clickOutside)
      }
    }
  },

  data() {
    return {
      sidebarCollapsed: false,
      notifOpen: false,
      accountOpen: false,
      appointmentsOpen: false,
      doctorSearch: '',
      loadingData: true,

      // Doctor-card pagination
      docCurrentPage: 1,

      currentUser: JSON.parse(localStorage.getItem('user')) || { name: 'Admin', email: '' },
      livePerms: JSON.parse(localStorage.getItem('doctorPermissions') || '{}'),

      doctors: [],
      patients: [],
      appointments: [],
      pieChartInstance: null,
    }
  },

  computed: {
    isAdmin()   { return localStorage.getItem('role') === 'admin' },
    canAccess() { return this.isAdmin || this.doctorCan('view_dashboard') },

    totalDoctors()      { return this.doctors.length },
    doctorsIN()         { return this.doctors.filter(d => d.status === 'IN').length },
    doctorsOUT()        { return this.doctors.filter(d => d.status === 'OUT').length },
    totalPatients()     { return this.patients.length },
    totalAppointments() { return this.appointments.length },
    waitingCount()      { return this.appointments.filter(a => a.status === 'waiting').length },
    completedCount()    { return this.appointments.filter(a => a.status === 'completed').length },
    cancelledCount()    { return this.appointments.filter(a => a.status === 'cancelled').length },
    approvedCount()     { return this.appointments.filter(a => a.status === 'approved').length },
    arrivedCount()      { return this.appointments.filter(a => a.status === 'arrived').length },

    appointmentStats() {
      return [
        { label: 'Waiting',   count: this.waitingCount,   color: '#f97316' },
        { label: 'Approved',  count: this.approvedCount,  color: '#3aa6a6' },
        { label: 'Arrived',   count: this.arrivedCount,   color: '#6c63ff' },
        { label: 'Completed', count: this.completedCount, color: '#16a34a' },
        { label: 'Cancelled', count: this.cancelledCount, color: '#ef4444' },
      ]
    },

    // Full filtered list (search only — no page slicing)
    filteredDoctors() {
      const q = this.doctorSearch.toLowerCase()
      return this.doctors.filter(d =>
        `${d.first_name} ${d.last_name}`.toLowerCase().includes(q) ||
        (d.office || '').toLowerCase().includes(q)
      )
    },

    // Pagination totals
    docTotalPages() {
      return Math.max(1, Math.ceil(this.filteredDoctors.length / DOC_PER_PAGE))
    },

    // The visible slice for the current page
    pagedDoctors() {
      const start = (this.docCurrentPage - 1) * DOC_PER_PAGE
      return this.filteredDoctors.slice(start, start + DOC_PER_PAGE)
    },

    // Fill remaining rows so table doesn't jump in height
    emptyRowCount() {
      return Math.max(0, DOC_PER_PAGE - this.pagedDoctors.length)
    },

    // Smart pagination items: 1 … 4 [5] 6 … 9
    docPaginationItems() {
      const total   = this.docTotalPages
      const current = this.docCurrentPage
      const delta   = 1  // neighbours on each side (compact for small card)

      if (total <= 5) {
        return Array.from({ length: total }, (_, i) => i + 1)
      }

      const items      = []
      const rangeStart = Math.max(2, current - delta)
      const rangeEnd   = Math.min(total - 1, current + delta)

      items.push(1)
      if (rangeStart > 2) items.push('...')
      for (let i = rangeStart; i <= rangeEnd; i++) items.push(i)
      if (rangeEnd < total - 1) items.push('...')
      items.push(total)

      return items
    }
  },

  watch: {
    // Reset to page 1 whenever the search changes
    doctorSearch() { this.docCurrentPage = 1 }
  },

  methods: {
    doctorCan(key) { return !!this.livePerms[key] },

    barWidth(count) {
      if (this.totalAppointments === 0) return 0
      return Math.round((count / this.totalAppointments) * 100)
    },

    async fetchAll() {
      this.loadingData = true
      try {
        const [dRes, pRes, aRes] = await Promise.all([
          fetch('http://localhost:8000/doctors'),
          fetch('http://localhost:8000/patients'),
          fetch('http://localhost:8000/appointments'),
        ])
        this.doctors      = await dRes.json()
        this.patients     = await pRes.json()
        this.appointments = await aRes.json()
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err)
      } finally {
        this.loadingData = false
        this.$nextTick(() => this.initPieChart())
      }
    },

    initPieChart() {
      if (this.pieChartInstance) {
        this.pieChartInstance.destroy()
        this.pieChartInstance = null
      }
      const ctx = this.$refs.pieChart?.getContext('2d')
      if (!ctx) return
      const stats = this.appointmentStats
      this.pieChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: stats.map(s => s.label),
          datasets: [{
            data: stats.map(s => s.count),
            backgroundColor: stats.map(s => s.color),
            borderWidth: 3,
            borderColor: '#fff'
          }]
        },
        options: {
          responsive: false,
          cutout: '65%',
          plugins: { legend: { display: false } }
        }
      })
    },

    goTo(page) {
      this.accountOpen = false
      this.$router.push('/' + page)
    },
    handleLogout() {
      localStorage.removeItem('user')
      localStorage.removeItem('role')
      localStorage.removeItem('doctorPermissions')
      this.$router.push('/')
    }
  },

  mounted() {
    this.fetchAll()
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
.layout { display: flex; min-height: 100vh; font-family: 'Plus Jakarta Sans', sans-serif; background: #f0f4f8; }

/* SIDEBAR */
.sidebar { width: 220px; min-height: 100vh; background: #1b2540; display: flex; flex-direction: column; transition: width 0.3s; overflow: hidden; flex-shrink: 0; }
.sidebar.collapsed { width: 64px; }
.sidebar.collapsed .nav-label, .sidebar.collapsed .nav-arrow, .sidebar.collapsed .nav-sub { display: none; }
.sidebar-logo { display: flex; align-items: center; justify-content: center; border-bottom: 1px solid rgba(255,255,255,0.07); margin-bottom: -12px; }
.sidebar-logo-img { width: 60%; height: 60%; border-radius: 10px; object-fit: cover; background: white; padding: 2px; }
.sidebar.collapsed .sidebar-logo-img { margin: 5px; width: 40px; height: 40px; }
.sidebar-nav { padding: 12px 0; flex: 1; }
.nav-item { display: flex; align-items: center; gap: 12px; padding: 11px 16px; color: #94a3b8; text-decoration: none; font-size: 13.5px; font-weight: 500; cursor: pointer; transition: all 0.2s; border-left: 3px solid transparent; white-space: nowrap; }
.nav-item:hover { color: white; background: rgba(255,255,255,0.06); }
.nav-item.active { color: white; background: rgba(58,166,166,0.15); border-left-color: #3aa6a6; }
.nav-icon { flex-shrink: 0; display: flex; }
.nav-arrow { margin-left: auto; transition: transform 0.3s; }
.nav-dropdown.open .nav-arrow { transform: rotate(180deg); }
.nav-sub { padding-left: 46px; background: rgba(0,0,0,0.15); }
.nav-sub-item { display: block; padding: 9px 12px; color: #94a3b8; text-decoration: none; font-size: 13px; transition: color 0.2s; }
.nav-sub-item:hover, .nav-sub-item.active { color: #3aa6a6; }
.role-tag { display: flex; align-items: center; gap: 8px; padding: 10px 16px; color: #64748b; font-size: 12px; font-weight: 500; margin-top: auto; border-top: 1px solid rgba(255,255,255,0.06); }

/* TOPBAR */
.main-wrapper { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.topbar { height: 60px; background: #3aa6a6; display: flex; align-items: center; justify-content: space-between; padding: 0 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); position: sticky; top: 0; z-index: 100; }
.hamburger { background: none; border: none; cursor: pointer; color: #fff; display: flex; padding: 6px; border-radius: 8px; transition: background 0.2s; }
.hamburger:hover { background: rgba(255,255,255,0.15); }
.topbar-right { display: flex; align-items: center; gap: 8px; }
.topbar-btn { position: relative; background: none; border: none; cursor: pointer; color: #fff; padding: 8px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
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
.account-avatar { width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.25); display: flex; align-items: center; justify-content: center; color: white; }
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

/* ACCESS DENIED */
.access-denied { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; text-align: center; gap: 16px; }
.access-denied-icon { width: 96px; height: 96px; border-radius: 50%; background: #fef2f2; display: flex; align-items: center; justify-content: center; color: #ef4444; }
.access-denied-title { font-size: 20px; font-weight: 700; color: #1e293b; }
.access-denied-msg { font-size: 14px; color: #64748b; max-width: 380px; line-height: 1.6; }

/* CONTENT */
.content { padding: 28px; flex: 1; }
.page-title { font-size: 22px; font-weight: 700; color: #1e293b; }
.breadcrumb { font-size: 12px; color: #94a3b8; margin-top: 2px; }
.page-header { margin-bottom: 20px; }

/* Profile Card */
.profile-card { display: flex; align-items: center; gap: 20px; background: linear-gradient(135deg, #3aa6a6, #2e8b8b); border-radius: 16px; padding: 24px 28px; margin-bottom: 24px; color: white; }
.profile-avatar { width: 68px; height: 68px; border-radius: 50%; background: rgba(255,255,255,0.25); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.profile-info { flex: 1; }
.profile-info h2 { font-size: 20px; font-weight: 700; }
.profile-info p { font-size: 13px; opacity: 0.85; margin-top: 4px; }
.profile-role-pill { display: inline-block; padding: 2px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; margin-top: 6px; }
.profile-role-pill.admin  { background: rgba(255,255,255,0.3); color: white; }
.profile-role-pill.doctor { background: rgba(255,255,255,0.2); color: white; }
.profile-meta { display: flex; align-items: center; gap: 20px; background: rgba(255,255,255,0.15); border-radius: 12px; padding: 12px 20px; }
.meta-item { text-align: center; }
.meta-num { display: block; font-size: 22px; font-weight: 700; }
.meta-label { display: block; font-size: 11px; opacity: 0.8; margin-top: 2px; }
.meta-divider { width: 1px; height: 36px; background: rgba(255,255,255,0.3); }

/* Stats */
.stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }
.stat-card { background: white; border-radius: 14px; padding: 20px 22px; display: flex; align-items: center; gap: 16px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); flex-wrap: wrap; transition: transform 0.2s, box-shadow 0.2s; }
.stat-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.09); }
.stat-icon { width: 50px; height: 50px; border-radius: 14px; display: flex; align-items: center; justify-content: center; color: white; flex-shrink: 0; }
.stat-icon.teal   { background: linear-gradient(135deg, #3aa6a6, #2dd4bf); }
.stat-icon.purple { background: linear-gradient(135deg, #6c63ff, #a78bfa); }
.stat-icon.orange { background: linear-gradient(135deg, #f97316, #fb923c); }
.stat-info { flex: 1; }
.stat-number { display: block; font-size: 28px; font-weight: 700; color: #1e293b; }
.stat-label { display: block; font-size: 12px; color: #94a3b8; font-weight: 500; margin-top: 2px; }
.stat-sub { display: flex; gap: 6px; flex-wrap: wrap; width: 100%; margin-top: 4px; }
.stat-badge { font-size: 11px; font-weight: 700; padding: 2px 10px; border-radius: 20px; }
.stat-badge.in      { color: #16a34a; background: #dcfce7; }
.stat-badge.out     { color: #dc2626; background: #fee2e2; }
.stat-badge.waiting { color: #ea580c; background: #ffedd5; }
.stat-text { font-size: 11px; color: #94a3b8; }

/* Bottom grid */
.bottom-grid { display: grid; grid-template-columns: 1fr 380px; gap: 20px; }

/* Chart card */
.chart-card { background: white; border-radius: 16px; padding: 24px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
.chart-header { margin-bottom: 20px; }
.chart-header h3 { font-size: 16px; font-weight: 700; color: #1e293b; }
.status-bars { display: flex; flex-direction: column; gap: 14px; margin-bottom: 20px; }
.bar-label-row { display: flex; justify-content: space-between; margin-bottom: 6px; }
.bar-label { font-size: 13px; color: #475569; font-weight: 500; }
.bar-count { font-size: 13px; color: #1e293b; font-weight: 700; }
.bar-track { height: 8px; background: #f1f5f9; border-radius: 10px; overflow: hidden; }
.bar-fill { height: 100%; border-radius: 10px; transition: width 0.6s ease; }
.chart-divider { border: none; border-top: 1px solid #f1f5f9; margin: 20px 0; }
.pie-wrapper { display: flex; align-items: center; gap: 24px; }
.pie-legend { display: flex; flex-direction: column; gap: 10px; }
.legend-item { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #64748b; }
.dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }

/* ══ Doctors Card ══ */
.doctors-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
}
.doctors-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.doctors-header h3 { font-size: 16px; font-weight: 700; color: #1e293b; }
.available-count { font-size: 12px; font-weight: 700; color: #16a34a; background: #dcfce7; padding: 4px 12px; border-radius: 20px; }
.search-input { width: 100%; padding: 9px 14px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 13px; outline: none; margin-bottom: 14px; font-family: inherit; color: #475569; transition: border-color 0.2s; }
.search-input:focus { border-color: #3aa6a6; }
.loading-mini { text-align: center; padding: 20px; color: #94a3b8; font-size: 13px; }

.doctors-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.doctors-table th { text-align: left; padding: 8px 10px; color: #94a3b8; font-weight: 600; font-size: 12px; border-bottom: 1px solid #f1f5f9; }
.doctors-table td { padding: 9px 10px; color: #475569; border-bottom: 1px solid #f8fafc; }
.doctors-table tr:last-child td { border-bottom: none; }
.doctors-table tr:hover:not(.placeholder-row) td { background: #f8fafc; }
.placeholder-row td { border-bottom: 1px solid #f8fafc; height: 38px; }
.empty-doctors { text-align: center; color: #94a3b8; padding: 20px; font-size: 13px; }
.status-badge { font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 20px; }
.status-badge.in  { color: #16a34a; background: #dcfce7; }
.status-badge.out { color: #dc2626; background: #fee2e2; }

/* ══ Doctors card smart pagination ══ */
.doc-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding-top: 14px;
  margin-top: auto;
  border-top: 1px solid #f1f5f9;
  flex-wrap: nowrap;
}
.doc-page-btn {
  min-width: 28px;
  height: 28px;
  padding: 0 6px;
  border: 1.5px solid #e2e8f0;
  background: white;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  color: #475569;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.doc-page-btn:hover:not(:disabled) { border-color: #3aa6a6; color: #3aa6a6; background: #f0fafa; }
.doc-page-btn.active { background: #3aa6a6; color: white; border-color: #3aa6a6; font-weight: 700; }
.doc-page-btn:disabled { opacity: 0.35; cursor: not-allowed; }
.nav-btn { color: #64748b; }
.doc-ellipsis {
  min-width: 24px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #94a3b8;
  user-select: none;
  letter-spacing: 1px;
  flex-shrink: 0;
}
.doc-page-info {
  font-size: 11px;
  color: #94a3b8;
  font-weight: 500;
  margin-left: 4px;
  white-space: nowrap;
}

@media (max-width: 1024px) { .bottom-grid { grid-template-columns: 1fr; } }
@media (max-width: 768px) {
  .stats-grid { grid-template-columns: 1fr; }
  .sidebar { position: fixed; z-index: 300; height: 100vh; }
  .content { padding: 16px; }
  .profile-meta { display: none; }
}
</style>