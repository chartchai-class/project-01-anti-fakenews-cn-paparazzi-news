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
```bash
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

## 📁 Recommended Directory Structure

```bash
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


🎨 UI / UX Design Specifications
Category	Specification
Theme	Bright News Media Style
Primary Color	Blue #2563EB
Real News Color	Green #16A34A
Fake News Color	Red #DC2626
Font	Sans-serif (system default + clean readability)
Card Style	White background, shadow, rounded corners
Layout Pattern	3-column news grid, hover interaction
UX Principle	“Minimal clicks, clear trust visibility”


👥 Team                  Division    
✅shenxinyan（20232090）	 Homepage, Filters, Pagination

✅ zhaomeiling	（20232089） News Detail + Comments Page + Routing

✅ wurunxin（20232083）  	Voting Page + localStorage + Comment Pagination

URL:https://project-01-anti-fakenews-cn-paparazzi-news-5hz3penn5.vercel.app/