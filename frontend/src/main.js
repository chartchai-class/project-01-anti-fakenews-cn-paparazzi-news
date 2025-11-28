import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/index.js'

// 创建应用实例
const app = createApp(App)

// 使用Pinia进行状态管理
const pinia = createPinia()
app.use(pinia)

// 使用路由
app.use(router)

// 初始化认证状态
import { useAuthStore } from './stores/authStore'
const authStore = useAuthStore()
authStore.init()

// 挂载应用
app.mount('#app')