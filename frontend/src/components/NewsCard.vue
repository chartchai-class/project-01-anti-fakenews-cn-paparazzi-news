<template>
  <router-link :to="`/news/${id}`" class="news-card">
    <!-- 新闻图片 -->
    <div class="card-image">
      <img 
        :src="currentImageUrl" 
        :alt="title" 
        loading="lazy" 
        @error="handleImageError"
        @load="imageLoaded = true"
        :class="{ loaded: imageLoaded }"
      />
      <!-- 图片加载占位 -->
      <div v-if="!imageLoaded" class="image-placeholder">
        <span class="placeholder-icon">📰</span>
      </div>
      <!-- 图片上的信任度指示器 -->
      <div class="image-trust-indicator" :class="trustLevelClass">
        <span class="trust-icon">{{ trustLevelIcon }}</span>
      </div>
    </div>
    
    <!-- 卡片内容 -->
    <div class="card-content">
      <!-- 信任度详情 -->
      <div class="trust-container">
        <div class="trust-badge" :class="trustLevelClass">
          <span class="trust-label">可信度</span>
          <span class="trust-score">{{ trustScore }}%</span>
        </div>
        <!-- 信任度进度条 -->
        <div class="trust-progress-container">
          <div 
            class="trust-progress-bar" 
            :class="trustLevelClass"
            :style="{ width: trustScore + '%' }"
          ></div>
        </div>
      </div>
      
      <!-- 标题 -->
      <h3 class="card-title">{{ title }}</h3>
      
      <!-- 摘要 -->
      <p class="card-summary">{{ summary }}</p>
      
      <!-- 元信息 -->
      <div class="card-meta">
        <div class="meta-left">
          <span class="source">{{ source }}</span>
          <span class="trust-level-text">{{ trustLevelText }}</span>
        </div>
        <span class="date">{{ formattedDate }}</span>
      </div>
    </div>
    
    <!-- 悬停效果层 -->
    <div class="card-hover-overlay">
      <span class="read-more-text">查看详情</span>
    </div>
  </router-link>
</template>

<script>
export default {
  name: 'NewsCard',
  props: {
    id: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    summary: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String,
      default: 'https://picsum.photos/id/237/400/225'
    },
    trustScore: {
      type: Number,
      required: true
    },
    source: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      currentImageUrl: this.imageUrl,
      imageLoaded: false,
      fallbackImageUrl: 'https://picsum.photos/id/237/400/225',
      // 备用图片列表，用于多次重试
      fallbackImages: [
        'https://picsum.photos/id/237/400/225',
        'https://picsum.photos/id/1005/400/225',
        'https://picsum.photos/id/1019/400/225',
        'https://picsum.photos/id/1025/400/225'
      ],
      currentFallbackIndex: 0
    };
  },
  watch: {
    // 监听imageUrl变化，更新currentImageUrl
    imageUrl(newUrl) {
      this.resetImageState();
      this.currentImageUrl = newUrl;
    }
  },
  computed: {
    // 根据可信度分数计算可信度级别
    trustLevel() {
      if (this.trustScore >= 80) return 'high';
      if (this.trustScore >= 60) return 'medium';
      return 'low';
    },
    
    // 可信度样式类
    trustLevelClass() {
      return `trust-${this.trustLevel}`;
    },
    
    // 可信度文本
    trustLevelText() {
      const levels = {
        high: '高可信度',
        medium: '中等可信度',
        low: '低可信度'
      };
      return levels[this.trustLevel] || '';
    },
    
    // 可信度图标
    trustLevelIcon() {
      const icons = {
        high: '✓',
        medium: '!',
        low: '×'
      };
      return icons[this.trustLevel] || '?';
    },
    
    // 格式化日期
    formattedDate() {
      try {
        const date = new Date(this.date);
        return date.toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      } catch (error) {
        return this.date;
      }
    }
  },
  methods: {
    // 处理图片加载错误
    handleImageError() {
      // 如果当前不是备用图片，则尝试使用备用图片
      if (this.currentImageUrl !== this.fallbackImageUrl) {
        this.currentFallbackIndex++;
        // 如果还有备用图片，尝试下一个
        if (this.currentFallbackIndex < this.fallbackImages.length) {
          this.currentImageUrl = this.fallbackImages[this.currentFallbackIndex];
        } else {
          // 所有备用图片都尝试过了，使用默认备用图
          this.currentImageUrl = this.fallbackImageUrl;
        }
      } else {
        // 备用图片也加载失败，标记为已加载，显示占位符
        this.imageLoaded = true;
      }
    },
    
    // 重置图片状态
    resetImageState() {
      this.imageLoaded = false;
      this.currentFallbackIndex = 0;
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
  --shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.1);
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --transition-base: 0.2s ease-in-out;
  --transition-fast: 0.15s ease-out;
  
  /* 信任度颜色 */
  --trust-high-color: #2ECC71;
  --trust-medium-color: #F39C12;
  --trust-low-color: #E74C3C;
  --trust-high-bg: rgba(46, 204, 113, 0.1);
  --trust-medium-bg: rgba(243, 156, 18, 0.1);
  --trust-low-bg: rgba(231, 76, 60, 0.1);
}

