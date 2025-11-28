<template>
  <div class="home-container">
    <h1>Welcome to Truth Moment</h1>
    <p>Discover truth, avoid misinformation</p>
    <div class="action-buttons">
      <router-link to="/register" class="btn">Register Now</router-link>
      <router-link to="/login" class="btn btn-outline">Log In</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage'
}
</script>

<style scoped>
.home-container {
  text-align: center;
  padding: 60px 20px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 20px;
}

p {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 40px;
}

.action-buttons {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
}

.btn {
  padding: 12px 24px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s;
  cursor: pointer;
}

.btn {
  background-color: #4a90e2;
  color: white;
  border: none;
}

.btn:hover {
  background-color: #357abd;
}

.btn-outline {
  background-color: transparent;
  color: #4a90e2;
  border: 2px solid #4a90e2;
}

.btn-outline:hover {
  background-color: #4a90e2;
  color: white;
}
</style>