<template>
  <div class="layout">

    <!-- ── SIDEBAR ── -->
    <aside :class="['sidebar', { collapsed: sidebarCollapsed }]">
      <div class="sidebar-logo">
        <img src="../assets/CareQueueLogo.svg" alt="CareQueue" class="sidebar-logo-img" />
      </div>
      <nav class="sidebar-nav">

        <!-- Dashboard — gated by permission for doctors -->
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

        <!-- Schedule — gated by permission for doctors -->
        <router-link
          v-if="isAdmin || doctorCan('view_schedule')"
          to="/schedule" class="nav-item" active-class="active">
          <span class="nav-icon"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg></span>
          <span class="nav-label">Schedule</span>
        </router-link>

        <!-- Appointments — dropdown hidden entirely if doctor has none of the three sub-permissions -->
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
            <router-link
              v-if="isAdmin || doctorCan('book_appointment')"
              to="/appointments/book" class="nav-sub-item" active-class="active"
            >Book Appointment</router-link>
            <router-link
              v-if="isAdmin || doctorCan('view_appointments')"
              to="/appointments/all" class="nav-sub-item" active-class="active"
            >All Appointments</router-link>
            <router-link
              v-if="isAdmin || doctorCan('view_queue')"
              to="/appointments/queue" class="nav-sub-item" active-class="active"
            >Queue</router-link>
          </div>
        </template>

        <!-- Medical Records — gated -->
        <router-link
          v-if="isAdmin || doctorCan('view_medical_records')"
          to="/medical-records" class="nav-item" active-class="active">
          <span class="nav-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </span>
          <span class="nav-label">Medical Records</span>
        </router-link>

        <!-- Patients — gated -->
        <router-link
          v-if="isAdmin || doctorCan('view_patients')"
          to="/patients" class="nav-item" active-class="active">
          <span class="nav-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </span>
          <span class="nav-label">Patients</span>
        </router-link>

        <!-- Doctors List — admin only -->
        <router-link v-if="isAdmin" to="/adding-doctor" class="nav-item" active-class="active">
          <span class="nav-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
            </svg>
          </span>
          <span class="nav-label">Doctors List</span>
        </router-link>

        <!-- Access Control — admin only -->
        <router-link v-if="isAdmin" to="/doctor-access" class="nav-item" active-class="active">
          <span class="nav-icon"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg></span>
          <span class="nav-label">Access Control</span>
        </router-link>

        <!-- SMS Blast — admin only -->
        <router-link v-if="isAdmin" to="/sms-blast" class="nav-item" active-class="active">
          <span class="nav-icon"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg></span>
          <span class="nav-label">SMS Blast</span>
        </router-link>

        <!-- Doctor role tag -->
        <div v-if="!isAdmin" class="role-tag">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
          <span class="nav-label">Doctor Account</span>
        </div>

      </nav>
    </aside>

    <!-- ── MAIN ── -->
    <div class="main-wrapper">
      <header class="topbar">
        <div class="topbar-left">
          <button class="hamburger" @click="sidebarCollapsed = !sidebarCollapsed">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
        </div>
        <div class="topbar-right">
          <!-- Notification Bell -->
          <div class="notif-wrapper topbar-btn" @click="notifOpen = !notifOpen" v-click-outside="() => notifOpen = false">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
            <span class="notif-badge" v-if="todayAppointments.length > 0">{{ todayAppointments.length }}</span>
            <div class="dropdown notif-dropdown" v-show="notifOpen" @click.stop>
              <div class="dropdown-header">
                <span>Appointment Alerts</span>
                <span class="notif-count-label">{{ todayAppointments.length }} today</span>
              </div>
              <div v-if="todayAppointments.length === 0" class="notif-empty">No appointments today</div>
              <div v-for="appt in todayAppointments.slice(0, 5)" :key="appt.id" class="notif-item unread" @click="selectDayFromNotif(appt)">
                <div class="notif-dot"></div>
                <div>
                  <p class="notif-title">{{ appt.first_name }} {{ appt.last_name }}</p>
                  <p class="notif-sub">Dr. {{ appt.doctor || 'Unassigned' }} · {{ appt.appointment_time || 'No time set' }}</p>
                  <p class="notif-time"><span :class="['status-pip', appt.status]"></span> {{ appt.status }}</p>
                </div>
              </div>
              <div v-if="todayAppointments.length > 5" class="notif-more">+{{ todayAppointments.length - 5 }} more appointments today</div>
            </div>
          </div>

          <!-- Account -->
          <div class="account-wrapper" @click="accountOpen = !accountOpen" v-click-outside="() => accountOpen = false">
            <div class="account-avatar">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            </div>
            <div class="dropdown account-dropdown" v-show="accountOpen" @click.stop>
              <div class="dropdown-header account-info">
                <p class="account-name">{{ currentUser.name }}</p>
                <p class="account-email">{{ currentUser.email }}</p>
                <span class="role-pill" :class="isAdmin ? 'admin' : 'doctor'">{{ isAdmin ? 'Admin' : 'Doctor' }}</span>
              </div>
              <hr class="dropdown-divider"/>
              <button class="dropdown-item" @click="$router.push('/edit-profile'); accountOpen=false">
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
          <p class="access-denied-msg">You don't have permission to view the Schedule. Please contact your administrator to request access.</p>
        </div>
      </main>

      <!-- ── PAGE CONTENT ── -->
      <main v-else class="content">
        <div class="page-header">
          <div>
            <h1 class="page-title">SCHEDULE</h1>
            <p class="breadcrumb">Home / Schedule</p>
          </div>
          <div class="header-stats">
            <div class="stat-pill teal">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              {{ todayAppointments.length }} Today
            </div>
            <div class="stat-pill orange">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              {{ waitingCount }} Waiting
            </div>
            <div class="stat-pill purple">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
              {{ monthAppointments.length }} This Month
            </div>
          </div>
        </div>

        <div class="schedule-layout">

          <!-- LEFT: CALENDAR -->
          <div class="calendar-card">
            <div class="cal-header">
              <button class="cal-nav" @click="prevMonth">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
              </button>
              <div class="cal-month-year">
                <span class="cal-month">{{ monthNames[currentMonth] }}</span>
                <span class="cal-year">{{ currentYear }}</span>
              </div>
              <button class="cal-nav" @click="nextMonth">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </button>
            </div>

            <div class="cal-days-header">
              <span v-for="d in ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']" :key="d">{{ d }}</span>
            </div>

            <div class="cal-grid">
              <div
                v-for="(cell, idx) in calendarCells"
                :key="idx"
                :class="[
                  'cal-cell',
                  { 'other-month': !cell.currentMonth },
                  { 'today': cell.isToday },
                  { 'selected': cell.date && isSelected(cell.date) },
                  { 'has-appts': cell.date && getApptCount(cell.date) > 0 }
                ]"
                @click="cell.date && selectDay(cell.date)"
              >
                <span class="cal-date">{{ cell.day }}</span>
                <div class="cal-dots" v-if="cell.date && getApptCount(cell.date) > 0">
                  <span
                    v-for="(dot, di) in getDots(cell.date)"
                    :key="di"
                    class="cal-dot"
                    :style="{ background: dot }"
                  ></span>
                </div>
              </div>
            </div>

            <div class="cal-legend">
              <div class="legend-item"><span class="legend-dot" style="background:#f97316"></span> Waiting</div>
              <div class="legend-item"><span class="legend-dot" style="background:#3aa6a6"></span> Approved</div>
              <div class="legend-item"><span class="legend-dot" style="background:#6c63ff"></span> Arrived</div>
              <div class="legend-item"><span class="legend-dot" style="background:#16a34a"></span> Completed</div>
              <div class="legend-item"><span class="legend-dot" style="background:#ef4444"></span> Cancelled</div>
            </div>
          </div>

          <!-- RIGHT: APPOINTMENTS PANEL -->
          <div class="appt-panel">
            <div class="appt-panel-header">
              <div>
                <h3 class="appt-panel-title">
                  {{ selectedDate ? formatSelectedDate(selectedDate) : 'Select a date' }}
                </h3>
                <p class="appt-panel-sub" v-if="selectedDate">
                  {{ selectedDayAppts.length }} appointment{{ selectedDayAppts.length !== 1 ? 's' : '' }}
                </p>
              </div>
              <button class="btn-today" @click="goToday">Today</button>
            </div>

            <div v-if="loading" class="loading-state">
              <div class="spinner"></div>
              <p>Loading schedule...</p>
            </div>

            <div v-else-if="!selectedDate" class="empty-panel">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              <p>Click any date on the calendar to see appointments</p>
            </div>

            <div v-else-if="selectedDayAppts.length === 0" class="empty-panel">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
              <p>No appointments on this date</p>
            </div>

            <div v-else class="appt-list">
              <div
                v-for="appt in selectedDayAppts"
                :key="appt.id"
                class="appt-card"
                @click="viewAppt(appt)"
              >
                <div class="appt-time-col">
                  <span class="appt-time">{{ appt.appointment_time || '—' }}</span>
                  <div class="appt-time-line"></div>
                </div>
                <div class="appt-info">
                  <div class="appt-info-top">
                    <span class="appt-patient-name">{{ appt.last_name }}, {{ appt.first_name }}</span>
                    <span :class="['appt-status', appt.status]">{{ appt.status }}</span>
                  </div>
                  <p class="appt-doctor">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                    Dr. {{ appt.doctor || 'Unassigned' }}
                  </p>
                  <p class="appt-notes" v-if="appt.condition_notes">{{ appt.condition_notes }}</p>
                  <!-- Status action buttons: gated by manage_appointments -->
                  <div class="appt-actions" v-if="isAdmin || doctorCan('manage_appointments')" @click.stop>
                    <button class="appt-btn approve"  v-if="appt.status === 'waiting'"                     @click="updateStatus(appt, 'approved')">Approve</button>
                    <button class="appt-btn arrived"  v-if="appt.status === 'approved'"                    @click="updateStatus(appt, 'arrived')">Mark Arrived</button>
                    <button class="appt-btn complete" v-if="appt.status === 'arrived'"                     @click="updateStatus(appt, 'completed')">Complete</button>
                    <button class="appt-btn cancel"   v-if="['waiting','approved'].includes(appt.status)"  @click="updateStatus(appt, 'cancelled')">Cancel</button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Today's appointments shown when no date is selected -->
            <div class="upcoming-section" v-if="!selectedDate && todayAppointments.length > 0">
              <div class="upcoming-title">📅 Today's Appointments</div>
              <div v-for="appt in todayAppointments" :key="'t'+appt.id" class="appt-card" @click="viewAppt(appt)">
                <div class="appt-time-col">
                  <span class="appt-time">{{ appt.appointment_time || '—' }}</span>
                  <div class="appt-time-line"></div>
                </div>
                <div class="appt-info">
                  <div class="appt-info-top">
                    <span class="appt-patient-name">{{ appt.last_name }}, {{ appt.first_name }}</span>
                    <span :class="['appt-status', appt.status]">{{ appt.status }}</span>
                  </div>
                  <p class="appt-doctor">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                    Dr. {{ appt.doctor || 'Unassigned' }}
                  </p>
                  <!-- Status action buttons: gated by manage_appointments -->
                  <div class="appt-actions" v-if="isAdmin || doctorCan('manage_appointments')" @click.stop>
                    <button class="appt-btn approve"  v-if="appt.status === 'waiting'"                    @click="updateStatus(appt, 'approved')">Approve</button>
                    <button class="appt-btn arrived"  v-if="appt.status === 'approved'"                   @click="updateStatus(appt, 'arrived')">Mark Arrived</button>
                    <button class="appt-btn complete" v-if="appt.status === 'arrived'"                    @click="updateStatus(appt, 'completed')">Complete</button>
                    <button class="appt-btn cancel"   v-if="['waiting','approved'].includes(appt.status)" @click="updateStatus(appt, 'cancelled')">Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- APPOINTMENT DETAIL MODAL -->
    <div class="modal-overlay" v-if="viewingAppt" @click.self="viewingAppt = null">
      <div class="modal">
        <div class="modal-header">
          <h3>Appointment Details</h3>
          <button class="modal-close" @click="viewingAppt = null">✕</button>
        </div>
        <div class="modal-body" v-if="viewingAppt">
          <div class="modal-patient-header">
            <div class="modal-avatar">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            </div>
            <div>
              <p class="modal-patient-name">{{ viewingAppt.last_name }}, {{ viewingAppt.first_name }}</p>
              <p class="modal-appt-id">{{ viewingAppt.appointment_id }}</p>
            </div>
            <span :class="['appt-status modal-status', viewingAppt.status]">{{ viewingAppt.status }}</span>
          </div>
          <div class="detail-grid">
            <div class="detail-item"><span class="detail-label">Doctor</span><span class="detail-val">Dr. {{ viewingAppt.doctor || '—' }}</span></div>
            <div class="detail-item"><span class="detail-label">Date</span><span class="detail-val">{{ formatDate(viewingAppt.appointment_date) }}</span></div>
            <div class="detail-item"><span class="detail-label">Time</span><span class="detail-val">{{ viewingAppt.appointment_time || '—' }}</span></div>
            <div class="detail-item"><span class="detail-label">Mobile</span><span class="detail-val">{{ viewingAppt.mobile || '—' }}</span></div>
            <div class="detail-item span-2"><span class="detail-label">Condition / Notes</span><span class="detail-val">{{ viewingAppt.condition_notes || '—' }}</span></div>
            <div class="detail-item span-2"><span class="detail-label">Additional Note</span><span class="detail-val">{{ viewingAppt.note || '—' }}</span></div>
          </div>
          <!-- Status actions in modal: gated by manage_appointments -->
          <div class="modal-actions" v-if="isAdmin || doctorCan('manage_appointments')">
            <button class="appt-btn approve"  v-if="viewingAppt.status === 'waiting'"                    @click="updateStatus(viewingAppt, 'approved')">✓ Approve</button>
            <button class="appt-btn arrived"  v-if="viewingAppt.status === 'approved'"                   @click="updateStatus(viewingAppt, 'arrived')">✓ Mark Arrived</button>
            <button class="appt-btn complete" v-if="viewingAppt.status === 'arrived'"                    @click="updateStatus(viewingAppt, 'completed')">✓ Complete</button>
            <button class="appt-btn cancel"   v-if="['waiting','approved'].includes(viewingAppt.status)" @click="updateStatus(viewingAppt, 'cancelled')">✕ Cancel</button>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-close-modal" @click="viewingAppt = null">Close</button>
        </div>
      </div>
    </div>

    <!-- SUCCESS TOAST -->
    <transition name="toast">
      <div v-if="toast" class="toast" :class="toast.type">
        <svg v-if="toast.type==='success'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        {{ toast.message }}
      </div>
    </transition>

  </div>
