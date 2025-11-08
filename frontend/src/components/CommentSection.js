// CommentSection.js - Comment Component

/**
 * Render a single comment
 * @param {Object} comment - Comment data
 * @returns {string} - HTML string
 */
function renderComment(comment) {
  return `
    <div class="comment-card" data-comment-id="${comment.id}">
      <div class="comment-header">
        <img src="https://picsum.photos/seed/${comment.userId}/40/40" alt="${comment.username}" class="comment-avatar">
        <div class="comment-meta">
          <div class="comment-user-info">
            <h4 class="comment-username">${comment.username}</h4>
            <span class="comment-rating-badge ${comment.rating === 'true' ? 'trustworthy' : 'not-trustworthy'}">
              ${comment.rating === 'true' ? '✅' : '❌'} Marked as ${comment.rating === 'true' ? 'Trustworthy' : 'Not Trustworthy'}
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
}

/**
 * Render comment section
 * @param {Array} comments - Comments list
 * @param {string} newsId - News ID
 * @param {number} trustPercentage - Trust percentage
 * @returns {string} - HTML string
 */
export function renderCommentSection(comments = [], newsId, trustPercentage = 0) {
  const commentsHtml = comments.map(renderComment).join('');
  
  // Generate prompt text based on trust percentage
      let trustPrompt = '';
      if (trustPercentage >= 70) {
        trustPrompt = 'The community considers this news highly trustworthy. What do you think?';
      } else if (trustPercentage >= 50) {
        trustPrompt = 'The community considers this news generally trustworthy. Share your opinion!';
      } else if (trustPercentage <= 30) {
        trustPrompt = 'The community is skeptical about this news. What are your thoughts?';
      } else {
        trustPrompt = 'Share your opinion on this news...';
      }
  
  return `
    <section class="comment-section" data-news-id="${newsId}">
      <div class="section-header">
          <h3>Comments</h3>
          <div class="comment-sort-options">
            <button class="sort-btn active" data-sort="latest">Latest</button>
            <button class="sort-btn" data-sort="hottest">Hottest</button>
            <span class="comment-count">User Comments (${comments.length})</span>
          </div>
        </div>
      
      <!-- Trust prompt -->
      <div class="trust-prompt">
        <p>${trustPrompt}</p>
      </div>
      
      <!-- Comments list -->
      <div class="comments-list">
        ${comments.length > 0 ? commentsHtml : '<p class="no-comments">No comments yet. Be the first to comment!</p>'}
      </div>
      
      <!-- Comment form -->
      <div class="comment-form-container">
        <div class="comment-form">
          <img src="https://picsum.photos/seed/currentuser/40/40" alt="Your avatar" class="comment-form-avatar">
          <div class="comment-form-content">
            <textarea 
              class="comment-form-textarea" 
              placeholder="Share your thoughts..."
              rows="3"
            ></textarea>
            <div class="comment-form-footer">
              <div class="comment-form-rating">
                <label>Your rating:</label>
                <button class="rating-button" data-rating="true">✅ Trustworthy</button>
                <button class="rating-button" data-rating="false">❌ Not Trustworthy</button>
              </div>
              <div class="comment-form-actions">
                <button class="btn btn-primary comment-submit">Post Comment</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

/**
 * Initialize comment section interactions
 * @param {Object} callbacks - Callback functions object
 * @param {Function} callbacks.onSubmit - Submit comment callback
 * @param {Function} callbacks.onLike - Like callback
 * @param {Function} callbacks.onDislike - Dislike callback
 * @param {Function} callbacks.onSort - Sort callback
 */
export function initCommentSection(callbacks = {}) {
  const { onSubmit, onLike, onDislike, onSort } = callbacks;
  
  // 初始化排序按钮
  const sortButtons = document.querySelectorAll('.sort-btn');
  sortButtons.forEach(button => {
    button.addEventListener('click', () => {
      const sortType = button.getAttribute('data-sort');
      
      // 更新按钮状态
      sortButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // 触发排序回调
      if (onSort) {
        onSort(sortType);
      }
    });
  });
  
  // 初始化评分按钮
  const ratingButtons = document.querySelectorAll('.rating-button');
  ratingButtons.forEach(button => {
    button.addEventListener('click', () => {
      const parent = button.closest('.comment-form-rating');
      parent.querySelectorAll('.rating-button').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
    });
  });
  
  // 初始化提交按钮
  const submitButton = document.querySelector('.comment-submit');
  if (submitButton) {
    submitButton.addEventListener('click', () => {
      const textarea = document.querySelector('.comment-form-textarea');
      const activeRating = document.querySelector('.rating-button.active');
      const newsId = document.querySelector('.comment-section').getAttribute('data-news-id');
      
      if (textarea.value.trim() && activeRating) {
        const commentData = {
          newsId,
          content: textarea.value.trim(),
          rating: activeRating.getAttribute('data-rating')
        };
        
        if (onSubmit) {
          onSubmit(commentData);
        }
        
        // 清空表单
        textarea.value = '';
        activeRating.classList.remove('active');
      }
    });
  }
  
  // 初始化点赞/点踩按钮
  document.querySelectorAll('.comment-card').forEach(card => {
    const commentId = card.getAttribute('data-comment-id');
    
    // 点赞
    const likeButton = card.querySelector('.like-btn');
    if (likeButton) {
      likeButton.addEventListener('click', () => {
        // 防止重复点击
        if (likeButton.classList.contains('active')) return;
        
        // 取消点踩状态
        const dislikeButton = card.querySelector('.dislike-btn');
        if (dislikeButton.classList.contains('active')) {
          const dislikeCount = dislikeButton.querySelector('.action-count');
          dislikeCount.textContent = parseInt(dislikeCount.textContent) - 1;
          dislikeButton.classList.remove('active');
        }
        
        // 更新点赞状态
        likeButton.classList.add('active');
        const likeCount = likeButton.querySelector('.action-count');
        likeCount.textContent = parseInt(likeCount.textContent) + 1;
        
        if (onLike) {
          onLike(commentId);
        }
      });
    }
    
    // 点踩
    const dislikeButton = card.querySelector('.dislike-btn');
    if (dislikeButton) {
      dislikeButton.addEventListener('click', () => {
        // 防止重复点击
        if (dislikeButton.classList.contains('active')) return;
        
        // 取消点赞状态
        const likeButton = card.querySelector('.like-btn');
        if (likeButton.classList.contains('active')) {
          const likeCount = likeButton.querySelector('.action-count');
          likeCount.textContent = parseInt(likeCount.textContent) - 1;
          likeButton.classList.remove('active');
        }
        
        // 更新点踩状态
        dislikeButton.classList.add('active');
        const dislikeCount = dislikeButton.querySelector('.action-count');
        dislikeCount.textContent = parseInt(dislikeCount.textContent) + 1;
        
        if (onDislike) {
          onDislike(commentId);
        }
      });
    }
  });
}