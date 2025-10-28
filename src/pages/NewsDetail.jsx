import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { addCommentToNews } from '../utils/storage.js'

const NewsDetail = ({ getNewsById }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [news, setNews] = useState(null)
  const [commentText, setCommentText] = useState('')
  const [commentVoteType, setCommentVoteType] = useState('fake')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const commentsEndRef = useRef(null)
  const commentFormRef = useRef(null)

  useEffect(() => {
    const fetchNewsDetail = () => {
      try {
        const newsData = getNewsById(id)
        if (newsData) {
    setNews(newsData)
  } else {
    setError('News not found')
  }
} catch (err) {
  setError('Failed to load news')
  console.error('Failed to load news details:', err)
} finally {
        setLoading(false)
      }
    }

    fetchNewsDetail()
  }, [id])

  // 格式化日期时间
  const formatDateTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  // 计算投票百分比
  const calculatePercentage = (value, total) => {
    if (total === 0) return 0
    return Math.round((value / total) * 100)
  }

  // 滚动到评论底部
  const scrollToBottom = () => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // 处理评论提交
  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    
    if (!commentText.trim()) {
      setError('评论内容不能为空')
      setTimeout(() => setError(null), 3000)
      return
    }
    
    // 防止重复提交
    if (isSubmitting) return
    
    try {
      setIsSubmitting(true)
      
      const comment = {
        userId: `user_${Date.now()}`,
        content: commentText.trim(),
        voteType: commentVoteType,
        timestamp: new Date().toISOString()
      }
      
      const success = addCommentToNews(id, comment)
      
      if (success) {
        // 更新新闻数据
        const updatedNews = getNewsById(id)
        setNews(updatedNews)
        
        // 清空评论输入
        setCommentText('')
        
        // 显示成功消息
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
        
        // 滚动到评论底部查看新评论
        setTimeout(scrollToBottom, 100)
      } else {
        throw new Error('评论发布失败，请重试')
      }
    } catch (err) {
      setError(err.message)
      setTimeout(() => setError(null), 3000)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-lg text-gray-600">Loading news details...</p>
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
        <p className="text-red-600 text-lg mb-6">{error || 'News not found'}</p>
        <button
          className="px-6 py-2 bg-gradient-primary text-white rounded-xl hover:shadow-lg hover:shadow-primary-500/50 transition-all duration-300 font-semibold"
          onClick={() => navigate('/')}
        >
          Back to Home
        </button>
      </div>
    )
  }

  const totalVotes = news.votes.fake + news.votes.notFake
  const fakePercentage = calculatePercentage(news.votes.fake, totalVotes)
  const notFakePercentage = calculatePercentage(news.votes.notFake, totalVotes)

  return (
    <div className="news-detail max-w-4xl mx-auto p-4 sm:p-6 md:p-8 min-h-screen flex flex-col glass rounded-2xl border border-white/30 shadow-glass-lg">
      {/* 返回按钮 */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center px-4 py-2.5 glass hover:bg-white/80 rounded-xl mb-6 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 text-gray-700 font-medium hover:scale-105"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      {/* 新闻标题 */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-5 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">{news.title}</h1>

      {/* 元信息 */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">
        <span className="whitespace-nowrap">Reporter: {news.reporter}</span>
        <span className="whitespace-nowrap">Published: {formatDateTime(news.publishTime)}</span>
      </div>

      {/* 新闻图片 */}
      <div className="mb-6 sm:mb-8 rounded-2xl overflow-hidden shadow-glass-lg border border-white/30">
        <img 
          src={news.imageUrl} 
          alt={news.title} 
          className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
          style={{ maxHeight: '450px' }}
        />
      </div>

      {/* 新闻内容 */}
      <div className="prose max-w-none mb-6 sm:mb-8 text-gray-700 leading-relaxed">
        <p className="text-sm sm:text-base md:text-lg whitespace-pre-line">{news.content}</p>
      </div>

      {/* 投票统计 */}
      <div className="glass p-6 sm:p-8 rounded-2xl mb-6 sm:mb-8 border border-white/30">
        <h2 className="text-xl sm:text-2xl font-bold mb-5 sm:mb-6 text-gray-800">Credibility Voting Results</h2>
        <div className="space-y-5">
          {/* 虚假统计 */}
          <div>
            <div className="flex justify-between mb-2 items-center">
              <span className="font-semibold text-red-600 flex items-center whitespace-nowrap">
                <span className="w-3 h-3 rounded-full bg-gradient-fake mr-2"></span>
                Fake
              </span>
              <span className="text-gray-600 font-medium whitespace-nowrap">{news.votes.fake} votes ({fakePercentage}%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
              <div 
                className="bg-gradient-fake h-3 rounded-full transition-all duration-700 ease-out shadow-sm"
                style={{ width: `${fakePercentage}%` }}
              ></div>
            </div>
          </div>
          
          {/* 真实统计 */}
          <div>
            <div className="flex justify-between mb-2 items-center">
              <span className="font-semibold text-green-600 flex items-center whitespace-nowrap">
                <span className="w-3 h-3 rounded-full bg-gradient-true mr-2"></span>
                True
              </span>
              <span className="text-gray-600 font-medium whitespace-nowrap">{news.votes.notFake} votes ({notFakePercentage}%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
              <div 
                className="bg-gradient-true h-3 rounded-full transition-all duration-700 ease-out shadow-sm"
                style={{ width: `${notFakePercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center mt-7">
          <button 
            onClick={() => navigate(`/news/${id}/vote`)} 
            className="bg-gradient-primary text-white py-3 px-7 rounded-xl hover:shadow-lg hover:shadow-primary-500/50 transition-all duration-300 font-semibold flex items-center text-sm sm:text-base shadow-md hover:scale-105"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
            Vote and Share Your Opinion
          </button>
        </div>
      </div>

      {/* 评论区 */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-gray-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 sm:h-5 w-4 sm:w-5 mr-1 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          Community Comments ({news.comments.length})
        </h2>
        
        {/* 评论表单 */}
        <div className="glass p-5 sm:p-7 rounded-2xl mb-6 sm:mb-8 border border-white/30 shadow-glass" ref={commentFormRef}>
          {showSuccess && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Comment published successfully!
            </div>
          )}
          <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4 text-gray-800">Share Your Comment</h3>
          <form onSubmit={handleCommentSubmit} className="space-y-3 sm:space-y-4">
            {/* 评论类型选择 */}
            <div className="flex space-x-6 bg-gray-50 p-3 rounded-md">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="voteType"
                  value="fake"
                  checked={commentVoteType === 'fake'}
                  onChange={(e) => setCommentVoteType(e.target.value)}
                  className="mr-2 h-4 w-4 text-red-600"
                />
                <span className={`text-sm font-medium whitespace-nowrap ${commentVoteType === 'fake' ? 'text-red-600' : 'text-gray-600'}`}>I believe it's fake</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="voteType"
                  value="notFake"
                  checked={commentVoteType === 'notFake'}
                  onChange={(e) => setCommentVoteType(e.target.value)}
                  className="mr-2 h-4 w-4 text-green-600"
                />
                <span className={`text-sm font-medium whitespace-nowrap ${commentVoteType === 'notFake' ? 'text-green-600' : 'text-gray-600'}`}>I believe it's true</span>
              </label>
            </div>
            
            {/* 评论内容 */}
            <div>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Share your thoughts and analysis on this news..."
                rows={4}
                className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-400 resize-none transition-all duration-300"
              ></textarea>
            </div>
            
            <div className="flex justify-end">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`py-2 px-4 sm:px-6 rounded-md font-medium flex items-center transition-colors text-sm sm:text-base ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Posting...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    Post Comment
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        
        {/* 评论列表 */}
        <div className="space-y-4">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}
          {news.comments.length === 0 ? (
            <p className="text-gray-500 text-center py-5 sm:py-6 text-sm sm:text-base">No comments yet. Be the first to comment!</p>
          ) : (
            news.comments.map((comment, index) => (
              <div key={comment.id} className="glass p-4 sm:p-5 rounded-xl shadow-sm border border-white/20 hover:border-white/40 transition-all duration-300">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold mr-3 shadow-md">
                        <span className="text-sm">{comment.userId.charAt(0).toUpperCase()}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800 text-sm whitespace-nowrap">User {comment.userId}</div>
                        <div className="text-xs text-gray-500">{formatDateTime(comment.timestamp)}</div>
                      </div>
                    </div>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                    comment.voteType === 'fake' 
                      ? 'bg-gradient-fake text-white shadow-lg shadow-fake-600/30' 
                      : 'bg-gradient-true text-white shadow-lg shadow-true-500/30'
                  }`}>
                    {comment.voteType === 'fake' ? 'Fake' : 'True'}
                  </span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{comment.content}</p>
              </div>
            ))
          )}
          <div ref={commentsEndRef} />
        </div>
      </div>
    </div>
  )
}

export default NewsDetail