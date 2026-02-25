<template>
  <div class="layout">
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

    <div class="main-wrapper">
      <header class="topbar">
        <div class="topbar-left">
          <button class="hamburger" @click="sidebarCollapsed = !sidebarCollapsed">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
        </div>
        <div class="topbar-right">
          <div class="account-wrapper" @click="accountOpen = !accountOpen" v-click-outside="() => accountOpen = false">
            <div class="account-avatar"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg></div>
            <div class="dropdown account-dropdown" v-show="accountOpen" @click.stop>
              <div class="dropdown-header account-info">
                <p class="account-name">{{ currentUser.name }}</p>
                <p class="account-email">{{ currentUser.email }}</p>
                <span class="role-pill" :class="isAdmin ? 'admin' : 'doctor'">{{ isAdmin ? 'Admin' : 'Doctor' }}</span>
              </div>
              <hr class="dropdown-divider"/>
              <button class="dropdown-item logout" @click="handleLogout">Logout</button>
            </div>
          </div>
        </div>
      </header>

      <!-- ACCESS DENIED -->
      <main class="content" v-if="!isAdmin && !doctorCan('view_medical_records')">
        <div class="access-denied-page">
          <div class="access-denied-icon"><svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg></div>
          <h2 class="access-denied-title">Access Restricted</h2>
          <p class="access-denied-text">You don't have permission to view Medical Records. Please contact your administrator.</p>
          <button class="btn-go-back" @click="$router.push('/dashboard')">← Go to Dashboard</button>
        </div>
      </main>

      <main class="content" v-else>
        <div class="page-header">
          <h1 class="page-title">{{ patient ? patient.first_name + ' ' + patient.last_name : 'Loading...' }}</h1>
          <p class="breadcrumb">
            <span class="breadcrumb-link" @click="$router.push('/medical-records')">Medical Records</span>
            / {{ patient ? patient.patient_id : '...' }}
          </p>
        </div>

        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Loading patient record...</p>
        </div>

        <div class="record-layout" v-else-if="patient">
          <div class="left-panel">
            <div class="patient-card">
              <p class="patient-card-label">PATIENT RECORDS</p>
              <div class="patient-photo-wrap">
                <div class="patient-photo"><svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg></div>
              </div>
              <nav class="record-nav">
                <button :class="['record-nav-item', { active: activeTab === 'visits' }]" @click="activeTab = 'visits'">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  Past Visits
                </button>
                <button :class="['record-nav-item', { active: activeTab === 'prescriptions' }]" @click="activeTab = 'prescriptions'">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                  Prescriptions
                </button>
                <button :class="['record-nav-item', { active: activeTab === 'reports' }]" @click="activeTab = 'reports'">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                  Reports
                </button>
                <button :class="['record-nav-item', { active: activeTab === 'profile' }]" @click="activeTab = 'profile'">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                  Patient Profile
                </button>
              </nav>
            </div>
          </div>

          <div class="right-panel">

            <!-- PAST VISITS -->
            <div v-if="activeTab === 'visits'" class="panel-card">
              <div class="panel-toolbar">
                <h2 class="panel-title">PAST VISITS</h2>
                <button v-if="isAdmin || doctorCan('print_records')" class="action-btn teal" @click="printTab('visits')">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                  Print
                </button>
              </div>
              <table class="data-table" v-if="appointments.length > 0">
                <thead>
                  <tr>
                    <th>ID</th><th>Doctor</th><th>Date &amp; Time</th><th>Condition / Notes</th><th>Status</th>
                    <th v-if="isAdmin || doctorCan('view_patient_profile')">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="appt in appointments" :key="appt.id">
                    <td class="mono">{{ appt.appointment_id }}</td>
                    <td>{{ appt.doctor || '—' }}</td>
                    <td>{{ formatDateTime(appt.appointment_date, appt.appointment_time) }}</td>
                    <td class="notes-cell">{{ appt.condition_notes || appt.note || '—' }}</td>
                    <td><span :class="['status-badge', appt.status]">{{ appt.status }}</span></td>
                    <td v-if="isAdmin || doctorCan('view_patient_profile')">
                      <div class="row-actions">
                        <button class="btn-sm view" @click="viewAppointment(appt)">View</button>
                        <button v-if="isAdmin" class="btn-sm del" @click="deleteAppointment(appt)">Delete</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div class="empty-panel" v-else>
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <p>No past visits recorded.</p>
              </div>
            </div>

            <!-- PRESCRIPTIONS -->
            <div v-if="activeTab === 'prescriptions'" class="panel-card">
              <div class="panel-toolbar">
                <h2 class="panel-title">PRESCRIPTIONS</h2>
                <button v-if="isAdmin || doctorCan('print_records')" class="action-btn teal" @click="printTab('prescriptions')">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                  Print
                </button>
              </div>
              <table class="data-table" v-if="appointments.length > 0">
                <thead>
                  <tr>
                    <th>ID</th><th>Doctor</th><th>Date</th>
                    <th v-if="isAdmin || doctorCan('view_patient_profile')">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="appt in appointments" :key="appt.id">
                    <td class="mono">RX-{{ String(appt.id).padStart(4,'0') }}</td>
                    <td>{{ appt.doctor || '—' }}</td>
                    <td>{{ formatDate(appt.appointment_date) }}</td>
                    <td v-if="isAdmin || doctorCan('view_patient_profile')">
                      <div class="row-actions">
                        <button class="btn-sm view" @click="viewAppointment(appt)">View</button>
                        <button v-if="isAdmin" class="btn-sm del">Delete</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div class="empty-panel" v-else>
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                <p>No prescriptions found.</p>
              </div>
            </div>

            <!-- REPORTS -->
            <div v-if="activeTab === 'reports'" class="panel-card">
              <div class="panel-toolbar">
                <h2 class="panel-title">REPORTS</h2>
                <button v-if="isAdmin || doctorCan('print_records')" class="action-btn teal" @click="printTab('reports')">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                  Print
                </button>
              </div>
              <div class="empty-panel">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                <p>No reports available yet.</p>
              </div>
            </div>

            <!-- PATIENT PROFILE -->
            <div v-if="activeTab === 'profile'" class="panel-card">
              <div class="panel-toolbar">
                <h2 class="panel-title">PATIENT PROFILE</h2>
                <button v-if="isAdmin || doctorCan('print_records')" class="action-btn teal" @click="printTab('profile')">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                  Print
                </button>
              </div>
              <div class="profile-photo-row">
                <div class="profile-photo-box"><svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg></div>
                <div>
                  <p class="photo-label">Profile Photo</p>
                  <p class="photo-hint">Accepted file type png and jpg. Less than 1MB</p>
                  <button v-if="isAdmin" class="upload-btn">Upload</button>
                </div>
              </div>
              <div class="profile-section-title">PERSONAL INFORMATION</div>
              <div class="profile-grid">
                <div class="profile-field"><label>Last Name</label><input type="text" :value="patient.last_name" readonly /></div>
                <div class="profile-field"><label>First Name</label><input type="text" :value="patient.first_name" readonly /></div>
                <div class="profile-field"><label>Name Extension (If available)</label><input type="text" :value="patient.name_extension || ''" readonly /></div>
                <div class="profile-field"><label>Middle Name</label><input type="text" :value="patient.middle_name || ''" readonly /></div>
              </div>
              <div class="profile-grid cols-4">
                <div class="profile-field">
                  <label>Gender</label>
                  <div class="radio-group">
                    <label class="radio-label"><input type="radio" :checked="patient.gender === 'Male'" disabled /> Male</label>
                    <label class="radio-label"><input type="radio" :checked="patient.gender === 'Female'" disabled /> Female</label>
                  </div>
                </div>
                <div class="profile-field"><label>Date of Birth</label><input type="text" :value="formatDate(patient.date_of_birth)" readonly /></div>
                <div class="profile-field"><label>Age</label><input type="text" :value="patient.age || ''" readonly /></div>
                <div class="profile-field"><label>Religion</label><input type="text" :value="patient.religion || ''" readonly /></div>
              </div>
              <div class="profile-section-title">CONTACT INFORMATION</div>
              <div class="profile-grid">
                <div class="profile-field"><label>Landline Number</label><input type="text" :value="patient.landline || ''" readonly /></div>
                <div class="profile-field"><label>Mobile Number</label><input type="text" :value="patient.mobile || ''" readonly /></div>
                <div class="profile-field span-2"><label>Email Address</label><input type="text" :value="patient.email || ''" readonly /></div>
              </div>
              <div class="profile-section-title">ADDRESS</div>
              <div class="profile-grid cols-5">
                <div class="profile-field"><label>Unit/Room/Floor</label><input type="text" value="N/A" readonly /></div>
                <div class="profile-field"><label>Building No.</label><input type="text" value="N/A" readonly /></div>
                <div class="profile-field"><label>Street</label><input type="text" value="N/A" readonly /></div>
                <div class="profile-field"><label>Subdivision/Village</label><input type="text" value="N/A" readonly /></div>
                <div class="profile-field"><label>Barangay</label><input type="text" value="N/A" readonly /></div>
              </div>
              <div class="profile-grid cols-3">
                <div class="profile-field"><label>City/Municipality</label><input type="text" value="N/A" readonly /></div>
                <div class="profile-field"><label>Province</label><input type="text" value="N/A" readonly /></div>
                <div class="profile-field"><label>ZIP</label><input type="text" value="N/A" readonly /></div>
              </div>
            </div>

          </div>
        </div>

        <div class="not-found" v-else-if="!loading">
          <p>Patient not found. <span class="back-link" @click="$router.push('/medical-records')">Go back</span></p>
        </div>
      </main>
    </div>

    <!-- APPOINTMENT DETAIL MODAL -->
    <div class="modal-overlay" v-if="viewingAppt" @click.self="viewingAppt = null">
      <div class="modal">
        <div class="modal-header">
          <h3>Appointment Detail</h3>
          <button class="modal-close" @click="viewingAppt = null">✕</button>
        </div>
        <div class="modal-body" v-if="viewingAppt">
          <div class="detail-row"><span class="detail-label">Appointment ID</span><span class="detail-value mono">{{ viewingAppt.appointment_id }}</span></div>
          <div class="detail-row"><span class="detail-label">Doctor</span><span class="detail-value">{{ viewingAppt.doctor || '—' }}</span></div>
          <div class="detail-row"><span class="detail-label">Date</span><span class="detail-value">{{ formatDate(viewingAppt.appointment_date) }}</span></div>
          <div class="detail-row"><span class="detail-label">Time</span><span class="detail-value">{{ viewingAppt.appointment_time || '—' }}</span></div>
          <div class="detail-row"><span class="detail-label">Status</span><span :class="['status-badge', viewingAppt.status]">{{ viewingAppt.status }}</span></div>
          <div class="detail-row"><span class="detail-label">Condition / Notes</span><span class="detail-value">{{ viewingAppt.condition_notes || '—' }}</span></div>
          <div class="detail-row"><span class="detail-label">Additional Note</span><span class="detail-value">{{ viewingAppt.note || '—' }}</span></div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="viewingAppt = null">Close</button>
          <button v-if="isAdmin || doctorCan('print_records')" class="btn-print-confirm" @click="printAppointment(viewingAppt)">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
            Print
          </button>
        </div>
      </div>
    </div>

    <!-- HIDDEN PRINT AREA -->
    <div id="print-section" style="display:none">
      <div class="print-doc" v-if="patient">
        <div class="print-header">
          <h1>CareQueue — {{ printTitle }}</h1>
          <p>Patient: <strong>{{ patient.last_name }}, {{ patient.first_name }}</strong> | ID: {{ patient.patient_id }}</p>
          <p>Printed: {{ new Date().toLocaleDateString('en-PH', { year:'numeric', month:'long', day:'numeric' }) }}</p>
        </div>
        <template v-if="printMode === 'profile'">
          <table class="print-table">
            <tbody>
              <tr><td class="pl"><strong>Last Name</strong></td><td>{{ patient.last_name }}</td><td class="pl"><strong>First Name</strong></td><td>{{ patient.first_name }}</td></tr>
              <tr><td class="pl"><strong>Middle Name</strong></td><td>{{ patient.middle_name || '—' }}</td><td class="pl"><strong>Extension</strong></td><td>{{ patient.name_extension || '—' }}</td></tr>
              <tr><td class="pl"><strong>Gender</strong></td><td>{{ patient.gender || '—' }}</td><td class="pl"><strong>Date of Birth</strong></td><td>{{ formatDate(patient.date_of_birth) }}</td></tr>
              <tr><td class="pl"><strong>Age</strong></td><td>{{ patient.age || '—' }}</td><td class="pl"><strong>Religion</strong></td><td>{{ patient.religion || '—' }}</td></tr>
              <tr><td class="pl"><strong>Mobile</strong></td><td>{{ patient.mobile || '—' }}</td><td class="pl"><strong>Landline</strong></td><td>{{ patient.landline || '—' }}</td></tr>
              <tr><td class="pl"><strong>Email</strong></td><td colspan="3">{{ patient.email || '—' }}</td></tr>
            </tbody>
          </table>
        </template>
        <template v-if="printMode === 'visits' || printMode === 'prescriptions'">
          <table class="print-appt-table">
            <thead><tr><th>ID</th><th>Doctor</th><th>Date</th><th>Time</th><th>Notes</th><th>Status</th></tr></thead>
            <tbody>
              <tr v-for="a in appointments" :key="a.id">
                <td>{{ a.appointment_id }}</td><td>{{ a.doctor || '—' }}</td>
                <td>{{ formatDate(a.appointment_date) }}</td><td>{{ a.appointment_time || '—' }}</td>
                <td>{{ a.condition_notes || a.note || '—' }}</td><td>{{ a.status }}</td>
              </tr>
            </tbody>
          </table>
          <p v-if="appointments.length === 0" style="color:#666;font-size:13px">No records found.</p>
        </template>
        <div class="print-footer"><p>CareQueue Medical Information System — Confidential</p></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PatientRecord',
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
      accountOpen: false,
      appointmentsOpen: false,
      activeTab: 'visits',
      loading: true,
      patient: null,
      appointments: [],
      viewingAppt: null,
      printMode: 'visits',
      printTitle: '',
      currentUser: JSON.parse(localStorage.getItem('user')) || { name: 'Admin', email: '' },
      livePerms: JSON.parse(localStorage.getItem('doctorPermissions') || '{}'),
    }
  },
  computed: {
    isAdmin() { return localStorage.getItem('role') === 'admin' }
  },
  async mounted() {
    await this.fetchPatient(this.$route.params.id)
  },
  methods: {
    doctorCan(key) { return !!this.livePerms[key] },
    async fetchPatient(id) {
      this.loading = true
      try {
        const [pRes, aRes] = await Promise.all([
          fetch(`http://localhost:8000/patients/${id}`),
          fetch('http://localhost:8000/appointments'),
        ])
        this.patient = await pRes.json()
        const allAppts = await aRes.json()
        this.appointments = allAppts.filter(a =>
          a.first_name === this.patient.first_name && a.last_name === this.patient.last_name
        )
      } catch (err) { console.error('Failed to load patient:', err); this.patient = null }
      finally { this.loading = false }
    },
    viewAppointment(appt) { this.viewingAppt = appt },
    async deleteAppointment(appt) {
      if (!confirm(`Delete appointment ${appt.appointment_id}?`)) return
      try {
        await fetch(`http://localhost:8000/appointments/${appt.id}`, { method: 'DELETE' })
        this.appointments = this.appointments.filter(a => a.id !== appt.id)
      } catch { alert('Failed to delete.') }
    },
    printTab(tab) {
      const titles = { visits: 'Past Visits', prescriptions: 'Prescriptions', reports: 'Reports', profile: 'Patient Profile' }
      this.printMode = tab; this.printTitle = titles[tab]
      this.$nextTick(() => {
        const orig = document.body.innerHTML
        document.body.innerHTML = document.getElementById('print-section').innerHTML
        window.print(); document.body.innerHTML = orig; window.location.reload()
      })
    },
    printAppointment() {
      this.printMode = 'visits'; this.printTitle = 'Appointment Detail'
      this.$nextTick(() => {
        const orig = document.body.innerHTML
        document.body.innerHTML = document.getElementById('print-section').innerHTML
        window.print(); document.body.innerHTML = orig; window.location.reload()
      })
    },
    formatDate(d) { if (!d) return 'N/A'; return new Date(d).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' }) },
    formatDateTime(date, time) {
      if (!date) return '—'
      const d = new Date(date).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })
      return time ? `${d} ${time}` : d
    },
    handleLogout() { localStorage.removeItem('user'); localStorage.removeItem('role'); localStorage.removeItem('doctorPermissions'); this.$router.push('/') }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
