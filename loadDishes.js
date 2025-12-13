// loadDishes.js

async function loadDishesFromAPI() {
    try {
        // Определяем URL API
        let apiUrl = 'https://edu.std-900.ist.mospolytech.ru/labs/api/dishes';
        console.log('Загрузка данных с API:', apiUrl);
        
        // Используем fetch для получения данных
        const response = await fetch(apiUrl, {
            mode: 'cors',
            cache: 'no-cache'
        });
        
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status} ${response.statusText}`);
        }
        
        let data = await response.json();
        console.log('Данные успешно загружены:', data.length, 'блюд');
        
        // Преобразуем данные API в наш формат
        const transformedData = data.map(item => {
            // Преобразуем категории
            let category = item.category;
            if (category === 'main-course') {
                category = 'main';
            }
            // category: 'salad' уже подходит
            // category: 'drink' уже подходит
            // category: 'dessert' уже подходит
            // category: 'soup' уже подходит
            
            return {
                keyword: item.keyword,
                name: item.name,
                price: item.price,
                category: category,
                count: item.count,
                image: item.image,
                kind: item.kind
            };
        });
        
        console.log('Преобразовано блюд:', transformedData.length);
        console.log('Пример преобразованного блюда:', transformedData[0]);
        
        return transformedData;
        
    } catch (error) {
        console.error('Ошибка загрузки данных с API:', error);
        
        // Возвращаем тестовые данные в случае ошибки
        return getTestDishes();
    }
}

// Функция с тестовыми данными на случай ошибки API
function getTestDishes() {
    return [
        {
            keyword: "gaspacho",
            name: "Гаспачо",
            price: 195,
            category: "soup",
            count: "350 г",
            image: "https://edu.std-900.ist.mospolytech.ru/labs/api/images/soups/gazpacho",
            kind: "veg"
        },
        {
            keyword: "gribnoy",
            name: "Грибной суп-пюре",
            price: 185,
            category: "soup",
            count: "330 г",
            image: "https://edu.std-900.ist.mospolytech.ru/labs/api/images/soups/mushroom_soup",
            kind: "veg"
        },
        {
            keyword: "ramen",
            name: "Рамен",
            price: 375,
            category: "soup",
            count: "425 г",
            image: "https://edu.std-900.ist.mospolytech.ru/labs/api/images/soups/ramen",
            kind: "meat"
        },
        {
            keyword: "lazanya",
            name: "Лазанья",
            price: 385,
            category: "main",
            count: "310 г",
            image: "https://edu.std-900.ist.mospolytech.ru/labs/api/images/main_course/lasagna",
            kind: "meat"
        },
        {
            keyword: "pizza",
            name: "Пицца Маргарита",
            price: 450,
            category: "main",
            count: "470 г",
            image: "https://edu.std-900.ist.mospolytech.ru/labs/api/images/main_course/pizza",
            kind: "veg"
        },
        {
            keyword: "shrimppasta",
            name: "Паста с креветками",
            price: 340,
            category: "main",
            count: "280 г",
            image: "https://edu.std-900.ist.mospolytech.ru/labs/api/images/main_course/shrimppasta",
            kind: "fish"
        }
    ];
}

// Экспортируем функцию
window.loadDishes = loadDishesFromAPI;