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
    <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
      {/* 分页信息 */}
      <div className="text-sm text-gray-600 hidden sm:block font-medium">
        Page <span className="font-bold text-primary-600">{currentPage}</span> of {totalPages} ({totalItems} articles)
      </div>
      
      <nav className="relative z-0 inline-flex rounded-xl shadow-lg -space-x-px overflow-hidden glass border border-white/20" aria-label="Pagination">
        {/* 上一页按钮 */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`relative inline-flex items-center px-3 sm:px-4 py-2 rounded-l-xl ${currentPage === 1 
            ? 'text-gray-300 cursor-not-allowed' 
            : 'text-gray-700 hover:bg-white/50 transition-all duration-300'}`}
        >
          <span className="sr-only">Previous page</span>
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        
        {/* 页码按钮 */}
        {pageNumbers.map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => handlePageClick(pageNumber)}
            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold transition-all duration-300 ${
              currentPage === pageNumber 
                ? 'bg-gradient-primary text-white shadow-lg shadow-primary-500/50 z-10' 
                : 'text-gray-700 hover:bg-white/50'
            }`}
          >
            {pageNumber}
          </button>
        ))}
        
        {/* 下一页按钮 */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`relative inline-flex items-center px-3 sm:px-4 py-2 rounded-r-xl ${currentPage === totalPages 
            ? 'text-gray-300 cursor-not-allowed' 
            : 'text-gray-700 hover:bg-white/50 transition-all duration-300'}`}
        >
          <span className="sr-only">Next page</span>
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </nav>
      
      {/* 移动版页码信息 */}
      <div className="text-xs text-gray-500 sm:hidden font-medium">
        Page <span className="font-bold text-primary-600">{currentPage}</span>/{totalPages}
      </div>
    </div>
  )
}

export default Pagination