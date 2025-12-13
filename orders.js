// orders.js

// Глобальные переменные
let currentOrders = [];
let currentOrderToDelete = null;

document.addEventListener('DOMContentLoaded', function() {
    console.log('Страница заказов загружена');
    loadOrders();
    
    // Инициализация обработчиков для типа доставки в форме редактирования
    const deliveryTypeSelect = document.getElementById('edit-delivery_type');
    const timeGroup = document.getElementById('edit-time-group');
    
    if (deliveryTypeSelect) {
        deliveryTypeSelect.addEventListener('change', function() {
            if (this.value === 'by_time') {
                timeGroup.style.display = 'block';
                document.getElementById('edit-delivery_time').required = true;
            } else {
                timeGroup.style.display = 'none';
                document.getElementById('edit-delivery_time').required = false;
            }
        });
    }
});

// Функция загрузки заказов с сервера
async function loadOrders() {
    try {
        const apiKey = window.API_CONFIG ? window.API_CONFIG.API_KEY : null;
        if (!apiKey) {
            showError('API ключ не настроен. Пожалуйста, настройте config.js');
            return;
        }
        
        const apiUrl = `${window.API_CONFIG.BASE_URL}/labs/api/orders?api_key=${apiKey}`;
        console.log('Загрузка заказов с:', apiUrl);
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Ошибка HTTP: ${response.status}`);
        }
        
        currentOrders = await response.json();
        console.log('Заказы загружены:', currentOrders.length);
        
        // Сортируем по убыванию даты (новые сначала)
        currentOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        displayOrders();
        
    } catch (error) {
        console.error('Ошибка при загрузке заказов:', error);
        showError('Не удалось загрузить заказы: ' + error.message);
    }
}

// Функция отображения заказов
function displayOrders() {
    const container = document.getElementById('orders-container');
    if (!container) return;
    
    if (currentOrders.length === 0) {
        container.innerHTML = `
            <div class="no-orders">
                <p>У вас пока нет заказов.</p>
                <p><a href="lunch.html">Перейти к созданию заказа</a></p>
            </div>
        `;
        return;
    }
    
    let html = `
        <table class="orders-table">
            <thead>
                <tr>
                    <th>№</th>
                    <th>Дата оформления</th>
                    <th>Состав заказа</th>
                    <th>Стоимость</th>
                    <th>Время доставки</th>
                    <th>Действия</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    currentOrders.forEach((order, index) => {
        const orderDate = new Date(order.created_at);
        const formattedDate = orderDate.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const composition = getOrderComposition(order);
        const totalCost = calculateOrderTotal(order);
        const deliveryTime = order.delivery_type === 'by_time' 
            ? order.delivery_time 
            : 'Как можно скорее (с 7:00 до 23:00)';
        
        html += `
            <tr>
                <td>${index + 1}</td>
                <td>${formattedDate}</td>
                <td class="order-composition" title="${composition}">${composition}</td>
                <td>${totalCost} ₽</td>
                <td class="delivery-time">${deliveryTime}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn btn-view" onclick="viewOrder(${order.id})">
                            <i class="bi bi-eye"></i> Подробнее
                        </button>
                        <button class="action-btn btn-edit" onclick="editOrder(${order.id})">
                            <i class="bi bi-pencil"></i> Редактировать
                        </button>
                        <button class="action-btn btn-delete" onclick="deleteOrder(${order.id})">
                            <i class="bi bi-trash"></i> Удалить
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    html += '</tbody></table>';
    container.innerHTML = html;
}

// Функция получения состава заказа
function getOrderComposition(order) {
    const dishes = [];
    
    if (order.soup_id) dishes.push('Суп');
    if (order.main_course_id) dishes.push('Главное блюдо');
    if (order.salad_id) dishes.push('Салат');
    if (order.drink_id) dishes.push('Напиток');
    if (order.dessert_id) dishes.push('Десерт');
    
    return dishes.join(', ') || 'Нет блюд';
}

// Функция расчета стоимости заказа
function calculateOrderTotal(order) {
    // Здесь должна быть логика расчета стоимости
    // Поскольку в API нет информации о ценах блюд в заказе,
    // мы можем сохранять стоимость при создании заказа
    // или запрашивать блюда отдельно
    return order.total || 0;
}

// Функция просмотра деталей заказа
async function viewOrder(orderId) {
    try {
        const order = currentOrders.find(o => o.id == orderId);
        if (!order) {
            showError('Заказ не найден');
            return;
        }
        
        // Загружаем детали заказа с сервера
        const apiKey = window.API_CONFIG ? window.API_CONFIG.API_KEY : null;
        const apiUrl = `${window.API_CONFIG.BASE_URL}/labs/api/orders/${orderId}?api_key=${apiKey}`;
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        
        const orderDetails = await response.json();
        
        // Форматируем дату
        const orderDate = new Date(orderDetails.created_at);
        const formattedDate = orderDate.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const updatedDate = new Date(orderDetails.updated_at);
        const formattedUpdatedDate = updatedDate.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // Создаем HTML для деталей заказа
        let dishesHtml = '';
        if (orderDetails.dishes && orderDetails.dishes.length > 0) {
            dishesHtml = `
                <div class="order-dishes">
                    <h4>Состав заказа:</h4>
                    ${orderDetails.dishes.map(dish => `
                        <div class="order-dish-item">
                            <span>${dish.name}</span>
                            <span>${dish.price} ₽</span>
                        </div>
                    `).join('')}
                </div>
            `;
        }
        
        const content = `
            <div class="order-details">
                <div class="order-detail-row">
                    <span class="detail-label">Номер заказа:</span>
                    <span class="detail-value">#${orderDetails.id}</span>
                </div>
                <div class="order-detail-row">
                    <span class="detail-label">Дата создания:</span>
                    <span class="detail-value">${formattedDate}</span>
                </div>
                <div class="order-detail-row">
                    <span class="detail-label">Последнее обновление:</span>
                    <span class="detail-value">${formattedUpdatedDate}</span>
                </div>
                <div class="order-detail-row">
                    <span class="detail-label">Имя и фамилия:</span>
                    <span class="detail-value">${orderDetails.full_name}</span>
                </div>
                <div class="order-detail-row">
                    <span class="detail-label">Email:</span>
                    <span class="detail-value">${orderDetails.email}</span>
                </div>
                <div class="order-detail-row">
                    <span class="detail-label">Телефон:</span>
                    <span class="detail-value">${orderDetails.phone}</span>
                </div>
                <div class="order-detail-row">
                    <span class="detail-label">Адрес доставки:</span>
                    <span class="detail-value">${orderDetails.delivery_address}</span>
                </div>
                <div class="order-detail-row">
                    <span class="detail-label">Тип доставки:</span>
                    <span class="detail-value">${orderDetails.delivery_type === 'now' ? 'Как можно скорее' : 'Ко времени'}</span>
                </div>
                ${orderDetails.delivery_type === 'by_time' ? `
                <div class="order-detail-row">
                    <span class="detail-label">Время доставки:</span>
                    <span class="detail-value">${orderDetails.delivery_time}</span>
                </div>
                ` : ''}
                <div class="order-detail-row">
                    <span class="detail-label">Подписка на новости:</span>
                    <span class="detail-value">${orderDetails.subscribe ? 'Да' : 'Нет'}</span>
                </div>
                <div class="order-detail-row">
                    <span class="detail-label">Комментарий:</span>
                    <span class="detail-value">${orderDetails.comment || 'Нет комментария'}</span>
                </div>
                <div class="order-detail-row">
                    <span class="detail-label">Общая стоимость:</span>
                    <span class="detail-value">${calculateOrderTotal(orderDetails)} ₽</span>
                </div>
                ${dishesHtml}
            </div>
        `;
        
        // Заполняем модальное окно
        document.getElementById('view-order-content').innerHTML = content;
        
        // Показываем модальное окно
        showModal('view-order-modal');
        
    } catch (error) {
        console.error('Ошибка при просмотре заказа:', error);
        showError('Не удалось загрузить детали заказа: ' + error.message);
    }
}

// Функция редактирования заказа
function editOrder(orderId) {
    const order = currentOrders.find(o => o.id == orderId);
    if (!order) {
        showError('Заказ не найден');
        return;
    }
    
    // Заполняем форму данными заказа
    document.getElementById('edit-order-id').value = order.id;
    document.getElementById('edit-full_name').value = order.full_name;
    document.getElementById('edit-email').value = order.email;
    document.getElementById('edit-phone').value = order.phone;
    document.getElementById('edit-delivery_address').value = order.delivery_address;
    document.getElementById('edit-delivery_type').value = order.delivery_type;
    document.getElementById('edit-comment').value = order.comment || '';
    
    // Обрабатываем тип доставки
    const timeGroup = document.getElementById('edit-time-group');
    const timeInput = document.getElementById('edit-delivery_time');
    
    if (order.delivery_type === 'by_time') {
        timeGroup.style.display = 'block';
        timeInput.value = order.delivery_time;
        timeInput.required = true;
    } else {
        timeGroup.style.display = 'none';
        timeInput.required = false;
    }
    
    // Показываем модальное окно
    showModal('edit-order-modal');
}

// Функция сохранения изменений заказа
async function saveOrderChanges() {
    try {
        const orderId = document.getElementById('edit-order-id').value;
        const apiKey = window.API_CONFIG ? window.API_CONFIG.API_KEY : null;
        
        if (!apiKey) {
            showError('API ключ не настроен');
            return;
        }
        
        // Собираем данные формы
        const formData = {
            full_name: document.getElementById('edit-full_name').value,
            email: document.getElementById('edit-email').value,
            phone: document.getElementById('edit-phone').value,
            delivery_address: document.getElementById('edit-delivery_address').value,
            delivery_type: document.getElementById('edit-delivery_type').value,
            comment: document.getElementById('edit-comment').value
        };
        
        // Добавляем время доставки, если выбрано "Ко времени"
        if (formData.delivery_type === 'by_time') {
            const deliveryTime = document.getElementById('edit-delivery_time').value;
            if (!deliveryTime) {
                showError('Пожалуйста, укажите время доставки');
                return;
            }
            formData.delivery_time = deliveryTime;
        }
        
        // Отправляем PUT запрос
        const apiUrl = `${window.API_CONFIG.BASE_URL}/labs/api/orders/${orderId}?api_key=${apiKey}`;
        
        console.log('Отправка изменений заказа:', formData);
        
        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Ошибка HTTP: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Заказ обновлен:', result);
        
        // Закрываем модальное окно
        closeModal('edit-order-modal');
        
        // Показываем уведомление об успехе
        showSuccess('Заказ успешно изменён');
        
        // Обновляем список заказов
        loadOrders();
        
    } catch (error) {
        console.error('Ошибка при сохранении заказа:', error);
        showError('Не удалось сохранить изменения: ' + error.message);
    }
}

// Функция удаления заказа
function deleteOrder(orderId) {
    const order = currentOrders.find(o => o.id == orderId);
    if (!order) {
        showError('Заказ не найден');
        return;
    }
    
    // Сохраняем ID заказа для удаления
    currentOrderToDelete = orderId;
    
    // Показываем модальное окно подтверждения
    showModal('delete-order-modal');
}

// Функция подтверждения удаления
async function confirmDeleteOrder() {
    try {
        if (!currentOrderToDelete) return;
        
        const apiKey = window.API_CONFIG ? window.API_CONFIG.API_KEY : null;
        if (!apiKey) {
            showError('API ключ не настроен');
            return;
        }
        
        // Отправляем DELETE запрос
        const apiUrl = `${window.API_CONFIG.BASE_URL}/labs/api/orders/${currentOrderToDelete}?api_key=${apiKey}`;
        
        console.log('Удаление заказа:', currentOrderToDelete);
        
        const response = await fetch(apiUrl, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Ошибка HTTP: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Заказ удален:', result);
        
        // Закрываем модальное окно
        closeModal('delete-order-modal');
        
        // Сбрасываем переменную
        currentOrderToDelete = null;
        
        // Показываем уведомление об успехе
        showSuccess('Заказ успешно удалён');
        
        // Обновляем список заказов
        loadOrders();
        
    } catch (error) {
        console.error('Ошибка при удалении заказа:', error);
        showError('Не удалось удалить заказ: ' + error.message);
    }
}

// Вспомогательные функции для работы с модальными окнами
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    const overlay = document.getElementById('modal-overlay');
    
    if (modal && overlay) {
        modal.style.display = 'block';
        overlay.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Блокируем прокрутку фона
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    const overlay = document.getElementById('modal-overlay');
    
    if (modal && overlay) {
        modal.style.display = 'none';
        overlay.style.display = 'none';
        document.body.style.overflow = ''; // Разблокируем прокрутку
    }
}

// Функции для уведомлений
function showSuccess(message) {
    alert(message); // Можно заменить на кастомное уведомление
}

function showError(message) {
    alert('Ошибка: ' + message); // Можно заменить на кастомное уведомление
}

// Обработчик клика по оверлею для закрытия модальных окон
document.getElementById('modal-overlay')?.addEventListener('click', function() {
    closeModal('view-order-modal');
    closeModal('edit-order-modal');
    closeModal('delete-order-modal');
});