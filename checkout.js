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

        if (!savedData || (!savedData.soup && !savedData.main && !savedData.salad && !savedData.drink && !savedData.dessert)) {
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
        initRemoveButtons(savedData);

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

    // Функция для скрытия всех категорий в форме
    function hideAllFormCategories() {
        const categories = document.querySelectorAll('.order-category-checkout');
        categories.forEach(cat => {
            cat.style.display = 'none';
        });

        const totalContainer = document.getElementById('form-total-cost-container');
        if (totalContainer) {
            totalContainer.style.display = 'none';
        }
    }

    // Функция для отображения выбранных блюд
    function displaySelectedDishes(savedData) {
        const container = document.getElementById('selected-dishes-container');
        if (!container) return;

        // Очищаем контейнер
        container.innerHTML = '';

        // Проверяем, есть ли вообще выбранные блюда
        const hasSelection = savedData.soup || savedData.main || savedData.salad || savedData.drink || savedData.dessert;

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
            <div class="dish-card-checkout-inner">
                <img src="${imageUrl}" alt="${dish.name}" class="dish-image-checkout">
                <div class="dish-info-checkout">
                    <h4>${categoryNames[category]}</h4>
                    <p class="dish-name">${dish.name}</p>
                    <p class="dish-price">${dish.price} ₽</p>
                    <button type="button" class="btn-remove" data-category="${category}" data-dish="${dishKeyword}">Удалить</button>
                </div>
            </div>
        `;

        container.appendChild(card);
    }

    // Функция для обновления формы заказа
    function updateOrderForm(savedData) {
        const dishes = window.getDishes ? window.getDishes() : [];

        // Обновляем каждую категорию
        updateFormCategory('soup', savedData.soup, dishes);
        updateFormCategory('main', savedData.main, dishes);
        updateFormCategory('salad', savedData.salad, dishes);
        updateFormCategory('drink', savedData.drink, dishes);
        updateFormCategory('dessert', savedData.dessert, dishes);

        // Обновляем итоговую стоимость
        updateFormTotalCost(savedData, dishes);
    }

    // Функция для обновления конкретной категории в форме
    function updateFormCategory(category, dishKeyword, dishes) {
        const categoryClasses = {
            'soup': '.soup-category-checkout',
            'main': '.main-category-checkout',
            'salad': '.salad-category-checkout',
            'drink': '.drink-category-checkout',
            'dessert': '.dessert-category-checkout'
        };

        const textIds = {
            'soup': '#form-selected-soup',
            'main': '#form-selected-main',
            'salad': '#form-selected-salad',
            'drink': '#form-selected-drink',
            'dessert': '#form-selected-dessert'
        };

        const priceIds = {
            'soup': '#form-selected-soup-price',
            'main': '#form-selected-main-price',
            'salad': '#form-selected-salad-price',
            'drink': '#form-selected-drink-price',
            'dessert': '#form-selected-dessert-price'
        };

        const defaultTexts = {
            'soup': 'Не выбран',
            'main': 'Не выбрано',
            'salad': 'Не выбран',
            'drink': 'Не выбран',
            'dessert': 'Не выбран'
        };

        const categoryElement = document.querySelector(categoryClasses[category]);
        const textElement = document.querySelector(textIds[category]);
        const priceElement = document.querySelector(priceIds[category]);

        if (dishKeyword) {
            const dish = dishes.find(d => d.keyword === dishKeyword);
            if (dish && categoryElement && textElement && priceElement) {
                textElement.textContent = dish.name;
                priceElement.textContent = `${dish.price} ₽`;
                categoryElement.style.display = 'block';
            }
        } else {
            if (categoryElement && textElement && priceElement) {
                textElement.textContent = defaultTexts[category];
                priceElement.textContent = '0 ₽';
                categoryElement.style.display = 'none';
            }
        }
    }

    // Функция для обновления итоговой стоимости в форме
    function updateFormTotalCost(savedData, dishes) {
        let total = 0;

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

        const totalElement = document.getElementById('form-total-cost');
        const totalContainer = document.getElementById('form-total-cost-container');

        if (totalElement) {
            totalElement.textContent = `${total} ₽`;
        }
        if (totalContainer) {
            totalContainer.style.display = 'block';
        }
    }

    // Функция для инициализации обработчиков удаления блюд
    function initRemoveButtons(savedData) {
        const removeButtons = document.querySelectorAll('.btn-remove');

        removeButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const category = this.getAttribute('data-category');
                const dishKeyword = this.getAttribute('data-dish');

                // Удаляем блюдо из savedData
                if (savedData[category] === dishKeyword) {
                    savedData[category] = null;
                }

                // Сохраняем обновленные данные в localStorage
                window.storageManager.saveSelectedDishes(savedData);

                // Обновляем страницу
                displaySelectedDishes(savedData);
                updateOrderForm(savedData);
            });
        });
    }

    // Функция для инициализации валидации формы
    function initFormValidation() {
        const form = document.getElementById('checkoutForm');
        if (!form) return;

        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Проверяем валидность комбо
            const savedData = window.storageManager.loadSelectedDishes();
            if (!isValidCombo(savedData)) {
                alert('Выберите валидный набор блюд для оформления заказа');
                return;
            }

            // Собираем данные формы
            const formData = {
                full_name: document.getElementById('full_name').value,
                email: document.getElementById('email').value,
                subscribe: document.getElementById('subscribe').checked ? 1 : 0,
                phone: document.getElementById('phone').value,
                delivery_address: document.getElementById('delivery_address').value,
                delivery_type: document.querySelector('input[name="delivery_type"]:checked').value,
                delivery_time: document.getElementById('delivery_time').value || null,
                comment: document.getElementById('comment').value,
                soup_id: null,
                main_course_id: null,
                salad_id: null,
                drink_id: null,
                dessert_id: null
            };

            // Находим ID блюд
            const dishes = window.getDishes ? window.getDishes() : [];

            if (savedData.soup) {
                const dish = dishes.find(d => d.keyword === savedData.soup);
                if (dish) formData.soup_id = dish.id;
            }
            if (savedData.main) {
                const dish = dishes.find(d => d.keyword === savedData.main);
                if (dish) formData.main_course_id = dish.id;
            }
            if (savedData.salad) {
                const dish = dishes.find(d => d.keyword === savedData.salad);
                if (dish) formData.salad_id = dish.id;
            }
            if (savedData.drink) {
                const dish = dishes.find(d => d.keyword === savedData.drink);
                if (dish) formData.drink_id = dish.id;
            }
            if (savedData.dessert) {
                const dish = dishes.find(d => d.keyword === savedData.dessert);
                if (dish) formData.dessert_id = dish.id;
            }

            // Отправляем данные на сервер
            sendOrderToServer(formData);
        });
    }

    // Функция для проверки валидности комбо
    function isValidCombo(savedData) {
        const { soup, main, salad, drink, dessert } = savedData;

        const combos = [
            { soup: true, main: true, salad: true, drink: true },
            { soup: true, main: true, salad: false, drink: true },
            { soup: true, main: false, salad: true, drink: true },
            { soup: false, main: true, salad: true, drink: true },
            { soup: false, main: true, salad: false, drink: true }
        ];

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

    // Функция для отправки заказа на сервер
    function sendOrderToServer(formData) {
        // Получите свой API key из СДО Московского Политеха
        const apiKey = 'YOUR_API_KEY_HERE'; // Замените на ваш API key
        const apiUrl = 'https://edu.std-900.ist.mospolytech.ru/labs/api/orders?api_key=' + apiKey;

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.error || 'Ошибка при отправке заказа');
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Заказ успешно отправлен:', data);
            alert('Ваш заказ успешно оформлен!');

            // Очищаем localStorage после успешной отправки
            window.storageManager.clearSelectedDishes();

            // Перенаправляем на главную страницу
            window.location.href = 'index.html';
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Ошибка при отправке заказа: ' + error.message);
        });
    }
});
