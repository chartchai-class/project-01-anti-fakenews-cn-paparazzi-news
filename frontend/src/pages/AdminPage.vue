<template>
  <div class="admin-container">
    <h1 class="page-title">管理员控制面板</h1>
    
    <div class="admin-section">
      <h2>用户管理</h2>
      
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>加载用户列表中...</p>
      </div>
      
      <div v-else-if="error" class="error-message">
        {{ error }}
      </div>
      
      <div v-else class="user-management">
        <div class="filter-controls">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="搜索用户名或邮箱..." 
            class="search-input"
          />
          <select v-model="roleFilter" class="role-filter">
            <option value="">所有角色</option>
            <option value="ADMIN">管理员</option>
            <option value="MEMBER">成员</option>
            <option value="USER">普通用户</option>
          </select>
        </div>
        
        <div class="user-stats">
          <div class="stat-item">
            <span class="stat-number">{{ totalUsers }}</span>
            <span class="stat-label">总用户</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ adminCount }}</span>
            <span class="stat-label">管理员</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ memberCount }}</span>
            <span class="stat-label">成员</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ userCount }}</span>
            <span class="stat-label">普通用户</span>
          </div>
        </div>
        
        <div class="user-table-container">
          <table class="user-table">
            <thead>
              <tr>
                <th>头像</th>
                <th>用户名</th>
                <th>姓名</th>
                <th>邮箱</th>
                <th>角色</th>
                <th>注册时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in filteredUsers" :key="user.id" class="user-row">
                <td>
                  <img :src="user.avatar" :alt="user.username" class="user-avatar" />
                </td>
                <td>{{ user.username }}</td>
                <td>{{ user.firstName }} {{ user.lastName }}</td>
                <td>{{ user.email }}</td>
                <td>
                  <span :class="['role-badge', `role-${user.role.toLowerCase()}`]">
                    {{ getUserRoleLabel(user.role) }}
                  </span>
                </td>
                <td>{{ formatDate(user.createdAt || new Date()) }}</td>
                <td>
                  <div v-if="user.role !== 'ADMIN'" class="action-buttons">
                    <button 
                      v-if="user.role === 'USER'" 
                      @click="promoteToMember(user)" 
                      class="btn btn-promote"
                      :disabled="promotingUsers.includes(user.id)"
                    >
                      <span v-if="promotingUsers.includes(user.id)">处理中...</span>
                      <span v-else>提升为成员</span>
                    </button>
                    <button 
                      v-if="user.role === 'MEMBER'" 
                      @click="demoteToUser(user)" 
                      class="btn btn-demote"
                      :disabled="demotingUsers.includes(user.id)"
                    >
                      <span v-if="demotingUsers.includes(user.id)">处理中...</span>
                      <span v-else>降级为用户</span>
                    </button>
                  </div>
                  <span v-else class="no-action">无法修改</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div v-if="filteredUsers.length === 0" class="no-results">
          没有找到匹配的用户
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

