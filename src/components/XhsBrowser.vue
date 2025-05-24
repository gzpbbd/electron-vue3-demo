<template>
  <div class="browser-container">
    <h2>小红书数据分析</h2>
    <div class="toolbar">
      <button @click="goBack" :disabled="!canGoBack">返回</button>
      <button @click="goForward" :disabled="!canGoForward">前进</button>
      <button @click="refresh">刷新</button>
      <input v-model="inputUrl" @keyup.enter="navigate" placeholder="输入URL" />
      <button @click="navigate">转到</button>
    </div>
    <div class="content">
      <p>当前浏览的页面: {{ inputUrl }}</p>
      <!-- 这里可以添加数据分析相关的内容 -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const inputUrl = ref('https://www.xiaohongshu.com');
const canGoBack = ref(false);
const canGoForward = ref(false);

const navigate = async () => {
  if (inputUrl.value) {
    const url = inputUrl.value.startsWith('http') ? inputUrl.value : `https://${inputUrl.value}`;
    await window.electronAPI.browserLoadUrl(url);
    updateNavState();
  }
};

const goBack = async () => {
  await window.electronAPI.browserGoBack();
  updateNavState();
};

const goForward = async () => {
  await window.electronAPI.browserGoForward();
  updateNavState();
};

const refresh = async () => {
  await window.electronAPI.browserRefresh();
  updateNavState();
};

const updateNavState = async () => {
  const state = await window.electronAPI.getNavState();
  canGoBack.value = state.canGoBack;
  canGoForward.value = state.canGoForward;
  inputUrl.value = state.currentUrl;
};

// 定期更新导航状态
let stateUpdateInterval: number;
onMounted(() => {
  updateNavState();
  stateUpdateInterval = setInterval(updateNavState, 1000) as unknown as number;
});

onUnmounted(() => {
  if (stateUpdateInterval) {
    clearInterval(stateUpdateInterval);
  }
});
</script>

<style scoped>
.browser-container {
  padding: 20px;
}

h2 {
  margin-bottom: 20px;
  color: #333;
}

.toolbar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.toolbar input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
}

.toolbar input:focus {
  border-color: #4CAF50;
}

.toolbar button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #4CAF50;
  color: white;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.toolbar button:hover {
  background-color: #45a049;
}

.toolbar button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.content {
  margin-top: 20px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 4px;
}
</style> 