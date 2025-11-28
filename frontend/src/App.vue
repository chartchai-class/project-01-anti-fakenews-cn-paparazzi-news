<template>
  <div class="app-container">
    <!-- 导航栏 -->
    <Navbar />
    
    <!-- 主内容区域 -->
    <main class="main-content">
      <div class="container">
        <router-view v-slot="{ Component }">
          <transition name="page-fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>
    
    <!-- 页脚 -->
    <Footer />
  </div>
</template>

<script>
import './assets/main.css';
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
import { onMounted } from 'vue';
import { useAuthStore } from './stores/authStore';

export default {
  name: 'App',
  components: {
    Navbar,
    Footer
  },
  setup() {
    const authStore = useAuthStore();
    
    // 在应用启动时初始化认证状态
    onMounted(() => {
      authStore.init();
    });
  }
}
</script>

<style>
/* 应用容器 */
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--background-color);
}

/* 主内容区域 */
.main-content {
  flex: 1;
  padding-top: calc(var(--header-height) + var(--spacing-md));
  padding-bottom: var(--spacing-xl);
  position: relative;
}

/* 页面切换动画 */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: all var(--transition-slow) cubic-bezier(0.4, 0, 0.2, 1);
}

.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* 英雄区域样式 - 用于首页 */
.hero-section {
  background: linear-gradient(135deg, var(--primary-color) 0%, #32325d 100%);
  color: var(--text-light);
  padding: var(--spacing-2xl) 0;
  margin-bottom: var(--spacing-2xl);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  position: relative;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI0MDAiIHZpZXdCb3g9IjAgMCAxMjAwIDQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmZmYiIHN0b3Atb3BhY2l0eT0iMC4wNSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI2ZmZiIgc3RvcC1vcGFjaXR5PSIwIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEyMDAiIGhlaWdodD0iNDAwIiBmaWxsPSJ1cmwoI2EpIiAvPjwvc3ZnPg==');
  background-size: cover;
  background-position: top right;
  pointer-events: none;
}

.hero-container {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
}

.hero-title {
  font-size: var(--font-4xl);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
  margin-bottom: var(--spacing-lg);
  color: var(--text-light);
}

.hero-description {
  font-size: var(--font-lg);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--spacing-xl);
  opacity: 0.9;
  color: var(--text-light);
}

.hero-actions {
  display: flex;
  gap: var(--spacing-lg);
  justify-content: center;
  flex-wrap: wrap;
}

/* 特性卡片容器 */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-2xl);
}

.feature-card {
  background-color: var(--card-background);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-base);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
  border-color: var(--secondary-color);
}

.feature-icon {
  width: 64px;
  height: 64px;
  background-color: rgba(255, 212, 59, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-lg);
  color: var(--secondary-color);
  font-size: 2rem;
}

.feature-title {
  font-size: var(--font-lg);
  font-weight: var(--font-semibold);
  margin-bottom: var(--spacing-md);
  color: var(--text-primary);
}

.feature-description {
  color: var(--text-secondary);
  line-height: var(--leading-relaxed);
}

/* 最近新闻区域 */
.news-section {
  margin-bottom: var(--spacing-2xl);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
  padding-bottom: var(--spacing-md);
  border-bottom: 2px solid var(--divider-color);
}

.section-title {
  font-size: var(--font-2xl);
  font-weight: var(--font-bold);
  margin: 0;
  color: var(--text-primary);
}

.section-action {
  color: var(--accent-color);
  font-weight: var(--font-medium);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  transition: all var(--transition-fast);
}

.section-action:hover {
  color: var(--primary-color);
  transform: translateX(3px);
}

/* 响应式布局调整 */
@media (max-width: 768px) {
  .main-content {
    padding-top: calc(var(--header-height) + var(--spacing-sm));
  }
  
  .hero-title {
    font-size: var(--font-3xl);
  }
  
  .hero-description {
    font-size: var(--font-base);
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .hero-actions .btn {
    width: 100%;
    max-width: 300px;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }
  
  .section-title {
    font-size: var(--font-xl);
  }
  
  .features-grid {
    gap: var(--spacing-lg);
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: var(--font-2xl);
  }
  
  .section-title {
    font-size: var(--font-lg);
  }
  
  .feature-card {
    padding: var(--spacing-lg);
  }
  
  .feature-icon {
    width: 48px;
    height: 48px;
    font-size: 1.5rem;
  }
}
</style>