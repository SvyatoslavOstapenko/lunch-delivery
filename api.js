// api.js

class ApiManager {
    constructor() {
        this.API_KEY_STORAGE = 'api_key_storage';
        this.BASE_URL = 'https://edu.std-900.ist.mospolytech.ru';
        this.apiKey = null;
    }
    
    // Загрузка API ключа из localStorage
    loadApiKey() {
        this.apiKey = localStorage.getItem(this.API_KEY_STORAGE);
        return this.apiKey;
    }
    
    // Сохранение API ключа
    saveApiKey(key) {
        const trimmedKey = key.trim();
        
        // Проверка формата UUID
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(trimmedKey)) {
            return { success: false, message: 'Неверный формат API ключа. Используйте формат UUID.' };
        }
        
        this.apiKey = trimmedKey;
        localStorage.setItem(this.API_KEY_STORAGE, trimmedKey);
        return { success: true, message: 'API ключ успешно сохранен' };
    }
    
    // Очистка API ключа
    clearApiKey() {
        this.apiKey = null;
        localStorage.removeItem(this.API_KEY_STORAGE);
        return { success: true, message: 'API ключ очищен' };
    }
    
    // Проверка наличия API ключа
    hasApiKey() {
        return !!this.apiKey;
    }
    
    // Получение URL с API ключом
    getUrl(endpoint) {
        if (!this.apiKey) {
            throw new Error('API ключ не установлен');
        }
        
        const separator = endpoint.includes('?') ? '&' : '?';
        return `${this.BASE_URL}${endpoint}${separator}api_key=${this.apiKey}`;
    }
    
    // Выполнение GET запроса
    async get(endpoint) {
        const url = this.getUrl(endpoint);
        const response = await fetch(url);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Ошибка HTTP: ${response.status}`);
        }
        
        return await response.json();
    }
    
    // Выполнение POST запроса
    async post(endpoint, data) {
        const url = this.getUrl(endpoint);
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Ошибка HTTP: ${response.status}`);
        }
        
        return await response.json();
    }
    
    // Выполнение PUT запроса
    async put(endpoint, data) {
        const url = this.getUrl(endpoint);
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Ошибка HTTP: ${response.status}`);
        }
        
        return await response.json();
    }
    
    // Выполнение DELETE запроса
    async delete(endpoint) {
        const url = this.getUrl(endpoint);
        const response = await fetch(url, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Ошибка HTTP: ${response.status}`);
        }
        
        return await response.json();
    }
}

// Создаем глобальный экземпляр
window.apiManager = new ApiManager();