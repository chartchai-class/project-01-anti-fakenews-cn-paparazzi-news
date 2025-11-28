// Mock数据，用于后端未运行时展示
const mockNews = [
  {
    id: 1,
    title: "全球气候变化：最新研究显示情况正在恶化",
    summary: "最新的气候研究报告表明，全球变暖正在加速，极端天气事件频率增加。",
    content: "<p>根据联合国气候变化框架公约(UNFCCC)最新发布的报告，全球气温持续上升，已超过工业化前水平1.2℃。</p><p>报告指出，如果不立即采取积极措施，到本世纪末气温可能上升2.7℃以上，将导致更严重的极端天气事件，包括热浪、洪水和干旱。</p><p>科学家呼吁各国加强合作，减少碳排放，加速可再生能源转型。</p>",
    imageUrl: "https://picsum.photos/id/1/800/450",
    trustScore: 92,
    trustLevel: "high",
    source: "气候变化研究中心",
    date: "2024-03-15T08:00:00Z",
    category: "Environment"
  },
  {
    id: 2,
    title: "2024年大选：主要候选人政策主张对比",
    summary: "随着大选临近，各主要候选人的政策主张成为公众关注焦点。",
    content: "<p>2024年大选竞选活动已进入白热化阶段，主要候选人围绕经济、医疗、教育等议题展开激烈辩论。</p><p>候选人A承诺降低税率，促进经济增长；候选人B则强调扩大医保覆盖范围；候选人C提出教育改革新方案。</p><p>专家分析认为，此次大选结果将对国家未来四年发展方向产生深远影响。</p>",
    imageUrl: "https://picsum.photos/id/2/800/450",
    trustScore: 85,
    trustLevel: "high",
    source: "国家政治研究院",
    date: "2024-03-14T14:30:00Z",
    category: "Politics"
  },
  {
    id: 3,
    title: "新型冠状病毒变异株出现，专家表示无需过度恐慌",
    summary: "科学家发现新冠病毒新变异株，但现有疫苗仍有保护效果。",
    content: "<p>世界卫生组织(WHO)今日宣布，在多个国家发现了新冠病毒的新变异株，但目前证据表明其传播力和致病力并未显著增强。</p><p>各国公共卫生专家强调，现有疫苗对预防重症仍有良好效果，建议符合条件的人群及时接种加强针。</p><p>同时，专家提醒继续保持良好的个人卫生习惯，如戴口罩、勤洗手和保持社交距离。</p>",
    imageUrl: "https://picsum.photos/id/3/800/450",
    trustScore: 95,
    trustLevel: "high",
    source: "世界卫生组织",
    date: "2024-03-13T10:15:00Z",
    category: "Society"
  },
  {
    id: 4,
    title: "人工智能技术突破：新模型在医疗诊断领域表现出色",
    summary: "最新AI模型在疾病诊断准确率方面超过了人类专家。",
    content: "<p>研究人员开发的新型人工智能模型在早期癌症筛查测试中表现出色，准确率达到94%，超过了平均人类专家水平。</p><p>该技术利用深度学习分析医学影像，能够检测到细微的异常模式。研究团队表示，这一突破有望大幅提高早期诊断率，挽救更多生命。</p><p>目前，该模型正在多家医院进行临床试验，预计2-3年内可投入实际应用。</p>",
    imageUrl: "https://picsum.photos/id/4/800/450",
    trustScore: 88,
    trustLevel: "high",
    source: "科技前沿杂志",
    date: "2024-03-12T16:45:00Z",
    category: "Education"
  },
  {
    id: 5,
    title: "好莱坞明星宣布退出社交媒体，引发广泛讨论",
    summary: "知名演员宣布永久退出所有社交媒体平台，呼吁关注心理健康。",
    content: "<p>奥斯卡获奖演员昨日通过官方声明宣布，将永久退出所有社交媒体平台。声明中表示，社交媒体的负面影响已严重影响其心理健康和私人生活。</p><p>这一决定引发了关于社交媒体对公众人物影响的广泛讨论。许多心理健康专家指出，社交媒体的压力和负面评论确实对许多名人造成了严重的心理负担。</p><p>同时，也有观点认为，公众人物离开社交媒体可能会减少与粉丝的直接互动。</p>",
    imageUrl: "https://picsum.photos/id/5/800/450",
    trustScore: 75,
    trustLevel: "medium",
    source: "娱乐周刊",
    date: "2024-03-11T09:20:00Z",
    category: "Entertainment"
  },
  {
    id: 6,
    title: "经济复苏迹象明显，专家预测今年GDP增长将超过预期",
    summary: "最新经济数据显示，制造业和服务业指数均呈现上升趋势。",
    content: "<p>国家统计局发布的最新经济数据显示，一季度制造业PMI指数达到53.2，连续三个月保持扩张区间；服务业PMI指数为55.6，创近一年新高。</p><p>多位经济学家分析认为，这些数据表明经济复苏势头强劲，预计今年GDP增长率有望达到5.8%，超过此前5.5%的预期目标。</p><p>同时，专家也提醒注意全球经济不确定性和地缘政治风险可能带来的挑战。</p>",
    imageUrl: "https://picsum.photos/id/6/800/450",
    trustScore: 82,
    trustLevel: "high",
    source: "经济观察报",
    date: "2024-03-10T11:30:00Z",
    category: "Politics"
  },
  {
    id: 7,
    title: "教育改革新政策出台，强调减轻学生课业负担",
    summary: "教育部发布新政策，旨在推动素质教育，减少机械性记忆内容。",
    content: "<p>教育部今日发布《关于进一步深化教育改革的指导意见》，明确提出要减轻中小学生过重课业负担，推动教育评价体系改革。</p><p>新政策要求学校减少家庭作业总量，控制考试频次，增加实践类课程比例。同时，将建立多元化的学生评价体系，不再以分数作为唯一标准。</p><p>教育专家表示，这一改革方向符合教育规律，有利于培养学生的创新能力和实践精神。</p>",
    imageUrl: "https://picsum.photos/id/7/800/450",
    trustScore: 87,
    trustLevel: "high",
    source: "教育部官网",
    date: "2024-03-09T13:50:00Z",
    category: "Education"
  },
  {
    id: 8,
    title: "新能源汽车销量创新高，市场份额首次超过传统燃油车",
    summary: "最新数据显示，上月新能源汽车销量占比达到50.8%，历史首次突破50%。",
    content: "<p>汽车工业协会发布的数据显示，2月份新能源汽车销量达120万辆，同比增长45%，市场份额达到50.8%，历史上首次超过传统燃油车。</p><p>分析师认为，这一里程碑标志着汽车产业正在加速向电动化转型。政策支持、技术进步和消费者认知提升是推动这一变化的主要因素。</p><p>同时，充电基础设施建设也在加速推进，预计到2025年全国充电桩数量将达到2000万个。</p>",
    imageUrl: "https://picsum.photos/id/8/800/450",
    trustScore: 90,
    trustLevel: "high",
    source: "汽车工业协会",
    date: "2024-03-08T08:40:00Z",
    category: "Environment"
  }
];

