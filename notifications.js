// Система уведомлений для проверки ланча

class LunchValidator {
    constructor() {
        this.notifications = {
            empty: {
                title: 'Ничего не выбрано',
                message: 'Выберите блюда для заказа',
                image: 'images/notification-empty.png'
            },
            noDrink: {
                title: 'Выберите напиток',
                message: 'Добавьте напиток к заказу',
                image: 'images/notification-drink.png'
            },
            noMainOrSalad: {
                title: 'Выберите главное блюдо/салат/стартер',
                message: 'К супу нужно добавить главное блюдо или салат',
                image: 'images/notification-main.png'
            },
            noSoupOrMain: {
                title: 'Выберите суп или главное блюдо',
                message: 'К салату нужно добавить суп или главное блюдо',
                image: 'images/notification-soup.png'
            },
            noMainForDrinkDessert: {
                title: 'Выберите главное блюдо',
                message: 'К напитку/десерту нужно добавить главное блюдо',
                image: 'images/notification-main-only.png'
            }
        };
    }

    // Проверяем, соответствует ли выбранный набор одному из вариантов комбо
    isValidCombo(selectedDishes) {
        const { soup, main, salad, drink, dessert } = selectedDishes;
        
        // Варианты комбо:
        // 1. Суп + Главное блюдо + Салат + Напиток
        // 2. Суп + Главное блюдо + Напиток
        // 3. Суп + Салат + Напиток
        // 4. Главное блюдо + Салат + Напиток
        // 5. Главное блюдо + Напиток
        // Десерт можно добавлять к любому варианту
        
        const combos = [
            { soup: true, main: true, salad: true, drink: true },  // Комбо 1
            { soup: true, main: true, salad: false, drink: true }, // Комбо 2
            { soup: true, main: false, salad: true, drink: true }, // Комбо 3
            { soup: false, main: true, salad: true, drink: true }, // Комбо 4
            { soup: false, main: true, salad: false, drink: true } // Комбо 5
        ];
        
        // Проверяем каждый комбо (игнорируем десерт)
        for (const combo of combos) {
            if (soup === combo.soup && 
                main === combo.main && 
                salad === combo.salad && 
                drink === combo.drink) {
                return true;
            }
        }
        
        return false;
    }

    // Получаем тип уведомления в зависимости от выбора
    getNotificationType(selectedDishes) {
        const { soup, main, salad, drink, dessert } = selectedDishes;
        
        // Проверяем, есть ли вообще выбранные блюда
        const hasAnySelection = soup || main || salad || drink || dessert;
        if (!hasAnySelection) return 'empty';
        
        // Проверяем наличие напитка (обязателен для всех комбо)
        if (!drink) return 'noDrink';
        
        // Проверяем суп без главного блюда и салата
        if (soup && !main && !salad) return 'noMainOrSalad';
        
        // Проверяем салат без супа и главного блюда
        if (salad && !soup && !main) return 'noSoupOrMain';
        
        // Проверяем напиток или десерт без главного блюда
        if ((drink || dessert) && !main) return 'noMainForDrinkDessert';
        
        // Если дошли сюда, но комбо не валидно - показываем общее
        if (!this.isValidCombo(selectedDishes)) {
            // Определяем наиболее подходящее уведомление
            if (!main) return 'noMainForDrinkDessert';
            if (!drink) return 'noDrink';
            return 'empty';
        }
        
        return null; // Валидный комбо
    }

    // Создаем и показываем уведомление
    showNotification(type) {
        const notification = this.notifications[type];
        if (!notification) return;
        
        // Создаем оверлей
        const overlay = document.createElement('div');
        overlay.className = 'notification-overlay';
        
        // Создаем уведомление
        const notificationElement = document.createElement('div');
        notificationElement.className = 'notification';
        
        notificationElement.innerHTML = `
            <img src="${notification.image}" alt="${notification.title}">
            <h3>${notification.title}</h3>
            <p>${notification.message}</p>
            <button class="notification-btn">Окей</button>
        `;
        
        overlay.appendChild(notificationElement);
        document.body.appendChild(overlay);
        
        // Обработчик для кнопки
        const closeBtn = notificationElement.querySelector('.notification-btn');
        closeBtn.addEventListener('click', () => {
            this.closeNotification(overlay);
        });
        
        // Закрытие при клике на оверлей
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.closeNotification(overlay);
            }
        });
        
        // Блокируем прокрутку фона
        document.body.style.overflow = 'hidden';
    }

    // Закрываем уведомление
    closeNotification(overlay) {
        if (overlay && overlay.parentNode) {
            overlay.classList.add('fade-out');
            setTimeout(() => {
                document.body.removeChild(overlay);
                document.body.style.overflow = '';
            }, 300);
        }
    }

    // Получаем текущие выбранные блюда
    getSelectedDishes() {
        return {
            soup: document.getElementById('hidden-soup').value !== '',
            main: document.getElementById('hidden-main').value !== '',
            salad: document.getElementById('hidden-salad').value !== '',
            drink: document.getElementById('hidden-drink').value !== '',
            dessert: document.getElementById('hidden-dessert').value !== ''
        };
    }

    // Основная функция проверки
    validateLunch() {
        const selectedDishes = this.getSelectedDishes();
        
        // Проверяем валидность комбо
        if (this.isValidCombo(selectedDishes)) {
            return true; // Валидный комбо
        }
        
        // Получаем тип уведомления
        const notificationType = this.getNotificationType(selectedDishes);
        if (notificationType) {
            this.showNotification(notificationType);
            return false;
        }
        
        return true;
    }
}

// Инициализация при загрузке документа
document.addEventListener('DOMContentLoaded', function() {
    const validator = new LunchValidator();
    
    // Добавляем обработчик для формы
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', function(event) {
            if (!validator.validateLunch()) {
                event.preventDefault(); // Отменяем отправку формы
            }
        });
    }
});