document.addEventListener('DOMContentLoaded', function() {
    const imageInput = document.getElementById('imageInput');
    const originalPreview = document.getElementById('originalPreview');
    const compressedPreview = document.getElementById('compressedPreview');
    const qualitySlider = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');
    const downloadButton = document.getElementById('downloadButton');
    const originalInfo = document.getElementById('originalInfo');
    const compressedInfo = document.getElementById('compressedInfo');

    let originalImage = null;

    // 监听文件上传
    imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;

        // 显示原始文件大小
        originalInfo.textContent = `文件大小：${formatFileSize(file.size)}`;

        // 创建文件阅读器
        const reader = new FileReader();
        reader.onload = function(e) {
            // 加载原始图片
            originalImage = new Image();
            originalImage.src = e.target.result;
            originalPreview.src = e.target.result;

            originalImage.onload = function() {
                compressImage(); // 首次压缩
            };
        };
        reader.readAsDataURL(file);
    });

    // 监听质量滑块变化
    qualitySlider.addEventListener('input', function(e) {
        qualityValue.textContent = e.target.value + '%';
        if (originalImage) {
            compressImage();
        }
    });

    // 图片压缩函数
    function compressImage() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // 设置画布尺寸
        canvas.width = originalImage.width;
        canvas.height = originalImage.height;

        // 绘制图片
        ctx.drawImage(originalImage, 0, 0);

        // 压缩图片
        const quality = qualitySlider.value / 100;
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);

        // 显示压缩后的图片
        compressedPreview.src = compressedDataUrl;

        // 计算压缩后的文件大小
        const compressedSize = Math.round((compressedDataUrl.length - 'data:image/jpeg;base64,'.length) * 3/4);
        compressedInfo.textContent = `文件大小：${formatFileSize(compressedSize)}`;

        // 启用下载按钮
        downloadButton.disabled = false;
        downloadButton.onclick = () => downloadImage(compressedDataUrl);
    }

    // 文件大小格式化
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // 下载图片
    function downloadImage(dataUrl) {
        const link = document.createElement('a');
        link.download = 'compressed-image.jpg';
        link.href = dataUrl;
        link.click();
    }
}); 