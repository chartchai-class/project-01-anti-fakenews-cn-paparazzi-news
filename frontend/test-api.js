// 测试API连接脚本
const API_BASE_URL = 'http://localhost:8080';

async function testRegister() {
  console.log('测试用户注册功能...');
  
  // 生成唯一用户名和邮箱以避免冲突
  const timestamp = Date.now();
  const userData = {
    username: `testuser_${timestamp}`,
    password: 'testpassword123',
    email: `testuser_${timestamp}@example.com`
  };
  
  console.log('发送的用户数据:', JSON.stringify(userData, null, 2));
  
  try {
    // 尝试使用不同的请求方式，不设置credentials和mode，简化请求
    const requestUrl = `${API_BASE_URL}/api/auth/register`;
    console.log(`请求URL: ${requestUrl}`);
    
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
      // 移除Origin头，让浏览器自动处理
    };
    
    console.log(`请求头: ${JSON.stringify(headers, null, 2)}`);
    
    // 使用更简单的fetch配置
    const response = await fetch(requestUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(userData)
      // 移除credentials和mode，让浏览器默认处理
    });

    console.log('响应状态:', response.status);
    console.log('响应状态文本:', response.statusText);
    
    // 打印所有响应头（详细格式）
    const responseHeaders = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });
    console.log('响应头详情:', JSON.stringify(responseHeaders, null, 2));
    
    // 尝试读取响应体
    const text = await response.text();
    console.log('响应原始文本:', text || '(空响应)');
    
    // 尝试解析JSON
    let data = {};
    try {
      if (text) {
        data = JSON.parse(text);
        console.log('解析后的JSON数据:', JSON.stringify(data, null, 2));
      }
    } catch (jsonError) {
      console.log(`JSON解析错误: ${jsonError.message}`);
    }
    
    // 直接返回成功状态
    if (response.ok) {
      console.log('注册测试成功!');
      return true;
    } else {
      console.log(`注册测试失败，状态码: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.error('注册失败，网络错误:', error.message);
    return false;
  }
}

// 执行测试
testRegister().then(result => {
  console.log('测试完成，结果:', result ? '成功' : '失败');
});