const API_BASE_URL = '/api/news/public';

// 通用请求函数
async function fetchWithTimeout(url, options = {}, timeout = 10000) {
  // 在开发环境直接返回mock数据，不发送实际的API请求
  if (import.meta.env.DEV) {
    console.log('Using mock data directly for:', url);
    return null; // 标记使用mock数据
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    console.log('API Request:', url);
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('API Response:', url, data);
    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('API request failed:', error);
    throw error;
  }
}

// 获取所有新闻
export async function getAllNews() {
  let result = await fetchWithTimeout(API_BASE_URL);
  // 如果API调用失败，返回mock数据
  if (!result) {
    console.log('Using mock data for getAllNews');
    return mockNews;
  }
  // 转换后端返回的image字段为前端期望的imageUrl字段
  console.log('Converting backend news data, original:', result);
  const converted = result.map(news => {
    const imageUrl = news.image || `https://picsum.photos/id/${news.id%100}/800/450`;
    console.log(`Converting news ${news.id}: image=${news.image} -> imageUrl=${imageUrl}`);
    return {
      ...news,
      imageUrl
    };
  });
  console.log('Converted news data:', converted);
  return converted;
}

// 根据ID获取新闻
export async function getNewsById(id) {
  let result = await fetchWithTimeout(`${API_BASE_URL}/${id}`);
  // 如果API调用失败或未找到，从mock数据中查找
  if (!result) {
    const news = mockNews.find(item => item.id === Number(id));
    if (!news) {
      throw new Error('News not found');
    }
    return news;
  }
  // 转换后端返回的image字段为前端期望的imageUrl字段
  return {
    ...result,
    imageUrl: result.image || `https://picsum.photos/id/${result.id%100}/800/450`
  };
}

// 根据分类获取新闻
export async function getNewsByCategory(category) {
  let result = await fetchWithTimeout(`${API_BASE_URL}/category/${category}`);
  // 如果API调用失败，从mock数据中过滤
  if (!result) {
    return mockNews.filter(item => item.category.toLowerCase() === category.toLowerCase());
  }
  // 转换后端返回的image字段为前端期望的imageUrl字段
  return result.map(news => ({
    ...news,
    imageUrl: news.image || `https://picsum.photos/id/${news.id%100}/800/450`
  }));
}

// 投票（支持、反对、中立）
export async function voteNews(newsId, voteType) {
  // voteType: 'true', 'false', 'neutral'
  try {
    const result = await fetchWithTimeout(`${API_BASE_URL}/${newsId}/vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ voteType })
    });
    return result || { success: true, message: '投票成功' };
  } catch (error) {
    console.error('投票失败:', error);
    // 在开发环境返回模拟成功响应
    if (import.meta.env.DEV) {
      console.log('使用模拟投票响应');
      return { success: true, message: '投票成功', mock: true };
    }
    throw error;
  }
}

// 获取新闻投票统计
export async function getNewsVotes(newsId) {
  try {
    const result = await fetchWithTimeout(`${API_BASE_URL}/${newsId}/votes`);
    return result || { true: 0, false: 0, neutral: 0 };
  } catch (error) {
    console.error('获取投票统计失败:', error);
    // 在开发环境返回模拟统计数据
    if (import.meta.env.DEV) {
      console.log('使用模拟投票统计数据');
      return { true: Math.floor(Math.random() * 100), false: Math.floor(Math.random() * 50), neutral: Math.floor(Math.random() * 30) };
    }
    throw error;
  }
}