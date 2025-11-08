// VoteBar.js - Voting Component

/**
 * 渲染投票条
 * @param {Object} voteData - Voting data
 * @param {number} voteData.trustworthy - Trustworthy votes
   * @param {number} voteData.notTrustworthy - Not trustworthy votes
   * @param {number} voteData.notSure - Not sure votes
 * @returns {string} - HTML字符串
 */
export function renderVoteBar(voteData = {}) {
  const { trustworthy = 0, notTrustworthy = 0, notSure = 0 } = voteData;
  const totalVotes = trustworthy + notTrustworthy + notSure;
  
  // 计算百分比
  const trustworthyPercent = totalVotes > 0 ? Math.round((trustworthy / totalVotes) * 100) : 0;
  const notTrustworthyPercent = totalVotes > 0 ? Math.round((notTrustworthy / totalVotes) * 100) : 0;
  const notSurePercent = totalVotes > 0 ? Math.round((notSure / totalVotes) * 100) : 0;
  
  // Determine trust level and text
  let trustLevelText = 'Unknown';
  let trustLevelClass = '';
  
  if (trustworthyPercent >= 70) {
    trustLevelText = 'Highly Trustworthy';
    trustLevelClass = 'trust-high';
  } else if (trustworthyPercent >= 50) {
    trustLevelText = 'Generally Trustworthy';
    trustLevelClass = 'trust-medium';
  } else if (notTrustworthyPercent >= 50) {
    trustLevelText = 'Not Trustworthy';
    trustLevelClass = 'trust-low';
  } else {
    trustLevelText = 'Questionable';
    trustLevelClass = 'trust-medium';
  }
  
  return `
    <div class="community-trust-panel">
      <h3 class="panel-title">Community Trust Assessment</h3>
      
      <div class="trust-level">
        <div class="trust-progress-container">
          <div class="trust-progress-bar">
            <div 
              class="trust-progress trustworthy" 
              style="width: ${trustworthyPercent}%"
            ></div>
            <div 
              class="trust-progress not-sure" 
              style="width: ${notSurePercent}%"
            ></div>
            <div 
              class="trust-progress not-trustworthy" 
              style="width: ${notTrustworthyPercent}%"
            ></div>
          </div>
          <div class="trust-percentage ${trustLevelClass}">${trustworthyPercent}% Trustworthy</div>
        </div>
      </div>
      
      <div class="trust-vote-buttons">
        <button class="trust-vote-btn" data-vote="trustworthy">
          <span class="vote-radio ${trustworthyPercent > notTrustworthyPercent && trustworthyPercent > notSurePercent ? 'checked' : ''}"></span>
          <span class="vote-label">Trustworthy</span>
        </button>
        <button class="trust-vote-btn" data-vote="notSure">
          <span class="vote-radio"></span>
          <span class="vote-label">Not Sure</span>
        </button>
        <button class="trust-vote-btn" data-vote="notTrustworthy">
          <span class="vote-radio"></span>
          <span class="vote-label">Not Trustworthy</span>
        </button>
      </div>
      
      <div class="vote-message" id="vote-message">
        <!-- Vote message will be displayed here -->
      </div>
    </div>
  `;
}

/**
 * 初始化投票条的交互
 * @param {Function} onVote - Voting callback function
 */
export function initVoteBar(onVote) {
  const voteButtons = document.querySelectorAll('.trust-vote-btn');
  let userVoted = false;
  let currentVote = null;
  
  // Display vote message
  function showVoteMessage(message, type = 'info') {
    const messageElement = document.getElementById('vote-message');
    messageElement.textContent = message;
    messageElement.className = `vote-message ${type}`;
    messageElement.style.display = 'block';
    
    // Hide message after 3 seconds
    setTimeout(() => {
      messageElement.style.display = 'none';
    }, 3000);
  }
  
  voteButtons.forEach(button => {
    button.addEventListener('click', () => {
      const voteType = button.getAttribute('data-vote');
      
      // If already voted for the same type, show message
      if (userVoted && currentVote === voteType) {
        showVoteMessage('You have already voted for this option!', 'warning');
        return;
      }
      
      // If user has voted for a different type, reset previous vote
      if (userVoted && currentVote !== voteType) {
        const previousButton = document.querySelector(`.trust-vote-btn[data-vote="${currentVote}"]`);
        previousButton.querySelector('.vote-radio').classList.remove('checked');
      }
      
      // 设置当前投票选中状态
      button.querySelector('.vote-radio').classList.add('checked');
      
      // 更新状态
      userVoted = true;
      currentVote = voteType;
      
      // 触发回调
      if (onVote) {
        onVote(voteType);
      }
      
      // Show success message
      const voteLabels = {
        trustworthy: 'Trustworthy',
        notTrustworthy: 'Not Trustworthy',
        notSure: 'Not Sure'
      };
      showVoteMessage(`Thank you for your vote! You consider this news ${voteLabels[voteType]}.`, 'success');
      
      // Update progress bar (simplified, in real app should be based on backend data)
      updateTrustProgress(voteType);
    });
  });
  
  // Update trust progress bar
  function updateTrustProgress(voteType) {
    // Get current progress bar widths
    let trustworthyWidth = parseInt(document.querySelector('.trust-progress.trustworthy').style.width) || 0;
    let notSureWidth = parseInt(document.querySelector('.trust-progress.not-sure').style.width) || 0;
    let notTrustworthyWidth = parseInt(document.querySelector('.trust-progress.not-trustworthy').style.width) || 0;
    
    // Simplified progress bar update logic
    // In real app, should recalculate percentages based on total votes
    if (voteType === 'trustworthy') {
      trustworthyWidth += 5;
      notSureWidth = Math.max(0, notSureWidth - 2);
      notTrustworthyWidth = Math.max(0, notTrustworthyWidth - 3);
    } else if (voteType === 'notSure') {
      notSureWidth += 5;
      trustworthyWidth = Math.max(0, trustworthyWidth - 2);
      notTrustworthyWidth = Math.max(0, notTrustworthyWidth - 3);
    } else if (voteType === 'notTrustworthy') {
      notTrustworthyWidth += 5;
      trustworthyWidth = Math.max(0, trustworthyWidth - 3);
      notSureWidth = Math.max(0, notSureWidth - 2);
    }
    
    // Ensure total is 100%
    const totalWidth = trustworthyWidth + notSureWidth + notTrustworthyWidth;
    if (totalWidth > 0) {
      trustworthyWidth = Math.round((trustworthyWidth / totalWidth) * 100);
      notSureWidth = Math.round((notSureWidth / totalWidth) * 100);
      notTrustworthyWidth = Math.round((notTrustworthyWidth / totalWidth) * 100);
    }
    
    // Update progress bars
    document.querySelector('.trust-progress.trustworthy').style.width = `${trustworthyWidth}%`;
    document.querySelector('.trust-progress.not-sure').style.width = `${notSureWidth}%`;
    document.querySelector('.trust-progress.not-trustworthy').style.width = `${notTrustworthyWidth}%`;
    
    // Update percentage display
    const percentElement = document.querySelector('.trust-percentage');
    percentElement.textContent = `${trustworthyWidth}% Trustworthy`;
    
    // Update trust level
    if (trustworthyWidth >= 70) {
      percentElement.className = 'trust-percentage trust-high';
    } else if (trustworthyWidth >= 50) {
      percentElement.className = 'trust-percentage trust-medium';
    } else if (notTrustworthyWidth >= 50) {
      percentElement.className = 'trust-percentage trust-low';
    } else {
      percentElement.className = 'trust-percentage trust-medium';
    }
  }
}