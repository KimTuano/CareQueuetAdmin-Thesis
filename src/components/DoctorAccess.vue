<template>
  <div class="layout">
    <!-- SIDEBAR -->
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

    <!-- MAIN -->
    <div class="main-wrapper">
      <header class="topbar">
        <div class="topbar-left">
          <button class="hamburger" @click="sidebarCollapsed = !sidebarCollapsed">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
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
              <button class="dropdown-item" @click="goTo('edit-account')">
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

      <!-- ACCESS DENIED for doctor trying to reach this page -->
      <main class="content" v-if="!isAdmin">
        <div class="access-denied-page">
          <div class="access-denied-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
          </div>
          <h2 class="access-denied-title">Admin Access Only</h2>
          <p class="access-denied-text">This page is restricted to administrators. You do not have permission to view Access Control settings.</p>
          <button class="btn-go-back" @click="$router.push('/dashboard')">← Go to Dashboard</button>
        </div>
      </main>

      <!-- ADMIN ACCESS CONTROL PAGE -->
      <main class="content" v-else>
        <div class="page-header">
          <div>
            <h1 class="page-title">ACCESS CONTROL</h1>
            <p class="breadcrumb">Home / Access Control</p>
          </div>
          <div class="header-badge">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
            Admin Only
          </div>
        </div>

        <!-- Instruction Banner -->
        <div class="instruction-banner">
          <div class="instruction-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <div class="instruction-text">
            <p class="instruction-title">How to use Access Control</p>
            <ul class="instruction-list">
              <li>Select a doctor from the list to manage their system access.</li>
              <li>Check the boxes to <strong>grant</strong> access to specific pages/features.</li>
              <li>Uncheck to <strong>revoke</strong> access. Doctors cannot override these settings.</li>
              <li>Click <strong>Save Permissions</strong> when done — a confirmation will appear before saving.</li>
              <li>Changes are saved to the database and take effect immediately.</li>
            </ul>
          </div>
        </div>

        <div class="access-layout">
          <!-- LEFT: Doctor List -->
          <div class="doctor-list-card">
            <div class="card-header">
              <h3 class="card-title">Doctors</h3>
              <span class="doctor-count">{{ doctors.length }} total</span>
            </div>
            <div class="search-box">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <input type="text" v-model="searchDoctor" placeholder="Search doctor..." />
            </div>
            <div v-if="loadingDoctors" class="loading-mini">Loading...</div>
            <div class="doctor-list" v-else>
              <div
                v-for="doc in filteredDoctors"
                :key="doc.id"
                :class="['doctor-item', { active: selectedDoctor && selectedDoctor.id === doc.id }]"
                @click="selectDoctor(doc)"
              >
                <div class="doctor-avatar">{{ getInitials(doc) }}</div>
                <div class="doctor-info">
                  <p class="doctor-name">Dr. {{ doc.last_name }}, {{ doc.first_name }}</p>
                  <p class="doctor-spec">{{ doc.specialization }}</p>
                </div>
                <span :class="['status-dot', doc.status === 'IN' ? 'in' : 'out']"></span>
              </div>
              <div v-if="filteredDoctors.length === 0" class="no-doctors">No doctors found.</div>
            </div>
          </div>

          <!-- RIGHT: Permission Panel -->
          <div class="permission-card">
            <div v-if="!selectedDoctor" class="no-selection">
              <div class="no-selection-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/></svg>
              </div>
              <p class="no-selection-text">Select a doctor to manage their access permissions</p>
            </div>

            <div v-else>
              <div class="permission-doctor-header">
                <div class="perm-avatar">{{ getInitials(selectedDoctor) }}</div>
                <div class="perm-doctor-info">
                  <h3>Dr. {{ selectedDoctor.last_name }}, {{ selectedDoctor.first_name }}</h3>
                  <p>{{ selectedDoctor.specialization }} · {{ selectedDoctor.hospital }}</p>
                </div>
                <span :class="['status-badge-pill', selectedDoctor.status === 'IN' ? 'in' : 'out']">
                  {{ selectedDoctor.status === 'IN' ? '● IN' : '● OUT' }}
                </span>
              </div>

              <!-- Toggle: Admin view vs Doctor's view preview -->
              <div class="view-toggle-bar">
                <span class="view-toggle-label">Preview mode:</span>
                <div class="view-toggle-buttons">
                  <button
                    :class="['toggle-btn', { active: !previewDoctorView }]"
                    @click="previewDoctorView = false"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                    All Permissions
                  </button>
                  <button
                    :class="['toggle-btn', { active: previewDoctorView }]"
                    @click="previewDoctorView = true"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                    Doctor's View
                  </button>
                </div>
              </div>

              <div v-if="loadingPerms" class="loading-mini" style="padding:30px;text-align:center;">Loading permissions...</div>

              <!-- DOCTOR'S VIEW: only show allowed permissions -->
              <div class="permissions-body" v-else-if="previewDoctorView">
                <div
                  class="perm-section"
                  v-for="section in permissionSections"
                  :key="section.label"
                  v-if="section.permissions.some(p => currentPerms[p.key])"
                >
                  <div class="perm-section-header">
                    <span class="perm-section-icon" v-html="section.icon"></span>
                    <span class="perm-section-label">{{ section.label }}</span>
                  </div>
                  <div class="perm-items">
                    <div
                      v-for="perm in section.permissions"
                      :key="perm.key"
                      v-if="currentPerms[perm.key]"
                      class="perm-item allowed perm-item-readonly"
                    >
                      <div class="perm-item-left">
                        <svg class="perm-check-icon" xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
                        <div class="perm-item-text">
                          <span class="perm-item-name">{{ perm.name }}</span>
                          <span class="perm-item-desc">{{ perm.desc }}</span>
                        </div>
                      </div>
                      <span class="perm-tag allowed">Allowed</span>
                    </div>
                  </div>
                </div>

                <!-- Empty state when no permissions granted -->
                <div v-if="!permissionSections.some(s => s.permissions.some(p => currentPerms[p.key]))" class="no-perms-state">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                  <p>No permissions granted yet.<br/>Switch to <strong>All Permissions</strong> to enable access.</p>
                </div>
              </div>

              <!-- ADMIN VIEW: show all permissions with checkboxes -->
              <div class="permissions-body" v-else>
                <div class="perm-section" v-for="section in permissionSections" :key="section.label">
                  <div class="perm-section-header">
                    <span class="perm-section-icon" v-html="section.icon"></span>
                    <span class="perm-section-label">{{ section.label }}</span>
                  </div>
                  <div class="perm-items">
                    <label
                      v-for="perm in section.permissions"
                      :key="perm.key"
                      :class="[
                        'perm-item',
                        {
                          allowed: currentPerms[perm.key],
                          denied: !currentPerms[perm.key]
                        }
                      ]"
                    >
                      <div class="perm-item-left">
                        <input
                          type="checkbox"
                          :checked="currentPerms[perm.key]"
                          @change="togglePerm(perm.key)"
                        />
                        <div class="perm-item-text">
                          <span class="perm-item-name">{{ perm.name }}</span>
                          <span class="perm-item-desc">{{ perm.desc }}</span>
                        </div>
                      </div>
                      <span :class="['perm-tag', currentPerms[perm.key] ? 'allowed' : 'denied']">
                        {{ currentPerms[perm.key] ? 'Allowed' : 'Denied' }}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div class="permission-footer">
                <p class="perm-note">
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                  Saved to database — takes effect immediately.
                </p>
                <button class="btn-save" @click="confirmSave" :disabled="loadingPerms">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                  Save Permissions
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- CONFIRM POPUP -->
    <transition name="modal-fade">
      <div class="modal-overlay" v-if="showConfirm" @click.self="showConfirm = false">
        <div class="confirm-modal">
          <div class="confirm-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
          </div>
          <h3 class="confirm-title">Save Permission Changes?</h3>
          <p class="confirm-desc">
            You are about to update access permissions for<br/>
            <strong>Dr. {{ selectedDoctor?.last_name }}, {{ selectedDoctor?.first_name }}</strong>.
          </p>

          <div class="confirm-summary">
            <div class="summary-title">Permission Summary</div>
            <div class="summary-list">
              <div v-for="item in permissionSummary" :key="item.key" class="summary-item">
                <span class="summary-name">{{ item.name }}</span>
                <span :class="['summary-tag', item.value ? 'allowed' : 'denied']">
                  {{ item.value ? '✓ Allowed' : '✕ Denied' }}
                </span>
              </div>
            </div>
          </div>

          <p class="confirm-warning">This action takes effect immediately. Do you wish to continue?</p>

          <div class="confirm-actions">
            <button class="btn-cancel" @click="showConfirm = false">Cancel</button>
            <button class="btn-confirm" @click="savePermissions" :disabled="saving">
              <span v-if="saving" class="btn-spinner"></span>
              <span v-else>Yes, Save Changes</span>
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- TOAST -->
    <transition name="toast-anim">
      <div v-if="toast" :class="['toast', toast.type]">
        <svg v-if="toast.type === 'success'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        {{ toast.message }}
      </div>
    </transition>

  </div>
