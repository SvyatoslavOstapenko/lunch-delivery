document.addEventListener('DOMContentLoaded', function() {
    // Объект для хранения выбранных блюд
    let selectedDishes = {
        soup: null,
        main: null,
        drink: null
    };
    
    // Находим элементы для отображения выбранных блюд
    const selectedSoupElement = document.getElementById('selected-soup');
    const selectedMainElement = document.getElementById('selected-main');
    const selectedDrinkElement = document.getElementById('selected-drink');
    
    // Находим элементы для отображения цены
    const selectedSoupPriceElement = document.getElementById('selected-soup-price');
    const selectedMainPriceElement = document.getElementById('selected-main-price');
    const selectedDrinkPriceElement = document.getElementById('selected-drink-price');
    
    // Находим контейнеры категорий и общую стоимость
    const soupCategoryElement = document.querySelector('.soup-category');
    const mainCategoryElement = document.querySelector('.main-category');
    const drinkCategoryElement = document.querySelector('.drink-category');
    const nothingSelectedElement = document.getElementById('nothing-selected');
    const totalCostElement = document.getElementById('total-cost');
    const totalCostContainer = document.getElementById('total-cost-container');
    
    // Находим скрытые поля для отправки формы
    const hiddenSoupField = document.getElementById('hidden-soup');
    const hiddenMainField = document.getElementById('hidden-main');
    const hiddenDrinkField = document.getElementById('hidden-drink');
    const hiddenTotalField = document.getElementById('hidden-total');
    
    // Функция для поиска блюда по keyword
    function findDishByKeyword(keyword) {
        return dishes.find(dish => dish.keyword === keyword);
    }
    
    // Функция для обновления отображения выбранных блюд
    function updateSelectedDishesDisplay() {
        // Проверяем, выбрано ли хотя бы одно блюдо
        const hasSelection = selectedDishes.soup || selectedDishes.main || selectedDishes.drink;
        
        if (!hasSelection) {
            // Ничего не выбрано
            nothingSelectedElement.style.display = 'block';
            soupCategoryElement.style.display = 'none';
            mainCategoryElement.style.display = 'none';
            drinkCategoryElement.style.display = 'none';
            totalCostContainer.style.display = 'none';
            return;
        }
        
        // Что-то выбрано, скрываем "Ничего не выбрано"
        nothingSelectedElement.style.display = 'none';
        
        // Обновляем отображение для каждой категории
        updateCategoryDisplay('soup', selectedSoupElement, selectedSoupPriceElement, soupCategoryElement);
        updateCategoryDisplay('main', selectedMainElement, selectedMainPriceElement, mainCategoryElement);
        updateCategoryDisplay('drink', selectedDrinkElement, selectedDrinkPriceElement, drinkCategoryElement);
        
        // Обновляем общую стоимость
        updateTotalCost();
    }
    
    // Функция для обновления отображения конкретной категории
    function updateCategoryDisplay(category, nameElement, priceElement, categoryElement) {
        const dish = selectedDishes[category];
        
        if (dish) {
            // Блюдо выбрано
            nameElement.textContent = dish.name;
            priceElement.textContent = `${dish.price} ₽`;
            categoryElement.style.display = 'block';
            
            // Обновляем скрытые поля
            updateHiddenField(category, dish);
        } else {
            // Блюдо не выбрано
            nameElement.textContent = category === 'soup' ? 'Супы не выбраны' : 
                                     category === 'main' ? 'Основное блюдо не выбрано' : 
                                     'Напиток не выбран';
            priceElement.textContent = '0 ₽';
            categoryElement.style.display = 'block';
            
            // Очищаем скрытые поля
            updateHiddenField(category, null);
        }
    }
    
    // Функция для обновления скрытых полей
    function updateHiddenField(category, dish) {
        if (dish) {
            if (category === 'soup') {
                hiddenSoupField.value = dish.keyword;
            } else if (category === 'main') {
                hiddenMainField.value = dish.keyword;
            } else if (category === 'drink') {
                hiddenDrinkField.value = dish.keyword;
            }
        } else {
            if (category === 'soup') {
                hiddenSoupField.value = '';
            } else if (category === 'main') {
                hiddenMainField.value = '';
            } else if (category === 'drink') {
                hiddenDrinkField.value = '';
            }
        }
    }
    
    // Функция для обновления общей стоимости
    function updateTotalCost() {
        let total = 0;
        
        if (selectedDishes.soup) total += selectedDishes.soup.price;
        if (selectedDishes.main) total += selectedDishes.main.price;
        if (selectedDishes.drink) total += selectedDishes.drink.price;
        
        totalCostElement.textContent = `${total} ₽`;
        hiddenTotalField.value = total;
        
        // Показываем блок с общей стоимостью
        totalCostContainer.style.display = 'block';
    }
    
    // Функция для обработки клика по карточке блюда
    function handleDishClick(event) {
        // Находим ближайшую карточку (на случай клика по внутренним элементам)
        const card = event.target.closest('.dish-card');
        if (!card) return;
        
        // Получаем данные о блюде
        const dishKeyword = card.getAttribute('data-dish');
        const category = card.getAttribute('data-category');
        
        // Находим объект блюда
        const dish = findDishByKeyword(dishKeyword);
        if (!dish) return;
        
        // Обновляем выбранное блюдо в категории
        selectedDishes[category] = dish;
        
        // Обновляем отображение
        updateSelectedDishesDisplay();
        
        // Добавляем визуальный эффект выбора
        highlightSelectedCard(card, category);
    }
    
    // Функция для подсветки выбранной карточки
    function highlightSelectedCard(selectedCard, category) {
        // Убираем подсветку у всех карточек этой категории
        const allCards = document.querySelectorAll(`.dish-card[data-category="${category}"]`);
        allCards.forEach(card => {
            card.style.border = '';
            card.style.boxShadow = '';
        });
        
        // Подсвечиваем выбранную карточку
        selectedCard.style.border = '3px solid #3498db';
        selectedCard.style.boxShadow = '0 0 15px rgba(52, 152, 219, 0.3)';
    }
    
    // Добавляем обработчики клика на все карточки блюд
    document.addEventListener('click', function(event) {
        // Проверяем, кликнули ли на карточку или на кнопку внутри карточки
        if (event.target.closest('.dish-card') || event.target.classList.contains('dish-card')) {
            handleDishClick(event);
        }
    });
    
    // Инициализируем отображение
    updateSelectedDishesDisplay();
});