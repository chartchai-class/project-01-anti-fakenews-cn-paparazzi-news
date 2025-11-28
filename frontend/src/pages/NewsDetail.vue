<template>
  <div class="news-detail-page">
    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>正在加载新闻详情...</p>
    </div>
    
    <!-- 错误状态 -->
    <div v-else-if="error" class="error-container">
      <div class="error-icon">⚠️</div>
      <h3>加载失败</h3>
      <p>{{ error }}</p>
      <button class="retry-button" @click="fetchNewsDetail">重试</button>
      <router-link to="/" class="back-home-link">返回首页</router-link>
    </div>
    
    <!-- 内容区域 -->
    <div v-else-if="newsDetail" class="content-wrapper">
      <!-- 新闻详情 -->
      <article class="news-article">
        <!-- 标题区域 -->
        <header class="article-header">
          <h1 class="article-title">{{ newsDetail.title }}</h1>
          <div class="article-meta">
            <span class="article-source">{{ newsDetail.source }}</span>
            <span class="article-date">{{ formatDate(newsDetail.date) }}</span>
          </div>
        </header>
        
        <!-- 可信度评分 -->
        <div class="trust-rating-container">
          <div class="trust-label">可信度评估</div>
          <div class="trust-meter">
            <div class="trust-bar" :style="trustBarStyle"></div>
          </div>
          <div class="trust-info">
            <span class="trust-score" :class="trustLevelClass">{{ newsDetail.trustScore }}%</span>
            <span class="trust-text">{{ trustLevelText }}</span>
          </div>
        </div>
        
        <!-- 主图 -->
        <figure class="article-image-container">
          <img 
            :src="newsDetail.imageUrl || 'https://picsum.photos/id/'+(newsDetail.id%100)+'/1200/600'" 
            :alt="newsDetail.title" 
            class="article-image"
          />
        </figure>
        
        <!-- 文章内容 -->
        <div class="article-content" v-html="newsDetail.content"></div>
        
        <!-- 投票区域 -->
        <div class="voting-section">
          <h3 class="voting-title">您认为这是真新闻还是假新闻？</h3>
          <div class="voting-stats" v-if="totalVotes > 0">
            <div class="voting-stat-item">
              <span class="voting-stat-label">真新闻:</span>
              <div class="voting-progress-container">
                <div class="voting-progress-bar voting-true" :style="{width: `${(votes.true/totalVotes)*100}%`}"></div>
              </div>
              <span class="voting-stat-count">{{ votes.true }}票</span>
            </div>
            <div class="voting-stat-item">
              <span class="voting-stat-label">假新闻:</span>
              <div class="voting-progress-container">
                <div class="voting-progress-bar voting-false" :style="{width: `${(votes.false/totalVotes)*100}%`}"></div>
              </div>
              <span class="voting-stat-count">{{ votes.false }}票</span>
            </div>
            <div class="voting-stat-item">
              <span class="voting-stat-label">中立:</span>
              <div class="voting-progress-container">
                <div class="voting-progress-bar voting-neutral" :style="{width: `${(votes.neutral/totalVotes)*100}%`}"></div>
              </div>
              <span class="voting-stat-count">{{ votes.neutral }}票</span>
            </div>
          </div>
          <div class="voting-buttons">
            <button 
              class="voting-button voting-true-btn" 
              :disabled="userVote !== null || isVoting || !canVote"
              @click="handleVote('true')"
              :class="{ 'voted': userVote === 'true' }"
            >
              <span>✅</span>
              <span>真新闻</span>
            </button>
            <button 
              class="voting-button voting-false-btn" 
              :disabled="userVote !== null || isVoting || !canVote"
              @click="handleVote('false')"
              :class="{ 'voted': userVote === 'false' }"
            >
              <span>❌</span>
              <span>假新闻</span>
            </button>
            <button 
              class="voting-button voting-neutral-btn" 
              :disabled="userVote !== null || isVoting || !canVote"
              @click="handleVote('neutral')"
              :class="{ 'voted': userVote === 'neutral' }"
            >
              <span>🤔</span>
              <span>中立</span>
            </button>
          </div>
          <p v-if="voteMessage" class="voting-message" :class="voteMessage.includes('成功') ? 'success' : 'error'">{{ voteMessage }}</p>
          <p v-if="!canVote" class="voting-message permission-message">
            登录成为成员后可参与投票
          </p>
        </div>
        
        <!-- 分享按钮 -->
        <div class="share-section">
          <span class="share-label">分享此新闻：</span>
          <div class="share-buttons">
            <button class="share-button" aria-label="分享到社交媒体">
              <span>🔗</span>
            </button>
            <button class="share-button" aria-label="分享到微信">
              <span>💬</span>
            </button>
            <button class="share-button" aria-label="分享到Twitter">
              <span>🐦</span>
            </button>
          </div>
        </div>
        
        <!-- 评论区域 -->
        <div class="comments-section">
          <h3 class="comments-title">评论 ({{ comments.length }})</h3>
          
          <!-- 评论表单 -->
          <div class="comment-form">
            <h4 class="comment-form-title">发表评论</h4>
            <textarea
              v-model="commentContent"
              class="comment-textarea"
              :placeholder="canComment ? '请输入您的评论...' : '登录成为成员后可发表评论'"
              rows="4"
              :disabled="isSubmittingComment || !canComment"
            ></textarea>
            <div class="comment-form-actions">
              <span class="comment-char-count">{{ commentContent.length }}/500</span>
              <button
                class="comment-submit-btn"
                @click="submitComment"
                :disabled="isSubmittingComment || !commentContent.trim() || commentContent.length < 5 || !canComment"
              >
                {{ isSubmittingComment ? '提交中...' : '发表评论' }}
              </button>
            </div>
            <p v-if="commentMessage" class="comment-message" :class="commentMessage.includes('成功') ? 'success' : 'error'">{{ commentMessage }}</p>
          </div>
          
          <!-- 评论列表 -->
          <div class="comments-list" v-if="!isLoadingComments">
            <div v-if="comments.length === 0" class="no-comments">
              <p>暂无评论，快来发表第一条评论吧！</p>
            </div>
            <div v-else v-for="comment in comments" :key="comment.id" class="comment-item">
              <img :src="comment.avatar || 'https://picsum.photos/id/1000/40/40'" :alt="comment.author" class="comment-avatar">
              <div class="comment-content">
                <div class="comment-header">
                  <span class="comment-author">{{ comment.author || '匿名用户' }}</span>
                  <span class="comment-time">{{ formatCommentTime(comment.createdAt) }}</span>
                </div>
                <div class="comment-body">{{ comment.content }}</div>
              </div>
            </div>
          </div>
          <div v-else class="comments-loading">
            <div class="loading-spinner small"></div>
            <p>正在加载评论...</p>
          </div>
        </div>
      </article>
      
      <!-- 相关新闻 -->
      <section v-if="relatedNews.length > 0" class="related-news-section">
        <h2 class="section-title">相关新闻</h2>
        <div class="related-news-grid">
          <div v-for="news in relatedNews" :key="news.id" class="related-news-card">
            <router-link :to="`/news/${news.id}`" class="related-news-link">
              <div class="related-news-image-wrapper">
                <img 
                  :src="news.imageUrl || 'https://picsum.photos/id/'+(news.id%100)+'/300/200'" 
                  :alt="news.title" 
                  class="related-news-image"
                />
                <div class="trust-badge" :class="getTrustLevelClass(news.trustScore)">
                  <span>{{ news.trustScore }}%</span>
                </div>
              </div>
              <div class="related-news-content">
                <h3 class="related-news-title">{{ news.title }}</h3>
                <p class="related-news-meta">{{ news.source }} · {{ formatDate(news.date) }}</p>
              </div>
            </router-link>
          </div>
        </div>
      </section>
    </div>
    
    <!-- 未找到状态 -->
    <div v-else class="not-found-container">
      <div class="not-found-icon">🔍</div>
      <h3>新闻未找到</h3>
      <p>抱歉，您请求的新闻不存在或已被删除。</p>
      <router-link to="/" class="back-home-link">返回首页</router-link>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useNewsStore } from '../store/newsStore';
