<template>
  <div class="container">

    <!-- ── SUCCESS TOAST ── -->
    <transition name="toast">
      <div v-if="showSuccess" class="toast-success">
        <span class="toast-dot"></span>
        Successfully logged in!
      </div>
    </transition>

    <!-- ── LEFT PANEL: Auto Slider ── -->
    <div class="left">
      <div class="slides-wrapper">
        <transition name="slide-fade" mode="out-in">
          <!-- SLIDE 1: Logo -->
          <div class="slide" :key="currentSlide" v-if="currentSlide === 0">
            <div class="logo-box">
              <img src="./assets/CareQueueLogo.svg" class="logo" alt="CareQueue Logo" />
            </div>
            <div class="slide-dots">
              <span class="dot active"></span>
              <span class="dot" @click="currentSlide = 1"></span>
              <span class="dot" @click="currentSlide = 2"></span>
            </div>
          </div>

          <!-- SLIDE 2: Message -->
          <div class="slide slide-msg" :key="currentSlide" v-else-if="currentSlide === 1">
            <div class="slide-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
            </div>
            <h3 class="slide-title">Secure Access</h3>
            <p class="slide-text">Only authorized doctors and administrators can access the CareQueue system. Your credentials are protected.</p>
            <div class="slide-dots">
              <span class="dot" @click="currentSlide = 0"></span>
              <span class="dot active"></span>
              <span class="dot" @click="currentSlide = 2"></span>
            </div>
          </div>

          <!-- SLIDE 3: Message -->
          <div class="slide slide-msg" :key="currentSlide" v-else>
            <div class="slide-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            <h3 class="slide-title">Patient-First Care</h3>
            <p class="slide-text">Manage appointments, medical records, and doctor schedules — all in one seamless platform built for healthcare teams.</p>
            <div class="slide-dots">
              <span class="dot" @click="currentSlide = 0"></span>
              <span class="dot" @click="currentSlide = 1"></span>
              <span class="dot active"></span>
            </div>
          </div>
        </transition>
      </div>

      <div class="footer">© 2026 CareQueue. All Rights Reserved.</div>
    </div>

    <!-- ── RIGHT PANEL ── -->
    <div class="right">
      <div class="form-card">

        <div class="form-card-inner">
          <!-- Brand mark -->
          <div class="brand-mark">
            <span class="brand-line"></span>
            <span class="brand-name">CareQueue</span>
            <span class="brand-line"></span>
          </div>

          <h2>Sign In</h2>
          <p class="form-subtitle">Welcome back. Please enter your credentials.</p>

          <form @submit.prevent="handleLogin">
            <div class="field-group">
              <label>Email Address</label>
              <div class="input-wrapper">
                <span class="input-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
                  </svg>
                </span>
                <input
                  type="email"
                  v-model="login.email"
                  placeholder="sample@cqueue.com"
                  required
                  autocomplete="username"
                />
              </div>
            </div>

            <div class="field-group">
              <div class="password-label-row">
                <label>Password <span class="required">*</span></label>
                <a href="#" class="forgot-link">Forgot password?</a>
              </div>
              <div class="input-wrapper">
                <span class="input-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                </span>
                <input
                  :type="showPassword ? 'text' : 'password'"
                  v-model="login.password"
                  placeholder="Enter your password"
                  required
                  autocomplete="current-password"
                />
                <span class="eye-icon" @click="showPassword = !showPassword">
                  <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88L6.59 6.59m7.532 7.532l3.29 3.29M3 3l18 18"/>
                  </svg>
                </span>
              </div>
            </div>

            <!-- Error -->
            <transition name="err">
              <p v-if="errorMessage" class="error-msg">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                {{ errorMessage }}
              </p>
            </transition>

            <button class="main-btn" type="submit" :disabled="loading">
              <span v-if="loading" class="btn-spinner"></span>
              <span v-else>Sign In</span>
            </button>

            <div class="keep-logged">
              <input type="checkbox" id="keepLogged" v-model="keepLogged" />
              <label for="keepLogged">Keep me logged in</label>
            </div>
          </form>

          <div class="divider"></div>

          <div class="form-footer-links">
            <a href="#">Marketplace</a>
            <a href="#">License</a>
            <a href="#">Terms of Use</a>
            <a href="#">Blog</a>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'LoginPage',
  data() {
    return {
      showPassword: false,
      keepLogged: false,
      errorMessage: '',
      loading: false,
      showSuccess: false,
      currentSlide: 0,
      slideTimer: null,
      login: { email: '', password: '' }
    }
  },
  mounted() {
    this.startSlider()
  },
  beforeUnmount() {
    clearInterval(this.slideTimer)
  },
  methods: {
    startSlider() {
      this.slideTimer = setInterval(() => {
        this.currentSlide = (this.currentSlide + 1) % 3
      }, 4000)
    },
    async handleLogin() {
      this.errorMessage = ''
      this.loading = true
      try {
        const response = await axios.post('http://localhost:8000/login', this.login)
        const { user, role } = response.data
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('role', role)
        if (role === 'doctor' && user.permissions) {
          localStorage.setItem('doctorPermissions', JSON.stringify(user.permissions))
        }
        this.showSuccess = true
        setTimeout(() => {
          this.showSuccess = false
          this.$router.push('/dashboard')
        }, 1800)
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Login failed. Try again.'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style>
/* ── GLOBAL RESET (non-scoped — fixes white margin on html/body) ── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body { width: 100%; height: 100%; margin: 0; padding: 0; overflow-x: hidden; }
#app { margin: 0; padding: 0; }
</style>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');

.container {
  display: flex;
  width: 100vw;
  min-height: 100vh;
  font-family: 'DM Sans', sans-serif;
}

/* ── SUCCESS TOAST ── */
.toast-success {
  position: fixed;
  top: 28px;
  left: 50%;
  transform: translateX(-50%);
  background: #ffffff;
  color: #15803d;
  border: 1.5px solid #bbf7d0;
  border-radius: 40px;
  padding: 10px 22px;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.12);
  z-index: 9999;
  white-space: nowrap;
}
.toast-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 0 3px rgba(34,197,94,0.25);
  animation: pulse-dot 1.2s ease-in-out infinite;
  flex-shrink: 0;
}
@keyframes pulse-dot {
  0%, 100% { box-shadow: 0 0 0 3px rgba(34,197,94,0.25); }
  50% { box-shadow: 0 0 0 6px rgba(34,197,94,0.1); }
}
.toast-enter-active { animation: toastIn 0.35s cubic-bezier(0.34,1.56,0.64,1); }
.toast-leave-active { animation: toastOut 0.25s ease-in forwards; }
@keyframes toastIn  { from { opacity:0; transform: translateX(-50%) translateY(-16px); } to { opacity:1; transform: translateX(-50%) translateY(0); } }
@keyframes toastOut { from { opacity:1; transform: translateX(-50%) translateY(0); } to { opacity:0; transform: translateX(-50%) translateY(-12px); } }

/* ── LEFT PANEL ── */
.left {
  flex: 1;
  min-width: 340px;
  background: url('./assets/bgleft.svg') center/cover no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}
.left::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(13,30,60,0.72) 0%, rgba(26,90,90,0.55) 100%);
  z-index: 0;
}

