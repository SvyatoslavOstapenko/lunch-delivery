// displayDishes.js

document.addEventListener('DOMContentLoaded', async function() {
    // Ждем загрузки данных с API
    console.log('Начинаем загрузку блюд...');
    
    try {
        // Загружаем блюда через API
        const loadedDishes = await window.loadDishes();
        
        // Обновляем глобальный массив
        if (window.setDishes) {
            window.setDishes(loadedDishes);
        }
        
        console.log('Блюда загружены, начинаем отображение...');
        
        // Теперь отображаем блюда
        displayAllDishes();
        
        // Добавляем обработчики событий для карточек
        addDishCardEventListeners();
        
    } catch (error) {
        console.error('Ошибка при отображении блюд:', error);
        // Показываем сообщение об ошибке
        showErrorMessage('Не удалось загрузить меню. Пожалуйста, обновите страницу.');
    }
});

// Функция для сортировки блюд по названию в алфавитном порядке
function sortDishesByCategory(dishesArray, category) {
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
    
    // Используем полный URL для изображений из API
    const imageUrl = dish.image.startsWith('http') ? dish.image : `images/${dish.image}`;
    
    card.innerHTML = `
        <img src="${imageUrl}" alt="${dish.name}" onerror="this.src='images/default-food.jpg'">
        <p class="price">${dish.price} ₽</p>
        <p class="name">${dish.name}</p>
        <p class="weight">${dish.count}</p>
        <button>Добавить</button>
    `;
    
    return card;
}

// Функция отображения всех блюд
function displayAllDishes() {
    const dishes = window.getDishes ? window.getDishes() : [];
    
    if (dishes.length === 0) {
        console.warn('Нет блюд для отображения');
        return;
    }
    
    // Сортируем блюда по категориям
    const soups = sortDishesByCategory(dishes, 'soup');
    const mains = sortDishesByCategory(dishes, 'main');
    const salads = sortDishesByCategory(dishes, 'salad');
    const drinks = sortDishesByCategory(dishes, 'drink');
    const desserts = sortDishesByCategory(dishes, 'dessert');
    
    // Находим контейнеры для каждой категории
    const soupsContainer = document.querySelector('#soups .dishes-grid');
    const mainsContainer = document.querySelector('#main-courses .dishes-grid');
    const saladsContainer = document.querySelector('#salads .dishes-grid');
    const drinksContainer = document.querySelector('#drinks .dishes-grid');
    const dessertsContainer = document.querySelector('#desserts .dishes-grid');
    
    // Очищаем контейнеры
    if (soupsContainer) soupsContainer.innerHTML = '';
    if (mainsContainer) mainsContainer.innerHTML = '';
    if (saladsContainer) saladsContainer.innerHTML = '';
    if (drinksContainer) drinksContainer.innerHTML = '';
    if (dessertsContainer) dessertsContainer.innerHTML = '';
    
    // Отображаем супы
    soups.forEach(soup => {
        if (soupsContainer) soupsContainer.appendChild(createDishCard(soup));
    });
    
    // Отображаем основные блюда
    mains.forEach(main => {
        if (mainsContainer) mainsContainer.appendChild(createDishCard(main));
    });
    
    // Отображаем салаты
    salads.forEach(salad => {
        if (saladsContainer) saladsContainer.appendChild(createDishCard(salad));
    });
    
    // Отображаем напитки
    drinks.forEach(drink => {
        if (drinksContainer) drinksContainer.appendChild(createDishCard(drink));
    });
    
    // Отображаем десерты
    desserts.forEach(dessert => {
        if (dessertsContainer) dessertsContainer.appendChild(createDishCard(dessert));
    });
    
    console.log('Блюда отображены:', {
        soups: soups.length,
        mains: mains.length,
        salads: salads.length,
        drinks: drinks.length,
        desserts: desserts.length
    });
}

// Функция для добавления обработчиков событий на карточки
function addDishCardEventListeners() {
    // Обработчики будут добавлены в selectDishes.js и filterDishes.js
    console.log('Карточки блюд готовы для взаимодействия');
}

// Функция для показа сообщения об ошибке
function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        background-color: #ffebee;
        color: #c62828;
        padding: 20px;
        margin: 20px;
        border-radius: 8px;
        text-align: center;
        border: 1px solid #ffcdd2;
    `;
    
    errorDiv.innerHTML = `
        <h3>⚠️ Ошибка загрузки</h3>
        <p>${message}</p>
        <button onclick="location.reload()" style="
            background-color: #c62828;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 10px;
        ">Обновить страницу</button>
    `;
    
    // Добавляем сообщение в начало main
    const main = document.querySelector('main .container');
    if (main) {
        main.prepend(errorDiv);
    }
}