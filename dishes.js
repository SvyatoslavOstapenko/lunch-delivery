// dishes.js - ОБНОВЛЕННАЯ ВЕРСИЯ

// Глобальная переменная для хранения блюд
window.dishesData = [];

// Функция для установки блюд
window.setDishes = function(newDishes) {
    window.dishesData = newDishes;
    console.log('Блюда установлены:', window.dishesData.length, 'позиций');
};

// Функция для получения блюд
window.getDishes = function() {
    return window.dishesData;
};

// Функция для поиска блюда по ID
window.getDishById = function(id) {
    return window.dishesData.find(dish => dish.id == id);
};

// Функция для поиска блюда по keyword
window.getDishByKeyword = function(keyword) {
    return window.dishesData.find(dish => dish.keyword === keyword);
};