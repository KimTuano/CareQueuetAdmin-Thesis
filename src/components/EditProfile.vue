<template>
  <div class="layout">
    <!-- same sidebar as other pages -->
    <aside :class="['sidebar', { collapsed: sidebarCollapsed }]">
      <!-- copy sidebar from Dashboard.vue -->
    </aside>

    <div class="main-wrapper">
      <header class="topbar">
        <button class="hamburger" @click="sidebarCollapsed = !sidebarCollapsed">☰</button>
        <div class="topbar-right">
          <div class="account-wrapper">
            <div class="account-avatar">👤</div>
          </div>
        </div>
      </header>

      <main class="content">
        <div class="page-header">
          <h1 class="page-title">Edit Profile</h1>
          <p class="breadcrumb">Account / Edit Profile</p>
        </div>

        <div class="form-card">
          <p v-if="successMsg" class="success-msg">{{ successMsg }}</p>
          <p v-if="errorMsg"   class="error-msg">{{ errorMsg }}</p>

          <div class="field-group">
            <label>Full Name</label>
            <input type="text" v-model="form.name" />
          </div>
          <div class="field-group">
            <label>Email Address</label>
            <input type="email" v-model="form.email" />
          </div>
          <div class="field-group">
            <label>New Password <span class="hint">(leave blank to keep current)</span></label>
            <input type="password" v-model="form.password" placeholder="Enter new password" />
          </div>

          <div class="form-actions">
            <button class="cancel-btn" @click="$router.push('/dashboard')">Cancel</button>
            <button class="save-btn" @click="saveProfile">Save Changes</button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'EditProfile',
  data() {
    const user = JSON.parse(localStorage.getItem('user')) || {}
    return {
      sidebarCollapsed: false,
      successMsg: '',
      errorMsg: '',
      form: {
        name: user.name || '',
        email: user.email || '',
        password: ''
      }
    }
  },
  methods: {
    saveProfile() {
      this.successMsg = ''
      this.errorMsg = ''
      const currentUser = JSON.parse(localStorage.getItem('user'))

      axios.put('http://localhost:8000/update-profile', {
        currentEmail: currentUser.email,
        name: this.form.name,
        email: this.form.email,
        password: this.form.password || undefined
      })
      .then(response => {
        // ✅ Update localStorage with new info
        localStorage.setItem('user', JSON.stringify(response.data.user))
        this.successMsg = 'Profile updated successfully!'
      })
      .catch(error => {
        this.errorMsg = error.response?.data?.message || 'Update failed.'
      })
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
.layout { display: flex; min-height: 100vh; font-family: 'Plus Jakarta Sans', sans-serif; background: #f0f4f8; }
.main-wrapper { flex: 1; display: flex; flex-direction: column; }
.topbar { height: 60px; background: white; display: flex; align-items: center; justify-content: space-between; padding: 0 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
.hamburger { background: none; border: none; cursor: pointer; font-size: 20px; color: #64748b; }
.account-avatar { width: 36px; height: 36px; border-radius: 50%; background: #e2e8f0; display: flex; align-items: center; justify-content: center; }
.content { padding: 28px; flex: 1; }
.page-title { font-size: 22px; font-weight: 700; color: #1e293b; }
.breadcrumb { font-size: 12px; color: #94a3b8; margin-top: 2px; }
.page-header { margin-bottom: 20px; }
.form-card { background: white; border-radius: 16px; padding: 32px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); max-width: 500px; display: flex; flex-direction: column; gap: 20px; }
.field-group { display: flex; flex-direction: column; gap: 6px; }
.field-group label { font-size: 13px; font-weight: 600; color: #64748b; }
.hint { font-weight: 400; color: #94a3b8; font-size: 11px; }
input { padding: 10px 14px; border: 1.5px solid #e2e8f0; border-radius: 8px; font-size: 14px; color: #475569; font-family: inherit; outline: none; transition: border-color 0.2s; }
input:focus { border-color: #3aa6a6; }
.form-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 8px; }
.save-btn { padding: 10px 24px; background: #3aa6a6; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; }
.save-btn:hover { background: #2e8b8b; }
.cancel-btn { padding: 10px 24px; background: white; color: #64748b; border: 1.5px solid #e2e8f0; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; }
.cancel-btn:hover { background: #f8fafc; }
.success-msg { color: #16a34a; background: #dcfce7; padding: 10px 14px; border-radius: 8px; font-size: 13px; }
.error-msg { color: #dc2626; background: #fee2e2; padding: 10px 14px; border-radius: 8px; font-size: 13px; }
</style>