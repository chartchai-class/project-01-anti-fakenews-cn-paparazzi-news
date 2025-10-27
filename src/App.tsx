import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import './App.css'

// 导入页面组件
import NewsList from './pages/NewsList.jsx'
import NewsDetail from './pages/NewsDetail.jsx'
import VotePage from './pages/VotePage.jsx'

// 导入工具函数
import { getNews, getNewsById } from './utils/storage.js'

function App() {
  const [news, setNews] = useState<any[]>([])
  const [currentFilter, setCurrentFilter] = useState('all') // all, fake, notFake

  useEffect(() => {
    // 初始化模拟数据
    const initializeData = () => {
      const storedNews = getNews()
      if (storedNews.length === 0) {
        // 如果没有数据，创建一些模拟新闻
        const mockNews = [
          {
            id: 1,
            title: '某明星被拍到与神秘女子共进晚餐',
            content: '据报道，某知名男星昨晚被拍到与一位神秘女子在高档餐厅共进晚餐，两人相谈甚欢...',
            imageUrl: 'https://picsum.photos/id/1/800/400',
            reporter: '狗仔队小王',
            publishTime: '2024-01-15T18:30:00',
            votes: { fake: 45, notFake: 23 },
            comments: [
              { id: 1, userId: 'user1', content: '这看起来像是摆拍', voteType: 'fake', timestamp: '2024-01-15T19:00:00' },
              { id: 2, userId: 'user2', content: '我觉得是真的，他们已经约会很久了', voteType: 'notFake', timestamp: '2024-01-15T19:30:00' }
            ]
          },
          {
            id: 2,
            title: '专家预测今年房价将大幅上涨',
            content: '房地产专家在最新访谈中表示，受政策调整和市场需求增加的影响，今年房价预计将上涨20%以上...',
            imageUrl: 'https://picsum.photos/id/20/800/400',
            reporter: '财经记者小李',
            publishTime: '2024-01-14T10:00:00',
            votes: { fake: 120, notFake: 89 },
            comments: [
              { id: 1, userId: 'user3', content: '这种预测每年都有，不可信', voteType: 'fake', timestamp: '2024-01-14T11:00:00' }
            ]
          },
          {
            id: 3,
            title: '新型健康食品声称能治愈多种疾病',
            content: '市场上出现一种新型健康食品，厂商宣称其含有特殊成分，能够治愈高血压、糖尿病等多种慢性疾病...',
            imageUrl: 'https://picsum.photos/id/96/800/400',
            reporter: '健康专栏记者小张',
            publishTime: '2024-01-13T14:20:00',
            votes: { fake: 203, notFake: 12 },
            comments: []
          }
        ]
        // 存储模拟数据到localStorage
        localStorage.setItem('news', JSON.stringify(mockNews))
        setNews(mockNews)
      } else {
        setNews(storedNews)
      }
    }

    initializeData()
  }, [])

  const filteredNews = news.filter(item => {
    if (currentFilter === 'all') return true
    if (currentFilter === 'fake') return item.votes.fake > item.votes.notFake
    if (currentFilter === 'notFake') return item.votes.notFake > item.votes.fake
    return true
  })

  return (
    <Router>
      <div className="App min-h-screen flex flex-col bg-gray-100">
        {/* 头部导航 */}
        <header className="bg-white shadow-md">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-600">
              <Link to="/">Paparazzi News</Link>
            </h1>
            <nav>
              <ul className="flex space-x-6">
                <li>
                  <Link to="/" className="text-gray-600 hover:text-blue-600">首页</Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        {/* 主要内容 */}
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route 
              path="/" 
              element={
                <NewsList 
                  news={filteredNews} 
                  currentFilter={currentFilter} 
                  setCurrentFilter={setCurrentFilter} 
                />
              } 
            />
            <Route path="/news/:id" element={<NewsDetail getNewsById={getNewsById} />} />
            <Route path="/news/:id/vote" element={<VotePage />} />
          </Routes>
        </main>

        {/* 页脚 */}
        <footer className="bg-gray-800 text-white py-4">
          <div className="container mx-auto px-4 text-center">
            <p>&copy; 2024 Paparazzi News - 新闻真实性协作判断平台</p>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App
