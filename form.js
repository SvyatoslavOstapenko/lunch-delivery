// Скрипт для управления формой заказа

document.addEventListener('DOMContentLoaded', function() {
    // Элементы формы
    const specificTimeRadio = document.getElementById('specific_time_radio');
    const timeInputGroup = document.getElementById('time_input_group');
    const specificTimeInput = document.getElementById('specific_time');
    const asapRadio = document.querySelector('input[value="asap"]');
    
    // Скрываем поле времени при загрузке страницы
    timeInputGroup.style.display = 'none';
    specificTimeInput.required = false;
    
    // Обработчик для переключателей времени доставки
    const timeRadios = document.querySelectorAll('input[name="delivery_time"]');
    timeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'specific') {
                timeInputGroup.style.display = 'block';
                specificTimeInput.required = true;
            } else {
                timeInputGroup.style.display = 'none';
                specificTimeInput.required = false;
            }
        });
    });
    
    // Валидация формы перед отправкой
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', function(event) {
            // Проверяем, выбрана ли опция "Ко времени" и заполнено ли поле времени
            if (specificTimeRadio.checked && !specificTimeInput.value) {
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
    
    // Обработчик для кнопки сброса
    const resetButton = document.querySelector('.reset-btn');
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            // Сбрасываем отображение поля времени
            timeInputGroup.style.display = 'none';
            specificTimeInput.required = false;
            asapRadio.checked = true;
            
            // Через небольшую задержку сбросим форму (для корректного сброса)
            setTimeout(() => {
                orderForm.reset();
            }, 10);
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
});