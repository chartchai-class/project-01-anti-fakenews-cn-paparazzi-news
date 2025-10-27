import React from 'react'

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
  // 计算总页数
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  
  // 如果总页数小于等于1，则不显示分页控件
  if (totalPages <= 1) return null
  
  // 生成页码数组，根据屏幕大小显示不同数量的页码
  const getPageNumbers = () => {
    const pages = []
    // 在小屏幕上只显示更少的页码
    const showRange = window.innerWidth < 640 ? 3 : 7
    const halfRange = Math.floor(showRange / 2)
    let startPage, endPage
    
    if (totalPages <= showRange) {
      // 总页数少于等于显示范围，则显示所有页码
      startPage = 1
      endPage = totalPages
    } else {
      // 总页数大于显示范围，则只显示当前页附近的页码
      startPage = Math.max(1, currentPage - halfRange)
      endPage = Math.min(totalPages, startPage + showRange - 1)
      
      // 如果结束页与总页数相差较大，调整起始页
      if (endPage - startPage < showRange - 1 && startPage > 1) {
        startPage = Math.max(1, endPage - showRange + 1)
      }
    }
    
    // 添加页码
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
    
    return pages
  }
  
  const pageNumbers = getPageNumbers()
  
  // 处理页码点击
  const handlePageClick = (pageNumber) => {
    if (pageNumber !== currentPage) {
      onPageChange(pageNumber)
    }
  }
  
  return (
    <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
      {/* 分页信息 */}
      <div className="text-sm text-gray-600 hidden sm:block">
        第 {currentPage} 页，共 {totalPages} 页（{totalItems} 条新闻）
      </div>
      
      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
        {/* 上一页按钮 */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`relative inline-flex items-center px-2 sm:px-3 py-2 rounded-l-md border ${currentPage === 1 
            ? 'bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed' 
            : 'bg-white text-gray-500 hover:text-gray-700 hover:bg-gray-50 border-gray-300'}`}
        >
          <span className="sr-only">上一页</span>
          <svg className="h-4 sm:h-5 w-4 sm:w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        
        {/* 页码按钮 */}
        {pageNumbers.map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => handlePageClick(pageNumber)}
            className={`relative inline-flex items-center px-2 sm:px-4 py-2 border text-xs sm:text-sm font-medium ${currentPage === pageNumber 
              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' 
              : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'}`}
          >
            {pageNumber}
          </button>
        ))}
        
        {/* 下一页按钮 */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`relative inline-flex items-center px-2 sm:px-3 py-2 rounded-r-md border ${currentPage === totalPages 
            ? 'bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed' 
            : 'bg-white text-gray-500 hover:text-gray-700 hover:bg-gray-50 border-gray-300'}`}
        >
          <span className="sr-only">下一页</span>
          <svg className="h-4 sm:h-5 w-4 sm:w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </nav>
      
      {/* 移动版页码信息 */}
      <div className="text-xs text-gray-500 sm:hidden">
        第 {currentPage}/{totalPages} 页
      </div>
    </div>
  )
}

export default Pagination