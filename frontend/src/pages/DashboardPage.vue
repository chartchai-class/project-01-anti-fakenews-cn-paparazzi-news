<template>
  <div class="dashboard-container">
    <h1>Welcome to Your Dashboard</h1>
    
    <div v-if="user" class="user-welcome">
      <p>Hello, {{ user.username }}! Welcome back to Truth Moment.</p>
    </div>
    
    <div class="dashboard-cards">
      <div class="dashboard-card">
        <h3>Latest News Analysis</h3>
        <p>Explore recent news articles and fact-checking results.</p>
        <button class="btn" @click="navigateTo('/news')">View News</button>
      </div>
      
      <div class="dashboard-card">
        <h3>Your Saved Articles</h3>
        <p>Access your bookmarked news for future reference.</p>
        <button class="btn btn-secondary" @click="navigateTo('/favorites')">View Saved</button>
      </div>
      
      <div class="dashboard-card">
        <h3>Account Settings</h3>
        <p>Manage your profile and preferences.</p>
        <button class="btn" @click="navigateTo('/profile')">Settings</button>
      </div>
    </div>
    
    <div class="recent-activities">
      <h2>Recent Activities</h2>
      <div class="activity-list">
        <div v-if="recentActivities.length === 0" class="no-activities">
          No recent activities found.
        </div>
        <div v-for="activity in recentActivities" :key="activity.id" class="activity-item">
          <p>{{ activity.description }}</p>
          <span class="activity-time">{{ formatDate(activity.timestamp) }}</span>
        </div>
      </div>
    </div>
    
    <div class="logout-section">
      <button class="btn btn-danger" @click="handleLogout">Log Out</button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

export default {
  name: 'DashboardPage',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    
    // Mock recent activities data
    const recentActivities = ref([
      {
        id: 1,
        description: 'You viewed the article "Climate Change Facts and Misconceptions"',
        timestamp: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
      },
      {
        id: 2,
        description: 'You saved an article to your favorites',
        timestamp: new Date(Date.now() - 86400000).toISOString() // 1 day ago
      },
      {
        id: 3,
        description: 'You successfully logged in',
        timestamp: new Date(Date.now() - 172800000).toISOString() // 2 days ago
      }
    ])
    
    // Get current user from auth store
    const user = computed(() => authStore.user)
    
    // Format date function
    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
    
    // Navigate to different pages
    const navigateTo = (route) => {
      router.push(route)
    }
    
    // Handle logout
    const handleLogout = () => {
      authStore.logout()
      router.push('/')
    }
    
    // Check if user is authenticated on mount
    onMounted(() => {
      if (!authStore.isAuthenticated) {
        router.push('/login')
      }
    })
    
    return {
      user,
      recentActivities,
      formatDate,
      navigateTo,
      handleLogout
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.dashboard-container h1 {
  margin-bottom: 20px;
  color: #333;
}

.user-welcome {
  background-color: #e8f5e9;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 30px;
  border-left: 4px solid #4CAF50;
}

.user-welcome p {
  font-size: 18px;
  color: #2e7d32;
  margin: 0;
}

.dashboard-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.dashboard-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.dashboard-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.dashboard-card h3 {
  margin-bottom: 10px;
  color: #333;
}

.dashboard-card p {
  margin-bottom: 15px;
  color: #666;
}

.recent-activities {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 30px;
}

.recent-activities h2 {
  margin-bottom: 15px;
  color: #333;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.activity-item {
  padding: 12px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-item p {
  margin: 0;
  color: #555;
}

.activity-time {
  font-size: 14px;
  color: #999;
}

.no-activities {
  text-align: center;
  color: #999;
  padding: 20px;
  font-style: italic;
}

.logout-section {
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .dashboard-cards {
    grid-template-columns: 1fr;
  }
  
  .activity-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
}
</style>