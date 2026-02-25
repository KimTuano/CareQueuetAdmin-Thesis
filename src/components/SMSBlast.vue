<template>
  <div class="layout">

    <!-- ── TOAST ── -->
    <transition name="toast">
      <div v-if="toast" :class="['toast', toast.type]">
        <svg v-if="toast.type === 'toast-green'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
        <svg v-else-if="toast.type === 'toast-red'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        {{ toast.message }}
      </div>
    </transition>

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
          <div class="account-wrapper" @click="accountOpen = !accountOpen" v-click-outside="() => accountOpen = false">
            <div class="account-avatar"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg></div>
            <div class="dropdown account-dropdown" v-show="accountOpen" @click.stop>
              <div class="dropdown-header account-info">
                <p class="account-name">{{ currentUser.name }}</p>
                <p class="account-email">{{ currentUser.email }}</p>
                <span class="role-pill" :class="isAdmin ? 'admin' : 'doctor'">{{ isAdmin ? 'Admin' : 'Doctor' }}</span>
              </div>
              <hr class="dropdown-divider"/>
              <button class="dropdown-item" @click="$router.push('/edit-profile')">
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

      <!-- ACCESS DENIED — doctor trying to reach this admin-only page -->
      <main class="content" v-if="!isAdmin">
        <div class="access-denied-page">
          <div class="access-denied-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
          </div>
          <h2 class="access-denied-title">Admin Access Only</h2>
          <p class="access-denied-text">This page is restricted to administrators. You do not have permission to access SMS Blast.</p>
          <button class="btn-go-back" @click="$router.push('/dashboard')">← Go to Dashboard</button>
        </div>
      </main>

      <!-- ADMIN SMS BLAST PAGE -->
      <main class="content" v-else>
        <div class="page-header">
          <h1 class="page-title">SMS BLAST</h1>
          <p class="breadcrumb">Home / SMS Blast</p>
        </div>

        <div class="sms-layout">

          <!-- ── LEFT: Compose Panel ── -->
          <div class="compose-panel">

            <!-- Sender Info -->
            <div class="panel-card">
              <div class="panel-card-header">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                <span>Sender</span>
              </div>
              <div class="field-group">
                <label>Hospital / Sender Name</label>
                <input type="text" v-model="senderName" placeholder="e.g. CareQueue " />
              </div>
            </div>

            <!-- Message Template -->
            <div class="panel-card">
              <div class="panel-card-header">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                <span>Message</span>
              </div>

              <!-- Quick Templates -->
              <div class="template-row">
                <span class="template-label">Quick Templates:</span>
                <div class="template-chips">
                  <button class="chip" v-for="t in templates" :key="t.label" @click="applyTemplate(t)">{{ t.label }}</button>
                </div>
              </div>

              <!-- Variable Tags -->
              <div class="variable-row">
                <span class="template-label">Insert Variable:</span>
                <div class="template-chips">
                  <button class="chip chip-var" v-for="v in variables" :key="v" @click="insertVariable(v)">{{ v }}</button>
                </div>
              </div>

              <div class="field-group">
                <label>Message Body <span class="required">*</span></label>
                <textarea
                  ref="messageBox"
                  v-model="messageBody"
                  placeholder="Type your message here. Use variables like {name}, {date}, {time}, {doctor} to personalize."
                  rows="6"
                  maxlength="640"
                ></textarea>
                <div class="char-row">
                  <span class="char-count" :class="{ warn: messageBody.length > 500, danger: messageBody.length > 600 }">
                    {{ messageBody.length }} / 640 characters · {{ smsCount }} SMS
                  </span>
                </div>
              </div>

              <!-- Schedule Option -->
              <div class="schedule-toggle" @click="scheduled = !scheduled">
                <div class="toggle-track" :class="{ active: scheduled }">
                  <div class="toggle-thumb"></div>
                </div>
                <span>Schedule for later</span>
              </div>
              <div class="field-group" v-if="scheduled">
                <label>Send Date & Time</label>
                <input type="datetime-local" v-model="scheduleTime" :min="minScheduleTime" />
              </div>
            </div>

            <!-- Preview -->
            <div class="panel-card preview-card">
              <div class="panel-card-header">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                <span>Preview</span>
              </div>
              <div class="phone-mockup">
                <div class="phone-screen">
                  <div class="phone-sender">{{ senderName || 'Hospital' }}</div>
                  <div class="phone-bubble">
                    <p>{{ previewMessage || 'Your message will appear here...' }}</p>
                  </div>
                  <div class="phone-time">{{ currentTimeStr }}</div>
                </div>
              </div>
            </div>

          </div>

          <!-- ── RIGHT: Recipients Panel ── -->
          <div class="recipients-panel">

            <!-- Stats bar -->
            <div class="stats-bar">
              <div class="stat-pill">
                <span class="stat-pill-num">{{ patients.length }}</span>
                <span class="stat-pill-label">Total Patients</span>
              </div>
              <div class="stat-pill selected">
                <span class="stat-pill-num">{{ selectedPatients.length }}</span>
                <span class="stat-pill-label">Selected</span>
              </div>
              <div class="stat-pill">
                <span class="stat-pill-num">{{ patients.filter(p => p.mobile).length }}</span>
                <span class="stat-pill-label">With Number</span>
              </div>
            </div>

            <!-- Filter & Search -->
            <div class="panel-card">
              <div class="panel-card-header">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                <span>Recipients</span>
                <div class="select-all-wrap">
                  <input type="checkbox" id="selectAll" :checked="allSelected" @change="toggleSelectAll" />
                  <label for="selectAll">Select all with number</label>
                </div>
              </div>

              <div class="filter-row">
                <div class="search-box">
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                  <input type="text" v-model="searchPatient" placeholder="Search patient name or number..." />
                </div>
                <select v-model="filterHasNumber" class="filter-select">
                  <option value="all">All Patients</option>
                  <option value="yes">Has Number</option>
                  <option value="no">No Number</option>
                </select>
              </div>

              <div v-if="loadingPatients" class="loading-state">
                <div class="spinner"></div>
                <p>Loading patients...</p>
              </div>

              <div class="patient-list" v-else>
                <div v-if="filteredPatients.length === 0" class="empty-list">
                  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  <p>No patients found.</p>
                </div>
                <div
                  v-for="patient in filteredPatients"
                  :key="patient.id"
                  class="patient-row"
                  :class="{ selected: isSelected(patient), 'no-number': !patient.mobile }"
                  @click="patient.mobile && togglePatient(patient)"
                >
                  <input
                    type="checkbox"
                    :checked="isSelected(patient)"
                    :disabled="!patient.mobile"
                    @click.stop
                    @change="togglePatient(patient)"
                  />
                  <div class="patient-avatar">{{ initials(patient) }}</div>
                  <div class="patient-info">
                    <span class="patient-name">{{ patient.last_name }}, {{ patient.first_name }}</span>
                    <span class="patient-number" v-if="patient.mobile">{{ patient.mobile }}</span>
                    <span class="patient-number no-num" v-else>No number on file</span>
                  </div>
                  <span v-if="!patient.mobile" class="no-num-badge">No #</span>
                </div>
              </div>
            </div>

            <!-- Send Button -->
            <button
              class="btn-send"
              :disabled="!canSend || sending"
              @click="confirmSend"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
              <span v-if="sending">Sending... ({{ sentCount }}/{{ selectedPatients.length }})</span>
              <span v-else-if="scheduled">Schedule SMS Blast</span>
              <span v-else>Send SMS Blast · {{ selectedPatients.length }} recipient{{ selectedPatients.length !== 1 ? 's' : '' }}</span>
            </button>

          </div>
        </div>

        <!-- ── SEND HISTORY ── -->
        <div class="history-card">
          <div class="history-header">
            <h3>Send History</h3>
            <span class="history-count">{{ history.length }} blast{{ history.length !== 1 ? 's' : '' }} sent</span>
          </div>
          <div class="history-empty" v-if="history.length === 0">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
            <p>No SMS blasts sent yet.</p>
          </div>
          <table class="history-table" v-else>
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Sender</th>
                <th>Message Preview</th>
                <th>Recipients</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="h in history" :key="h.id">
                <td class="history-date">{{ formatDate(h.sent_at) }}</td>
                <td>{{ h.sender }}</td>
                <td class="history-msg">{{ h.message.substring(0, 60) }}{{ h.message.length > 60 ? '...' : '' }}</td>
                <td><span class="recip-badge">{{ h.recipient_count }} sent</span></td>
                <td><span :class="['status-badge', h.status]">{{ h.status }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>

    <!-- ── CONFIRM MODAL ── -->
    <div class="modal-overlay" v-if="showConfirm" @click.self="showConfirm = false">
      <div class="modal">
        <div class="modal-header">
          <h3>Confirm SMS Blast</h3>
          <button class="modal-close" @click="showConfirm = false">✕</button>
        </div>
        <div class="modal-body">
          <div class="confirm-summary">
            <div class="confirm-row">
              <span class="confirm-label">Sender</span>
              <span class="confirm-value">{{ senderName }}</span>
            </div>
            <div class="confirm-row">
              <span class="confirm-label">Recipients</span>
              <span class="confirm-value"><strong>{{ selectedPatients.length }}</strong> patient{{ selectedPatients.length !== 1 ? 's' : '' }}</span>
            </div>
            <div class="confirm-row">
              <span class="confirm-label">SMS Count</span>
              <span class="confirm-value">{{ selectedPatients.length * smsCount }} total SMS</span>
            </div>
            <div class="confirm-row" v-if="scheduled">
              <span class="confirm-label">Scheduled For</span>
              <span class="confirm-value">{{ formatSchedule }}</span>
            </div>
            <div class="confirm-row">
              <span class="confirm-label">Message</span>
              <span class="confirm-value confirm-msg">{{ messageBody }}</span>
            </div>
          </div>
          <div class="confirm-warning">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            This will send SMS messages to <strong>{{ selectedPatients.length }}</strong> patient{{ selectedPatients.length !== 1 ? 's' : '' }}. This action cannot be undone.
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="showConfirm = false">Cancel</button>
          <button class="btn-confirm-send" @click="sendBlast" :disabled="sending">
            {{ sending ? 'Sending...' : scheduled ? 'Schedule Blast' : 'Send Now' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'SMSBlast',
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
      currentUser: JSON.parse(localStorage.getItem('user')) || { name: 'Admin', email: '' },
      livePerms: JSON.parse(localStorage.getItem('doctorPermissions') || '{}'),
      permPollingInterval: null,

      // Compose
      senderName: 'CareQueue Medical Center',
      messageBody: '',
      scheduled: false,
      scheduleTime: '',

      // Recipients
      patients: [],
      selectedPatients: [],
      searchPatient: '',
      filterHasNumber: 'all',
      loadingPatients: false,

      // UI state
      sending: false,
      sentCount: 0,
      showConfirm: false,
      toast: null,

      // History
      history: [],

      templates: [
        {
          label: 'Appointment Reminder',
          body: 'Dear {name}, this is a reminder from {hospital} that you have an appointment on {date} at {time} with {doctor}. Please arrive 15 minutes early. For inquiries, call us directly.'
        },
        {
          label: 'Appointment Confirmed',
          body: 'Dear {name}, your appointment at {hospital} has been CONFIRMED for {date} at {time} with {doctor}. See you soon!'
        },
        {
          label: 'Appointment Cancelled',
          body: 'Dear {name}, we regret to inform you that your appointment on {date} at {time} at {hospital} has been cancelled. Please contact us to reschedule.'
        },
        {
          label: 'Queue Update',
          body: 'Dear {name}, it is now your turn at {hospital}. Please proceed to the clinic. Your doctor {doctor} is ready to see you.'
        },
        {
          label: 'General Announcement',
          body: 'Dear {name}, {hospital} would like to inform you: '
        },
      ],

      variables: ['{name}', '{date}', '{time}', '{doctor}', '{hospital}'],
    }
  },
  computed: {
    isAdmin() {
      return localStorage.getItem('role') === 'admin'
    },
    filteredPatients() {
      let list = this.patients
      if (this.filterHasNumber === 'yes') list = list.filter(p => p.mobile)
      if (this.filterHasNumber === 'no')  list = list.filter(p => !p.mobile)
      if (this.searchPatient) {
        const q = this.searchPatient.toLowerCase()
        list = list.filter(p =>
          `${p.first_name} ${p.last_name}`.toLowerCase().includes(q) ||
          (p.mobile || '').includes(q)
        )
      }
      return list
    },
    allSelected() {
      const withNum = this.patients.filter(p => p.mobile)
      return withNum.length > 0 && withNum.every(p => this.isSelected(p))
    },
    smsCount() {
      const len = this.messageBody.length
      if (len === 0) return 0
      if (len <= 160) return 1
      return Math.ceil(len / 153)
    },
    previewMessage() {
      return this.messageBody
        .replace(/{name}/g, 'Juan Dela Cruz')
        .replace(/{date}/g, 'March 5, 2026')
        .replace(/{time}/g, '10:00 AM')
        .replace(/{doctor}/g, 'Dr. Santos')
        .replace(/{hospital}/g, this.senderName || 'Hospital')
    },
    currentTimeStr() {
      return new Date().toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })
    },
    minScheduleTime() {
      const now = new Date()
      now.setMinutes(now.getMinutes() + 5)
      return now.toISOString().slice(0, 16)
    },
    canSend() {
      return this.messageBody.trim().length > 0 &&
             this.selectedPatients.length > 0 &&
             this.senderName.trim().length > 0 &&
             (!this.scheduled || this.scheduleTime)
    },
    formatSchedule() {
      if (!this.scheduleTime) return ''
      return new Date(this.scheduleTime).toLocaleString('en-PH', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      })
    }
  },
  methods: {
    // ── Permission helpers ──────────────────────────────
    doctorCan(key) {
      return !!this.livePerms[key]
    },
    async pollPermissions() {
      if (this.isAdmin) return
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        if (!user.doctor_id) return
        const res = await fetch(`http://localhost:8000/doctor-permissions/${user.doctor_id}`)
        const data = await res.json()
        const updated = {}
        Object.keys(data).forEach(key => {
          if (!['id', 'doctor_id', 'updated_at'].includes(key)) updated[key] = !!data[key]
        })
        const changed = Object.keys(updated).some(k => updated[k] !== this.livePerms[k])
        if (changed) {
          this.livePerms = { ...updated }
          localStorage.setItem('doctorPermissions', JSON.stringify(updated))
        }
      } catch (e) {
        console.warn('Permission poll failed:', e)
      }
    },
    startPermPolling() {
      if (this.isAdmin) return
      this.pollPermissions()
      this.permPollingInterval = setInterval(this.pollPermissions, 30000)
    },
    initials(patient) {
      return `${(patient.first_name || '')[0] || ''}${(patient.last_name || '')[0] || ''}`.toUpperCase()
    },
    isSelected(patient) {
      return this.selectedPatients.some(p => p.id === patient.id)
    },
    togglePatient(patient) {
      if (!patient.mobile) return
      const idx = this.selectedPatients.findIndex(p => p.id === patient.id)
      if (idx === -1) this.selectedPatients.push(patient)
      else this.selectedPatients.splice(idx, 1)
    },
    toggleSelectAll() {
      const withNum = this.patients.filter(p => p.mobile)
      if (this.allSelected) {
        this.selectedPatients = []
      } else {
        this.selectedPatients = [...withNum]
      }
    },
    applyTemplate(t) {
      this.messageBody = t.body.replace(/{hospital}/g, this.senderName || 'Hospital')
    },
    insertVariable(v) {
      const el = this.$refs.messageBox
      if (!el) { this.messageBody += v; return }
      const start = el.selectionStart
      const end   = el.selectionEnd
      this.messageBody = this.messageBody.slice(0, start) + v + this.messageBody.slice(end)
      this.$nextTick(() => {
        el.focus()
        el.setSelectionRange(start + v.length, start + v.length)
      })
    },
    confirmSend() {
      if (!this.canSend) return
      this.showConfirm = true
    },
    async sendBlast() {
      this.sending = true
      this.sentCount = 0
      this.showConfirm = false

      try {
        // Build the payload
        const payload = {
          sender: this.senderName,
          message: this.messageBody,
          recipients: this.selectedPatients.map(p => ({
            id: p.id,
            name: `${p.first_name} ${p.last_name}`,
            mobile: p.mobile,
            // Personalize message per recipient
            personalizedMessage: this.messageBody
              .replace(/{name}/g, `${p.first_name} ${p.last_name}`)
              .replace(/{hospital}/g, this.senderName)
          })),
          scheduled: this.scheduled,
          scheduleTime: this.scheduled ? this.scheduleTime : null,
        }

        const res = await fetch('http://localhost:8000/sms-blast', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })

        const data = await res.json()
        if (!res.ok) throw new Error(data.message || 'Failed to send SMS blast.')

        this.sentCount = this.selectedPatients.length

        // Add to local history
        this.history.unshift({
          id: Date.now(),
          sent_at: new Date().toISOString(),
          sender: this.senderName,
          message: this.messageBody,
          recipient_count: this.selectedPatients.length,
          status: this.scheduled ? 'scheduled' : 'sent'
        })

        this.showToast(
          this.scheduled
            ? `SMS Blast scheduled for ${this.formatSchedule}!`
            : `SMS Blast sent to ${this.sentCount} recipient${this.sentCount !== 1 ? 's' : ''}!`,
          'toast-green'
        )

        // Reset form
        this.selectedPatients = []
        this.messageBody = ''
        this.scheduled = false
        this.scheduleTime = ''

      } catch (err) {
        this.showToast(err.message || 'Failed to send SMS Blast.', 'toast-red')
      } finally {
        this.sending = false
      }
    },
    showToast(message, type = 'toast-green') {
      this.toast = { message, type }
      setTimeout(() => { this.toast = null }, 4000)
    },
    async fetchPatients() {
      this.loadingPatients = true
      try {
        const res = await fetch('http://localhost:8000/patients')
        this.patients = await res.json()
      } catch (err) {
        console.error('Failed to fetch patients:', err)
      } finally {
        this.loadingPatients = false
      }
    },
    async fetchHistory() {
      try {
        const res = await fetch('http://localhost:8000/sms-blast/history')
        if (res.ok) this.history = await res.json()
      } catch (err) {
        // History is optional; silently ignore
      }
    },
    formatDate(dateStr) {
      if (!dateStr) return '—'
      return new Date(dateStr).toLocaleString('en-PH', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      })
    },
    handleLogout() {
      localStorage.removeItem('user')
      localStorage.removeItem('role')
      localStorage.removeItem('doctorPermissions')
      this.$router.push('/')
    }
  },
  mounted() {
    this.fetchPatients()
    this.fetchHistory()
    this.startPermPolling()
  },
  beforeUnmount() {
    clearInterval(this.permPollingInterval)
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
.layout { display: flex; min-height: 100vh; font-family: 'Plus Jakarta Sans', sans-serif; background: #f0f4f8; }

/* ── TOAST ── */
.toast { position: fixed; top: 24px; left: 50%; transform: translateX(-50%); padding: 14px 22px; border-radius: 12px; font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 10px; box-shadow: 0 8px 32px rgba(0,0,0,0.18); z-index: 9999; min-width: 300px; color: white; }
.toast-green { background: #16a34a; }
.toast-red   { background: #dc2626; }
.toast-blue  { background: #2563eb; }
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(-16px); }

/* ── SIDEBAR ── */
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
.nav-sub-item { display: block; padding: 9px 12px; color: #94a3b8; text-decoration: none; font-size: 13px; transition: color 0.2s; white-space: nowrap; }
.nav-sub-item:hover, .nav-sub-item.active { color: #3aa6a6; }

/* ── MAIN ── */
.main-wrapper { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.topbar { height: 60px; background: #3aa6a6; display: flex; align-items: center; justify-content: space-between; padding: 0 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); position: sticky; top: 0; z-index: 100; }
.hamburger { background: none; border: none; cursor: pointer; color: #fff; display: flex; padding: 6px; border-radius: 8px; transition: background 0.2s; }
.hamburger:hover { background: rgba(255,255,255,0.15); }
.topbar-right { display: flex; align-items: center; gap: 8px; }
.account-wrapper { position: relative; cursor: pointer; }
.account-avatar { width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; color: white; }
.dropdown { position: absolute; top: calc(100% + 10px); right: 0; background: white; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.12); z-index: 200; overflow: hidden; animation: fadeDown 0.15s ease; }
@keyframes fadeDown { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
.dropdown-header { padding: 14px 16px; display: flex; justify-content: space-between; align-items: center; font-weight: 600; font-size: 13px; color: #1e293b; border-bottom: 1px solid #f1f5f9; }
.account-dropdown { width: 220px; }
.account-info { flex-direction: column; align-items: flex-start; gap: 2px; }
.account-name  { font-size: 13px; font-weight: 600; color: #1e293b; }
.account-email { font-size: 11px; color: #94a3b8; }
.dropdown-divider { border: none; border-top: 1px solid #f1f5f9; }
.dropdown-item { display: flex; align-items: center; gap: 10px; width: 100%; padding: 11px 16px; background: none; border: none; text-align: left; font-size: 13px; color: #475569; cursor: pointer; font-family: inherit; transition: background 0.15s; }
.dropdown-item:hover { background: #f8fafc; color: #1e293b; }
.dropdown-item.logout { color: #ef4444; }
.dropdown-item.logout:hover { background: #fff5f5; }

/* Role pill in account dropdown */
.role-pill { margin-top: 4px; display: inline-block; font-size: 10px; font-weight: 700; padding: 2px 10px; border-radius: 20px; }
.role-pill.admin  { background: #dbeafe; color: #1d4ed8; }
.role-pill.doctor { background: #d1fae5; color: #065f46; }

/* Doctor role tag in sidebar */
.role-tag { display: flex; align-items: center; gap: 10px; padding: 10px 16px; color: #3aa6a6; font-size: 12px; font-weight: 600; border-top: 1px solid rgba(255,255,255,0.06); margin-top: auto; }

/* Nav locked sub item */
.nav-sub-locked { display: flex; align-items: center; gap: 6px; padding: 8px 16px 8px 46px; color: #475569; font-size: 12px; font-style: italic; }

/* ACCESS DENIED PAGE */
.access-denied-page { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; gap: 20px; text-align: center; padding: 40px; }
.access-denied-icon { width: 100px; height: 100px; background: #fee2e2; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #dc2626; }
.access-denied-title { font-size: 24px; font-weight: 700; color: #1e293b; }
.access-denied-text { font-size: 14px; color: #64748b; max-width: 400px; line-height: 1.7; }
.btn-go-back { padding: 11px 28px; background: #3aa6a6; color: white; border: none; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; transition: background 0.2s; }
.btn-go-back:hover { background: #2e8b8b; }

/* ── CONTENT ── */
.content { padding: 28px; flex: 1; }
.page-title { font-size: 22px; font-weight: 700; color: #1e293b; }
.breadcrumb { font-size: 12px; color: #94a3b8; margin-top: 2px; }
.page-header { margin-bottom: 20px; }

/* ── SMS LAYOUT ── */
.sms-layout { display: grid; grid-template-columns: 1fr 380px; gap: 20px; margin-bottom: 24px; }

/* Panel Cards */
.compose-panel { display: flex; flex-direction: column; gap: 16px; }
.panel-card { background: white; border-radius: 14px; padding: 20px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
.panel-card-header { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 700; color: #1e293b; margin-bottom: 16px; }
.panel-card-header span { flex: 1; }

/* Fields */
.field-group { display: flex; flex-direction: column; gap: 6px; }
.field-group label { font-size: 12px; font-weight: 600; color: #374151; }
.field-group input, .field-group select {
  padding: 9px 13px; border: 1.5px solid #cbd5e1; border-radius: 8px;
  font-size: 13px; color: #1e293b; background: white; outline: none; font-family: inherit;
  transition: border-color 0.2s;
}
.field-group input:focus, .field-group select:focus { border-color: #3aa6a6; box-shadow: 0 0 0 3px rgba(58,166,166,0.1); }
.field-group textarea {
  padding: 10px 13px; border: 1.5px solid #cbd5e1; border-radius: 8px;
  font-size: 13px; color: #1e293b; background: white; outline: none; font-family: inherit;
  resize: vertical; transition: border-color 0.2s; line-height: 1.6;
}
.field-group textarea:focus { border-color: #3aa6a6; box-shadow: 0 0 0 3px rgba(58,166,166,0.1); }
.required { color: #ef4444; }

/* Templates */
.template-row, .variable-row { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 12px; flex-wrap: wrap; }
.template-label { font-size: 11px; font-weight: 700; color: #64748b; white-space: nowrap; padding-top: 3px; text-transform: uppercase; letter-spacing: 0.5px; }
.template-chips { display: flex; flex-wrap: wrap; gap: 6px; }
.chip { padding: 4px 12px; background: #f1f5f9; border: 1.5px solid #e2e8f0; border-radius: 20px; font-size: 11.5px; font-weight: 600; color: #475569; cursor: pointer; font-family: inherit; transition: all 0.2s; white-space: nowrap; }
.chip:hover { background: #3aa6a6; color: white; border-color: #3aa6a6; }
.chip-var { background: #eff6ff; border-color: #93c5fd; color: #2563eb; font-family: monospace; }
.chip-var:hover { background: #2563eb; color: white; border-color: #2563eb; }

/* Char count */
.char-row { display: flex; justify-content: flex-end; margin-top: 4px; }
.char-count { font-size: 11px; color: #94a3b8; font-weight: 500; }
.char-count.warn { color: #f97316; }
.char-count.danger { color: #ef4444; }

/* Schedule toggle */
.schedule-toggle { display: flex; align-items: center; gap: 10px; cursor: pointer; margin-top: 6px; font-size: 13px; color: #475569; font-weight: 500; }
.toggle-track { width: 36px; height: 20px; border-radius: 20px; background: #e2e8f0; position: relative; transition: background 0.2s; flex-shrink: 0; }
.toggle-track.active { background: #3aa6a6; }
.toggle-thumb { width: 16px; height: 16px; border-radius: 50%; background: white; position: absolute; top: 2px; left: 2px; transition: left 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.15); }
.toggle-track.active .toggle-thumb { left: 18px; }

/* Phone Preview */
.preview-card { background: linear-gradient(135deg, #1b2540, #2d3a5a); }
.preview-card .panel-card-header { color: #94a3b8; }
.phone-mockup { display: flex; justify-content: center; padding: 10px 0; }
.phone-screen { width: 240px; background: #f8fafc; border-radius: 16px; padding: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.3); }
.phone-sender { font-size: 11px; font-weight: 700; color: #64748b; text-align: center; margin-bottom: 10px; }
.phone-bubble { background: #dcfce7; border-radius: 12px 12px 12px 0; padding: 10px 14px; font-size: 12.5px; color: #1e293b; line-height: 1.5; word-break: break-word; }
.phone-time { font-size: 10px; color: #94a3b8; text-align: right; margin-top: 6px; }

/* ── RECIPIENTS PANEL ── */
.recipients-panel { display: flex; flex-direction: column; gap: 16px; }
.stats-bar { display: flex; gap: 10px; }
.stat-pill { flex: 1; background: white; border-radius: 12px; padding: 12px; text-align: center; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
.stat-pill.selected { background: #3aa6a6; }
.stat-pill.selected .stat-pill-num, .stat-pill.selected .stat-pill-label { color: white; }
.stat-pill-num { display: block; font-size: 22px; font-weight: 700; color: #1e293b; }
.stat-pill-label { display: block; font-size: 10px; color: #94a3b8; font-weight: 600; margin-top: 2px; text-transform: uppercase; letter-spacing: 0.5px; }

/* Select all */
.select-all-wrap { display: flex; align-items: center; gap: 6px; margin-left: auto; }
.select-all-wrap input { width: 15px; height: 15px; accent-color: #3aa6a6; cursor: pointer; }
.select-all-wrap label { font-size: 12px; color: #64748b; cursor: pointer; font-weight: 500; }

/* Filter */
.filter-row { display: flex; gap: 8px; margin-bottom: 12px; }
.search-box { flex: 1; display: flex; align-items: center; gap: 8px; border: 1.5px solid #e2e8f0; border-radius: 8px; padding: 0 12px; transition: border-color 0.2s; }
.search-box:focus-within { border-color: #3aa6a6; }
.search-box input { border: none; outline: none; font-size: 13px; color: #475569; font-family: inherit; padding: 9px 0; flex: 1; background: transparent; }
.filter-select { padding: 9px 12px; border: 1.5px solid #e2e8f0; border-radius: 8px; font-size: 12px; color: #475569; outline: none; font-family: inherit; background: white; cursor: pointer; }
.filter-select:focus { border-color: #3aa6a6; }

/* Patient list */
.patient-list { max-height: 400px; overflow-y: auto; display: flex; flex-direction: column; gap: 4px; }
.patient-row { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 10px; cursor: pointer; transition: background 0.15s; border: 1.5px solid transparent; }
.patient-row:hover:not(.no-number) { background: #f0fafa; border-color: #3aa6a6; }
.patient-row.selected { background: #f0fafa; border-color: #3aa6a6; }
.patient-row.no-number { opacity: 0.5; cursor: not-allowed; }
.patient-row input[type="checkbox"] { width: 15px; height: 15px; accent-color: #3aa6a6; flex-shrink: 0; cursor: pointer; }
.patient-row input[type="checkbox"]:disabled { cursor: not-allowed; }
.patient-avatar { width: 34px; height: 34px; border-radius: 50%; background: linear-gradient(135deg, #3aa6a6, #2dd4bf); color: white; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; }
.patient-info { flex: 1; min-width: 0; }
.patient-name { display: block; font-size: 13px; font-weight: 600; color: #1e293b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.patient-number { display: block; font-size: 11px; color: #64748b; margin-top: 1px; }
.patient-number.no-num { color: #94a3b8; font-style: italic; }
.no-num-badge { font-size: 10px; font-weight: 700; color: #94a3b8; background: #f1f5f9; padding: 2px 7px; border-radius: 20px; flex-shrink: 0; }
.loading-state { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 30px; color: #94a3b8; }
.spinner { width: 28px; height: 28px; border: 3px solid #e2e8f0; border-top-color: #3aa6a6; border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.empty-list { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 30px; color: #94a3b8; font-size: 13px; }

/* Send Button */
.btn-send { width: 100%; padding: 14px; background: linear-gradient(135deg, #3aa6a6, #2e8b8b); color: white; border: none; border-radius: 12px; font-size: 14px; font-weight: 700; cursor: pointer; font-family: inherit; display: flex; align-items: center; justify-content: center; gap: 10px; transition: all 0.2s; box-shadow: 0 4px 14px rgba(58,166,166,0.35); }
.btn-send:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(58,166,166,0.45); }
.btn-send:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }

/* ── HISTORY ── */
.history-card { background: white; border-radius: 16px; padding: 24px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
.history-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.history-header h3 { font-size: 16px; font-weight: 700; color: #1e293b; }
.history-count { font-size: 12px; color: #94a3b8; font-weight: 500; }
.history-empty { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 40px; color: #94a3b8; font-size: 13px; }
.history-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.history-table th { text-align: left; padding: 10px 14px; color: #64748b; font-weight: 600; font-size: 12px; border-bottom: 2px solid #f1f5f9; }
.history-table td { padding: 12px 14px; color: #475569; border-bottom: 1px solid #f8fafc; }
.history-table tr:last-child td { border-bottom: none; }
.history-table tr:hover td { background: #f8fafc; }
.history-date { font-size: 12px; color: #64748b; white-space: nowrap; }
.history-msg { max-width: 280px; color: #1e293b; }
.recip-badge { font-size: 11px; font-weight: 700; color: #2563eb; background: #dbeafe; padding: 3px 10px; border-radius: 20px; }
.status-badge { font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 20px; }
.status-badge.sent      { color: #16a34a; background: #dcfce7; }
.status-badge.scheduled { color: #f97316; background: #ffedd5; }
.status-badge.failed    { color: #dc2626; background: #fee2e2; }

/* ── CONFIRM MODAL ── */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; z-index: 500; padding: 20px; }
.modal { background: white; border-radius: 16px; width: 480px; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 20px 60px rgba(0,0,0,0.2); overflow: hidden; }
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid #f1f5f9; }
.modal-header h3 { font-size: 16px; font-weight: 700; color: #1e293b; }
.modal-close { background: none; border: none; font-size: 16px; color: #94a3b8; cursor: pointer; }
.modal-close:hover { color: #1e293b; }
.modal-body { padding: 24px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 16px; }
.modal-footer { padding: 16px 24px; border-top: 1px solid #f1f5f9; display: flex; justify-content: flex-end; gap: 10px; }
.confirm-summary { display: flex; flex-direction: column; gap: 0; border: 1.5px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
.confirm-row { display: flex; justify-content: space-between; align-items: flex-start; padding: 12px 16px; border-bottom: 1px solid #f1f5f9; }
.confirm-row:last-child { border-bottom: none; }
.confirm-label { font-size: 12px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; padding-top: 1px; flex-shrink: 0; }
.confirm-value { font-size: 13px; color: #1e293b; font-weight: 500; text-align: right; max-width: 65%; }
.confirm-msg { font-style: italic; color: #475569; word-break: break-word; }
.confirm-warning { display: flex; align-items: flex-start; gap: 10px; font-size: 13px; color: #92400e; background: #fef3c7; padding: 12px 16px; border-radius: 10px; border: 1px solid #fde68a; line-height: 1.5; }
.btn-cancel { padding: 9px 20px; background: #f1f5f9; color: #475569; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; }
.btn-cancel:hover { background: #e2e8f0; }
.btn-confirm-send { padding: 9px 20px; background: #3aa6a6; color: white; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; }
.btn-confirm-send:hover:not(:disabled) { background: #2e8b8b; }
.btn-confirm-send:disabled { opacity: 0.6; cursor: not-allowed; }

@media (max-width: 1100px) { .sms-layout { grid-template-columns: 1fr; } }
@media (max-width: 768px) {
  .sidebar { position: fixed; z-index: 300; height: 100vh; }
  .content { padding: 16px; }
  .stats-bar { flex-wrap: wrap; }
}
</style>