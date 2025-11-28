<template>
  <header class="header" :class="{ 'header-scrolled': isScrolled }">
    <div class="container">
      <div class="header-content">
        <!-- Logo -->
        <div class="logo-container">
          <router-link to="/" class="logo">
            <span class="logo-icon">TM</span>
            <span class="logo-text">Truth Moment</span>
          </router-link>
        </div>

        <!-- Search Box -->
        <div class="search-container">
          <div class="search-box">
            <input type="text" placeholder="搜索新闻..." class="search-input">
            <button class="search-button">搜索</button>
          </div>
        </div>

        <!-- Desktop Navigation -->
        <nav class="main-nav">
          <ul class="nav-list">
            <li class="nav-item">
              <router-link to="/" class="nav-link" exact>首页</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/category/Politics" class="nav-link">政治</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/category/Society" class="nav-link">社会</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/category/Environment" class="nav-link">环境</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/category/Education" class="nav-link">教育</router-link>
            </li>
            <!-- 未登录状态显示登录/注册 -->
            <template v-if="!isAuthenticated">
              <li class="nav-item">
                <router-link to="/login" class="nav-link">登录</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/register" class="nav-link">注册</router-link>
              </li>
            </template>
            <!-- 登录状态显示用户信息 -->
            <template v-else>
              <li class="nav-item user-profile" @click="toggleUserMenu">
                <div class="user-info">
                  <img :src="user?.avatar" :alt="`${user?.firstName} ${user?.lastName}`" class="user-avatar">
                  <span class="user-name">{{ user?.firstName }} {{ user?.lastName }}</span>
                </div>
                <!-- 用户下拉菜单 -->
                <div class="user-menu" v-if="userMenuOpen" @mouseleave="closeUserMenu">
                  <router-link to="/profile" class="menu-item" @click="closeUserMenu">个人资料</router-link>
                  <router-link to="/upload" class="menu-item" v-if="user?.role === 'MEMBER' || user?.role === 'ADMIN'" @click="closeUserMenu">上传新闻</router-link>
                  <router-link to="/admin" class="menu-item" v-if="user?.role === 'ADMIN'" @click="closeUserMenu">管理面板</router-link>
                  <div class="menu-item logout" @click="logout">退出登录</div>
                </div>
              </li>
            </template>
          </ul>
        </nav>

        <!-- Mobile Menu Button -->
        <button class="mobile-menu-button" @click="toggleMenu">
          {{ mobileMenuText }}
        </button>
      </div>
    </div>

    <!-- Mobile Navigation -->
    <nav class="mobile-nav" :class="{ 'nav-list-open': isMenuOpen }">
      <ul class="mobile-nav-list">
        <li class="nav-item">
          <router-link to="/" class="nav-link" exact @click="closeMenu">首页</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/category/Politics" class="nav-link" @click="closeMenu">政治</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/category/Society" class="nav-link" @click="closeMenu">社会</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/category/Environment" class="nav-link" @click="closeMenu">环境</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/category/Education" class="nav-link" @click="closeMenu">教育</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/category/Entertainment" class="nav-link" @click="closeMenu">娱乐</router-link>
        </li>
        <!-- 移动端登录/注册链接 -->
        <template v-if="!isAuthenticated">
          <li class="nav-item">
            <router-link to="/login" class="nav-link" @click="closeMenu">登录</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/register" class="nav-link" @click="closeMenu">注册</router-link>
          </li>
        </template>
        <!-- 移动端用户信息 -->
        <template v-else>
          <li class="nav-item">
            <div class="user-info-mobile">
              <img :src="user?.avatar" :alt="`${user?.firstName} ${user?.lastName}`" class="user-avatar">
              <span class="user-name">{{ user?.firstName }} {{ user?.lastName }}</span>
              <span class="user-role">{{ user?.role === 'ADMIN' ? '管理员' : user?.role === 'MEMBER' ? '成员' : '用户' }}</span>
            </div>
          </li>
          <li class="nav-item">
            <router-link to="/profile" class="nav-link" @click="closeMenu">个人资料</router-link>
          </li>
          <li class="nav-item" v-if="user?.role === 'MEMBER' || user?.role === 'ADMIN'">
            <router-link to="/upload" class="nav-link" @click="closeMenu">上传新闻</router-link>
          </li>
          <li class="nav-item" v-if="user?.role === 'ADMIN'">
            <router-link to="/admin" class="nav-link" @click="closeMenu">管理面板</router-link>
          </li>
          <li class="nav-item">
            <div class="nav-link logout" @click="logout">退出登录</div>
          </li>
        </template>
      </ul>
    </nav>
  </header>
