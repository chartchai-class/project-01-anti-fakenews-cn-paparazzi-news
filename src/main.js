import './style.css';
// 导入页面组件
import { renderHomePage, initHomePage } from './pages/HomePage.js';
import { renderCategoryPage, initCategoryPage } from './pages/CategoryPage.js';
import { renderNewsDetailPage, initNewsDetailPage } from './pages/NewsDetailPage.js';

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
    imageUrl: "https://picsum.photos/seed/news1/600/400",
    content: "<p>In today's digital age, we are constantly bombarded with information from various sources. This information overload makes it increasingly difficult to distinguish between reliable news and misleading rumors.</p><p>Communication experts suggest several key strategies to identify fake news:</p><ol><li>Check the source of the information</li><li>Look for corroboration from multiple trusted sources</li><li>Examine the evidence presented</li><li>Be skeptical of sensational headlines</li><li>Consider the author's credentials</li></ol><p>By applying these critical thinking skills, readers can better navigate the complex information landscape and make more informed decisions.</p>"
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
    imageUrl: "https://picsum.photos/seed/news2/600/400",
    content: "<p>Social media platforms have been abuzz with rumors about a popular celebrity's alleged arrest. Despite the lack of official confirmation, these rumors have spread rapidly, causing significant controversy.</p><p>Experts warn that such unsubstantiated claims can have serious consequences for individuals' reputations and mental health. They emphasize the importance of verifying information before sharing it online.</p>"
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
    imageUrl: "https://picsum.photos/seed/news3/600/400",
    content: "<p>For decades, the '8x8 rule' (eight 8-ounce glasses of water per day) has been widely accepted as a health guideline. However, recent scientific studies suggest that this one-size-fits-all approach may not be optimal for everyone.</p><p>Dr. Sarah Johnson, lead researcher at the National Institute of Nutrition, explains: 'Water requirements vary significantly based on factors such as body weight, activity level, climate, and overall health. What's most important is to listen to your body's thirst signals.'</p><p>The study recommends that healthy adults generally consume between 2-3 liters of water daily, but this should be adjusted based on individual circumstances.</p>"
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
    imageUrl: "https://picsum.photos/seed/news4/600/400",
    content: "<p>Industry insiders have revealed that a leading technology company is on the verge of unveiling a breakthrough in battery charging technology. The new system reportedly allows devices to reach full charge in just minutes rather than hours.</p><p>While the company has not officially confirmed these reports, early prototypes suggest potential applications for smartphones, electric vehicles, and other battery-powered devices.</p><p>However, some experts have raised questions about the long-term impact on battery lifespan and safety considerations.</p>"
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
    imageUrl: "https://picsum.photos/seed/news5/600/400",
    content: "<p>The Ocean Conservation Alliance has published its 2024 report on marine pollution, painting a concerning picture of the world's oceans. Despite increased public awareness and policy initiatives, plastic pollution levels continue to rise at an alarming rate.</p><p>The report estimates that over 11 million metric tons of plastic waste enter the oceans each year. This pollution not only threatens marine life but also has implications for human health as microplastics enter the food chain.</p><p>The organization is calling for stronger international regulations, improved waste management infrastructure, and increased investment in sustainable alternatives to single-use plastics.</p>"
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
    imageUrl: "https://picsum.photos/seed/news6/600/400",
    content: "<p>A panel of real estate economists has released a forecast predicting a notable correction in housing markets across the country. Factors cited include rising interest rates, stricter lending standards, and increased housing supply.</p><p>While some markets may experience more significant declines than others, the consensus suggests a national average decrease of 10-15% in home values over the coming year.</p><p>Prospective homebuyers are advised to exercise caution and conduct thorough research before making major financial decisions in this uncertain market.</p>"
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
    imageUrl: "https://picsum.photos/seed/news7/600/400"
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
    imageUrl: "https://picsum.photos/seed/news8/600/400"
  }
];

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
  navigate(path) {
    const { callback, params } = this.matchRoute(path);
    this.currentRoute = path;
    
    // 更新URL，但不刷新页面
    history.pushState({ path }, '', '#');
    
    // 执行回调
    callback(params);
  }

  // 初始化路由系统
  init() {
    // 监听popstate事件
    window.addEventListener('popstate', (e) => {
      const path = e.state?.path || '';
      const { callback, params } = this.matchRoute(path);
      this.currentRoute = path;
      callback(params);
    });
    
    // 初始化时加载当前路由
    const hash = window.location.hash.slice(1) || '';
    const { callback, params } = this.matchRoute(hash);
    this.currentRoute = hash;
    callback(params);
  }
}

// 创建路由实例
const router = new Router();

