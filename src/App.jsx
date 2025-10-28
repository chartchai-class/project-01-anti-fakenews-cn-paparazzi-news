import { useState, useEffect, useCallback } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import './App.css'

// 导入页面组件（稍后创建）
import NewsList from './pages/NewsList.jsx'
import NewsDetail from './pages/NewsDetail.jsx'
import VotePage from './pages/VotePage.jsx'
import Pagination from './components/Pagination'

// 导入工具函数（稍后创建）
import { getNews, getNewsById } from './utils/storage.js'

function App() {
  const [news, setNews] = useState([])
  const [currentFilter, setCurrentFilter] = useState('all') // all, fake, notFake, neutral
  const [lastUpdateTime, setLastUpdateTime] = useState(0)
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  // 防抖函数
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  };

  // 重新加载新闻数据
  const refreshNews = () => {
    try {
      const storedNews = getNews();
      setNews(storedNews);
      setLastUpdateTime(Date.now());
    } catch (error) {
      console.error('刷新新闻数据失败:', error);
    }
  };

  // 防抖处理的刷新函数
  const debouncedRefreshNews = debounce(refreshNews, 300);

  // 初始化模拟数据
  useEffect(() => {
    const initializeData = () => {
      const storedNews = getNews();
      if (storedNews.length === 0) {
        // Mock news data in English
        const mockNews = [
          {
            id: 1,
            title: 'Celebrity Spotted Dining with Mystery Woman at Upscale Restaurant',
            content: 'According to recent reports, a well-known celebrity was photographed dining with an unidentified woman at an upscale restaurant last evening. The two appeared to be in deep conversation throughout their meal. Eyewitnesses claim the encounter lasted over two hours.',
            imageUrl: 'https://picsum.photos/id/1/800/400',
            reporter: 'Sarah Johnson',
            publishTime: '2024-01-15T18:30:00',
            votes: { fake: 45, notFake: 23 },
            comments: [
              { id: 1, userId: 'user1', content: 'This looks staged and possibly fake', voteType: 'fake', timestamp: '2024-01-15T19:00:00' },
              { id: 2, userId: 'user2', content: 'Genuine moment captured naturally', voteType: 'notFake', timestamp: '2024-01-15T19:30:00' }
            ]
          },
          {
            id: 2,
            title: 'Tech Giant Announces Revolutionary AI Breakthrough',
            content: 'A leading technology company revealed its latest artificial intelligence innovation that promises to transform how we interact with digital devices. The new system reportedly understands context and nuance better than any previous model, with applications ranging from healthcare to education.',
            imageUrl: 'https://picsum.photos/id/20/800/400',
            reporter: 'Michael Chen',
            publishTime: '2024-01-14T10:00:00',
            votes: { fake: 120, notFake: 89 },
            comments: [
              { id: 1, userId: 'user3', content: 'Skeptical about the claims until I see real results', voteType: 'fake', timestamp: '2024-01-14T11:00:00' }
            ]
          },
          {
            id: 3,
            title: 'Scientists Discover New Planet in Habitable Zone',
            content: 'Astronomers have identified a potentially habitable exoplanet orbiting a star similar to our sun. Located 120 light-years away, this planet receives just the right amount of energy to potentially support liquid water. The discovery opens new possibilities for finding extraterrestrial life.',
            imageUrl: 'https://picsum.photos/id/96/800/400',
            reporter: 'Dr. Emily Thompson',
            publishTime: '2024-01-13T14:20:00',
            votes: { fake: 203, notFake: 12 },
            comments: []
          },
          {
            id: 4,
            title: 'Global Climate Summit Reaches Historic Agreement',
            content: 'World leaders at the annual climate conference reached a landmark agreement to reduce carbon emissions by 50% over the next decade. The plan includes renewable energy investments, carbon pricing mechanisms, and international cooperation on green technology transfer.',
            imageUrl: 'https://picsum.photos/id/1015/800/400',
            reporter: 'James Wilson',
            publishTime: '2024-01-12T09:00:00',
            votes: { fake: 5, notFake: 156 },
            comments: []
          },
          {
            id: 5,
            title: 'New Study Links Exercise to Improved Mental Health',
            content: 'Research from leading universities shows that regular physical activity significantly reduces symptoms of anxiety and depression. The study followed thousands of participants over five years, demonstrating that even moderate exercise provides substantial mental health benefits.',
            imageUrl: 'https://picsum.photos/id/431/800/400',
            reporter: 'Lisa Anderson',
            publishTime: '2024-01-11T16:45:00',
            votes: { fake: 42, notFake: 58 },
            comments: []
          },
          {
            id: 6,
            title: 'Breakthrough in Quantum Computing Achieves New Milestone',
            content: 'Scientists at a major research institution have successfully demonstrated quantum entanglement over unprecedented distances, bringing practical quantum computers one step closer to reality. The achievement could revolutionize cryptography and complex problem-solving.',
            imageUrl: 'https://picsum.photos/id/1074/800/400',
            reporter: 'David Martinez',
            publishTime: '2024-01-10T11:20:00',
            votes: { fake: 78, notFake: 142 },
            comments: []
          },
          {
            id: 7,
            title: 'Renewable Energy Sets New Global Records',
            content: 'Solar and wind power installations reached record highs this quarter, accounting for 60% of all new electricity generation capacity worldwide. This milestone marks a significant shift away from fossil fuels towards sustainable energy sources.',
            imageUrl: 'https://picsum.photos/id/1080/800/400',
            reporter: 'Amanda Brooks',
            publishTime: '2024-01-09T14:30:00',
            votes: { fake: 23, notFake: 189 },
            comments: []
          },
          {
            id: 8,
            title: 'Major Breakthrough in Cancer Treatment Research',
            content: 'Medical researchers have developed a novel immunotherapy approach that shows promise in treating previously untreatable forms of cancer. Early clinical trials demonstrate significant tumor reduction rates with minimal side effects.',
            imageUrl: 'https://picsum.photos/id/1018/800/400',
            reporter: 'Dr. Robert Kim',
            publishTime: '2024-01-08T09:15:00',
            votes: { fake: 15, notFake: 205 },
            comments: []
          }
        ];
        // 存储模拟数据到localStorage
        localStorage.setItem('news', JSON.stringify(mockNews));
        setNews(mockNews);
      } else {
        setNews(storedNews);
      }
    };

    initializeData();
  }, []);

  // 处理筛选逻辑
  const handleFilterChange = (filter) => {
    setCurrentFilter(filter)
    // 重置到第一页
    setCurrentPage(1)
  }

  // 获取筛选后的新闻列表
  const getFilteredNews = useCallback(() => {
    if (currentFilter === 'all') {
      return [...news].sort((a, b) => new Date(b.publishTime) - new Date(a.publishTime))
    } else if (currentFilter === 'fake') {
      return news
        .filter(item => {
          const totalVotes = item.votes.fake + item.votes.notFake
          return totalVotes > 0 && (item.votes.fake / totalVotes) > 0.7
        })
        .sort((a, b) => {
          const aRatio = a.votes.fake / (a.votes.fake + a.votes.notFake)
          const bRatio = b.votes.fake / (b.votes.fake + b.votes.notFake)
          return bRatio - aRatio
        })
    } else if (currentFilter === 'notFake') {
      return news
        .filter(item => {
          const totalVotes = item.votes.fake + item.votes.notFake
          return totalVotes > 0 && (item.votes.notFake / totalVotes) > 0.7
        })
        .sort((a, b) => {
          const aRatio = a.votes.notFake / (a.votes.fake + a.votes.notFake)
          const bRatio = b.votes.notFake / (b.votes.fake + b.votes.notFake)
          return bRatio - aRatio
        })
    } else if (currentFilter === 'neutral') {
      return news
        .filter(item => {
          const totalVotes = item.votes.fake + item.votes.notFake
          if (totalVotes === 0) return false
          const fakeRatio = item.votes.fake / totalVotes
          return fakeRatio >= 0.4 && fakeRatio <= 0.7
        })
        .sort((a, b) => new Date(b.publishTime) - new Date(a.publishTime))
    }
  }, [news, currentFilter])

  // 计算分页后的当前页面数据
  const getPaginatedNews = () => {
    const filteredNews = getFilteredNews()
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    return filteredNews.slice(indexOfFirstItem, indexOfLastItem)
  }
  
  // 根据当前过滤器筛选新闻 - 保留向后兼容
  const filteredNews = getFilteredNews() || news.filter(item => {
    if (currentFilter === 'all') return true;
    
    const totalVotes = item.votes.fake + item.votes.notFake;
    if (totalVotes === 0) return currentFilter === 'neutral';
    
    const trustPercentage = (item.votes.notFake / totalVotes) * 100;
    
    if (currentFilter === 'fake') return trustPercentage < 40;
    if (currentFilter === 'notFake') return trustPercentage > 70;
    if (currentFilter === 'neutral') return trustPercentage >= 40 && trustPercentage <= 70;
    
    return true;
  });

  // 全局更新函数，供子组件调用
  const updateNewsData = (updatedNewsId) => {
    debouncedRefreshNews();
  };

  return (
    <Router>
      <div className="App min-h-screen flex flex-col">
        {/* 头部导航 - 毛玻璃效果 */}
        <header className="glass sticky top-0 z-50 h-16 border-b border-white/20">
          <div className="container mx-auto px-4 h-full flex justify-between items-center">
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              <Link to="/" className="flex items-center group transition-all duration-300 hover:scale-105">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2.5 text-primary-600 group-hover:text-primary-700 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Paparazzi News
              </Link>
            </h1>
            <nav className="hidden md:block">
              <ul className="flex space-x-8 items-center">
                <li>
                  <Link to="/" className="text-gray-700 hover:text-primary-600 font-semibold transition-all duration-300 py-2 px-3 rounded-lg hover:bg-primary-50 flex items-center text-sm border-b-2 border-primary-600 whitespace-nowrap">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Home
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        {/* 主要内容 */}
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <Routes>
            <Route 
              path="/" 
              element={
                <>
                  <NewsList 
                    news={getPaginatedNews()} 
                    currentFilter={currentFilter} 
                    setCurrentFilter={handleFilterChange} 
                  />
                  
                  {/* 分页控件 */}
                  <Pagination
                    totalItems={getFilteredNews().length}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                  />
                </>
              } 
            />
            <Route path="/news/:id" element={<NewsDetail getNewsById={getNewsById} />} />
            <Route path="/news/:id/vote" element={<VotePage />} />
          </Routes>
        </main>

        {/* 页脚 - 渐变背景 */}
        <footer className="bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 text-white py-8 mt-auto">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-200 mb-3 font-medium">&copy; 2024 Paparazzi News - Collaborative News Verification Platform</p>
            <p className="text-sm text-gray-400 mb-4">Using collective intelligence to identify fake news and build a trustworthy information environment</p>
            <div className="flex justify-center items-center space-x-4 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 hover:text-primary-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs">Transparent · Collaborative · Trusted</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 hover:text-primary-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App
