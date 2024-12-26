<template>
  <div class="admin">
    <header class="header">
      <div class="header-content">
        <router-link to="/" class="back-home">
          <i class="fas fa-arrow-left"></i> 返回首页
        </router-link>
        <h1>博客管理</h1>
        <p class="subtitle">创作与管理您的文章</p>
      </div>
    </header>
    <div class="article-form">
      <div class="form-header">
        <h2>{{ isEditing ? '编辑文章' : '创建新文章' }}</h2>
        <span class="form-tip">请填写以下信息来创建您的文章</span>
      </div>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>
            <i class="fas fa-heading"></i> 文章标题
          </label>
          <input 
            v-model="article.title" 
            required 
            placeholder="请输入文章标题"
          />
        </div>
        <div class="form-group">
          <label>
            <i class="fas fa-align-left"></i> 文章摘要
          </label>
          <textarea 
            v-model="article.summary" 
            required
            placeholder="请输入文章摘要，简短介绍文章内容"
          ></textarea>
        </div>
        <div class="form-group">
          <label>
            <i class="fas fa-pen-fancy"></i> 文章内容
          </label>
          <textarea 
            v-model="article.content" 
            required
            class="content-editor"
            placeholder="请输入文章正文内容"
          ></textarea>
        </div>
        <div class="form-actions">
          <button type="submit" class="submit-btn">
            <i class="fas fa-paper-plane"></i>
            {{ isEditing ? '更新文章' : '发布文章' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

export default {
  name: 'Admin',
  setup() {
    const router = useRouter()
    const article = ref({
      title: '',
      summary: '',
      content: ''
    })
    const isEditing = ref(false)

    const handleSubmit = async () => {
      try {
        const response = await axios.post('/api/articles', article.value)
        console.log('Article created:', response.data)
        // 清空表单
        article.value = {
          title: '',
          summary: '',
          content: ''
        }
        // 发布成功后跳转到首页
        router.push('/')
      } catch (error) {
        console.error('Error creating article:', error)
      }
    }

    return {
      article,
      isEditing,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.admin {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 60px 0;
  margin-bottom: 40px;
  text-align: center;
  border-radius: 0 0 40px 40px;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.15);
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
}

.header h1 {
  font-size: 2.5em;
  margin: 20px 0 0;
  font-weight: 700;
}

.subtitle {
  font-size: 1.1em;
  margin: 10px 0 0;
  opacity: 0.9;
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

.article-form {
  background: white;
  padding: 40px;
  border-radius: 24px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.05);
  max-width: 800px;
  margin: 0 auto;
}

.form-header {
  margin-bottom: 30px;
}

.form-header h2 {
  font-size: 1.8em;
  color: #2d3748;
  margin: 0 0 10px;
}

.form-tip {
  color: #718096;
  font-size: 0.95em;
}

.form-group {
  background: #f8fafc;
  padding: 20px;
  border-radius: 20px;
  margin-bottom: 25px;
  transition: all 0.3s ease;
}

.form-group:hover {
  background: #f1f5f9;
  transform: translateX(5px);
}

label {
  display: block;
  margin-bottom: 10px;
  color: #4a5568;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}

label i {
  color: #667eea;
}

input, textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 16px;
  font-size: 1em;
  color: #2d3748;
  transition: all 0.3s ease;
  background: #f8fafc;
}

input:focus, textarea:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

textarea {
  height: 120px;
  resize: vertical;
}

.content-editor {
  height: 300px;
}

.form-actions {
  text-align: right;
  margin-top: 40px;
}

.submit-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 1em;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  background: #5a6fe4;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

::placeholder {
  color: #a0aec0;
}
</style> 