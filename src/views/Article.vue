<template>
  <div class="article-page">
    <header class="header">
      <div class="header-content">
        <router-link to="/" class="back-home">
          <i class="fas fa-arrow-left"></i> 返回首页
        </router-link>
      </div>
    </header>

    <main class="main-content">
      <div v-if="loading" class="loading-container">
        <div class="loading">
          <i class="fas fa-spinner fa-spin"></i> 加载中...
        </div>
      </div>
      
      <div v-else-if="error" class="error-message">
        <i class="fas fa-exclamation-circle"></i>
        {{ error }}
        <div class="error-actions">
          <button @click="fetchArticle" class="retry-btn">
            <i class="fas fa-redo"></i> 重试
          </button>
          <router-link to="/" class="home-btn">
            <i class="fas fa-home"></i> 返回首页
          </router-link>
        </div>
      </div>
      
      <article v-else-if="article" class="article">
        <h1 class="article-title">{{ article.title }}</h1>
        <div class="article-meta">
          <span class="date">
            <i class="far fa-calendar-alt"></i> 
            {{ formatDate(article.createTime) }}
          </span>
          <span class="update-time" v-if="article.updateTime">
            <i class="fas fa-sync-alt"></i>
            最后更新: {{ formatDate(article.updateTime) }}
          </span>
        </div>
        <div class="article-content" v-html="formattedContent"></div>
      </article>
    </main>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '../utils/axios'

export default {
  name: 'Article',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const article = ref(null)
    const loading = ref(false)
    const error = ref(null)

    const formattedContent = computed(() => {
      if (!article.value?.content) return ''
      return article.value.content.replace(/\n/g, '<br>')
    })

    const fetchArticle = async () => {
      loading.value = true
      error.value = null
      
      try {
        const response = await axios.get(`/articles/${route.params.id}`)
        if (!response.data) {
          throw new Error('文章不存在')
        }
        article.value = response.data
      } catch (err) {
        console.error('Error fetching article:', err)
        if (err.response?.status === 404) {
          error.value = '文章不存在或已被删除'
        } else {
          error.value = '获取文章详情失败，请稍后重试'
        }
      } finally {
        loading.value = false
      }
    }

    const formatDate = (date) => {
      if (!date) return ''
      return new Date(date).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    onMounted(fetchArticle)

    return {
      article,
      loading,
      error,
      formatDate,
      formattedContent,
      fetchArticle
    }
  }
}
</script>

<style scoped>
.article-page {
  min-height: 100vh;
  background-color: #f8fafc;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px 0;
  margin-bottom: 40px;
  border-radius: 0 0 40px 40px;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.15);
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

.back-home {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: white;
  background: rgba(255, 255, 255, 0.2);
  padding: 10px 20px;
  border-radius: 20px;
  text-decoration: none;
  font-size: 0.9em;
  transition: all 0.3s ease;
}

.back-home:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.main-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

.loading-container {
  display: flex;
  justify-content: center;
  padding: 60px 0;
}

.loading {
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  padding: 20px 40px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #667eea;
}

.error-message {
  background: #fff5f5;
  color: #c53030;
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  font-weight: 500;
  box-shadow: 0 4px 15px rgba(197, 48, 48, 0.1);
}

.error-actions {
  margin-top: 20px;
  display: flex;
  gap: 15px;
  justify-content: center;
}

.retry-btn, .home-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  font-size: 0.9em;
  transition: all 0.3s ease;
}

.retry-btn {
  background: #667eea;
  color: white;
}

.home-btn {
  background: #e2e8f0;
  color: #4a5568;
  text-decoration: none;
}

.retry-btn:hover, .home-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.article {
  background: white;
  padding: 40px;
  border-radius: 24px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.05);
}

.article-title {
  font-size: 2.5em;
  color: #2d3748;
  margin: 0 0 20px 0;
  line-height: 1.3;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 20px;
  color: #718096;
  font-size: 0.9em;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e2e8f0;
}

.date, .update-time {
  display: flex;
  align-items: center;
  gap: 6px;
}

.article-content {
  color: #4a5568;
  line-height: 1.8;
  font-size: 1.1em;
}

.article-content :deep(p) {
  margin-bottom: 1.5em;
}
</style> 