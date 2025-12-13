// storage.js
class StorageManager {
    constructor() {
        this.STORAGE_KEY = 'lunch_order';
    }

    // Сохранить выбранные блюда в localStorage
    saveSelectedDishes(selectedDishes) {
        try {
            const dataToSave = {};
            
            // Сохраняем только keyword блюд
            if (selectedDishes.soup) dataToSave.soup = selectedDishes.soup.keyword;
            if (selectedDishes.main) dataToSave.main = selectedDishes.main.keyword;
            if (selectedDishes.salad) dataToSave.salad = selectedDishes.salad.keyword;
            if (selectedDishes.drink) dataToSave.drink = selectedDishes.drink.keyword;
            if (selectedDishes.dessert) dataToSave.dessert = selectedDishes.dessert.keyword;
            
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dataToSave));
            console.log('Данные сохранены в localStorage:', dataToSave);
            return true;
        } catch (error) {
            console.error('Ошибка при сохранении в localStorage:', error);
            return false;
        }
    }

    // Загрузить выбранные блюда из localStorage
    loadSelectedDishes() {
        try {
            const savedData = localStorage.getItem(this.STORAGE_KEY);
            if (!savedData) return null;
            
            return JSON.parse(savedData);
        } catch (error) {
            console.error('Ошибка при загрузке из localStorage:', error);
            return null;
        }
    }

    // Очистить сохраненные данные
    clearSelectedDishes() {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
            console.log('Данные удалены из localStorage');
            return true;
        } catch (error) {
            console.error('Ошибка при удалении из localStorage:', error);
            return false;
        }
    }

    // Проверить, есть ли сохраненные данные
    hasSavedData() {
        return localStorage.getItem(this.STORAGE_KEY) !== null;
    }
}

// Создаем глобальный экземпляр
window.storageManager = new StorageManager();