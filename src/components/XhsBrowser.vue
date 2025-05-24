<template>
  <div class="browser-container">
    <header class="header">
      <h2>小红书数据分析</h2>
    </header>
    
    <nav class="toolbar">
      <div class="nav-controls">
        <button @click="goBack" :disabled="!canGoBack" title="后退">
          <span>←</span>
        </button>
        <button @click="goForward" :disabled="!canGoForward" title="前进">
          <span>→</span>
        </button>
        <button @click="refresh" title="刷新">
          <span>↻</span>
        </button>
      </div>
      <div class="url-bar">
        <input 
          v-model="inputUrl" 
          @keyup.enter="navigate" 
          placeholder="输入小红书链接" 
        />
        <button @click="navigate" class="go-btn">转到</button>
      </div>
    </nav>

    <main class="main-content">
      <div class="status-bar">
        <span class="url-display">当前页面: {{ inputUrl }}</span>
        <button @click="extractData" class="extract-btn">
          <span>提取数据</span>
        </button>
      </div>
      
      <div class="data-panel">
        <div class="data-section">
          <h3>数据分析面板</h3>
          <p>等待提取数据...</p>
          <!-- 这里后续可以添加数据可视化组件 -->
        </div>
      </div>
    </main>
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

const extractData = async () => {
  try {
    console.log('开始提取数据...');
    const data = await window.electronAPI.extractPageData();
    if (data) {
      console.log('数据提取成功：', data);
    } else {
      console.error('数据提取失败');
    }
  } catch (error) {
    console.error('提取数据时出错：', error);
  }
};

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
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background-color: #f8f8f8;
  overflow: hidden;
}

.header {
  padding: 12px 16px;
  background-color: #ff2442;
  color: white;
}

.header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
}

.toolbar {
  padding: 8px;
  background-color: #ffffff;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  gap: 8px;
}

.nav-controls {
  display: flex;
  gap: 4px;
}

.nav-controls button {
  width: 32px;
  height: 32px;
  border: 1px solid #e0e0e0;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.nav-controls button:hover:not(:disabled) {
  background-color: #f5f5f5;
}

.nav-controls button:disabled {
  color: #ccc;
  cursor: not-allowed;
}

.url-bar {
  flex: 1;
  display: flex;
  gap: 8px;
}

.url-bar input {
  flex: 1;
  padding: 6px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
}

.url-bar input:focus {
  border-color: #ff2442;
}

.go-btn {
  padding: 6px 12px;
  background-color: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  cursor: pointer;
}

.go-btn:hover {
  background-color: #e8e8e8;
}

.main-content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.status-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.url-display {
  font-size: 13px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.extract-btn {
  padding: 8px 16px;
  background-color: #ff2442;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.extract-btn:hover {
  background-color: #e61e3c;
}

.data-panel {
  flex: 1;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  padding: 16px;
}

.data-section {
  h3 {
    margin: 0 0 16px 0;
    font-size: 16px;
    color: #333;
  }

  p {
    color: #666;
    font-size: 14px;
  }
}
</style> 