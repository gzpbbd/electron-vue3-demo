// 小红书数据提取脚本
export function extractXiaohongshuData() {
    const data = {
        postInfo: {},
        authorInfo: {},
        images: [],
        comments: [],
        tags: [],
        interactions: {},
        metadata: {}
    };
    
    try {
        // 1. 提取帖子基本信息
        console.log('🔍 开始提取帖子信息...');
        
        const titleMeta = document.querySelector('meta[property="og:title"]');
        const descMeta = document.querySelector('meta[name="description"]');
        const imageMeta = document.querySelector('meta[property="og:image"]');
        const urlMeta = document.querySelector('meta[property="og:url"]');
        const likeMeta = document.querySelector('meta[name="og:xhs:note_like"]');
        const commentMeta = document.querySelector('meta[name="og:xhs:note_comment"]');
        const collectMeta = document.querySelector('meta[name="og:xhs:note_collect"]');
        
        data.postInfo.title = titleMeta ? titleMeta.content : document.title;
        data.postInfo.description = descMeta ? descMeta.content : '';
        data.postInfo.url = urlMeta ? urlMeta.content : window.location.href;
        data.postInfo.coverImage = imageMeta ? imageMeta.content : '';
        
        // 从页面内容提取详细信息
        const noteContent = document.querySelector('.note-content, [data-v-610be4fa]');
        if (noteContent) {
            const titleEl = noteContent.querySelector('.title, h1');
            const descEl = noteContent.querySelector('.desc, .content, p');
            
            if (titleEl && !data.postInfo.title) {
                data.postInfo.title = titleEl.textContent.trim();
            }
            if (descEl && !data.postInfo.description) {
                data.postInfo.description = descEl.textContent.trim();
            }
        }
        
        // 2. 提取互动数据
        console.log('💖 提取互动数据...');
        data.interactions.likes = likeMeta ? parseInt(likeMeta.content) : 0;
        data.interactions.comments = commentMeta ? parseInt(commentMeta.content) : 0;
        data.interactions.collects = collectMeta ? parseInt(collectMeta.content) : 0;
        
        // 3. 提取作者信息
        console.log('👤 提取作者信息...');
        const authorWrapper = document.querySelector('.author-wrapper, [data-v-701599c8], .user-info');
        if (authorWrapper) {
            const nameEl = authorWrapper.querySelector('.name, .user-name, .username');
            const avatarEl = authorWrapper.querySelector('img, .avatar img, .user-image');
            
            if (nameEl) {
                data.authorInfo.name = nameEl.textContent.trim();
            }
            if (avatarEl) {
                data.authorInfo.avatar = avatarEl.src || avatarEl.getAttribute('data-src');
            }
        }
        
        // 4. 提取标签
        console.log('🏷️ 提取标签...');
        const tagSet = new Set();
        const tagElements = document.querySelectorAll('.tag, [data-v-39010cd1], a[href*="keyword"]');
        tagElements.forEach(tag => {
            const tagText = tag.textContent.trim();
            if (tagText && tagText.startsWith('#')) {
                tagSet.add(tagText);
            }
        });
        data.tags = Array.from(tagSet);
        
        // 5. 提取图片
        console.log('🖼️ 提取图片...');
        const imageSet = new Set();
        if (data.postInfo.coverImage) {
            imageSet.add(data.postInfo.coverImage);
        }
        const imageSelectors = [
            '.slider-container img',
            '.media-container img',
            '.swiper-slide img',
            '.note-slider img',
            'img[src*="sns-webpic"]',
            'img[src*="xhscdn"]'
        ];
        imageSelectors.forEach(selector => {
            const imgs = document.querySelectorAll(selector);
            imgs.forEach(img => {
                const src = img.src || img.getAttribute('data-src');
                if (src && !src.includes('avatar') && !src.includes('emoji')) {
                    imageSet.add(src);
                }
            });
        });
        data.images = Array.from(imageSet);
        
        // 6. 提取评论
        console.log('💬 提取评论...');
        const comments = document.querySelectorAll('.comment-item');
        comments.forEach((comment, index) => {
            const commentData = extractCommentData(comment, index + 1);
            if (commentData.content) {
                data.comments.push(commentData);
            }
        });
        
        // 7. 提取元数据
        console.log('📊 提取元数据...');
        data.metadata.extractTime = new Date().toISOString();
        data.metadata.userAgent = navigator.userAgent;
        data.metadata.url = window.location.href;
        data.metadata.pageTitle = document.title;
        
        const urlMatch = window.location.href.match(/explore\/([a-f0-9]+)/);
        if (urlMatch) {
            data.metadata.noteId = urlMatch[1];
        }
        
        return data;
    } catch (error) {
        console.error('❌ 提取数据时出错：', error);
        return data;
    }
}

export function extractCommentData(commentEl, id) {
    const comment = {
        id: id,
        author: '',
        content: '',
        time: '',
        likes: 0,
        avatar: ''
    };
    
    try {
        const authorEl = commentEl.querySelector('.author .name');
        if (authorEl) {
            comment.author = authorEl.textContent.trim();
        }
        
        const contentEl = commentEl.querySelector('.content .note-text');
        if (contentEl) {
            comment.content = contentEl.textContent.trim();
        }
        
        const timeEl = commentEl.querySelector('.date span:first-child');
        if (timeEl) {
            comment.time = timeEl.textContent.trim();
        }
        
        const likeEl = commentEl.querySelector('.like .count');
        if (likeEl) {
            comment.likes = parseInt(likeEl.textContent.trim()) || 0;
        }
        
        const avatarEl = commentEl.querySelector('.avatar img');
        if (avatarEl) {
            comment.avatar = avatarEl.src || avatarEl.getAttribute('data-src');
        }
    } catch (error) {
        console.warn('提取评论数据时出错：', error);
    }
    
    return comment;
}

export function extractAndOutputData() {
    console.log('🚀 开始提取小红书帖子数据...');
    console.log('📄 当前页面：', window.location.href);
    
    const extractedData = extractXiaohongshuData();
    
    console.log('\n📋 提取结果统计：');
    console.log(`📝 帖子标题：${extractedData.postInfo.title || '未找到'}`);
    console.log(`👤 作者：${extractedData.authorInfo.name || '未找到'}`);
    console.log(`🖼️ 图片数量：${extractedData.images.length}`);
    console.log(`💬 评论数量：${extractedData.comments.length}`);
    console.log(`🏷️ 标签数量：${extractedData.tags.length}`);
    
    // 下载JSON文件
    const blob = new Blob([JSON.stringify(extractedData, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `xiaohongshu_${extractedData.metadata.noteId || 'post'}_${new Date().getTime()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('💾 JSON文件已自动下载！');
    
    return extractedData;
} 