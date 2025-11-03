// CategoryPage.js - 各分类新闻页
import { renderCategoryTabs, initCategoryTabs } from '../components/CategoryTabs.js';
import { renderNewsCard, initNewsCards } from '../components/NewsCard.js';

/**
 * 渲染分类新闻页
 * @param {string} category - 当前分类
 * @param {Array} newsData - 新闻数据数组
 * @returns {string} - HTML字符串
 */
export function renderCategoryPage(category = 'All', newsData = []) {
  const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);
  
  // 生成新闻卡片HTML
  const newsCards = newsData.length > 0 ? 
    newsData.map(renderNewsCard).join('') : 
    '<div class="no-news">No news found for this category. Try another category.</div>';
  
  // 生成分类标签HTML
  const categories = ['All', 'Politics', 'Economy', 'Technology', 'Society', 'Entertainment', 'Health', 'Education', 'Environment', 'Finance'];
  const categoryTabs = renderCategoryTabs(categories, categoryTitle);
  
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
            <li><a href="#" class="nav-item">Home</a></li>
            <li><a href="#trust-index" class="nav-item">Trust Index</a></li>
            <li><a href="#education" class="nav-item">Media Literacy</a></li>
            <li><a href="#about" class="nav-item">About Us</a></li>
          </ul>
          <button class="mobile-menu-button">Menu</button>
        </nav>
      </div>
    </header>
    
    <main class="main-content">
      <section class="category-header-section">
        <div class="section-container">
          <h1 class="category-title">${categoryTitle} News</h1>
          <p class="category-description">Latest and most reliable news in the ${categoryTitle.toLowerCase()} category.</p>
        </div>
      </section>
      
      <section class="news-section">
        <div class="section-container">
          <div class="section-header">
            <h2>News in ${categoryTitle}</h2>
            ${categoryTabs}
          </div>
          <div class="news-grid" id="category-news-grid">
            ${newsCards}
          </div>
          ${newsData.length > 0 ? `
            <div class="load-more">
              <button class="btn btn-outline" id="load-more-category">Load More</button>
            </div>
          ` : ''}
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

/**
 * 初始化分类新闻页交互
 * @param {Object} options - 配置选项
 * @param {Function} options.onCategoryChange - 分类切换回调
 * @param {Function} options.onNewsClick - 新闻点击回调
 * @param {Function} options.onLoadMore - 加载更多回调
 */
export function initCategoryPage(options = {}) {
  const { onCategoryChange, onNewsClick, onLoadMore } = options;
  
  // 初始化分类标签交互
  initCategoryTabs((category, categoryLower) => {
    if (onCategoryChange) {
      onCategoryChange(category, categoryLower);
    }
  });
  
  // 初始化新闻卡片交互
  initNewsCards(onNewsClick);
  
  // 初始化加载更多按钮
  const loadMoreButton = document.getElementById('load-more-category');
  if (loadMoreButton) {
    loadMoreButton.addEventListener('click', () => {
      loadMoreButton.textContent = 'Loading...';
      loadMoreButton.disabled = true;
      
      if (onLoadMore) {
        onLoadMore().then(() => {
          loadMoreButton.textContent = 'Load More';
          loadMoreButton.disabled = false;
          // 重新初始化新加载的新闻卡片
          initNewsCards(onNewsClick);
        }).catch(() => {
          loadMoreButton.textContent = 'Load More';
          loadMoreButton.disabled = false;
        });
      }
    });
  }
  
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
  
  if (mobileMenuButton && navList) {
    mobileMenuButton.addEventListener('click', () => {
      navList.classList.toggle('nav-list-open');
      mobileMenuButton.textContent = navList.classList.contains('nav-list-open') ? 'Close' : 'Menu';
    });
  }
}