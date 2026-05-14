import { supabase } from './supabase'
import bcrypt from 'bcryptjs'

const SESSION_KEY = 'helena_admin_session'
const SESSION_TIMEOUT = parseInt(import.meta.env.VITE_SESSION_TIMEOUT_MINUTES || '30') * 60 * 1000

export const authService = {
  async login(username, password) {
    try {
      // Get admin from database
      const { data: admin, error } = await supabase
        .from('admin')
        .select('*')
        .eq('username', username)
        .single()

      if (error || !admin) {
        throw new Error('Username atau password salah')
      }

      // Verify password with bcrypt
      const isValid = await bcrypt.compare(password, admin.password_hash)
      
      if (!isValid) {
        throw new Error('Username atau password salah')
      }

      // Create session
      const session = {
        adminId: admin.id,
        username: admin.username,
        loginTime: Date.now(),
        expiresAt: Date.now() + SESSION_TIMEOUT
      }

      // Store session
      localStorage.setItem(SESSION_KEY, JSON.stringify(session))

      return { success: true, admin: { id: admin.id, username: admin.username } }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  },

  async changePassword(currentPassword, newPassword) {
    try {
      const session = this.getSession()
      if (!session) {
        throw new Error('Tidak terautentikasi')
      }

      // Get current admin
      const { data: admin, error: fetchError } = await supabase
        .from('admin')
        .select('*')
        .eq('id', session.adminId)
        .single()

      if (fetchError || !admin) {
        throw new Error('Admin tidak ditemukan')
      }

      // Verify current password
      const isValid = await bcrypt.compare(currentPassword, admin.password_hash)
      if (!isValid) {
        throw new Error('Password lama salah')
      }

      // Hash new password
      const newHash = await bcrypt.hash(newPassword, 10)

      // Update password
      const { error: updateError } = await supabase
        .from('admin')
        .update({ password_hash: newHash })
        .eq('id', session.adminId)

      if (updateError) {
        throw new Error('Gagal mengubah password')
      }

      return { success: true }
    } catch (error) {
      console.error('Change password error:', error)
      throw error
    }
  },

  logout() {
    localStorage.removeItem(SESSION_KEY)
  },

  getSession() {
    const sessionStr = localStorage.getItem(SESSION_KEY)
    if (!sessionStr) return null

    try {
      const session = JSON.parse(sessionStr)
      
      // Check if session expired
      if (Date.now() > session.expiresAt) {
        this.logout()
        return null
      }

      return session
    } catch {
      this.logout()
      return null
    }
  },

  isAuthenticated() {
    return this.getSession() !== null
  },

  refreshSession() {
    const session = this.getSession()
    if (session) {
      session.expiresAt = Date.now() + SESSION_TIMEOUT
      localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    }
  }
}
