<template>
  <div class="admin-layout">
    <div
      v-if="isMobileSidebarOpen"
      class="mobile-overlay"
      @click="isMobileSidebarOpen = false"
    ></div>

    <aside
      class="sidebar"
      :class="{
        collapsed: isSidebarCollapsed,
        'mobile-open': isMobileSidebarOpen
      }"
    >
      <div class="sidebar-header">
        <div class="logo-badge">
          <img src="@/assets/login-logo.png" alt="Helena Studio Logo" class="sidebar-logo-image" />
        </div>

        <div v-if="!isSidebarCollapsed" class="logo-content">
          <h1>Helena Studio</h1>
          <p>ADMIN PANEL</p>
        </div>
      </div>
      
      <nav class="sidebar-nav">
        <router-link to="/" class="nav-item" :class="{ active: $route.name === 'Dashboard' }" @click="closeMobileSidebar">
          <LayoutDashboard class="nav-icon" />
          <span v-if="!isSidebarCollapsed" class="nav-text">Dashboard</span>
          <ChevronRight v-if="$route.name === 'Dashboard' && !isSidebarCollapsed" class="nav-icon-end" />
        </router-link>
        
        <router-link to="/bookings" class="nav-item" :class="{ active: $route.name === 'Bookings' }" @click="closeMobileSidebar">
          <CalendarDays class="nav-icon" />
          <span v-if="!isSidebarCollapsed" class="nav-text">Reservasi</span>
          <ChevronRight v-if="$route.name === 'Bookings' && !isSidebarCollapsed" class="nav-icon-end" />
        </router-link>
        
        <router-link to="/treatments" class="nav-item" :class="{ active: $route.name === 'Treatments' }" @click="closeMobileSidebar">
          <Scissors class="nav-icon" />
          <span v-if="!isSidebarCollapsed" class="nav-text">Layanan</span>
          <ChevronRight v-if="$route.name === 'Treatments' && !isSidebarCollapsed" class="nav-icon-end" />
        </router-link>

        <router-link to="/promos" class="nav-item" :class="{ active: $route.name === 'Promos' }" @click="closeMobileSidebar">
          <Tags class="nav-icon" />
          <span v-if="!isSidebarCollapsed" class="nav-text">Promo</span>
          <ChevronRight v-if="$route.name === 'Promos' && !isSidebarCollapsed" class="nav-icon-end" />
        </router-link>
        
        <router-link to="/testimonials" class="nav-item" :class="{ active: $route.name === 'Testimonials' }" @click="closeMobileSidebar">
          <Star class="nav-icon" />
          <span v-if="!isSidebarCollapsed" class="nav-text">Testimoni</span>
          <ChevronRight v-if="$route.name === 'Testimonials' && !isSidebarCollapsed" class="nav-icon-end" />
        </router-link>
        
        <router-link to="/certificates" class="nav-item" :class="{ active: $route.name === 'Certificates' }" @click="closeMobileSidebar">
          <Award class="nav-icon" />
          <span v-if="!isSidebarCollapsed" class="nav-text">Sertifikat</span>
          <ChevronRight v-if="$route.name === 'Certificates' && !isSidebarCollapsed" class="nav-icon-end" />
        </router-link>
        
        <router-link to="/settings" class="nav-item" :class="{ active: $route.name === 'Settings' }" @click="closeMobileSidebar">
          <Settings class="nav-icon" />
          <span v-if="!isSidebarCollapsed" class="nav-text">Pengaturan</span>
          <ChevronRight v-if="$route.name === 'Settings' && !isSidebarCollapsed" class="nav-icon-end" />
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <div class="admin-chip" v-if="!isSidebarCollapsed">
          <div class="avatar">{{ userInitial }}</div>
          <div>
            <div class="admin-name">{{ authStore.user?.username || 'Admin Helena' }}</div>
            <div class="admin-role">Administrator</div>
          </div>
        </div>

        <div v-else style="display: grid; place-items: center; margin-bottom: 0.5rem;">
          <div class="avatar">{{ userInitial }}</div>
        </div>

        <button class="logout-btn" @click="handleLogout">
          <LogOut class="nav-icon" />
          <span v-if="!isSidebarCollapsed" class="nav-text">Keluar</span>
        </button>
      </div>
    </aside>
    
    <div class="admin-main">
      <header class="layout-topbar">
        <div class="topbar-left">
          <button class="icon-btn desktop-only" @click="isSidebarCollapsed = !isSidebarCollapsed">
            <PanelLeftOpen v-if="isSidebarCollapsed" :size="18" />
            <PanelLeftClose v-else :size="18" />
          </button>

          <button class="icon-btn mobile-only" @click="isMobileSidebarOpen = !isMobileSidebarOpen">
            <X v-if="isMobileSidebarOpen" :size="18" />
            <Menu v-else :size="18" />
          </button>

          <div>
            <h2>{{ currentTitle }}</h2>
            <p>Helena Studio Admin Panel</p>
          </div>
        </div>

        <div class="topbar-right">
          <button class="icon-btn" type="button" aria-label="Notifikasi">
            <Bell :size="18" />
          </button>
        </div>
      </header>

      <main class="main-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  Award,
  Bell,
  CalendarDays,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Scissors,
  Settings,
  Star,
  Tags,
  X
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const isSidebarCollapsed = ref(false)
const isMobileSidebarOpen = ref(false)

const routeTitles = {
  Dashboard: 'Dashboard',
  Bookings: 'Reservasi',
  Treatments: 'Layanan',
  Promos: 'Promo',
  Testimonials: 'Testimoni',
  Certificates: 'Sertifikat',
  Settings: 'Pengaturan'
}

const currentTitle = computed(() => routeTitles[route.name] || 'Dashboard')
const userInitial = computed(() => {
  const username = authStore.user?.username || 'A'
  return username.charAt(0).toUpperCase()
})

const closeMobileSidebar = () => {
  isMobileSidebarOpen.value = false
}

const syncDesktopSidebarState = () => {
  if (window.innerWidth <= 992) {
    isSidebarCollapsed.value = true
  }
}

const handleLogout = () => {
  if (confirm('Yakin ingin logout?')) {
    authStore.logout()
    router.push('/login')
  }
}

onMounted(() => {
  syncDesktopSidebarState()
  window.addEventListener('resize', syncDesktopSidebarState)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', syncDesktopSidebarState)
})
</script>

<style scoped>
.nav-icon-end {
  margin-left: auto;
  width: 16px;
  height: 16px;
}
</style>