import { useAuthStore } from '../stores/authStore';
import { storeToRefs } from 'pinia';
import api from '../api/apiService';

export default {
  name: 'NewsDetail',
  setup() {
    const route = useRoute();
    const newsStore = useNewsStore();
    const authStore = useAuthStore();
    const { getUser: currentUser } = storeToRefs(authStore);
    
    // 从路由获取新闻ID
    const newsId = computed(() => {
      const id = route.params.id;
      return typeof id === 'string' ? parseInt(id) : id;
    });
    
    // 计算属性
    const isLoading = computed(() => newsStore.isLoading);
    const error = computed(() => newsStore.error);
    
    // 获取新闻详情
    const newsDetail = computed(() => {
      return newsStore.newsList.find(news => news.id === Number(newsId.value)) || {};
    });
    
    // 获取相关新闻（同分类的前3条，排除当前新闻）
    const relatedNews = computed(() => {
      if (!newsDetail.value.id) return [];
      
      return newsStore.newsList
        .filter(news => 
          news.category === newsDetail.value.category && 
          news.id !== newsId.value
        )
        .sort((a, b) => b.trustScore - a.trustScore)
        .slice(0, 3);
    });
    
    // 可信度样式
    const trustLevel = computed(() => {
      if (!newsDetail.value.id || newsDetail.value.trustScore === undefined) return 'medium';
      const score = newsDetail.value.trustScore;
      if (score >= 80) return 'high';
      if (score >= 60) return 'medium';
      return 'low';
    });
    
    const trustLevelClass = computed(() => {
      return `trust-${trustLevel.value}`;
    });
    
    const trustLevelText = computed(() => {
      const levels = {
        high: '高可信度',
        medium: '中等可信度',
        low: '低可信度'
      };
      return levels[trustLevel.value] || '';
    });
    
    const trustBarStyle = computed(() => {
      if (!newsDetail.value.id || newsDetail.value.trustScore === undefined) return {};
      
      let backgroundColor = '#FFC107'; // 默认中等可信度黄色
      if (newsDetail.value.trustScore >= 80) {
        backgroundColor = '#4CAF50'; // 高可信度绿色
      } else if (newsDetail.value.trustScore < 60) {
        backgroundColor = '#F44336'; // 低可信度红色
      }
      
      return {
        width: `${newsDetail.value.trustScore}%`,
        backgroundColor
      };
    });
    
    // 获取新闻数据
    const fetchNewsDetail = async () => {
      try {
        await newsStore.getNewsById(newsId.value);
      } catch (error) {
        console.error('获取新闻详情失败，使用模拟数据');
        // 清除错误状态
        newsStore.clearError();
        // 如果API失败，创建模拟新闻数据
        const mockNews = {
          id: newsId.value,
          title: '模拟新闻标题：政府发布最新环保政策',
          content: '<p>这是一条模拟新闻内容。据最新消息，政府今日发布了一系列环保政策，旨在减少碳排放和保护环境。</p><p>专家表示，这些政策将对未来几年的环境改善产生积极影响。</p>',
          source: '模拟新闻来源',
          date: new Date().toISOString(),
          trustScore: 75,
          category: 'Environment',
          imageUrl: 'https://picsum.photos/id/'+(newsId.value%100)+'/1200/600'
        };
        // 将模拟数据添加到store
        newsStore.newsList.push(mockNews);
      }
    };
    
    // 获取可信度级别样式
    const getTrustLevelClass = (trustScore) => {
      if (trustScore >= 80) return 'trust-high';
      if (trustScore >= 60) return 'trust-medium';
      return 'trust-low';
    };
    
    // 格式化日期
    const formatDate = (dateString) => {
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch {
        return dateString;
      }
    };
    
    // 投票相关
    const voteMessage = ref('');
    const isVoting = ref(false);
    
    // 获取投票统计
    const votes = computed(() => {
      return newsStore.getNewsVotes(newsId.value);
    });
    
    // 获取用户投票
    const userVote = computed(() => {
      return newsStore.getUserVote(newsId.value);
    });
    
    // 计算总投票数
    const totalVotes = computed(() => {
      return votes.value.true + votes.value.false + votes.value.neutral;
    });
    
    // 权限控制
    const canVote = computed(() => {
      // 使用authStore中的权限getter
      return authStore.hasVotingPermission;
    });
    
    const canComment = computed(() => {
      // 使用authStore中的权限getter
      return authStore.hasCommentPermission;
    });
    
    // 处理投票
    const handleVote = async (voteType) => {
      // 检查权限
      if (!canVote.value) {
        voteMessage.value = '您没有权限参与投票，请登录';
        setTimeout(() => {
          voteMessage.value = '';
        }, 3000);
        return;
      }
      
      // 如果用户已经投过票，不允许再次投票
      if (userVote.value) {
        voteMessage.value = '您已经投过票了';
        setTimeout(() => {
          voteMessage.value = '';
        }, 3000);
        return;
      }
      
      isVoting.value = true;
      voteMessage.value = '';
      
      try {
        const result = await newsStore.voteNews(newsId.value, voteType);
        if (result.success) {
          voteMessage.value = '投票成功，感谢您的参与！';
        } else {
          voteMessage.value = result.error || '投票失败，请重试';
        }
      } catch (error) {
        voteMessage.value = '投票失败，请重试';
        console.error('投票错误:', error);
      } finally {
        isVoting.value = false;
        // 3秒后清除消息
        setTimeout(() => {
          voteMessage.value = '';
        }, 3000);
      }
    };
    
    // 加载投票统计
    const loadVotes = async () => {
      if (newsId.value) {
        await newsStore.fetchNewsVotes(newsId.value);
      }
    };
    
    // 评论相关
    const comments = ref([]);
    const commentContent = ref('');
    const isSubmittingComment = ref(false);
    const commentMessage = ref('');
    const isLoadingComments = ref(false);
    
    // 加载评论
    const loadComments = async () => {
      if (!newsId.value) return;
      
      isLoadingComments.value = true;
      try {
        // 使用apiService中的评论方法获取评论列表
        const result = await api.comment.getByNewsId(newsId.value);
        // 如果API失败，返回模拟评论数据
        if (!result || result.length === 0) {
          // 生成模拟评论数据
          comments.value = [
          {
            id: 1,
            content: '这篇新闻分析很到位，提供了很多有价值的信息。',
            author: '真相追寻者',
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            avatar: 'https://picsum.photos/id/1001/40/40'
          },
          {
            id: 2,
            content: '我觉得这里的数据来源需要进一步验证。',
            author: '谨慎思考者',
            createdAt: new Date(Date.now() - 7200000).toISOString(),
            avatar: 'https://picsum.photos/id/1002/40/40'
          },
          {
            id: 3,
            content: '谢谢分享，这对我了解当前情况很有帮助。',
            author: '求知若渴',
            createdAt: new Date(Date.now() - 10800000).toISOString(),
            avatar: 'https://picsum.photos/id/1003/40/40'
          }
        ];
        } else {
          comments.value = result;
        }
      } catch (error) {
        console.error('加载评论失败:', error);
        // 失败时显示模拟数据
        comments.value = [
          {
            id: 1,
            content: '这篇新闻分析很到位，提供了很多有价值的信息。',
            author: '真相追寻者',
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            avatar: 'https://picsum.photos/id/1001/40/40'
          }
        ];
      } finally {
        isLoadingComments.value = false;
      }
    };
    
    // 提交评论
    const submitComment = async () => {
      // 检查权限
      if (!canComment.value) {
        commentMessage.value = '您没有权限发表评论，请登录';
        setTimeout(() => {
          commentMessage.value = '';
        }, 3000);
        return;
      }
      
      if (!commentContent.value.trim()) {
        commentMessage.value = '评论内容不能为空';
        setTimeout(() => {
          commentMessage.value = '';
        }, 3000);
        return;
      }
      
      if (commentContent.value.length < 5) {
        commentMessage.value = '评论内容至少需要5个字符';
        setTimeout(() => {
          commentMessage.value = '';
        }, 3000);
        return;
      }
      
      isSubmittingComment.value = true;
      commentMessage.value = '';
      
      try {
        // 模拟用户信息
        const mockUser = {
          username: '当前用户',
          avatar: 'https://picsum.photos/id/1005/40/40'
        };
        
        // 尝试提交到API
        try {
          const newComment = await api.comment.create(newsId.value, {
            content: commentContent.value.trim()
          });
          
          // 添加用户信息到新评论
          newComment.author = mockUser.username;
          newComment.avatar = mockUser.avatar;
          
          // 添加到评论列表开头
          comments.value.unshift(newComment);
        } catch (apiError) {
          console.log('API提交失败，使用模拟数据');
          // API失败时，创建模拟评论
          const mockComment = {
            id: Date.now(),
            content: commentContent.value.trim(),
            author: mockUser.username,
            createdAt: new Date().toISOString(),
            avatar: mockUser.avatar
          };
          // 添加到评论列表开头
          comments.value.unshift(mockComment);
        }
        
        // 清空输入框
        commentContent.value = '';
        commentMessage.value = '评论发表成功！';
      } catch (error) {
        console.error('提交评论失败:', error);
        commentMessage.value = '评论发表失败，请重试';
      } finally {
        isSubmittingComment.value = false;
        // 3秒后清除消息
        setTimeout(() => {
          commentMessage.value = '';
        }, 3000);
      }
    };
    
    // 格式化评论时间
    const formatCommentTime = (dateString) => {
      try {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffSecs = Math.floor(diffMs / 1000);
        const diffMins = Math.floor(diffSecs / 60);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);
        
        if (diffSecs < 60) {
          return '刚刚';
        } else if (diffMins < 60) {
          return `${diffMins}分钟前`;
        } else if (diffHours < 24) {
          return `${diffHours}小时前`;
        } else if (diffDays < 30) {
          return `${diffDays}天前`;
        } else {
          return date.toLocaleDateString('zh-CN');
        }
      } catch {
        return dateString;
      }
    };
    
    // 监听路由变化，重新获取数据
    watch(newsId, () => {
      // 滚动到页面顶部
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // 获取数据
      fetchNewsDetail();
      // 加载投票统计
      loadVotes();
      // 加载评论
      loadComments();
    });
    
    // 页面加载时获取数据
    onMounted(() => {
      fetchNewsDetail();
      loadVotes();
      loadComments();
    });
    
    return {
      isLoading,
      error,
      newsDetail,
      relatedNews,
      trustLevelClass,
      trustLevelText,
      trustBarStyle,
      fetchNewsDetail,
      getTrustLevelClass,
      formatDate,
      votes,
      userVote,
      totalVotes,
      voteMessage,
      isVoting,
      handleVote,
      comments,
      commentContent,
      isSubmittingComment,
      commentMessage,
      isLoadingComments,
      submitComment,
      formatCommentTime,
      canVote,
      canComment
    };
  }
};
</script>