export default {
  name: 'AdminPage',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    
    const loading = ref(false)
    const error = ref('')
    const users = ref([])
    const searchQuery = ref('')
    const roleFilter = ref('')
    const promotingUsers = ref([])
    const demotingUsers = ref([])
    
    // 检查权限，确保只有管理员能访问
    const checkAdminPermission = () => {
      if (!authStore.isAuthenticated || !authStore.isAdmin) {
        router.push('/login')
        return false
      }
      return true
    }
    
    // 获取用户列表
    const fetchUsers = async () => {
      loading.value = true
      error.value = ''
      
      try {
        // 在实际应用中，这里会调用API获取用户列表
        // const response = await api.user.getAll()
        // users.value = response.data
        
        // 模拟获取用户数据（从localStorage中读取）
        await new Promise(resolve => setTimeout(resolve, 500)) // 模拟网络延迟
        
        // 从localStorage中读取所有用户（实际应用中应该从API获取）
        const storedUsers = localStorage.getItem('allUsers')
        if (storedUsers) {
          users.value = JSON.parse(storedUsers)
        } else {
          // 生成模拟用户数据
          users.value = generateMockUsers()
        }
      } catch (err) {
        error.value = '获取用户列表失败'
        console.error('Error fetching users:', err)
      } finally {
        loading.value = false
      }
    }
    
    // 生成模拟用户数据
    const generateMockUsers = () => {
      const mockUsers = [
        {
          id: 1,
          username: 'admin',
          firstName: '管理员',
          lastName: '系统',
          email: 'admin@example.com',
          role: 'ADMIN',
          avatar: 'https://picsum.photos/id/1/100/100',
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30天前
        },
        {
          id: 2,
          username: 'member1',
          firstName: '测试',
          lastName: '成员1',
          email: 'member1@example.com',
          role: 'MEMBER',
          avatar: 'https://picsum.photos/id/2/100/100',
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) // 15天前
        },
        {
          id: 3,
          username: 'user1',
          firstName: '测试',
          lastName: '用户1',
          email: 'user1@example.com',
          role: 'USER',
          avatar: 'https://picsum.photos/id/3/100/100',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7天前
        },
        {
          id: 4,
          username: 'user2',
          firstName: '测试',
          lastName: '用户2',
          email: 'user2@example.com',
          role: 'USER',
          avatar: 'https://picsum.photos/id/4/100/100',
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3天前
        }
      ]
      
      // 将当前登录用户添加到列表中（如果不存在）
      if (authStore.user && !mockUsers.find(u => u.id === authStore.user.id)) {
        mockUsers.push({
          ...authStore.user,
          createdAt: new Date()
        })
      }
      
      // 保存到localStorage供以后使用
      localStorage.setItem('allUsers', JSON.stringify(mockUsers))
      
      return mockUsers
    }
    
    // 提升用户为成员
    const promoteToMember = async (user) => {
      promotingUsers.value.push(user.id)
      
      try {
        // 在实际应用中，这里会调用API更新用户角色
        // await api.user.updateRole(user.id, 'MEMBER')
        
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 更新本地用户数据
        const userIndex = users.value.findIndex(u => u.id === user.id)
        if (userIndex !== -1) {
          users.value[userIndex].role = 'MEMBER'
          // 更新localStorage
          localStorage.setItem('allUsers', JSON.stringify(users.value))
          
          // 如果是当前登录用户，更新authStore中的角色
          if (authStore.user && authStore.user.id === user.id) {
            const updatedUser = { ...authStore.user, role: 'MEMBER' }
            localStorage.setItem('user', JSON.stringify(updatedUser))
            authStore.user = updatedUser
          }
        }
        
        alert('用户已成功提升为成员！')
      } catch (err) {
        console.error('Error promoting user:', err)
        alert('提升用户失败，请重试')
      } finally {
        promotingUsers.value = promotingUsers.value.filter(id => id !== user.id)
      }
    }
    
    // 降级用户为普通用户
    const demoteToUser = async (user) => {
      demotingUsers.value.push(user.id)
      
      try {
        // 在实际应用中，这里会调用API更新用户角色
        // await api.user.updateRole(user.id, 'USER')
        
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 更新本地用户数据
        const userIndex = users.value.findIndex(u => u.id === user.id)
        if (userIndex !== -1) {
          users.value[userIndex].role = 'USER'
          // 更新localStorage
          localStorage.setItem('allUsers', JSON.stringify(users.value))
          
          // 如果是当前登录用户，更新authStore中的角色
          if (authStore.user && authStore.user.id === user.id) {
            const updatedUser = { ...authStore.user, role: 'USER' }
            localStorage.setItem('user', JSON.stringify(updatedUser))
            authStore.user = updatedUser
          }
        }
        
        alert('用户已成功降级为普通用户！')
      } catch (err) {
        console.error('Error demoting user:', err)
        alert('降级用户失败，请重试')
      } finally {
        demotingUsers.value = demotingUsers.value.filter(id => id !== user.id)
      }
    }
    
    // 格式化日期
    const formatDate = (date) => {
      const d = new Date(date)
      return d.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    }
    
    // 获取用户角色标签
    const getUserRoleLabel = (role) => {
      const roleMap = {
        'ADMIN': '管理员',
        'MEMBER': '成员',
        'USER': '普通用户'
      }
      return roleMap[role] || '未知角色'
    }
    
    // 计算属性：筛选后的用户列表
    const filteredUsers = computed(() => {
      return users.value.filter(user => {
        // 搜索筛选
        const matchesSearch = !searchQuery.value || 
          user.username.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.value.toLowerCase())
        
        // 角色筛选
        const matchesRole = !roleFilter.value || user.role === roleFilter.value
        
        return matchesSearch && matchesRole
      })
    })
    
    // 计算属性：用户统计
    const totalUsers = computed(() => users.value.length)
    const adminCount = computed(() => users.value.filter(u => u.role === 'ADMIN').length)
    const memberCount = computed(() => users.value.filter(u => u.role === 'MEMBER').length)
    const userCount = computed(() => users.value.filter(u => u.role === 'USER').length)
    
    // 页面挂载时执行
    onMounted(() => {
      if (checkAdminPermission()) {
        fetchUsers()
      }
    })
    
    return {
      loading,
      error,
      users,
      searchQuery,
      roleFilter,
      promotingUsers,
      demotingUsers,
      filteredUsers,
      totalUsers,
      adminCount,
      memberCount,
      userCount,
      promoteToMember,
      demoteToUser,
      formatDate,
      getUserRoleLabel
    }
  }
}
</script>

<style scoped>
.admin-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-title {
  color: #333;
  font-size: 28px;
  margin-bottom: 30px;
  text-align: center;
}

.admin-section {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 30px;
}

.admin-section h2 {
  color: #333;
  font-size: 20px;
  margin-bottom: 20px;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 10px;
}

.loading-container {
  text-align: center;
  padding: 40px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  margin: 0 auto 15px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  color: #e74c3c;
  background-color: #fadbd8;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.filter-controls {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.search-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.role-filter {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  min-width: 150px;
}

.user-stats {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.stat-item {
  flex: 1;
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 6px;
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 5px;
}

.stat-label {
  display: block;
  font-size: 14px;
  color: #7f8c8d;
}

.user-table-container {
  overflow-x: auto;
}

.user-table {
  width: 100%;
  border-collapse: collapse;
}

.user-table th,
.user-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.user-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #333;
}

.user-row:hover {
  background-color: #f8f9fa;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.role-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.role-admin {
  background-color: #e3f2fd;
  color: #1976d2;
}

.role-member {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.role-user {
  background-color: #fff3e0;
  color: #e65100;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-promote {
  background-color: #27ae60;
  color: white;
}

.btn-promote:hover:not(:disabled) {
  background-color: #229954;
}

.btn-demote {
  background-color: #f39c12;
  color: white;
}

.btn-demote:hover:not(:disabled) {
  background-color: #e67e22;
}

.btn:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.no-action {
  font-size: 12px;
  color: #95a5a6;
  font-style: italic;
}

.no-results {
  text-align: center;
  padding: 40px;
  color: #7f8c8d;
}

@media (max-width: 768px) {
  .user-stats {
    flex-wrap: wrap;
  }
  
  .stat-item {
    flex-basis: calc(50% - 10px);
  }
  
  .filter-controls {
    flex-direction: column;
  }
}
</style>