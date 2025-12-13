// displayDishes.js

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, начинаем загрузку блюд...');
    
    // Показываем сообщение о загрузке
    showLoadingMessage();
    
    // Загружаем и отображаем блюда
    loadAndDisplayDishes();
});

async function loadAndDisplayDishes() {
    console.log('Начинаем загрузку блюд...');
    
    try {
        // Проверяем, доступна ли функция loadDishes
        if (typeof window.loadDishes !== 'function') {
            throw new Error('Функция loadDishes не найдена');
        }
        
        // Загружаем блюда через API
        console.log('Вызываем window.loadDishes()...');
        const loadedDishes = await window.loadDishes();
        
        if (!loadedDishes || loadedDishes.length === 0) {
            throw new Error('Не удалось загрузить блюда');
        }
        
        // Обновляем глобальный массив
        if (window.setDishes) {
            window.setDishes(loadedDishes);
        }
        
        console.log('Блюда успешно загружены, отображаем...');
        
        // Скрываем сообщение о загрузке
        hideLoadingMessage();
        
        // Отображаем блюда
        displayAllDishes();
        
    } catch (error) {
        console.error('Ошибка при загрузке блюд:', error);
        showErrorMessage('Не удалось загрузить меню. Пожалуйста, обновите страницу.');
    }
}

// Функция для сортировки блюд по названию в алфавитном порядке
function sortDishesByCategory(dishesArray, category) {
    if (!dishesArray || dishesArray.length === 0) return [];
    
    return dishesArray
        .filter(dish => dish.category === category)
        .sort((a, b) => a.name.localeCompare(b.name, 'ru'));
}

// Функция создания карточки блюда
function createDishCard(dish) {
    const card = document.createElement('div');
    card.className = 'dish-card';
    card.setAttribute('data-dish', dish.keyword);
    card.setAttribute('data-category', dish.category);
    card.setAttribute('data-kind', dish.kind);
    
    // Используем изображение из API или дефолтное
    let imageUrl = dish.image || 'images/default-food.jpg';
    
    card.innerHTML = `
        <img src="${imageUrl}" alt="${dish.name}" 
             onerror="this.onerror=null; this.src='images/default-food.jpg'">
        <p class="price">${dish.price} ₽</p>
        <p class="name">${dish.name}</p>
        <p class="weight">${dish.count}</p>
        <button class="add-to-order">Добавить</button>
    `;
    
    return card;
}

// Функция отображения всех блюд
function displayAllDishes() {
    // Получаем блюда
    const dishesList = window.getDishes ? window.getDishes() : [];
    
    console.log('Отображение блюд, найдено:', dishesList.length);
    
    if (dishesList.length === 0) {
        console.warn('Нет блюд для отображения');
        showNoDishesMessage();
        return;
    }
    
    // Сортируем блюда по категориям
    const soups = sortDishesByCategory(dishesList, 'soup');
    const mains = sortDishesByCategory(dishesList, 'main');
    const salads = sortDishesByCategory(dishesList, 'salad');
    const drinks = sortDishesByCategory(dishesList, 'drink');
    const desserts = sortDishesByCategory(dishesList, 'dessert');
    
    console.log('Распределение по категориям:', {
        soups: soups.length,
        mains: mains.length,
        salads: salads.length,
        drinks: drinks.length,
        desserts: desserts.length
    });
    
    // Обновляем контейнеры
    updateCategoryContainer('soups', soups, 'Супы');
    updateCategoryContainer('main-courses', mains, 'Главные блюда');
    updateCategoryContainer('salads', salads, 'Салаты и стартеры');
    updateCategoryContainer('drinks', drinks, 'Напитки');
    updateCategoryContainer('desserts', desserts, 'Десерты');
    
    console.log('Блюда отображены');
}

function updateCategoryContainer(sectionId, dishesArray, categoryName) {
    const container = document.querySelector(`#${sectionId} .dishes-grid`);
    if (!container) {
        console.warn(`Контейнер для ${categoryName} (${sectionId}) не найден`);
        return;
    }
    
    // Очищаем контейнер
    container.innerHTML = '';
    
    if (dishesArray.length === 0) {
        container.innerHTML = `<p class="no-dishes">Нет блюд в категории "${categoryName}"</p>`;
        return;
    }
    
    // Создаем карточки
    dishesArray.forEach(dish => {
        container.appendChild(createDishCard(dish));
    });
}

function showLoadingMessage() {
    const containers = document.querySelectorAll('.dishes-grid');
    containers.forEach(container => {
        if (container) {
            container.innerHTML = `
                <div class="loading-message" style="grid-column: 1/-1; text-align: center; padding: 40px;">
                    <p>Загрузка меню...</p>
                    <div style="margin-top: 10px;">
                        <div style="display: inline-block; width: 20px; height: 20px; border: 3px solid #f3f3f3; border-top: 3px solid #3498db; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                    </div>
                </div>
            `;
        }
    });
}

function hideLoadingMessage() {
    const loadingMessages = document.querySelectorAll('.loading-message');
    loadingMessages.forEach(msg => msg.remove());
}

function showNoDishesMessage() {
    const containers = document.querySelectorAll('.dishes-grid');
    containers.forEach(container => {
        if (container) {
            container.innerHTML = `
                <div class="no-data-message" style="grid-column: 1/-1; text-align: center; padding: 40px; color: #666;">
                    <p>Меню временно недоступно</p>
                    <p><small>Попробуйте обновить страницу</small></p>
                </div>
            `;
        }
    });
}

// Функция для показа сообщения об ошибке
function showErrorMessage(message) {
    // Удаляем старые сообщения об ошибках
    const oldErrors = document.querySelectorAll('.error-message');
    oldErrors.forEach(error => error.remove());
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        background-color: #ffebee;
        color: #c62828;
        padding: 15px;
        margin: 20px;
        border-radius: 5px;
        text-align: center;
        border: 1px solid #ffcdd2;
        grid-column: 1/-1;
    `;
    
    errorDiv.innerHTML = `
        <p><strong>Ошибка:</strong> ${message}</p>
        <button onclick="location.reload()" style="
            background-color: #c62828;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 10px;
            font-size: 14px;
        ">Обновить страницу</button>
    `;
    
    // Добавляем сообщение в начало main
    const main = document.querySelector('main .container');
    if (main) {
        main.prepend(errorDiv);
    }
}

// Добавляем стили для анимации загрузки
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);