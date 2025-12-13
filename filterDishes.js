// filterDishes.js

document.addEventListener('DOMContentLoaded', function() {
    // Ждем, пока блюда будут загружены
    const checkDishesLoaded = setInterval(() => {
        const dishes = window.getDishes ? window.getDishes() : [];
        if (dishes.length > 0) {
            clearInterval(checkDishesLoaded);
            console.log('Блюда загружены, инициализируем фильтры...');
            initFilterDishes();
        }
    }, 500);
    
    function initFilterDishes() {
        // Функция для фильтрации блюд
        function filterDishes(category, kind) {
            const dishes = window.getDishes ? window.getDishes() : [];
            
            // Находим контейнер для данной категории
            let container;
            switch(category) {
                case 'soup':
                    container = document.querySelector('#soups .dishes-grid');
                    break;
                case 'main':
                    container = document.querySelector('#main-courses .dishes-grid');
                    break;
                case 'salad':
                    container = document.querySelector('#salads .dishes-grid');
                    break;
                case 'drink':
                    container = document.querySelector('#drinks .dishes-grid');
                    break;
                case 'dessert':
                    container = document.querySelector('#desserts .dishes-grid');
                    break;
                default:
                    return;
            }
            
            if (!container) return;
            
            // Очищаем контейнер
            container.innerHTML = '';
            
            // Фильтруем блюда
            let filteredDishes;
            if (kind === 'all') {
                filteredDishes = dishes.filter(dish => dish.category === category);
            } else {
                filteredDishes = dishes.filter(dish => dish.category === category && dish.kind === kind);
            }
            
            // Сортируем по алфавиту
            filteredDishes.sort((a, b) => a.name.localeCompare(b.name, 'ru'));
            
            // Создаем карточки
            filteredDishes.forEach(dish => {
                const card = document.createElement('div');
                card.className = 'dish-card';
                card.setAttribute('data-dish', dish.keyword);
                card.setAttribute('data-category', dish.category);
                card.setAttribute('data-kind', dish.kind);
                
                // Используем изображение из API или дефолтное
                let imageUrl = dish.image || 'images/default-food.jpg';
                
                card.innerHTML = `
                    <img src="${imageUrl}" alt="${dish.name}" onerror="this.src='images/default-food.jpg'">
                    <p class="price">${dish.price} ₽</p>
                    <p class="name">${dish.name}</p>
                    <p class="weight">${dish.count}</p>
                    <button>Добавить</button>
                `;
                
                container.appendChild(card);
            });
        }
        
        // Добавляем обработчики кликов на кнопки фильтров
        document.addEventListener('click', function(event) {
            if (event.target.classList.contains('filter-btn')) {
                const button = event.target;
                const filterContainer = button.closest('.filter-buttons');
                const category = filterContainer.getAttribute('data-category');
                const kind = button.getAttribute('data-kind');
                
                // Убираем активный класс у всех кнопок в этой категории
                filterContainer.querySelectorAll('.filter-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // Добавляем активный класс нажатой кнопке
                button.classList.add('active');
                
                // Применяем фильтр
                filterDishes(category, kind);
            }
        });
    }
});