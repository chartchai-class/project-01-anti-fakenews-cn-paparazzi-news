import React from 'react'
import { Link } from 'react-router-dom'

const NewsList = ({ news, currentFilter, setCurrentFilter }) => {
  // 格式化日期时间
  const formatDateTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // 计算可信度百分比
  const calculateTrustPercentage = (votes) => {
    const totalVotes = votes.fake + votes.notFake
    if (totalVotes === 0) return 50
    return Math.round((votes.notFake / totalVotes) * 100)
  }

  // 获取可信度颜色
  const getTrustColorClass = (percentage) => {
    if (percentage > 70) return 'bg-green-100 text-green-800'
    if (percentage > 40) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  // 获取新闻分类
  const getNewsCategory = (votes) => {
    const totalVotes = votes.fake + votes.notFake
    if (totalVotes === 0) return 'neutral'
    const trustPercentage = calculateTrustPercentage(votes)
    if (trustPercentage > 70) return 'notFake'
    if (trustPercentage < 40) return 'fake'
    return 'neutral'
  }

  // 分类新闻
  const fakeNews = news.filter(item => getNewsCategory(item.votes) === 'fake')
  const notFakeNews = news.filter(item => getNewsCategory(item.votes) === 'notFake')
  const neutralNews = news.filter(item => getNewsCategory(item.votes) === 'neutral')

  // 渲染新闻卡片
  const renderNewsCard = (item) => {
    const trustPercentage = calculateTrustPercentage(item.votes)
    const trustColorClass = getTrustColorClass(trustPercentage)
    
    return (
      <div 
        key={item.id} 
        className="glass rounded-2xl overflow-hidden hover:shadow-glass-lg transition-all duration-300 hover:-translate-y-2 h-full flex flex-col border border-white/30 card-hover group"
        aria-label={`新闻卡片：${item.title}`}
      >
              {/* 新闻图片 - 使用黄金比例优化 */}
              <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                />
                {/* 渐变遮罩提升文字可读性 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className={`absolute top-3 left-3 inline-block px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md ${trustColorClass} border border-white/30 shadow-lg whitespace-nowrap`}>
                  Trust: {trustPercentage}%
                </div>
              </div>
              
              {/* 新闻内容 */}
                <div className="p-5 sm:p-6 flex flex-col flex-grow bg-white/50 backdrop-blur-sm">
                {/* 标题 */}
                <h2 className="text-lg sm:text-xl font-bold mb-3 line-clamp-2 leading-snug group-hover:text-primary-600 transition-colors">
                  <Link to={`/news/${item.id}`} className="text-gray-800">
                    {item.title}
                  </Link>
                </h2>
                
                {/* 内容摘要 */}
                <p className="text-gray-600 mb-4 line-clamp-2 text-sm sm:text-base leading-relaxed">
                  {item.content}
                </p>
                
                {/* Meta Information */}
                <div className="flex flex-col sm:flex-row sm:justify-between items-center text-sm text-gray-500 mb-4 gap-2">
                  <span className="flex items-center whitespace-nowrap">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    By: {item.reporter}
                  </span>
                  <span className="flex items-center whitespace-nowrap">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {formatDateTime(item.publishTime)}
                  </span>
                </div>
                
                {/* Voting Statistics */}
                <div className="flex justify-between items-center mb-4 text-sm">
                  <div className="flex items-center space-x-5">
                    <span className="flex items-center text-red-500 hover:text-red-600 transition-colors whitespace-nowrap">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="font-medium">{item.votes.fake}</span>
                    </span>
                    <span className="flex items-center text-green-500 hover:text-green-600 transition-colors whitespace-nowrap">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="font-medium">{item.votes.notFake}</span>
                    </span>
                  </div>
                  <span className="flex items-center text-gray-500 hover:text-blue-600 transition-colors whitespace-nowrap">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    {item.comments.length} Comments
                  </span>
                </div>
                
                {/* 操作按钮 */}
                <div className="flex space-x-3 mt-auto pt-4 border-t border-gray-200/50">
                  <Link 
                    to={`/news/${item.id}`} 
                    className="flex-1 glass py-2.5 px-4 rounded-xl text-center hover:bg-white/80 transition-all duration-300 flex items-center justify-center text-sm font-semibold text-gray-700 hover:scale-105 whitespace-nowrap"
                    aria-label={`View details: ${item.title}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View Details
                  </Link>
                  <Link 
                    to={`/news/${item.id}/vote`} 
                    className="flex-1 bg-gradient-primary text-white py-2.5 px-4 rounded-xl text-center hover:shadow-lg hover:shadow-primary-500/50 transition-all duration-300 flex items-center justify-center shadow-md text-sm font-semibold hover:scale-105 whitespace-nowrap"
                    aria-label={`Vote for news: ${item.title}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Vote Now
                  </Link>
                </div>
              </div>
            </div>
          )
      }

      return (
        <div className="news-list max-w-7xl mx-auto">
          {/* 筛选按钮 - 玻璃拟态风格，优化尺寸 */}
          <div className="filter-buttons flex flex-wrap gap-2 sm:gap-3 mb-8 sm:mb-10 justify-center px-2 sm:px-4">
            <button
              onClick={() => setCurrentFilter('all')}
              className={`px-4 py-2 text-xs font-semibold rounded-full transition-all duration-300 flex items-center whitespace-nowrap ${
                currentFilter === 'all' 
                  ? 'bg-gradient-primary text-white shadow-lg shadow-primary-500/50 scale-105 ring-2 ring-primary-400/50' 
                  : 'glass text-gray-700 hover:bg-white/90 hover:scale-105 hover:shadow-md'
              }`}
              aria-label="View all news"
              aria-pressed={currentFilter === 'all'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              All News
            </button>
            <button
              onClick={() => setCurrentFilter('notFake')}
              className={`px-4 py-2 text-xs font-semibold rounded-full transition-all duration-300 flex items-center whitespace-nowrap ${
                currentFilter === 'notFake' 
                  ? 'bg-gradient-true text-white shadow-lg shadow-true-500/50 scale-105 ring-2 ring-true-400/50' 
                  : 'glass text-gray-700 hover:bg-white/90 hover:scale-105 hover:shadow-md'
              }`}
              aria-label="View verified news"
              aria-pressed={currentFilter === 'notFake'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Verified
            </button>
            <button
              onClick={() => setCurrentFilter('neutral')}
              className={`px-4 py-2 text-xs font-semibold rounded-full transition-all duration-300 flex items-center whitespace-nowrap ${
                currentFilter === 'neutral' 
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-lg shadow-yellow-500/50 scale-105 ring-2 ring-yellow-400/50' 
                  : 'glass text-gray-700 hover:bg-white/90 hover:scale-105 hover:shadow-md'
              }`}
              aria-label="View neutral news"
              aria-pressed={currentFilter === 'neutral'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Neutral
            </button>
            <button
              onClick={() => setCurrentFilter('fake')}
              className={`px-4 py-2 text-xs font-semibold rounded-full transition-all duration-300 flex items-center whitespace-nowrap ${
                currentFilter === 'fake' 
                  ? 'bg-gradient-fake text-white shadow-lg shadow-fake-600/50 scale-105 ring-2 ring-red-400/50' 
                  : 'glass text-gray-700 hover:bg-white/90 hover:scale-105 hover:shadow-md'
              }`}
              aria-label="View fake news"
              aria-pressed={currentFilter === 'fake'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Fake News
            </button>
          </div>

          {/* 新闻列表视图 - 统一使用分页后的数据 */}
          {news.length > 0 && (
            <div className="animate-fade-in grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5 sm:gap-6 lg:gap-7">
              {news.map((item, index) => (
                <div key={item.id} className={`transition-all duration-500 delay-${index % 3 * 100} opacity-0 transform translate-y-4 animate-fade-up`}>
                  {renderNewsCard(item)}
                </div>
              ))}
            </div>
          )}
      
      {/* Empty state */}
      {news.length === 0 && (
        <div className="text-center py-16 sm:py-20 glass rounded-xl shadow-glass-lg border border-white/30">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-gray-300 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-500 text-lg font-medium">
            {currentFilter === 'all' ? 'No news available' : 
             currentFilter === 'notFake' ? 'No verified news found' :
             currentFilter === 'neutral' ? 'No neutral news found' :
             'No fake news found'}
          </p>
          <p className="text-gray-400 mt-2 text-sm">
            {currentFilter === 'all' ? 'Please try again later' : 'Try selecting a different category or view all news'}
          </p>
          {currentFilter !== 'all' && (
            <button 
              onClick={() => setCurrentFilter('all')}
              className="mt-6 px-6 py-2.5 bg-gradient-primary text-white rounded-xl hover:shadow-lg hover:shadow-primary-500/50 transition-all duration-300 font-semibold flex items-center mx-auto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              View All News
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default NewsList