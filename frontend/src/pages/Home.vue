<template>
  <div class="home-page">
    <!-- 英雄区域 -->
    <section class="hero-section">
      <div class="hero-container">
        <h1 class="hero-title">真相时刻 · Truth Moment</h1>
        <p class="hero-description">
          我们致力于为您提供真实可靠的新闻资讯，通过先进的算法和专业团队的审核，
          帮助您识别虚假信息，获取有价值的新闻内容。
        </p>
        <div class="hero-actions">
          <router-link to="/news/latest" class="btn btn-primary">
            浏览最新新闻
          </router-link>
          <router-link to="/about" class="btn btn-secondary">
            了解我们的服务
          </router-link>
        </div>
      </div>
    </section>

    <!-- 核心特性 -->
    <section class="features-section">
      <div class="section-header">
        <h2 class="section-title">我们的核心优势</h2>
      </div>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">🔍</div>
          <h3 class="feature-title">事实核查</h3>
          <p class="feature-description">
            多维度验证新闻真实性，通过AI技术和人工审核相结合的方式，提供可靠的信任度评分。
          </p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">⚡</div>
          <h3 class="feature-title">实时更新</h3>
          <p class="feature-description">
            24小时不间断监控全球新闻动态，确保您第一时间获取最新、最准确的资讯。
          </p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">📊</div>
          <h3 class="feature-title">数据可视化</h3>
          <p class="feature-description">
            直观展示新闻可信度指标，通过图表和评分系统，让您轻松判断信息的可靠性。
          </p>
        </div>
      </div>
    </section>
    
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
      <button class="btn btn-secondary" @click="fetchNews">重试</button>
    </div>
    
    <!-- 内容区域 -->
    <div v-else>
      <!-- 精选新闻区 -->
      <section v-if="featuredNews.length > 0" class="featured-section">
        <div class="section-header">
          <h2 class="section-title">精选新闻</h2>
          <router-link to="/featured" class="section-action">
            查看全部
            <span>→</span>
          </router-link>
        </div>
        <div class="featured-grid">
          <div v-for="news in featuredNews" :key="news.id" class="featured-card">
            <router-link :to="`/news/${news.id}`" class="featured-link">
              <div class="featured-image-wrapper">
                <img :src="news.imageUrl || 'https://picsum.photos/id/'+(news.id%100)+'/800/450'" :alt="news.title" class="featured-image" />
                <!-- 信任度指示器 -->
                <div class="trust-indicator" :class="getTrustLevelClass(news.trustScore)">
                  <div class="trust-icon">{{ getTrustLevelIcon(news.trustScore) }}</div>
                  <div class="trust-text">{{ news.trustScore }}%</div>
                </div>
                <!-- 信任度进度条 -->
                <div class="trust-progress-bar-container">
                  <div 
                    class="trust-progress-bar" 
                    :class="getTrustLevelClass(news.trustScore)"
                    :style="{ width: news.trustScore + '%' }"
                  ></div>
                </div>
              </div>
              <div class="featured-content">
                <div class="trust-badge" :class="getTrustLevelClass(news.trustScore)">
                  <span class="trust-label">可信度</span>
                  <span class="trust-score">{{ news.trustScore }}%</span>
                </div>
                <h3 class="featured-title">{{ news.title }}</h3>
                <p class="featured-summary">{{ news.summary }}</p>
                <div class="featured-meta">
                  <span class="featured-source">{{ news.source }}</span>
                  <span class="featured-date">{{ formatDate(news.date) }}</span>
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </section>
      
      <!-- 新闻列表 -->
      <section class="news-section">
        <div class="section-header">
          <h2 class="section-title">最新新闻</h2>
          <router-link to="/news" class="section-action">
            查看全部
            <span>→</span>
          </router-link>
        </div>
        <div v-if="newsList.length === 0" class="empty-state">
          <div class="empty-icon">📰</div>
          <p>暂无新闻内容</p>
        </div>
        <div v-else class="news-grid">
          <NewsCard 
            v-for="news in newsList" 
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
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
// 导入真实的store
import { useNewsStore } from '../store/newsStore';
import NewsCard from '../components/NewsCard.vue';
import CategoryTabs from '../components/CategoryTabs.vue';

