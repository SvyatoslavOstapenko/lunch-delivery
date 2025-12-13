// form.js - ОБНОВЛЕННАЯ ВЕРСИЯ

document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, на какой странице мы находимся
    const isCheckoutPage = window.location.pathname.includes('checkout.html');
    
    if (isCheckoutPage) {
        initCheckoutForm();
    } else {
        initLunchForm();
    }
    
    function initLunchForm() {
        // Элементы формы на странице lunch.html
        const specificTimeRadio = document.getElementById('specific_time_radio');
        const timeInputGroup = document.getElementById('time_input_group');
        const specificTimeInput = document.getElementById('specific_time');
        const asapRadio = document.querySelector('input[value="asap"]');
        const resetButton = document.querySelector('.reset-btn');
        
        // Скрываем поле времени при загрузке страницы
        if (timeInputGroup) timeInputGroup.style.display = 'none';
        if (specificTimeInput) specificTimeInput.required = false;
        
        // Обработчик для переключателей времени доставки
        const timeRadios = document.querySelectorAll('input[name="delivery_time"]');
        timeRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.value === 'specific') {
                    if (timeInputGroup) timeInputGroup.style.display = 'block';
                    if (specificTimeInput) specificTimeInput.required = true;
                } else {
                    if (timeInputGroup) timeInputGroup.style.display = 'none';
                    if (specificTimeInput) specificTimeInput.required = false;
                }
            });
        });
        
        // Обработчик для кнопки сброса
        if (resetButton) {
            resetButton.addEventListener('click', function(event) {
                event.preventDefault();
                
                // Сбрасываем форму
                const orderForm = document.getElementById('orderForm');
                if (orderForm) {
                    orderForm.reset();
                }
                
                // Сбрасываем отображение поля времени
                if (timeInputGroup) timeInputGroup.style.display = 'none';
                if (specificTimeInput) specificTimeInput.required = false;
                if (asapRadio) asapRadio.checked = true;
                
                // Очищаем localStorage
                if (window.storageManager) {
                    window.storageManager.clearSelectedDishes();
                }
                
                // Перезагружаем страницу для обновления состояния
                setTimeout(() => {
                    location.reload();
                }, 100);
            });
        }
        
        // Валидация формы перед отправкой
        const orderForm = document.getElementById('orderForm');
        if (orderForm) {
            orderForm.addEventListener('submit', function(event) {
                // Проверяем, выбрана ли опция "Ко времени" и заполнено ли поле времени
                if (specificTimeRadio && specificTimeRadio.checked && !specificTimeInput.value) {
                    event.preventDefault();
                    alert('Пожалуйста, укажите время доставки');
                    specificTimeInput.focus();
                    return false;
                }
                
                // Проверяем валидность email
                const emailInput = document.getElementById('email');
                if (emailInput && !emailInput.checkValidity()) {
                    event.preventDefault();
                    alert('Пожалуйста, введите корректный email адрес');
                    emailInput.focus();
                    return false;
                }
                
                // Проверяем валидность телефона
                const phoneInput = document.getElementById('phone');
                if (phoneInput && !phoneInput.value.trim()) {
                    event.preventDefault();
                    alert('Пожалуйста, введите номер телефона');
                    phoneInput.focus();
                    return false;
                }
                
                // Проверяем, что все обязательные поля заполнены
                const requiredInputs = document.querySelectorAll('input[required], select[required]');
                let isValid = true;
                let firstInvalidInput = null;
                
                requiredInputs.forEach(input => {
                    if (!input.value.trim()) {
                        isValid = false;
                        if (!firstInvalidInput) {
                            firstInvalidInput = input;
                        }
                    }
                });
                
                if (!isValid) {
                    event.preventDefault();
                    alert('Пожалуйста, заполните все обязательные поля');
                    if (firstInvalidInput) {
                        firstInvalidInput.focus();
                    }
                    return false;
                }
                
                // Если все проверки пройдены, форма отправится
                console.log('Форма отправляется...');
            });
        }
        
        // Валидация поля времени в реальном времени
        if (specificTimeInput) {
            specificTimeInput.addEventListener('input', function() {
                const time = this.value;
                if (time) {
                    const [hours, minutes] = time.split(':').map(Number);
                    
                    // Проверяем границы времени
                    if (hours < 7 || hours > 23) {
                        this.setCustomValidity('Время доставки должно быть между 07:00 и 23:00');
                    } else {
                        this.setCustomValidity('');
                    }
                }
            });
        }
    }
    
    function initCheckoutForm() {
        // Элементы формы на странице checkout.html
        const specificTimeRadio = document.getElementById('specific_time_radio_checkout');
        const timeInputGroup = document.getElementById('time_input_group_checkout');
        const specificTimeInput = document.getElementById('delivery_time');
        
        // Скрываем поле времени при загрузке страницы
        if (timeInputGroup) timeInputGroup.style.display = 'none';
        if (specificTimeInput) specificTimeInput.required = false;
        
        // Обработчик для переключателей времени доставки
        const timeRadios = document.querySelectorAll('input[name="delivery_type"]');
        timeRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.value === 'by_time') {
                    if (timeInputGroup) timeInputGroup.style.display = 'block';
                    if (specificTimeInput) specificTimeInput.required = true;
                } else {
                    if (timeInputGroup) timeInputGroup.style.display = 'none';
                    if (specificTimeInput) specificTimeInput.required = false;
                }
            });
        });
        
        // Валидация поля времени в реальном времени
        if (specificTimeInput) {
            specificTimeInput.addEventListener('input', function() {
                const time = this.value;
                if (time) {
                    const [hours, minutes] = time.split(':').map(Number);
                    
                    // Проверяем границы времени
                    if (hours < 7 || hours > 23) {
                        this.setCustomValidity('Время доставки должно быть между 07:00 и 23:00');
                    } else {
                        this.setCustomValidity('');
                    }
                }
            });
        }
    }
});