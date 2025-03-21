// 声明 cozeClient 变量
let cozeClient;

// 初始化 Coze WebChatClient
function initCozeChat() {
    cozeClient = new CozeWebSDK.WebChatClient({
        config: {
            bot_id: '7479515921476829234', // 确保这里填入正确的 Agent ID
        },
        auth: {
            type: 'token',
            token: 'pat_TCtGPcd233EJ6fVyA5oz6dyZTaEWdkoL5aLlHtEsWhOpt3JNIW1LgKHuH0LxLtZ9', // 使用您的 API 密钥
            onRefreshToken: async () => '', // 处理刷新令牌
        },
        userInfo: {
            id: 'user',
            url: 'https://lf-coze-web-cdn.coze.cn/obj/coze-web-cn/obric/coze/favicon.1970.png',
            nickname: 'UserA',
        },
        ui: {
            base: {
                icon: 'https://lf-coze-web-cdn.coze.cn/obj/coze-web-cdn/obric/coze/favicon.1970.png',
                layout: 'pc',
                lang: 'en',
                zIndex: 1000,
            },
            chatBot: {
                title: 'Coze Bot',
                uploadable: true,
                width: 390,
            },
            asstBtn: {
                isNeed: true,
            },
            footer: {
                isShow: true,
                expressionText: 'Powered by &',
                linkvars: {
                    name: {
                        text: 'A',
                        link: 'https://www.test1.com',
                    },
                    name1: {
                        text: 'B',
                        link: 'https://www.test2.com',
                    },
                },
            },
        },
    });

    console.log('Coze SDK 初始化成功:', cozeClient); // 确保在初始化后打印

    // 监听机器人回复
    if (cozeClient.onMessage) {
        cozeClient.onMessage((message) => {
            const chatContent = document.getElementById('chatContent');
            chatContent.innerHTML += `<p>Bot: ${message}</p>`;
        });
    } else {
        console.error('Coze SDK 未提供 onMessage 方法');
    }
}

// 发送消息功能
document.getElementById('sendButton').addEventListener('click', function() {
    const message = document.getElementById('chatInput').value;
    if (message) {
        const chatContent = document.getElementById('chatContent');
        chatContent.innerHTML += `<p>User: ${message}</p>`;
        document.getElementById('chatInput').value = ''; // 清空输入框

        // 使用 Coze SDK 发送消息
        if (cozeClient && cozeClient.sendMessage) {
            cozeClient.sendMessage(message).then(response => {
                chatContent.innerHTML += `<p>Coze: ${response.reply}</p>`; // 假设 response.reply 是 Coze 的回复
            }).catch(error => {
                console.error('发送消息时出错:', error);
            });
        } else {
            console.error('Coze SDK 未初始化或 sendMessage 方法不存在');
        }
    } else {
        alert('请输入消息。');
    }
});

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initCozeChat(); // 初始化 Coze 聊天客户端
});

// 显示提示信息
function showTooltip(message) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.innerText = message;
    document.body.appendChild(tooltip);
    
    // 设置样式
    tooltip.style.position = 'fixed';
    tooltip.style.top = '70px';
    tooltip.style.left = '50%';
    tooltip.style.transform = 'translateX(-50%)';
    tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    tooltip.style.color = 'white';
    tooltip.style.padding = '8px 15px';
    tooltip.style.borderRadius = '4px';
    tooltip.style.zIndex = '1500';
    
    // 显示后3秒隐藏
    setTimeout(() => {
        tooltip.remove();
    }, 3000);
}

// 在发送消息后调用
function sendToCoze(text) {
    console.log("准备发送文本:", text);
    
    // 打开Coze窗口
    tryOpenCozeWindow();
    
    // 复制到剪贴板并显示友好通知
    navigator.clipboard.writeText(currentSelectedText).then(function() {
        showTooltip('文本已复制到剪贴板');
        focusChatWindow();
    }).catch(function(err) {
        console.error("复制到剪贴板失败:", err);
        alert("无法复制文本。请手动复制: " + currentSelectedText);
    });
}

// 加载 PDF 文件
function loadPdf(file) {
    const fileReader = new FileReader();
    
    fileReader.onload = function() {
        const typedarray = new Uint8Array(this.result);
        
        pdfjsLib.getDocument(typedarray).promise.then(function(pdf) {
            pdfDoc = pdf;
            pageCount = pdf.numPages;
            console.log(`PDF已加载，共${pageCount}页`);
            
            document.getElementById('pdf-container').innerHTML = '';
            
            for (let i = 1; i <= pageCount; i++) {
                renderPage(i);
            }
        });
    };
    
    fileReader.readAsArrayBuffer(file);
}

// 渲染单个页面
function renderPage(pageNumber) {
    pdfDoc.getPage(pageNumber).then(function(page) {
        const viewport = page.getViewport({ scale: scale });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        const renderContext = {
            canvasContext: context,
            viewport: viewport
        };
        
        page.render(renderContext).promise.then(function() {
            // 这里可以添加其他处理逻辑
        });
    });
}

document.getElementById('file-input').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const url = URL.createObjectURL(file);
        document.getElementById('pdf-embed').src = url;
        document.getElementById('pdf-embed').style.display = 'block'; // 显示 PDF
    }
});

// 清除PDF显示
document.getElementById('clear-button').addEventListener('click', function() {
    document.getElementById('pdf-embed').removeAttribute('src');
    document.getElementById('pdf-embed').style.display = 'none'; // 隐藏 PDF
});
