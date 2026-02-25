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
          <div class="topbar-btn notif-wrapper" @click="notifOpen = !notifOpen" v-click-outside="() => notifOpen = false">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
            <span class="notif-badge">!</span>
            <div class="dropdown notif-dropdown" v-show="notifOpen" @click.stop>
              <div class="dropdown-header"><span>Notifications</span><a href="#" class="mark-read">Mark all read</a></div>
              <div class="notif-item unread"><div class="notif-dot"></div><div><p class="notif-title">Medical Records loaded</p><p class="notif-time">Just now</p></div></div>
            </div>
          </div>
          <div class="account-wrapper" @click="accountOpen = !accountOpen" v-click-outside="() => accountOpen = false">
            <div class="account-avatar"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg></div>
            <div class="dropdown account-dropdown" v-show="accountOpen" @click.stop>
              <div class="dropdown-header account-info">
                <p class="account-name">{{ currentUser.name }}</p>
                <p class="account-email">{{ currentUser.email }}</p>
                <span class="role-pill" :class="isAdmin ? 'admin' : 'doctor'">{{ isAdmin ? 'Admin' : 'Doctor' }}</span>
              </div>
              <hr class="dropdown-divider"/>
              <button class="dropdown-item" @click="goTo('edit-account')">Edit Account</button>
              <hr class="dropdown-divider"/>
              <button class="dropdown-item logout" @click="handleLogout">Logout</button>
            </div>
          </div>
        </div>
      </header>

      <!-- ACCESS DENIED — doctor without view_medical_records permission -->
      <main class="content" v-if="!isAdmin && !doctorCan('view_medical_records')">
        <div class="access-denied-page">
          <div class="access-denied-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
          </div>
          <h2 class="access-denied-title">Access Restricted</h2>
          <p class="access-denied-text">You don't have permission to view Medical Records. Please contact your administrator.</p>
          <button class="btn-go-back" @click="$router.push('/dashboard')">← Go to Dashboard</button>
        </div>
      </main>

      <!-- PAGE CONTENT -->
      <main class="content" v-else>
        <div class="page-header">
          <h1 class="page-title">MEDICAL RECORDS</h1>
          <p class="breadcrumb">Home / Medical Records</p>
        </div>

        <div class="table-card">
          <!-- Toolbar -->
          <div class="toolbar">
            <div class="toolbar-left">
              <div class="search-box">
                <input type="text" v-model="searchId" placeholder="Search Patient ID" class="search-input" />
                <button class="search-btn"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg></button>
              </div>
              <div class="search-box">
                <input type="text" v-model="searchName" placeholder="Search Name" class="search-input" />
                <button class="search-btn"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg></button>
              </div>
            </div>
            <div class="toolbar-right">
              <div class="dropdown-wrapper" v-click-outside="() => sortOpen = false">
                <button class="toolbar-btn" @click="sortOpen = !sortOpen">
                  Sort by <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                </button>
                <div class="toolbar-dropdown" v-show="sortOpen">
                  <button class="toolbar-dropdown-item" @click="sortField='patient_id'; sortOpen=false">Sort by ID</button>
                  <button class="toolbar-dropdown-item" @click="sortField='last_name'; sortOpen=false">Sort by Name</button>
                  <button class="toolbar-dropdown-item" @click="sortField='created_at'; sortOpen=false">Sort by Date</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Loading -->
          <div v-if="loading" class="loading-state">
            <div class="spinner"></div>
            <p>Loading records...</p>
          </div>

          <!-- Table -->
          <table class="records-table" v-else>
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Full Name</th>
                <th>Gender</th>
                <th>Age</th>
                <th>Mobile</th>
                <th>Appointments</th>
                <th>Registered</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="filteredPatients.length === 0">
                <td colspan="8" class="empty-row">No records found.</td>
              </tr>
              <tr v-for="patient in filteredPatients" :key="patient.id">
                <td class="id-cell">{{ patient.patient_id }}</td>
                <td class="name-cell">{{ patient.last_name }}, {{ patient.first_name }} {{ patient.middle_name || '' }}</td>
                <td>{{ patient.gender || '—' }}</td>
                <td>{{ patient.age || '—' }}</td>
                <td>{{ patient.mobile || '—' }}</td>
                <td><span class="appt-badge">{{ getAppointmentCount(patient) }}</span></td>
                <td class="date-cell">{{ formatDate(patient.created_at) }}</td>
                <td>
                  <div class="action-btns">
                    <!-- View — gated by view_patient_profile -->
                    <button
                      v-if="isAdmin || doctorCan('view_patient_profile')"
                      class="btn-view"
                      @click="$router.push('/medical-records/' + patient.id)"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                      View
                    </button>
                    <!-- Print — gated by print_records -->
                    <button
                      v-if="isAdmin || doctorCan('print_records')"
                      class="btn-print"
                      @click="printRecord(patient)"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                      Print
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Pagination -->
          <div class="pagination" v-if="totalPages > 1">
            <button class="page-btn" :disabled="currentPage === 1" @click="currentPage--">‹</button>
            <button v-for="p in totalPages" :key="p" class="page-btn" :class="{ active: p === currentPage }" @click="currentPage = p">{{ p }}</button>
            <button class="page-btn" :disabled="currentPage === totalPages" @click="currentPage++">›</button>
          </div>
        </div>
      </main>
    </div>

    <!-- ══════════════════════════════════════════
         VIEW RECORD MODAL
    ══════════════════════════════════════════ -->
    <div class="modal-overlay" v-if="viewingRecord" @click.self="viewingRecord = null">
      <div class="modal modal-large">
        <div class="modal-header">
          <h3>Patient Medical Record</h3>
          <div class="modal-header-actions">
            <!-- Print button in modal — gated -->
            <button
              v-if="isAdmin || doctorCan('print_records')"
              class="btn-print-modal"
              @click="printRecord(viewingRecord)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
              Print Record
            </button>
            <button class="modal-close" @click="viewingRecord = null">✕</button>
          </div>
        </div>
        <div class="modal-body" v-if="viewingRecord">
          <div class="patient-header-card">
            <div class="patient-avatar">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            </div>
            <div class="patient-header-info">
              <h2 class="patient-full-name">{{ viewingRecord.last_name }}, {{ viewingRecord.first_name }} {{ viewingRecord.middle_name || '' }} {{ viewingRecord.name_extension || '' }}</h2>
              <p class="patient-id-tag">{{ viewingRecord.patient_id }}</p>
            </div>
            <div class="patient-header-meta">
              <div class="meta-chip"><span class="meta-chip-label">Gender</span><span>{{ viewingRecord.gender || '—' }}</span></div>
              <div class="meta-chip"><span class="meta-chip-label">Age</span><span>{{ viewingRecord.age || '—' }}</span></div>
              <div class="meta-chip"><span class="meta-chip-label">Religion</span><span>{{ viewingRecord.religion || '—' }}</span></div>
            </div>
          </div>
          <div class="record-grid">
            <div class="record-section">
              <div class="record-section-title">Personal Information</div>
              <div class="record-row"><span class="record-label">Date of Birth</span><span class="record-value">{{ formatDate(viewingRecord.date_of_birth) }}</span></div>
              <div class="record-row"><span class="record-label">Gender</span><span class="record-value">{{ viewingRecord.gender || '—' }}</span></div>
              <div class="record-row"><span class="record-label">Age</span><span class="record-value">{{ viewingRecord.age || '—' }}</span></div>
              <div class="record-row"><span class="record-label">Religion</span><span class="record-value">{{ viewingRecord.religion || '—' }}</span></div>
              <div class="record-row"><span class="record-label">Registered</span><span class="record-value">{{ formatDate(viewingRecord.created_at) }}</span></div>
            </div>
            <div class="record-section">
              <div class="record-section-title">Contact Information</div>
              <div class="record-row"><span class="record-label">Mobile</span><span class="record-value">{{ viewingRecord.mobile || '—' }}</span></div>
              <div class="record-row"><span class="record-label">Landline</span><span class="record-value">{{ viewingRecord.landline || '—' }}</span></div>
              <div class="record-row"><span class="record-label">Email</span><span class="record-value">{{ viewingRecord.email || '—' }}</span></div>
            </div>
            <div class="record-section span-full">
              <div class="record-section-title">
                Appointment History
                <span class="appt-count-badge">{{ patientAppointments.length }} record(s)</span>
              </div>
              <div v-if="loadingAppts" class="loading-mini">Loading appointments...</div>
              <div v-else-if="patientAppointments.length === 0" class="no-appts">No appointment history found.</div>
              <table class="appt-table" v-else>
                <thead>
                  <tr><th>Appt. ID</th><th>Doctor</th><th>Date</th><th>Time</th><th>Condition / Notes</th><th>Status</th></tr>
                </thead>
                <tbody>
                  <tr v-for="appt in patientAppointments" :key="appt.id">
                    <td class="id-cell">{{ appt.appointment_id }}</td>
                    <td>{{ appt.doctor || '—' }}</td>
                    <td>{{ formatDate(appt.appointment_date) }}</td>
                    <td>{{ appt.appointment_time || '—' }}</td>
                    <td class="notes-cell">{{ appt.condition_notes || appt.note || '—' }}</td>
                    <td><span :class="['status-badge', appt.status]">{{ appt.status }}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="viewingRecord = null">Close</button>
          <button
            v-if="isAdmin || doctorCan('print_records')"
            class="btn-print-confirm"
            @click="printRecord(viewingRecord)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
            Print Record
          </button>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════
         HIDDEN PRINT AREA
    ══════════════════════════════════════════ -->
    <div id="print-area" style="display:none">
      <div v-if="printingRecord" class="print-doc">
        <div class="print-header">
          <h1>CareQueue Medical Record</h1>
          <p>Printed on: {{ new Date().toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' }) }}</p>
        </div>
        <div class="print-patient-name">
          <strong>{{ printingRecord.last_name }}, {{ printingRecord.first_name }} {{ printingRecord.middle_name || '' }}</strong>
          <span> — {{ printingRecord.patient_id }}</span>
        </div>
        <table class="print-table">
          <tbody>
            <tr><td class="pl"><strong>Gender</strong></td><td>{{ printingRecord.gender || '—' }}</td><td class="pl"><strong>Age</strong></td><td>{{ printingRecord.age || '—' }}</td></tr>
            <tr><td class="pl"><strong>Date of Birth</strong></td><td>{{ formatDate(printingRecord.date_of_birth) }}</td><td class="pl"><strong>Religion</strong></td><td>{{ printingRecord.religion || '—' }}</td></tr>
            <tr><td class="pl"><strong>Mobile</strong></td><td>{{ printingRecord.mobile || '—' }}</td><td class="pl"><strong>Landline</strong></td><td>{{ printingRecord.landline || '—' }}</td></tr>
            <tr><td class="pl"><strong>Email</strong></td><td colspan="3">{{ printingRecord.email || '—' }}</td></tr>
          </tbody>
        </table>
        <h3 class="print-section-title">Appointment History</h3>
        <table class="print-appt-table" v-if="patientAppointments.length > 0">
          <thead><tr><th>Appt. ID</th><th>Doctor</th><th>Date</th><th>Time</th><th>Condition/Notes</th><th>Status</th></tr></thead>
          <tbody>
            <tr v-for="appt in patientAppointments" :key="appt.id">
              <td>{{ appt.appointment_id }}</td><td>{{ appt.doctor || '—' }}</td>
              <td>{{ formatDate(appt.appointment_date) }}</td><td>{{ appt.appointment_time || '—' }}</td>
              <td>{{ appt.condition_notes || appt.note || '—' }}</td><td>{{ appt.status }}</td>
            </tr>
          </tbody>
        </table>
        <p v-else style="color:#666; font-size:13px">No appointment history recorded.</p>
        <div class="print-footer"><p>This document is generated by CareQueue and is for medical reference only.</p></div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'MedicalRecords',

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
      sortOpen: false,
      searchId: '',
      searchName: '',
      sortField: 'created_at',
      currentPage: 1,
      perPage: 10,
      loading: false,
      loadingAppts: false,
      viewingRecord: null,
      printingRecord: null,
      patients: [],
      appointments: [],
      patientAppointments: [],
      currentUser: JSON.parse(localStorage.getItem('user')) || { name: 'Admin', email: '' },
      // ✅ Reads permissions saved by DoctorAccess.vue after admin saves them
      livePerms: JSON.parse(localStorage.getItem('doctorPermissions') || '{}'),
    }
  },

  computed: {
    isAdmin() {
      return localStorage.getItem('role') === 'admin'
    },

    filteredPatients() {
      let list = [...this.patients]
      if (this.searchId) list = list.filter(p => (p.patient_id || '').toLowerCase().includes(this.searchId.toLowerCase()))
      if (this.searchName) list = list.filter(p => `${p.first_name} ${p.last_name}`.toLowerCase().includes(this.searchName.toLowerCase()))
      list.sort((a, b) => {
        const av = a[this.sortField] || '', bv = b[this.sortField] || ''
        return av < bv ? -1 : av > bv ? 1 : 0
      })
      const start = (this.currentPage - 1) * this.perPage
      return list.slice(start, start + this.perPage)
    },

    totalPages() {
      let list = this.patients
      if (this.searchId) list = list.filter(p => (p.patient_id || '').toLowerCase().includes(this.searchId.toLowerCase()))
      if (this.searchName) list = list.filter(p => `${p.first_name} ${p.last_name}`.toLowerCase().includes(this.searchName.toLowerCase()))
      return Math.max(1, Math.ceil(list.length / this.perPage))
    }
  },

  methods: {
    // ✅ Same permission checker used across all pages
    doctorCan(key) {
      return !!this.livePerms[key]
    },

    async fetchData() {
      this.loading = true
      try {
        const [pRes, aRes] = await Promise.all([
          fetch('http://localhost:8000/patients'),
          fetch('http://localhost:8000/appointments'),
        ])
        this.patients = await pRes.json()
        this.appointments = await aRes.json()
      } catch (err) {
        console.error('Failed to fetch records:', err)
      } finally {
        this.loading = false
      }
    },

    getAppointmentCount(patient) {
      return this.appointments.filter(a =>
        a.first_name === patient.first_name && a.last_name === patient.last_name
      ).length
    },

    async viewRecord(patient) {
      this.viewingRecord = patient
      this.loadingAppts = true
      this.patientAppointments = this.appointments.filter(a =>
        a.first_name === patient.first_name && a.last_name === patient.last_name
      )
      this.loadingAppts = false
    },

    async printRecord(patient) {
      this.printingRecord = patient
      this.patientAppointments = this.appointments.filter(a =>
        a.first_name === patient.first_name && a.last_name === patient.last_name
      )
      await this.$nextTick()
      const printArea = document.getElementById('print-area')
      const originalBody = document.body.innerHTML
      document.body.innerHTML = printArea.innerHTML
      window.print()
      document.body.innerHTML = originalBody
      window.location.reload()
    },

    formatDate(dateStr) {
      if (!dateStr) return '—'
      return new Date(dateStr).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })
    },

    goTo(page) {
      this.accountOpen = false
      if (page === 'edit-account') this.$router.push('/edit-profile')
    },

    handleLogout() {
      localStorage.removeItem('user')
      localStorage.removeItem('role')
      localStorage.removeItem('doctorPermissions')
      this.$router.push('/')
    }
  },

  mounted() {
    this.fetchData()
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
.layout { display: flex; min-height: 100vh; font-family: 'Plus Jakarta Sans', sans-serif; background: #f0f4f8; }

/* SIDEBAR */
.sidebar { width: 220px; min-height: 100vh; background: #1b2540; display: flex; flex-direction: column; transition: width 0.3s ease; overflow: hidden; flex-shrink: 0; }
.sidebar.collapsed { width: 64px; }
.sidebar.collapsed .nav-label, .sidebar.collapsed .nav-arrow, .sidebar.collapsed .nav-sub { display: none; }
.sidebar-logo { display: flex; align-items: center; justify-content: center; border-bottom: 1px solid rgba(255,255,255,0.07); margin-bottom: -12px; }
.sidebar-logo-img { width: 60%; height: 60%; border-radius: 10px; object-fit: cover; background: white; padding: 2px; transition: width 0.3s, height 0.3s; }
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
.role-tag { display: flex; align-items: center; gap: 10px; padding: 10px 16px; color: #3aa6a6; font-size: 12px; font-weight: 600; border-top: 1px solid rgba(255,255,255,0.06); margin-top: auto; }

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
.notif-dropdown { width: 280px; }
.notif-item { display: flex; align-items: flex-start; gap: 12px; padding: 12px 16px; cursor: pointer; transition: background 0.15s; }
.notif-item.unread { background: #f0fafa; }
.notif-dot { width: 8px; height: 8px; border-radius: 50%; background: #3aa6a6; margin-top: 5px; flex-shrink: 0; }
.notif-title { font-size: 13px; color: #1e293b; font-weight: 500; }
.notif-time { font-size: 11px; color: #94a3b8; margin-top: 2px; }
.account-wrapper { position: relative; cursor: pointer; }
.account-avatar { width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; color: white; }
.account-dropdown { width: 230px; }
.account-info { flex-direction: column; align-items: flex-start !important; gap: 3px; }
.account-name { font-size: 13px; font-weight: 600; color: #1e293b; }
.account-email { font-size: 11px; color: #94a3b8; }
.role-pill { margin-top: 4px; font-size: 10px; font-weight: 700; padding: 2px 10px; border-radius: 20px; }
.role-pill.admin  { background: #dbeafe; color: #1d4ed8; }
.role-pill.doctor { background: #d1fae5; color: #065f46; }
.dropdown-divider { border: none; border-top: 1px solid #f1f5f9; }
.dropdown-item { display: flex; align-items: center; gap: 10px; width: 100%; padding: 11px 16px; background: none; border: none; text-align: left; font-size: 13px; color: #475569; cursor: pointer; font-family: inherit; transition: background 0.15s; }
.dropdown-item:hover { background: #f8fafc; color: #1e293b; }
.dropdown-item.logout { color: #ef4444; }
.dropdown-item.logout:hover { background: #fff5f5; }

/* ACCESS DENIED */
.access-denied-page { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; gap: 20px; text-align: center; padding: 40px; }
.access-denied-icon { width: 100px; height: 100px; background: #fee2e2; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #dc2626; }
.access-denied-title { font-size: 24px; font-weight: 700; color: #1e293b; }
.access-denied-text { font-size: 14px; color: #64748b; max-width: 400px; line-height: 1.7; }
.btn-go-back { padding: 11px 28px; background: #3aa6a6; color: white; border: none; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; transition: background 0.2s; }
.btn-go-back:hover { background: #2e8b8b; }

/* CONTENT */
.content { padding: 28px; flex: 1; }
.page-title { font-size: 22px; font-weight: 700; color: #1e293b; }
.breadcrumb { font-size: 12px; color: #94a3b8; margin-top: 2px; }
.page-header { margin-bottom: 20px; }

/* TABLE CARD */
.table-card { background: white; border-radius: 16px; padding: 24px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
.toolbar { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 20px; }
.toolbar-left { display: flex; gap: 12px; flex-wrap: wrap; }
.toolbar-right { display: flex; gap: 10px; }
.search-box { display: flex; align-items: center; border: 1.5px solid #e2e8f0; border-radius: 8px; overflow: hidden; transition: border-color 0.2s; }
.search-box:focus-within { border-color: #3aa6a6; }
.search-input { padding: 8px 12px; border: none; outline: none; font-size: 13px; color: #475569; font-family: inherit; width: 160px; }
.search-btn { padding: 8px 12px; background: #3aa6a6; border: none; cursor: pointer; color: white; display: flex; align-items: center; }
.dropdown-wrapper { position: relative; }
.toolbar-btn { display: flex; align-items: center; gap: 6px; padding: 8px 16px; background: #3aa6a6; color: white; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; transition: background 0.2s; }
.toolbar-btn:hover { background: #2e8b8b; }
.toolbar-dropdown { position: absolute; top: calc(100% + 6px); right: 0; background: white; border-radius: 10px; box-shadow: 0 8px 30px rgba(0,0,0,0.12); z-index: 150; overflow: hidden; min-width: 160px; animation: fadeDown 0.15s ease; }
.toolbar-dropdown-item { display: block; width: 100%; padding: 10px 16px; background: none; border: none; text-align: left; font-size: 13px; color: #475569; cursor: pointer; font-family: inherit; transition: background 0.15s; }
.toolbar-dropdown-item:hover { background: #f8fafc; color: #1e293b; }
.loading-state { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 60px; color: #94a3b8; }
.loading-mini { text-align: center; padding: 20px; color: #94a3b8; font-size: 13px; }
.spinner { width: 32px; height: 32px; border: 3px solid #e2e8f0; border-top-color: #3aa6a6; border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* TABLE */
.records-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
.records-table th { text-align: left; padding: 10px 14px; color: #64748b; font-weight: 600; font-size: 12px; border-bottom: 2px solid #f1f5f9; }
.records-table td { padding: 12px 14px; color: #475569; border-bottom: 1px solid #f8fafc; }
.records-table tr:last-child td { border-bottom: none; }
.records-table tr:hover td { background: #f8fafc; }
.id-cell { font-family: monospace; font-size: 12px; color: #94a3b8; }
.name-cell { font-weight: 600; color: #1e293b; }
.date-cell { color: #94a3b8; font-size: 12px; }
.appt-badge { background: #e0f2fe; color: #0369a1; font-size: 11px; font-weight: 700; padding: 2px 10px; border-radius: 20px; }
.notes-cell { max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 12px; color: #64748b; }
.empty-row { text-align: center; color: #94a3b8; padding: 60px; }
.action-btns { display: flex; gap: 6px; }
.btn-view { display: inline-flex; align-items: center; gap: 4px; padding: 5px 12px; background: white; color: #3aa6a6; border: 1.5px solid #3aa6a6; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.2s; }
.btn-view:hover { background: #3aa6a6; color: white; }
.btn-print { display: inline-flex; align-items: center; gap: 4px; padding: 5px 12px; background: white; color: #6c63ff; border: 1.5px solid #6c63ff; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.2s; }
.btn-print:hover { background: #6c63ff; color: white; }
.pagination { display: flex; justify-content: center; gap: 6px; margin-top: 20px; padding-top: 16px; border-top: 1px solid #f1f5f9; }
.page-btn { padding: 6px 12px; border: 1.5px solid #e2e8f0; background: white; border-radius: 6px; font-size: 13px; color: #475569; cursor: pointer; font-family: inherit; transition: all 0.2s; }
.page-btn:hover:not(:disabled) { border-color: #3aa6a6; color: #3aa6a6; }
.page-btn.active { background: #3aa6a6; color: white; border-color: #3aa6a6; }
.page-btn:disabled { opacity: 0.4; cursor: not-allowed; }

/* MODAL */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; z-index: 500; padding: 20px; }
.modal { background: white; border-radius: 16px; width: 480px; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 20px 60px rgba(0,0,0,0.2); overflow: hidden; }
.modal-large { width: 820px; }
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid #f1f5f9; flex-shrink: 0; }
.modal-header h3 { font-size: 16px; font-weight: 700; color: #1e293b; }
.modal-header-actions { display: flex; align-items: center; gap: 10px; }
.modal-close { background: none; border: none; font-size: 16px; color: #94a3b8; cursor: pointer; }
.modal-close:hover { color: #1e293b; }
.btn-print-modal { display: inline-flex; align-items: center; gap: 6px; padding: 7px 14px; background: #6c63ff; color: white; border: none; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit; }
.btn-print-modal:hover { background: #5a51e0; }
.modal-body { padding: 24px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 16px; }
.modal-footer { padding: 16px 24px; border-top: 1px solid #f1f5f9; display: flex; justify-content: flex-end; gap: 10px; flex-shrink: 0; }
.btn-cancel { padding: 9px 20px; background: #f1f5f9; color: #475569; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; }
.btn-cancel:hover { background: #e2e8f0; }
.btn-print-confirm { display: inline-flex; align-items: center; gap: 6px; padding: 9px 20px; background: #6c63ff; color: white; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; }
.btn-print-confirm:hover { background: #5a51e0; }
.patient-header-card { display: flex; align-items: center; gap: 16px; background: linear-gradient(135deg, #3aa6a6, #2e8b8b); border-radius: 12px; padding: 18px 22px; color: white; }
.patient-avatar { width: 64px; height: 64px; border-radius: 50%; background: rgba(255,255,255,0.25); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.patient-header-info { flex: 1; }
.patient-full-name { font-size: 18px; font-weight: 700; }
.patient-id-tag { font-size: 12px; opacity: 0.8; margin-top: 4px; font-family: monospace; }
.patient-header-meta { display: flex; gap: 12px; }
.meta-chip { background: rgba(255,255,255,0.2); border-radius: 8px; padding: 8px 14px; text-align: center; font-size: 12px; }
.meta-chip-label { display: block; opacity: 0.75; margin-bottom: 2px; font-size: 11px; }
.record-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.record-section { background: #f8fafc; border-radius: 10px; padding: 14px 18px; }
.record-section.span-full { grid-column: span 2; }
.record-section-title { font-size: 11px; font-weight: 700; color: #3aa6a6; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 12px; display: flex; align-items: center; gap: 10px; }
.appt-count-badge { background: #3aa6a6; color: white; font-size: 11px; padding: 2px 8px; border-radius: 20px; font-weight: 600; }
.record-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
.record-row:last-child { border-bottom: none; }
.record-label { color: #94a3b8; font-weight: 500; }
.record-value { color: #1e293b; font-weight: 600; text-align: right; }
.no-appts { text-align: center; padding: 20px; color: #94a3b8; font-size: 13px; }
.appt-table { width: 100%; border-collapse: collapse; font-size: 12px; }
.appt-table th { text-align: left; padding: 8px 10px; color: #64748b; font-weight: 600; border-bottom: 1px solid #e2e8f0; }
.appt-table td { padding: 9px 10px; color: #475569; border-bottom: 1px solid #f8fafc; }
.appt-table tr:last-child td { border-bottom: none; }
.status-badge { font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 20px; text-transform: capitalize; }
.status-badge.waiting   { color: #ea580c; background: #ffedd5; }
.status-badge.approved  { color: #0369a1; background: #e0f2fe; }
.status-badge.arrived   { color: #6c63ff; background: #ede9fe; }
.status-badge.completed { color: #16a34a; background: #dcfce7; }
.status-badge.cancelled { color: #dc2626; background: #fee2e2; }

/* PRINT */
@media print {
  body * { visibility: hidden; }
  #print-area, #print-area * { visibility: visible; }
  #print-area { position: fixed; left: 0; top: 0; width: 100%; }
}
.print-doc { font-family: 'Plus Jakarta Sans', Arial, sans-serif; padding: 30px; color: #1e293b; }
.print-header { border-bottom: 2px solid #3aa6a6; padding-bottom: 12px; margin-bottom: 20px; }
.print-header h1 { font-size: 22px; color: #3aa6a6; }
.print-header p { font-size: 12px; color: #64748b; margin-top: 4px; }
.print-patient-name { font-size: 18px; margin-bottom: 16px; }
.print-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 13px; }
.print-table td { padding: 8px 12px; border: 1px solid #e2e8f0; }
.print-table .pl { background: #f8fafc; width: 140px; }
.print-section-title { font-size: 14px; font-weight: 700; color: #3aa6a6; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
.print-appt-table { width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 20px; }
.print-appt-table th { background: #3aa6a6; color: white; padding: 8px 10px; text-align: left; }
.print-appt-table td { padding: 8px 10px; border: 1px solid #e2e8f0; }
.print-appt-table tr:nth-child(even) td { background: #f8fafc; }
.print-footer { border-top: 1px solid #e2e8f0; margin-top: 30px; padding-top: 10px; font-size: 11px; color: #94a3b8; }

@media (max-width: 768px) {
  .sidebar { position: fixed; z-index: 300; height: 100vh; }
  .content { padding: 16px; }
  .record-grid { grid-template-columns: 1fr; }
  .record-section.span-full { grid-column: span 1; }
  .modal-large { width: 95vw; }
  .patient-header-card { flex-wrap: wrap; }
}
</style>