.slides-wrapper {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 380px;
  padding: 32px 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.slide {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
}

.logo-box {
  background: white;
  border-radius: 32px;
  padding: 6px;
  box-shadow: 0 24px 60px rgba(0,0,0,0.35);
}
.logo-box img {
  max-width: 200px;
  border-radius: 28px;
  display: block;
}

.slide-msg {
  gap: 16px;
  padding: 0 12px;
}
.slide-icon {
  width: 80px;
  height: 80px;
  background: rgba(255,255,255,0.12);
  border: 1.5px solid rgba(255,255,255,0.22);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 8px;
  backdrop-filter: blur(4px);
}
.slide-title {
  font-family: 'Playfair Display', serif;
  font-size: 26px;
  color: white;
  font-weight: 700;
}
.slide-text {
  font-size: 14px;
  color: rgba(255,255,255,0.75);
  line-height: 1.7;
  max-width: 300px;
}

.slide-dots {
  display: flex;
  gap: 8px;
  margin-top: 28px;
  justify-content: center;
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255,255,255,0.35);
  cursor: pointer;
  transition: all 0.3s;
}
.dot.active {
  width: 24px;
  border-radius: 4px;
  background: #3aa6a6;
}

.footer {
  position: absolute;
  bottom: 24px;
  z-index: 1;
  color: rgba(255,255,255,0.55);
  font-size: 11px;
  letter-spacing: 0.3px;
}

/* Slide transition */
.slide-fade-enter-active { transition: all 0.5s cubic-bezier(0.4,0,0.2,1); }
.slide-fade-leave-active  { transition: all 0.4s cubic-bezier(0.4,0,0.2,1); }
.slide-fade-enter-from { opacity: 0; transform: translateX(30px); }
.slide-fade-leave-to  { opacity: 0; transform: translateX(-30px); }

