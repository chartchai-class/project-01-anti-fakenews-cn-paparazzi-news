<!-- CategoryTabs.js - 分类导航条组件（含样式与完整功能） -->
/**
 * 分类导航条组件
 * 提供分类切换、样式管理、动态更新功能
 */

// 类型定义（TypeScript风格注释）
/**
 * @typedef {Object} CategoryTabsOptions
 * @property {Array<string>} [categories] - 自定义分类列表
 * @property {string} [activeCategory] - 初始激活分类
 * @property {Function} [onChange] - 分类切换回调函数 (category: string, categoryLower: string) => void
 * @property {string} [containerId] - 容器DOM ID，默认使用"category-tabs-container"
 */

/**
 * 渲染分类导航条
 * @param {CategoryTabsOptions} options - 配置选项
 * @returns {HTMLElement} - 渲染后的导航条DOM元素
 */
export function renderCategoryTabs({
  categories = [],
  activeCategory = 'All',
  onChange,
  containerId = 'category-tabs-container'
} = {}) {
  // 处理默认分类与去重
  const defaultCategories = ['All', 'Politics', 'Economy', 'Technology', 'Society', 'Entertainment', 'Health', 'Education', 'Environment', 'Finance'];
  const uniqueCategories = [...new Set([...defaultCategories, ...categories])];
  const displayCategories = uniqueCategories.sort((a, b) => {
    // 保持"All"在首位，其余按字母排序
    if (a === 'All') return -1;
    if (b === 'All') return 1;
    return a.localeCompare(b);
  });

  // 创建容器元素
  const container = document.getElementById(containerId) || document.createElement('div');
  container.id = containerId;
  container.className = 'category-tabs-container';

  // 渲染分类按钮
  const tabsHtml = displayCategories.map(category => `
    <button 
      class="tag-badge ${category === activeCategory ? 'active' : ''}"
      data-category="${category.toLowerCase()}"
      aria-pressed="${category === activeCategory}"
    >
      ${category}
    </button>
  `).join('');

  // 组装HTML结构（含空状态处理）
  container.innerHTML = `
    <style>
      .category-tabs-container {
        width: 100%;
        overflow-x: auto;
        padding: 12px 0;
        border-bottom: 1px solid #e0e0e0;
        scrollbar-width: thin;
      }
      
      .category-filters {
        display: flex;
        gap: 8px;
        padding: 0 16px;
        min-width: max-content;
      }
      
      .tag-badge {
        padding: 6px 16px;
        border: none;
        border-radius: 20px;
        background-color: #f5f5f5;
        color: #333;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s ease;
        white-space: nowrap;
      }
      
      .tag-badge:hover {
        background-color: #e9e9e9;
        transform: translateY(-1px);
      }
      
      .tag-badge.active {
        background-color: #2c3e50;
        color: white;
        font-weight: 500;
      }
      
      .tag-badge:focus {
        outline: 2px solid #3498db;
        outline-offset: 2px;
      }
      
      .empty-state {
        color: #999;
        padding: 20px;
        text-align: center;
        font-size: 14px;
      }
    </style>
    <div class="category-filters">
      ${tabsHtml || '<div class="empty-state">No categories available</div>'}
    </div>
  `;

  // 初始化交互
  initCategoryTabsEvents(container, onChange);
  
  return container;
}

/**
 * 初始化分类导航条的交互事件
 * @param {HTMLElement} container - 导航条容器
 * @param {Function} onChange - 分类切换回调
 */
function initCategoryTabsEvents(container, onChange) {
  const tagBadges = container.querySelectorAll('.category-filters .tag-badge');
  
  tagBadges.forEach(badge => {
    // 点击事件
    badge.addEventListener('click', () => {
      const category = badge.textContent.trim();
      const categoryLower = badge.dataset.category || category.toLowerCase();
      
      // 更新激活状态
      updateActiveState(container, badge);
      
      // 触发回调
      if (typeof onChange === 'function') {
        onChange(category, categoryLower);
      }
    });

    // 键盘事件支持（增强可访问性）
    badge.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        badge.click();
      }
    });
  });
}

/**
 * 更新激活状态样式
 * @param {HTMLElement} container - 导航条容器
 * @param {HTMLElement} activeBadge - 要激活的按钮
 */
function updateActiveState(container, activeBadge) {
  // 移除所有激活状态
  container.querySelectorAll('.tag-badge').forEach(badge => {
    badge.classList.remove('active');
    badge.setAttribute('aria-pressed', 'false');
  });
  
  // 设置当前激活状态
  activeBadge.classList.add('active');
  activeBadge.setAttribute('aria-pressed', 'true');
}

/**
 * 动态更新分类列表
 * @param {CategoryTabsOptions} options - 同renderCategoryTabs的配置选项
 */
export function updateCategoryTabs(options) {
  // 重新渲染以更新分类
  renderCategoryTabs(options);
}

// 使用示例：
// 在页面中使用组件
// const container = renderCategoryTabs({
//   categories: ['Sports', 'Science'], // 追加自定义分类
//   activeCategory: 'Technology',
//   onChange: (category, lowerCase) => {
//     console.log('Selected category:', category, lowerCase);
//   }
// });
// document.body.appendChild(container);
