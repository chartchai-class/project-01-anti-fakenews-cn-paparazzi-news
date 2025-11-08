
import './style.css';
// 导入页面组件
import { renderHomePage, initHomePage } from './pages/HomePage.js';
import { renderCategoryPage, initCategoryPage } from './pages/CategoryPage.js';
import { renderNewsDetailPage, initNewsDetailPage } from './pages/NewsDetailPage.js';
// 导入API服务
import apiService from './api/apiService.js';
     // 检查后端是否可连接
async function isBackendAvailable() {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/news`, { method: 'HEAD' });
    return res.ok;
  } catch (e) {
    return false;
  }
}

// Mock 数据
const mockNewsData = [
  {
    id: 1,
    title: "Expert Insights: How to Distinguish Between Online Rumors and Real News",
    summary: "In the era of information explosion, learning to distinguish between true and false information has become particularly important. This article invites communication experts to share practical identification skills...",
    source: "People's Daily",
    trustLevel: "high",
    trustScore: 95,
    date: "2024-03-15",
    category: "Education",
    imageUrl: "https://picsum.photos/seed/news-education-1/600/400",
    content: "<p>In today's digital age, we are constantly bombarded with information from various sources...</p>"
  },
  {
    id: 2,
    title: "Rumors About 'Celebrity Arrest' Spark Heated Discussions Online",
    summary: "Recently, rumors about a well-known celebrity being arrested by the police for drug-related offenses have been widely circulating on social media, sparking extensive discussions...",
    source: "Entertainment Express",
    trustLevel: "low",
    trustScore: 20,
    date: "2024-03-14",
    category: "Entertainment",
    imageUrl: "https://picsum.photos/seed/news-entertainment-1/600/400",
    content: "<p>Social media platforms have been abuzz with rumors about a popular celebrity's alleged arrest...</p>"
  },
  {
    id: 3,
    title: "New Research: Drinking Eight Glasses of Water Daily May Not Be Suitable for Everyone",
    summary: "Traditional wisdom suggests drinking eight glasses of water daily, but recent medical research indicates that water intake should be flexibly adjusted based on individual constitution and activity level...",
    source: "Health Times",
    trustLevel: "high",
    trustScore: 88,
    date: "2024-03-14",
    category: "Health",
    imageUrl: "https://picsum.photos/seed/news-health-1/600/400",
    content: "<p>For decades, the '8x8 rule' has been widely accepted...</p>"
  },
  {
    id: 4,
    title: "Major Brand to Launch Revolutionary Charging Technology",
    summary: "According to sources, a tech giant is developing a new technology that will increase charging speed by 10 times...",
    source: "Tech Frontier",
    trustLevel: "medium",
    trustScore: 65,
    date: "2024-03-13",
    category: "Technology",
    imageUrl: "https://picsum.photos/seed/news-tech-1/600/400",
    content: "<p>Industry insiders have revealed that a leading technology company...</p>"
  },
  {
    id: 5,
    title: "Environmental Organization Releases Annual Ocean Pollution Report",
    summary: "The latest report from international environmental organizations shows that the problem of marine plastic pollution remains serious and requires global joint efforts...",
    source: "Environmental Watch",
    trustLevel: "high",
    trustScore: 92,
    date: "2024-03-13",
    category: "Environment",
    imageUrl: "https://picsum.photos/seed/news-env-1/600/400",
    content: "<p>The Ocean Conservation Alliance has published its 2024 report on marine pollution...</p>"
  },
  {
    id: 6,
    title: "Experts Predict Significant House Price Decline This Year",
    summary: "Some real estate experts predict that due to policy adjustments, housing prices nationwide will decline by 10%-15% this year...",
    source: "Financial Analysis",
    trustLevel: "medium",
    trustScore: 60,
    date: "2024-03-12",
    category: "Finance",
    imageUrl: "https://picsum.photos/seed/news-finance-1/600/400",
    content: "<p>A panel of real estate economists has released a forecast predicting a notable correction...</p>"
  },
  {
    id: 7,
    title: "Government Announces New Economic Stimulus Package",
    summary: "In response to recent economic challenges, the government has unveiled a comprehensive stimulus package aimed at boosting growth and creating jobs...",
    source: "Economic Daily",
    trustLevel: "high",
    trustScore: 90,
    date: "2024-03-12",
    category: "Economy",
    imageUrl: "https://picsum.photos/seed/news-economy-1/600/400",
    content: "<p>The new package includes tax reductions and financial incentives...</p>"
  },
  {
    id: 8,
    title: "Breakthrough in Renewable Energy Storage Technology",
    summary: "Scientists have developed a new battery technology that could significantly improve the efficiency and affordability of renewable energy storage...",
    source: "Science Today",
    trustLevel: "high",
    trustScore: 93,
    date: "2024-03-11",
    category: "Technology",
    imageUrl: "https://picsum.photos/seed/news-energy-1/600/400",
    content: "<p>Scientists at the National Energy Institute announced a major breakthrough...</p>"
  },
  {
    id: 9,
    title: "Rising Urban Inequality: Experts Call for Stronger Social Safety Nets",
    summary: "Sociologists warn about the growing income gap in major cities and urge new welfare reforms to protect vulnerable populations.",
    source: "The China Observer",
    trustLevel: "medium",
    trustScore: 85,
    date: "2024-05-02",
    category: "Society",
    imageUrl: "https://picsum.photos/seed/news-society-1/600/400",
    content: "<p>Recent data shows that urban income inequality continues to widen...</p>"
  },
  {
    id: 10,
    title: "China’s Green Future: Nationwide Tree Planting Campaign Launched",
    summary: "A new national campaign aims to plant 10 billion trees by 2030 to combat desertification and help achieve carbon neutrality goals.",
    source: "Global Environmental Times",
    trustLevel: "high",
    trustScore: 97,
    date: "2024-06-18",
    category: "Environment",
    imageUrl: "https://picsum.photos/seed/news-green-1/600/400",
    content: "<p>The Ministry of Ecology launched the ‘Green Future 2030’ campaign...</p>"
  },
  {
    id: 11,
    title: "Pop Idol’s Surprise Charity Concert Raises Millions for Disaster Relief",
    summary: "Pop star Li Xuan held a surprise charity concert in Shanghai, raising over 10 million yuan for earthquake victims.",
    source: "Entertainment Weekly CN",
    trustLevel: "medium",
    trustScore: 88,
    date: "2024-07-21",
    category: "Entertainment",
    imageUrl: "https://picsum.photos/seed/news-entertainment-2/600/400",
    content: "<p>Fans were amazed as Li Xuan appeared for an unannounced charity concert...</p>"
  },
  {
    id: 12,
    title: "Government Unveils Plan for Digital Governance Reform",
    summary: "A new digital governance initiative aims to improve transparency, streamline public services, and enhance citizen participation through advanced technology.",
    source: "Xinhua News Agency",
    trustLevel: "high",
    trustScore: 93,
    date: "2024-09-10",
    category: "Politics",
    imageUrl: "https://picsum.photos/seed/politics1/600/400",
    content: `
    <p>The State Council announced the launch of a nationwide digital governance reform plan aimed at modernizing public administration. 
    The plan includes building unified data platforms, introducing AI-assisted decision-making tools, and promoting open-data systems.</p>
    <p>According to official statements, the initiative is designed to reduce bureaucratic inefficiency, increase public service accessibility, 
    and allow citizens to monitor government activities in real time through transparent dashboards.</p>
    <p>Experts believe this reform could make China a global leader in smart governance and public data infrastructure.</p>
  `
  },
  {
    id: 13,
    title: "Local Elections Highlight Push for Grassroots Participation",
    summary: "Recent local elections across multiple provinces have seen a record-high voter turnout, signaling growing public engagement in local governance.",
    source: "People's Daily",
    trustLevel: "high",
    trustScore: 91,
    date: "2024-10-03",
    category: "Politics",
    imageUrl: "https://picsum.photos/seed/politics2/600/400",
    content: `
    <p>Across several provinces, local elections concluded with voter participation exceeding 85%, a significant increase compared to previous years. 
    Analysts attribute this rise to new civic education campaigns and expanded digital voting tools.</p>
    <p>Officials report that the new system allows residents to track election results instantly and provides a platform for candidates to share policy proposals transparently.</p>
    <p>‘The enthusiasm of the public demonstrates the vitality of grassroots democracy and the effectiveness of modernization efforts in local governance,’ said Professor Liu Ming of the National Political Academy.</p>
  `
  }
];

export default mockNewsData;


// Mock 评论数据
const mockComments = {
  1: [
    {
      id: 1,
      userId: 101,
      username: "John Smith",
      content: "Great article! These tips are really helpful for identifying fake news in today's media landscape.",
      rating: "true",
      likes: 24,
      dislikes: 2,
      createdAt: "2024-03-15T10:30:00Z"
    },
    {
      id: 2,
      userId: 102,
      username: "Emily Johnson",
      content: "I think we should also teach these skills to children at an early age to help them become more media literate.",
      rating: "true",
      likes: 18,
      dislikes: 0,
      createdAt: "2024-03-15T11:45:00Z"
    }
  ],
  2: [
    {
      id: 3,
      userId: 103,
      username: "Michael Brown",
      content: "It's so sad how quickly rumors spread online without any verification. People should be more responsible.",
      rating: "false",
      likes: 56,
      dislikes: 12,
      createdAt: "2024-03-14T14:20:00Z"
    }
  ],
  3: [
    {
      id: 4,
      userId: 104,
      username: "Sarah Williams",
      content: "As a fitness trainer, I've always advised my clients to drink according to their thirst rather than following arbitrary rules.",
      rating: "true",
      likes: 32,
      dislikes: 1,
      createdAt: "2024-03-14T09:15:00Z"
    }
  ]
};

// Mock 投票数据
const mockVoteData = {
  1: { trustworthy: 456, notTrustworthy: 23, notSure: 18 },
  2: { trustworthy: 42, notTrustworthy: 312, notSure: 56 },
  3: { trustworthy: 389, notTrustworthy: 17, notSure: 24 },
  4: { trustworthy: 124, notTrustworthy: 56, notSure: 89 },
  5: { trustworthy: 412, notTrustworthy: 23, notSure: 15 },
  6: { trustworthy: 89, notTrustworthy: 123, notSure: 78 }
};

// 简单路由系统
class Router {
  constructor() {
    this.routes = [];
    this.currentRoute = null;
  }

  // 注册路由
  addRoute(path, callback) {
    this.routes.push({ path, callback });
  }

  // 匹配路由
  matchRoute(path) {
    for (const route of this.routes) {
      // 支持简单的路由参数
      const pathPattern = route.path.replace(/:\w+/g, '(\\w+)');
      const regex = new RegExp(`^${pathPattern}$`);
      const match = path.match(regex);
      
      if (match) {
        // 提取路由参数
        const params = {};
        const paramNames = route.path.match(/:\w+/g) || [];
        
        paramNames.forEach((paramName, index) => {
          const name = paramName.substring(1); // 移除冒号
          params[name] = match[index + 1];
        });
        
        return { callback: route.callback, params };
      }
    }
    
    // 如果没有匹配的路由，返回默认路由
    return { callback: this.defaultCallback, params: {} };
  }

  // 设置默认路由
  setDefault(callback) {
    this.defaultCallback = callback;
  }

  // 导航到路由
  async navigate(path) {
    const { callback, params } = this.matchRoute(path);
    this.currentRoute = path;
    
    // 更新URL，但不刷新页面
    history.pushState({ path }, '', '#');
    
    // 执行回调，支持异步回调函数
    await callback(params);
  }

  // 初始化路由系统
  async init() {
    // 监听popstate事件
    window.addEventListener('popstate', async (e) => {
      const path = e.state?.path || '';
      const { callback, params } = this.matchRoute(path);
      this.currentRoute = path;
      await callback(params);
    });
    
    // 初始化时加载当前路由
    const hash = window.location.hash.slice(1) || '';
    const { callback, params } = this.matchRoute(hash);
    this.currentRoute = hash;
    await callback(params);
  }
}

// 创建路由实例
const router = new Router();

// 渲染首页
async function handleHomePage() {
  const app = document.querySelector('#app');
  
  try {
    // 显示加载状态
    app.innerHTML = '<div class="loading">Loading news...</div>';
    
    // 从API获取新闻数据
     const backendOnline = await isBackendAvailable();
let newsData = [];

if (backendOnline) {
  console.log("✅ Backend online, fetching real data...");
  const response = await apiService.news.getNews();
  newsData = response?.data || [];
} else {
  console.warn("⚠️ Backend not reachable, using mock data instead.");
  newsData = mockNewsData;
}
app.innerHTML = renderHomePage(newsData);

    
    initHomePage({
      onCategoryChange: (category, categoryLower) => {
        if (categoryLower === 'all') {
          router.navigate('');
        } else {
          router.navigate(`/category/${categoryLower}`);
        }
      },
      onNewsClick: (newsId) => {
        router.navigate(`/news/${newsId}`);
      },
      onLoadMore: async () => {
        try {
          // 从API加载更多数据（这里假设API支持分页）
          const currentPage = 2; // 简化处理，实际应从当前状态获取
          const moreResponse = await apiService.news.getNews({ page: currentPage });
          const moreNews = moreResponse.data || [];
          
          const newsGrid = document.getElementById('news-grid');
          
          moreNews.forEach(news => {
            const newsCard = document.createElement('div');
            newsCard.innerHTML = `
              <article class="news-card" data-news-id="${news.id || Math.random()}">
                <div class="news-image">
                  <img src="${news.imageUrl || 'https://picsum.photos/seed/news-default/600/400'}" alt="${news.title}">
                </div>
                <div class="news-content">
                  <div class="news-meta">
                    <span class="news-source">${news.source || 'Unknown Source'}</span>
                    <span class="news-date">${news.date || new Date().toISOString().split('T')[0]}</span>
                    <span class="news-category tag-badge">${news.category || 'General'}</span>
                  </div>
                  <h3 class="news-title">${news.title}</h3>
                  <p class="news-summary">${news.summary}</p>
                  <div class="trust-badge" style="--trust-color: var(--trust-${news.trustLevel || 'medium'});">
                    <div class="trust-bar">
                      <div class="trust-progress" style="width: ${news.trustScore || 50}%">
</div>
                    </div>
                    <div class="trust-info">
                      <span class="trust-score">${news.trustScore || 50}%</span>
                      <span class="trust-label">${news.trustLevel === 'high' ? 'Highly Trustworthy' : news.trustLevel === 'low' ? 'Not Trustworthy' : 'Neutral'}</span>
                    </div>
                  </div>
                  <button class="news-read-more">Read More</button>
                </div>
              </article>
            `;
            newsGrid.appendChild(newsCard.firstElementChild);
          });
          
          return true;
        } catch (error) {
          console.error('Failed to load more news:', error);
          alert('Failed to load more news. Please try again.');
          return false;
        }
      }
    });
  } catch (error) {
      console.error('Failed to load news from API:', error);
      console.log('Using mock data instead...');
      // 使用备用的mock数据
 

      app.innerHTML = renderHomePage(mockNewsData);
      
      // 重新初始化页面事件处理
      initHomePage({
        onCategoryChange: (category, categoryLower) => {
          if (categoryLower === 'all') {
            router.navigate('');
          } else {
            router.navigate(`/category/${categoryLower}`);
          }
        },
        onNewsClick: (newsId) => {
          router.navigate(`/news/${newsId}`);
        },
        onLoadMore: async () => {
          console.log('No more mock data available');
          alert('No more news available at this time.');
          return false;
        }
      });
    }
  }

// 渲染分类页面
async function handleCategoryPage(params) {
  const { category } = params;
  const normalizedCategory = category.charAt(0).toUpperCase() + category.slice(1);
  
  const app = document.querySelector('#app');
  
  try {
    // 显示加载状态
    app.innerHTML = `<div class="loading">Loading ${normalizedCategory} news...</div>`;
    
    // 从API获取分类新闻
    const params = category.toLowerCase() === 'all' ? {} : { category: category.toLowerCase() };
    const response = await apiService.news.getNews(params);
    const filteredNews = response.data || [];
    
    // 渲染页面
    app.innerHTML = renderCategoryPage(normalizedCategory, filteredNews);
    
    initCategoryPage({
      onCategoryChange: (newCategory, newCategoryLower) => {
        if (newCategoryLower === 'all') {
          router.navigate('');
        } else {
          router.navigate(`/category/${newCategoryLower}`);
        }
      },
      onNewsClick: (newsId) => {
        router.navigate(`/news/${newsId}`);
      },
      onLoadMore: async () => {
        try {
          // 从API加载更多分类数据
          const currentPage = 2;
          const moreParams = { 
            page: currentPage,
            ...(category.toLowerCase() === 'all' ? {} : { category: category.toLowerCase() })
          };
          const moreResponse = await apiService.news.getNews(moreParams);
          const moreNews = moreResponse.data || [];
          
          const newsGrid = document.getElementById('category-news-grid');
          
          moreNews.forEach(news => {
            const newsCard = document.createElement('div');
            newsCard.innerHTML = `
              <article class="news-card" data-news-id="${news.id || Math.random()}">
                <div class="news-image">
                  <img src="${news.imageUrl || 'https://picsum.photos/seed/news-default/600/400'}" alt="${news.title}">
                </div>
                <div class="news-content">
                  <div class="news-meta">
                    <span class="news-source">${news.source || 'Unknown Source'}</span>
                    <span class="news-date">${news.date || new Date().toISOString().split('T')[0]}</span>
                    <span class="news-category tag-badge">${news.category || 'General'}</span>
                  </div>
                  <h3 class="news-title">${news.title}</h3>
                  <p class="news-summary">${news.summary}</p>
                  <div class="trust-badge" style="--trust-color: var(--trust-${news.trustLevel || 'medium'});">
                    <div class="trust-bar">
                      <div class="trust-progress" style="width: ${news.trustScore || 50}%">
</div>
                    </div>
                    <div class="trust-info">
                      <span class="trust-score">${news.trustScore || 50}%</span>
                      <span class="trust-label">${news.trustLevel === 'high' ? 'Highly Trustworthy' : news.trustLevel === 'low' ? 'Not Trustworthy' : 'Neutral'}</span>
                    </div>
                  </div>
                  <button class="news-read-more">Read More</button>
                </div>
              </article>
            `;
            newsGrid.appendChild(newsCard.firstElementChild);
          });
          
          return true;
        } catch (error) {
          console.error('Failed to load more news:', error);
          alert('Failed to load more news. Please try again.');
          return false;
        }
      }
    });
  } catch (error) {
    console.error(`Failed to load ${normalizedCategory} news from API:`, error);
    console.log('Using filtered mock data instead...');
    // 使用过滤后的mock数据
    let filteredNews = mockNewsData;
    if (category.toLowerCase() !== 'all') {
      filteredNews = mockNewsData.filter(news => 
        news.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    // 渲染页面
    app.innerHTML = renderCategoryPage(normalizedCategory, filteredNews);
    
    // 重新初始化页面事件处理
    initCategoryPage({
      onCategoryChange: (newCategory, newCategoryLower) => {
        if (newCategoryLower === 'all') {
          router.navigate('');
        } else {
          router.navigate(`/category/${newCategoryLower}`);
        }
      },
      onNewsClick: (newsId) => {
        router.navigate(`/news/${newsId}`);
      },
      onLoadMore: async () => {
        console.log('No more mock data available');
        alert('No more news available at this time.');
        return false;
      }
    });
  }
  }

// 渲染新闻详情页
async function handleNewsDetailPage(params) {
  const { id } = params;
  const app = document.querySelector('#app');
  
  try {
    // 显示加载状态
    app.innerHTML = '<div class="loading">加载新闻详情...</div>';
    
    // 并行获取新闻详情和评论
    const [newsResponse, commentsResponse] = await Promise.all([
      apiService.news.getNewsById(id),
      apiService.news.getComments(id)
    ]);
    
    const newsDetail = newsResponse.data || {};
    const comments = commentsResponse.data || [];
    // 从新闻数据中提取投票信息，如果没有则使用默认值
    const voteData = newsDetail.votes || { trustworthy: 0, notTrustworthy: 0, notSure: 0 };
    
    // 计算信任度百分比
    const totalVotes = voteData.trustworthy + voteData.notTrustworthy + voteData.notSure;
    const trustPercentage = totalVotes > 0 ? Math.round((voteData.trustworthy / totalVotes) * 100) : 0;
    
    // 渲染页面
    app.innerHTML = renderNewsDetailPage(newsDetail, comments, voteData, trustPercentage);
    
    initNewsDetailPage({
      onBack: () => {
        history.back();
      },
      onVote: async (voteType) => {
        try {
          await apiService.news.voteNews(id, voteType);
          // 投票成功后刷新页面或更新UI
          alert('投票提交成功！');
          // 重新加载页面以显示最新投票结果
          handleNewsDetailPage(params);
        } catch (error) {
          console.error('Vote failed:', error);
          alert('提交投票失败，请重试。');
        }
      },
      onCommentSubmit: async (commentData) => {
        try {
          // 包含rating信息的评论提交
          await apiService.news.addComment(id, commentData.content, commentData.rating);
          alert('评论提交成功！');
          // 重新加载页面以显示最新评论
          handleNewsDetailPage(params);
        } catch (error) {
          console.error('Comment submission failed:', error);
          alert('提交评论失败，请重试。');
        }
      },
      onCommentLike: async (commentId) => {
        try {
          await apiService.comment.likeComment(commentId);
          // 点赞成功后刷新评论区域
          handleNewsDetailPage(params);
        } catch (error) {
          console.error('Comment like failed:', error);
          alert('点赞失败，请重试。');
        }
      },
      onCommentDislike: async (commentId) => {
        try {
          await apiService.comment.dislikeComment(commentId);
          // 点踩成功后刷新评论区域
          handleNewsDetailPage(params);
        } catch (error) {
          console.error('Comment dislike failed:', error);
          alert('点踩失败，请重试。');
        }
      },
      onCommentSort: (sortType) => {
        console.log(`Sort comments by ${sortType}`);
        // 排序逻辑可以在这里实现
        // 由于我们使用的是mock数据，可以简单地重新加载页面
        // 在实际应用中，可以在客户端排序评论列表
        handleNewsDetailPage(params);
      }
    });
  } catch (error) {
    console.error('Failed to load news details from API:', error);
    console.log('Using mock data instead...');
    
    // 使用mock数据
    const newsDetail = mockNewsData.find(news => news.id === parseInt(id)) || mockNewsData[0];
    const comments = mockComments[id] || mockComments['1'] || [];
    const voteData = mockVoteData[id] || mockVoteData['1'] || { trustworthy: 0, notTrustworthy: 0, notSure: 0 };
    
    // 计算信任度百分比
    const totalVotes = voteData.trustworthy + voteData.notTrustworthy + voteData.notSure;
    const trustPercentage = totalVotes > 0 ? Math.round((voteData.trustworthy / totalVotes) * 100) : 0;
    
    // 渲染页面
    app.innerHTML = renderNewsDetailPage(newsDetail, comments, voteData, trustPercentage);
    
    // 重新初始化页面事件处理
    initNewsDetailPage({
      onBack: () => {
        history.back();
      },
      onVote: (voteType) => {
        console.log(`Vote ${voteType} for news ${id} (mock mode)`);
        alert('感谢您的反馈！');
      },
      onCommentSubmit: (commentData) => {
        console.log(`Add comment to news ${id}: ${commentData.content}, rating: ${commentData.rating} (mock mode)`);
        alert('评论添加成功！');
      },
      onCommentLike: (commentId) => {
        console.log(`Like comment ${commentId} (mock mode)`);
        alert('评论已点赞！');
      },
      onCommentDislike: (commentId) => {
        console.log(`Dislike comment ${commentId} (mock mode)`);
        alert('评论已点踩！');
      },
      onCommentSort: (sortType) => {
        console.log(`Sort comments by ${sortType} (mock mode)`);
        // 在mock模式下，可以简单地按照不同排序重新排列评论
        let sortedComments = [...comments];
        if (sortType === 'hottest') {
          // 按照点赞数排序
          sortedComments.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        } else {
          // 按照最新排序（默认）
          sortedComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        
        // 更新评论区显示
        const commentsList = document.querySelector('.comments-list');
        commentsList.innerHTML = sortedComments.map(comment => {
          return `
            <div class="comment-card" data-comment-id="${comment.id}">
              <div class="comment-header">
                <img src="https://picsum.photos/seed/${comment.userId}/40/40" alt="${comment.username}" class="comment-avatar">
                <div class="comment-meta">
                  <div class="comment-user-info">
                    <h4 class="comment-username">${comment.username}</h4>
                    <span class="comment-rating-badge ${comment.rating === 'true' ? 'trustworthy' : 'not-trustworthy'}">
                      ${comment.rating === 'true' ? '✅' : '❌'} 标记为${comment.rating === 'true' ? '可信' : '不可信'}
                    </span>
                  </div>
                  <p class="comment-time">${new Date(comment.createdAt).toLocaleString('zh-CN')}</p>
                </div>
              </div>
              <div class="comment-content">
                <p>${comment.content}</p>
              </div>
              <div class="comment-actions">
                <button class="comment-action-btn like-btn">
                  <span class="action-icon">🔥</span>
                  <span class="action-count">${comment.likes || 0}</span>
                </button>
                <button class="comment-action-btn dislike-btn">
                  <span class="action-icon">👎</span>
                  <span class="action-count">${comment.dislikes || 0}</span>
                </button>
              </div>
            </div>
          `;
        }).join('');
      }
    });
  }
  }

  // 设置路由
  router.addRoute('', handleHomePage);
  router.addRoute('/category/:category', handleCategoryPage);
  router.addRoute('/news/:id', handleNewsDetailPage);
router.setDefault(handleHomePage);

// 添加加载和错误状态的样式
const style = document.createElement('style');
style.textContent = `
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
  font-size: 1.2rem;
  color: #555;
  font-weight: 500;
}

.error {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
  font-size: 1.2rem;
  color: #e53935;
  font-weight: 500;
  padding: 2rem;
  text-align: center;
}
`;
document.head.appendChild(style);

// 启动应用
async function initApp() {
  try {
    // 初始化路由系统
    await router.init();
    
    // 监听所有<a>标签点击，拦截并使用路由系统
    document.addEventListener('click', async (e) => {
      if (e.target.tagName === 'A' && e.target.getAttribute('href') && !e.target.getAttribute('target')) {
        e.preventDefault();
        const href = e.target.getAttribute('href');
        
        if (href === '#') {
          await router.navigate('');
        } else if (href.startsWith('#')) {
          // 处理锚点链接
          const targetId = href.substring(1);
          const targetElement = document.getElementById(targetId);
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    });
  } catch (error) {
    console.error('App initialization error:', error);
    const app = document.querySelector('#app');
    app.innerHTML = '<div class="error">Failed to initialize the application. Please refresh the page.</div>';
  }
}

// 当DOM加载完成后启动应用
document.addEventListener('DOMContentLoaded', initApp);