/* ── RIGHT PANEL ── */
.right {
  flex: 1;
  min-width: 340px;
  background: #111827;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 24px;
}

.form-card {
  width: 100%;
  max-width: 400px;
  background: #1a2340;
  border: 1px solid rgba(58,166,166,0.2);
  border-radius: 20px;
  box-shadow:
    0 0 0 1px rgba(255,255,255,0.04),
    0 24px 64px rgba(0,0,0,0.4),
    inset 0 1px 0 rgba(255,255,255,0.06);
  overflow: hidden;
}

.form-card-inner {
  padding: 36px 36px 28px;
  display: flex;
  flex-direction: column;
}

/* Brand mark */
.brand-mark {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 28px;
}
.brand-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(58,166,166,0.4));
}
.brand-line:last-child {
  background: linear-gradient(to left, transparent, rgba(58,166,166,0.4));
}
.brand-name {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: #3aa6a6;
}

h2 {
  font-family: 'Playfair Display', serif;
  font-size: 28px;
  font-weight: 700;
  color: #f1f5f9;
  margin-bottom: 6px;
}
.form-subtitle {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 28px;
}

/* Field groups */
.field-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 18px;
}
.field-group label {
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
  margin-bottom: 7px;
  letter-spacing: 0.4px;
  text-transform: uppercase;
}
.required { color: #f87171; }

.password-label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 7px;
}
.forgot-link {
  font-size: 12px;
  color: #3aa6a6;
  text-decoration: none;
  font-weight: 500;
}
.forgot-link:hover { color: #5ec8c8; text-decoration: underline; }

/* Input wrapper with icon */
.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}
.input-icon {
  position: absolute;
  left: 13px;
  color: #475569;
  display: flex;
  pointer-events: none;
}
.input-wrapper input {
  width: 100%;
  padding: 12px 44px 12px 40px;
  background: #0f172a;
  border: 1.5px solid #1e3a5f;
  border-radius: 10px;
  color: #e2e8f0;
  font-size: 14px;
  font-family: 'DM Sans', sans-serif;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
}
.input-wrapper input::placeholder { color: #334155; }
.input-wrapper input:focus {
  border-color: #3aa6a6;
  background: #0d1f3c;
  box-shadow: 0 0 0 3px rgba(58,166,166,0.12);
}
.eye-icon {
  position: absolute;
  right: 13px;
  cursor: pointer;
  color: #475569;
  display: flex;
  transition: color 0.2s;
}
.eye-icon:hover { color: #3aa6a6; }

/* Error */
.error-msg {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #fca5a5;
  font-size: 13px;
  margin-bottom: 14px;
  background: rgba(239,68,68,0.08);
  border: 1px solid rgba(239,68,68,0.2);
  padding: 9px 13px;
  border-radius: 8px;
}
.err-enter-active, .err-leave-active { transition: all 0.25s ease; }
.err-enter-from, .err-leave-to { opacity: 0; transform: translateY(-4px); }

/* Button */
.main-btn {
  width: 100%;
  padding: 13px;
  background: linear-gradient(135deg, #3aa6a6 0%, #2e8b8b 100%);
  border: none;
  border-radius: 10px;
  color: white;
  font-weight: 700;
  cursor: pointer;
  font-size: 15px;
  font-family: 'DM Sans', sans-serif;
  letter-spacing: 0.3px;
  margin-top: 4px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 16px rgba(58,166,166,0.3);
}
.main-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #44bfbf 0%, #3aa6a6 100%);
  box-shadow: 0 6px 24px rgba(58,166,166,0.4);
  transform: translateY(-1px);
}
.main-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

.btn-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Keep logged */
.keep-logged {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
}
.keep-logged input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: #3aa6a6;
  cursor: pointer;
}
.keep-logged label {
  font-size: 13px;
  color: #64748b;
  cursor: pointer;
}

/* Divider */
.divider {
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(58,166,166,0.2), transparent);
  margin: 24px 0 20px;
}

/* Footer links */
.form-footer-links {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}
.form-footer-links a {
  font-size: 11px;
  color: #334155;
  text-decoration: none;
  letter-spacing: 0.3px;
  transition: color 0.2s;
}
.form-footer-links a:hover { color: #3aa6a6; }

/* ── MOBILE ── */
@media (max-width: 768px) {
  .container { flex-direction: column; }
  .left { min-height: 280px; flex: none; }
  .form-card-inner { padding: 28px 24px 22px; }
  h2 { font-size: 24px; }
}
</style>