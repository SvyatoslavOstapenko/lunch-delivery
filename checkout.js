// checkout.js

document.addEventListener('DOMContentLoaded', function() {
    console.log('Страница оформления заказа загружена');
    
    // Ждем, пока блюда будут загружены
    const checkDishesLoaded = setInterval(() => {
        const dishes = window.getDishes ? window.getDishes() : [];
        if (dishes.length > 0 && window.storageManager) {
            clearInterval(checkDishesLoaded);
            console.log('Блюда загружены, инициализируем страницу оформления...');
            initCheckoutPage();
        }
    }, 500);
    
    function initCheckoutPage() {
        // Загружаем сохраненные блюда
        const savedData = window.storageManager.loadSelectedDishes();
        
        if (!savedData) {
            // Нет сохраненных данных
            showNothingSelected();
            return;
        }
        
        // Отображаем выбранные блюда
        displaySelectedDishes(savedData);
        
        // Обновляем форму заказа
        updateOrderForm(savedData);
        
        // Инициализируем валидацию формы
        initFormValidation();
        
        // Добавляем обработчики для кнопок удаления
        initRemoveButtons();
        
        // Добавляем обработчик для кнопки "Вернуться к выбору"
        const backButton = document.getElementById('back-to-lunch-btn');
        if (backButton) {
            backButton.addEventListener('click', function() {
                window.location.href = 'lunch.html';
            });
        }
    }
    
    // Функция для отображения сообщения "Ничего не выбрано"
    function showNothingSelected() {
        const container = document.getElementById('selected-dishes-container');
        const nothingSelected = document.getElementById('nothing-selected-checkout');
        
        if (container && nothingSelected) {
            container.innerHTML = '';
            container.appendChild(nothingSelected);
            nothingSelected.style.display = 'block';
        }
        
        // Скрываем блоки в форме
        hideAllFormCategories();
    }
    
    // Функция для отображения выбранных блюд
    function displaySelectedDishes(savedData) {
        const container = document.getElementById('selected-dishes-container');
        if (!container) return;
        
        // Очищаем контейнер
        container.innerHTML = '';
        
        // Проверяем, есть ли вообще выбранные блюда
        const hasSelection = savedData.soup || savedData.main || savedData.salad || 
                           savedData.drink || savedData.dessert;
        
        if (!hasSelection) {
            showNothingSelected();
            return;
        }
        
        // Скрываем сообщение "Ничего не выбрано"
        const nothingSelected = document.getElementById('nothing-selected-checkout');
        if (nothingSelected) {
            nothingSelected.style.display = 'none';
        }
        
        // Отображаем каждое выбранное блюдо
        displayDishCategory('soup', savedData.soup, container);
        displayDishCategory('main', savedData.main, container);
        displayDishCategory('salad', savedData.salad, container);
        displayDishCategory('drink', savedData.drink, container);
        displayDishCategory('dessert', savedData.dessert, container);
    }
    
    // Функция для отображения блюда определенной категории
    function displayDishCategory(category, dishKeyword, container) {
        if (!dishKeyword) return;
        
        const dishes = window.getDishes ? window.getDishes() : [];
        const dish = dishes.find(d => d.keyword === dishKeyword);
        
        if (!dish) return;
        
        const categoryNames = {
            'soup': 'Суп',
            'main': 'Главное блюдо',
            'salad': 'Салат/Стартер',
            'drink': 'Напиток',
            'dessert': 'Десерт'
        };
        
        const card = document.createElement('div');
        card.className = 'dish-card-checkout';
        card.setAttribute('data-category', category);
        card.setAttribute('data-dish', dishKeyword);
        
        // Используем изображение из API или дефолтное
        let imageUrl = dish.image || 'images/default-food.jpg';
        
        card.innerHTML = `
            <img src="${imageUrl}" alt="${dish.name}" 
                 onerror="this.onerror=null; this.src='images/default-food.jpg'">
            <div class="dish-info">
                <div class="dish-name">${categoryNames[category]}: ${dish.name}</div>
                <div class="dish-details">${dish.count}</div>
                <div class="dish-price">${dish.price} ₽</div>
            </div>
            <button class="remove-btn" data-category="${category}">Удалить</button>
        `;
        
        container.appendChild(card);
    }
    
    // Функция для обновления формы заказа
    function updateOrderForm(savedData) {
        const dishes = window.getDishes ? window.getDishes() : [];
        let total = 0;
        
        // Обновляем каждую категорию в форме
        updateFormCategory('soup', savedData.soup, dishes);
        updateFormCategory('main', savedData.main, dishes);
        updateFormCategory('salad', savedData.salad, dishes);
        updateFormCategory('drink', savedData.drink, dishes);
        updateFormCategory('dessert', savedData.dessert, dishes);
        
        // Рассчитываем общую стоимость
        if (savedData.soup) {
            const dish = dishes.find(d => d.keyword === savedData.soup);
            if (dish) total += dish.price;
        }
        if (savedData.main) {
            const dish = dishes.find(d => d.keyword === savedData.main);
            if (dish) total += dish.price;
        }
        if (savedData.salad) {
            const dish = dishes.find(d => d.keyword === savedData.salad);
            if (dish) total += dish.price;
        }
        if (savedData.drink) {
            const dish = dishes.find(d => d.keyword === savedData.drink);
            if (dish) total += dish.price;
        }
        if (savedData.dessert) {
            const dish = dishes.find(d => d.keyword === savedData.dessert);
            if (dish) total += dish.price;
        }
        
        // Обновляем общую стоимость
        const totalElement = document.getElementById('total-cost-checkout');
        if (totalElement) totalElement.textContent = `${total} ₽`;
        
        // Показываем блок с общей стоимостью
        const totalContainer = document.getElementById('total-cost-container-checkout');
        if (totalContainer) totalContainer.style.display = 'block';
    }
    
    // Функция для обновления категории в форме
    function updateFormCategory(category, dishKeyword, dishes) {
        const nameElement = document.getElementById(`selected-${category}-checkout`);
        const priceElement = document.getElementById(`selected-${category}-price-checkout`);
        const hiddenField = document.getElementById(`${category}_id`);
        const categoryElement = document.querySelector(`.${category}-category-checkout`);
        
        if (dishKeyword) {
            const dish = dishes.find(d => d.keyword === dishKeyword);
            if (dish) {
                if (nameElement) nameElement.textContent = dish.name;
                if (priceElement) priceElement.textContent = `${dish.price} ₽`;
                if (hiddenField) hiddenField.value = this.getDishId(dish);
                if (categoryElement) categoryElement.style.display = 'block';
            }
        } else {
            if (nameElement) nameElement.textContent = category === 'main' ? 'Не выбрано' : 'Не выбран';
            if (priceElement) priceElement.textContent = '0 ₽';
            if (hiddenField) hiddenField.value = '';
            if (categoryElement) categoryElement.style.display = 'block';
        }
    }
    
    // Функция для получения ID блюда (в реальном API это было бы числовое ID)
    function getDishId(dish) {
        // В реальном приложении здесь бы было dish.id
        // Поскольку у нас нет числовых ID, используем keyword
        // В реальном API нужно будет преобразовать keyword в ID
        return dish.keyword;
    }
    
    // Функция для скрытия всех категорий в форме
    function hideAllFormCategories() {
        const categories = ['soup', 'main', 'salad', 'drink', 'dessert'];
        categories.forEach(category => {
            const element = document.querySelector(`.${category}-category-checkout`);
            if (element) element.style.display = 'none';
        });
        
        const totalContainer = document.getElementById('total-cost-container-checkout');
        if (totalContainer) totalContainer.style.display = 'none';
    }
    
    // Функция для инициализации кнопок удаления
    function initRemoveButtons() {
        document.addEventListener('click', function(event) {
            if (event.target.classList.contains('remove-btn')) {
                const category = event.target.getAttribute('data-category');
                removeDish(category);
            }
        });
    }
    
    // Функция для удаления блюда
    function removeDish(category) {
        // Загружаем текущие данные
        const savedData = window.storageManager.loadSelectedDishes();
        if (!savedData) return;
        
        // Удаляем блюдо из категории
        savedData[category] = null;
        
        // Сохраняем обновленные данные
        window.storageManager.saveSelectedDishes(savedData);
        
        // Перезагружаем страницу
        location.reload();
    }
    
    // Функция для инициализации валидации формы
    function initFormValidation() {
        const form = document.getElementById('orderFormCheckout');
        if (!form) return;
        
        form.addEventListener('submit', async function(event) {
            event.preventDefault();
            
            // Проверяем валидность комбо
            const savedData = window.storageManager.loadSelectedDishes();
            if (!savedData || !isValidCombo(savedData)) {
                alert('Пожалуйста, выберите валидный набор блюд (комбо) перед оформлением заказа.');
                return;
            }
            
            // Проверяем обязательные поля формы
            if (!validateForm()) {
                return;
            }
            
            // Отправляем заказ
            await submitOrder();
        });
    }
    
    // Функция для проверки валидности комбо
    function isValidCombo(savedData) {
        const hasSoup = !!savedData.soup;
        const hasMain = !!savedData.main;
        const hasSalad = !!savedData.salad;
        const hasDrink = !!savedData.drink;
        
        // Варианты комбо:
        const combos = [
            { soup: true, main: true, salad: true, drink: true },  // Комбо 1
            { soup: true, main: true, salad: false, drink: true }, // Комбо 2
            { soup: true, main: false, salad: true, drink: true }, // Комбо 3
            { soup: false, main: true, salad: true, drink: true }, // Комбо 4
            { soup: false, main: true, salad: false, drink: true } // Комбо 5
        ];
        
        // Проверяем каждый комбо
        for (const combo of combos) {
            if (hasSoup === combo.soup && 
                hasMain === combo.main && 
                hasSalad === combo.salad && 
                hasDrink === combo.drink) {
                return true;
            }
        }
        
        return false;
    }
    
    // Функция для валидации формы
    function validateForm() {
        const requiredFields = [
            'full_name',
            'email-checkout',
            'phone-checkout',
            'delivery_address'
        ];
        
        for (const fieldId of requiredFields) {
            const field = document.getElementById(fieldId);
            if (!field || !field.value.trim()) {
                alert(`Пожалуйста, заполните поле: ${field.previousElementSibling.textContent}`);
                field.focus();
                return false;
            }
        }
        
        // Проверяем email
        const emailField = document.getElementById('email-checkout');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value)) {
            alert('Пожалуйста, введите корректный email адрес');
            emailField.focus();
            return false;
        }
        
        // Проверяем время доставки, если выбрано "Ко времени"
        const specificTimeRadio = document.getElementById('specific_time_radio_checkout');
        if (specificTimeRadio && specificTimeRadio.checked) {
            const timeField = document.getElementById('delivery_time');
            if (!timeField.value) {
                alert('Пожалуйста, укажите время доставки');
                timeField.focus();
                return false;
            }
            
            // Проверяем, что время в пределах 07:00-23:00
            const [hours, minutes] = timeField.value.split(':').map(Number);
            if (hours < 7 || hours > 23) {
                alert('Время доставки должно быть между 07:00 и 23:00');
                timeField.focus();
                return false;
            }
        }
        
        return true;
    }
    
    // Функция для отправки заказа на сервер
    async function submitOrder() {
        try {
            // Получаем данные формы
            const formData = getFormData();
            
            // Получаем API ключ (в реальном приложении это был бы уникальный ключ пользователя)
            // Для примера используем тестовый ключ
            const apiKey = '123e4567-e89b-12d3-a456-426655440000';
            
            // URL API для создания заказа
            const apiUrl = `https://edu.std-900.ist.mospolytech.ru/labs/api/orders?api_key=${apiKey}`;
            
            console.log('Отправка заказа на:', apiUrl);
            console.log('Данные заказа:', formData);
            
            // Отправляем POST запрос
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            
            const result = await response.json();
            console.log('Заказ успешно создан:', result);
            
            // Очищаем localStorage
            window.storageManager.clearSelectedDishes();
            
            // Показываем сообщение об успехе
            alert('Заказ успешно оформлен! Спасибо за заказ.');
            
            // Перенаправляем на главную страницу
            window.location.href = 'index.html';
            
        } catch (error) {
            console.error('Ошибка при оформлении заказа:', error);
            alert(`Ошибка при оформлении заказа: ${error.message}\nПожалуйста, попробуйте еще раз.`);
        }
    }
    
    // Функция для получения данных формы
    function getFormData() {
        const savedData = window.storageManager.loadSelectedDishes();
        const dishes = window.getDishes ? window.getDishes() : [];
        
        // Получаем ID блюд
        let soupId = '';
        let mainCourseId = '';
        let saladId = '';
        let drinkId = '';
        let dessertId = '';
        
        if (savedData.soup) {
            const dish = dishes.find(d => d.keyword === savedData.soup);
            if (dish) soupId = this.getDishId(dish);
        }
        
        if (savedData.main) {
            const dish = dishes.find(d => d.keyword === savedData.main);
            if (dish) mainCourseId = this.getDishId(dish);
        }
        
        if (savedData.salad) {
            const dish = dishes.find(d => d.keyword === savedData.salad);
            if (dish) saladId = this.getDishId(dish);
        }
        
        if (savedData.drink) {
            const dish = dishes.find(d => d.keyword === savedData.drink);
            if (dish) drinkId = this.getDishId(dish);
        }
        
        if (savedData.dessert) {
            const dish = dishes.find(d => d.keyword === savedData.dessert);
            if (dish) dessertId = this.getDishId(dish);
        }
        
        // Собираем данные формы
        const formData = {
            full_name: document.getElementById('full_name').value,
            email: document.getElementById('email-checkout').value,
            subscribe: document.getElementById('subscribe').checked ? 1 : 0,
            phone: document.getElementById('phone-checkout').value,
            delivery_address: document.getElementById('delivery_address').value,
            delivery_type: document.querySelector('input[name="delivery_type"]:checked').value,
            comment: document.getElementById('comment-checkout').value || ''
        };
        
        // Добавляем время доставки, если выбрано "Ко времени"
        if (formData.delivery_type === 'by_time') {
            formData.delivery_time = document.getElementById('delivery_time').value;
        }
        
        // Добавляем ID блюд, если они есть
        if (soupId) formData.soup_id = soupId;
        if (mainCourseId) formData.main_course_id = mainCourseId;
        if (saladId) formData.salad_id = saladId;
        if (drinkId) formData.drink_id = drinkId;
        if (dessertId) formData.dessert_id = dessertId;
        
        return formData;
    }
});