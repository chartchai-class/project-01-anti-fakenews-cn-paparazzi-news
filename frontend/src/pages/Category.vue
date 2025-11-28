<template>
  <div class="category-page">
    <!-- 分类标题区域 -->
    <div class="category-header">
      <div class="category-icon">{{ getCategoryIcon }}</div>
      <h1>{{ formattedCategoryName }}</h1>
      <p>{{ getCategoryDescription }}</p>
    </div>
    
    <!-- 分类标签栏 -->
    <CategoryTabs />
    
    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>正在加载新闻...</p>
    </div>
    
    <!-- 错误状态 -->
    <div v-else-if="error" class="error-container">
      <div class="error-icon">⚠️</div>
      <h3>加载失败</h3>
      <p>{{ error }}</p>
      <button class="retry-button" @click="fetchCategoryNews">重试</button>
    </div>
    
    <!-- 内容区域 -->
    <div v-else>
      <!-- 分类新闻列表 -->
      <section class="category-news-section">
        <div class="news-stats">
          <span class="news-count">共 {{ filteredNews.length }} 条新闻</span>
          <div class="sort-controls">
            <label for="sort-select">排序：</label>
            <select id="sort-select" v-model="sortOption" @change="applySort">
              <option value="newest">最新发布</option>
              <option value="oldest">最早发布</option>
              <option value="highestTrust">最高可信度</option>
              <option value="lowestTrust">最低可信度</option>
            </select>
          </div>
        </div>
        
        <div v-if="filteredNews.length === 0" class="empty-state">
          <div class="empty-icon">📰</div>
          <p>该分类暂无新闻内容</p>
          <router-link to="/" class="back-home-link">返回首页</router-link>
        </div>
        
        <div v-else class="news-grid">
          <NewsCard 
            v-for="news in sortedNews" 
            :key="news.id"
            :id="news.id"
            :title="news.title"
            :summary="news.summary"
            :imageUrl="news.imageUrl || 'https://picsum.photos/id/'+(news.id%100)+'/400/225'"
            :trustScore="news.trustScore"
            :source="news.source"
            :date="news.date"
          />
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useNewsStore } from '../store/newsStore';
import NewsCard from '../components/NewsCard.vue';
import CategoryTabs from '../components/CategoryTabs.vue';

