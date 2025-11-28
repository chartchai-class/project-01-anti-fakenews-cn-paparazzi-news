import { defineStore } from 'pinia';
import { getAllNews, getNewsById as fetchNewsById, getNewsByCategory as fetchNewsByCategory, voteNews as apiVoteNews, getNewsVotes as apiGetNewsVotes } from '../api/newsApi';

export const useNewsStore = defineStore('news', {
  state: () => ({
    newsList: [], // 全部新闻
    categories: ['Politics', 'Society', 'Environment', 'Education', 'Entertainment'], // 预定义分类
    isLoading: false,
    error: null,
    votes: {}, // 存储新闻投票统计 { newsId: { true: number, false: number, neutral: number } }
    userVotes: {} // 存储用户投票记录 { newsId: voteType }
  }),

  getters: {
    // 获取可信度最高的前3条新闻作为精选
    featuredNews: (state) => {
      return [...state.newsList]
        .sort((a, b) => b.trustScore - a.trustScore)
        .slice(0, 3);
    },

    // 获取所有分类列表
    categoryList: (state) => {
      return ['All', ...state.categories];
    }
  },

  actions: {
    // 从后端获取所有新闻
    async fetchNews() {
      this.isLoading = true;
      this.error = null;
      
      try {
        const news = await getAllNews();
        this.newsList = news;
        return news;
      } catch (error) {
        this.error = error.message || '获取新闻失败';
        console.error('Failed to fetch news:', error);
        return [];
      } finally {
        this.isLoading = false;
      }
    },

    // 根据ID获取新闻
    async getNewsById(id) {
      // 确保ID是数字类型
      const numericId = Number(id);
      
      // 先从本地状态查找
      const localNews = this.newsList.find(news => news.id === numericId);
      if (localNews) {
        return localNews;
      }

      // 如果本地没有，从API获取
      this.isLoading = true;
      this.error = null;
      
      try {
        const news = await fetchNewsById(numericId);
        // 将获取到的新闻添加到本地状态
        if (!this.newsList.find(item => item.id === news.id)) {
          this.newsList.push(news);
        }
        return news;
      } catch (error) {
        this.error = error.message || '获取新闻详情失败';
        console.error(`Failed to fetch news with id ${numericId}:`, error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // 根据分类获取新闻
    async getNewsByCategory(category) {
      // 'All' 分类返回所有新闻
      if (category === 'All') {
        if (this.newsList.length === 0) {
          return await this.fetchNews();
        }
        return this.newsList;
      }

      // 如果已有数据，先尝试从本地过滤
      if (this.newsList.length > 0) {
        const filteredNews = this.newsList.filter(
          news => news.category.toLowerCase() === category.toLowerCase()
        );
        if (filteredNews.length > 0) {
          return filteredNews;
        }
      }

      // 如果本地没有对应分类的新闻，从API获取
      this.isLoading = true;
      this.error = null;
      
      try {
        const news = await fetchNewsByCategory(category);
        // 将获取到的新闻合并到本地状态，避免重复
        news.forEach(item => {
          if (!this.newsList.find(existing => existing.id === item.id)) {
            this.newsList.push(item);
          }
        });
        return news;
      } catch (error) {
        this.error = error.message || '获取分类新闻失败';
        console.error(`Failed to fetch news for category ${category}:`, error);
        return [];
      } finally {
        this.isLoading = false;
      }
    },

    // 清除错误信息
    clearError() {
      this.error = null;
    },

    // 获取新闻投票统计
    async fetchNewsVotes(newsId) {
      try {
        const votes = await apiGetNewsVotes(newsId);
        this.votes[newsId] = votes;
        return votes;
      } catch (error) {
        console.error(`获取新闻 ${newsId} 的投票统计失败:`, error);
        return { true: 0, false: 0, neutral: 0 };
      }
    },

    // 对新闻进行投票
    async voteNews(newsId, voteType) {
      try {
        await apiVoteNews(newsId, voteType);
        // 更新用户投票记录
        this.userVotes[newsId] = voteType;
        // 模拟更新投票统计（实际应由后端返回最新统计）
        if (!this.votes[newsId]) {
          this.votes[newsId] = { true: 0, false: 0, neutral: 0 };
        }
        this.votes[newsId][voteType]++;
        return { success: true };
      } catch (error) {
        console.error(`对新闻 ${newsId} 投票失败:`, error);
        this.error = '投票失败，请重试';
        return { success: false, error: error.message };
      }
    },

    // 获取用户对特定新闻的投票
    getUserVote(newsId) {
      return this.userVotes[newsId] || null;
    },

    // 获取新闻的投票统计
    getNewsVotes(newsId) {
      return this.votes[newsId] || { true: 0, false: 0, neutral: 0 };
    }
  }
});