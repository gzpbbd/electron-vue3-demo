<script setup lang="ts">
import { ref } from 'vue'
import type { FileInfo } from './types/electron'

const fileList = ref<FileInfo[]>([])
const loading = ref(false)

const loadDriveFiles = async () => {
  loading.value = true
  try {
    fileList.value = await window.electronAPI.getDriveFiles()
  } catch (error) {
    console.error('Error loading files:', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="container">
    <button @click="loadDriveFiles" :disabled="loading">
      {{ loading ? '加载中...' : '显示主目录文件列表' }}
    </button>
    
    <div class="file-list" v-if="fileList.length > 0">
      <h3>主目录文件列表：</h3>
      <ul>
        <li v-for="file in fileList" :key="file.path" class="file-item">
          <span class="file-icon">{{ file.isDirectory ? '📁' : '📄' }}</span>
          <span class="file-name">{{ file.name }}</span>
          <span class="file-type">{{ file.isDirectory ? '文件夹' : '文件' }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.file-list {
  margin-top: 20px;
}

ul {
  list-style-type: none;
  padding: 0;
}

.file-item {
  padding: 12px;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  gap: 12px;
}

.file-item:last-child {
  border-bottom: none;
}

.file-icon {
  font-size: 1.2em;
}

.file-name {
  flex: 1;
  font-family: monospace;
}

.file-type {
  color: #666;
  font-size: 0.9em;
}
</style>