</template>

<script>
export default {
  name: 'DoctorAccess',

  directives: {
    'click-outside': {
      mounted(el, binding) {
        el._clickOutside = (e) => {
          if (!el.contains(e.target)) binding.value(e)
        }
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
      loadingDoctors: false,
      loadingPerms: false,
      saving: false,
      searchDoctor: '',
      doctors: [],
      selectedDoctor: null,
      showConfirm: false,
      toast: null,
      waitingCount: 0,
      doctorsIN: 0,
      totalDoctors: 0,
      currentPerms: {},
      // ✅ NEW: toggle between admin edit view and doctor's view preview
      previewDoctorView: false,
      permPollingInterval: null,

      currentUser:
        JSON.parse(localStorage.getItem('user')) || {
          name: 'Admin',
          email: ''
        },

      livePerms:
        JSON.parse(localStorage.getItem('doctorPermissions') || '{}'),

      permissionSections: [
        {
          label: 'Dashboard & Schedule',
          icon: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>',
          permissions: [
            { key: 'view_dashboard', name: 'View Dashboard',  desc: 'Access the main dashboard with stats overview' },
            { key: 'view_schedule',  name: 'View Schedule',   desc: 'View the appointment calendar and schedule' },
          ]
        },
        {
          label: 'Appointments',
          icon: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>',
          permissions: [
            { key: 'book_appointment',   name: 'Book Appointment',          desc: 'Create new patient appointments' },
            { key: 'view_appointments',  name: 'View All Appointments',     desc: 'See the full list of all appointments' },
            { key: 'update_appt_status', name: 'Update Appointment Status', desc: 'Mark appointments as arrived, completed, cancelled' },
            { key: 'view_queue',         name: 'View Queue',                desc: 'Access the patient queue page' },
          ]
        },
        {
          label: 'Medical Records',
          icon: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>',
          permissions: [
            { key: 'view_medical_records', name: 'View Medical Records', desc: 'Access all patient medical records' },
            { key: 'view_patient_profile', name: 'View Patient Profile',  desc: 'See full patient profile and history' },
            { key: 'print_records',        name: 'Print Records',         desc: 'Print patient records and documents' },
          ]
        },
        {
          label: 'Patients',
          icon: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
          permissions: [
            { key: 'view_patients',   name: 'View Patients List', desc: 'Browse the full list of registered patients' },
            { key: 'search_patients', name: 'Search Patients',    desc: 'Search and filter patient records' },
          ]
        },
        {
          label: 'Doctors & Admin',
          icon: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>',
          permissions: [
            { key: 'view_doctors', name: 'View Doctors List', desc: 'See the full list of doctors in the system' },
            { key: 'edit_profile', name: 'Edit Own Profile',  desc: 'Update their own account profile' },
          ]
        },
      ]
    }
  },

  computed: {
    isAdmin() {
      return localStorage.getItem('role') === 'admin'
    },

    filteredDoctors() {
      if (!this.searchDoctor) return this.doctors
      const q = this.searchDoctor.toLowerCase()

      return this.doctors.filter(d =>
        `${d.first_name} ${d.last_name}`
          .toLowerCase()
          .includes(q) ||
        (d.specialization || '')
          .toLowerCase()
          .includes(q)
      )
    },

    permissionSummary() {
      const all = []

      this.permissionSections.forEach(s => {
        s.permissions.forEach(p => {
          all.push({
            key: p.key,
            name: p.name,
            value: this.currentPerms[p.key]
          })
        })
      })

      return all
    }
  },

  methods: {
    doctorCan(key) {
      return !!this.livePerms[key]
    },

    async fetchDoctors() {
      this.loadingDoctors = true
      try {
        const res = await fetch('http://localhost:8000/doctors')
        this.doctors = await res.json()

        this.totalDoctors = this.doctors.length
        this.doctorsIN =
          this.doctors.filter(d => d.status === 'IN').length
      } catch (e) {
        console.error(e)
      } finally {
        this.loadingDoctors = false
      }
    },

    async fetchWaitingCount() {
      try {
        const res = await fetch('http://localhost:8000/appointments')
        const appts = await res.json()

        this.waitingCount =
          appts.filter(a => a.status === 'waiting').length
      } catch (e) {
        console.error(e)
      }
    },

    async selectDoctor(doc) {
      this.selectedDoctor = doc
      this.loadingPerms = true
      // Reset to admin view when switching doctors
      this.previewDoctorView = false

      try {
        const res = await fetch(
          `http://localhost:8000/doctor-permissions/${doc.id}`
        )

        const data = await res.json()

        const perms = {}

        this.permissionSections.forEach(s => {
          s.permissions.forEach(p => {
            perms[p.key] = !!data[p.key]
          })
        })

        this.currentPerms = { ...perms }
      } catch (e) {
        this.currentPerms = this.buildDefaultPerms()
      } finally {
        this.loadingPerms = false
      }
    },

    buildDefaultPerms() {
      const perms = {}

      this.permissionSections.forEach(s => {
        s.permissions.forEach(p => {
          perms[p.key] = false
        })
      })

      return perms
    },

    togglePerm(key) {
      this.currentPerms = {
        ...this.currentPerms,
        [key]: !this.currentPerms[key]
      }
    },

    confirmSave() {
      if (!this.selectedDoctor) return
      this.showConfirm = true
    },

    async savePermissions() {
      if (!this.selectedDoctor) return

      this.saving = true

      try {
        const res = await fetch(
          `http://localhost:8000/doctor-permissions/${this.selectedDoctor.id}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.currentPerms)
          }
        )

        if (!res.ok) throw new Error('Save failed')

        localStorage.setItem(
          'doctorPermissions',
          JSON.stringify(this.currentPerms)
        )

        this.livePerms = { ...this.currentPerms }

        this.showConfirm = false

        this.showToast(
          `Permissions saved for Dr. ${this.selectedDoctor.last_name}`,
          'success'
        )
      } catch (e) {
        this.showToast(
          'Failed to save permissions. Please try again.',
          'error'
        )
      } finally {
        this.saving = false
      }
    },

    showToast(message, type = 'success') {
      this.toast = { message, type }

      setTimeout(() => {
        this.toast = null
      }, 3500)
    },

    getInitials(doc) {
      return `${(doc.first_name || '?')[0]}${(
        doc.last_name || '?'
      )[0]}`.toUpperCase()
    },

    goTo(path) {
      this.$router.push('/' + path)
    },

    handleLogout() {
      localStorage.removeItem('user')
      localStorage.removeItem('role')
      localStorage.removeItem('doctorPermissions')
      this.$router.push('/')
    }
  },

  mounted() {
    if (this.isAdmin) {
      this.fetchDoctors()
      this.fetchWaitingCount()
    }
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
.sidebar.collapsed .nav-label { display: none; }
.sidebar-logo { display: flex; align-items: center; justify-content: center; border-bottom: 1px solid rgba(255,255,255,0.07); margin-bottom: -12px; }
.sidebar-logo-img { width: 60%; height: 60%; border-radius: 10px; object-fit: cover; background: white; padding: 2px; transition: width 0.3s, height 0.3s; }
.sidebar.collapsed .sidebar-logo-img { margin-top: 5px; margin-bottom: 5px; width: 40px; height: 40px; }
.sidebar-nav { padding: 12px 0; flex: 1; }
.nav-item { display: flex; align-items: center; gap: 12px; padding: 11px 16px; color: #94a3b8; text-decoration: none; font-size: 13.5px; font-weight: 500; cursor: pointer; transition: all 0.2s; border-left: 3px solid transparent; white-space: nowrap; }
.nav-item:hover { color: white; background: rgba(255,255,255,0.06); }
.nav-item.active { color: white; background: rgba(58,166,166,0.15); border-left-color: #3aa6a6; }
.nav-icon { flex-shrink: 0; display: flex; }
.nav-arrow { margin-left: auto; transition: transform 0.2s; }
.nav-dropdown.open .nav-arrow { transform: rotate(180deg); }
.nav-sub { background: rgba(0,0,0,0.15); padding: 4px 0; }
.nav-sub-item { display: block; padding: 8px 16px 8px 46px; color: #64748b; text-decoration: none; font-size: 12.5px; font-weight: 500; transition: all 0.2s; white-space: nowrap; }
.nav-sub-item:hover { color: #94a3b8; }
.nav-sub-item.active { color: #3aa6a6; }
.nav-sub-locked { display: flex; align-items: center; gap: 6px; padding: 8px 16px 8px 46px; color: #475569; font-size: 12px; font-style: italic; }

/* Doctor role tag at bottom of sidebar */
.role-tag { display: flex; align-items: center; gap: 10px; padding: 10px 16px; color: #3aa6a6; font-size: 12px; font-weight: 600; border-top: 1px solid rgba(255,255,255,0.06); margin-top: auto; }

/* TOPBAR */
.main-wrapper { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.topbar { height: 60px; background: #3aa6a6; display: flex; align-items: center; justify-content: space-between; padding: 0 24px; position: sticky; top: 0; z-index: 100; }
.hamburger { background: none; border: none; cursor: pointer; color: white; display: flex; padding: 6px; border-radius: 8px; }
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

/* ACCESS DENIED PAGE */
.access-denied-page { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; gap: 20px; text-align: center; padding: 40px; }
.access-denied-icon { width: 100px; height: 100px; background: #fee2e2; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #dc2626; }
.access-denied-title { font-size: 24px; font-weight: 700; color: #1e293b; }
.access-denied-text { font-size: 14px; color: #64748b; max-width: 400px; line-height: 1.7; }
.btn-go-back { padding: 11px 28px; background: #3aa6a6; color: white; border: none; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; transition: background 0.2s; }
.btn-go-back:hover { background: #2e8b8b; }

/* CONTENT */
.content { padding: 28px; flex: 1; }
.page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
.page-title { font-size: 22px; font-weight: 700; color: #1e293b; }
.breadcrumb { font-size: 12px; color: #94a3b8; margin-top: 2px; }
.header-badge { display: inline-flex; align-items: center; gap: 6px; background: #1b2540; color: #94a3b8; font-size: 12px; font-weight: 600; padding: 8px 16px; border-radius: 20px; }

/* INSTRUCTION BANNER */
.instruction-banner { display: flex; gap: 16px; background: linear-gradient(135deg, #e0f2fe, #f0fdf4); border: 1.5px solid #bae6fd; border-radius: 14px; padding: 18px 22px; margin-bottom: 24px; }
.instruction-icon { color: #0369a1; flex-shrink: 0; margin-top: 2px; }
.instruction-title { font-size: 14px; font-weight: 700; color: #0c4a6e; margin-bottom: 8px; }
.instruction-list { list-style: none; display: flex; flex-direction: column; gap: 5px; }
.instruction-list li { font-size: 13px; color: #075985; padding-left: 16px; position: relative; }
.instruction-list li::before { content: '→'; position: absolute; left: 0; color: #3aa6a6; }

/* ACCESS LAYOUT */
.access-layout { display: grid; grid-template-columns: 300px 1fr; gap: 20px; align-items: start; }

/* DOCTOR LIST CARD */
.doctor-list-card { background: white; border-radius: 16px; padding: 20px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
.card-title { font-size: 14px; font-weight: 700; color: #1e293b; }
.doctor-count { font-size: 11px; background: #f1f5f9; color: #64748b; padding: 3px 10px; border-radius: 20px; font-weight: 600; }
.search-box { display: flex; align-items: center; gap: 8px; border: 1.5px solid #e2e8f0; border-radius: 8px; padding: 8px 12px; margin-bottom: 14px; }
.search-box:focus-within { border-color: #3aa6a6; }
.search-box svg { color: #94a3b8; flex-shrink: 0; }
.search-box input { border: none; outline: none; font-size: 13px; color: #475569; width: 100%; font-family: inherit; }
.loading-mini { text-align: center; padding: 20px; color: #94a3b8; font-size: 13px; }
.doctor-list { display: flex; flex-direction: column; gap: 4px; max-height: 520px; overflow-y: auto; }
.doctor-item { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 10px; cursor: pointer; transition: all 0.2s; border: 1.5px solid transparent; }
.doctor-item:hover { background: #f0fafa; }
.doctor-item.active { background: #e6f7f7; border-color: #3aa6a6; }
.doctor-avatar { width: 38px; height: 38px; border-radius: 50%; background: linear-gradient(135deg, #3aa6a6, #2e8b8b); color: white; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; flex-shrink: 0; }
.doctor-info { flex: 1; min-width: 0; }
.doctor-name { font-size: 13px; font-weight: 600; color: #1e293b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.doctor-spec { font-size: 11px; color: #94a3b8; margin-top: 1px; }
.status-dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }
.status-dot.in  { background: #22c55e; }
.status-dot.out { background: #94a3b8; }
.no-doctors { text-align: center; padding: 30px; color: #94a3b8; font-size: 13px; }

/* PERMISSION CARD */
.permission-card { background: white; border-radius: 16px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); overflow: hidden; }
.no-selection { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 80px 40px; color: #94a3b8; }
.no-selection-icon { width: 80px; height: 80px; border-radius: 50%; background: #f8fafc; display: flex; align-items: center; justify-content: center; }
.no-selection-text { font-size: 14px; text-align: center; max-width: 260px; }
.permission-doctor-header { display: flex; align-items: center; gap: 16px; padding: 20px 24px; background: linear-gradient(135deg, #1b2540, #2d3a5c); color: white; }
.perm-avatar { width: 52px; height: 52px; border-radius: 50%; background: linear-gradient(135deg, #3aa6a6, #2e8b8b); display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 700; flex-shrink: 0; }
.perm-doctor-info { flex: 1; }
.perm-doctor-info h3 { font-size: 16px; font-weight: 700; }
.perm-doctor-info p  { font-size: 12px; opacity: 0.7; margin-top: 3px; }
.status-badge-pill { font-size: 11px; font-weight: 700; padding: 5px 12px; border-radius: 20px; flex-shrink: 0; }
.status-badge-pill.in  { background: rgba(34,197,94,0.2); color: #86efac; }
.status-badge-pill.out { background: rgba(148,163,184,0.2); color: #94a3b8; }

/* VIEW TOGGLE BAR */
.view-toggle-bar { display: flex; align-items: center; justify-content: space-between; padding: 12px 24px; background: #f8fafc; border-bottom: 1px solid #f1f5f9; }
.view-toggle-label { font-size: 12px; font-weight: 600; color: #64748b; }
.view-toggle-buttons { display: flex; gap: 6px; }
.toggle-btn { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border: 1.5px solid #e2e8f0; border-radius: 8px; background: white; color: #64748b; font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.2s; }
.toggle-btn:hover { border-color: #3aa6a6; color: #3aa6a6; }
.toggle-btn.active { background: #3aa6a6; border-color: #3aa6a6; color: white; }

.permissions-body { padding: 20px 24px; display: flex; flex-direction: column; gap: 24px; max-height: 480px; overflow-y: auto; }
.perm-section-header { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
.perm-section-icon { display: flex; color: #3aa6a6; }
.perm-section-label { font-size: 12px; font-weight: 700; color: #3aa6a6; text-transform: uppercase; letter-spacing: 0.7px; }
.perm-items { display: flex; flex-direction: column; gap: 8px; }
.perm-item { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border: 1.5px solid #f1f5f9; border-radius: 10px; cursor: pointer; transition: all 0.2s; }
.perm-item:hover { border-color: #3aa6a6; background: #f0fafa; }
.perm-item.allowed { border-color: #bbf7d0; background: #f0fdf4; }
.perm-item.denied  { border-color: #f1f5f9; background: white; }

/* Read-only perm items in doctor's view */
.perm-item-readonly { cursor: default; }
.perm-item-readonly:hover { border-color: #bbf7d0; background: #f0fdf4; }
.perm-check-icon { color: #16a34a; flex-shrink: 0; }

.perm-item-left { display: flex; align-items: center; gap: 12px; }
.perm-item-left input[type="checkbox"] { width: 17px; height: 17px; accent-color: #3aa6a6; cursor: pointer; flex-shrink: 0; }
.perm-item-text { display: flex; flex-direction: column; gap: 2px; }
.perm-item-name { font-size: 13px; font-weight: 600; color: #1e293b; }
.perm-item-desc { font-size: 11px; color: #94a3b8; }
.perm-tag { font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 20px; flex-shrink: 0; }
.perm-tag.allowed { background: #dcfce7; color: #15803d; }
.perm-tag.denied  { background: #fee2e2; color: #dc2626; }

/* Empty state when no permissions granted */
.no-perms-state { display: flex; flex-direction: column; align-items: center; gap: 14px; padding: 50px 30px; color: #94a3b8; text-align: center; }
.no-perms-state p { font-size: 13px; line-height: 1.7; }
.no-perms-state strong { color: #3aa6a6; }

.permission-footer { display: flex; justify-content: space-between; align-items: center; padding: 16px 24px; border-top: 1px solid #f1f5f9; background: #fafafa; }
.perm-note { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #94a3b8; }
.btn-save { display: inline-flex; align-items: center; gap: 8px; padding: 10px 24px; background: #3aa6a6; color: white; border: none; border-radius: 10px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.2s; }
.btn-save:hover:not(:disabled) { background: #2e8b8b; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(58,166,166,0.3); }
.btn-save:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

/* CONFIRM MODAL */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 500; padding: 20px; backdrop-filter: blur(4px); }
.confirm-modal { background: white; border-radius: 20px; width: 100%; max-width: 480px; padding: 36px; box-shadow: 0 24px 60px rgba(0,0,0,0.25); text-align: center; }
.confirm-icon { width: 68px; height: 68px; border-radius: 50%; background: linear-gradient(135deg, #3aa6a6, #2e8b8b); display: flex; align-items: center; justify-content: center; color: white; margin: 0 auto 20px; }
.confirm-title { font-size: 20px; font-weight: 700; color: #1e293b; margin-bottom: 10px; }
.confirm-desc { font-size: 14px; color: #64748b; line-height: 1.6; margin-bottom: 20px; }
.confirm-desc strong { color: #1e293b; }
.confirm-summary { background: #f8fafc; border-radius: 12px; padding: 16px; margin-bottom: 16px; text-align: left; }
.summary-title { font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 10px; }
.summary-list { display: flex; flex-direction: column; gap: 6px; max-height: 200px; overflow-y: auto; }
.summary-item { display: flex; justify-content: space-between; align-items: center; font-size: 12px; }
.summary-name { color: #475569; font-weight: 500; }
.summary-tag { font-size: 11px; font-weight: 700; padding: 2px 9px; border-radius: 20px; }
.summary-tag.allowed { background: #dcfce7; color: #15803d; }
.summary-tag.denied  { background: #fee2e2; color: #dc2626; }
.confirm-warning { font-size: 12px; color: #f97316; margin-bottom: 24px; font-weight: 500; }
.confirm-actions { display: flex; gap: 12px; }
.btn-cancel  { flex: 1; padding: 11px; background: #f1f5f9; color: #475569; border: none; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; transition: background 0.2s; }
.btn-cancel:hover { background: #e2e8f0; }
.btn-confirm { flex: 1; padding: 11px; background: linear-gradient(135deg, #3aa6a6, #2e8b8b); color: white; border: none; border-radius: 10px; font-size: 14px; font-weight: 700; cursor: pointer; font-family: inherit; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s; }
.btn-confirm:hover:not(:disabled) { box-shadow: 0 4px 16px rgba(58,166,166,0.4); }
.btn-confirm:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* TRANSITIONS */
.modal-fade-enter-active, .modal-fade-leave-active { transition: all 0.25s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; transform: scale(0.95); }
.toast { position: fixed; bottom: 30px; right: 30px; padding: 14px 20px; border-radius: 12px; font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 10px; box-shadow: 0 8px 24px rgba(0,0,0,0.15); z-index: 9999; color: white; }
.toast.success { background: #16a34a; }
.toast.error   { background: #dc2626; }
.toast-anim-enter-active, .toast-anim-leave-active { transition: all 0.3s ease; }
.toast-anim-enter-from, .toast-anim-leave-to { opacity: 0; transform: translateY(20px); }

@media (max-width: 900px) {
  .access-layout { grid-template-columns: 1fr; }
  .sidebar { position: fixed; z-index: 300; height: 100vh; }
}
</style>