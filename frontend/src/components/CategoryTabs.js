// CategoryTabs.js - 分类导航条组件

/**
 * 渲染分类导航条
 * @param {Array} categories - 分类列表
 * @param {string} activeCategory - 当前激活的分类
 * @param {Function} onCategoryClick - 分类点击回调函数
 * @returns {string} - HTML字符串
 */
export function renderCategoryTabs(categories = [], activeCategory = 'All', onCategoryClick) {
  // 如果没有传入分类，使用默认分类
  const defaultCategories = ['All', 'Politics', 'Economy', 'Technology', 'Society', 'Entertainment', 'Health', 'Education', 'Environment', 'Finance'];
  const displayCategories = categories.length > 0 ? categories : defaultCategories;
  
  // 渲染HTML
  const tabsHtml = displayCategories.map(category => `
    <button 
      class="tag-badge ${category === activeCategory ? 'active' : ''}"
      data-category="${category.toLowerCase()}"
    >
      ${category}
    </button>
  `).join('');
  
  return `
    <div class="category-filters">
      ${tabsHtml}
    </div>
  `;
}

/**
 * 初始化分类导航条的交互
 * @param {Function} onCategoryChange - 分类变化回调
 */
export function initCategoryTabs(onCategoryChange) {
  const tagBadges = document.querySelectorAll('.category-filters .tag-badge');
  
  tagBadges.forEach(badge => {
    badge.addEventListener('click', () => {
      const category = badge.textContent.trim();
      const categoryLower = category.toLowerCase();
      
      // 移除同组所有active状态
      const siblings = Array.from(badge.parentElement.children);
      siblings.forEach(sib => sib.classList.remove('active'));
      // 添加当前active状态
      badge.classList.add('active');
      
      // 触发回调
      if (onCategoryChange) {
        onCategoryChange(category, categoryLower);
      }
    });
  });
}
