// loadDishes.js

let dishes = []; // Глобальная переменная для хранения блюд

async function loadDishes() {
    try {
        // Определяем URL API в зависимости от хостинга
        let apiUrl;
        if (window.location.hostname.includes('netlify.app') || window.location.hostname.includes('github.io')) {
            apiUrl = 'https://edu.std-900.ist.mospolytech.ru/labs/api/dishes';
        } else {
            apiUrl = 'http://lab7-api.std-900.ist.mospolytech.ru/api/dishes';
        }
        
        console.log('Загрузка данных с API:', apiUrl);
        
        // Используем fetch для получения данных
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Данные успешно загружены:', data.length, 'блюд');
        
        // Сохраняем данные в глобальную переменную
        dishes = data;
        
        // Возвращаем данные для использования
        return dishes;
        
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        // В случае ошибки возвращаем пустой массив
        return [];
    }
}

// Экспортируем функцию для использования в других файлах
window.loadDishes = loadDishes;
window.getDishes = () => dishes;