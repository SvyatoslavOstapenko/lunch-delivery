document.addEventListener('DOMContentLoaded', function() {
    // Объект для хранения выбранных блюд
    let selectedDishes = {
        soup: null,
        main: null,
        salad: null,
        drink: null,
        dessert: null
    };
    
    // Находим элементы для отображения выбранных блюд
    const selectedSoupElement = document.getElementById('selected-soup');
    const selectedMainElement = document.getElementById('selected-main');
    const selectedSaladElement = document.getElementById('selected-salad');
    const selectedDrinkElement = document.getElementById('selected-drink');
    const selectedDessertElement = document.getElementById('selected-dessert');
    
    // Находим элементы для отображения цены
    const selectedSoupPriceElement = document.getElementById('selected-soup-price');
    const selectedMainPriceElement = document.getElementById('selected-main-price');
    const selectedSaladPriceElement = document.getElementById('selected-salad-price');
    const selectedDrinkPriceElement = document.getElementById('selected-drink-price');
    const selectedDessertPriceElement = document.getElementById('selected-dessert-price');
    
    // Находим контейнеры категорий и общую стоимость
    const soupCategoryElement = document.querySelector('.soup-category');
    const mainCategoryElement = document.querySelector('.main-category');
    const saladCategoryElement = document.querySelector('.salad-category');
    const drinkCategoryElement = document.querySelector('.drink-category');
    const dessertCategoryElement = document.querySelector('.dessert-category');
    const nothingSelectedElement = document.getElementById('nothing-selected');
    const totalCostElement = document.getElementById('total-cost');
    const totalCostContainer = document.getElementById('total-cost-container');
    
    // Находим скрытые поля для отправки формы
    const hiddenSoupField = document.getElementById('hidden-soup');
    const hiddenMainField = document.getElementById('hidden-main');
    const hiddenSaladField = document.getElementById('hidden-salad');
    const hiddenDrinkField = document.getElementById('hidden-drink');
    const hiddenDessertField = document.getElementById('hidden-dessert');
    const hiddenTotalField = document.getElementById('hidden-total');
    
    // Функция для поиска блюда по keyword
    function findDishByKeyword(keyword) {
        return dishes.find(dish => dish.keyword === keyword);
    }
    
    // Функция для обновления отображения выбранных блюд
    function updateSelectedDishesDisplay() {
        // Проверяем, выбрано ли хотя бы одно блюдо
        const hasSelection = selectedDishes.soup || selectedDishes.main || 
                           selectedDishes.salad || selectedDishes.drink || 
                           selectedDishes.dessert;
        
        if (!hasSelection) {
            // Ничего не выбрано
            nothingSelectedElement.style.display = 'block';
            soupCategoryElement.style.display = 'none';
            mainCategoryElement.style.display = 'none';
            saladCategoryElement.style.display = 'none';
            drinkCategoryElement.style.display = 'none';
            dessertCategoryElement.style.display = 'none';
            totalCostContainer.style.display = 'none';
            return;
        }
        
        // Что-то выбрано, скрываем "Ничего не выбрано"
        nothingSelectedElement.style.display = 'none';
        
        // Обновляем отображение для каждой категории
        updateCategoryDisplay('soup', selectedSoupElement, selectedSoupPriceElement, soupCategoryElement, 'Супы не выбраны');
        updateCategoryDisplay('main', selectedMainElement, selectedMainPriceElement, mainCategoryElement, 'Основное блюдо не выбрано');
        updateCategoryDisplay('salad', selectedSaladElement, selectedSaladPriceElement, saladCategoryElement, 'Салат не выбран');
        updateCategoryDisplay('drink', selectedDrinkElement, selectedDrinkPriceElement, drinkCategoryElement, 'Напиток не выбран');
        updateCategoryDisplay('dessert', selectedDessertElement, selectedDessertPriceElement, dessertCategoryElement, 'Десерт не выбран');
        
        // Обновляем общую стоимость
        updateTotalCost();
    }
    
    // Функция для обновления отображения конкретной категории
    function updateCategoryDisplay(category, nameElement, priceElement, categoryElement, defaultText) {
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
            nameElement.textContent = defaultText;
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
            } else if (category === 'salad') {
                hiddenSaladField.value = dish.keyword;
            } else if (category === 'drink') {
                hiddenDrinkField.value = dish.keyword;
            } else if (category === 'dessert') {
                hiddenDessertField.value = dish.keyword;
            }
        } else {
            if (category === 'soup') {
                hiddenSoupField.value = '';
            } else if (category === 'main') {
                hiddenMainField.value = '';
            } else if (category === 'salad') {
                hiddenSaladField.value = '';
            } else if (category === 'drink') {
                hiddenDrinkField.value = '';
            } else if (category === 'dessert') {
                hiddenDessertField.value = '';
            }
        }
    }
    
    // Функция для обновления общей стоимости
    function updateTotalCost() {
        let total = 0;
        
        if (selectedDishes.soup) total += selectedDishes.soup.price;
        if (selectedDishes.main) total += selectedDishes.main.price;
        if (selectedDishes.salad) total += selectedDishes.salad.price;
        if (selectedDishes.drink) total += selectedDishes.drink.price;
        if (selectedDishes.dessert) total += selectedDishes.dessert.price;
        
        totalCostElement.textContent = `${total} ₽`;
        hiddenTotalField.value = total;
        
        // Показываем блок с общей стоимостью
        totalCostContainer.style.display = 'block';
    }
    
    // Функция для обработки клика по карточке блюда
    function handleDishClick(event) {
        // Находим ближайшую карточку
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
            card.classList.remove('selected');
        });
        
        // Подсвечиваем выбранную карточку
        selectedCard.classList.add('selected');
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