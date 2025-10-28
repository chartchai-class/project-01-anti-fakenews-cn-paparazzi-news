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

  // Initialize mock data
  useEffect(() => {
    const initializeData = () => {
      const storedNews = getNews();
      if (storedNews.length === 0) {
        // If no data exists, create some mock news
        const mockNews = [
          {
            id: 1,
            title: 'Celebrity Spotted Dining with Mystery Woman',
            content: 'According to reports, a famous actor was spotted dining with a mystery woman at an upscale restaurant last night. The two were seen engaged in an animated conversation...',
            imageUrl: 'https://picsum.photos/id/1/800/400',
            reporter: 'Entertainment Reporter Mike',
            publishTime: '2024-01-15T18:30:00',
            votes: { fake: 45, notFake: 23 },
            comments: [
              { id: 1, userId: 'user1', content: 'This looks like a staged photo', voteType: 'fake', timestamp: '2024-01-15T19:00:00' },
              { id: 2, userId: 'user2', content: 'I think it\'s real, they\'ve been dating for a while', voteType: 'notFake', timestamp: '2024-01-15T19:30:00' }
            ]
          },
          {
            id: 2,
            title: 'Experts Predict Sharp Housing Price Increases This Year',
            content: 'Real estate experts stated in a recent interview that housing prices are expected to rise by more than 20% this year due to policy adjustments and increased market demand...',
            imageUrl: 'https://picsum.photos/id/20/800/400',
            reporter: 'Financial Journalist Lee',
            publishTime: '2024-01-14T10:00:00',
            votes: { fake: 120, notFake: 89 },
            comments: [
              { id: 1, userId: 'user3', content: 'This prediction is made every year, not credible', voteType: 'fake', timestamp: '2024-01-14T11:00:00' }
            ]
          },
          {
            id: 3,
            title: 'New Health Supplement Claims to Cure Multiple Diseases',
            content: 'A new health supplement has appeared on the market. Manufacturers claim it contains special ingredients that can cure multiple chronic diseases including hypertension and diabetes...',
            imageUrl: 'https://picsum.photos/id/96/800/400',
            reporter: 'Health Columnist Zhang',
            publishTime: '2024-01-13T14:20:00',
            votes: { fake: 203, notFake: 12 },
            comments: []
          },
          {
            id: 4,
            title: 'City Air Quality Continues to Improve',
            content: 'Latest data from environmental protection authorities shows that the city\'s air quality index has steadily decreased for three consecutive months, with significantly more days of blue skies...',
            imageUrl: 'https://picsum.photos/id/1015/800/400',
            reporter: 'Environmental Reporter Chen',
            publishTime: '2024-01-12T09:00:00',
            votes: { fake: 5, notFake: 156 },
            comments: []
          },
          {
            id: 5,
            title: 'New Study Finds Coffee May Extend Lifespan',
            content: 'Latest medical research indicates that moderate coffee consumption may help extend lifespan and reduce the risk of multiple chronic diseases...',
            imageUrl: 'https://picsum.photos/id/431/800/400',
            reporter: 'Health Editor Liu',
            publishTime: '2024-01-11T16:45:00',
            votes: { fake: 42, notFake: 58 },
            comments: []
          },
          {
            id: 6,
            title: 'Tech Giants Announce Major Climate Change Initiative',
            content: 'Five leading technology companies have joined forces to invest $1 billion in renewable energy projects over the next five years, promising to reduce carbon emissions industry-wide...',
            imageUrl: 'https://picsum.photos/id/119/800/400',
            reporter: 'Technology Correspondent Sarah',
            publishTime: '2024-01-10T13:20:00',
            votes: { fake: 18, notFake: 192 },
            comments: [
              { id: 1, userId: 'user4', content: 'This is a significant step for corporate responsibility', voteType: 'notFake', timestamp: '2024-01-10T14:00:00' }
            ]
          },
          {
            id: 7,
            title: 'New Diet Trend Promises Weight Loss Without Exercise',
            content: 'A controversial new diet claims followers can lose up to 10 pounds per week by eating specific food combinations, without needing to exercise or restrict calories...',
            imageUrl: 'https://picsum.photos/id/292/800/400',
            reporter: 'Lifestyle Writer Emma',
            publishTime: '2024-01-09T08:45:00',
            votes: { fake: 256, notFake: 32 },
            comments: [
              { id: 1, userId: 'user5', content: 'This sounds too good to be true', voteType: 'fake', timestamp: '2024-01-09T09:30:00' }
            ]
          },
          {
            id: 8,
            title: 'Major Breakthrough in Cancer Treatment Research',
            content: 'Scientists at a leading research institute have announced promising results from clinical trials of a new immunotherapy treatment that shows effectiveness against multiple cancer types...',
            imageUrl: 'https://picsum.photos/id/366/800/400',
            reporter: 'Science Reporter James',
            publishTime: '2024-01-08T15:10:00',
            votes: { fake: 12, notFake: 287 },
            comments: []
          },
          {
            id: 9,
            title: 'Conspiracy Theory Claims Government Is Hiding Alien Technology',
            content: 'An anonymous source has claimed that the government is secretly reverse-engineering alien technology in a hidden facility, with plans to release this technology to the public in 2025...',
            imageUrl: 'https://picsum.photos/id/380/800/400',
            reporter: 'UFO Enthusiast Website',
            publishTime: '2024-01-07T22:30:00',
            votes: { fake: 345, notFake: 45 },
            comments: [
              { id: 1, userId: 'user6', content: 'This is ridiculous and lacks evidence', voteType: 'fake', timestamp: '2024-01-08T00:15:00' },
              { id: 2, userId: 'user7', content: 'I think there might be some truth to this', voteType: 'notFake', timestamp: '2024-01-08T01:00:00' }
            ]
          },
          {
            id: 10,
            title: 'Economic Report Shows Strong Job Growth Last Quarter',
            content: 'Official government data released today shows that the economy added 325,000 new jobs last quarter, with unemployment rates dropping to their lowest level in 15 years...',
            imageUrl: 'https://picsum.photos/id/180/800/400',
            reporter: 'Economics Editor Mark',
            publishTime: '2024-01-06T11:00:00',
            votes: { fake: 28, notFake: 213 },
            comments: []
          },
          {
            id: 11,
            title: 'Social Media Platform Announces New Content Moderation Policy',
            content: 'The popular platform has revealed stricter guidelines for content moderation, promising to remove false information more quickly while protecting freedom of expression...',
            imageUrl: 'https://picsum.photos/id/160/800/400',
            reporter: 'Digital Media Analyst Lisa',
            publishTime: '2024-01-05T14:30:00',
            votes: { fake: 56, notFake: 178 },
            comments: []
          },
          {
            id: 12,
            title: 'Video Game Console Sales Break Records During Holiday Season',
            content: 'Industry data shows that next-generation console sales exceeded all expectations during the holiday season, with demand far outpacing supply in many regions...',
            imageUrl: 'https://picsum.photos/id/169/800/400',
            reporter: 'Gaming Journalist Tom',
            publishTime: '2024-01-04T10:20:00',
            votes: { fake: 15, notFake: 234 },
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
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-md">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-3">
              <h1 className="text-4xl font-bold flex items-center text-gray-900">
              <Link to="/" className="flex items-center group transition-all duration-300 hover:scale-105">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mr-4 text-primary-600 group-hover:text-primary-700 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Paparazzi News
              </Link>
            </h1>
            <nav className="hidden md:block">
              <ul className="flex space-x-12 items-center">
                <li>
                  <Link to="/" className="text-gray-700 hover:text-primary-600 font-semibold transition-all duration-300 py-3 px-4 rounded-lg hover:bg-primary-50 flex items-center text-lg border-b-2 border-primary-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Home
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
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

        {/* Footer - Gradient Background */}
        <footer className="bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 text-white py-8 mt-auto">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-200 mb-3 font-medium">&copy; 2024 Paparazzi News - Collaborative News Verification Platform</p>
            <p className="text-sm text-gray-400 mb-4">Identifying fake news through collective wisdom, building a trustworthy information environment</p>
            <div className="flex justify-center items-center space-x-4 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 hover:text-primary-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs">Transparency · Collaboration · Trust</span>
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
