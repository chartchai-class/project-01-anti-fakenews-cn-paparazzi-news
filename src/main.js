import './style.css';

// Mock news data
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
    imageUrl: "https://picsum.photos/seed/news1/600/400"
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
    imageUrl: "https://picsum.photos/seed/news2/600/400"
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
    imageUrl: "https://picsum.photos/seed/news3/600/400"
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
    imageUrl: "https://picsum.photos/seed/news4/600/400"
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
    imageUrl: "https://picsum.photos/seed/news5/600/400"
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
    imageUrl: "https://picsum.photos/seed/news6/600/400"
  }
];

// Render trust badge
function renderTrustBadge(trustLevel, trustScore) {
  const colors = {
    high: 'var(--trust-high)',
    medium: 'var(--trust-medium)',
    low: 'var(--trust-low)'
  };
  
  const labels = {
    high: 'Highly Trustworthy',
    medium: 'Questionable',
    low: 'Not Trustworthy'
  };
  
  const color = colors[trustLevel];
  const label = labels[trustLevel];
  
  return `
    <div class="trust-badge" style="--trust-color: ${color}">
      <div class="trust-bar">
        <div class="trust-progress" style="width: ${trustScore}%"></div>
      </div>
      <div class="trust-info">
        <span class="trust-score">${trustScore}%</span>
        <span class="trust-label">${label}</span>
      </div>
    </div>
  `;
}

// Render news card
function renderNewsCard(news) {
  return `
    <article class="news-card">
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
        ${renderTrustBadge(news.trustLevel, news.trustScore)}
        <button class="news-read-more">Read More</button>
      </div>
    </article>
  `;
}

// Render home page
function renderHomePage() {
  const newsCards = mockNewsData.map(renderNewsCard).join('');
  
  return `
    <header class="header" id="header">
      <div class="header-container">
        <div class="header-logo">
          <h1><span class="truth-icon">⚡</span>Truth Moment</h1>
        </div>
        <div class="header-search">
          <input type="text" placeholder="Search news, topics or sources..." class="search-input">
          <button class="search-button">Search</button>
        </div>
        <nav class="header-nav">
          <ul class="nav-list">
            <li><a href="#" class="nav-item active">Home</a></li>
            <li><a href="#trust-index" class="nav-item">Trust Index</a></li>
            <li><a href="#education" class="nav-item">Media Literacy</a></li>
            <li><a href="#about" class="nav-item">About Us</a></li>
          </ul>
          <button class="mobile-menu-button">Menu</button>
        </nav>
      </div>
    </header>
    
    <main class="main-content">
      <section class="hero-section">
        <div class="hero-container">
          <div class="hero-content">
            <h2 class="hero-title">Truth Doesn't Wait, Discernment at Your Fingertips</h2>
            <p class="hero-description">We are committed to providing rigorously screened authentic news, helping you distinguish truth from falsehood in the ocean of information and protecting information security.</p>
            <div class="hero-actions">
              <button class="btn btn-primary">Start Exploring</button>
              <button class="btn btn-secondary">Learn More</button>
            </div>
          </div>
        </div>
      </section>
      
      <section class="news-section">
        <div class="section-container">
          <div class="section-header">
            <h2>Today's Trending News</h2>
            <div class="category-filters">
              <button class="tag-badge active">All</button>
              <button class="tag-badge">Politics</button>
              <button class="tag-badge">Economy</button>
              <button class="tag-badge">Technology</button>
              <button class="tag-badge">Society</button>
              <button class="tag-badge">Entertainment</button>
            </div>
          </div>
          <div class="news-grid">
            ${newsCards}
          </div>
          <div class="load-more">
            <button class="btn btn-outline">Load More</button>
          </div>
        </div>
      </section>
    </main>
    
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-about">
          <h3><span class="truth-icon">⚡</span>Truth Moment</h3>
          <p>Committed to creating a truthful and reliable news aggregation platform, helping users identify fake news and enhance media literacy.</p>
        </div>
        <div class="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#trust-index">Trust Index</a></li>
            <li><a href="#education">Media Literacy</a></li>
            <li><a href="#about">About Us</a></li>
          </ul>
        </div>
        <div class="footer-contact">
          <h4>Contact Us</h4>
          <p>Email: contact@truthmoment.com</p>
          <p>Phone: 400-123-4567</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2024 Truth Moment - Anti Fake News Platform. All rights reserved.</p>
      </div>
    </footer>
  `;
}

// 初始化应用
function initApp() {
  const app = document.querySelector('#app');
  app.innerHTML = renderHomePage();
  
  // 初始化交互
  initInteractions();
}

// 初始化交互功能
function initInteractions() {
  // Header滚动效果
  const header = document.getElementById('header');
  let lastScrollTop = 0;
  
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
    
    lastScrollTop = scrollTop;
  });
  
  // Mobile menu toggle
  const mobileMenuButton = document.querySelector('.mobile-menu-button');
  const navList = document.querySelector('.nav-list');
  
  mobileMenuButton.addEventListener('click', () => {
    navList.classList.toggle('nav-list-open');
    mobileMenuButton.textContent = navList.classList.contains('nav-list-open') ? 'Close' : 'Menu';
  });
  
  // News card click events
  const newsCards = document.querySelectorAll('.news-card');
  newsCards.forEach(card => {
    card.addEventListener('click', () => {
      // Simplified handling here, should navigate to details page in production
      alert('View news details');
    });
  });
  
  // 标签点击事件
  const tagBadges = document.querySelectorAll('.tag-badge');
  tagBadges.forEach(badge => {
    badge.addEventListener('click', () => {
      // 移除同组所有active状态
      const siblings = Array.from(badge.parentElement.children);
      siblings.forEach(sib => sib.classList.remove('active'));
      // 添加当前active状态
      badge.classList.add('active');
    });
  });
}

// 启动应用
initApp();
