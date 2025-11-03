// CommentSection.js - 评论组件

/**
 * 渲染单条评论
 * @param {Object} comment - 评论数据
 * @returns {string} - HTML字符串
 */
function renderComment(comment) {
  return `
    <div class="comment-item" data-comment-id="${comment.id}">
      <div class="comment-header">
        <img src="https://picsum.photos/seed/${comment.userId}/40/40" alt="${comment.username}" class="comment-avatar">
        <div class="comment-meta">
          <h4 class="comment-username">${comment.username}</h4>
          <p class="comment-time">${new Date(comment.createdAt).toLocaleString()}</p>
        </div>
        <div class="comment-rating">
          <span class="rating-badge ${comment.rating === 'true' ? 'true' : 'false'}">
            ${comment.rating === 'true' ? '👍 Trustworthy' : '👎 Not Trustworthy'}
          </span>
        </div>
      </div>
      <div class="comment-content">
        <p>${comment.content}</p>
      </div>
      <div class="comment-actions">
        <button class="comment-like">👍 <span>${comment.likes || 0}</span></button>
        <button class="comment-dislike">👎 <span>${comment.dislikes || 0}</span></button>
        <button class="comment-reply">Reply</button>
      </div>
    </div>
  `;
}

/**
 * 渲染评论区
 * @param {Array} comments - 评论列表
 * @param {string} newsId - 新闻ID
 * @returns {string} - HTML字符串
 */
export function renderCommentSection(comments = [], newsId) {
  const commentsHtml = comments.map(renderComment).join('');
  
  return `
    <section class="comment-section" data-news-id="${newsId}">
      <div class="section-header">
        <h3>Comments (${comments.length})</h3>
      </div>
      
      <!-- Comment form -->
      <div class="comment-form-container">
        <div class="comment-form">
          <img src="https://picsum.photos/seed/currentuser/40/40" alt="Your avatar" class="comment-form-avatar">
          <div class="comment-form-content">
            <div class="comment-form-rating">
              <label>Your rating:</label>
              <button class="rating-button" data-rating="true">👍 Trustworthy</button>
              <button class="rating-button" data-rating="false">👎 Not Trustworthy</button>
            </div>
            <textarea 
              class="comment-form-textarea" 
              placeholder="Share your thoughts..."
              rows="4"
            ></textarea>
            <div class="comment-form-actions">
              <button class="btn btn-primary comment-submit">Post Comment</button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Comments list -->
      <div class="comments-list">
        ${comments.length > 0 ? commentsHtml : '<p class="no-comments">No comments yet. Be the first to comment!</p>'}
      </div>
      
      <!-- Load more button -->
      ${comments.length > 0 ? `
        <div class="load-more-comments">
          <button class="btn btn-outline">Load More Comments</button>
        </div>
      ` : ''}
    </section>
  `;
}

/**
 * 初始化评论区的交互
 * @param {Object} callbacks - 回调函数对象
 * @param {Function} callbacks.onSubmit - 提交评论回调
 * @param {Function} callbacks.onLike - 点赞回调
 * @param {Function} callbacks.onDislike - 点踩回调
 * @param {Function} callbacks.onReply - 回复回调
 * @param {Function} callbacks.onLoadMore - 加载更多回调
 */
export function initCommentSection(callbacks = {}) {
  const { onSubmit, onLike, onDislike, onReply, onLoadMore } = callbacks;
  
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
  
  // 初始化点赞/点踩/回复按钮
  document.querySelectorAll('.comment-item').forEach(item => {
    const commentId = item.getAttribute('data-comment-id');
    
    // 点赞
    const likeButton = item.querySelector('.comment-like');
    if (likeButton) {
      likeButton.addEventListener('click', () => {
        if (onLike) {
          onLike(commentId);
          // 简单的客户端更新
          const countElement = likeButton.querySelector('span');
          countElement.textContent = parseInt(countElement.textContent) + 1;
        }
      });
    }
    
    // 点踩
    const dislikeButton = item.querySelector('.comment-dislike');
    if (dislikeButton) {
      dislikeButton.addEventListener('click', () => {
        if (onDislike) {
          onDislike(commentId);
          // 简单的客户端更新
          const countElement = dislikeButton.querySelector('span');
          countElement.textContent = parseInt(countElement.textContent) + 1;
        }
      });
    }
    
    // 回复
    const replyButton = item.querySelector('.comment-reply');
    if (replyButton) {
      replyButton.addEventListener('click', () => {
        if (onReply) {
          onReply(commentId);
        }
      });
    }
  });
  
  // 初始化加载更多按钮
  const loadMoreButton = document.querySelector('.load-more-comments button');
  if (loadMoreButton) {
    loadMoreButton.addEventListener('click', () => {
      if (onLoadMore) {
        onLoadMore();
      }
    });
  }
}