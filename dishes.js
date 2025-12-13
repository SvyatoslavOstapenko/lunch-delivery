
// данные будут загружаться через API

let dishes = []; // Массив будет заполняться после загрузки данных

// Функция для обновления массива блюд
function setDishes(newDishes) {
    dishes = newDishes;
    console.log('Блюда обновлены:', dishes.length, 'позиций');
}

// Функция для получения массива блюд
function getDishes() {
    return dishes;
}

// Экспортируем функции для использования
window.setDishes = setDishes;
window.getDishes = getDishes;