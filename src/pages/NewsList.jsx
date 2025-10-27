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
        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full flex flex-col border border-gray-200"
        aria-label={`新闻卡片：${item.title}`}
      >
              {/* 新闻图片 - 使用黄金比例优化 */}
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                />
                <div className={`absolute top-3 left-3 inline-block px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm bg-opacity-90 ${trustColorClass}`}>
                  可信度: {trustPercentage}%
                </div>
              </div>
              
              {/* 新闻内容 */}
                <div className="p-4 sm:p-6 flex flex-col flex-grow">
                {/* 标题 */}
                <h2 className="text-lg sm:text-xl font-bold mb-3 line-clamp-2 leading-snug">
                  <Link to={`/news/${item.id}`} className="text-gray-800 hover:text-blue-600 transition-colors duration-200">
                    {item.title}
                  </Link>
                </h2>
                
                {/* 内容摘要 */}
                <p className="text-gray-600 mb-4 line-clamp-2 text-sm sm:text-base leading-relaxed">
                  {item.content}
                </p>
                
                {/* 元信息 */}
                <div className="flex flex-col sm:flex-row sm:justify-between items-center text-sm text-gray-500 mb-4 gap-2">
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {item.reporter}
                  </span>
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {formatDateTime(item.publishTime)}
                  </span>
                </div>
                
                {/* 投票统计 */}
                <div className="flex justify-between items-center mb-4 text-sm">
                  <div className="flex items-center space-x-5">
                    <span className="flex items-center text-red-500 hover:text-red-600 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="font-medium">{item.votes.fake}</span>
                    </span>
                    <span className="flex items-center text-green-500 hover:text-green-600 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="font-medium">{item.votes.notFake}</span>
                    </span>
                  </div>
                  <span className="flex items-center text-gray-500 hover:text-blue-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    {item.comments.length} 条评论
                  </span>
                </div>
                
                {/* 操作按钮 */}
                <div className="flex space-x-3 mt-auto pt-3 border-t border-gray-100">
                  <Link 
                    to={`/news/${item.id}`} 
                    className="flex-1 bg-gray-50 text-gray-800 py-2.5 px-4 rounded-lg text-center hover:bg-gray-100 transition-all transform duration-200 flex items-center justify-center border border-gray-200 text-sm font-medium"
                    aria-label={`查看新闻详情：${item.title}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    查看详情
                  </Link>
                  <Link 
                    to={`/news/${item.id}/vote`} 
                    className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg text-center hover:bg-blue-700 transition-all transform duration-200 flex items-center justify-center shadow-sm text-sm font-medium"
                    aria-label={`为新闻投票：${item.title}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    我要投票
                  </Link>
                </div>
              </div>
            </div>
          )
      }

      return (
        <div className="news-list max-w-7xl mx-auto">
          {/* 筛选按钮 - 玻璃拟态风格 */}
          <div className="filter-buttons flex flex-wrap gap-3 sm:gap-4 mb-8 sm:mb-10 justify-center px-2 sm:px-4">
            <button
              onClick={() => setCurrentFilter('all')}
              className={`px-5 sm:px-6 py-3 text-sm font-semibold rounded-full transition-all duration-300 flex items-center ${
                currentFilter === 'all' 
                  ? 'bg-gradient-primary text-white shadow-lg shadow-primary-500/50 scale-105 ring-2 ring-primary-400/50' 
                  : 'glass text-gray-700 hover:bg-white/90 hover:scale-105 hover:shadow-md'
              }`}
              aria-label="查看全部新闻"
              aria-pressed={currentFilter === 'all'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              全部新闻
            </button>
            <button
              onClick={() => setCurrentFilter('notFake')}
              className={`px-5 sm:px-6 py-3 text-sm font-semibold rounded-full transition-all duration-300 flex items-center ${
                currentFilter === 'notFake' 
                  ? 'bg-gradient-true text-white shadow-lg shadow-true-500/50 scale-105 ring-2 ring-true-400/50' 
                  : 'glass text-gray-700 hover:bg-white/90 hover:scale-105 hover:shadow-md'
              }`}
              aria-label="查看真实新闻"
              aria-pressed={currentFilter === 'notFake'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              真实新闻
            </button>
            <button
              onClick={() => setCurrentFilter('neutral')}
              className={`px-5 sm:px-6 py-3 text-sm font-semibold rounded-full transition-all duration-300 flex items-center ${
                currentFilter === 'neutral' 
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-lg shadow-yellow-500/50 scale-105 ring-2 ring-yellow-400/50' 
                  : 'glass text-gray-700 hover:bg-white/90 hover:scale-105 hover:shadow-md'
              }`}
              aria-label="查看中立新闻"
              aria-pressed={currentFilter === 'neutral'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              中立新闻
            </button>
            <button
              onClick={() => setCurrentFilter('fake')}
              className={`px-5 sm:px-6 py-3 text-sm font-semibold rounded-full transition-all duration-300 flex items-center ${
                currentFilter === 'fake' 
                  ? 'bg-gradient-fake text-white shadow-lg shadow-fake-600/50 scale-105 ring-2 ring-red-400/50' 
                  : 'glass text-gray-700 hover:bg-white/90 hover:scale-105 hover:shadow-md'
              }`}
              aria-label="查看虚假新闻"
              aria-pressed={currentFilter === 'fake'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              虚假新闻
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
      
      {/* 空状态 */}
      {news.length === 0 && (
        <div className="text-center py-16 sm:py-20 bg-white rounded-xl shadow-sm border border-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-gray-300 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-500 text-lg font-medium">
            {currentFilter === 'all' ? '暂无新闻数据' : 
             currentFilter === 'notFake' ? '没有找到已验证的新闻' :
             currentFilter === 'neutral' ? '没有找到待验证的新闻' :
             '没有找到疑似虚假的新闻'}
          </p>
          <p className="text-gray-400 mt-2 text-sm">
            {currentFilter === 'all' ? '请稍后再试' : '尝试选择其他分类查看，或查看全部新闻'}
          </p>
          {currentFilter !== 'all' && (
            <button 
              onClick={() => setCurrentFilter('all')}
              className="mt-6 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 transform hover:scale-105 flex items-center mx-auto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              查看全部新闻
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default NewsList