export default {
  name: 'Home',
  components: {
    NewsCard,
    CategoryTabs
  },
  setup() {
    const router = useRouter();
    const newsStore = useNewsStore();
    
    // 从store获取数据
    const isLoading = computed(() => newsStore.isLoading);
    const error = computed(() => newsStore.error);
    
    // 计算属性：获取所有新闻
    const newsList = computed(() => newsStore.newsList);
    
    // 计算属性：获取可信度最高的前3条新闻作为精选
    const featuredNews = computed(() => {
      return [...newsStore.newsList]
        .sort((a, b) => b.trustScore - a.trustScore)
        .slice(0, 3);
    });
    
    // 获取新闻数据
    const fetchNews = async () => {
      await newsStore.fetchNews();
    };
    
    // 根据可信度分数获取样式类
    const getTrustLevelClass = (trustScore) => {
      if (trustScore >= 80) return 'trust-high';
      if (trustScore >= 60) return 'trust-medium';
      return 'trust-low';
    };
    
    // 根据可信度分数获取文本
    const getTrustLevelText = (trustScore) => {
      if (trustScore >= 80) return '高可信度';
      if (trustScore >= 60) return '中等可信度';
      return '低可信度';
    };
    
    // 根据可信度分数获取图标
    const getTrustLevelIcon = (trustScore) => {
      if (trustScore >= 80) return '✓';
      if (trustScore >= 60) return '!';
      return '×';
    };
    
    // 格式化日期
    const formatDate = (dateString) => {
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      } catch {
        return dateString;
      }
    };
    
    // 页面加载时获取新闻数据
    onMounted(() => {
      fetchNews();
    });
    
    return {
      isLoading,
      error,
      newsList,
      featuredNews,
      fetchNews,
      getTrustLevelClass,
      getTrustLevelText,
      getTrustLevelIcon,
      formatDate
    };
  }
};
</script>

<style scoped>
.home-page {
  width: 100%;
}

/* 核心特性区域 */
.features-section {
  margin-bottom: var(--spacing-2xl);
}

/* 加载状态 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2xl) var(--spacing-md);
  text-align: center;
  background-color: var(--card-background);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-xl);
  box-shadow: var(--shadow-sm);
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--divider-color);
  border-top: 4px solid var(--secondary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: var(--spacing-lg);
}

.loading-container p {
  color: var(--text-secondary);
  font-size: var(--font-base);
  margin: 0;
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
  padding: var(--spacing-2xl) var(--spacing-md);
  text-align: center;
  background-color: rgba(231, 76, 60, 0.05);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-xl);
}

.error-icon {
  font-size: 4rem;
  margin-bottom: var(--spacing-lg);
}

.error-container h3 {
  font-size: var(--font-lg);
  font-weight: var(--font-semibold);
  color: var(--error-color);
  margin: 0 0 var(--spacing-sm) 0;
}

.error-container p {
  color: var(--text-secondary);
  margin: 0 0 var(--spacing-lg) 0;
  max-width: 400px;
  line-height: var(--leading-relaxed);
}

/* 精选新闻区域 */
.featured-section {
  margin-bottom: var(--spacing-2xl);
}

.featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--spacing-xl);
  margin-top: var(--spacing-xl);
}

.featured-card {
  background-color: var(--card-background);
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-base);
  position: relative;
}

.featured-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
  border-color: var(--secondary-color);
}

.featured-link {
  display: block;
  text-decoration: none;
  color: inherit;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.featured-image-wrapper {
  position: relative;
  height: 220px;
  overflow: hidden;
}

.featured-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.featured-card:hover .featured-image {
  transform: scale(1.05);
}

/* 信任度指示器 */
.trust-indicator {
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  font-size: var(--font-sm);
  font-weight: var(--font-bold);
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.9);
  z-index: 10;
  transition: all var(--transition-fast);
}

.trust-indicator.trust-high {
  color: var(--trust-high-color);
}

.trust-indicator.trust-medium {
  color: var(--trust-medium-color);
}

.trust-indicator.trust-low {
  color: var(--trust-low-color);
}

