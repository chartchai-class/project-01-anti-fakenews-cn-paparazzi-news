import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getNewsById, addVoteToNews } from '../utils/storage.js'

const VotePage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [news, setNews] = useState(null)
  const [voteType, setVoteType] = useState(null)
  const [voted, setVoted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [voting, setVoting] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  useEffect(() => {
    const fetchNewsDetail = () => {
      try {
        const newsData = getNewsById(id)
        if (newsData) {
          setNews(newsData)
          // 检查用户是否已经投票
          const userVoteKey = `user_vote_${id}`
          const hasVoted = localStorage.getItem(userVoteKey)
          if (hasVoted) {
            setVoted(true)
            setVoteType(hasVoted)
          }
        } else {
          setError('新闻不存在')
        }
      } catch (err) {
        setError('加载新闻失败')
        console.error('加载新闻详情失败:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchNewsDetail()
  }, [id])

  // 处理投票
  const handleVote = async (type) => {
    if (voted || voting) {
      return
    }

    try {
      // 设置投票中状态
      setVoting(true)
      
      const success = addVoteToNews(id, type)
      
      if (success) {
        // 记录用户投票，防止重复投票
        const userVoteKey = `user_vote_${id}`
        localStorage.setItem(userVoteKey, type)
        
        setVoted(true)
        setVoteType(type)
        
        // 更新本地新闻数据
        const updatedNews = getNewsById(id)
        setNews(updatedNews)
        
        // 显示成功消息
        setShowSuccessMessage(true)
        
        // 延迟后重定向，给用户足够的视觉反馈时间
        setTimeout(() => {
          navigate(`/news/${id}`)
        }, 1500)
      } else {
        throw new Error('投票失败，请重试')
      }
    } catch (err) {
      // 使用更友好的提示替代alert
      setError(err.message)
      // 3秒后清除错误提示
      setTimeout(() => setError(null), 3000)
    } finally {
      setVoting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-lg text-gray-600">正在加载投票页面...</p>
      </div>
    )
  }

  if (error || !news) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-red-500 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-red-600 text-lg mb-6">{error || '新闻不存在'}</p>
        <button
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={() => navigate('/')}
        >
          返回首页
        </button>
      </div>
    )
  }

  return (
    <div className="vote-page max-w-2xl mx-auto p-4 md:p-6 min-h-screen flex flex-col">
      {/* 返回按钮 */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md mb-6 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        返回上一页
      </button>

      <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 flex-grow">
        {/* 页面标题 */}
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-800">判断新闻真实性</h1>
        
        {/* 错误提示 */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-md border border-red-100 text-center animate-shake">
            {error}
          </div>
        )}
        
        {/* 成功提示 */}
        {showSuccessMessage && (
          <div className="mb-6 p-3 bg-green-50 text-green-600 rounded-md border border-green-100 text-center animate-pulse">
            投票成功！感谢您的参与
          </div>
        )}
        
        {/* 新闻摘要 */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">{news.title}</h2>
          <p className="text-gray-600 line-clamp-4 mb-4 leading-relaxed">{news.content}</p>
          {news.imageUrl && (
            <div className="rounded-lg overflow-hidden mb-4 shadow-sm">
              <img 
                src={news.imageUrl} 
                alt={news.title} 
                className="w-full h-auto max-h-60 object-cover transition-transform duration-300 hover:scale-102"
              />
            </div>
          )}
        </div>

        {/* 投票提示 */}
        <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-blue-800 text-center">
            请基于您的判断，对这则新闻的真实性进行投票。您的参与将帮助社区更好地识别可能的假新闻。
          </p>
        </div>

        {/* 投票按钮 */}
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-8 max-w-md mx-auto">
          <button
            onClick={() => handleVote('fake')}
            disabled={voted || voting}
            className={`flex items-center justify-center px-6 py-3 rounded-lg text-base font-medium transition-all duration-300 w-full ${voted || voting
              ? (voteType === 'fake' 
                ? 'bg-red-600 text-white scale-105 shadow-md'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed opacity-70')
              : 'bg-red-100 text-red-600 hover:bg-red-200 hover:shadow-md hover:translate-y-[-2px]'}`}
            aria-pressed={voted && voteType === 'fake'}
          >
            {voting && voteType === 'fake' ? (
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-5 w-5 mr-2 ${voted && voteType === 'fake' ? 'text-white' : 'text-red-500'}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            )}
            假新闻
          </button>

          <button
            onClick={() => handleVote('notFake')}
            disabled={voted || voting}
            className={`flex items-center justify-center px-6 py-3 rounded-lg text-base font-medium transition-all duration-300 w-full ${voted || voting
              ? (voteType === 'notFake'
                ? 'bg-green-600 text-white scale-105 shadow-md'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed opacity-70')
              : 'bg-green-100 text-green-600 hover:bg-green-200 hover:shadow-md hover:translate-y-[-2px]'}`}
            aria-pressed={voted && voteType === 'notFake'}
          >
            {voting && voteType === 'notFake' ? (
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-5 w-5 mr-2 ${voted && voteType === 'notFake' ? 'text-white' : 'text-green-500'}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            )}
            真新闻
          </button>
        </div>

        {/* 当前投票结果预览 */}
        <div className="bg-gray-50 p-6 rounded-xl shadow-inner">
          <h3 className="text-lg font-medium mb-4 text-gray-800">当前投票结果</h3>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2 items-center">
                <div className="flex items-center">
                  <span className="h-3 w-3 rounded-full bg-red-500 mr-2"></span>
                  <span className="font-medium text-red-600">虚假新闻</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-800 font-medium">{news.votes.fake + (voting && voteType === 'fake' ? 1 : 0)} 票</span>
                  {news.votes.fake + news.votes.notFake > 0 && (
                    <span className="text-gray-500">
                      {((news.votes.fake + (voting && voteType === 'fake' ? 1 : 0)) / (news.votes.fake + news.votes.notFake + (voting ? 1 : 0)) * 100).toFixed(1)}%
                    </span>
                  )}
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-red-500 h-full rounded-full transition-all duration-700 ease-out"
                  style={{ 
                      width: `${news.votes.fake + news.votes.notFake > 0 
                        ? ((news.votes.fake + (voting && voteType === 'fake' ? 1 : 0)) / (news.votes.fake + news.votes.notFake + (voting ? 1 : 0)) * 100) 
                        : (voting && voteType === 'fake' ? 100 : 0)}%` 
                    }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2 items-center">
                <div className="flex items-center">
                  <span className="h-3 w-3 rounded-full bg-green-500 mr-2"></span>
                  <span className="font-medium text-green-600">真实新闻</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-800 font-medium">{news.votes.notFake + (voting && voteType === 'notFake' ? 1 : 0)} 票</span>
                  {news.votes.fake + news.votes.notFake > 0 && (
                    <span className="text-gray-500">
                      {((news.votes.notFake + (voting && voteType === 'notFake' ? 1 : 0)) / (news.votes.fake + news.votes.notFake + (voting ? 1 : 0)) * 100).toFixed(1)}%
                    </span>
                  )}
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-green-500 h-full rounded-full transition-all duration-700 ease-out"
                  style={{ 
                      width: `${news.votes.fake + news.votes.notFake > 0 
                        ? ((news.votes.notFake + (voting && voteType === 'notFake' ? 1 : 0)) / (news.votes.fake + news.votes.notFake + (voting ? 1 : 0)) * 100) 
                        : (voting && voteType === 'notFake' ? 100 : 0)}%` 
                    }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-center text-gray-500 text-sm font-medium">
            总票数: <span className="text-gray-800">{news.votes.fake + news.votes.notFake + (voting ? 1 : 0)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VotePage