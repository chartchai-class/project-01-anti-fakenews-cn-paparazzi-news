// VoteBar.js - 投票组件

/**
 * 渲染投票条
 * @param {Object} voteData - 投票数据
 * @param {number} voteData.trustworthy - 可信投票数
 * @param {number} voteData.notTrustworthy - 不可信投票数
 * @param {number} voteData.notSure - 不确定投票数
 * @returns {string} - HTML字符串
 */
export function renderVoteBar(voteData = {}) {
  const { trustworthy = 0, notTrustworthy = 0, notSure = 0 } = voteData;
  const totalVotes = trustworthy + notTrustworthy + notSure;
  
  // 计算百分比
  const trustworthyPercent = totalVotes > 0 ? Math.round((trustworthy / totalVotes) * 100) : 0;
  const notTrustworthyPercent = totalVotes > 0 ? Math.round((notTrustworthy / totalVotes) * 100) : 0;
  const notSurePercent = totalVotes > 0 ? Math.round((notSure / totalVotes) * 100) : 0;
  
  return `
    <div class="vote-bar">
      <div class="vote-header">
        <h4>Community Trust Vote</h4>
        <span class="vote-count">${totalVotes} votes</span>
      </div>
      
      <div class="vote-buttons">
        <button class="vote-button trustworthy" data-vote="trustworthy">
          <span class="vote-icon">👍</span>
          <span class="vote-label">Trustworthy</span>
          <span class="vote-count">${trustworthy}</span>
        </button>
        <button class="vote-button not-sure" data-vote="notSure">
          <span class="vote-icon">🤔</span>
          <span class="vote-label">Not Sure</span>
          <span class="vote-count">${notSure}</span>
        </button>
        <button class="vote-button not-trustworthy" data-vote="notTrustworthy">
          <span class="vote-icon">👎</span>
          <span class="vote-label">Not Trustworthy</span>
          <span class="vote-count">${notTrustworthy}</span>
        </button>
      </div>
      
      <div class="vote-results">
        <div class="vote-progress-bar">
          <div 
            class="vote-progress trustworthy" 
            style="width: ${trustworthyPercent}%"
            title="${trustworthyPercent}% Trustworthy"
          ></div>
          <div 
            class="vote-progress not-sure" 
            style="width: ${notSurePercent}%"
            title="${notSurePercent}% Not Sure"
          ></div>
          <div 
            class="vote-progress not-trustworthy" 
            style="width: ${notTrustworthyPercent}%"
            title="${notTrustworthyPercent}% Not Trustworthy"
          ></div>
        </div>
        <div class="vote-percentages">
          <div class="vote-percentage trustworthy">
            <span class="vote-color" style="background-color: var(--trust-high);"></span>
            <span>${trustworthyPercent}%</span>
          </div>
          <div class="vote-percentage not-sure">
            <span class="vote-color" style="background-color: var(--trust-medium);"></span>
            <span>${notSurePercent}%</span>
          </div>
          <div class="vote-percentage not-trustworthy">
            <span class="vote-color" style="background-color: var(--trust-low);"></span>
            <span>${notTrustworthyPercent}%</span>
          </div>
        </div>
      </div>
      
      <div class="vote-message" id="vote-message">
        <!-- 投票提示信息将在这里显示 -->
      </div>
    </div>
  `;
}

/**
 * 初始化投票条的交互
 * @param {Function} onVote - 投票回调函数
 */
export function initVoteBar(onVote) {
  const voteButtons = document.querySelectorAll('.vote-button');
  let userVoted = false;
  let currentVote = null;
  
  // 显示投票消息
  function showVoteMessage(message, type = 'info') {
    const messageElement = document.getElementById('vote-message');
    messageElement.textContent = message;
    messageElement.className = `vote-message ${type}`;
    messageElement.style.display = 'block';
    
    // 3秒后隐藏消息
    setTimeout(() => {
      messageElement.style.display = 'none';
    }, 3000);
  }
  
  voteButtons.forEach(button => {
    button.addEventListener('click', () => {
      const voteType = button.getAttribute('data-vote');
      const voteCountElement = button.querySelector('.vote-count');
      const currentCount = parseInt(voteCountElement.textContent);
      
      // 如果已经投过相同类型的票，提示用户
      if (userVoted && currentVote === voteType) {
        showVoteMessage('You have already voted this option!', 'warning');
        return;
      }
      
      // 如果用户已经投过不同类型的票，先恢复之前的投票
      if (userVoted && currentVote !== voteType) {
        const previousButton = document.querySelector(`.vote-button[data-vote="${currentVote}"]`);
        const previousCountElement = previousButton.querySelector('.vote-count');
        previousCountElement.textContent = parseInt(previousCountElement.textContent) - 1;
        previousButton.classList.remove('voted');
      }
      
      // 增加当前投票数
      voteCountElement.textContent = currentCount + 1;
      button.classList.add('voted');
      
      // 更新状态
      userVoted = true;
      currentVote = voteType;
      
      // 触发回调
      if (onVote) {
        onVote(voteType);
      }
      
      // 显示成功消息
      const voteLabels = {
        trustworthy: 'Trustworthy',
        notTrustworthy: 'Not Trustworthy',
        notSure: 'Not Sure'
      };
      showVoteMessage(`Thank you for voting ${voteLabels[voteType]}!`, 'success');
      
      // 更新进度条
      updateVoteProgress();
    });
  });
  
  // 更新投票进度条
  function updateVoteProgress() {
    const voteButtons = document.querySelectorAll('.vote-button');
    let trustworthy = 0, notTrustworthy = 0, notSure = 0;
    
    voteButtons.forEach(button => {
      const voteType = button.getAttribute('data-vote');
      const count = parseInt(button.querySelector('.vote-count').textContent);
      
      if (voteType === 'trustworthy') trustworthy = count;
      else if (voteType === 'notTrustworthy') notTrustworthy = count;
      else if (voteType === 'notSure') notSure = count;
    });
    
    const totalVotes = trustworthy + notTrustworthy + notSure;
    
    if (totalVotes > 0) {
      const trustworthyPercent = Math.round((trustworthy / totalVotes) * 100);
      const notTrustworthyPercent = Math.round((notTrustworthy / totalVotes) * 100);
      const notSurePercent = Math.round((notSure / totalVotes) * 100);
      
      document.querySelector('.vote-progress.trustworthy').style.width = `${trustworthyPercent}%`;
      document.querySelector('.vote-progress.not-sure').style.width = `${notSurePercent}%`;
      document.querySelector('.vote-progress.not-trustworthy').style.width = `${notTrustworthyPercent}%`;
      
      document.querySelector('.vote-percentage.trustworthy span:last-child').textContent = `${trustworthyPercent}%`;
      document.querySelector('.vote-percentage.not-sure span:last-child').textContent = `${notSurePercent}%`;
      document.querySelector('.vote-percentage.not-trustworthy span:last-child').textContent = `${notTrustworthyPercent}%`;
      
      document.querySelector('.vote-count').textContent = `${totalVotes} votes`;
    }
  }
}