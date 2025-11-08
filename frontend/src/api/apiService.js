// API服务层，负责与后端通信

// API基础URL
const BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : "http://localhost:8080/api";

// 通用请求函数
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  // 如果有token，添加到请求头
  const token = localStorage.getItem('authToken');
  if (token) {
    defaultOptions.headers['Authorization'] = `Bearer ${token}`;
  }
  
  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };
  
  try {
    const response = await fetch(url, mergedOptions);
    
    // 检查响应状态
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
    }
    
    // 对于204 No Content响应，直接返回
    if (response.status === 204) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// 新闻相关API
export const newsService = {
  // 获取新闻列表
  async getNews(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/news${queryString ? `?${queryString}` : ''}`;
    return await request(endpoint);
  },
  
  // 获取新闻详情
  async getNewsById(id) {
    return await request(`/news/${id}`);
  },
  
  // 投票
  async voteNews(id, voteType) {
    return await request(`/news/${id}/vote`, {
      method: 'POST',
      body: JSON.stringify({ voteType }),
    });
  },
  
  // 获取新闻评论
  async getComments(newsId) {
    return await request(`/news/${newsId}/comments`);
  },
  
  // 添加评论
  async addComment(newsId, content) {
    return await request(`/news/${newsId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },
};

// 用户相关API
export const userService = {
  // 用户登录
  async login(credentials) {
    return await request('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
  
  // 用户注册
  async register(userData) {
    return await request('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
  
  // 获取用户信息
  async getProfile() {
    return await request('/users/profile');
  },
};

// 评论相关API
export const commentService = {
  // 点赞评论
  async likeComment(commentId) {
    return await request(`/comments/${commentId}/like`, {
      method: 'POST',
    });
  },
  
  // 点踩评论
  async dislikeComment(commentId) {
    return await request(`/comments/${commentId}/dislike`, {
      method: 'POST',
    });
  },
};

// 认证相关
export const authService = {
  // 存储认证token
  setToken(token) {
    localStorage.setItem('authToken', token);
  },
  
  // 获取认证token
  getToken() {
    return localStorage.getItem('authToken');
  },
  
  // 清除认证token
  clearToken() {
    localStorage.removeItem('authToken');
  },
  
  // 检查是否已认证
  isAuthenticated() {
    return !!this.getToken();
  },
};

export default {
  news: newsService,
  user: userService,
  comment: commentService,
  auth: authService,
};