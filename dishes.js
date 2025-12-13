// dishes.js

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