.layout { display: flex; min-height: 100vh; font-family: 'Plus Jakarta Sans', sans-serif; background: #f0f4f8; }
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
.role-tag { display: flex; align-items: center; gap: 10px; padding: 10px 16px; color: #3aa6a6; font-size: 12px; font-weight: 600; border-top: 1px solid rgba(255,255,255,0.06); margin-top: auto; }
.main-wrapper { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.topbar { height: 60px; background: #3aa6a6; display: flex; align-items: center; justify-content: space-between; padding: 0 24px; position: sticky; top: 0; z-index: 100; }
.hamburger { background: none; border: none; cursor: pointer; color: #fff; display: flex; padding: 6px; border-radius: 8px; }
.hamburger:hover { background: rgba(255,255,255,0.15); }
.topbar-right { display: flex; align-items: center; gap: 8px; }
.account-wrapper { position: relative; cursor: pointer; }
.account-avatar { width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.25); display: flex; align-items: center; justify-content: center; color: white; }
.dropdown { position: absolute; top: calc(100% + 10px); right: 0; background: white; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.12); z-index: 200; overflow: hidden; }
.dropdown-header { padding: 14px 16px; display: flex; justify-content: space-between; align-items: center; font-weight: 600; font-size: 13px; color: #1e293b; border-bottom: 1px solid #f1f5f9; }
.account-dropdown { width: 220px; }
.account-info { flex-direction: column; align-items: flex-start !important; gap: 3px; }
.account-name { font-size: 13px; font-weight: 600; color: #1e293b; }
.account-email { font-size: 11px; color: #94a3b8; }
.role-pill { margin-top: 4px; font-size: 10px; font-weight: 700; padding: 2px 10px; border-radius: 20px; }
.role-pill.admin { background: #dbeafe; color: #1d4ed8; }
.role-pill.doctor { background: #d1fae5; color: #065f46; }
.dropdown-divider { border: none; border-top: 1px solid #f1f5f9; }
.dropdown-item { display: flex; align-items: center; gap: 10px; width: 100%; padding: 11px 16px; background: none; border: none; text-align: left; font-size: 13px; color: #475569; cursor: pointer; font-family: inherit; }
.dropdown-item.logout { color: #ef4444; }
.dropdown-item:hover { background: #f8fafc; }
.access-denied-page { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; gap: 20px; text-align: center; padding: 40px; }
.access-denied-icon { width: 100px; height: 100px; background: #fee2e2; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #dc2626; }
.access-denied-title { font-size: 24px; font-weight: 700; color: #1e293b; }
.access-denied-text { font-size: 14px; color: #64748b; max-width: 400px; line-height: 1.7; }
.btn-go-back { padding: 11px 28px; background: #3aa6a6; color: white; border: none; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; }
.btn-go-back:hover { background: #2e8b8b; }
.content { padding: 28px; flex: 1; }
.page-title { font-size: 22px; font-weight: 700; color: #1e293b; }
.breadcrumb { font-size: 12px; color: #94a3b8; margin-top: 2px; }
.breadcrumb-link { color: #3aa6a6; cursor: pointer; text-decoration: underline; }
.page-header { margin-bottom: 20px; }
.loading-state { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 80px; color: #94a3b8; }
.spinner { width: 32px; height: 32px; border: 3px solid #e2e8f0; border-top-color: #3aa6a6; border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.record-layout { display: grid; grid-template-columns: 260px 1fr; gap: 20px; align-items: start; }
.patient-card { background: white; border-radius: 16px; padding: 20px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
.patient-card-label { font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 16px; }
.patient-photo-wrap { display: flex; justify-content: center; margin-bottom: 20px; }
.patient-photo { width: 120px; height: 120px; border-radius: 50%; background: #e2e8f0; display: flex; align-items: center; justify-content: center; color: #94a3b8; border: 3px solid #f1f5f9; }
.record-nav { display: flex; flex-direction: column; gap: 4px; }
.record-nav-item { display: flex; align-items: center; gap: 10px; width: 100%; padding: 11px 14px; background: none; border: none; text-align: left; font-size: 13.5px; font-weight: 500; color: #64748b; cursor: pointer; border-radius: 10px; font-family: inherit; transition: all 0.2s; }
.record-nav-item:hover { background: #f0fafa; color: #3aa6a6; }
.record-nav-item.active { background: #3aa6a6; color: white; }
.right-panel { min-width: 0; overflow: hidden; }
.panel-card { background: white; border-radius: 16px; padding: 24px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
.panel-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.panel-title { font-size: 15px; font-weight: 700; color: #1e293b; }
.action-btn { display: inline-flex; align-items: center; gap: 6px; padding: 7px 16px; border: none; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit; }
.action-btn.teal { background: #3aa6a6; color: white; }
.action-btn.teal:hover { background: #2e8b8b; }
.data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.data-table th { text-align: left; padding: 10px 14px; color: #64748b; font-weight: 600; font-size: 12px; border-bottom: 2px solid #f1f5f9; }
.data-table td { padding: 12px 14px; color: #475569; border-bottom: 1px solid #f8fafc; }
.data-table tr:last-child td { border-bottom: none; }
.data-table tr:hover td { background: #f8fafc; }
.mono { font-family: monospace; font-size: 12px; color: #94a3b8; }
.notes-cell { max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 12px; color: #64748b; }
.row-actions { display: flex; gap: 6px; }
.btn-sm { padding: 4px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.2s; }
.btn-sm.view { background: white; color: #3aa6a6; border: 1.5px solid #3aa6a6; }
.btn-sm.view:hover { background: #3aa6a6; color: white; }
.btn-sm.del { background: white; color: #ef4444; border: 1.5px solid #ef4444; }
.btn-sm.del:hover { background: #ef4444; color: white; }
.status-badge { font-size: 11px; font-weight: 700; padding: 2px 10px; border-radius: 20px; text-transform: capitalize; }
.status-badge.waiting   { color: #ea580c; background: #ffedd5; }
.status-badge.approved  { color: #0369a1; background: #e0f2fe; }
.status-badge.arrived   { color: #6c63ff; background: #ede9fe; }
.status-badge.completed { color: #16a34a; background: #dcfce7; }
.status-badge.cancelled { color: #dc2626; background: #fee2e2; }
.empty-panel { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 60px; color: #94a3b8; }
.empty-panel p { font-size: 13px; }
.profile-photo-row { display: flex; align-items: center; gap: 20px; padding: 16px; background: #f8fafc; border-radius: 12px; margin-bottom: 20px; }
.profile-photo-box { width: 72px; height: 72px; border-radius: 50%; background: #e2e8f0; display: flex; align-items: center; justify-content: center; color: #94a3b8; flex-shrink: 0; }
.photo-label { font-size: 13px; font-weight: 600; color: #1e293b; margin-bottom: 4px; }
.photo-hint { font-size: 11px; color: #94a3b8; margin-bottom: 8px; }
.upload-btn { padding: 6px 16px; background: white; border: 1.5px solid #e2e8f0; border-radius: 7px; font-size: 12px; font-weight: 600; color: #475569; cursor: pointer; font-family: inherit; }
.upload-btn:hover { border-color: #3aa6a6; color: #3aa6a6; }
.profile-section-title { font-size: 11px; font-weight: 700; color: #3aa6a6; text-transform: uppercase; letter-spacing: 0.8px; padding-bottom: 8px; border-bottom: 1.5px solid #e2e8f0; margin: 18px 0 12px; }
.profile-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; margin-bottom: 8px; }
.profile-grid.cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.profile-grid.cols-5 { grid-template-columns: repeat(5, minmax(0, 1fr)); }
.profile-grid.cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.profile-field { display: flex; flex-direction: column; gap: 4px; }
.profile-field.span-2 { grid-column: span 2; }
.profile-field label { font-size: 11px; font-weight: 600; color: #374151; }
.profile-field input { width: 100%; padding: 8px 12px; border: 1.5px solid #e2e8f0; border-radius: 8px; font-size: 13px; color: #475569; background: #f8fafc; font-family: inherit; outline: none; min-width: 0; }
.radio-group { display: flex; gap: 14px; padding: 8px 0; }
.radio-label { display: flex; align-items: center; gap: 6px; font-size: 13px; color: #475569; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; z-index: 500; padding: 20px; }
.modal { background: white; border-radius: 16px; width: 480px; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 20px 60px rgba(0,0,0,0.2); overflow: hidden; }
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid #f1f5f9; }
.modal-header h3 { font-size: 16px; font-weight: 700; color: #1e293b; }
.modal-close { background: none; border: none; font-size: 16px; color: #94a3b8; cursor: pointer; }
.modal-body { padding: 24px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 12px; }
.modal-footer { padding: 16px 24px; border-top: 1px solid #f1f5f9; display: flex; justify-content: flex-end; gap: 10px; }
.detail-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
.detail-row:last-child { border-bottom: none; }
.detail-label { color: #94a3b8; font-weight: 500; }
.detail-value { color: #1e293b; font-weight: 600; text-align: right; }
.btn-cancel { padding: 9px 20px; background: #f1f5f9; color: #475569; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; }
.btn-print-confirm { display: inline-flex; align-items: center; gap: 6px; padding: 9px 20px; background: #3aa6a6; color: white; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; }
.not-found { text-align: center; padding: 60px; color: #94a3b8; }
.back-link { color: #3aa6a6; cursor: pointer; text-decoration: underline; }
@media print {
  body * { visibility: hidden; }
  #print-section, #print-section * { visibility: visible; }
  #print-section { position: fixed; left: 0; top: 0; width: 100%; }
}
.print-doc { font-family: Arial, sans-serif; padding: 30px; color: #1e293b; }
.print-header { border-bottom: 2px solid #3aa6a6; padding-bottom: 12px; margin-bottom: 16px; }
.print-header h1 { font-size: 20px; color: #3aa6a6; }
.print-header p { font-size: 12px; color: #64748b; margin-top: 4px; }
.print-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px; }
.print-table td { padding: 8px 12px; border: 1px solid #e2e8f0; }
.print-table .pl { background: #f8fafc; width: 140px; }
.print-appt-table { width: 100%; border-collapse: collapse; font-size: 12px; }
.print-appt-table th { background: #3aa6a6; color: white; padding: 8px 10px; text-align: left; }
.print-appt-table td { padding: 8px 10px; border: 1px solid #e2e8f0; }
.print-appt-table tr:nth-child(even) td { background: #f8fafc; }
.print-footer { border-top: 1px solid #e2e8f0; margin-top: 24px; padding-top: 10px; font-size: 11px; color: #94a3b8; }
@media (max-width: 900px) {
  .record-layout { grid-template-columns: 1fr; }
  .profile-grid { grid-template-columns: 1fr 1fr; }
  .profile-grid.cols-5 { grid-template-columns: 1fr 1fr; }
}
</style>