// 渲染首页
function handleHomePage() {
  const app = document.querySelector('#app');
  app.innerHTML = renderHomePage(mockNewsData);
  
  initHomePage({
    onCategoryChange: (category, categoryLower) => {
      if (categoryLower === 'all') {
        router.navigate('');
      } else {
        router.navigate(`/news/${categoryLower}`);
      }
    },
    onNewsClick: (newsId) => {
      router.navigate(`/news/${newsId}`);
    },
    onLoadMore: async () => {
      // 模拟加载更多数据
      return new Promise(resolve => {
        setTimeout(() => {
          const newsGrid = document.getElementById('news-grid');
          // 复制现有新闻并修改ID来模拟新数据
          const newNews = mockNewsData.slice(0, 2).map((item, index) => ({
            ...item,
            id: item.id + 100 + index,
            title: `${item.title} (More)`
          }));
          
          newNews.forEach(news => {
            const newsCard = document.createElement('div');
            newsCard.innerHTML = `
              <article class="news-card" data-news-id="${news.id}">
                <div class="news-image">
                  <img src="${news.imageUrl}" alt="${news.title}">
                </div>
                <div class="news-content">
                  <div class="news-meta">
                    <span class="news-source">${news.source}</span>
                    <span class="news-date">${news.date}</span>
                    <span class="news-category tag-badge">${news.category}</span>
                  </div>
                  <h3 class="news-title">${news.title}</h3>
                  <p class="news-summary">${news.summary}</p>
                  <div class="trust-badge" style="--trust-color: var(--trust-high);">
                    <div class="trust-bar">
                      <div class="trust-progress" style="width: ${news.trustScore}%"></div>
                    </div>
                    <div class="trust-info">
                      <span class="trust-score">${news.trustScore}%</span>
                      <span class="trust-label">Highly Trustworthy</span>
                    </div>
                  </div>
                  <button class="news-read-more">Read More</button>
                </div>
              </article>
            `;
            newsGrid.appendChild(newsCard.firstElementChild);
          });
          resolve();
        }, 1000);
      });
    }
  });
}

// 渲染分类页面
function handleCategoryPage(params) {
  const { category } = params;
  const normalizedCategory = category.charAt(0).toUpperCase() + category.slice(1);
  
  // 过滤新闻数据
  const filteredNews = mockNewsData.filter(
    news => news.category.toLowerCase() === category.toLowerCase() || category.toLowerCase() === 'all'
  );
  
  const app = document.querySelector('#app');
  app.innerHTML = renderCategoryPage(normalizedCategory, filteredNews);
  
  initCategoryPage({
    onCategoryChange: (newCategory, newCategoryLower) => {
      if (newCategoryLower === 'all') {
        router.navigate('');
      } else {
        router.navigate(`/news/${newCategoryLower}`);
      }
    },
    onNewsClick: (newsId) => {
      router.navigate(`/news/${newsId}`);
    },
    onLoadMore: async () => {
      // 模拟加载更多数据
      return new Promise(resolve => {
        setTimeout(() => {
          const newsGrid = document.getElementById('category-news-grid');
          // 复制现有新闻并修改ID来模拟新数据
          const newNews = filteredNews.slice(0, 2).map((item, index) => ({
            ...item,
            id: item.id + 200 + index,
            title: `${item.title} (More)`
          }));
          
          newNews.forEach(news => {
            const newsCard = document.createElement('div');
            newsCard.innerHTML = `
              <article class="news-card" data-news-id="${news.id}">
                <div class="news-image">
                  <img src="${news.imageUrl}" alt="${news.title}">
                </div>
                <div class="news-content">
                  <div class="news-meta">
                    <span class="news-source">${news.source}</span>
                    <span class="news-date">${news.date}</span>
                    <span class="news-category tag-badge">${news.category}</span>
                  </div>
                  <h3 class="news-title">${news.title}</h3>
                  <p class="news-summary">${news.summary}</p>
                  <div class="trust-badge" style="--trust-color: var(--trust-high);">
                    <div class="trust-bar">
                      <div class="trust-progress" style="width: ${news.trustScore}%"></div>
                    </div>
                    <div class="trust-info">
                      <span class="trust-score">${news.trustScore}%</span>
                      <span class="trust-label">Highly Trustworthy</span>
                    </div>
                  </div>
                  <button class="news-read-more">Read More</button>
                </div>
              </article>
            `;
            newsGrid.appendChild(newsCard.firstElementChild);
          });
          resolve();
        }, 1000);
      });
    }
  });
}

// 渲染新闻详情页
function handleNewsDetailPage(params) {
  const { id } = params;
  const newsDetail = mockNewsData.find(news => news.id === parseInt(id));
  const comments = mockComments[id] || [];
  const voteData = mockVoteData[id] || { trustworthy: 0, notTrustworthy: 0, notSure: 0 };
  
  const app = document.querySelector('#app');
  app.innerHTML = renderNewsDetailPage(newsDetail, comments, voteData);
  
  initNewsDetailPage({
    onBack: () => {
      history.back();
    },
    onVote: (voteType) => {
      console.log(`User voted: ${voteType} for news ${id}`);
      // 在实际应用中，这里应该发送API请求
    },
    onCommentSubmit: (commentData) => {
      console.log('New comment submitted:', commentData);
      // 在实际应用中，这里应该发送API请求
      alert('Comment submitted successfully!');
    },
    onCommentLike: (commentId) => {
      console.log(`Comment ${commentId} liked`);
      // 在实际应用中，这里应该发送API请求
    },
    onCommentDislike: (commentId) => {
      console.log(`Comment ${commentId} disliked`);
      // 在实际应用中，这里应该发送API请求
    },
    onCommentReply: (commentId) => {
      console.log(`Reply to comment ${commentId}`);
      alert(`Reply to comment ${commentId}`);
    },
    onLoadMoreComments: async () => {
      // 模拟加载更多评论
      console.log('Loading more comments...');
      alert('Loading more comments...');
    }
  });
}

// 设置路由
router.addRoute('', handleHomePage);
router.addRoute('/news/:category', handleCategoryPage);
router.addRoute('/news/:id', handleNewsDetailPage);
router.setDefault(handleHomePage);

// 启动应用
function initApp() {
  // 初始化路由系统
  router.init();
  
  // 监听所有<a>标签点击，拦截并使用路由系统
  document.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && e.target.getAttribute('href') && !e.target.getAttribute('target')) {
      e.preventDefault();
      const href = e.target.getAttribute('href');
      
      if (href === '#') {
        router.navigate('');
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
}

// 当DOM加载完成后启动应用
document.addEventListener('DOMContentLoaded', initApp);
