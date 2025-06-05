// Общие функции для всех страниц

// Установка текущей даты
function setCurrentDate() {
    const now = new Date();
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    if (document.getElementById('currentDate')) {
        document.getElementById('currentDate').textContent = 
            now.toLocaleDateString('ru-RU', options);
    }
}

// Переключение темы
function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeLabels = document.querySelectorAll('.theme-label');
    
    // Восстановление темы из localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        if (themeToggle) themeToggle.checked = true;
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('change', function() {
            document.body.classList.toggle('dark-theme', this.checked);
            
            // Сохранение темы
            if (this.checked) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
            
            // Обновление подписей
            if (themeLabels.length > 0) {
                themeLabels[0].textContent = this.checked ? 'Светлая' : 'Тёмная';
                if (themeLabels[1]) {
                    themeLabels[1].textContent = this.checked ? 'Тёмная' : 'Светлая';
                }
            }
        });
    }
}

// Drag and drop для загрузки меню
function setupDragAndDrop() {
    const dropArea = document.querySelector('.upload-label');
    const fileInput = document.getElementById('menu-upload');
    
    if (!dropArea || !fileInput) return;
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
        dropArea.classList.add('highlight');
    }
    
    function unhighlight() {
        dropArea.classList.remove('highlight');
    }
    
    dropArea.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        fileInput.files = files;
        previewMenu();
    }
    
    fileInput.addEventListener('change', previewMenu);
}

// Предпросмотр загруженного меню
function previewMenu() {
    const fileInput = document.getElementById('menu-upload');
    const preview = document.getElementById('menuCurrentPreview');
    
    if (!fileInput || !preview) return;
    
    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            preview.src = e.target.result;
            // Обновляем дату загрузки
            setCurrentDate();
            // Показываем сообщение об успешной загрузке
            showUploadSuccess();
        }
        
        reader.readAsDataURL(fileInput.files[0]);
    }
}

// Показать сообщение об успешной загрузке
function showUploadSuccess() {
    const container = document.querySelector('.upload-container');
    if (!container) return;
    
    // Удаляем старое сообщение, если есть
    const oldMsg = document.querySelector('.upload-success');
    if (oldMsg) oldMsg.remove();
    
    const successMsg = document.createElement('p');
    successMsg.className = 'upload-success';
    successMsg.textContent = '✅ Меню успешно загружено!';
    container.appendChild(successMsg);
    
    // Удаляем сообщение через 3 секунды
    setTimeout(() => {
        successMsg.remove();
    }, 3000);
}

// Определение категории меню из URL
function setMenuCategory() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const titleElement = document.getElementById('menuPageTitle');
    const previewElement = document.getElementById('menuCurrentPreview');
    
    if (!titleElement || !previewElement) return;
    
    const categories = {
        'main-dishes': {
            title: 'Основные блюда',
            image: 'https://images.unsplash.com/photo-1516100882582-96c3a05fe590?ixlib=rb-4.0.3'
        },
        'desserts': {
            title: 'Десерты',
            image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?ixlib=rb-4.0.3'
        },
        'drinks': {
            title: 'Напитки',
            image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3'
        }
    };
    
    const defaultCategory = categories['main-dishes'];
    const selectedCategory = categories[category] || defaultCategory;
    
    titleElement.textContent = selectedCategory.title;
    previewElement.src = selectedCategory.image;
}

// Инициализация страницы
document.addEventListener('DOMContentLoaded', function() {
    // Общие функции
    setCurrentDate();
    setupThemeToggle();
    
    // Функции для страницы меню
    setMenuCategory();
    setupDragAndDrop();
});

// Preloader
document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.querySelector('.preloader');
    const loaderBar = document.querySelector('.loader-bar');
    const progressElement = document.getElementById('progress');
    const body = document.body;
    
    // Блокируем прокрутку во время загрузки
    body.style.overflow = 'hidden';
    
    let progress = 0;
    let pageLoaded = false;
    let progressComplete = false;
    
    function hidePreloader() {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
        
        // Показываем основной контент с анимацией
        document.querySelector('.content-wrapper').style.opacity = '1';
        document.querySelector('.content-wrapper').style.transform = 'translateY(0)';
        
        // Возвращаем прокрутку
        setTimeout(() => {
            body.style.overflow = 'auto';
        }, 800);
    }
    
    function updateProgress() {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            progressComplete = true;
            clearInterval(intervalId);
            if (pageLoaded) {
                setTimeout(hidePreloader, 500);
            }
        }
        progressElement.textContent = Math.floor(progress);
        loaderBar.style.width = progress + '%';
    }
    
    const intervalId = setInterval(updateProgress, 200);
    
    window.addEventListener('load', () => {
        pageLoaded = true;
        if (progressComplete) {
            setTimeout(hidePreloader, 500);
        }
    });
});