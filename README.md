📰 Project Introduction 
Paparazzi News is a browser-based social anti-fake news system used for: 

✅ Submit and browse news

✅ Vote news status: True / False / Neutral

✅ Provide comments and image evidence (URL link)

✅ View results and discussions with pagination

✅ Filter by news authenticity status

| 🎯Technology         | Usage |
|-------------------|------|
| Vite              | For front-end build and development environment |
| React             | UI component-based development |
| Tailwind CSS      | For responsive and style framework |
| React Router DOM  | SPA page navigation |
| localStorage      | Temporary storage of comments/votes |

🧩 System Architecture
Home (News List)
 ├─ Filter: All / Fake / Real / Neutral
 ├─ Items per page: 5 / 10 / 20
 └─ Click → View Details →

News Detail
 ├─ Full article + image URL preview
 ├─ Reporter + timestamp + status
 ├─ View comments & voting results →

Comments Page
 ├─ Pagination
 └─ Click → Vote page →

Vote Page
 ├─ Submit: True / Fake / Neutral
 ├─ Add comment + evidence URL
 └─ Save to localStorage

📁Recommended directory structure
src/
├─ pages/
│  ├─ Home.vue
│  ├─ NewsDetail.vue
│  ├─ CommentsPage.vue
│  └─ VotePage.vue
│
├─ components/
│  ├─ NewsCard.vue
│  ├─ FilterBar.vue
│  ├─ Pagination.vue
│  └─ CommentItem.vue
│
├─ data/
│  └─ mockNewsData.js
│
├─ utils/
│  └─ localStorageUtil.js
│
├─ router/
│  └─ index.js
│
├─ App.vue
└─ main.js

🎨UI Design Specifications
Category	                       Specification
Theme	                      Bright News Media Style
Main Color	                  Blue #2563EB
False News State Color	      Red #DC2626
True News State Color	       Green #16A34A
Font	                       Inter / sans-serif
Element Style	         Shadow, Rounded Corners, Hover Effects
Layout Features	   3-column grid, Clean White Space, Clear and  Concise Information Presentation


👥Recommended team division
Members                  Responsibilities
shenxinyan    Homepage + Filtering logic + Pagination component
zhaomeiling	  News detail page + UI for comment page + Routing
wurunxin	    Voting page + localStorage data + Comment pagination  
