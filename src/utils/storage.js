// 工具函数：从localStorage获取所有新闻数据
export const getNews = () => {
  try {
    const news = localStorage.getItem('news')
    return news ? JSON.parse(news) : []
  } catch (error) {
    console.error('获取新闻数据失败:', error)
    return []
  }
}

// 工具函数：根据ID获取单个新闻
export const getNewsById = (id) => {
  try {
    const news = getNews()
    return news.find(item => item.id === parseInt(id)) || null
  } catch (error) {
    console.error('获取新闻详情失败:', error)
    return null
  }
}

// 工具函数：更新新闻数据
export const updateNews = (updatedNews) => {
  try {
    localStorage.setItem('news', JSON.stringify(updatedNews))
    return true
  } catch (error) {
    console.error('更新新闻数据失败:', error)
    return false
  }
}

// 工具函数：为新闻添加投票
export const addVoteToNews = (newsId, voteType) => {
  try {
    const news = getNews()
    const newsIndex = news.findIndex(item => item.id === parseInt(newsId))
    
    if (newsIndex !== -1) {
      if (voteType === 'fake') {
        news[newsIndex].votes.fake += 1
      } else if (voteType === 'notFake') {
        news[newsIndex].votes.notFake += 1
      }
      
      updateNews(news)
      return true
    }
    return false
  } catch (error) {
    console.error('添加投票失败:', error)
    return false
  }
}

// 工具函数：为新闻添加评论
export const addCommentToNews = (newsId, comment) => {
  try {
    const news = getNews()
    const newsIndex = news.findIndex(item => item.id === parseInt(newsId))
    
    if (newsIndex !== -1) {
      const newComment = {
        id: Date.now(), // 使用时间戳作为唯一ID
        ...comment,
        timestamp: new Date().toISOString()
      }
      
      news[newsIndex].comments.push(newComment)
      updateNews(news)
      return true
    }
    return false
  } catch (error) {
    console.error('添加评论失败:', error)
    return false
  }
}