<template>
  <div class="login-container">
    <div class="login-form">
      <h1>用户登录</h1>
      <p>登录以访问您的 Truth Moment 账号</p>
      
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">用户名</label>
          <input
            type="text"
            id="username"
            v-model="form.username"
            :class="{ 'is-invalid': errors.username }"
            placeholder="输入您的用户名"
            required
          />
          <div v-if="errors.username" class="error-message">{{ errors.username }}</div>
        </div>
        
        <div class="form-group">
          <label for="password">密码</label>
          <input
            type="password"
            id="password"
            v-model="form.password"
            :class="{ 'is-invalid': errors.password }"
            placeholder="输入您的密码"
            required
          />
          <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
        </div>
        
        <!-- 错误消息 -->
        <span v-if="loginError" class="error-message">{{ loginError }}</span>
        
        <div class="form-group">
          <button type="submit" class="login-button" :disabled="isLoading">
            {{ isLoading ? '登录中...' : '登录' }}
          </button>
        </div>
        
        <div class="register-link">
          还没有账号？<router-link to="/register">立即注册</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

export default {
  name: 'LoginPage',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    
    const isLoading = ref(false)
    const loginError = ref('')
    
    const form = reactive({
      username: '',
      password: ''
    })
    
    const errors = reactive({
      username: '',
      password: ''
    })
    
    // 表单验证
    const validateForm = () => {
      let isValid = true
      
      // 重置错误
      errors.username = ''
      errors.password = ''
      
      // 验证用户名
      if (!form.username.trim()) {
        errors.username = '请输入用户名'
        isValid = false
      }
      
      // 验证密码
      if (!form.password) {
        errors.password = '请输入密码'
        isValid = false
      }
      
      return isValid
    }
    
    // Handle login
    const handleLogin = async () => {
      // Validate form
      if (!validateForm()) {
        return
      }
      
      isLoading.value = true
      loginError.value = ''
      
      try {
        const success = await authStore.login(form.username, form.password)
        
        if (success) {
          // 登录成功后导航到首页或管理页面
          // 根据用户角色决定跳转目标
          if (authStore.isAdmin) {
            router.push('/admin')
          } else {
            router.push('/home')
          }
        } else {
          loginError.value = '登录失败，请检查您的用户名和密码'
        }
      } catch (error) {
        loginError.value = '登录过程中发生错误，请稍后再试'
        console.error('Login error:', error)
      } finally {
        isLoading.value = false
      }
    }
    
    return {
      form,
      errors,
      isLoading,
      loginError,
      handleLogin
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
}

.login-form {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 400px;
}

.login-form h1 {
  text-align: center;
  margin-bottom: 10px;
  color: #333;
  font-size: 28px;
}

.login-form p {
  text-align: center;
  margin-bottom: 30px;
  color: #666;
  font-size: 16px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #4a90e2;
}

.form-group input.is-invalid {
  border-color: #e74c3c;
}

.error-message {
  color: #e74c3c;
  font-size: 14px;
  margin: 10px 0 15px;
  display: block;
  text-align: center;
}

.login-button {
  width: 100%;
  padding: 12px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 10px;
}

.login-button:hover:not(:disabled) {
  background-color: #357abd;
}

.login-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.register-link {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

.register-link a {
  color: #4a90e2;
  text-decoration: none;
  font-weight: 500;
}

.register-link a:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .login-form {
    padding: 30px 20px;
  }
}
</style>