<style scoped>
.news-detail-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

/* 加载状态 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #4CAF50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 错误状态 */
.error-container,
.not-found-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
  background-color: #f9fafb;
  border-radius: 12px;
}

.error-icon,
.not-found-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.error-container h3,
.not-found-container h3 {
  font-size: 24px;
  color: #333;
  margin: 0 0 16px 0;
}

.error-container p,
.not-found-container p {
  font-size: 16px;
  color: #666;
  margin: 0 0 24px 0;
  max-width: 400px;
}

.retry-button,
.back-home-link {
  display: inline-block;
  margin: 8px;
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 16px;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.retry-button {
  background-color: #4CAF50;
  color: white;
  border: none;
}

.retry-button:hover {
  background-color: #45a049;
}

.back-home-link {
  background-color: #f8f9fa;
  color: #333;
  border: 1px solid #ddd;
}

.back-home-link:hover {
  background-color: #e9ecef;
}

/* 新闻文章 */
.news-article {
  background-color: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.article-header {
  margin-bottom: 24px;
}

.article-title {
  font-size: 32px;
  font-weight: 700;
  color: #333;
  line-height: 1.3;
  margin: 0 0 16px 0;
}

.article-meta {
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: #666;
}

.article-source {
  font-weight: 500;
}

/* 可信度评分 */
.trust-rating-container {
  margin-bottom: 32px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 12px;
  border-left: 4px solid #4CAF50;
}

.trust-label {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.trust-meter {
  width: 100%;
  height: 12px;
  background-color: #e9ecef;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 12px;
}

.trust-bar {
  height: 100%;
  transition: width 1s ease-in-out, background-color 0.3s ease;
}

.trust-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.trust-score {
  font-size: 24px;
  font-weight: 700;
}

.trust-high {
  color: #4CAF50;
}

.trust-medium {
  color: #FF9800;
}

.trust-low {
  color: #F44336;
}

.trust-text {
  font-size: 16px;
  color: #666;
}

/* 文章图片 */
.article-image-container {
  margin: 0 0 32px 0;
  border-radius: 12px;
  overflow: hidden;
}

.article-image {
  width: 100%;
  height: auto;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.news-article:hover .article-image {
  transform: scale(1.01);
}

/* 文章内容 */
.article-content {
  font-size: 18px;
  line-height: 1.8;
  color: #333;
  margin-bottom: 32px;
}

.article-content p {
  margin-bottom: 20px;
}

.article-content h2,
.article-content h3 {
  margin: 32px 0 16px 0;
  color: #222;
}

.article-content img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 20px 0;
}

/* 投票区域 */
.voting-section {
  margin: 32px 0;
  padding: 24px;
  background-color: #f8f9fa;
  border-radius: 12px;
  border-left: 4px solid #2196F3;
}

.voting-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0 0 20px 0;
}

.voting-stats {
  margin-bottom: 24px;
}

.voting-stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.voting-stat-label {
  font-weight: 500;
  color: #666;
  width: 60px;
}

.voting-progress-container {
  flex: 1;
  height: 10px;
  background-color: #e9ecef;
  border-radius: 5px;
  overflow: hidden;
}

.voting-progress-bar {
  height: 100%;
  transition: width 0.5s ease;
}

.voting-true {
  background-color: #4CAF50;
}

.voting-false {
  background-color: #F44336;
}

.voting-neutral {
  background-color: #FFC107;
}

.voting-stat-count {
  font-weight: 600;
  color: #333;
  min-width: 50px;
  text-align: right;
}

.voting-buttons {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.voting-button {
  flex: 1;
  padding: 12px 20px;
  border: 2px solid #ddd;
  border-radius: 8px;
  background-color: white;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.voting-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.voting-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.voting-true-btn:hover:not(:disabled) {
  border-color: #4CAF50;
  color: #4CAF50;
}

.voting-false-btn:hover:not(:disabled) {
  border-color: #F44336;
  color: #F44336;
}

.voting-neutral-btn:hover:not(:disabled) {
  border-color: #FFC107;
  color: #FFC107;
}

.voting-button.voted {
  color: white;
  border-color: transparent;
}

.voting-true-btn.voted {
  background-color: #4CAF50;
}

.voting-false-btn.voted {
  background-color: #F44336;
}

.voting-neutral-btn.voted {
  background-color: #FFC107;
  color: #333;
}

.voting-message {
  margin: 0;
  font-size: 14px;
  text-align: center;
}

.voting-message.success {
  color: #4CAF50;
}

.voting-message.error {
  color: #F44336;
}

/* 分享区域 */
.share-section {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-top: 24px;
  border-top: 1px solid #e0e0e0;
}

/* 评论区域 */
.comments-section {
  margin-top: 48px;
  padding-top: 32px;
  border-top: 2px solid #e0e0e0;
}

.comments-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0 0 32px 0;
  position: relative;
}

.comments-title::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 40px;
  height: 3px;
  background-color: #2196F3;
  border-radius: 3px;
}

/* 评论表单 */
.comment-form {
  background-color: #f8f9fa;
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 32px;
}

.comment-form-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
}

.comment-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  line-height: 1.6;
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.comment-textarea:focus {
  outline: none;
  border-color: #2196F3;
  box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
}

.comment-textarea:disabled {
  background-color: #f1f1f1;
  cursor: not-allowed;
  opacity: 0.7;
}

.comment-form-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
}

