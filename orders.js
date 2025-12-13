// orders.js

class OrdersManager {
    constructor() {
        this.API_KEY = 'api_key_storage';
        this.BASE_URL = 'https://edu.std-900.ist.mospolytech.ru';
        this.apiKey = null;
        this.orders = [];
        this.currentOrderId = null;
        
        this.init();
    }
    
    init() {
        // Загружаем API ключ
        this.loadApiKey();
        
        // Инициализируем обработчики событий
        this.initEventListeners();
        
        // Загружаем заказы, если ключ есть
        if (this.apiKey) {
            this.loadOrders();
        }
    }
    
    // Загрузка API ключа из localStorage
    loadApiKey() {
        const savedKey = localStorage.getItem(this.API_KEY);
        if (savedKey) {
            this.apiKey = savedKey;
            this.updateApiKeyStatus(true);
        } else {
            this.updateApiKeyStatus(false);
        }
    }
    
    // Обновление статуса API ключа
    updateApiKeyStatus(isSet) {
        const statusElement = document.getElementById('api-key-status');
        const inputElement = document.getElementById('api-key-input');
        
        if (isSet && this.apiKey) {
            statusElement.textContent = `Ключ установлен: ${this.apiKey.substring(0, 8)}...`;
            statusElement.style.color = '#2ecc71';
            if (inputElement) {
                inputElement.value = this.apiKey;
            }
        } else {
            statusElement.textContent = 'Ключ не установлен';
            statusElement.style.color = '#e74c3c';
        }
    }
    
    // Инициализация обработчиков событий
    initEventListeners() {
        // Сохранение API ключа
        const saveApiKeyBtn = document.getElementById('save-api-key');
        if (saveApiKeyBtn) {
            saveApiKeyBtn.addEventListener('click', () => this.saveApiKey());
        }
        
        // Очистка API ключа
        const clearApiKeyBtn = document.getElementById('clear-api-key');
        if (clearApiKeyBtn) {
            clearApiKeyBtn.addEventListener('click', () => this.clearApiKey());
        }
        
        // Модальные окна
        this.initModalListeners();
    }
    
