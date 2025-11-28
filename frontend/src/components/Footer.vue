<template>
  <footer class="footer">
    <div class="footer-container">
      <!-- 左侧：项目信息 -->
      <div class="footer-info">
        <h2 class="footer-title">Paparazzi News</h2>
        <p class="footer-subtitle">反假新闻识别平台</p>
        <p class="footer-description">
          通过可信度评分帮助用户识别真实与虚假新闻，共建清朗网络环境
        </p>
      </div>
      
      <!-- 中间：团队信息 -->
      <div class="footer-team">
        <h3>开发团队</h3>
        <p class="team-members">三人小组</p>
        <div class="team-social">
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            class="social-link"
            aria-label="GitHub"
          >
            <svg class="github-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
        </div>
      </div>
      
      <!-- 右侧：导航链接 -->
      <div class="footer-nav">
        <h3>快速导航</h3>
        <ul class="nav-links">
          <li><router-link to="/" class="nav-link">首页</router-link></li>
          <li><router-link to="/category/Politics" class="nav-link">政治</router-link></li>
          <li><router-link to="/category/Society" class="nav-link">社会</router-link></li>
          <li><router-link to="/category/Environment" class="nav-link">环境</router-link></li>
          <li><router-link to="/category/Education" class="nav-link">教育</router-link></li>
          <li><router-link to="/category/Entertainment" class="nav-link">娱乐</router-link></li>
        </ul>
      </div>
    </div>
    
    <!-- 底部版权信息 -->
    <div class="footer-bottom">
      <div class="footer-copyright">
        <p>&copy; {{ currentYear }} Paparazzi News. 保留所有权利。</p>
      </div>
      <div class="footer-terms">
        <a href="#" class="terms-link">隐私政策</a>
        <span>|</span>
        <a href="#" class="terms-link">使用条款</a>
        <span>|</span>
        <a href="#" class="terms-link">关于我们</a>
      </div>
    </div>
  </footer>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  name: 'Footer',
  setup() {
    const currentYear = ref(new Date().getFullYear());
    
    // 处理滚动效果
    const handleScroll = () => {
      const footer = document.querySelector('.footer');
      if (footer) {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        // 当滚动到页面底部附近时，添加动画效果
        if (scrollPosition + windowHeight >= documentHeight - 200) {
          footer.classList.add('footer-visible');
        } else {
          footer.classList.remove('footer-visible');
        }
      }
    };
    
    onMounted(() => {
      window.addEventListener('scroll', handleScroll);
      // 初始化时检查一次
      handleScroll();
    });
    
    return {
      currentYear
    };
  }
};
</script>

<style scoped>
.footer {
  background-color: #ffffff;
  border-top: 1px solid #e0e0e0;
  padding: 40px 0 20px;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease, transform 0.6s ease;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

.footer-visible {
  opacity: 1;
  transform: translateY(0);
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
}

/* 项目信息部分 */
.footer-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer-title {
  font-size: 24px;
  font-weight: 700;
  color: #4CAF50;
  margin: 0;
  line-height: 1.2;
}

.footer-subtitle {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.footer-description {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0;
}

/* 团队信息部分 */
.footer-team {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.footer-team h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
  position: relative;
  padding-bottom: 8px;
}

.footer-team h3::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 2px;
  background-color: #4CAF50;
  border-radius: 2px;
}

.team-members {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.team-social {
  display: flex;
  gap: 12px;
  align-items: center;
}

.social-link {
  color: #666;
  transition: color 0.3s ease, transform 0.3s ease;
}

.social-link:hover {
  color: #4CAF50;
  transform: translateY(-2px);
}

.github-icon {
  width: 24px;
  height: 24px;
}

/* 导航链接部分 */
.footer-nav {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.footer-nav h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
  position: relative;
  padding-bottom: 8px;
}

.footer-nav h3::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 2px;
  background-color: #4CAF50;
  border-radius: 2px;
}

.nav-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-link {
  color: #666;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease, transform 0.2s ease;
  display: inline-block;
}

.nav-link:hover {
  color: #4CAF50;
  transform: translateX(5px);
}

/* 底部版权信息 */
.footer-bottom {
  max-width: 1200px;
  margin: 30px auto 0;
  padding: 20px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.footer-copyright p {
  font-size: 14px;
  color: #999;
  margin: 0;
}

.footer-terms {
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 12px;
}

.terms-link {
  color: #999;
  text-decoration: none;
  transition: color 0.3s ease;
}

.terms-link:hover {
  color: #4CAF50;
}

.footer-terms span {
  color: #ddd;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .footer {
    padding: 30px 0 15px;
  }
  
  .footer-container {
    gap: 30px;
    padding: 0 15px;
  }
  
  .footer-title {
    font-size: 22px;
  }
  
  .footer-bottom {
    padding: 15px;
  }
  
  .footer-terms {
    flex-wrap: wrap;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .footer-container {
    grid-template-columns: 1fr;
    gap: 25px;
    padding: 0 15px;
  }
  
  .footer-title {
    font-size: 20px;
  }
  
  .footer-team h3,
  .footer-nav h3 {
    font-size: 16px;
  }
  
  .footer-bottom {
    text-align: center;
  }
  
  .footer-terms {
    flex-direction: column;
    gap: 8px;
  }
  
  .footer-terms span {
    display: none;
  }
}
</style>