export default {
  name: 'Category',
  components: {
    NewsCard,
    CategoryTabs
  },
  setup() {
    const route = useRoute();
    const newsStore = useNewsStore();
    const sortOption = ref('newest');
    
    // 从路由获取分类名称
    const categoryName = computed(() => route.params.categoryName);
    
    // 计算属性
    const isLoading = computed(() => newsStore.isLoading);
    const error = computed(() => newsStore.error);
    
    // 获取当前分类的新闻
    const filteredNews = computed(() => {
      if (!categoryName.value || !newsStore.newsList.length) return [];
      
      return newsStore.newsList.filter(news => 
        news.category === categoryName.value
      );
    });
    
    // 排序后的新闻列表
    const sortedNews = computed(() => {
      const news = [...filteredNews.value];
      
      switch (sortOption.value) {
        case 'newest':
          return news.sort((a, b) => new Date(b.date) - new Date(a.date));
        case 'oldest':
          return news.sort((a, b) => new Date(a.date) - new Date(b.date));
        case 'highestTrust':
          return news.sort((a, b) => b.trustScore - a.trustScore);
        case 'lowestTrust':
          return news.sort((a, b) => a.trustScore - b.trustScore);
        default:
          return news;
      }
    });
    
    // 格式化分类名称显示
    const formattedCategoryName = computed(() => {
      const categoryMap = {
        'Politics': '政治新闻',
        'Society': '社会新闻',
        'Environment': '环境新闻',
        'Education': '教育新闻',
        'Entertainment': '娱乐新闻'
      };
      
      return categoryMap[categoryName.value] || categoryName.value;
    });
    
    // 获取分类图标
    const getCategoryIcon = computed(() => {
      const iconMap = {
        'Politics': '🏛️',
        'Society': '👥',
        'Environment': '🌍',
        'Education': '🎓',
        'Entertainment': '🎬'
      };
      
      return iconMap[categoryName.value] || '📰';
    });
    
    // 获取分类描述
    const getCategoryDescription = computed(() => {
      const descriptionMap = {
        'Politics': '关注国内外政治动态，了解时事热点',
        'Society': '聚焦社会民生，洞察社会现象',
        'Environment': '关心环境问题，探索可持续发展',
        'Education': '追踪教育改革，关注学术前沿',
        'Entertainment': '掌握娱乐资讯，感受文化脉动'
      };
      
      return descriptionMap[categoryName.value] || '浏览该分类的最新新闻';
    });
    
    // 获取分类新闻
    const fetchCategoryNews = async () => {
      await newsStore.fetchNews();
    };
    
    // 应用排序
    const applySort = () => {
      // 排序逻辑在sortedNews计算属性中已实现
    };
    
    // 监听路由变化，重新获取数据
    watch(categoryName, () => {
      // 重置排序选项
      sortOption.value = 'newest';
      // 滚动到页面顶部
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // 如果新闻列表为空，获取数据
      if (newsStore.newsList.length === 0) {
        fetchCategoryNews();
      }
    });
    
    // 页面加载时获取数据
    onMounted(() => {
      fetchCategoryNews();
      // 设置页面标题
      document.title = `${formattedCategoryName.value} - Paparazzi News`;
    });
    
    return {
      categoryName,
      formattedCategoryName,
      getCategoryIcon,
      getCategoryDescription,
      isLoading,
      error,
      filteredNews,
      sortedNews,
      sortOption,
      fetchCategoryNews,
      applySort
    };
  }
};
</script>

<style scoped>
.category-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* 分类标题区域 */
.category-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 40px;
  padding: 40px 20px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
}

.category-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.category-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin: 0 0 12px 0;
}

.category-header p {
  font-size: 16px;
  color: #666;
  margin: 0;
  max-width: 600px;
}

/* 加载状态 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4CAF50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 错误状态 */
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  background-color: #fef5f5;
  border: 1px solid #fecaca;
  border-radius: 12px;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.error-container h3 {
  font-size: 20px;
  color: #ef4444;
  margin: 0 0 12px 0;
}

.error-container p {
  color: #666;
  margin: 0 0 20px 0;
  max-width: 400px;
}

.retry-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.retry-button:hover {
  background-color: #45a049;
}

/* 分类新闻区域 */
.category-news-section {
  margin-bottom: 40px;
}

.news-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e0e0e0;
}

.news-count {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.sort-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sort-controls label {
  font-size: 14px;
  color: #666;
}

#sort-select {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  background-color: white;
  cursor: pointer;
  transition: border-color 0.3s ease;
}

#sort-select:hover {
  border-color: #4CAF50;
}

#sort-select:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
  background-color: #f9fafb;
  border-radius: 12px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-state p {
  font-size: 16px;
  color: #666;
  margin: 0 0 20px 0;
}

.back-home-link {
  display: inline-block;
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.back-home-link:hover {
  background-color: #45a049;
}

/* 新闻网格 */
.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .category-page {
    padding: 15px;
  }
  
  .category-header {
    padding: 30px 15px;
    margin-bottom: 30px;
  }
  
  .category-header h1 {
    font-size: 28px;
  }
  
  .news-stats {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .news-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 480px) {
  .category-header {
    padding: 20px 10px;
  }
  
  .category-icon {
    font-size: 36px;
  }
  
  .category-header h1 {
    font-size: 24px;
  }
  
  .category-header p {
    font-size: 14px;
  }
  
  .news-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .sort-controls {
    align-self: stretch;
  }
  
  #sort-select {
    flex: 1;
  }
}
</style>