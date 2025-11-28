<template>
  <div class="category-tabs-container">
    <div class="tabs-wrapper" ref="tabsWrapper">
      <div class="tabs-scroll-container">
        <button
          v-for="category in categories"
          :key="category"
          :class="['tab-button', { active: isActiveCategory(category) }]"
          @click="handleTabClick(category)"
        >
          <span class="tab-content">
            {{ getCategoryLabel(category) }}
            <span v-if="category !== 'All'" class="news-count">({{ getNewsCount(category) }})</span>
          </span>
          <span class="tab-indicator" :class="{ active: isActiveCategory(category) }"></span>
        </button>
      </div>
    </div>
    
    <!-- 左右滑动指示器 -->
    <div 
      class="scroll-indicator left" 
      :class="{ visible: canScrollLeft }"
      @click="scrollLeft"
      aria-label="滚动到左侧"
    >
      <span>&lt;</span>
    </div>
    <div 
      class="scroll-indicator right" 
      :class="{ visible: canScrollRight }"
      @click="scrollRight"
      aria-label="滚动到右侧"
    >
      <span>&gt;</span>
    </div>
  </div>
</template>

<script>
import { computed, ref, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default {
  name: 'CategoryTabs',
  props: {
    // 可选的新闻统计数据
    newsCounts: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    const route = useRoute();
    const router = useRouter();
    const tabsWrapper = ref(null);
    const canScrollLeft = ref(false);
    const canScrollRight = ref(false);
    
    // 分类列表
    const categories = computed(() => {
      return ['All', 'Politics', 'Society', 'Environment', 'Education', 'Entertainment'];
    });
    
    // 获取分类的中文标签
    const getCategoryLabel = (category) => {
      const labels = {
        'All': '全部',
        'Politics': '政治',
        'Society': '社会',
        'Environment': '环境',
        'Education': '教育',
        'Entertainment': '娱乐'
      };
      return labels[category] || category;
    };
    
    // 获取新闻数量
    const getNewsCount = (category) => {
      return props.newsCounts[category] || 0;
    };
    
    // 判断当前分类是否激活
    const isActiveCategory = (category) => {
      if (category === 'All') {
        return route.path === '/';
      }
      return route.path === `/category/${category}`;
    };
    
    // 处理标签点击
    const handleTabClick = (category) => {
      const routePath = category === 'All' ? '/' : `/category/${category}`;
      if (route.path !== routePath) {
        router.push(routePath);
      }
    };
    
    // 检查滚动状态
    const checkScrollStatus = () => {
      if (!tabsWrapper.value) return;
      
      const { scrollLeft, scrollWidth, clientWidth } = tabsWrapper.value;
      canScrollLeft.value = scrollLeft > 10;
      canScrollRight.value = scrollLeft + clientWidth < scrollWidth - 10;
    };
    
    // 向左滚动
    const scrollLeft = () => {
      if (!tabsWrapper.value) return;
      tabsWrapper.value.scrollBy({
        left: -200,
        behavior: 'smooth'
      });
    };
    
    // 向右滚动
    const scrollRight = () => {
      if (!tabsWrapper.value) return;
      tabsWrapper.value.scrollBy({
        left: 200,
        behavior: 'smooth'
      });
    };
    
    // 监听路由变化，滚动到活动标签
    watch(() => route.path, () => {
      setTimeout(() => {
        if (!tabsWrapper.value) return;
        
        const activeTab = tabsWrapper.value.querySelector('.tab-button.active');
        if (activeTab) {
          const wrapperRect = tabsWrapper.value.getBoundingClientRect();
          const tabRect = activeTab.getBoundingClientRect();
          
          const scrollPosition = activeTab.offsetLeft - (wrapperRect.width / 2) + (tabRect.width / 2);
          tabsWrapper.value.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    });
    
    // 生命周期
    onMounted(() => {
      if (tabsWrapper.value) {
        tabsWrapper.value.addEventListener('scroll', checkScrollStatus);
        window.addEventListener('resize', checkScrollStatus);
        checkScrollStatus();
        
        // 初始化时滚动到活动标签
        const activeTab = tabsWrapper.value.querySelector('.tab-button.active');
        if (activeTab) {
          activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      }
    });
    
    onUnmounted(() => {
      if (tabsWrapper.value) {
        tabsWrapper.value.removeEventListener('scroll', checkScrollStatus);
      }
      window.removeEventListener('resize', checkScrollStatus);
    });
    
    return {
      categories,
      tabsWrapper,
      canScrollLeft,
      canScrollRight,
      isActiveCategory,
      handleTabClick,
      scrollLeft,
      scrollRight,
      getCategoryLabel,
      getNewsCount
    };
  }
};
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

.category-tabs-container {
  position: relative;
  margin: var(--spacing-lg) 0;
  overflow: hidden;
  border-radius: 12px;
  background-color: var(--white);
  box-shadow: var(--shadow-sm);
}

.tabs-wrapper {
  overflow-x: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch; /* iOS smooth scrolling */
}

.tabs-wrapper::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}

.tabs-scroll-container {
  display: inline-flex;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  min-width: 100%;
}

.tab-button {
  position: relative;
  padding: var(--spacing-md) var(--spacing-lg);
  background: none;
  border: none;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  white-space: nowrap;
  border-radius: 8px;
  transition: all var(--transition-base);
  outline: none;
}

.tab-button:hover {
  background-color: rgba(255, 212, 59, 0.1);
  color: var(--secondary-color);
  transform: translateY(-1px);
}

.tab-button.active {
  background-color: rgba(255, 212, 59, 0.15);
  color: var(--secondary-color);
  font-weight: 600;
}

.tab-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.news-count {
  font-size: 0.875rem;
  font-weight: 400;
  opacity: 0.8;
}

/* 指示器样式 */
.tab-indicator {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 24px;
  height: 3px;
  background-color: var(--secondary-color);
  border-radius: 1.5px;
  transform: translateX(-50%) scaleX(0);
  transition: transform var(--transition-base), background-color var(--transition-base);
}

.tab-button.active .tab-indicator {
  transform: translateX(-50%) scaleX(1);
}

.tab-button:hover .tab-indicator {
  transform: translateX(-50%) scaleX(1);
  background-color: var(--secondary-color);
  opacity: 0.7;
}

/* 滚动指示器 */
.scroll-indicator {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  background-color: rgba(255, 255, 255, 0.95);
  border: 1px solid var(--border-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--text-secondary);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-base);
  opacity: 0;
  visibility: hidden;
  z-index: 10;
}

.scroll-indicator.visible {
  opacity: 1;
  visibility: visible;
}

.scroll-indicator:hover {
  background-color: var(--white);
  color: var(--secondary-color);
  box-shadow: var(--shadow-md);
  transform: translateY(-50%) scale(1.1);
  border-color: var(--secondary-color);
}

.scroll-indicator.left {
  left: var(--spacing-sm);
}

.scroll-indicator.right {
  right: var(--spacing-sm);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .category-tabs-container {
    margin: var(--spacing-md) 0;
  }
  
  .tabs-scroll-container {
    padding: var(--spacing-sm) var(--spacing-sm);
  }
  
  .tab-button {
    padding: var(--spacing-sm) var(--spacing-md);
    font-size: 0.875rem;
  }
  
  .news-count {
    font-size: 0.75rem;
  }
  
  .scroll-indicator {
    width: 32px;
    height: 32px;
    font-size: 1rem;
  }
  
  .scroll-indicator.left {
    left: 0;
  }
  
  .scroll-indicator.right {
    right: 0;
  }
}

@media (max-width: 480px) {
  .category-tabs-container {
    border-radius: 8px;
  }
  
  .tab-button {
    padding: var(--spacing-sm);
    font-size: 0.875rem;
  }
  
  .tab-indicator {
    width: 20px;
  }
  
  .scroll-indicator {
    width: 28px;
    height: 28px;
    font-size: 0.875rem;
  }
}
</style>