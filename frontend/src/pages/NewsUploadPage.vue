<template>
  <div class="news-upload-container">
    <h1 class="page-title">上传新闻</h1>
    
    <div class="upload-form-container">
      <form @submit.prevent="handleSubmit" class="upload-form">
        <!-- 新闻标题 -->
        <div class="form-group">
          <label for="title" class="form-label">新闻标题</label>
          <input 
            type="text" 
            id="title" 
            v-model="formData.title" 
            class="form-input" 
            placeholder="请输入新闻标题" 
            required
          >
        </div>
        
        <!-- 新闻内容 -->
        <div class="form-group">
          <label for="content" class="form-label">新闻内容</label>
          <textarea 
            id="content" 
            v-model="formData.content" 
            class="form-textarea" 
            placeholder="请输入新闻内容" 
            rows="10" 
            required
          ></textarea>
        </div>
        
        <!-- 新闻来源 -->
        <div class="form-group">
          <label for="source" class="form-label">新闻来源</label>
          <input 
            type="text" 
            id="source" 
            v-model="formData.source" 
            class="form-input" 
            placeholder="请输入新闻来源" 
            required
          >
        </div>
        
        <!-- 新闻链接 -->
        <div class="form-group">
          <label for="url" class="form-label">新闻链接</label>
          <input 
            type="url" 
            id="url" 
            v-model="formData.url" 
            class="form-input" 
            placeholder="请输入新闻链接" 
            required
          >
        </div>
        
        <!-- 新闻分类 -->
        <div class="form-group">
          <label for="category" class="form-label">新闻分类</label>
          <select 
            id="category" 
            v-model="formData.category" 
            class="form-select" 
            required
          >
            <option value="">请选择分类</option>
            <option value="Politics">政治</option>
            <option value="Society">社会</option>
            <option value="Environment">环境</option>
            <option value="Education">教育</option>
            <option value="Entertainment">娱乐</option>
          </select>
        </div>
        
        <!-- 新闻图片 -->
        <div class="form-group">
          <label for="image" class="form-label">新闻图片</label>
          <input 
            type="file" 
            id="image" 
            @change="handleImageUpload" 
            class="form-file" 
            accept="image/*"
          >
          <div v-if="imagePreview" class="image-preview">
            <img :src="imagePreview" alt="新闻图片预览" class="preview-image">
            <button type="button" @click="removeImage" class="remove-image-btn">移除图片</button>
          </div>
        </div>
        
        <!-- 提交按钮 -->
        <div class="form-actions">
          <button 
            type="submit" 
            class="submit-btn" 
            :disabled="loading"
          >
            {{ loading ? '上传中...' : '上传新闻' }}
          </button>
          <router-link to="/home" class="cancel-btn">取消</router-link>
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
  name: 'NewsUploadPage',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    
    // 表单数据
    const formData = ref({
      title: '',
      content: '',
      source: '',
      url: '',
      category: ''
    })
    
    // 状态
    const loading = ref(false)
    const error = ref('')
    const imagePreview = ref('')
    const imageFile = ref(null)
    
    // 处理图片上传
    const handleImageUpload = (event) => {
      const file = event.target.files[0]
      if (file) {
        // 检查文件大小（5MB限制）
        if (file.size > 5 * 1024 * 1024) {
          error.value = '图片大小不能超过5MB'
          return
        }
        
        imageFile.value = file
        
        // 创建预览
        const reader = new FileReader()
        reader.onload = (e) => {
          imagePreview.value = e.target.result
        }
        reader.readAsDataURL(file)
      }
    }
    
    // 移除图片
    const removeImage = () => {
      imageFile.value = null
      imagePreview.value = ''
      // 清空文件输入
      document.getElementById('image').value = ''
    }
    
    // 处理表单提交
    const handleSubmit = async () => {
      loading.value = true
      error.value = ''
      
      try {
        // 构建表单数据
        const submitData = {
          ...formData.value,
          image: imagePreview.value || null
        }
        
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // 模拟成功响应
        console.log('新闻上传成功:', submitData)
        
        // 重定向到首页
        router.push('/home')
      } catch (err) {
        error.value = err.message || '新闻上传失败，请重试'
        console.error('上传失败:', err)
      } finally {
        loading.value = false
      }
    }
    
    return {
      formData,
      loading,
      error,
      imagePreview,
      handleImageUpload,
      removeImage,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.news-upload-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.page-title {
  color: #333;
  font-size: 28px;
  margin-bottom: 30px;
  text-align: center;
}

.upload-form-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 30px;
}

.upload-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-weight: 600;
  color: #555;
  font-size: 14px;
}

.form-input,
.form-textarea,
.form-select {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #FFD43B;
  box-shadow: 0 0 0 3px rgba(255, 212, 59, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 200px;
}

.form-file {
  padding: 10px;
  border: 1px dashed #ddd;
  border-radius: 6px;
  cursor: pointer;
  transition: border-color 0.3s ease;
}

.form-file:hover {
  border-color: #FFD43B;
}

.image-preview {
  margin-top: 15px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.preview-image {
  max-width: 200px;
  max-height: 150px;
  border-radius: 6px;
  object-fit: cover;
  border: 1px solid #ddd;
}

.remove-image-btn {
  padding: 8px 16px;
  background-color: #e53e3e;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.remove-image-btn:hover {
  background-color: #c53030;
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 30px;
}

.submit-btn {
  padding: 12px 24px;
  background-color: #1E1E2F;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: background-color 0.3s ease;
}

.submit-btn:hover:not(:disabled) {
  background-color: #FFD43B;
  color: #1E1E2F;
}

.submit-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.cancel-btn {
  padding: 12px 24px;
  background-color: #f7fafc;
  color: #4a5568;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  text-decoration: none;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
  text-align: center;
}

.cancel-btn:hover {
  background-color: #edf2f7;
}

@media (max-width: 768px) {
  .upload-form-container {
    padding: 20px;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .submit-btn,
  .cancel-btn {
    width: 100%;
  }
}
</style>