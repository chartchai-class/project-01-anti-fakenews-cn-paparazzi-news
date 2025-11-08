// NewsDetailPage.js - News Detail Page
import { renderVoteBar, initVoteBar } from '../components/VoteBar.js';
import { renderCommentSection, initCommentSection } from '../components/CommentSection.js';

/**
 * Render news detail page
 * @param {Object} newsDetail - News detail data
 * @param {Array} comments - Comments list
 * @param {Object} voteData - Vote data
 * @returns {string} - HTML string
 */
export function renderNewsDetailPage(newsDetail = {}, comments = [], voteData = {}) {
  // 如果没有新闻数据，显示错误信息
  if (!newsDetail.id) {
    return `
      <header class="header" id="header">
        <div class="header-container">
          <div class="header-logo">
            <h1><span class="truth-icon">⚡</span>Truth Moment</h1>
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
        <section class="error-section">
          <div class="section-container">
            <h2>News Not Found</h2>
            <p>The requested news article could not be found.</p>
            <a href="#" class="btn btn-primary">Back to Home</a>
          </div>
        </section>
      </main>
      
      <footer class="footer">
        <div class="footer-bottom">
          <p>&copy; 2024 Truth Moment - Anti Fake News Platform. All rights reserved.</p>
        </div>
      </footer>
    `;
  }
  
  // 渲染信任徽章
  const renderTrustBadge = (trustLevel, trustScore) => {
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
    
    const color = colors[trustLevel] || colors.medium;
    const label = labels[trustLevel] || labels.medium;
    
    return `
      <div class="trust-badge detail-trust-badge" style="--trust-color: ${color}">
        <div class="trust-bar">
          <div class="trust-progress" style="width: ${trustScore}%"></div>
        </div>
        <div class="trust-info">
          <span class="trust-score">${trustScore}%</span>
          <span class="trust-label">${label}</span>
        </div>
      </div>
    `;
  };
  
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
      <section class="news-detail-section">
        <div class="section-container">
          <!-- Back button -->
          <div class="back-button-container">
            <a href="#" class="back-button" id="back-button">← Back to News List</a>
          </div>
          
          <!-- News title and metadata -->
          <div class="news-detail-header">
            <div class="news-meta-detail">
              <span class="news-source">${newsDetail.source}</span>
              <span class="news-date">${newsDetail.date}</span>
              <span class="news-category tag-badge">${newsDetail.category}</span>
            </div>
            <h1 class="news-detail-title">${newsDetail.title}</h1>
            ${renderTrustBadge(newsDetail.trustLevel, newsDetail.trustScore)}
          </div>
          
          <!-- News image -->
          <div class="news-detail-image">
            <img src="${newsDetail.imageUrl || 'https://picsum.photos/seed/default/1200/600'}" alt="${newsDetail.title}">
          </div>
          
          <!-- News content -->
          <div class="news-detail-content">
            <div class="news-detail-summary">
              <p>${newsDetail.summary}</p>
            </div>
            <div class="news-detail-body">
              ${newsDetail.content || `
                <p>This is the detailed content of the news article. Due to the length of the full article, we are showing the summary here.</p>
                <p>${newsDetail.summary}</p>
                <p>For more information, please visit the original source at ${newsDetail.source}.</p>
              `}
            </div>
          </div>
          
          <!-- Share buttons -->
          <div class="news-detail-actions">
            <div class="share-buttons">
              <button class="share-button" data-platform="facebook">Share on Facebook</button>
              <button class="share-button" data-platform="twitter">Share on Twitter</button>
              <button class="share-button" data-platform="linkedin">Share on LinkedIn</button>
              <button class="share-button" data-platform="copy">Copy Link</button>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Voting component -->
      <section class="vote-section">
        <div class="section-container">
          ${renderVoteBar(voteData)}
        </div>
      </section>
      
      <!-- Comment component -->
      ${renderCommentSection(comments, newsDetail.id)}
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
            <li><a href="#trust-index" class="nav-item">Trust Index</a></li>
            <li><a href="#education" class="nav-item">Media Literacy</a></li>
            <li><a href="#about" class="nav-item">About Us</a></li>
          </ul>
        </div>
        <div class="footer-contact">
          <h4>Contact Us</h4>
          <p>Email: hhibo2778@gmail.com</p>
          <p>Phone: 400-123-4567</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2025 Truth Moment - Anti Fake News Platform. All rights reserved.</p>
      </div>
    </footer>
  `;
}

/**
 * Initialize news detail page interactions
 * @param {Object} options - Configuration options
 * @param {Function} options.onBack - Back button callback
 * @param {Function} options.onVote - Vote callback
 * @param {Function} options.onCommentSubmit - Submit comment callback
 * @param {Function} options.onCommentLike - Like comment callback
 * @param {Function} options.onCommentDislike - Dislike comment callback
 * @param {Function} options.onCommentReply - Reply to comment callback
 * @param {Function} options.onLoadMoreComments - Load more comments callback
 */
export function initNewsDetailPage(options = {}) {
  const { 
    onBack, 
    onVote, 
    onCommentSubmit, 
    onCommentLike, 
    onCommentDislike, 
    onCommentReply, 
    onLoadMoreComments 
  } = options;
  
  // 初始化返回按钮
  const backButton = document.getElementById('back-button');
  if (backButton) {
    backButton.addEventListener('click', (e) => {
      e.preventDefault();
      if (onBack) {
        onBack();
      }
    });
  }
  
  // 初始化投票组件
  initVoteBar(onVote);
  
  // 初始化评论组件
  initCommentSection({
    onSubmit: onCommentSubmit,
    onLike: onCommentLike,
    onDislike: onCommentDislike,
    onReply: onCommentReply,
    onLoadMore: onLoadMoreComments
  });
  
  // 初始化分享按钮
  const shareButtons = document.querySelectorAll('.share-button');
  shareButtons.forEach(button => {
    button.addEventListener('click', () => {
      const platform = button.getAttribute('data-platform');
      const url = window.location.href;
      const title = document.querySelector('.news-detail-title')?.textContent || '';
      
      switch (platform) {
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
          break;
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
          break;
        case 'linkedin':
          window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
          break;
        case 'copy':
          navigator.clipboard.writeText(url).then(() => {
            const originalText = button.textContent;
            button.textContent = 'Copied!';
            setTimeout(() => {
              button.textContent = originalText;
            }, 2000);
          });
          break;
      }
    });
  });
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