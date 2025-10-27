📰 Project Introduction 
Paparazzi News is a browser-based social anti-fake news system used for: 

✅ Submit and browse news
✅ Vote on the authenticity of news (True / False / Neutral)
✅ Users add comments and link to evidence
✅ View all votes and comments by pagination
✅ View content by classifying news status


🎯Technology Stack
Technology	             Usage
Vite	              For front-end build and development environment
React	              UI component-based development
Tailwind CSS	      For responsive and style framework
React Router DOM	SPA    page navigation
localStorage	      For temporary storage of comments/votes

🧩System Function Architecture
Home（新闻列表页）
 ├─ 筛选：All / Fake / Real / Neutral
 ├─ 每页显示数量选择（5 / 10 / 20）
 └─ 点击进入 →
News Detail（详情页）
 ├─ 新闻全部内容 + 图片URL展示
 ├─ 查看投票结果与评论 →
Comments Page（评论列表）
 ├─ 分页展示（评论 + 投票）
 └─ 点击投票 →
Vote Page（投票页）
 ├─ 真 / 假 / 中立 投票
 ├─ 评论文本和图片链接
 └─ 保存至 localStorage

 📁Recommended directory structure
 src/
 ├─ pages/
 │   ├─ NewsList.jsx
 │   ├─ NewsDetail.jsx
 │   ├─ CommentsPage.jsx
 │   └─ VotePage.jsx
 ├─ components/
 │   ├─ NewsCard.jsx
 │   ├─ FilterBar.jsx
 │   ├─ Pagination.jsx
 │   └─ CommentItem.jsx
 ├─ data/
 │   └─ mockNewsData.js
 ├─ utils/
 │   └─ localStorageUtil.js
 ├─ App.jsx
 └─ main.jsx

🎨UI Design Specifications
Category	                       Specification
Theme	                      Bright News Media Style
Main Color	                  Blue #2563EB
False News State Color	      Red #DC2626
True News State Color	        Green #16A34A
Font	                       Inter / sans-serif
Element Style	         Shadow, Rounded Corners, Hover Effects
Layout Features	   3-column grid, Clean White Space, Clear and  Concise Information Presentation


👥Recommended team division
Members                  Responsibilities
shenxinyan    Homepage + Filtering logic + Pagination component
zhaomeiling	  News detail page + UI for comment page + Routing
wurunxin	    Voting page + localStorage data + Comment pagination  