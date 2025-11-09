# Truth Moment - Anti Fake News Platform

*This README file is primarily in English with Chinese annotations for checking purposes. Chinese annotations can be removed after review.*

## Live Demo / 在线演示

The project is deployed on Vercel. You can access it at:
[https://project-01-anti-fakenews-cn-paparaz-sigma.vercel.app/]

## Team Members

### Member 1
- **Name:** Shen Xinyan
- **ID:** 20232090
- **Email:** 3930098362@qq.com
- **Role:** Backend Lead

Designed system architecture (API specifications, data models)

Implemented backend services (Node.js / Express / MySQL)

Built and managed database schema (news, categories, comments, votes)

Developed core business logic (news loading, filtering, pagination, voting, commenting)

Handled deployment and environment configuration (Vercel / Render)

Performed debugging, optimization, and integration

Wrote backend documentation and coordinated technical decisions

### Member 2
- **Name:** Wu Runxin
- **ID:**20232083
- **Email:** 3282982622@qq.com
- **Role:**UI/UX Designer

Designed homepage layout, navigation structure, and visual style

Developed News List and Category pages

Implemented UI components and page layout (Vite + CSS)

Assisted with router configuration and navigation flow

Improved overall user experience (scroll behavior, hover effects, responsive design)

### Member 3
- **Name:** Zhao Meiling
- **ID:**20232089
- **Email:** 2804973446@qq.com
- **Role:**Developer for News Detail Page

Implemented full article rendering, image display, and trust information

Added click-to-detail navigation logic

Assisted with frontend data presentation and HTML parsing

Contributed to documentation and testing records

## Overview 项目概述
A comprehensive fake news detection and verification platform designed to help users identify and combat misinformation. The system leverages community voting, expert analysis, and media literacy education to promote information accuracy.


## Features 功能特性

### Core Functionalities 核心功能
- **News Aggregation**: Curated news content from various sources with credibility ratings
- **Community Trust Assessment**: User voting system to evaluate news trustworthiness
- **Comment System**: Engage in discussions with trust ratings for each comment
- **Trust Index**: Visual representation of news and source credibility
- **Media Literacy Education**: Resources to help users identify fake news

### Technical Highlights 技术亮点
- **Frontend**: Modern React-based interface with responsive design
- **Backend**: RESTful API architecture with secure data handling
- **Real-time Interactions**: Dynamic updates for votes and comments
- **Accessibility Support**: WCAG-compliant UI components

## Installation 安装指南

### Prerequisites 先决条件
- Node.js (v14+)
- npm or yarn

### Frontend Setup 前端设置
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup 后端设置
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start server
npm start
```

## Usage 使用说明

1. **Browse News**: Visit the homepage to see the latest news articles with trust scores
2. **Evaluate Trustworthiness**: Vote on whether you find news articles trustworthy or not
3. **Join Discussions**: Leave comments and rate others' comments based on trustworthiness
4. **Learn Media Literacy**: Access educational resources to improve your fake news detection skills

## Project Structure 项目结构

```
project-01-anti-fakenews-cn-paparazzi-news/
├── backend/           # Backend server code
│   ├── src/           # Source code
│   └── package.json   # Dependencies
├── frontend/          # Frontend application
│   ├── src/           # React components and logic
│   │   ├── components/# Reusable UI components
│   │   ├── pages/     # Page components
│   │   ├── api/       # API interaction utilities
│   │   └── style.css  # Global styles
│   └── package.json   # Frontend dependencies
```

## Technologies 技术栈

### Frontend
- React
- JavaScript/ES6+
- CSS3 with modern features
- Vite (build tool)

### Backend
- Node.js
- Express.js
- MongoDB (database)

## Contributing 贡献指南

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License 许可证

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact 联系方式

- Email: hhibo2778@gmail.com
- Project Link: [Truth Moment]https://github.com/chartchai-class/project-01-anti-fakenews-cn-paparazzi-news

© 2025 Truth Moment - Anti Fake News Platform. All rights reserved.