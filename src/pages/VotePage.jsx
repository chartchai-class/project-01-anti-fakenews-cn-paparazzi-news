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
  setError('News does not exist')
    } catch (err) {
        setError('Failed to load news')
        console.error('Failed to load news details:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchNewsDetail()
  }, [id])

  // Handle voting
    const handleVote = async (type) => {
        if (voted || voting) {
            return
        }

    try {
      // Set voting in progress state
        setVoting(true)
      
      const success = addVoteToNews(id, type)
      
      if (success) {
        // Record user vote to prevent duplicate voting
        const userVoteKey = `user_vote_${id}`
        localStorage.setItem(userVoteKey, type)
        
        setVoted(true)
        setVoteType(type)
        
        // Update local news data
        const updatedNews = getNewsById(id)
        setNews(updatedNews)
        
        // Show success message
        setShowSuccessMessage(true)
        
        // Redirect after delay to give user enough visual feedback time
        setTimeout(() => {
            navigate(`/news/${id}`)
        }, 1500)
      } else {
        throw new Error('Voting failed, please try again')
      }
    } catch (err) {
      // Use more user-friendly prompt instead of alert
        setError(err.message)
        // Clear error message after 3 seconds
        setTimeout(() => setError(null), 3000)
    } finally {
      setVoting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-lg text-gray-600">Loading voting page...</p>
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
        <p className="text-red-600 text-lg mb-6">{error || 'News does not exist'}</p>
        <button
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={() => navigate('/')}
        >
          Back to Home
        </button>
      </div>
    )
  }

  return (
    <div className="vote-page max-w-2xl mx-auto p-4 md:p-6 min-h-screen flex flex-col">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center px-4 py-2.5 glass hover:bg-white/80 rounded-xl mb-6 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 text-gray-700 font-medium hover:scale-105"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
        Go Back
      </button>

      <div className="glass rounded-2xl border border-white/30 shadow-glass-lg p-6 md:p-8 flex-grow">
        {/* Page Title */}
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">Verify News Authenticity</h1>
        
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-md border border-red-100 text-center animate-shake">
            {error}
          </div>
        )}
        
        {/* Success Message */}
        {showSuccessMessage && (
          <div className="mb-6 p-3 bg-green-50 text-green-600 rounded-md border border-green-100 text-center animate-pulse">
            Voting successful! Thank you for your participation
          </div>
        )}
        
        {/* News Summary */}
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

        {/* Voting Instructions */}
        <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-blue-800 text-center">
            Based on your judgment, please vote on the authenticity of this news. Your participation will help the community better identify potential fake news.
          </p>
        </div>

        {/* Voting Buttons */}
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-8 max-w-md mx-auto">
          <button
            onClick={() => handleVote('fake')}
            disabled={voted || voting}
            className={`flex items-center justify-center px-6 py-4 rounded-2xl text-base font-semibold transition-all duration-300 w-full ${
              voted || voting
              ? (voteType === 'fake' 
                ? 'bg-gradient-fake text-white scale-105 shadow-lg shadow-fake-600/50 ring-2 ring-red-400/50'
                : 'glass text-gray-400 cursor-not-allowed opacity-60')
              : 'glass text-red-600 hover:bg-white/80 hover:shadow-lg hover:scale-105'
            }`}
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
            Fake News
          </button>

          <button
            onClick={() => handleVote('notFake')}
            disabled={voted || voting}
            className={`flex items-center justify-center px-6 py-4 rounded-2xl text-base font-semibold transition-all duration-300 w-full ${
              voted || voting
              ? (voteType === 'notFake'
                ? 'bg-gradient-true text-white scale-105 shadow-lg shadow-true-500/50 ring-2 ring-green-400/50'
                : 'glass text-gray-400 cursor-not-allowed opacity-60')
              : 'glass text-green-600 hover:bg-white/80 hover:shadow-lg hover:scale-105'
            }`}
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
            Real News
          </button>
        </div>

        {/* Current Voting Results Preview */}
        <div className="glass p-6 rounded-2xl border border-white/30">
          <h3 className="text-lg font-semibold mb-5 text-gray-800">Current Voting Results</h3>
          
          <div className="space-y-5">
            <div>
              <div className="flex justify-between mb-2 items-center">
                <div className="flex items-center">
                  <span className="h-3 w-3 rounded-full bg-gradient-fake mr-2 shadow-sm"></span>
                  <span className="font-semibold text-red-600">Fake News</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-800 font-semibold">{news.votes.fake + (voting && voteType === 'fake' ? 1 : 0)} votes</span>
                  {news.votes.fake + news.votes.notFake > 0 && (
                    <span className="text-gray-500 text-sm">
                      {((news.votes.fake + (voting && voteType === 'fake' ? 1 : 0)) / (news.votes.fake + news.votes.notFake + (voting ? 1 : 0)) * 100).toFixed(1)}%
                    </span>
                  )}
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                <div 
                  className="bg-gradient-fake h-4 rounded-full transition-all duration-700 ease-out shadow-sm"
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
                  <span className="h-3 w-3 rounded-full bg-gradient-true mr-2 shadow-sm"></span>
                  <span className="font-semibold text-green-600">Real News</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-800 font-semibold">{news.votes.notFake + (voting && voteType === 'notFake' ? 1 : 0)} votes</span>
                  {news.votes.fake + news.votes.notFake > 0 && (
                    <span className="text-gray-500 text-sm">
                      {((news.votes.notFake + (voting && voteType === 'notFake' ? 1 : 0)) / (news.votes.fake + news.votes.notFake + (voting ? 1 : 0)) * 100).toFixed(1)}%
                    </span>
                  )}
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                <div 
                  className="bg-gradient-true h-4 rounded-full transition-all duration-700 ease-out shadow-sm"
                  style={{ 
                      width: `${news.votes.fake + news.votes.notFake > 0 
                        ? ((news.votes.notFake + (voting && voteType === 'notFake' ? 1 : 0)) / (news.votes.fake + news.votes.notFake + (voting ? 1 : 0)) * 100) 
                        : (voting && voteType === 'notFake' ? 100 : 0)}%` 
                    }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-center text-gray-600 text-sm font-medium">
            Total votes: <span className="text-gray-800 font-bold text-base">{news.votes.fake + news.votes.notFake + (voting ? 1 : 0)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VotePage