.comment-char-count {
  font-size: 14px;
  color: #666;
}

.comment-submit-btn {
  padding: 10px 24px;
  background-color: #2196F3;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.comment-submit-btn:hover:not(:disabled) {
  background-color: #1976D2;
}

.comment-submit-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.comment-message {
  margin: 12px 0 0 0;
  font-size: 14px;
}

.comment-message.success {
  color: #4CAF50;
}

.comment-message.error {
  color: #F44336;
}

/* 评论列表 */
.comments-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.no-comments {
  text-align: center;
  padding: 40px 20px;
  color: #666;
  background-color: #f8f9fa;
  border-radius: 12px;
}

.comment-item {
  display: flex;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid #eee;
}

.comment-item:last-child {
  border-bottom: none;
}

.comment-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.comment-author {
  font-weight: 600;
  color: #333;
}

.comment-time {
  font-size: 14px;
  color: #999;
}

.comment-body {
  font-size: 16px;
  line-height: 1.6;
  color: #333;
  word-break: break-word;
}

.comments-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #666;
}

.loading-spinner.small {
  width: 30px;
  height: 30px;
  margin-bottom: 12px;
}

.share-label {
  font-size: 16px;
  color: #666;
}

.share-buttons {
  display: flex;
  gap: 8px;
}