.trust-icon {
  font-size: var(--font-lg);
  font-weight: var(--font-bold);
}

/* 信任度进度条 */
.trust-progress-bar-container {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background-color: rgba(0, 0, 0, 0.1);
}

.trust-progress-bar {
  height: 100%;
  transition: width var(--transition-base);
}

.trust-progress-bar.trust-high {
  background-color: var(--trust-high-color);
}

.trust-progress-bar.trust-medium {
  background-color: var(--trust-medium-color);
}

.trust-progress-bar.trust-low {
  background-color: var(--trust-low-color);
}

.featured-content {
  padding: var(--spacing-lg);
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* 信任度徽章 */
.trust-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: 4px 10px;
  border-radius: 16px;
  font-size: var(--font-xs);
  font-weight: var(--font-semibold);
  margin-bottom: var(--spacing-sm);
}

.trust-badge.trust-high {
  background-color: var(--trust-high-bg);
  color: var(--trust-high-color);
}

.trust-badge.trust-medium {
  background-color: var(--trust-medium-bg);
  color: var(--trust-medium-color);
}

.trust-badge.trust-low {
  background-color: var(--trust-low-bg);
  color: var(--trust-low-color);
}

.featured-title {
  font-size: var(--font-xl);
  font-weight: var(--font-semibold);
  line-height: var(--leading-tight);
  margin: 0 0 var(--spacing-md) 0;
  color: var(--text-primary);
  transition: color var(--transition-fast);
}

.featured-card:hover .featured-title {
  color: var(--secondary-color);
}

.featured-summary {
  font-size: var(--font-base);
  line-height: var(--leading-relaxed);
  color: var(--text-secondary);
  margin: 0 0 var(--spacing-lg) 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.featured-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--font-sm);
  color: var(--text-tertiary);
  margin-top: auto;
}

.featured-source {
  font-weight: var(--font-medium);
  color: var(--text-secondary);
}

.featured-date {
  font-style: italic;
}

/* 新闻列表区域 */
.news-section {
  margin-bottom: var(--spacing-2xl);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-3xl) var(--spacing-md);
  text-align: center;
  background-color: var(--surface-background);
  border-radius: var(--radius-lg);
  border: 2px dashed var(--divider-color);
  margin-top: var(--spacing-xl);
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: var(--spacing-lg);
  opacity: 0.7;
}

.empty-state p {
  font-size: var(--font-base);
  color: var(--text-secondary);
  margin: 0;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--spacing-lg);
  margin-top: var(--spacing-xl);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .featured-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--spacing-lg);
  }
  
  .news-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--spacing-md);
  }
  
  .featured-image-wrapper {
    height: 180px;
  }
  
  .featured-content {
    padding: var(--spacing-md);
  }
  
  .featured-title {
    font-size: var(--font-lg);
  }
  
  .featured-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }
}

@media (max-width: 480px) {
  .featured-grid,
  .news-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }
  
  .featured-image-wrapper {
    height: 160px;
  }
  
  .featured-content {
    padding: var(--spacing-sm) var(--spacing-md);
  }
  
  .trust-indicator {
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: var(--font-xs);
    top: var(--spacing-sm);
    right: var(--spacing-sm);
  }
  
  .empty-state {
    padding: var(--spacing-2xl) var(--spacing-md);
  }
  
  .empty-icon {
    font-size: 4rem;
  }
}

/* 滚动到顶部按钮 */
.scroll-top-button {
  position: fixed;
  bottom: var(--spacing-xl);
  right: var(--spacing-xl);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: var(--secondary-color);
  color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
  box-shadow: var(--shadow-md);
  transition: all var(--transition-base);
  z-index: 100;
  opacity: 0;
  visibility: hidden;
  font-size: var(--font-lg);
}

.scroll-top-button.visible {
  opacity: 1;
  visibility: visible;
}

.scroll-top-button:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg);
  background-color: #ffc107;
}

@media (max-width: 768px) {
  .scroll-top-button {
    bottom: var(--spacing-lg);
    right: var(--spacing-lg);
    width: 44px;
    height: 44px;
  }
}
</style>