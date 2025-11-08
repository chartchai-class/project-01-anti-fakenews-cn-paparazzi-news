// NewsCard.js - 新闻卡片组件

/**
 * 渲染信任徽章
 * @param {string} trustLevel - 信任级别 (high, medium, low)
 * @param {number} trustScore - 信任分数
 * @returns {string} - HTML字符串
 */
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
  
  const color = colors[trustLevel] || colors.medium;
  const label = labels[trustLevel] || labels.medium;
  
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

/**
 * 渲染新闻卡片
 * @param {Object} news - 新闻数据对象
 * @returns {string} - HTML字符串
 */
export function renderNewsCard(news) {
  if (!news) return '';
  
  return `
    <article class="news-card" data-news-id="${news.id}">
      <div class="news-image">
        <img src="${news.imageUrl || 'https://picsum.photos/seed/default/600/400'}" alt="${news.title}">
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

/**
 * 初始化新闻卡片的交互
 * @param {Function} onNewsClick - 新闻点击回调
 */
export function initNewsCards(onNewsClick) {
  const newsCards = document.querySelectorAll('.news-card');
  
  newsCards.forEach(card => {
    card.addEventListener('click', (event) => {
      // 如果点击的是按钮，不触发卡片点击
      if (event.target.classList.contains('news-read-more')) {
        event.preventDefault();
      }
      
      const newsId = card.getAttribute('data-news-id');
      if (onNewsClick) {
        onNewsClick(newsId);
      }
    });
    
    // 为Read More按钮添加单独的点击事件
    const readMoreBtn = card.querySelector('.news-read-more');
    if (readMoreBtn) {
      readMoreBtn.addEventListener('click', (event) => {
        event.stopPropagation(); // 阻止事件冒泡
        const newsId = card.getAttribute('data-news-id');
        if (onNewsClick) {
          onNewsClick(newsId);
        }
      });
    }
  });
}