import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

// 懒加载路由组件
const Home = () => import('../pages/Home.vue');
const Category = () => import('../pages/Category.vue');
const NewsDetail = () => import('../pages/NewsDetail.vue');
const LoginPage = () => import('../pages/LoginPage.vue');
const RegisterPage = () => import('../pages/RegisterPage.vue');
const AdminPage = () => import('../pages/AdminPage.vue');
const NewsUploadPage = () => import('../pages/NewsUploadPage.vue');

const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginPage,
    meta: {
      title: '登录 - Paparazzi News',
      requiresAuth: false
    }
  },
  {
    path: '/category/:categoryName',
    name: 'Category',
    component: Category,
    props: true,
    meta: {
      title: '分类新闻'
    }
  },
  {
    path: '/news/:id',
    name: 'NewsDetail',
    component: NewsDetail,
    props: true,
    meta: {
      title: '新闻详情'
    }
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: {
      title: 'Paparazzi News - 新闻首页'
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage,
    meta: {
      title: '注册 - Paparazzi News',
      requiresAuth: false
    }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminPage,
    meta: {
      title: '管理员控制面板 - Paparazzi News',
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  {
    path: '/upload',
    name: 'NewsUpload',
    component: NewsUploadPage,
    meta: {
      title: '上传新闻 - Paparazzi News',
      requiresAuth: true,
      requiresMember: true
    }
  },
  // 404路由，重定向到首页
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }];

const router = createRouter({
  history: createWebHistory(),
  routes,
  // 配置滚动行为
  scrollBehavior(to, from, savedPosition) {
    // 如果有保存的位置，则恢复到该位置
    if (savedPosition) {
      return savedPosition;
    }
    // 否则滚动到顶部
    return { top: 0 };
  }
});

// 全局前置守卫，用于更新页面标题和权限检查
router.beforeEach((to, from, next) => {
  // 更新页面标题
  document.title = to.meta.title || 'Paparazzi News';
  
  // 权限检查
  const authStore = useAuthStore();
  
  // 如果路由需要认证
  if (to.meta.requiresAuth === true) {
    if (!authStore.isAuthenticated) {
      // 未登录，重定向到登录页
      return next({ name: 'Login', query: { redirect: to.fullPath } });
    }
    
    // 如果路由需要管理员权限
    if (to.meta.requiresAdmin === true && !authStore.isAdmin) {
      // 不是管理员，重定向到首页
      return next({ name: 'Home' });
    }
    
    // 如果路由需要成员权限
    if (to.meta.requiresMember === true && !authStore.isMember) {
      // 不是成员，重定向到首页
      return next({ name: 'Home' });
    }
  }
  
  // 如果已登录用户尝试访问登录或注册页面，重定向到首页
  if ((to.name === 'Login' || to.name === 'Register') && authStore.isAuthenticated) {
    return next({ name: 'Home' });
  }
  
  next();
});

export default router;