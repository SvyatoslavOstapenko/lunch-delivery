// selectDishes.js - ОБНОВЛЕННАЯ ВЕРСИЯ

document.addEventListener('DOMContentLoaded', function() {
    // Ждем, пока блюда будут загружены
    const checkDishesLoaded = setInterval(() => {
        const dishes = window.getDishes ? window.getDishes() : [];
        if (dishes.length > 0) {
            clearInterval(checkDishesLoaded);
            console.log('Блюда загружены, инициализируем выбор блюд...');
            initSelectDishes();
            loadSavedDishes(); // Загружаем сохраненные блюда
        }
    }, 500);
    
    function initSelectDishes() {
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
        
        // Находим панель для перехода к оформлению (если есть)
        const checkoutPanel = document.getElementById('checkout-panel');
        const totalCostPanel = document.getElementById('total-cost-panel');
        const checkoutLink = document.getElementById('checkout-link');
        const invalidComboMessage = document.getElementById('invalid-combo-message');
        
        // Функция для поиска блюда по keyword
        function findDishByKeyword(keyword) {
            const dishes = window.getDishes ? window.getDishes() : [];
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
                if (nothingSelectedElement) nothingSelectedElement.style.display = 'block';
                if (soupCategoryElement) soupCategoryElement.style.display = 'none';
                if (mainCategoryElement) mainCategoryElement.style.display = 'none';
                if (saladCategoryElement) saladCategoryElement.style.display = 'none';
                if (drinkCategoryElement) drinkCategoryElement.style.display = 'none';
                if (dessertCategoryElement) dessertCategoryElement.style.display = 'none';
                if (totalCostContainer) totalCostContainer.style.display = 'none';
                
                // Скрываем панель оформления
                if (checkoutPanel) checkoutPanel.style.display = 'none';
                return;
            }
            
            // Что-то выбрано, скрываем "Ничего не выбрано"
            if (nothingSelectedElement) nothingSelectedElement.style.display = 'none';
            
            // Обновляем отображение для каждой категории
            updateCategoryDisplay('soup', selectedSoupElement, selectedSoupPriceElement, soupCategoryElement, 'Блюдо не выбрано');
            updateCategoryDisplay('main', selectedMainElement, selectedMainPriceElement, mainCategoryElement, 'Блюдо не выбрано');
            updateCategoryDisplay('salad', selectedSaladElement, selectedSaladPriceElement, saladCategoryElement, 'Блюдо не выбрано');
            updateCategoryDisplay('drink', selectedDrinkElement, selectedDrinkPriceElement, drinkCategoryElement, 'Напиток не выбран');
            updateCategoryDisplay('dessert', selectedDessertElement, selectedDessertPriceElement, dessertCategoryElement, 'Десерт не выбран');
            
            // Обновляем общую стоимость
            updateTotalCost();
            
            // Проверяем валидность комбо и обновляем панель оформления
            updateCheckoutPanel();
            
            // Сохраняем в localStorage
            saveToLocalStorage();
        }
        
        // Функция для обновления отображения конкретной категории
        function updateCategoryDisplay(category, nameElement, priceElement, categoryElement, defaultText) {
            const dish = selectedDishes[category];
            
            if (dish && nameElement && priceElement && categoryElement) {
                // Блюдо выбрано
                nameElement.textContent = dish.name;
                priceElement.textContent = `${dish.price} ₽`;
                categoryElement.style.display = 'block';
                
                // Обновляем скрытые поля
                updateHiddenField(category, dish);
            } else if (nameElement && priceElement && categoryElement) {
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
                if (category === 'soup' && hiddenSoupField) {
                    hiddenSoupField.value = dish.keyword;
                } else if (category === 'main' && hiddenMainField) {
                    hiddenMainField.value = dish.keyword;
                } else if (category === 'salad' && hiddenSaladField) {
                    hiddenSaladField.value = dish.keyword;
                } else if (category === 'drink' && hiddenDrinkField) {
                    hiddenDrinkField.value = dish.keyword;
                } else if (category === 'dessert' && hiddenDessertField) {
                    hiddenDessertField.value = dish.keyword;
                }
            } else {
                if (category === 'soup' && hiddenSoupField) {
                    hiddenSoupField.value = '';
                } else if (category === 'main' && hiddenMainField) {
                    hiddenMainField.value = '';
                } else if (category === 'salad' && hiddenSaladField) {
                    hiddenSaladField.value = '';
                } else if (category === 'drink' && hiddenDrinkField) {
                    hiddenDrinkField.value = '';
                } else if (category === 'dessert' && hiddenDessertField) {
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
            
            if (totalCostElement) totalCostElement.textContent = `${total} ₽`;
            if (hiddenTotalField) hiddenTotalField.value = total;
            
            // Обновляем стоимость в панели
            if (totalCostPanel) totalCostPanel.textContent = `${total} ₽`;
            
            // Показываем блок с общей стоимостью
            if (totalCostContainer) totalCostContainer.style.display = 'block';
        }
        
        // Функция для проверки валидности комбо
        function isValidCombo() {
            const { soup, main, salad, drink, dessert } = selectedDishes;
            
            // Варианты комбо:
            const combos = [
                { soup: true, main: true, salad: true, drink: true },  // Комбо 1
                { soup: true, main: true, salad: false, drink: true }, // Комбо 2
                { soup: true, main: false, salad: true, drink: true }, // Комбо 3
                { soup: false, main: true, salad: true, drink: true }, // Комбо 4
                { soup: false, main: true, salad: false, drink: true } // Комбо 5
            ];
            
            // Проверяем каждый комбо (игнорируем десерт)
            for (const combo of combos) {
                const hasSoup = !!soup;
                const hasMain = !!main;
                const hasSalad = !!salad;
                const hasDrink = !!drink;
                
                if (hasSoup === combo.soup && 
                    hasMain === combo.main && 
                    hasSalad === combo.salad && 
                    hasDrink === combo.drink) {
                    return true;
                }
            }
            
            return false;
        }
        
        // Функция для обновления панели оформления
        function updateCheckoutPanel() {
            if (!checkoutPanel) return;
            
            // Показываем панель, если есть выбранные блюда
            const hasSelection = selectedDishes.soup || selectedDishes.main || 
                               selectedDishes.salad || selectedDishes.drink || 
                               selectedDishes.dessert;
            
            if (hasSelection) {
                checkoutPanel.style.display = 'flex';
                
                // Проверяем валидность комбо
                const validCombo = isValidCombo();
                
                if (validCombo) {
                    // Валидное комбо - активируем ссылку
                    if (checkoutLink) {
                        checkoutLink.href = 'checkout.html';
                        checkoutLink.classList.remove('disabled');
                    }
                    if (invalidComboMessage) {
                        invalidComboMessage.style.display = 'none';
                    }
                } else {
                    // Невалидное комбо - деактивируем ссылку
                    if (checkoutLink) {
                        checkoutLink.href = '#';
                        checkoutLink.classList.add('disabled');
                    }
                    if (invalidComboMessage) {
                        invalidComboMessage.style.display = 'block';
                    }
                }
            } else {
                checkoutPanel.style.display = 'none';
            }
        }
        
        // Функция для сохранения в localStorage
        function saveToLocalStorage() {
            if (window.storageManager) {
                window.storageManager.saveSelectedDishes(selectedDishes);
            }
        }
        
        // Функция для загрузки сохраненных блюд
        function loadSavedDishes() {
            if (!window.storageManager) return;
            
            const savedData = window.storageManager.loadSelectedDishes();
            if (!savedData) return;
            
            console.log('Загружаем сохраненные блюда:', savedData);
            
            // Восстанавливаем выбранные блюда
            if (savedData.soup) {
                const dish = findDishByKeyword(savedData.soup);
                if (dish) {
                    selectedDishes.soup = dish;
                    highlightSelectedCardByKeyword('soup', dish.keyword);
                }
            }
            
            if (savedData.main) {
                const dish = findDishByKeyword(savedData.main);
                if (dish) {
                    selectedDishes.main = dish;
                    highlightSelectedCardByKeyword('main', dish.keyword);
                }
            }
            
            if (savedData.salad) {
                const dish = findDishByKeyword(savedData.salad);
                if (dish) {
                    selectedDishes.salad = dish;
                    highlightSelectedCardByKeyword('salad', dish.keyword);
                }
            }
            
            if (savedData.drink) {
                const dish = findDishByKeyword(savedData.drink);
                if (dish) {
                    selectedDishes.drink = dish;
                    highlightSelectedCardByKeyword('drink', dish.keyword);
                }
            }
            
            if (savedData.dessert) {
                const dish = findDishByKeyword(savedData.dessert);
                if (dish) {
                    selectedDishes.dessert = dish;
                    highlightSelectedCardByKeyword('dessert', dish.keyword);
                }
            }
            
            // Обновляем отображение
            updateSelectedDishesDisplay();
        }
        
        // Функция для подсветки карточки по keyword
        function highlightSelectedCardByKeyword(category, keyword) {
            const allCards = document.querySelectorAll(`.dish-card[data-category="${category}"]`);
            allCards.forEach(card => {
                if (card.getAttribute('data-dish') === keyword) {
                    card.classList.add('selected');
                } else {
                    card.classList.remove('selected');
                }
            });
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
            
            // Если блюдо уже выбрано, снимаем выбор
            if (selectedDishes[category] && selectedDishes[category].keyword === dishKeyword) {
                selectedDishes[category] = null;
            } else {
                // Обновляем выбранное блюдо в категории
                selectedDishes[category] = dish;
            }
            
            // Обновляем отображение
            updateSelectedDishesDisplay();
            
            // Добавляем/убираем визуальный эффект выбора
            highlightSelectedCard(card, category);
        }
        
        // Функция для подсветки выбранной карточки
        function highlightSelectedCard(selectedCard, category) {
            // Убираем подсветку у всех карточек этой категории
            const allCards = document.querySelectorAll(`.dish-card[data-category="${category}"]`);
            const dishKeyword = selectedCard.getAttribute('data-dish');
            
            allCards.forEach(card => {
                if (card.getAttribute('data-dish') === dishKeyword && selectedDishes[category] && selectedDishes[category].keyword === dishKeyword) {
                    card.classList.add('selected');
                } else {
                    card.classList.remove('selected');
                }
            });
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
    }
});