.news-card {
  display: flex;
  flex-direction: column;
  background-color: var(--white);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-base);
  text-decoration: none;
  color: inherit;
  height: 100%;
  position: relative;
  border: 1px solid var(--border-color);
}

.news-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-lg);
  border-color: var(--secondary-color);
}

.card-image {
  height: 200px;
  overflow: hidden;
  position: relative;
  background-color: #f0f0f0;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  opacity: 1;
  transition: opacity 0.3s ease;
}

/* 图片占位符 */
.image-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
  color: #999;
  font-size: 4rem;
  z-index: 1;
  transition: opacity 0.3s ease;
}

/* 图片加载完成后隐藏占位符 */
.card-image img.loaded + .image-placeholder {
  opacity: 0;
  pointer-events: none;
}

/* 占位符图标 */
.placeholder-icon {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}

.news-card:hover .card-image img {
  transform: scale(1.1);
}

/* 图片上的信任度指示器 */
.image-trust-indicator {
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--white);
  font-weight: bold;
  font-size: 1rem;
  z-index: 2;
  transition: transform var(--transition-fast);
}

.news-card:hover .image-trust-indicator {
  transform: scale(1.1);
}

.image-trust-indicator.trust-high {
  background-color: var(--trust-high-color);
}

.image-trust-indicator.trust-medium {
  background-color: var(--trust-medium-color);
}

.image-trust-indicator.trust-low {
  background-color: var(--trust-low-color);
}

.card-content {
  padding: var(--spacing-lg);
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
}

/* 信任度容器 */
.trust-container {
  margin-bottom: var(--spacing-md);
}

/* 信任度徽章 */
.trust-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
  align-self: flex-start;
  transition: all var(--transition-fast);
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

.trust-label {
  font-weight: 500;
  opacity: 0.8;
}

.trust-score {
  font-weight: 700;
  font-size: 0.9375rem;
}

/* 信任度进度条 */
.trust-progress-container {
  width: 100%;
  height: 6px;
  background-color: var(--border-color);
  border-radius: 3px;
  overflow: hidden;
  transition: background-color var(--transition-fast);
}

.trust-progress-bar {
  height: 100%;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 3px;
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

/* 标题 */
.card-title {
  font-family: 'Inter', sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.4;
  margin: 0 0 var(--spacing-md) 0;
  color: var(--text-primary);
  transition: color var(--transition-fast);
}

.news-card:hover .card-title {
  color: var(--secondary-color);
}

/* 摘要 */
.card-summary {
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--text-secondary);
  margin: 0 0 var(--spacing-lg) 0;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color var(--transition-fast);
}

.news-card:hover .card-summary {
  color: var(--text-primary);
}

/* 元信息 */
.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-top: auto;
}

.meta-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  flex: 1;
}

.source {
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
}

.trust-level-text {
  font-size: 0.75rem;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 12px;
}

.trust-badge.trust-high + .trust-progress-container + .card-title + .card-summary + .card-meta .trust-level-text {
  background-color: var(--trust-high-bg);
  color: var(--trust-high-color);
}

.trust-badge.trust-medium + .trust-progress-container + .card-title + .card-summary + .card-meta .trust-level-text {
  background-color: var(--trust-medium-bg);
  color: var(--trust-medium-color);
}

.trust-badge.trust-low + .trust-progress-container + .card-title + .card-summary + .card-meta .trust-level-text {
  background-color: var(--trust-low-bg);
  color: var(--trust-low-color);
}

.date {
  font-style: italic;
  white-space: nowrap;
}

/* 悬停覆盖层 */
.card-hover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: var(--spacing-lg);
  opacity: 0;
  transition: opacity var(--transition-base);
  pointer-events: none;
}

.news-card:hover .card-hover-overlay {
  opacity: 1;
}

.read-more-text {
  background-color: var(--secondary-color);
  color: var(--primary-color);
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: 24px;
  font-weight: 600;
  font-size: 0.875rem;
  transform: translateY(20px);
  transition: transform var(--transition-base);
}

.news-card:hover .read-more-text {
  transform: translateY(0);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .card-image {
    height: 180px;
  }
  
  .card-content {
    padding: var(--spacing-md);
  }
  
  .card-title {
    font-size: 1.125rem;
  }
  
  .image-trust-indicator {
    width: 32px;
    height: 32px;
    font-size: 0.875rem;
  }
  
  .meta-left {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }
  
  .card-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }
  
  .source {
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .card-image {
    height: 160px;
  }
  
  .card-content {
    padding: var(--spacing-sm) var(--spacing-md);
  }
  
  .trust-badge {
    font-size: 0.75rem;
    padding: 3px 10px;
  }
  
  .card-title {
    font-size: 1rem;
  }
  
  .card-summary {
    font-size: 0.875rem;
  }
  
  .image-trust-indicator {
    width: 28px;
    height: 28px;
    font-size: 0.75rem;
  }
}
</style>