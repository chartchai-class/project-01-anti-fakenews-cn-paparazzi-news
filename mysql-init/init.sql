-- 创建用户表
CREATE TABLE IF NOT EXISTS user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    role VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 创建新闻来源表
CREATE TABLE IF NOT EXISTS source (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    credibility_score INT DEFAULT 0,
    credibility_level VARCHAR(20) DEFAULT 'UNKNOWN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 创建新闻表
CREATE TABLE IF NOT EXISTS news (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    url VARCHAR(255) UNIQUE,
    publish_date TIMESTAMP,
    fact_checked BOOLEAN DEFAULT FALSE,
    credibility_score INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    source_id BIGINT,
    FOREIGN KEY (source_id) REFERENCES source(id)
);

-- 创建评论表
CREATE TABLE IF NOT EXISTS comment (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    content TEXT NOT NULL,
    likes INT DEFAULT 0,
    dislikes INT DEFAULT 0,
    reports INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    news_id BIGINT,
    author_id BIGINT,
    parent_id BIGINT,
    FOREIGN KEY (news_id) REFERENCES news(id),
    FOREIGN KEY (author_id) REFERENCES user(id),
    FOREIGN KEY (parent_id) REFERENCES comment(id)
);

-- 创建投票表
CREATE TABLE IF NOT EXISTS vote (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vote_type VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    news_id BIGINT,
    user_id BIGINT,
    FOREIGN KEY (news_id) REFERENCES news(id),
    FOREIGN KEY (user_id) REFERENCES user(id),
    UNIQUE KEY unique_user_news_vote (user_id, news_id)
);

-- 创建评论投票表
CREATE TABLE IF NOT EXISTS comment_vote (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vote_type VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    comment_id BIGINT,
    user_id BIGINT,
    FOREIGN KEY (comment_id) REFERENCES comment(id),
    FOREIGN KEY (user_id) REFERENCES user(id),
    UNIQUE KEY unique_user_comment_vote (user_id, comment_id)
);

-- 创建评论举报表
CREATE TABLE IF NOT EXISTS comment_report (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    reason TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    comment_id BIGINT,
    user_id BIGINT,
    FOREIGN KEY (comment_id) REFERENCES comment(id),
    FOREIGN KEY (user_id) REFERENCES user(id),
    UNIQUE KEY unique_user_comment_report (user_id, comment_id)
);

-- 插入默认管理员用户（密码: admin123，已使用BCrypt加密）
INSERT INTO user (username, password, email, role) VALUES 
('admin', '$2a$10$E19Lr/3QH9wLk9Nt7b4qZ.PDZ88FkGQ8O8w1qYvT6q2KvX2K3Q1S2', 'admin@example.com', 'ROLE_ADMIN'),
('factchecker', '$2a$10$E19Lr/3QH9wLk9Nt7b4qZ.PDZ88FkGQ8O8w1qYvT6q2KvX2K3Q1S2', 'factchecker@example.com', 'ROLE_FACT_CHECKER'),
('user', '$2a$10$E19Lr/3QH9wLk9Nt7b4qZ.PDZ88FkGQ8O8w1qYvT6q2KvX2K3Q1S2', 'user@example.com', 'ROLE_USER')
ON DUPLICATE KEY UPDATE password = VALUES(password);

-- 插入默认新闻来源
INSERT INTO source (name, description, credibility_score, credibility_level) VALUES
('人民日报', '中国共产党中央委员会机关报', 95, 'HIGH'),
('新华社', '中国国家通讯社', 90, 'HIGH'),
('中央电视台', '中国国家电视台', 85, 'HIGH'),
('环球时报', '中国国际新闻报纸', 70, 'MEDIUM'),
('财经网', '中国财经新闻网站', 80, 'HIGH'),
('新浪新闻', '中国综合新闻门户网站', 65, 'MEDIUM'),
('腾讯新闻', '中国综合新闻门户网站', 60, 'MEDIUM'),
('今日头条', '中国新闻聚合平台', 55, 'MEDIUM'),
('澎湃新闻', '中国深度报道新闻网站', 85, 'HIGH'),
('界面新闻', '中国财经新闻网站', 80, 'HIGH')
ON DUPLICATE KEY UPDATE description = VALUES(description), credibility_score = VALUES(credibility_score), credibility_level = VALUES(credibility_level);
