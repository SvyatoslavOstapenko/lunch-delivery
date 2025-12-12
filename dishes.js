const dishes = [
    {
        keyword: "chicken_soup",
        name: "Куриный суп с лапшой",
        price: 250,
        category: "soup",
        count: "350 мл",
        image: "images/soup1.jpg",
        kind: "meat"
    },
    {
        keyword: "borscht",
        name: "Борщ с говядиной и сметаной",
        price: 280,
        category: "soup",
        count: "400 мл",
        image: "images/soup2.jpg",
        kind: "meat"
    },
    {
        keyword: "tom_yam",
        name: "Том Ям с креветками",
        price: 320,
        category: "soup",
        count: "300 мл",
        image: "images/soup3.jpg",
        kind: "fish"
    },
    {
        keyword: "vegetable_soup",
        name: "Овощной суп",
        price: 230,
        category: "soup",
        count: "350 мл",
        image: "images/soup4.jpg",
        kind: "veg"
    },
    {
        keyword: "fish_soup",
        name: "Уха",
        price: 270,
        category: "soup",
        count: "400 мл",
        image: "images/soup5.jpg",
        kind: "fish"
    },
    {
        keyword: "mushroom_soup",
        name: "Грибной суп",
        price: 260,
        category: "soup",
        count: "350 мл",
        image: "images/soup6.jpg",
        kind: "veg"
    },
    {
        keyword: "steak",
        name: "Стейк из говядины с овощами",
        price: 520,
        category: "main",
        count: "350 г",
        image: "images/main1.jpg",
        kind: "meat"
    },
    {
        keyword: "pasta",
        name: "Паста Карбонара с беконом",
        price: 380,
        category: "main",
        count: "300 г",
        image: "images/main2.jpg",
        kind: "meat"
    },
    {
        keyword: "salmon",
        name: "Лосось на гриле с рисом",
        price: 450,
        category: "main",
        count: "320 г",
        image: "images/main3.jpg",
        kind: "fish"
    },
    {
        keyword: "vegetable_stew",
        name: "Овощное рагу",
        price: 320,
        category: "main",
        count: "300 г",
        image: "images/main4.jpg",
        kind: "veg"
    },
    {
        keyword: "trout",
        name: "Форель на пару",
        price: 480,
        category: "main",
        count: "300 г",
        image: "images/main5.jpg",
        kind: "fish"
    },
    {
        keyword: "buckwheat",
        name: "Гречка с грибами",
        price: 280,
        category: "main",
        count: "350 г",
        image: "images/main6.jpg",
        kind: "veg"
    },
    {
        keyword: "juice",
        name: "Апельсиновый сок",
        price: 150,
        category: "drink",
        count: "330 мл",
        image: "images/drink1.jpg",
        kind: "cold"
    },
    {
        keyword: "tea",
        name: "Зеленый чай с жасмином",
        price: 120,
        category: "drink",
        count: "500 мл",
        image: "images/drink2.jpg",
        kind: "hot"
    },
    {
        keyword: "coffee",
        name: "Капучино",
        price: 180,
        category: "drink",
        count: "350 мл",
        image: "images/drink3.jpg",
        kind: "hot"
    },
    {
        keyword: "lemonade",
        name: "Домашний лимонад",
        price: 180,
        category: "drink",
        count: "500 мл",
        image: "images/drink4.jpg",
        kind: "cold"
    },
    {
        keyword: "iced_tea",
        name: "Холодный чай",
        price: 160,
        category: "drink",
        count: "500 мл",
        image: "images/drink5.jpg",
        kind: "cold"
    },
    {
        keyword: "latte",
        name: "Латте",
        price: 200,
        category: "drink",
        count: "350 мл",
        image: "images/drink6.jpg",
        kind: "hot"
    },
    {
        keyword: "caesar_salad",
        name: "Салат Цезарь",
        price: 350,
        category: "salad",
        count: "250 г",
        image: "images/salad1.jpg",
        kind: "meat"
    },
    {
        keyword: "shrimp_salad",
        name: "Салат с креветками",
        price: 380,
        category: "salad",
        count: "200 г",
        image: "images/salad2.jpg",
        kind: "fish"
    },
    {
        keyword: "greek_salad",
        name: "Греческий салат",
        price: 300,
        category: "salad",
        count: "300 г",
        image: "images/salad3.jpg",
        kind: "veg"
    },
    {
        keyword: "vegetable_salad",
        name: "Овощной салат",
        price: 280,
        category: "salad",
        count: "280 г",
        image: "images/salad4.jpg",
        kind: "veg"
    },
    {
        keyword: "tuna_salad",
        name: "Салат с тунцом",
        price: 320,
        category: "salad",
        count: "270 г",
        image: "images/salad5.jpg",
        kind: "fish"
    },
    {
        keyword: "caprese",
        name: "Капрезе",
        price: 290,
        category: "salad",
        count: "220 г",
        image: "images/salad6.jpg",
        kind: "veg"
    },
    {
        keyword: "tiramisu",
        name: "Тирамису",
        price: 280,
        category: "dessert",
        count: "150 г",
        image: "images/dessert1.jpg",
        kind: "small"
    },
    {
        keyword: "cheesecake",
        name: "Чизкейк",
        price: 320,
        category: "dessert",
        count: "200 г",
        image: "images/dessert2.jpg",
        kind: "medium"
    },
    {
        keyword: "chocolate_cake",
        name: "Шоколадный торт",
        price: 350,
        category: "dessert",
        count: "250 г",
        image: "images/dessert3.jpg",
        kind: "large"
    },
    {
        keyword: "macaron",
        name: "Макарон",
        price: 180,
        category: "dessert",
        count: "100 г",
        image: "images/dessert4.jpg",
        kind: "small"
    },
    {
        keyword: "eclair",
        name: "Эклер",
        price: 150,
        category: "dessert",
        count: "120 г",
        image: "images/dessert5.jpg",
        kind: "small"
    },
    {
        keyword: "bird_milk_cake",
        name: "Торт 'Птичье молоко'",
        price: 300,
        category: "dessert",
        count: "200 г",
        image: "images/dessert6.jpg",
        kind: "medium"
    }
];