<template>
  <div class="layout">

    <!-- ══════════════════════════════════════════
         FULL-SCREEN IMPORT LOADING OVERLAY
    ══════════════════════════════════════════ -->
    <transition name="fade-overlay">
      <div v-if="showImportLoading" class="import-loading-overlay">
        <div class="import-loading-box">
          <div class="import-spinner-ring">
            <svg class="import-spinner-svg" viewBox="0 0 60 60">
              <circle cx="30" cy="30" r="24" fill="none" stroke="#e2e8f0" stroke-width="5"/>
              <circle cx="30" cy="30" r="24" fill="none" stroke="#3aa6a6" stroke-width="5"
                stroke-linecap="round" stroke-dasharray="100 52" class="spin-arc"/>
            </svg>
            <div class="import-spinner-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#3aa6a6">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
              </svg>
            </div>
          </div>
          <p class="import-loading-title">Importing Doctors...</p>
          <p class="import-loading-sub">Please wait while we process your file.<br/>Do not close this window.</p>
          <div class="import-loading-dots">
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>
    </transition>

    <!-- ── TOAST: Doctor Added ── -->
    <transition name="toast">
      <div v-if="showSuccess" class="toast toast-green">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
        Doctor added successfully!
      </div>
    </transition>

    <!-- ── TOAST: Account Created ── -->
    <transition name="toast">
      <div v-if="showAccountCreated" class="toast toast-blue">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
        Doctor account created! Credentials sent.
      </div>
    </transition>

    <!-- ── TOAST: Create Account Prompt ── -->
    <transition name="toast">
      <div v-if="showCreatePrompt" class="toast toast-orange">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <span>Doctor info saved! Create a system account?</span>
        <button class="toast-action-btn" @click="openCreateAccountFromPrompt">Create</button>
        <button class="toast-dismiss" @click="showCreatePrompt = false">✕</button>
      </div>
    </transition>

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
      <header class="topbar">
        <div class="topbar-left">
          <button class="hamburger" @click="sidebarCollapsed = !sidebarCollapsed">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
        </div>
        <div class="topbar-right">
          <div class="topbar-btn notif-wrapper" @click="notifOpen = !notifOpen" v-click-outside="() => notifOpen = false">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
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
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            </div>
            <div class="dropdown account-dropdown" v-show="accountOpen" @click.stop>
              <div class="dropdown-header account-info">
                <p class="account-name">{{ currentUser.name }}</p>
                <p class="account-email">{{ currentUser.email }}</p>
                <span class="role-pill" :class="isAdmin ? 'admin' : 'doctor'">{{ isAdmin ? 'Admin' : 'Doctor' }}</span>
              </div>
              <hr class="dropdown-divider"/>
              <button class="dropdown-item" @click="goTo('edit-account')"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>Edit Account</button>
              <button class="dropdown-item" @click="goTo('settings')"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>Settings</button>
              <hr class="dropdown-divider"/>
              <button class="dropdown-item logout" @click="handleLogout"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>Logout</button>
            </div>
          </div>
        </div>
      </header>

      <main class="content">
        <div class="page-header">
          <h1 class="page-title">DOCTOR LIST</h1>
          <p class="breadcrumb">Add Manually / Import Files</p>
        </div>

        <div class="table-card">
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
            <div class="toolbar-right">
              <button class="btn-add" @click="showAddModal = true">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                ADD
              </button>
              <button class="btn-import" @click="triggerImport">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                IMPORT
              </button>
              <input type="file" ref="fileInput" accept=".csv,.xlsx,.xls" style="display:none" @change="handleImport" />
            </div>
          </div>

          <div v-if="loading" class="loading-state">
            <div class="spinner"></div>
            <p>Loading doctors...</p>
          </div>

          <table class="doctors-table" v-else>
            <thead>
              <tr>
                <th>ID No.</th>
                <th>Name</th>
                <th>Specialization</th>
                <th>Hospital</th>
                <th>Status</th>
                <th>Account</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="filteredDoctors.length === 0">
                <td colspan="7" class="empty-row">
                  <div class="empty-state">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>
                    <p>No doctors found. Click <strong>ADD</strong> to get started.</p>
                  </div>
                </td>
              </tr>
              <tr v-for="doctor in filteredDoctors" :key="doctor.id">
                <td class="id-cell">{{ doctor.doctor_id }}</td>
                <td>{{ doctor.last_name }}, {{ doctor.first_name }} {{ doctor.middle_name }}</td>
                <td>{{ doctor.specialization }}</td>
                <td>{{ doctor.hospital }}</td>
                <td><span :class="['status-badge', doctor.status === 'IN' ? 'in' : 'out']">{{ doctor.status }}</span></td>
                <td>
                  <span v-if="doctor.has_account" class="account-badge done">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                    Done
                  </span>
                  <span v-else class="account-badge none">No Account</span>
                </td>
                <td>
                  <div class="action-group">
                    <button class="btn-view" @click="viewDoctor(doctor)">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                      View
                    </button>
                    <button class="btn-create-acct" :class="{ 'done': doctor.has_account }" @click="!doctor.has_account && openCreateAccount(doctor)" :disabled="doctor.has_account">
                      <svg v-if="!doctor.has_account" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>
                      <svg v-else xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                      {{ doctor.has_account ? 'Account Created' : 'Create Account' }}
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- ══ SMART PAGINATION ══ -->
          <div class="pagination" v-if="totalPages > 1">
            <button class="page-btn nav-arrow-btn" :disabled="currentPage === 1" @click="currentPage--">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <template v-for="(item, idx) in paginationItems" :key="idx">
              <span v-if="item === '...'" class="page-ellipsis">…</span>
              <button
                v-else
                class="page-btn"
                :class="{ active: item === currentPage }"
                @click="currentPage = item"
              >{{ item }}</button>
            </template>
            <button class="page-btn nav-arrow-btn" :disabled="currentPage === totalPages" @click="currentPage++">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>
          <!-- ══ END PAGINATION ══ -->

        </div>
      </main>
    </div>

    <!-- ══════════════════════════════════════════
         ADD DOCTOR MODAL
    ══════════════════════════════════════════ -->
    <div class="modal-overlay" v-if="showAddModal" @click.self="closeAddModal">
      <div class="modal modal-large">
        <div class="modal-header">
          <h3>Add Doctor</h3>
          <button class="modal-close" @click="closeAddModal">✕</button>
        </div>
        <div class="modal-body">
          <div class="photo-section">
            <div class="photo-preview">
              <img v-if="photoPreview" :src="photoPreview" alt="Profile" />
              <div v-else class="photo-placeholder"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg></div>
            </div>
            <div class="photo-info">
              <p class="photo-label">Profile Photo</p>
              <p class="photo-hint">Accepted: PNG, JPG. Less than 1MB</p>
              <input type="file" ref="photoInput" accept="image/png,image/jpeg" style="display:none" @change="handlePhotoUpload" />
              <button class="btn-upload" @click="$refs.photoInput.click()">Upload</button>
            </div>
          </div>
          <div class="section-title">Personal Information</div>
          <div class="form-grid">
            <div class="field-group"><label>First Name <span class="required">*</span></label><input type="text" v-model="newDoctor.first_name" placeholder="Juan" /></div>
            <div class="field-group"><label>Last Name <span class="required">*</span></label><input type="text" v-model="newDoctor.last_name" placeholder="Dela Cruz" /></div>
            <div class="field-group"><label>Middle Name</label><input type="text" v-model="newDoctor.middle_name" placeholder="Santos" /></div>
            <div class="field-group"><label>Name Extension</label><input type="text" v-model="newDoctor.name_extension" placeholder="Jr., Sr., III" /></div>
            <div class="field-group"><label>Gender <span class="required">*</span></label><select v-model="newDoctor.gender"><option value="">Select Gender</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option></select></div>
            <div class="field-group"><label>Date of Birth <span class="required">*</span></label><input type="date" v-model="newDoctor.date_of_birth" /></div>
            <div class="field-group"><label>Religion</label><input type="text" v-model="newDoctor.religion" placeholder="e.g. Catholic" /></div>
            <div class="field-group"><label>Civil Status</label><select v-model="newDoctor.civil_status"><option value="">Select Status</option><option value="Single">Single</option><option value="Married">Married</option><option value="Widowed">Widowed</option><option value="Separated">Separated</option></select></div>
          </div>
          <div class="section-title">Contact Information</div>
          <div class="form-grid">
            <div class="field-group"><label>Landline Number</label><input type="text" v-model="newDoctor.landline" placeholder="02-XXXX-XXXX" /></div>
            <div class="field-group"><label>Mobile Number <span class="required">*</span></label><input type="text" v-model="newDoctor.mobile" placeholder="09XX-XXX-XXXX" /></div>
            <div class="field-group span-2"><label>Email Address</label><input type="email" v-model="newDoctor.email" placeholder="doctor@email.com" /></div>
            <div class="field-group span-2"><label>Home Address</label><input type="text" v-model="newDoctor.address" placeholder="Street, Barangay, City, Province" /></div>
          </div>
          <div class="section-title">Professional Information</div>
          <div class="form-grid">
            <div class="field-group">
              <label>Specialization <span class="required">*</span></label>
              <div class="select-with-add">
                <select v-model="newDoctor.specialization" class="select-flex"><option value="">Select Specialization</option><option v-for="s in specializationList" :key="s.id" :value="s.name">{{ s.name }}</option></select>
                <button type="button" class="btn-add-option" @click="openAddSpecialization" title="Add new specialization">+</button>
              </div>
            </div>
            <div class="field-group"><label>Sub-Specialization</label><input type="text" v-model="newDoctor.sub_specialization" placeholder="e.g. Interventional Cardiology" /></div>
            <div class="field-group">
              <label>Hospital / Clinic <span class="required">*</span></label>
              <div class="select-with-add">
                <select v-model="newDoctor.hospital" class="select-flex"><option value="">Select Hospital / Clinic</option><option v-for="h in hospitalList" :key="h.id" :value="h.name">{{ h.name }}</option></select>
                <button type="button" class="btn-add-option" @click="openAddHospital" title="Add new hospital">+</button>
              </div>
            </div>
            <div class="field-group"><label>Office / Room <span class="required">*</span></label><input type="text" v-model="newDoctor.office" placeholder="e.g. RVJ 101" /></div>
            <div class="field-group"><label>License Number</label><input type="text" v-model="newDoctor.license_number" placeholder="PRC License No." /></div>
            <div class="field-group"><label>Years of Experience</label><input type="number" v-model="newDoctor.years_experience" placeholder="e.g. 10" min="0" /></div>
            <div class="field-group"><label>Medical School / University</label><input type="text" v-model="newDoctor.medical_school" placeholder="e.g. University of Santo Tomas" /></div>
            <div class="field-group"><label>Status</label><select v-model="newDoctor.status"><option value="IN">IN</option><option value="OUT">OUT</option></select></div>
          </div>
          <p v-if="addError" class="error-msg">{{ addError }}</p>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="closeAddModal">Cancel</button>
          <button class="btn-add-confirm" @click="addDoctor" :disabled="saving">{{ saving ? 'Saving...' : 'Add Doctor' }}</button>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════
         ADD SPECIALIZATION MODAL
    ══════════════════════════════════════════ -->
    <div class="modal-overlay" v-if="showAddSpecModal" @click.self="showAddSpecModal = false">
      <div class="modal modal-sm">
        <div class="modal-header"><h3>Add Specialization</h3><button class="modal-close" @click="showAddSpecModal = false">✕</button></div>
        <div class="modal-body">
          <div class="field-group"><label>Specialization Name <span class="required">*</span></label><input type="text" v-model="newSpecialization" placeholder="e.g. Dermatologist" /></div>
          <p v-if="addSpecError" class="error-msg">{{ addSpecError }}</p>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="showAddSpecModal = false">Cancel</button>
          <button class="btn-add-confirm" @click="saveSpecialization" :disabled="savingSpec">{{ savingSpec ? 'Saving...' : 'Add' }}</button>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════
         ADD HOSPITAL MODAL
    ══════════════════════════════════════════ -->
    <div class="modal-overlay" v-if="showAddHospModal" @click.self="showAddHospModal = false">
      <div class="modal modal-sm">
        <div class="modal-header"><h3>Add Hospital / Clinic</h3><button class="modal-close" @click="showAddHospModal = false">✕</button></div>
        <div class="modal-body">
          <div class="field-group"><label>Hospital / Clinic Name <span class="required">*</span></label><input type="text" v-model="newHospital" placeholder="e.g. City General Hospital" /></div>
          <p v-if="addHospError" class="error-msg">{{ addHospError }}</p>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="showAddHospModal = false">Cancel</button>
          <button class="btn-add-confirm" @click="saveHospital" :disabled="savingHosp">{{ savingHosp ? 'Saving...' : 'Add' }}</button>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════
         VIEW DOCTOR MODAL
    ══════════════════════════════════════════ -->
    <div class="modal-overlay" v-if="showViewModal" @click.self="showViewModal = false">
      <div class="modal modal-large">
        <div class="modal-header"><h3>Doctor Information</h3><button class="modal-close" @click="showViewModal = false">✕</button></div>
        <div class="modal-body" v-if="selectedDoctor">
          <div class="view-profile">
            <div class="view-avatar">
              <img v-if="selectedDoctor.photo_url" :src="'http://localhost:8000' + selectedDoctor.photo_url" alt="Profile" />
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="52" height="52" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            </div>
            <div class="view-name-block">
              <h2 class="view-doctor-name">Dr. {{ selectedDoctor.first_name }} {{ selectedDoctor.middle_name }} {{ selectedDoctor.last_name }} {{ selectedDoctor.name_extension }}</h2>
              <p class="view-spec">{{ selectedDoctor.specialization }}<span v-if="selectedDoctor.sub_specialization"> · {{ selectedDoctor.sub_specialization }}</span></p>
              <span :class="['status-badge', selectedDoctor.status === 'IN' ? 'in' : 'out']">{{ selectedDoctor.status }}</span>
            </div>
          </div>
          <div class="view-grid">
            <div class="view-section">
              <div class="view-section-title">Personal Information</div>
              <div class="view-row"><span class="view-label">Doctor ID</span><span class="view-value">{{ selectedDoctor.doctor_id }}</span></div>
              <div class="view-row"><span class="view-label">Gender</span><span class="view-value">{{ selectedDoctor.gender }}</span></div>
              <div class="view-row"><span class="view-label">Date of Birth</span><span class="view-value">{{ formatDate(selectedDoctor.date_of_birth) }}</span></div>
              <div class="view-row"><span class="view-label">Religion</span><span class="view-value">{{ selectedDoctor.religion || '—' }}</span></div>
              <div class="view-row"><span class="view-label">Civil Status</span><span class="view-value">{{ selectedDoctor.civil_status || '—' }}</span></div>
            </div>
            <div class="view-section">
              <div class="view-section-title">Contact Information</div>
              <div class="view-row"><span class="view-label">Mobile</span><span class="view-value">{{ selectedDoctor.mobile }}</span></div>
              <div class="view-row"><span class="view-label">Landline</span><span class="view-value">{{ selectedDoctor.landline || '—' }}</span></div>
              <div class="view-row"><span class="view-label">Email</span><span class="view-value">{{ selectedDoctor.email || '—' }}</span></div>
              <div class="view-row"><span class="view-label">Address</span><span class="view-value">{{ selectedDoctor.address || '—' }}</span></div>
            </div>
            <div class="view-section span-full">
              <div class="view-section-title">Professional Information</div>
              <div class="view-row"><span class="view-label">Hospital / Clinic</span><span class="view-value">{{ selectedDoctor.hospital }}</span></div>
              <div class="view-row"><span class="view-label">Office / Room</span><span class="view-value">{{ selectedDoctor.office }}</span></div>
              <div class="view-row"><span class="view-label">License No.</span><span class="view-value">{{ selectedDoctor.license_number || '—' }}</span></div>
              <div class="view-row"><span class="view-label">Experience</span><span class="view-value">{{ selectedDoctor.years_experience ? selectedDoctor.years_experience + ' years' : '—' }}</span></div>
              <div class="view-row"><span class="view-label">Medical School</span><span class="view-value">{{ selectedDoctor.medical_school || '—' }}</span></div>
            </div>
          </div>
        </div>
        <div class="modal-footer"><button class="btn-cancel" @click="showViewModal = false">Close</button></div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════
         CREATE DOCTOR ACCOUNT MODAL
    ══════════════════════════════════════════ -->
    <div class="modal-overlay" v-if="showAccountModal" @click.self="showAccountModal = false">
      <div class="modal">
        <div class="modal-header"><h3>Create Doctor Account</h3><button class="modal-close" @click="showAccountModal = false">✕</button></div>
        <div class="modal-body" v-if="accountTargetDoctor">
          <div class="account-summary">
            <div class="account-summary-avatar">
              <img v-if="accountTargetDoctor.photo_url" :src="'http://localhost:8000' + accountTargetDoctor.photo_url" alt="Profile"/>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            </div>
            <div>
              <p class="account-summary-name">Dr. {{ accountTargetDoctor.first_name }} {{ accountTargetDoctor.last_name }}</p>
              <p class="account-summary-sub">{{ accountTargetDoctor.specialization }} · {{ accountTargetDoctor.hospital }}</p>
            </div>
          </div>
          <div class="section-title">Generated Credentials</div>
          <div class="credentials-box">
            <div class="cred-row">
              <span class="cred-label">Username</span>
              <span class="cred-value">{{ generatedUsername }}</span>
              <button class="copy-btn" @click="copyText(generatedUsername)" title="Copy"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg></button>
            </div>
            <div class="cred-row">
              <span class="cred-label">Password</span>
              <span class="cred-value cred-pass">{{ generatedPassword }}</span>
              <button class="copy-btn" @click="copyText(generatedPassword)" title="Copy"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg></button>
            </div>
          </div>
          <div class="cred-note">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            Please provide these credentials to the doctor. The password can be changed after first login.
          </div>
          <button class="btn-regenerate" @click="generateCredentials">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            Regenerate Password
          </button>
          <p v-if="accountError" class="error-msg">{{ accountError }}</p>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="showAccountModal = false">Cancel</button>
          <button class="btn-add-confirm" @click="saveAccount" :disabled="savingAccount">{{ savingAccount ? 'Creating...' : 'Confirm & Create Account' }}</button>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════
         IMPORT FILE MODAL
    ══════════════════════════════════════════ -->
    <div class="modal-overlay" v-if="showImportModal" @click.self="showImportModal = false">
      <div class="modal">
        <div class="modal-header">
          <h3>Import Doctors List</h3>
          <button class="modal-close" @click="showImportModal = false">✕</button>
        </div>
        <div class="modal-body">
          <div class="drop-zone" :class="{ 'drag-over': isDragOver }" @dragover.prevent="isDragOver = true" @dragleave="isDragOver = false" @drop.prevent="handleDrop">
            <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
            <p class="drop-title">Drag & drop your file here</p>
            <p class="drop-hint">Supported: .xlsx, .xls, .csv</p>
            <button class="btn-browse" @click="$refs.fileInput.click()">Browse File</button>
          </div>
          <div v-if="importFile" class="import-file-info">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            <span>{{ importFile.name }}</span>
            <button class="btn-remove-file" @click="importFile = null">✕</button>
          </div>
          <div class="import-status-notice">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <div>
              <p class="notice-title">Imported doctors will be set to <span class="out-badge">OUT</span> by default.</p>
              <p class="notice-sub">Their status will remain OUT until a system account is created for them.</p>
            </div>
          </div>
          <div class="import-note"><strong>Expected columns:</strong> first_name, last_name, specialization, hospital, office, mobile, gender, status</div>
          <p v-if="importError" class="error-msg">{{ importError }}</p>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="showImportModal = false">Cancel</button>
          <button class="btn-add-confirm" @click="submitImport" :disabled="!importFile || importing">
            {{ importing ? 'Importing...' : 'Import' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════
         IMPORT SUCCESS RESULT MODAL
    ══════════════════════════════════════════ -->
    <div class="modal-overlay" v-if="showImportResult" @click.self="showImportResult = false">
      <div class="modal modal-result">
        <div class="modal-body" style="gap: 0; padding: 0;">
          <div class="result-header">
            <div class="result-check-circle">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <h2 class="result-title">Import Successful!</h2>
            <p class="result-subtitle">Your file has been processed.</p>
          </div>
          <div class="result-stats">
            <div class="result-stat-box">
              <span class="result-stat-num">{{ importResultCount }}</span>
              <span class="result-stat-label">Doctors Imported</span>
            </div>
            <div class="result-stat-divider"></div>
            <div class="result-stat-box">
              <span class="result-stat-num out-color">{{ importResultCount }}</span>
              <span class="result-stat-label">Status set to OUT</span>
            </div>
            <div class="result-stat-divider"></div>
            <div class="result-stat-box">
              <span class="result-stat-num warn-color">0</span>
              <span class="result-stat-label">Accounts Created</span>
            </div>
          </div>
          <div class="result-reminder">
            <div class="reminder-icon-wrap">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#f59e0b">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </div>
            <div class="reminder-text">
              <p class="reminder-title">Action Required: Create Doctor Accounts</p>
              <p class="reminder-body">
                All <strong>{{ importResultCount }} imported doctors</strong> currently have <strong class="out-color">OUT</strong> status and <strong>no system account</strong>.
                You must create an account for each doctor before they can log in and be set to <strong class="in-color">IN</strong> status.
              </p>
            </div>
          </div>
          <div class="result-steps">
            <p class="steps-title">How to activate imported doctors:</p>
            <div class="step-item">
              <div class="step-num">1</div>
              <p>Find the doctor in the list below and click <strong>"Create Account"</strong>.</p>
            </div>
            <div class="step-item">
              <div class="step-num">2</div>
              <p>Review the generated credentials and click <strong>"Confirm & Create Account"</strong>.</p>
            </div>
            <div class="step-item">
              <div class="step-num">3</div>
              <p>Provide the credentials to the doctor. Their status will update to <strong class="in-color">IN</strong> upon first login.</p>
            </div>
          </div>
          <div v-if="importResultErrors && importResultErrors.length > 0" class="result-errors">
            <p class="result-errors-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
              {{ importResultErrors.length }} row(s) had errors and were skipped
            </p>
            <ul class="result-error-list">
              <li v-for="(e, i) in importResultErrors.slice(0, 5)" :key="i">{{ e }}</li>
              <li v-if="importResultErrors.length > 5" class="more-errors">...and {{ importResultErrors.length - 5 }} more</li>
            </ul>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-add-confirm btn-full" @click="showImportResult = false">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            Got it — Start Creating Accounts
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'AddingDoctor',
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
      appointmentsOpen: false,
      searchId: '',
      searchName: '',
      currentPage: 1,
      perPage: 10,
      loading: false,
      saving: false,

      // Toasts
      showSuccess: false,
      showAccountCreated: false,
      showCreatePrompt: false,
      lastAddedDoctor: null,

      // Add Modal
      showAddModal: false,
      addError: '',
      photoPreview: null,
      photoFile: null,
      newDoctor: this.freshDoctor(),

      // Add Specialization mini-modal
      showAddSpecModal: false,
      newSpecialization: '',
      addSpecError: '',
      savingSpec: false,

      // Add Hospital mini-modal
      showAddHospModal: false,
      newHospital: '',
      addHospError: '',
      savingHosp: false,

      // View Modal
      showViewModal: false,
      selectedDoctor: null,

      // Create Account Modal
      showAccountModal: false,
      accountTargetDoctor: null,
      generatedUsername: '',
      generatedPassword: '',
      accountError: '',
      savingAccount: false,

      // Import Modal
      showImportModal: false,
      importFile: null,
      isDragOver: false,
      importing: false,
      importError: '',

      // Import loading & result
      showImportLoading: false,
      showImportResult: false,
      importResultCount: 0,
      importResultErrors: [],

      doctors: [],
      hospitalList: [],
      specializationList: [],
      currentUser: JSON.parse(localStorage.getItem('user')) || { name: 'Admin', email: '' },
      livePerms: JSON.parse(localStorage.getItem('doctorPermissions') || '{}'),
    }
  },
  computed: {
    isAdmin() { return localStorage.getItem('role') === 'admin' },
    canAccess() { return this.isAdmin || this.doctorCan('book_appointment') },

    // Applies search filters; pagination is handled separately
    searchedDoctors() {
      let list = this.doctors
      if (this.searchName) list = list.filter(d => `${d.first_name} ${d.last_name}`.toLowerCase().includes(this.searchName.toLowerCase()))
      if (this.searchId)   list = list.filter(d => (d.doctor_id || '').toString().toLowerCase().includes(this.searchId.toLowerCase()))
      return list
    },

    filteredDoctors() {
      const start = (this.currentPage - 1) * this.perPage
      return this.searchedDoctors.slice(start, start + this.perPage)
    },

    totalPages() {
      return Math.max(1, Math.ceil(this.searchedDoctors.length / this.perPage))
    },

    // ══ SMART PAGINATION: shows at most 7 items (numbers + ellipses) ══
    paginationItems() {
      const total   = this.totalPages
      const current = this.currentPage
      const delta   = 2 // pages to show on each side of current
      const items   = []

      if (total <= 7) {
        // If total pages is small, just show all
        for (let i = 1; i <= total; i++) items.push(i)
        return items
      }

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
    // Reset to page 1 whenever search changes
    searchName() { this.currentPage = 1 },
    searchId()   { this.currentPage = 1 }
  },
  methods: {
    doctorCan(key) { return !!this.livePerms[key] },

    freshDoctor() {
      return {
        first_name: '', last_name: '', middle_name: '', name_extension: '',
        gender: '', date_of_birth: '', religion: '', civil_status: '',
        landline: '', mobile: '', email: '', address: '',
        specialization: '', sub_specialization: '', hospital: '',
        office: '', license_number: '', years_experience: '',
        medical_school: '', status: 'IN'
      }
    },

    closeAddModal() {
      this.showAddModal = false; this.addError = ''
      this.photoPreview = null; this.photoFile = null
      this.newDoctor = this.freshDoctor()
    },

    handlePhotoUpload(event) {
      const file = event.target.files[0]
      if (!file) return
      if (file.size > 1024 * 1024) { alert('File must be less than 1MB.'); return }
      this.photoFile = file
      this.photoPreview = URL.createObjectURL(file)
    },

    async addDoctor() {
      this.addError = ''
      if (!this.newDoctor.first_name.trim()) { this.addError = 'First name is required.'; return }
      if (!this.newDoctor.last_name.trim())  { this.addError = 'Last name is required.'; return }
      if (!this.newDoctor.gender)            { this.addError = 'Gender is required.'; return }
      if (!this.newDoctor.date_of_birth)     { this.addError = 'Date of birth is required.'; return }
      if (!this.newDoctor.mobile.trim())     { this.addError = 'Mobile number is required.'; return }
      if (!this.newDoctor.specialization)    { this.addError = 'Specialization is required.'; return }
      if (!this.newDoctor.hospital)          { this.addError = 'Hospital/Clinic is required.'; return }
      if (!this.newDoctor.office.trim())     { this.addError = 'Office/Room is required.'; return }
      this.saving = true
      try {
        const formData = new FormData()
        Object.keys(this.newDoctor).forEach(k => formData.append(k, this.newDoctor[k]))
        if (this.photoFile) formData.append('photo', this.photoFile)
        const res = await fetch('http://localhost:8000/doctors', { method: 'POST', body: formData })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || 'Failed to add doctor.')
        this.doctors.unshift({ ...data.doctor, has_account: false })
        this.lastAddedDoctor = data.doctor
        this.closeAddModal()
        this.showSuccess = true
        setTimeout(() => { this.showSuccess = false }, 3000)
        setTimeout(() => { this.showCreatePrompt = true }, 500)
      } catch (err) { this.addError = err.message }
      finally { this.saving = false }
    },

    openCreateAccountFromPrompt() {
      this.showCreatePrompt = false
      if (this.lastAddedDoctor) this.openCreateAccount(this.lastAddedDoctor)
    },

    openCreateAccount(doctor) {
      this.accountTargetDoctor = doctor
      this.accountError = ''
      this.generateCredentials()
      this.showAccountModal = true
    },

    generateCredentials() {
      if (!this.accountTargetDoctor) return
      const first = this.accountTargetDoctor.first_name.toLowerCase().replace(/\s+/g, '')
      const last  = this.accountTargetDoctor.last_name.toLowerCase().replace(/\s+/g, '')
      this.generatedUsername = `${first}.${last}@cqueue.com`
      this.generatedPassword = this.randomPassword()
    },

    randomPassword() {
      const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', lower = 'abcdefghijklmnopqrstuvwxyz'
      const digits = '0123456789', special = '!@#$%^&*'
      const all = upper + lower + digits + special
      let pwd = ''
      pwd += upper[Math.floor(Math.random() * upper.length)]
      pwd += lower[Math.floor(Math.random() * lower.length)]
      pwd += digits[Math.floor(Math.random() * digits.length)]
      pwd += special[Math.floor(Math.random() * special.length)]
      for (let i = 0; i < 6; i++) pwd += all[Math.floor(Math.random() * all.length)]
      return pwd.split('').sort(() => Math.random() - 0.5).join('')
    },

    async saveAccount() {
      this.accountError = ''; this.savingAccount = true
      try {
        const res = await fetch('http://localhost:8000/doctor-accounts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ doctor_id: this.accountTargetDoctor.id, username: this.generatedUsername, password: this.generatedPassword })
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || 'Failed to create account.')
        const idx = this.doctors.findIndex(d => d.id === this.accountTargetDoctor.id)
        if (idx !== -1) this.doctors[idx].has_account = true
        this.showAccountModal = false
        this.showAccountCreated = true
        setTimeout(() => { this.showAccountCreated = false }, 4000)
      } catch (err) { this.accountError = err.message }
      finally { this.savingAccount = false }
    },

    copyText(text) { navigator.clipboard.writeText(text).catch(() => {}) },

    openAddSpecialization() { this.newSpecialization = ''; this.addSpecError = ''; this.showAddSpecModal = true },
    async saveSpecialization() {
      if (!this.newSpecialization.trim()) { this.addSpecError = 'Name is required.'; return }
      this.savingSpec = true
      try {
        const res = await fetch('http://localhost:8000/specializations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: this.newSpecialization.trim() }) })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || 'Failed.')
        this.specializationList.push(data.specialization)
        this.newDoctor.specialization = data.specialization.name
        this.showAddSpecModal = false
      } catch (err) { this.addSpecError = err.message }
      finally { this.savingSpec = false }
    },

    openAddHospital() { this.newHospital = ''; this.addHospError = ''; this.showAddHospModal = true },
    async saveHospital() {
      if (!this.newHospital.trim()) { this.addHospError = 'Name is required.'; return }
      this.savingHosp = true
      try {
        const res = await fetch('http://localhost:8000/hospitals', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: this.newHospital.trim() }) })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || 'Failed.')
        this.hospitalList.push(data.hospital)
        this.newDoctor.hospital = data.hospital.name
        this.showAddHospModal = false
      } catch (err) { this.addHospError = err.message }
      finally { this.savingHosp = false }
    },

    viewDoctor(doctor) { this.selectedDoctor = doctor; this.showViewModal = true },

    triggerImport() { this.importFile = null; this.importError = ''; this.showImportModal = true },
    handleImport(event) {
      const file = event.target.files[0]
      if (file) { this.importFile = file; this.$refs.fileInput.value = '' }
    },
    handleDrop(event) {
      this.isDragOver = false
      const file = event.dataTransfer.files[0]
      if (file && (file.name.endsWith('.csv') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
        this.importFile = file
      } else { this.importError = 'Please upload a .csv, .xlsx, or .xls file.' }
    },

    async submitImport() {
      if (!this.importFile) return
      this.showImportModal = false
      this.importing = true
      this.showImportLoading = true
      this.importError = ''
      this.importResultErrors = []
      this.importResultCount = 0
      try {
        const formData = new FormData()
        formData.append('file', this.importFile)
        const res = await fetch('http://localhost:8000/doctors/import', { method: 'POST', body: formData })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || 'Import failed.')
        await this.fetchDoctors()
        this.importResultCount  = data.count || 0
        this.importResultErrors = data.errors || []
        this.showImportLoading = false
        this.showImportResult  = true
      } catch (err) {
        this.showImportLoading = false
        this.importError = err.message
        this.showImportModal = true
      } finally {
        this.importing = false
        this.importFile = null
      }
    },

    async fetchDoctors() {
      this.loading = true
      try {
        const res = await fetch('http://localhost:8000/doctors')
        this.doctors = await res.json()
      } catch (err) { console.error('Failed to fetch doctors:', err) }
      finally { this.loading = false }
    },

    async fetchHospitals() {
      try { this.hospitalList = await (await fetch('http://localhost:8000/hospitals')).json() }
      catch (err) { console.error('Failed to fetch hospitals:', err) }
    },

    async fetchSpecializations() {
      try { this.specializationList = await (await fetch('http://localhost:8000/specializations')).json() }
      catch (err) { console.error('Failed to fetch specializations:', err) }
    },

    formatDate(dateStr) {
      if (!dateStr) return '—'
      return new Date(dateStr).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })
    },
    goTo(page) { this.accountOpen = false; if (page === 'edit-account') this.$router.push('/edit-profile') },
    handleLogout() { localStorage.removeItem('user'); this.$router.push('/') }
  },
  mounted() {
    this.fetchDoctors()
    this.fetchHospitals()
    this.fetchSpecializations()
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
.layout { display: flex; min-height: 100vh; font-family: 'Plus Jakarta Sans', sans-serif; background: #f0f4f8; }

/* ══ IMPORT LOADING OVERLAY ══ */
.import-loading-overlay {
  position: fixed; inset: 0; background: rgba(15, 23, 42, 0.75);
  display: flex; align-items: center; justify-content: center;
  z-index: 9999; backdrop-filter: blur(4px);
}
.import-loading-box {
  background: white; border-radius: 24px; padding: 48px 52px;
  display: flex; flex-direction: column; align-items: center; gap: 16px;
  box-shadow: 0 32px 80px rgba(0,0,0,0.25); min-width: 320px;
}
.import-spinner-ring { position: relative; width: 80px; height: 80px; }
.import-spinner-svg { width: 80px; height: 80px; }
.spin-arc { transform-origin: 30px 30px; animation: spin-arc 1.1s linear infinite; }
@keyframes spin-arc { to { transform: rotate(360deg); } }
.import-spinner-icon { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
.import-loading-title { font-size: 18px; font-weight: 700; color: #1e293b; margin-top: 4px; }
.import-loading-sub { font-size: 13px; color: #64748b; text-align: center; line-height: 1.6; }
.import-loading-dots { display: flex; gap: 6px; margin-top: 4px; }
.import-loading-dots span { width: 8px; height: 8px; border-radius: 50%; background: #3aa6a6; animation: dot-bounce 1.2s ease-in-out infinite; }
.import-loading-dots span:nth-child(2) { animation-delay: 0.2s; }
.import-loading-dots span:nth-child(3) { animation-delay: 0.4s; }
@keyframes dot-bounce { 0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; } 40% { transform: scale(1); opacity: 1; } }
.fade-overlay-enter-active, .fade-overlay-leave-active { transition: opacity 0.3s ease; }
.fade-overlay-enter-from, .fade-overlay-leave-to { opacity: 0; }

/* ── TOASTS ── */
.toast {
  position: fixed; top: 24px; left: 50%; transform: translateX(-50%);
  padding: 14px 22px; border-radius: 12px; font-size: 14px; font-weight: 600;
  display: flex; align-items: center; gap: 10px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18); z-index: 9999; min-width: 320px; max-width: 520px;
}
.toast-green  { background: #16a34a; color: white; }
.toast-blue   { background: #2563eb; color: white; }
.toast-orange { background: #ea580c; color: white; }
.toast-action-btn { margin-left: auto; background: white; color: #ea580c; border: none; border-radius: 6px; padding: 5px 14px; font-size: 13px; font-weight: 700; cursor: pointer; }
.toast-dismiss { background: none; border: none; color: rgba(255,255,255,0.8); cursor: pointer; font-size: 16px; margin-left: 4px; }
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(-16px); }

/* ── SIDEBAR ── */
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

/* ── MAIN ── */
.main-wrapper { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.topbar { height: 60px; background: #3aa6a6; display: flex; align-items: center; justify-content: space-between; padding: 0 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); position: sticky; top: 0; z-index: 100; }
.hamburger { background: none; border: none; cursor: pointer; color: #fff; display: flex; padding: 6px; border-radius: 8px; transition: background 0.2s; }
.hamburger:hover { background: #f1f5f9; color: #1b2540; }
.topbar-right { display: flex; align-items: center; gap: 8px; }
.topbar-btn { position: relative; background: none; border: none; cursor: pointer; color: #fff; padding: 8px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
.topbar-btn:hover { background: #f1f5f9; color: #1b2540; }
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
.notif-title { font-size: 13px; color: #1e293b; font-weight: 500; }
.notif-time  { font-size: 11px; color: #94a3b8; margin-top: 2px; }
.account-wrapper { position: relative; cursor: pointer; }
.account-avatar { width: 36px; height: 36px; border-radius: 50%; background: #e2e8f0; display: flex; align-items: center; justify-content: center; color: #64748b; }
.account-dropdown { width: 220px; }
.account-info { flex-direction: column; align-items: flex-start; gap: 2px; }
.account-name  { font-size: 13px; font-weight: 600; color: #1e293b; }
.account-email { font-size: 11px; color: #94a3b8; }
.dropdown-divider { border: none; border-top: 1px solid #f1f5f9; }
.dropdown-item { display: flex; align-items: center; gap: 10px; width: 100%; padding: 11px 16px; background: none; border: none; text-align: left; font-size: 13px; color: #475569; cursor: pointer; font-family: inherit; transition: background 0.15s; }
.dropdown-item:hover { background: #f8fafc; color: #1e293b; }
.dropdown-item.logout { color: #ef4444; }
.dropdown-item.logout:hover { background: #fff5f5; }

/* ── CONTENT ── */
.content { padding: 28px; flex: 1; }
.page-title { font-size: 22px; font-weight: 700; color: #1e293b; }
.breadcrumb { font-size: 12px; color: #94a3b8; margin-top: 2px; }
.page-header { margin-bottom: 20px; }
.table-card { background: white; border-radius: 16px; padding: 24px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
.toolbar { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 24px; }
.toolbar-left  { display: flex; gap: 12px; flex-wrap: wrap; }
.toolbar-right { display: flex; gap: 10px; }
.search-box { display: flex; align-items: center; border: 1.5px solid #e2e8f0; border-radius: 8px; overflow: hidden; transition: border-color 0.2s; }
.search-box:focus-within { border-color: #3aa6a6; }
.search-input { padding: 8px 12px; border: none; outline: none; font-size: 13px; color: #475569; font-family: inherit; width: 160px; }
.search-btn { padding: 8px 12px; background: #3aa6a6; border: none; cursor: pointer; color: white; display: flex; align-items: center; }
.btn-add, .btn-import { display: flex; align-items: center; gap: 8px; padding: 10px 24px; background: #3aa6a6; color: white; border: none; border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: inherit; transition: background 0.2s; letter-spacing: 0.5px; }
.btn-add:hover, .btn-import:hover { background: #2e8b8b; }
.loading-state { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 60px; color: #94a3b8; }
.spinner { width: 32px; height: 32px; border: 3px solid #e2e8f0; border-top-color: #3aa6a6; border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ── TABLE ── */
.doctors-table { width: 100%; border-collapse: collapse; font-size: 14px; }
.doctors-table th { text-align: center; padding: 12px 16px; color: #64748b; font-weight: 600; font-size: 13px; border-bottom: 2px solid #f1f5f9; }
.doctors-table td { padding: 13px 16px; color: #475569; border-bottom: 1px solid #f1f5f9; text-align: center; }
.doctors-table tr:last-child td { border-bottom: none; }
.doctors-table tr:hover td { background: #f8fafc; }
.id-cell { font-family: monospace; font-size: 12px; color: #94a3b8; }
.status-badge { font-size: 12px; font-weight: 700; padding: 3px 12px; border-radius: 20px; }
.status-badge.in  { color: #16a34a; background: #dcfce7; }
.status-badge.out { color: #dc2626; background: #fee2e2; }
.account-badge { font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 20px; display: inline-flex; align-items: center; gap: 4px; }
.account-badge.done { color: #2563eb; background: #dbeafe; }
.account-badge.none { color: #94a3b8; background: #f1f5f9; }
.action-group { display: flex; align-items: center; justify-content: center; gap: 6px; flex-wrap: wrap; }
.btn-view { display: inline-flex; align-items: center; gap: 5px; padding: 6px 14px; background: #f0f4f8; color: #3aa6a6; border: 1.5px solid #3aa6a6; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.2s; }
.btn-view:hover { background: #3aa6a6; color: white; }
.btn-create-acct { display: inline-flex; align-items: center; gap: 5px; padding: 6px 12px; background: #eff6ff; color: #2563eb; border: 1.5px solid #2563eb; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.2s; white-space: nowrap; }
.btn-create-acct:hover:not(:disabled) { background: #2563eb; color: white; }
.btn-create-acct.done { background: #f0fdf4; color: #16a34a; border-color: #16a34a; cursor: default; opacity: 0.8; }
.btn-create-acct:disabled { opacity: 0.7; cursor: not-allowed; }
.empty-row { text-align: center; padding: 60px 0; }
.empty-state { display: flex; flex-direction: column; align-items: center; gap: 12px; color: #94a3b8; }

/* ══ SMART PAGINATION ══ */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
  flex-wrap: nowrap;
}
.page-btn {
  min-width: 30px;
  height: 30px;
  padding: 0 8px;
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
}
.page-btn:hover:not(:disabled) { border-color: #3aa6a6; color: #3aa6a6; background: #f0fafa; }
.page-btn.active { background: #3aa6a6; color: white; border-color: #3aa6a6; font-weight: 700; }
.page-btn:disabled { opacity: 0.35; cursor: not-allowed; }
.nav-arrow-btn { padding: 0 10px; color: #64748b; }
.page-ellipsis {
  min-width: 28px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: #94a3b8;
  user-select: none;
  letter-spacing: 1px;
}

/* ── MODALS ── */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; z-index: 500; padding: 20px; }
.modal { background: white; border-radius: 16px; width: 480px; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 20px 60px rgba(0,0,0,0.2); overflow: hidden; }
.modal-large  { width: 760px; }
.modal-sm     { width: 380px; }
.modal-result { width: 520px; }
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid #f1f5f9; flex-shrink: 0; }
.modal-header h3 { font-size: 16px; font-weight: 700; color: #1e293b; }
.modal-close { background: none; border: none; font-size: 16px; color: #94a3b8; cursor: pointer; }
.modal-close:hover { color: #1e293b; }
.modal-body { padding: 24px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 16px; }
.modal-footer { padding: 16px 24px; border-top: 1px solid #f1f5f9; display: flex; justify-content: flex-end; gap: 10px; flex-shrink: 0; }

/* Photo */
.photo-section { display: flex; align-items: center; gap: 20px; padding: 16px; background: #f8fafc; border-radius: 12px; }
.photo-preview { width: 80px; height: 80px; border-radius: 50%; overflow: hidden; background: #e2e8f0; display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: #94a3b8; }
.photo-preview img { width: 100%; height: 100%; object-fit: cover; }
.photo-placeholder { display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; }
.photo-label { font-size: 13px; font-weight: 600; color: #1e293b; margin-bottom: 4px; }
.photo-hint { font-size: 11px; color: #94a3b8; margin-bottom: 10px; }
.btn-upload { padding: 7px 16px; background: white; border: 1.5px solid #e2e8f0; border-radius: 7px; font-size: 12px; font-weight: 600; color: #475569; cursor: pointer; font-family: inherit; transition: all 0.2s; }
.btn-upload:hover { border-color: #3aa6a6; color: #3aa6a6; }
.section-title { font-size: 12px; font-weight: 700; color: #3aa6a6; text-transform: uppercase; letter-spacing: 0.8px; padding-bottom: 6px; border-bottom: 1.5px solid #e2e8f0; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; width: 100%; box-sizing: border-box; }
.field-group { display: flex; flex-direction: column; gap: 5px; min-width: 0; }
.field-group.span-2 { grid-column: span 2; }
.field-group label { font-size: 12px; font-weight: 600; color: #374151; }
.field-group input, .field-group select {
  padding: 9px 13px; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 13px;
  color: #1e293b !important; background: #ffffff !important; outline: none; font-family: inherit;
  transition: border-color 0.2s, box-shadow 0.2s; width: 100%; box-sizing: border-box;
  -webkit-text-fill-color: #1e293b !important;
}
.field-group input::placeholder { color: #94a3b8 !important; opacity: 1; }
.field-group input:-webkit-autofill, .field-group input:-webkit-autofill:hover,
.field-group input:-webkit-autofill:focus, .field-group select:-webkit-autofill {
  -webkit-box-shadow: 0 0 0px 1000px #ffffff inset !important;
  -webkit-text-fill-color: #1e293b !important; background-color: #ffffff !important;
}
.field-group input:focus, .field-group select:focus {
  border-color: #3aa6a6; box-shadow: 0 0 0 3px rgba(58,166,166,0.12); background: #ffffff !important;
}
.required { color: #ef4444; }
.error-msg { color: #ef4444; font-size: 12px; background: #fff5f5; padding: 8px 12px; border-radius: 6px; border: 1px solid #fecaca; }
.btn-cancel { padding: 9px 20px; background: #f1f5f9; color: #475569; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; }
.btn-cancel:hover { background: #e2e8f0; }
.btn-add-confirm { padding: 9px 20px; background: #3aa6a6; color: white; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; display: inline-flex; align-items: center; gap: 8px; }
.btn-add-confirm:hover:not(:disabled) { background: #2e8b8b; }
.btn-add-confirm:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-full { width: 100%; justify-content: center; padding: 12px 20px; font-size: 14px; }

/* Dropdown + Add button */
.select-with-add { display: flex; gap: 6px; align-items: center; width: 100%; box-sizing: border-box; overflow: hidden; }
.select-flex {
  flex: 1 1 0%; min-width: 0; max-width: calc(100% - 42px);
  padding: 9px 13px; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 13px;
  color: #1e293b !important; background: #ffffff !important; outline: none; font-family: inherit;
  transition: border-color 0.2s; box-sizing: border-box; overflow: hidden; text-overflow: ellipsis;
}
.select-flex:focus { border-color: #3aa6a6; box-shadow: 0 0 0 3px rgba(58,166,166,0.12); }
.btn-add-option {
  width: 36px; min-width: 36px; max-width: 36px; height: 36px;
  background: #3aa6a6; color: white; border: none; border-radius: 8px;
  font-size: 22px; font-weight: 400; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; flex-grow: 0; transition: background 0.2s; line-height: 1; padding: 0;
}
.btn-add-option:hover { background: #2e8b8b; }

/* View Doctor */
.view-profile { display: flex; align-items: center; gap: 20px; padding: 16px; background: #f8fafc; border-radius: 12px; }
.view-avatar { width: 80px; height: 80px; border-radius: 50%; background: #e2e8f0; display: flex; align-items: center; justify-content: center; color: #94a3b8; flex-shrink: 0; overflow: hidden; }
.view-avatar img { width: 100%; height: 100%; object-fit: cover; }
.view-doctor-name { font-size: 17px; font-weight: 700; color: #1e293b; }
.view-spec { font-size: 13px; color: #64748b; margin: 4px 0 8px; }
.view-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.view-section { background: #f8fafc; border-radius: 10px; padding: 14px 18px; }
.view-section.span-full { grid-column: span 2; }
.view-section-title { font-size: 11px; font-weight: 700; color: #3aa6a6; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 12px; }
.view-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
.view-row:last-child { border-bottom: none; }
.view-label { color: #94a3b8; font-weight: 500; }
.view-value { color: #1e293b; font-weight: 600; text-align: right; max-width: 55%; }

/* Create Account Modal */
.account-summary { display: flex; align-items: center; gap: 14px; background: #f8fafc; padding: 14px 16px; border-radius: 12px; }
.account-summary-avatar { width: 52px; height: 52px; border-radius: 50%; background: #e2e8f0; display: flex; align-items: center; justify-content: center; color: #94a3b8; flex-shrink: 0; overflow: hidden; }
.account-summary-avatar img { width: 100%; height: 100%; object-fit: cover; }
.account-summary-name { font-size: 15px; font-weight: 700; color: #1e293b; }
.account-summary-sub  { font-size: 12px; color: #64748b; margin-top: 2px; }
.credentials-box { background: #1e293b; border-radius: 12px; padding: 16px 20px; display: flex; flex-direction: column; gap: 12px; }
.cred-row { display: flex; align-items: center; gap: 10px; }
.cred-label { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.6px; width: 80px; flex-shrink: 0; }
.cred-value { flex: 1; font-size: 14px; font-weight: 600; color: #f1f5f9; font-family: monospace; word-break: break-all; }
.cred-pass { color: #7dd3fc; letter-spacing: 2px; }
.copy-btn { background: rgba(255,255,255,0.1); border: none; color: #94a3b8; border-radius: 6px; padding: 5px 7px; cursor: pointer; display: flex; align-items: center; transition: all 0.2s; }
.copy-btn:hover { background: rgba(255,255,255,0.2); color: white; }
.cred-note { display: flex; align-items: flex-start; gap: 8px; font-size: 12px; color: #64748b; background: #fefce8; padding: 10px 14px; border-radius: 8px; border: 1px solid #fde68a; }
.btn-regenerate { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; background: #f1f5f9; color: #475569; border: 1.5px solid #e2e8f0; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.2s; align-self: flex-start; }
.btn-regenerate:hover { border-color: #3aa6a6; color: #3aa6a6; }

/* Import Modal */
.drop-zone { border: 2px dashed #cbd5e1; border-radius: 12px; padding: 40px 20px; display: flex; flex-direction: column; align-items: center; gap: 10px; cursor: pointer; transition: all 0.2s; color: #94a3b8; }
.drop-zone.drag-over { border-color: #3aa6a6; background: #f0fafa; color: #3aa6a6; }
.drop-title { font-size: 15px; font-weight: 600; color: #475569; }
.drop-hint  { font-size: 12px; }
.btn-browse { margin-top: 8px; padding: 9px 24px; background: #3aa6a6; color: white; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; transition: background 0.2s; }
.btn-browse:hover { background: #2e8b8b; }
.import-file-info { display: flex; align-items: center; gap: 10px; padding: 10px 14px; background: #f0fafa; border: 1.5px solid #3aa6a6; border-radius: 8px; font-size: 13px; color: #1e293b; }
.import-file-info span { flex: 1; }
.btn-remove-file { background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 14px; }
.btn-remove-file:hover { color: #ef4444; }
.import-status-notice { display: flex; align-items: flex-start; gap: 12px; padding: 14px 16px; background: #fff7ed; border: 1.5px solid #fed7aa; border-radius: 10px; }
.notice-title { font-size: 13px; font-weight: 600; color: #9a3412; }
.notice-sub   { font-size: 12px; color: #c2410c; margin-top: 3px; }
.out-badge { display: inline-block; background: #fee2e2; color: #dc2626; font-size: 11px; font-weight: 700; padding: 1px 8px; border-radius: 10px; }
.import-note { font-size: 12px; color: #64748b; background: #f8fafc; padding: 10px 14px; border-radius: 8px; border: 1px solid #e2e8f0; }
.import-note strong { color: #1e293b; }

/* Import Result Modal */
.result-header { background: linear-gradient(135deg, #3aa6a6 0%, #2e8b8b 100%); padding: 36px 28px 28px; display: flex; flex-direction: column; align-items: center; gap: 10px; }
.result-check-circle { width: 72px; height: 72px; border-radius: 50%; background: rgba(255,255,255,0.25); display: flex; align-items: center; justify-content: center; margin-bottom: 4px; border: 3px solid rgba(255,255,255,0.5); }
.result-title    { font-size: 22px; font-weight: 700; color: white; }
.result-subtitle { font-size: 13px; color: rgba(255,255,255,0.8); }
.result-stats { display: flex; align-items: center; justify-content: center; padding: 20px 24px; gap: 0; border-bottom: 1px solid #f1f5f9; }
.result-stat-box { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; }
.result-stat-num { font-size: 28px; font-weight: 700; color: #1e293b; }
.result-stat-label { font-size: 11px; color: #94a3b8; font-weight: 500; text-align: center; }
.result-stat-divider { width: 1px; height: 40px; background: #e2e8f0; margin: 0 12px; }
.out-color  { color: #dc2626; }
.in-color   { color: #16a34a; }
.warn-color { color: #f59e0b; }
.result-reminder { display: flex; align-items: flex-start; gap: 14px; padding: 16px 18px; background: #fffbeb; border: 1.5px solid #fcd34d; border-radius: 12px; margin: 20px 24px 0; }
.reminder-icon-wrap { flex-shrink: 0; margin-top: 2px; }
.reminder-title { font-size: 13px; font-weight: 700; color: #92400e; margin-bottom: 5px; }
.reminder-body  { font-size: 12.5px; color: #78350f; line-height: 1.6; }
.result-steps { padding: 16px 24px 4px; display: flex; flex-direction: column; gap: 10px; }
.steps-title { font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
.step-item { display: flex; align-items: flex-start; gap: 12px; font-size: 13px; color: #475569; }
.step-num { width: 24px; height: 24px; border-radius: 50%; background: #3aa6a6; color: white; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; }
.result-errors { margin: 0 24px 16px; background: #fff5f5; border: 1px solid #fecaca; border-radius: 10px; padding: 12px 16px; }
.result-errors-title { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; color: #dc2626; margin-bottom: 8px; }
.result-error-list { list-style: none; display: flex; flex-direction: column; gap: 4px; }
.result-error-list li { font-size: 11.5px; color: #7f1d1d; padding: 3px 0; border-bottom: 1px solid #fee2e2; }
.result-error-list li:last-child { border-bottom: none; }
.more-errors { color: #94a3b8 !important; font-style: italic; }

@media (max-width: 768px) {
  .sidebar { position: fixed; z-index: 300; height: 100vh; }
  .content { padding: 16px; }
  .toolbar { flex-direction: column; align-items: flex-start; }
  .form-grid { grid-template-columns: 1fr; }
  .field-group.span-2 { grid-column: span 1; }
  .view-grid { grid-template-columns: 1fr; }
  .view-section.span-full { grid-column: span 1; }
  .modal-large { width: 95vw; }
  .modal-result { width: 95vw; }
  .action-group { flex-direction: column; }
  .result-stats { gap: 0; }
  .pagination { gap: 3px; }
  .page-btn { min-width: 28px; height: 28px; font-size: 11px; }
}
</style>