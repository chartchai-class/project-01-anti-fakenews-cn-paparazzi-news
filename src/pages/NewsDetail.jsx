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
        <p className="text-lg text-gray-600">正在加载新闻详情...</p>
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

  const totalVotes = news.votes.fake + news.votes.notFake
  const fakePercentage = calculatePercentage(news.votes.fake, totalVotes)
  const notFakePercentage = calculatePercentage(news.votes.notFake, totalVotes)

  return (
    <div className="news-detail max-w-4xl mx-auto p-3 sm:p-4 md:p-6 min-h-screen flex flex-col bg-white rounded-xl shadow-md">
      {/* 返回按钮 */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md mb-4 sm:mb-6 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 sm:h-5 w-4 sm:w-5 mr-1 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        返回上一页
      </button>

      {/* 新闻标题 */}
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-gray-800">{news.title}</h1>

      {/* 元信息 */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">
        <span>记者: {news.reporter}</span>
        <span>发布时间: {formatDateTime(news.publishTime)}</span>
      </div>

      {/* 新闻图片 */}
      <div className="mb-6 sm:mb-8">
        <img 
          src={news.imageUrl} 
          alt={news.title} 
          className="w-full h-auto rounded-lg shadow-md"
          style={{ maxHeight: '400px' }}
        />
      </div>

      {/* 新闻内容 */}
      <div className="prose max-w-none mb-6 sm:mb-8 text-gray-700 leading-relaxed">
        <p className="text-sm sm:text-base md:text-lg whitespace-pre-line">{news.content}</p>
      </div>

      {/* 投票统计 */}
      <div className="bg-gray-50 p-4 sm:p-6 rounded-lg mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-800">真实性投票结果</h2>
        <div className="space-y-4">
          {/* 虚假统计 */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="font-medium text-red-600">疑似虚假</span>
              <span className="text-gray-600">{news.votes.fake} 票 ({fakePercentage}%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-red-600 h-2.5 rounded-full" 
                style={{ width: `${fakePercentage}%` }}
              ></div>
            </div>
          </div>
          
          {/* 真实统计 */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="font-medium text-green-600">真实可信</span>
              <span className="text-gray-600">{news.votes.notFake} 票 ({notFakePercentage}%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-green-600 h-2.5 rounded-full" 
                style={{ width: `${notFakePercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center mt-5 sm:mt-6">
          <button 
            onClick={() => navigate(`/news/${id}/vote`)} 
            className="bg-blue-600 text-white py-2 px-5 sm:px-6 rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center text-sm sm:text-base"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 sm:h-5 w-4 sm:w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
            参与投票，表达您的观点
          </button>
        </div>
      </div>

      {/* 评论区 */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-gray-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 sm:h-5 w-4 sm:w-5 mr-1 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          社区评论 ({news.comments.length})
        </h2>
        
        {/* 评论表单 */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-6 sm:mb-8 border border-gray-100" ref={commentFormRef}>
          {showSuccess && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              评论发布成功！
            </div>
          )}
          <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4 text-gray-800">发表您的评论</h3>
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
                <span className={`text-sm font-medium ${commentVoteType === 'fake' ? 'text-red-600' : 'text-gray-600'}`}>我认为是假新闻</span>
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
                <span className={`text-sm font-medium ${commentVoteType === 'notFake' ? 'text-green-600' : 'text-gray-600'}`}>我认为是真新闻</span>
              </label>
            </div>
            
            {/* 评论内容 */}
            <div>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="分享您对这则新闻的看法和分析..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
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
                    发布中...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    发布评论
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
            <p className="text-gray-500 text-center py-5 sm:py-6 text-sm sm:text-base">暂无评论，快来发表第一条评论吧！</p>
          ) : (
            news.comments.map((comment, index) => (
              <div key={comment.id} className="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                    <div className="flex items-center">
                      <div className="w-6 sm:w-8 h-6 sm:h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 mr-2 sm:mr-3">
                        <span className="text-xs sm:text-sm">{comment.userId.charAt(0).toUpperCase()}</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-800 text-sm">用户 {comment.userId}</div>
                        <div className="text-xs sm:text-sm text-gray-500">{formatDateTime(comment.timestamp)}</div>
                      </div>
                    </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${comment.voteType === 'fake' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {comment.voteType === 'fake' ? '假新闻' : '真新闻'}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{comment.content}</p>
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