</template>

<script>
import { useAuthStore } from '../stores/authStore'
import { storeToRefs } from 'pinia'

export default {
  name: 'Header',
  setup() {
    const authStore = useAuthStore()
    // 初始化认证状态
    authStore.init()
    const { isAuthenticated, user } = storeToRefs(authStore)
    
    return {
      authStore,
      isAuthenticated,
      user
    }
  },
  data() {
    return {
      isMenuOpen: false,
      isScrolled: false,
      lastScrollTop: 0,
      userMenuOpen: false
    }
  },
  computed: {
    mobileMenuText() {
      return this.isMenuOpen ? '关闭' : '菜单';
    }
  },
  mounted() {
    // 添加滚动监听
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    // 移除滚动监听
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
      // 防止滚动
      if (this.isMenuOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
    },
    closeMenu() {
      this.isMenuOpen = false;
      document.body.style.overflow = 'auto';
    },
    handleScroll() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // 判断是否滚动超过100px
      if (scrollTop > 100) {
        this.isScrolled = true;
      } else {
        this.isScrolled = false;
      }
      
      this.lastScrollTop = scrollTop;
    },
    toggleUserMenu() {
      this.userMenuOpen = !this.userMenuOpen;
    },
    closeUserMenu() {
      this.userMenuOpen = false;
    },
    logout() {
      this.authStore.logout();
      this.closeUserMenu();
      this.closeMenu();
    }
  },
  // 监听路由变化，关闭菜单
  watch: {
    $route() {
      this.closeMenu();
    }
  }
}
</script>

<style scoped>
:root {
  --primary-color: #1E1E2F;
  --secondary-color: #FFD43B;
  --background-color: #F7F8FA;
  --white: #FFFFFF;
  --text-primary: #1E1E2F;
  --text-secondary: #6E7191;
  --border-color: #E2E8F0;
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 10px rgba(0, 0, 0, 0.15);
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --transition-base: 0.2s ease-in-out;
}

.header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border-color);
  transition: padding var(--transition-base), box-shadow var(--transition-base);
  padding: var(--spacing-lg) 0;
}

.header.header-scrolled {
  padding: var(--spacing-md) 0;
  box-shadow: var(--shadow-md);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-xl);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Logo Styles */
.logo-container {
  flex-shrink: 0;
}

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 1.75rem;
  color: var(--primary-color);
}

.logo-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: var(--secondary-color);
  color: var(--primary-color);
  border-radius: 8px;
  margin-right: var(--spacing-sm);
  font-size: 1.25rem;
  font-weight: 700;
}

.logo-text {
  color: var(--primary-color);
}

/* Search Box Styles */
.search-container {
  flex: 0 1 400px;
  margin: 0 var(--spacing-xl);
}

.search-box {
  display: flex;
  position: relative;
}

.search-input {
  flex: 1;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  transition: border-color var(--transition-base), box-shadow var(--transition-base);
}

.search-input:focus {
  outline: none;
  border-color: var(--secondary-color);
  box-shadow: 0 0 0 3px rgba(255, 212, 59, 0.1);
}

.search-button {
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--primary-color);
  color: var(--white);
  border: none;
  border-radius: 8px;
  margin-left: var(--spacing-sm);
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  transition: background-color var(--transition-base);
}

.search-button:hover {
  background-color: var(--secondary-color);
  color: var(--primary-color);
}

