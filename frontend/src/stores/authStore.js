import { defineStore } from 'pinia'
import api, { authManager } from '../api/apiService'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    // 用户角色常量定义
    ROLES: {
      ADMIN: 'ADMIN',
      MEMBER: 'MEMBER',
      USER: 'USER'
    }
  }),

  getters: {
    getUser: (state) => state.user,
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
    // 角色相关的getters
    isAdmin: (state) => state.isAuthenticated && state.user?.role === state.ROLES.ADMIN,
    isMember: (state) => state.isAuthenticated && (state.user?.role === state.ROLES.MEMBER || state.user?.role === state.ROLES.ADMIN),
    hasVotingPermission: (state) => state.isMember,
    hasCommentPermission: (state) => state.isMember,
    hasSubmissionPermission: (state) => state.isMember
  },

  actions: {
    // 从localStorage初始化认证状态
    init() {
      const token = localStorage.getItem('token')
      const userData = localStorage.getItem('user')
      
      if (token) {
        this.token = token
        
        // 如果有用户数据，解析并设置
        if (userData) {
          try {
            const user = JSON.parse(userData)
            this.user = user
            // 根据用户角色设置相应权限标志
            this.isAuthenticated = true
          } catch (error) {
            console.error('Failed to parse user data:', error)
            // 如果解析失败，清除存储
            this.logout()
          }
        } else {
          // 只有token没有用户数据时设置为已认证
          this.isAuthenticated = true
        }
        
        // 在实际应用中，这里应该验证token的有效性
        // 可以调用API验证token或检查token过期时间
      }
    },

    // 登录操作 - 增强版本，支持用户角色管理
    async login(username, password) {
      this.loading = true
      this.error = null
      
      try {
        // 使用authManager处理登录，支持用户名或邮箱登录
        const success = await authManager.login(username, password)
        if (success) {
          // 登录成功后初始化状态
          this.init()
          return true
        } else {
          this.error = '登录失败，请检查您的用户名和密码'
          return false
        }
      } catch (error) {
        console.error('Login error:', error)
        this.error = error.message || '登录过程中发生错误'
        return false
      } finally {
        this.loading = false
      }
    },

    // 扩展的注册操作，支持更完整的用户信息
    async register(userData) {
      this.loading = true
      this.error = null
      
      try {
        // 构建注册数据
        const registerData = {
          username: userData.username,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          password: userData.password,
          avatar: userData.avatar || null
        }
        
        // 尝试通过API注册
        try {
          const response = await api.user.register(registerData)
          if (response.success && response.token) {
            localStorage.setItem('token', response.token)
            localStorage.setItem('user', JSON.stringify(response.user))
            this.init()
            return true
          }
        } catch (error) {
          // API失败时使用模拟数据（开发环境）
          console.log('Registration API failed, using mock data')
          const mockUser = {
            id: Date.now(),
            username: registerData.username,
            firstName: registerData.firstName,
            lastName: registerData.lastName,
            email: registerData.email,
            role: this.ROLES.MEMBER, // 默认为成员角色
            avatar: registerData.avatar || `https://picsum.photos/id/${Math.floor(Math.random() * 1000)}/100/100`
          }
          const mockToken = 'mock-jwt-token-' + Date.now()
          localStorage.setItem('token', mockToken)
          localStorage.setItem('user', JSON.stringify(mockUser))
          this.init()
          return true
        }
        
        this.error = 'Registration failed, please try again later'
        return false
      } catch (error) {
        this.error = error.message || 'An error occurred during registration'
        return false
      } finally {
        this.loading = false
      }
    },

    // 登出操作 - 增强版本，清除所有相关数据
    logout() {
      // 清除本地存储
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      
      // 重置状态
      this.user = null
      this.token = null
      this.isAuthenticated = false
      this.error = null
    },
    
    // 管理员功能：将用户设置为成员
    async promoteToMember(userId) {
      if (!this.isAdmin) {
        this.error = 'You do not have permission to perform this action'
        return false
      }
      
      this.loading = true
      this.error = null
      
      try {
        // 尝试调用API
        try {
          const response = await api.user.promoteToMember(userId)
          return response.success
        } catch (error) {
          // API失败时模拟成功（开发环境）
          console.log('Promote API failed, simulating success')
          return true
        }
      } catch (error) {
        this.error = error.message || 'Failed to promote user'
        return false
      } finally {
        this.loading = false
      }
    },
    
    // 获取用户列表（管理员功能）
    async getUsers() {
      if (!this.isAdmin) {
        this.error = 'You do not have permission to view user list'
        return []
      }
      
      this.loading = true
      this.error = null
      
      try {
        // 尝试调用API
        try {
          return await api.user.getUsers()
        } catch (error) {
          // API失败时返回模拟数据（开发环境）
          console.log('Get users API failed, returning mock data')
          return [
            { id: 1, username: 'admin', firstName: 'Admin', lastName: 'User', email: 'admin@example.com', role: 'admin', avatar: 'https://picsum.photos/id/1/100/100' },
            { id: 2, username: 'member1', firstName: 'Member', lastName: 'One', email: 'member1@example.com', role: 'member', avatar: 'https://picsum.photos/id/2/100/100' },
            { id: 3, username: 'user1', firstName: 'Normal', lastName: 'User', email: 'user1@example.com', role: 'user', avatar: 'https://picsum.photos/id/3/100/100' }
          ]
        }
      } catch (error) {
        this.error = error.message || 'Failed to fetch users'
        return []
      } finally {
        this.loading = false
      }
    }
  }
})