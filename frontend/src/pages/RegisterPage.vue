<template>
  <div class="register-container">
    <div class="register-form">
      <h2>用户注册</h2>
      <form @submit.prevent="handleSubmit">
        <!-- 头像上传 -->
        <div class="form-group avatar-upload">
          <label>个人头像</label>
          <div class="avatar-preview" :class="{ 'has-avatar': avatarPreview }" @click="triggerFileInput">
            <img v-if="avatarPreview" :src="avatarPreview" alt="头像预览" class="preview-img" />
            <div v-else class="placeholder">点击上传头像</div>
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              @change="handleAvatarUpload"
              style="display: none"
            />
          </div>
          <p class="avatar-hint">点击头像区域上传，支持JPG、PNG格式</p>
        </div>

        <div class="form-row">
          <!-- 姓 -->
          <div class="form-group half">
            <label for="lastName">姓氏</label>
            <input
              id="lastName"
              v-model="formData.lastName"
              type="text"
              placeholder="输入您的姓氏"
              required
            />
          </div>
          
          <!-- 名 -->
          <div class="form-group half">
            <label for="firstName">姓名</label>
            <input
              id="firstName"
              v-model="formData.firstName"
              type="text"
              placeholder="输入您的姓名"
              required
            />
          </div>
        </div>

        <div class="form-group">
          <label for="username">用户名</label>
          <input
            id="username"
            v-model="formData.username"
            type="text"
            placeholder="设置您的用户名"
            required
          />
        </div>

        <div class="form-group">
          <label for="email">电子邮箱</label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            placeholder="输入您的电子邮箱"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">密码</label>
          <input
            id="password"
            v-model="formData.password"
            type="password"
            placeholder="设置您的密码"
            required
          />
        </div>

        <div class="form-group">
          <label for="confirmPassword">确认密码</label>
          <input
            id="confirmPassword"
            v-model="formData.confirmPassword"
            type="password"
            placeholder="再次输入密码"
            required
          />
        </div>
        
        <!-- 错误消息 -->
        <span v-if="error" class="error-message">{{ error }}</span>

        <button type="submit" :disabled="loading" class="register-button">
          {{ loading ? '注册中...' : '注册' }}
        </button>

        <div class="login-link">
          已有账号？<router-link to="/login">登录</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

export default {
  name: 'RegisterPage',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    
    // 表单数据
    const formData = ref({
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: ''
    })
    
    // 头像相关
    const avatarPreview = ref('')
    const avatarFile = ref(null)
    const fileInput = ref(null)
    
    // 状态
    const loading = ref(false)
    const error = ref('')
    
    // 头像上传处理
    const handleAvatarUpload = (event) => {
      const file = event.target.files[0]
      if (file) {
        // 检查文件类型
        if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
          error.value = '请上传JPG或PNG格式的图片'
          return
        }
        
        // 检查文件大小 (5MB限制)
        if (file.size > 5 * 1024 * 1024) {
          error.value = '图片大小不能超过5MB'
          return
        }
        
        avatarFile.value = file
        
        // 创建预览
        const reader = new FileReader()
        reader.onload = (e) => {
          avatarPreview.value = e.target.result
        }
        reader.readAsDataURL(file)
        
        error.value = ''
      }
    }
    
    // 点击头像区域触发文件选择
    const triggerFileInput = () => {
      fileInput.value.click()
    }
    
    // 表单验证
    const validateForm = () => {
      // 重置错误消息
      error.value = ''
      
      // 验证姓名和姓氏
      if (!formData.value.firstName.trim()) {
        error.value = '请输入您的姓名'
        return false
      }
      
      if (!formData.value.lastName.trim()) {
        error.value = '请输入您的姓氏'
        return false
      }
      
      // 验证用户名
      if (!formData.value.username.trim() || formData.value.username.length < 3) {
        error.value = '用户名至少需要3个字符'
        return false
      }
      
      // 验证邮箱
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.value.email)) {
        error.value = '请输入有效的电子邮箱地址'
        return false
      }
      
      // 验证密码
      if (formData.value.password.length < 6) {
        error.value = '密码至少需要6个字符'
        return false
      }
      
      // 验证密码匹配
      if (formData.value.password !== formData.value.confirmPassword) {
        error.value = '两次输入的密码不匹配'
        return false
      }
      
      return true
    }
    
    // 处理表单提交
    const handleSubmit = async () => {
      // 验证表单
      if (!validateForm()) {
        return
      }
      
      loading.value = true
      
      try {
        // 构建用户数据对象
        const userData = {
          ...formData.value,
          // 在实际应用中，这里应该上传头像文件到服务器
          // 但由于我们使用的是模拟数据，这里直接传递Base64预览
          avatar: avatarPreview.value || null
        }
        
        // 调用注册方法
        const success = await authStore.register(userData)
        
        if (success) {
          // 注册成功，跳转到首页
          router.push('/')
        } else {
          // 显示认证存储中的错误
          error.value = authStore.getError || '注册失败，请稍后再试'
        }
      } catch (err) {
        error.value = '注册过程中发生错误'
        console.error('Registration error:', err)
      } finally {
        loading.value = false
      }
    }
    
    return {
      formData,
      loading,
      error,
      avatarPreview,
      fileInput,
      handleSubmit,
      handleAvatarUpload,
      triggerFileInput
    }
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
}

.register-form {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 400px;
}

.register-form h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

/* 表单行 - 用于并排的字段 */
.form-row {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.form-row .form-group.half {
  flex: 1;
  margin-bottom: 0;
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

/* 头像上传样式 */
.avatar-upload {
  text-align: center;
  margin-bottom: 25px;
}

.avatar-preview {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 2px dashed #ddd;
  margin: 0 auto 10px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background-color: #f9f9f9;
  transition: border-color 0.3s, background-color 0.3s;
}

.avatar-preview:hover {
  border-color: #4a90e2;
  background-color: #f0f7ff;
}

.avatar-preview.has-avatar {
  border-style: solid;
  border-color: #ddd;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder {
  color: #999;
  font-size: 14px;
  text-align: center;
  padding: 10px;
}

.avatar-hint {
  font-size: 12px;
  color: #999;
  margin: 5px 0 0;
}

/* 错误消息样式 */
.error-message {
  color: #e74c3c;
  font-size: 14px;
  margin: 10px 0 15px;
  display: block;
  text-align: center;
}

/* 按钮样式 */
.register-button {
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

.register-button:hover:not(:disabled) {
  background-color: #357abd;
}

.register-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* 登录链接样式 */
.login-link {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

.login-link a {
  color: #4a90e2;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}

/* 响应式调整 */
@media (max-width: 480px) {
  .form-row {
    flex-direction: column;
    gap: 20px;
  }
  
  .register-form {
    padding: 30px 20px;
  }
}
</style>