</template>

<script>
export default {
  name: 'Schedule',
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
    const now = new Date()
    return {
      sidebarCollapsed: false,
      notifOpen: false,
      accountOpen: false,
      appointmentsOpen: false,
      loading: false,
      currentMonth: now.getMonth(),
      currentYear: now.getFullYear(),
      selectedDate: null,
      appointments: [],
      viewingAppt: null,
      toast: null,

      // ✅ Permission system
      currentUser: JSON.parse(localStorage.getItem('user')) || { name: 'Admin', email: '' },
      livePerms: JSON.parse(localStorage.getItem('doctorPermissions') || '{}'),

      monthNames: ['January','February','March','April','May','June','July','August','September','October','November','December'],
      statusColors: { waiting: '#f97316', approved: '#3aa6a6', arrived: '#6c63ff', completed: '#16a34a', cancelled: '#ef4444' }
    }
  },
  computed: {
    // ✅ Role helpers
    isAdmin() {
      return localStorage.getItem('role') === 'admin'
    },
    // ✅ Page-level access: must be admin or have view_schedule permission
    canAccess() {
      return this.isAdmin || this.doctorCan('view_schedule')
    },

    today() {
      const t = new Date()
      return `${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,'0')}-${String(t.getDate()).padStart(2,'0')}`
    },
    todayAppointments() {
      return this.appointments.filter(a => a.appointment_date && a.appointment_date.slice(0,10) === this.today)
    },
    waitingCount() { return this.appointments.filter(a => a.status === 'waiting').length },
    monthAppointments() {
      return this.appointments.filter(a => {
        if (!a.appointment_date) return false
        const d = new Date(a.appointment_date)
        return d.getMonth() === this.currentMonth && d.getFullYear() === this.currentYear
      })
    },
    selectedDayAppts() {
      if (!this.selectedDate) return []
      return this.appointments
        .filter(a => a.appointment_date && a.appointment_date.slice(0,10) === this.selectedDate)
        .sort((a,b) => (a.appointment_time||'').localeCompare(b.appointment_time||''))
    },
    calendarCells() {
      const cells = []
      const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay()
      const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate()
      const daysInPrev = new Date(this.currentYear, this.currentMonth, 0).getDate()

      for (let i = firstDay - 1; i >= 0; i--) {
        const day = daysInPrev - i
        const m = this.currentMonth === 0 ? 11 : this.currentMonth - 1
        const y = this.currentMonth === 0 ? this.currentYear - 1 : this.currentYear
        cells.push({ day, currentMonth: false, isToday: false, date: `${y}-${String(m+1).padStart(2,'0')}-${String(day).padStart(2,'0')}` })
      }
      for (let d = 1; d <= daysInMonth; d++) {
        const date = `${this.currentYear}-${String(this.currentMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
        cells.push({ day: d, currentMonth: true, isToday: date === this.today, date })
      }
      const remaining = 42 - cells.length
      for (let d = 1; d <= remaining; d++) {
        const m = this.currentMonth === 11 ? 0 : this.currentMonth + 1
        const y = this.currentMonth === 11 ? this.currentYear + 1 : this.currentYear
        cells.push({ day: d, currentMonth: false, isToday: false, date: `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}` })
      }
      return cells
    }
  },
  methods: {
    // ✅ Permission helper
    doctorCan(key) { return !!this.livePerms[key] },

    async fetchAppointments() {
      this.loading = true
      try {
        const res = await fetch('http://localhost:8000/appointments')
        this.appointments = await res.json()
      } catch (err) { console.error('Failed to fetch appointments:', err) }
      finally { this.loading = false }
    },
    getApptCount(date) {
      return this.appointments.filter(a => a.appointment_date && a.appointment_date.slice(0,10) === date).length
    },
    getDots(date) {
      const appts = this.appointments.filter(a => a.appointment_date && a.appointment_date.slice(0,10) === date)
      const seen = new Set()
      return appts.map(a => this.statusColors[a.status] || '#94a3b8').filter(c => { if (seen.has(c)) return false; seen.add(c); return true }).slice(0,3)
    },
    isSelected(date) { return date === this.selectedDate },
    selectDay(date) { this.selectedDate = date },
    selectDayFromNotif(appt) {
      this.notifOpen = false
      if (appt.appointment_date) {
        this.selectedDate  = appt.appointment_date.slice(0,10)
        this.currentMonth  = new Date(appt.appointment_date).getMonth()
        this.currentYear   = new Date(appt.appointment_date).getFullYear()
      }
    },
    goToday() {
      const now = new Date()
      this.currentMonth = now.getMonth()
      this.currentYear  = now.getFullYear()
      this.selectedDate = this.today
    },
    prevMonth() {
      if (this.currentMonth === 0) { this.currentMonth = 11; this.currentYear-- }
      else this.currentMonth--
    },
    nextMonth() {
      if (this.currentMonth === 11) { this.currentMonth = 0; this.currentYear++ }
      else this.currentMonth++
    },
    viewAppt(appt) { this.viewingAppt = { ...appt } },
    async updateStatus(appt, status) {
      try {
        const res = await fetch(`http://localhost:8000/appointments/${appt.id}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status })
        })
        if (!res.ok) throw new Error()
        const idx = this.appointments.findIndex(a => a.id === appt.id)
        if (idx !== -1) this.appointments[idx].status = status
        if (this.viewingAppt && this.viewingAppt.id === appt.id) this.viewingAppt.status = status
        this.showToast(`Appointment marked as ${status}`, 'success')
      } catch { this.showToast('Failed to update status', 'error') }
    },
    showToast(message, type = 'success') {
      this.toast = { message, type }
      setTimeout(() => { this.toast = null }, 3000)
    },
    formatDate(d) {
      if (!d) return '—'
      return new Date(d).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })
    },
    formatSelectedDate(d) {
      if (!d) return ''
      return new Date(d + 'T00:00:00').toLocaleDateString('en-PH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    },
    handleLogout() { localStorage.removeItem('user'); this.$router.push('/') }
  },
  mounted() {
    this.fetchAppointments()
    this.selectedDate = this.today
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
.topbar { height: 60px; background: #3aa6a6; display: flex; align-items: center; justify-content: space-between; padding: 0 24px; position: sticky; top: 0; z-index: 100; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
.hamburger { background: none; border: none; cursor: pointer; color: #fff; display: flex; padding: 6px; border-radius: 8px; }
.hamburger:hover { background: rgba(255,255,255,0.15); }
.topbar-right { display: flex; align-items: center; gap: 8px; }
.topbar-btn { position: relative; background: none; border: none; cursor: pointer; color: #fff; padding: 8px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.topbar-btn:hover { background: rgba(255,255,255,0.15); }
.notif-wrapper { position: relative; cursor: pointer; color: white; padding: 8px; display: flex; align-items: center; justify-content: center; border-radius: 50%; }
.notif-wrapper:hover { background: rgba(255,255,255,0.15); }
.notif-badge { position: absolute; top: 2px; right: 2px; background: #ef4444; color: white; font-size: 9px; font-weight: 700; min-width: 16px; height: 16px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #3aa6a6; padding: 0 2px; }
.dropdown { position: absolute; top: calc(100% + 10px); right: 0; background: white; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.15); z-index: 200; overflow: hidden; animation: fadeDown 0.15s ease; }
@keyframes fadeDown { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
.dropdown-header { padding: 14px 16px; display: flex; justify-content: space-between; align-items: center; font-weight: 600; font-size: 13px; color: #1e293b; border-bottom: 1px solid #f1f5f9; }
.notif-count-label { font-size: 11px; background: #3aa6a6; color: white; padding: 2px 8px; border-radius: 20px; font-weight: 600; }
.notif-dropdown { width: 320px; }
.notif-empty { padding: 20px; text-align: center; color: #94a3b8; font-size: 13px; }
.notif-item { display: flex; align-items: flex-start; gap: 12px; padding: 12px 16px; cursor: pointer; transition: background 0.15s; border-bottom: 1px solid #f8fafc; }
.notif-item:hover { background: #f8fafc; }
.notif-item.unread { background: #f0fafa; }
.notif-dot { width: 8px; height: 8px; border-radius: 50%; background: #3aa6a6; margin-top: 5px; flex-shrink: 0; }
.notif-title { font-size: 13px; color: #1e293b; font-weight: 600; }
.notif-sub { font-size: 12px; color: #64748b; margin-top: 2px; }
.notif-time { font-size: 11px; color: #94a3b8; margin-top: 3px; display: flex; align-items: center; gap: 4px; text-transform: capitalize; }
.notif-more { padding: 10px 16px; text-align: center; font-size: 12px; color: #3aa6a6; font-weight: 600; cursor: pointer; }
.notif-more:hover { background: #f0fafa; }
.status-pip { width: 7px; height: 7px; border-radius: 50%; display: inline-block; }
.status-pip.waiting   { background: #f97316; }
.status-pip.approved  { background: #3aa6a6; }
.status-pip.arrived   { background: #6c63ff; }
.status-pip.completed { background: #16a34a; }
.status-pip.cancelled { background: #ef4444; }
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
.content { padding: 28px; flex: 1; overflow-y: auto; }
.page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
.page-title { font-size: 22px; font-weight: 700; color: #1e293b; }
.breadcrumb { font-size: 12px; color: #94a3b8; margin-top: 2px; }
.header-stats { display: flex; gap: 10px; flex-wrap: wrap; }
.stat-pill { display: inline-flex; align-items: center; gap: 6px; padding: 7px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; }
.stat-pill.teal   { background: #ccf2f2; color: #2e8b8b; }
.stat-pill.orange { background: #ffedd5; color: #c2410c; }
.stat-pill.purple { background: #ede9fe; color: #5b21b6; }

/* SCHEDULE LAYOUT */
.schedule-layout { display: grid; grid-template-columns: 340px 1fr; gap: 20px; align-items: start; }

/* CALENDAR */
.calendar-card { background: white; border-radius: 16px; padding: 22px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
.cal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
.cal-nav { background: #f1f5f9; border: none; width: 32px; height: 32px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #475569; transition: all 0.2s; }
.cal-nav:hover { background: #3aa6a6; color: white; }
.cal-month-year { display: flex; gap: 8px; align-items: baseline; }
.cal-month { font-size: 17px; font-weight: 700; color: #1e293b; }
.cal-year  { font-size: 14px; color: #94a3b8; font-weight: 500; }
.cal-days-header { display: grid; grid-template-columns: repeat(7, 1fr); margin-bottom: 8px; }
.cal-days-header span { text-align: center; font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; padding: 4px 0; }
.cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }
.cal-cell { aspect-ratio: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: 10px; cursor: pointer; transition: all 0.15s; position: relative; padding: 2px; }
.cal-cell:hover:not(.other-month) { background: #f0fafa; }
.cal-cell.other-month { opacity: 0.3; cursor: default; }
.cal-cell.today .cal-date { background: #3aa6a6; color: white; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; }
.cal-cell.selected { background: #e6f7f7; }
.cal-cell.selected .cal-date { color: #2e8b8b; font-weight: 700; }
.cal-date { font-size: 13px; font-weight: 500; color: #374151; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; }
.cal-dots { display: flex; gap: 2px; margin-top: 2px; }
.cal-dot { width: 5px; height: 5px; border-radius: 50%; }
.cal-legend { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; padding-top: 14px; border-top: 1px solid #f1f5f9; }
.legend-item { display: flex; align-items: center; gap: 5px; font-size: 11px; color: #64748b; }
.legend-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

/* APPOINTMENT PANEL */
.appt-panel { background: white; border-radius: 16px; padding: 22px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); min-height: 500px; display: flex; flex-direction: column; }
.appt-panel-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid #f1f5f9; }
.appt-panel-title { font-size: 16px; font-weight: 700; color: #1e293b; }
.appt-panel-sub { font-size: 12px; color: #94a3b8; margin-top: 3px; }
.btn-today { padding: 7px 16px; background: #3aa6a6; color: white; border: none; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit; transition: background 0.2s; }
.btn-today:hover { background: #2e8b8b; }
.loading-state { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 60px; color: #94a3b8; flex: 1; }
.spinner { width: 30px; height: 30px; border: 3px solid #e2e8f0; border-top-color: #3aa6a6; border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.empty-panel { display: flex; flex-direction: column; align-items: center; gap: 14px; padding: 60px 20px; color: #94a3b8; flex: 1; text-align: center; }
.empty-panel p { font-size: 13px; max-width: 220px; }
.appt-list { display: flex; flex-direction: column; gap: 12px; flex: 1; }
.upcoming-section { flex: 1; }
.upcoming-title { font-size: 13px; font-weight: 700; color: #64748b; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px; }

/* APPOINTMENT CARD */
.appt-card { display: flex; gap: 14px; padding: 14px; border: 1.5px solid #f1f5f9; border-radius: 12px; cursor: pointer; transition: all 0.2s; margin-bottom: 10px; }
.appt-card:hover { border-color: #3aa6a6; box-shadow: 0 2px 12px rgba(58,166,166,0.1); }
.appt-time-col { display: flex; flex-direction: column; align-items: center; width: 50px; flex-shrink: 0; }
.appt-time { font-size: 11px; font-weight: 700; color: #3aa6a6; white-space: nowrap; }
.appt-time-line { flex: 1; width: 2px; background: #f1f5f9; margin-top: 6px; border-radius: 2px; min-height: 20px; }
.appt-info { flex: 1; min-width: 0; }
.appt-info-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; gap: 8px; }
.appt-patient-name { font-size: 14px; font-weight: 700; color: #1e293b; }
.appt-doctor { font-size: 12px; color: #64748b; display: flex; align-items: center; gap: 4px; margin-bottom: 6px; }
.appt-notes { font-size: 12px; color: #94a3b8; margin-bottom: 8px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.appt-actions { display: flex; gap: 6px; flex-wrap: wrap; }

/* STATUS BADGE */
.appt-status { font-size: 11px; font-weight: 700; padding: 2px 10px; border-radius: 20px; text-transform: capitalize; flex-shrink: 0; }
.appt-status.waiting   { color: #c2410c; background: #ffedd5; }
.appt-status.approved  { color: #0369a1; background: #e0f2fe; }
.appt-status.arrived   { color: #5b21b6; background: #ede9fe; }
.appt-status.completed { color: #15803d; background: #dcfce7; }
.appt-status.cancelled { color: #dc2626; background: #fee2e2; }

/* ACTION BUTTONS */
.appt-btn { padding: 5px 12px; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer; font-family: inherit; border: none; transition: all 0.2s; }
.appt-btn.approve  { background: #e0f2fe; color: #0369a1; }
.appt-btn.approve:hover  { background: #0369a1; color: white; }
.appt-btn.arrived  { background: #ede9fe; color: #5b21b6; }
.appt-btn.arrived:hover  { background: #5b21b6; color: white; }
.appt-btn.complete { background: #dcfce7; color: #15803d; }
.appt-btn.complete:hover { background: #15803d; color: white; }
.appt-btn.cancel   { background: #fee2e2; color: #dc2626; }
.appt-btn.cancel:hover   { background: #dc2626; color: white; }

/* MODAL */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; z-index: 500; padding: 20px; }
.modal { background: white; border-radius: 16px; width: 500px; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 20px 60px rgba(0,0,0,0.2); overflow: hidden; }
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid #f1f5f9; }
.modal-header h3 { font-size: 16px; font-weight: 700; color: #1e293b; }
.modal-close { background: none; border: none; font-size: 18px; color: #94a3b8; cursor: pointer; line-height: 1; }
.modal-body { padding: 24px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 16px; }
.modal-footer { padding: 16px 24px; border-top: 1px solid #f1f5f9; display: flex; justify-content: flex-end; }
.modal-patient-header { display: flex; align-items: center; gap: 14px; background: linear-gradient(135deg, #3aa6a6, #2e8b8b); border-radius: 12px; padding: 16px; color: white; }
.modal-avatar { width: 50px; height: 50px; border-radius: 50%; background: rgba(255,255,255,0.25); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.modal-patient-name { font-size: 16px; font-weight: 700; }
.modal-appt-id { font-size: 11px; opacity: 0.8; font-family: monospace; margin-top: 2px; }
.modal-status { margin-left: auto; }
.detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.detail-item { display: flex; flex-direction: column; gap: 4px; }
.detail-item.span-2 { grid-column: span 2; }
.detail-label { font-size: 11px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; }
.detail-val { font-size: 13px; font-weight: 600; color: #1e293b; }
.modal-actions { display: flex; gap: 8px; flex-wrap: wrap; padding-top: 4px; border-top: 1px solid #f1f5f9; }
.btn-close-modal { padding: 9px 24px; background: #f1f5f9; color: #475569; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; }
.btn-close-modal:hover { background: #e2e8f0; }

/* TOAST */
.toast { position: fixed; bottom: 30px; right: 30px; padding: 14px 20px; border-radius: 10px; font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 10px; box-shadow: 0 8px 24px rgba(0,0,0,0.15); z-index: 9999; color: white; }
.toast.success { background: #16a34a; }
.toast.error   { background: #dc2626; }
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(20px); }

@media (max-width: 1024px) { .schedule-layout { grid-template-columns: 1fr; } }
@media (max-width: 768px) {
  .sidebar { position: fixed; z-index: 300; height: 100vh; }
  .content { padding: 16px; }
  .page-header { flex-direction: column; }
}
</style>