/* Desktop Navigation Styles */
.main-nav {
  flex-shrink: 0;
}

.nav-list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  align-items: center;
}

.nav-item {
  margin-left: var(--spacing-md);
  position: relative;
}

/* 用户资料样式 */
.user-profile {
  cursor: pointer;
}

.user-info {
  display: flex;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: 8px;
  transition: background-color var(--transition-base);
}

.user-info:hover {
  background-color: rgba(255, 212, 59, 0.1);
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: var(--spacing-sm);
  object-fit: cover;
}

.user-name {
  font-weight: 500;
  color: var(--text-primary);
}

/* 用户下拉菜单 */
.user-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: var(--white);
  border-radius: 8px;
  box-shadow: var(--shadow-md);
  padding: var(--spacing-sm) 0;
  min-width: 180px;
  z-index: 1001;
}

.menu-item {
  display: block;
  padding: var(--spacing-sm) var(--spacing-md);
  color: var(--text-primary);
  text-decoration: none;
  transition: background-color var(--transition-base);
}

.menu-item:hover {
  background-color: rgba(255, 212, 59, 0.1);
}

.menu-item.logout {
  cursor: pointer;
  color: #e53e3e;
}

.menu-item.logout:hover {
  background-color: rgba(229, 62, 62, 0.1);
}

/* 移动端用户信息样式 */
.user-info-mobile {
  display: flex;
  align-items: center;
  padding: var(--spacing-md);
  border-radius: 8px;
  background-color: rgba(255, 212, 59, 0.1);
}

.user-info-mobile .user-avatar {
  width: 40px;
  height: 40px;
}

.user-role {
  margin-left: auto;
  font-size: 0.875rem;
  padding: 2px 8px;
  border-radius: 12px;
  background-color: var(--secondary-color);
  color: var(--primary-color);
  font-weight: 600;
}

.nav-link.logout {
  color: #e53e3e;
  cursor: pointer;
}

.nav-link {
  display: inline-block;
  padding: var(--spacing-sm) var(--spacing-md);
  color: var(--text-primary);
  text-decoration: none;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 1rem;
  border-radius: 8px;
  transition: background-color var(--transition-base), color var(--transition-base);
}

.nav-link:hover,
.nav-link.router-link-active {
  background-color: rgba(255, 212, 59, 0.1);
  color: var(--secondary-color);
}

/* Mobile Menu Button */
.mobile-menu-button {
  display: none;
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--primary-color);
  color: var(--white);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  transition: background-color var(--transition-base);
}

.mobile-menu-button:hover {
  background-color: var(--secondary-color);
  color: var(--primary-color);
}

/* Mobile Navigation */
.mobile-nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: var(--white);
  transform: translateX(-100%);
  transition: transform var(--transition-base);
  z-index: 999;
  padding-top: 80px;
}

.mobile-nav.nav-list-open {
  transform: translateX(0);
}

.mobile-nav-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
}

.mobile-nav-list .nav-item {
  margin: var(--spacing-sm) 0;
  width: 100%;
  text-align: center;
}

.mobile-nav-list .nav-link {
  display: block;
  padding: var(--spacing-md);
  font-size: 1.25rem;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .search-container {
    flex: 0 1 300px;
    margin: 0 var(--spacing-md);
  }
}

@media (max-width: 768px) {
  .header-content {
    justify-content: space-between;
  }
  
  .search-container {
    display: none;
  }
  
  .main-nav {
    display: none;
  }
  
  .mobile-menu-button {
    display: block;
  }
}

@media (max-width: 480px) {
  .nav-list {
    flex-wrap: wrap;
  }
  
  .nav-item {
    margin-left: var(--spacing-sm);
  }
  
  .user-info {
    padding: var(--spacing-sm);
  }
  
  .user-name {
    display: none;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 var(--spacing-md);
  }
  
  .logo {
    font-size: 1.5rem;
  }
  
  .logo-icon {
    width: 32px;
    height: 32px;
    font-size: 1rem;
  }
}
</style>