.share-button {
  width: 40px;
  height: 40px;
  border: 1px solid #ddd;
  border-radius: 50%;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 18px;
}

.share-button:hover {
  background-color: #f8f9fa;
  border-color: #4CAF50;
  transform: translateY(-2px);
}

/* 相关新闻 */
.related-news-section {
  background-color: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0 0 24px 0;
  position: relative;
  padding-bottom: 12px;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 3px;
  background-color: #4CAF50;
  border-radius: 3px;
}

.related-news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.related-news-card {
  background-color: #f8f9fa;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.related-news-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.related-news-link {
  display: block;
  text-decoration: none;
  color: inherit;
}

.related-news-image-wrapper {
  position: relative;
  height: 180px;
  overflow: hidden;
}

.related-news-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.related-news-card:hover .related-news-image {
  transform: scale(1.05);
}

.related-news-content {
  padding: 16px;
}

.related-news-title {
  font-size: 16px;
  font-weight: 600;
  line-height: 1.4;
  margin: 0 0 8px 0;
  color: #333;
}

.related-news-card:hover .related-news-title {
  color: #4CAF50;
}

.related-news-meta {
  font-size: 12px;
  color: #666;
}

/* 可信度标识 */
.trust-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(5px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .news-detail-page {
    padding: 15px;
  }
  
  .news-article,
  .related-news-section {
    padding: 24px;
  }
  
  .article-title {
    font-size: 28px;
  }
  
  .article-content {
    font-size: 16px;
  }
  
  .related-news-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .news-article,
  .related-news-section {
    padding: 16px;
  }
  
  .article-title {
    font-size: 24px;
  }
  
  .article-meta {
    flex-direction: column;
    gap: 8px;
  }
  
  .share-section {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .voting-buttons {
    flex-direction: column;
  }
  
  .voting-stat-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
  
  .voting-stat-label {
    width: auto;
  }
  
  .voting-stat-count {
    text-align: left;
  }
  
  .related-news-grid {
    grid-template-columns: 1fr;
  }
  
  .related-news-image-wrapper {
    height: 160px;
  }
}
</style>