    // Инициализация обработчиков модальных окон
    initModalListeners() {
        // Закрытие модальных окон
        document.querySelectorAll('.close-modal').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => {
                this.closeAllModals();
            });
        });
        
        // Закрытие по клику вне окна
        window.addEventListener('click', (event) => {
            if (event.target.classList.contains('modal')) {
                this.closeAllModals();
            }
        });
        
        // Кнопки в модальных окнах
        const closeDetailsBtn = document.getElementById('close-details-modal');
        if (closeDetailsBtn) {
            closeDetailsBtn.addEventListener('click', () => {
                this.closeModal('order-details-modal');
            });
        }
        
        const saveEditBtn = document.getElementById('save-edit-order');
        if (saveEditBtn) {
            saveEditBtn.addEventListener('click', () => this.saveEditedOrder());
        }
        
        const cancelEditBtn = document.getElementById('cancel-edit-order');
        if (cancelEditBtn) {
            cancelEditBtn.addEventListener('click', () => {
                this.closeModal('edit-order-modal');
            });
        }
        
        const confirmDeleteBtn = document.getElementById('confirm-delete-order');
        if (confirmDeleteBtn) {
            confirmDeleteBtn.addEventListener('click', () => this.deleteOrder());
        }
        
        const cancelDeleteBtn = document.getElementById('cancel-delete-order');
        if (cancelDeleteBtn) {
            cancelDeleteBtn.addEventListener('click', () => {
                this.closeModal('delete-order-modal');
            });
        }
        
        // Переключатель времени доставки в форме редактирования
        const deliveryTypeRadios = document.querySelectorAll('input[name="edit-delivery-type"]');
        deliveryTypeRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                const timeGroup = document.getElementById('edit-time-group');
                if (e.target.value === 'by_time') {
                    timeGroup.style.display = 'block';
                    document.getElementById('edit-delivery-time').required = true;
                } else {
                    timeGroup.style.display = 'none';
                    document.getElementById('edit-delivery-time').required = false;
                }
            });
        });
    }
    
    // Сохранение API ключа
    saveApiKey() {
        const input = document.getElementById('api-key-input');
        const key = input.value.trim();
        
        if (!key) {
            this.showNotification('Пожалуйста, введите API ключ', 'error');
            return;
        }
        
        // Проверка формата UUID
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(key)) {
            this.showNotification('Неверный формат API ключа. Используйте формат UUID.', 'error');
            return;
        }
        
        this.apiKey = key;
        localStorage.setItem(this.API_KEY, key);
        this.updateApiKeyStatus(true);
        this.showNotification('API ключ успешно сохранен', 'success');
        
        // Загружаем заказы после сохранения ключа
        this.loadOrders();
    }
    
    // Очистка API ключа
    clearApiKey() {
        this.apiKey = null;
        localStorage.removeItem(this.API_KEY);
        this.updateApiKeyStatus(false);
        document.getElementById('api-key-input').value = '';
        this.showNotification('API ключ очищен', 'info');
        
        // Очищаем список заказов
        this.clearOrdersList();
    }
    
    // Загрузка заказов с сервера
    async loadOrders() {
        if (!this.apiKey) {
            this.showNotification('Сначала установите API ключ', 'error');
            return;
        }
        
        const container = document.getElementById('orders-container');
        container.innerHTML = `
            <div class="loading-message">
                <p>Загрузка заказов...</p>
                <div class="loading-spinner"></div>
            </div>
        `;
        
        try {
            const response = await fetch(`${this.BASE_URL}/labs/api/orders?api_key=${this.apiKey}`);
            
            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Неверный API ключ. Проверьте ключ и попробуйте снова.');
                }
                throw new Error(`Ошибка сервера: ${response.status}`);
            }
            
            this.orders = await response.json();
            
            // Сортируем заказы по дате (сначала новые)
            this.orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            
            // Отображаем заказы
            this.displayOrders();
            
        } catch (error) {
            console.error('Ошибка загрузки заказов:', error);
            container.innerHTML = `
                <div class="error-message">
                    <p>Ошибка загрузки заказов: ${error.message}</p>
                </div>
            `;
            this.showNotification(`Ошибка загрузки заказов: ${error.message}`, 'error');
        }
    }
    
    // Отображение списка заказов
    displayOrders() {
        const container = document.getElementById('orders-container');
        
        if (!this.orders || this.orders.length === 0) {
            container.innerHTML = `
                <div class="no-orders">
                    <p>У вас пока нет заказов.</p>
                    <p><a href="lunch.html">Собрать ланч</a> и сделать первый заказ!</p>
                </div>
            `;
            return;
        }
        
        let ordersHTML = '';
        
        this.orders.forEach((order, index) => {
            // Форматируем дату
            const orderDate = new Date(order.created_at);
            const formattedDate = orderDate.toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            // Получаем состав заказа
            const dishes = this.getOrderDishes(order);
            
            // Получаем время доставки
            const deliveryTime = this.getDeliveryTime(order);
            
            ordersHTML += `
                <div class="order-card" data-order-id="${order.id}">
                    <div class="order-header">
                        <div>
                            <span class="order-number">Заказ #${index + 1}</span>
                            <span class="order-date">${formattedDate}</span>
                        </div>
                        <div class="order-actions">
                            <button class="action-btn view" title="Подробнее" data-action="view" data-order-id="${order.id}">
                                <i class="bi bi-eye"></i>
                            </button>
                            <button class="action-btn edit" title="Редактировать" data-action="edit" data-order-id="${order.id}">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="action-btn delete" title="Удалить" data-action="delete" data-order-id="${order.id}">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                    <div class="order-content">
                        <p class="order-dishes"><strong>Состав:</strong> ${dishes}</p>
                        <p class="order-price"><strong>Стоимость:</strong> ${this.calculateOrderTotal(order)} ₽</p>
                        <p class="order-delivery-time"><strong>Время доставки:</strong> ${deliveryTime}</p>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = ordersHTML;
        
        // Добавляем обработчики для кнопок действий
        this.addOrderActionsListeners();
    }
    
    // Очистка списка заказов
    clearOrdersList() {
        const container = document.getElementById('orders-container');
        container.innerHTML = `
            <div class="no-orders">
                <p>Установите API ключ для просмотра заказов</p>
            </div>
        `;
    }
    
    // Получение состава заказа
    getOrderDishes(order) {
        const dishes = [];
        
        // Загружаем данные блюд для получения названий
        const allDishes = window.getDishes ? window.getDishes() : [];
        
        // Функция для поиска названия блюда по ID
        const findDishName = (dishId) => {
            const dish = allDishes.find(d => d.id == dishId);
            return dish ? dish.name : `Блюдо #${dishId}`;
        };
        
        if (order.soup_id) dishes.push(findDishName(order.soup_id));
        if (order.main_course_id) dishes.push(findDishName(order.main_course_id));
        if (order.salad_id) dishes.push(findDishName(order.salad_id));
        if (order.drink_id) dishes.push(findDishName(order.drink_id));
        if (order.dessert_id) dishes.push(findDishName(order.dessert_id));
        
        return dishes.length > 0 ? dishes.join(', ') : 'Состав не указан';
    }
    
    // Расчет общей стоимости заказа
    calculateOrderTotal(order) {
        let total = 0;
        const allDishes = window.getDishes ? window.getDishes() : [];
        
        const addDishPrice = (dishId) => {
            const dish = allDishes.find(d => d.id == dishId);
            if (dish && dish.price) total += dish.price;
        };
        
        if (order.soup_id) addDishPrice(order.soup_id);
        if (order.main_course_id) addDishPrice(order.main_course_id);
        if (order.salad_id) addDishPrice(order.salad_id);
        if (order.drink_id) addDishPrice(order.drink_id);
        if (order.dessert_id) addDishPrice(order.dessert_id);
        
        return total;
    }
    
    // Получение времени доставки
    getDeliveryTime(order) {
        if (order.delivery_type === 'by_time' && order.delivery_time) {
            return order.delivery_time;
        }
        return 'Как можно скорее (с 7:00 до 23:00)';
    }
    
    // Добавление обработчиков для кнопок действий
    addOrderActionsListeners() {
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = btn.getAttribute('data-action');
                const orderId = btn.getAttribute('data-order-id');
                
                if (!orderId) return;
                
                this.currentOrderId = orderId;
                
                switch(action) {
                    case 'view':
                        this.showOrderDetails(orderId);
                        break;
                    case 'edit':
                        this.showEditOrderForm(orderId);
                        break;
                    case 'delete':
                        this.showDeleteConfirmation(orderId);
                        break;
                }
            });
        });
    }
    
    // Показать детали заказа
    async showOrderDetails(orderId) {
        if (!this.apiKey) {
            this.showNotification('Сначала установите API ключ', 'error');
            return;
        }
        
        try {
            const response = await fetch(`${this.BASE_URL}/labs/api/orders/${orderId}?api_key=${this.apiKey}`);
            
            if (!response.ok) {
                throw new Error(`Ошибка сервера: ${response.status}`);
            }
            
            const order = await response.json();
            
            // Форматируем дату
            const orderDate = new Date(order.created_at);
            const formattedDate = orderDate.toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            // Получаем время доставки
            const deliveryTime = this.getDeliveryTime(order);
            
            // Создаем HTML для деталей заказа
            const detailsHTML = `
                <div class="order-details-item">
                    <span class="order-details-label">Номер заказа:</span>
                    <span class="order-details-value">${order.id}</span>
                </div>
                <div class="order-details-item">
                    <span class="order-details-label">Дата оформления:</span>
                    <span class="order-details-value">${formattedDate}</span>
                </div>
                <div class="order-details-item">
                    <span class="order-details-label">Имя и фамилия:</span>
                    <span class="order-details-value">${order.full_name}</span>
                </div>
                <div class="order-details-item">
                    <span class="order-details-label">Email:</span>
                    <span class="order-details-value">${order.email}</span>
                </div>
                <div class="order-details-item">
                    <span class="order-details-label">Подписка на новости:</span>
                    <span class="order-details-value">${order.subscribe ? 'Да' : 'Нет'}</span>
                </div>
                <div class="order-details-item">
                    <span class="order-details-label">Телефон:</span>
                    <span class="order-details-value">${order.phone}</span>
                </div>
                <div class="order-details-item">
                    <span class="order-details-label">Адрес доставки:</span>
                    <span class="order-details-value">${order.delivery_address}</span>
                </div>
                <div class="order-details-item">
                    <span class="order-details-label">Тип доставки:</span>
                    <span class="order-details-value">${order.delivery_type === 'now' ? 'Как можно скорее' : 'Ко времени'}</span>
                </div>
                <div class="order-details-item">
                    <span class="order-details-label">Время доставки:</span>
                    <span class="order-details-value">${deliveryTime}</span>
                </div>
                <div class="order-details-item">
                    <span class="order-details-label">Комментарий:</span>
                    <span class="order-details-value">${order.comment || 'Нет комментария'}</span>
                </div>
                <div class="order-details-item">
                    <span class="order-details-label">Стоимость:</span>
                    <span class="order-details-value">${this.calculateOrderTotal(order)} ₽</span>
                </div>
            `;
            
            document.getElementById('order-details-content').innerHTML = detailsHTML;
            this.openModal('order-details-modal');
            
        } catch (error) {
            console.error('Ошибка загрузки деталей заказа:', error);
            this.showNotification(`Ошибка загрузки деталей заказа: ${error.message}`, 'error');
        }
    }
    
    // Показать форму редактирования заказа
    async showEditOrderForm(orderId) {
        if (!this.apiKey) {
            this.showNotification('Сначала установите API ключ', 'error');
            return;
        }
        
        try {
            const response = await fetch(`${this.BASE_URL}/labs/api/orders/${orderId}?api_key=${this.apiKey}`);
            
            if (!response.ok) {
                throw new Error(`Ошибка сервера: ${response.status}`);
            }
            
            const order = await response.json();
            
            // Заполняем форму данными заказа
            document.getElementById('edit-order-id').value = order.id;
            document.getElementById('edit-full-name').value = order.full_name;
            document.getElementById('edit-email').value = order.email;
            document.getElementById('edit-subscribe').checked = order.subscribe == 1;
            document.getElementById('edit-phone').value = order.phone;
            document.getElementById('edit-delivery-address').value = order.delivery_address;
            document.getElementById('edit-comment').value = order.comment || '';
            
            // Устанавливаем тип доставки
            if (order.delivery_type === 'by_time') {
                document.querySelector('input[name="edit-delivery-type"][value="by_time"]').checked = true;
                document.getElementById('edit-time-group').style.display = 'block';
                document.getElementById('edit-delivery-time').value = order.delivery_time || '';
                document.getElementById('edit-delivery-time').required = true;
            } else {
                document.querySelector('input[name="edit-delivery-type"][value="now"]').checked = true;
                document.getElementById('edit-time-group').style.display = 'none';
                document.getElementById('edit-delivery-time').required = false;
            }
            
            this.openModal('edit-order-modal');
            
        } catch (error) {
            console.error('Ошибка загрузки данных для редактирования:', error);
            this.showNotification(`Ошибка загрузки данных: ${error.message}`, 'error');
        }
    }
    
    // Сохранение отредактированного заказа
    async saveEditedOrder() {
        if (!this.apiKey || !this.currentOrderId) {
            this.showNotification('Ошибка: отсутствует API ключ или ID заказа', 'error');
            return;
        }
        
        // Собираем данные формы
        const formData = {
            full_name: document.getElementById('edit-full-name').value.trim(),
            email: document.getElementById('edit-email').value.trim(),
            subscribe: document.getElementById('edit-subscribe').checked ? 1 : 0,
            phone: document.getElementById('edit-phone').value.trim(),
            delivery_address: document.getElementById('edit-delivery-address').value.trim(),
            delivery_type: document.querySelector('input[name="edit-delivery-type"]:checked').value,
            comment: document.getElementById('edit-comment').value.trim()
        };
        
        // Добавляем время доставки, если выбрано "Ко времени"
        if (formData.delivery_type === 'by_time') {
            const deliveryTime = document.getElementById('edit-delivery-time').value;
            if (!deliveryTime) {
                this.showNotification('Пожалуйста, укажите время доставки', 'error');
                return;
            }
            formData.delivery_time = deliveryTime;
        }
        
        // Валидация данных
        if (!formData.full_name || !formData.email || !formData.phone || !formData.delivery_address) {
            this.showNotification('Пожалуйста, заполните все обязательные поля', 'error');
            return;
        }
        
        try {
            const response = await fetch(`${this.BASE_URL}/labs/api/orders/${this.currentOrderId}?api_key=${this.apiKey}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Ошибка сервера: ${response.status}`);
            }
            
            const updatedOrder = await response.json();
            
            this.closeModal('edit-order-modal');
            this.showNotification('Заказ успешно изменён', 'success');
            
            // Обновляем список заказов
            this.loadOrders();
            
        } catch (error) {
            console.error('Ошибка сохранения заказа:', error);
            this.showNotification(`Ошибка сохранения: ${error.message}`, 'error');
        }
    }
    
    // Показать подтверждение удаления
    showDeleteConfirmation(orderId) {
        this.currentOrderId = orderId;
        this.openModal('delete-order-modal');
    }
    
    // Удаление заказа
    async deleteOrder() {
        if (!this.apiKey || !this.currentOrderId) {
            this.showNotification('Ошибка: отсутствует API ключ или ID заказа', 'error');
            return;
        }
        
        try {
            const response = await fetch(`${this.BASE_URL}/labs/api/orders/${this.currentOrderId}?api_key=${this.apiKey}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Ошибка сервера: ${response.status}`);
            }
            
            const result = await response.json();
            
            this.closeModal('delete-order-modal');
            this.showNotification('Заказ успешно удалён', 'success');
            
            // Обновляем список заказов
            this.loadOrders();
            this.currentOrderId = null;
            
        } catch (error) {
            console.error('Ошибка удаления заказа:', error);
            this.showNotification(`Ошибка удаления: ${error.message}`, 'error');
        }
    }
    
    // Открытие модального окна
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }
    
    // Закрытие модального окна
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
        this.currentOrderId = null;
    }
    
    // Закрытие всех модальных окон
    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
        document.body.style.overflow = '';
        this.currentOrderId = null;
    }
    
    // Показать уведомление
    showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.style.display = 'block';
        
        // Автоматическое скрытие через 5 секунд
        setTimeout(() => {
            notification.style.display = 'none';
        }, 5000);
    }
}

// Инициализация после загрузки страницы
document.addEventListener('DOMContentLoaded', () => {
    window.ordersManager = new OrdersManager();
});