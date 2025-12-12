document.addEventListener('DOMContentLoaded', function() {
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
        
        card.innerHTML = `
            <img src="${dish.image}" alt="${dish.name}">
            <p class="price">${dish.price} ₽</p>
            <p class="name">${dish.name}</p>
            <p class="weight">${dish.count}</p>
            <button>Добавить</button>
        `;
        
        return card;
    }

    // Функция отображения всех блюд
    function displayAllDishes() {
        // Сортируем блюда по категориям
        const soups = sortDishesByCategory(dishes, 'soup');
        const mains = sortDishesByCategory(dishes, 'main');
        const drinks = sortDishesByCategory(dishes, 'drink');
        
        // Находим контейнеры для каждой категории
        const soupsContainer = document.querySelector('#soups .dishes-grid');
        const mainsContainer = document.querySelector('#main-courses .dishes-grid');
        const drinksContainer = document.querySelector('#drinks .dishes-grid');
        
        // Очищаем контейнеры (на случай перерисовки)
        soupsContainer.innerHTML = '';
        mainsContainer.innerHTML = '';
        drinksContainer.innerHTML = '';
        
        // Отображаем супы
        soups.forEach(soup => {
            soupsContainer.appendChild(createDishCard(soup));
        });
        
        // Отображаем основные блюда
        mains.forEach(main => {
            mainsContainer.appendChild(createDishCard(main));
        });
        
        // Отображаем напитки
        drinks.forEach(drink => {
            drinksContainer.appendChild(createDishCard(drink));
        });
    }

    // Запускаем отображение блюд
    displayAllDishes();
});