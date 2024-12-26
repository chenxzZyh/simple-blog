<template>
  <div class="home">
    <header class="header">
      <div class="header-content">
        <h1>陈晓哲的博客</h1>
        <p class="subtitle">分享技术与生活的点点滴滴</p>
        <router-link to="/admin" class="admin-link">
          <i class="fas fa-cog"></i> 管理页面
        </router-link>
      </div>
    </header>
    <main class="main">
      <div class="articles-container">
        <article v-for="article in articles" :key="article.id" class="article-card">
          <div class="article-content">
            <div class="article-header">
              <h2 class="article-title">{{ article.title }}</h2>
              <div class="article-actions">
                <button class="delete-btn" @click="confirmDelete(article)">
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
            <div class="meta">
              <span class="date">
                <i class="far fa-calendar-alt"></i> {{ formatDate(article.createTime) }}
              </span>
            </div>
            <p class="summary">{{ article.summary }}</p>
            <router-link :to="`/article/${article.id}`" class="read-more">
              阅读全文 <i class="fas fa-arrow-right"></i>
            </router-link>
          </div>
        </article>
      </div>
    </main>

    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal">
        <h3>确认删除</h3>
        <p>确定要删除文章 "{{ articleToDelete?.title }}" 吗？</p>
        <div class="modal-actions">
          <button class="cancel-btn" @click="cancelDelete">取消</button>
          <button class="confirm-btn" @click="handleDelete">确认删除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import axios from '../utils/axios'

export default {
  name: 'Home',
  setup() {
    const articles = ref([])
    const loading = ref(false)
    const error = ref(null)
    const showDeleteModal = ref(false)
    const articleToDelete = ref(null)

    const fetchArticles = async () => {
      loading.value = true
      try {
        const response = await axios.get('/articles')
        articles.value = response.data
      } catch (err) {
        error.value = '获取文章列表失败'
        console.error('Error fetching articles:', err)
      } finally {
        loading.value = false
      }
    }

    const confirmDelete = (article) => {
      articleToDelete.value = article
      showDeleteModal.value = true
    }

    const cancelDelete = () => {
      showDeleteModal.value = false
      articleToDelete.value = null
    }

    const handleDelete = async () => {
      try {
        await axios.delete(`/articles/${articleToDelete.value.id}`)
        articles.value = articles.value.filter(
          article => article.id !== articleToDelete.value.id
        )
        showDeleteModal.value = false
        articleToDelete.value = null
      } catch (error) {
        console.error('Error deleting article:', error)
        // 可以添加错误提示
      }
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('zh-CN')
    }

    onMounted(fetchArticles)

    return {
      articles,
      loading,
      error,
      formatDate,
      showDeleteModal,
      articleToDelete,
      confirmDelete,
      cancelDelete,
      handleDelete
    }
  }
}
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 100px 0;
  margin-bottom: 60px;
  text-align: center;
  border-radius: 0 0 40px 40px;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.15);
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
}

.header h1 {
  font-size: 3em;
  margin: 0;
  font-weight: 700;
  letter-spacing: -1px;
}

.subtitle {
  font-size: 1.2em;
  margin: 20px 0;
  opacity: 0.9;
}

.admin-link {
  display: inline-flex;
  align-items: center;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 20px;
  font-size: 0.9em;
  transition: all 0.3s ease;
}

.admin-link:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.articles-container {
  max-width: 800px;
  margin: 0 auto;
}

.article-card {
  background: #ffffff;
  border-radius: 24px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.article-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
}

.article-title {
  font-size: 1.8em;
  color: #2d3748;
  margin: 0 0 15px 0;
  line-height: 1.3;
}

.meta {
  color: #718096;
  font-size: 0.9em;
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  gap: 15px;
}

.date i {
  margin-right: 5px;
}

.summary {
  color: #4a5568;
  line-height: 1.6;
  margin: 0 0 25px 0;
  font-size: 1.1em;
}

.read-more {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #667eea;
  font-weight: 500;
  padding: 8px 20px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 16px;
  transition: all 0.3s ease;
}

.read-more:hover {
  background: rgba(102, 126, 234, 0.2);
  transform: translateX(5px);
}

.article-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.article-actions {
  display: flex;
  gap: 10px;
}

.delete-btn {
  background: none;
  border: none;
  color: #e53e3e;
  padding: 8px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.delete-btn:hover {
  background: rgba(229, 62, 62, 0.1);
  transform: translateY(-2px);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 30px;
  border-radius: 24px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 400px;
}

.modal h3 {
  color: #2d3748;
  margin: 0 0 15px 0;
  font-size: 1.5em;
}

.modal p {
  color: #4a5568;
  margin-bottom: 25px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
}

.cancel-btn, .confirm-btn {
  padding: 10px 20px;
  border-radius: 16px;
  border: none;
  cursor: pointer;
  font-size: 0.9em;
  transition: all 0.3s ease;
}

.cancel-btn {
  background: #e2e8f0;
  color: #4a5568;
}

.confirm-btn {
  background: #e53e3e;
  color: white;
}

.cancel-btn:hover, .confirm-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.confirm-btn:hover {
  background: #c53030;
}
</style> 