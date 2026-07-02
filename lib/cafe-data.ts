export const CAFE_DATA = {
  categories: [
    { id: "beverages", name: "Beverages" },
    { id: "breakfast", name: "Breakfast" },
    { id: "salads", name: "Salads" },
    { id: "soups", name: "Soups" },
    { id: "starters", name: "Starters" },
    { id: "sandwiches", name: "Toast & Sandwiches" },
    { id: "burgers", name: "Burgers" },
    { id: "indian", name: "Indian Mains" },
    { id: "steaks", name: "Steaks & Sizzlers" },
    { id: "israeli", name: "Israeli" },
    { id: "chinese", name: "Chinese" },
    { id: "italian", name: "Italian" },
    { id: "specials", name: "Himalayan Specials" },
    { id: "desserts", name: "Desserts" }
  ],
  items: [
    // --- Beverages ---
    { id: "b-1", categoryId: "beverages", name: "Orange Juice", basePrice: 150, isVeg: true },
    { id: "b-2", categoryId: "beverages", name: "Mango Juice", basePrice: 150, isVeg: true },
    { id: "b-3", categoryId: "beverages", name: "Pineapple Juice", basePrice: 150, isVeg: true },
    { id: "b-4", categoryId: "beverages", name: "Watermelon Juice", basePrice: 160, isVeg: true },
    { id: "b-5", categoryId: "beverages", name: "Mix Fruit Juice", basePrice: 170, isVeg: true },
    { id: "b-6", categoryId: "beverages", name: "Banana Shake", basePrice: 150, isVeg: true },
    { id: "b-7", categoryId: "beverages", name: "Mango Shake", basePrice: 160, isVeg: true },
    { id: "b-8", categoryId: "beverages", name: "Mix Fruit Shake", basePrice: 180, isVeg: true },
    { id: "b-9", categoryId: "beverages", name: "Chocolate / Coffee Shake", basePrice: 160, isVeg: true },
    { id: "b-10", categoryId: "beverages", name: "Oreo Shake", basePrice: 180, isVeg: true },
    { id: "b-11", categoryId: "beverages", name: "Plain / Sweet & Salty Lassi", basePrice: 150, isVeg: true },
    { id: "b-12", categoryId: "beverages", name: "Banana Lassi", basePrice: 160, isVeg: true },
    { id: "b-13", categoryId: "beverages", name: "Mango / Mix Fruit Lassi", basePrice: 170, isVeg: true },
    { id: "b-14", categoryId: "beverages", name: "Black Tea", basePrice: 30, isVeg: true },
    { id: "b-15", categoryId: "beverages", name: "Mint, Lemon or Green Tea", basePrice: 40, isVeg: true },
    { id: "b-16", categoryId: "beverages", name: "B-Coffee / Masala Tea", basePrice: 50, isVeg: true },
    { id: "b-17", categoryId: "beverages", name: "Milk Coffee", basePrice: 70, isVeg: true },
    { id: "b-18", categoryId: "beverages", name: "Hot Chocolate", basePrice: 130, isVeg: true },
    { id: "b-19", categoryId: "beverages", name: "Ginger, Lemon & Honey Tea", basePrice: 150, isVeg: true },
    { id: "b-20", categoryId: "beverages", name: "Cappuccino & Espresso", basePrice: 180, isVeg: true },

    // --- Breakfast ---
    { id: "br-1", categoryId: "breakfast", name: "Off the Trail Special", description: "Nutella Pancake, Fruit Salad, Small Juice and Tea or Coffee", basePrice: 410, isVeg: true, containsEgg: true },
    { id: "br-2", categoryId: "breakfast", name: "English Breakfast", description: "Sausages, Sunny Side Egg, Baked Beans, Small Juice and Tea or Coffee", basePrice: 430, isVeg: false, containsEgg: true },
    { id: "br-3", categoryId: "breakfast", name: "Israeli Breakfast", description: "Choice of Egg, Salad, Hummus, Pita/Toast and G.L.H. Tea or Hot Chocolate", basePrice: 390, isVeg: false, containsEgg: true },
    { id: "br-4", categoryId: "breakfast", name: "Fix Breakfast", description: "Hash Brown Potato, Butter Jam Toast, Any Egg Style and Tea or Coffee", basePrice: 350, isVeg: false, containsEgg: true },
    { id: "br-5", categoryId: "breakfast", name: "Healthy Breakfast", description: "Fresh Fruit Salad, Choice of Egg, Butter Toast and Tea or Coffee", basePrice: 350, isVeg: false, containsEgg: true },
    { id: "br-6", categoryId: "breakfast", name: "Indian Breakfast", description: "2 Paranthas, Curd, Pickle and Tea or Coffee", basePrice: 290, isVeg: true },
    
    // Eggs
    { id: "e-1", categoryId: "breakfast", name: "Boiled Eggs", description: "Served with toast", basePrice: 90, isVeg: false, containsEgg: true },
    { id: "e-2", categoryId: "breakfast", name: "Poached Eggs", description: "Served with toast", basePrice: 130, isVeg: false, containsEgg: true },
    { id: "e-3", categoryId: "breakfast", name: "Fried & Scrambled Eggs", description: "Served with toast", basePrice: 130, isVeg: false, containsEgg: true },
    { id: "e-4", categoryId: "breakfast", name: "Plain Omelette", basePrice: 90, isVeg: false, containsEgg: true },
    { id: "e-5", categoryId: "breakfast", name: "Masala Omelette", basePrice: 130, isVeg: false, containsEgg: true },
    { id: "e-6", categoryId: "breakfast", name: "Mushroom Omelette", basePrice: 160, isVeg: false, containsEgg: true },
    { id: "e-7", categoryId: "breakfast", name: "Cheese Tomato Omelette", basePrice: 170, isVeg: false, containsEgg: true },
    { id: "e-8", categoryId: "breakfast", name: "Cheese Spanish Omelette", basePrice: 180, isVeg: false, containsEgg: true },

    // Cereals
    { id: "c-1", categoryId: "breakfast", name: "Plain Porridge", basePrice: 120, isVeg: true },
    { id: "c-2", categoryId: "breakfast", name: "Banana Honey Porridge", basePrice: 170, isVeg: true },
    { id: "c-3", categoryId: "breakfast", name: "Corn Flakes", description: "Hot and cold milk", basePrice: 170, isVeg: true },
    { id: "c-4", categoryId: "breakfast", name: "Fruit Muesli", description: "Curd with honey", basePrice: 230, isVeg: true },

    // --- Salads ---
    { id: "sa-1", categoryId: "salads", name: "Green Salad", basePrice: 110, isVeg: true },
    { id: "sa-2", categoryId: "salads", name: "Israeli Salad", basePrice: 150, isVeg: true },
    { id: "sa-3", categoryId: "salads", name: "Chicken Salad", basePrice: 220, isVeg: false },
    { id: "sa-4", categoryId: "salads", name: "Mix Salad", description: "Veg, Egg & Chicken", basePrice: 250, isVeg: false, containsEgg: true },

    // --- Soups ---
    { id: "so-1", categoryId: "soups", name: "Tomato Soup", basePrice: 150, isVeg: true },
    { id: "so-2", categoryId: "soups", name: "Cream of Veg / Mushroom", basePrice: 160, isVeg: true },
    { id: "so-3", categoryId: "soups", name: "Veg Hot & Sour", basePrice: 170, isVeg: true },
    { id: "so-4", categoryId: "soups", name: "Veg Manchow", basePrice: 180, isVeg: true },
    { id: "so-5", categoryId: "soups", name: "Cream of Chicken", basePrice: 180, isVeg: false },
    { id: "so-6", categoryId: "soups", name: "Chicken Hot & Sour", basePrice: 190, isVeg: false },
    { id: "so-7", categoryId: "soups", name: "Chicken Manchow", basePrice: 210, isVeg: false },

    // --- Starters ---
    { id: "st-1", categoryId: "starters", name: "Papad, Roasted / Fried", basePrice: 90, isVeg: true },
    { id: "st-2", categoryId: "starters", name: "Masala Papad", basePrice: 120, isVeg: true },
    { id: "st-3", categoryId: "starters", name: "French Fry", basePrice: 130, isVeg: true },
    { id: "st-4", categoryId: "starters", name: "Peanut Masala", basePrice: 140, isVeg: true },
    { id: "st-5", categoryId: "starters", name: "Veg Pakora", basePrice: 150, isVeg: true },
    { id: "st-6", categoryId: "starters", name: "Paneer Pakora", basePrice: 200, isVeg: true },
    { id: "st-7", categoryId: "starters", name: "Chicken Pakora", basePrice: 230, isVeg: false },
    { id: "st-8", categoryId: "starters", name: "Honey Chilly Potato", basePrice: 290, isVeg: true },
    { id: "st-9", categoryId: "starters", name: "Veg Spring Roll", basePrice: 290, isVeg: true },
    { id: "st-10", categoryId: "starters", name: "Chicken Finger", basePrice: 320, isVeg: false },
    { id: "st-11", categoryId: "starters", name: "Chicken Spring Roll", basePrice: 330, isVeg: false },

    // --- Toast & Sandwich ---
    { id: "sw-1", categoryId: "sandwiches", name: "Plain Toast", description: "Choice of mayonnaise and butter", basePrice: 60, isVeg: true },
    { id: "sw-2", categoryId: "sandwiches", name: "Butter Toast", description: "Choice of mayonnaise and butter", basePrice: 90, isVeg: true },
    { id: "sw-3", categoryId: "sandwiches", name: "French Toast", description: "Choice of mayonnaise and butter", basePrice: 150, isVeg: false, containsEgg: true },
    { id: "sw-4", categoryId: "sandwiches", name: "Nutella Toast", description: "Choice of mayonnaise and butter", basePrice: 180, isVeg: true },
    { id: "sw-5", categoryId: "sandwiches", name: "Cheese Tomato Toast", description: "Choice of mayonnaise and butter", basePrice: 190, isVeg: true },
    { id: "sw-6", categoryId: "sandwiches", name: "Veg Sandwich", description: "Choice of mayonnaise and butter", basePrice: 180, isVeg: true },
    { id: "sw-7", categoryId: "sandwiches", name: "Veg Cheese Sandwich", description: "Choice of mayonnaise and butter", basePrice: 210, isVeg: true },
    { id: "sw-8", categoryId: "sandwiches", name: "Veg Club Sandwich", description: "Choice of mayonnaise and butter", basePrice: 230, isVeg: true },
    { id: "sw-9", categoryId: "sandwiches", name: "Chicken Sandwich", description: "Choice of mayonnaise and butter", basePrice: 230, isVeg: false },
    { id: "sw-10", categoryId: "sandwiches", name: "Chicken Cheese Sandwich", description: "Choice of mayonnaise and butter", basePrice: 250, isVeg: false },
    { id: "sw-11", categoryId: "sandwiches", name: "Chicken Club Sandwich", description: "Choice of mayonnaise and butter", basePrice: 270, isVeg: false },

    // --- Burgers ---
    { id: "bu-1", categoryId: "burgers", name: "Veg Burger", basePrice: 230, isVeg: true },
    { id: "bu-2", categoryId: "burgers", name: "Veg Cheese Burger", basePrice: 250, isVeg: true },
    { id: "bu-3", categoryId: "burgers", name: "Chicken Burger", basePrice: 270, isVeg: false },
    { id: "bu-4", categoryId: "burgers", name: "Chicken Cheese Burger", basePrice: 290, isVeg: false },

    // --- Indian Mains ---
    // Veg Curries
    { id: "in-1", categoryId: "indian", name: "Aloo Gobhi", basePrice: 220, isVeg: true },
    { id: "in-2", categoryId: "indian", name: "Mix Veg", basePrice: 250, isVeg: true },
    { id: "in-3", categoryId: "indian", name: "Dum Aloo", basePrice: 250, isVeg: true },
    { id: "in-4", categoryId: "indian", name: "Mushroom Mutter", basePrice: 270, isVeg: true },
    { id: "in-5", categoryId: "indian", name: "Mushroom Masala", basePrice: 290, isVeg: true },
    { id: "in-6", categoryId: "indian", name: "Mutter Paneer", basePrice: 270, isVeg: true },
    { id: "in-7", categoryId: "indian", name: "Kadai Paneer", basePrice: 320, isVeg: true },
    { id: "in-8", categoryId: "indian", name: "Paneer Butter Masala", basePrice: 350, isVeg: true },
    { id: "in-9", categoryId: "indian", name: "Paneer Lababdar", basePrice: 380, isVeg: true },
    
    // Dal
    { id: "in-10", categoryId: "indian", name: "Dal Tadka", basePrice: 280, isVeg: true },
    { id: "in-11", categoryId: "indian", name: "Dal Makhani", basePrice: 290, isVeg: true },

    // Chicken
    { id: "in-12", categoryId: "indian", name: "Chicken Masala", basePrice: 390, isVeg: false },
    { id: "in-13", categoryId: "indian", name: "Kadai Chicken", basePrice: 430, isVeg: false },
    { id: "in-14", categoryId: "indian", name: "Murg Do Pyaza", basePrice: 450, isVeg: false },
    { id: "in-15", categoryId: "indian", name: "Butter Chicken", basePrice: 470, isVeg: false },
    { id: "in-16", categoryId: "indian", name: "Murg Lababdar", basePrice: 470, isVeg: false },

    // Rice
    { id: "in-17", categoryId: "indian", name: "Plain Rice", basePrice: 150, isVeg: true },
    { id: "in-18", categoryId: "indian", name: "Jeera Rice", basePrice: 170, isVeg: true },
    { id: "in-19", categoryId: "indian", name: "Veg Pulao", basePrice: 210, isVeg: true },
    { id: "in-20", categoryId: "indian", name: "Veg Biryani", basePrice: 250, isVeg: true },
    { id: "in-21", categoryId: "indian", name: "Egg Biryani", basePrice: 270, isVeg: false, containsEgg: true },
    { id: "in-22", categoryId: "indian", name: "Chicken Biryani", basePrice: 370, isVeg: false },

    // Breads
    { id: "in-23", categoryId: "indian", name: "Plain Roti", basePrice: 20, isVeg: true },
    { id: "in-24", categoryId: "indian", name: "Butter Roti", basePrice: 25, isVeg: true },
    { id: "in-25", categoryId: "indian", name: "Plain Naan", basePrice: 70, isVeg: true },
    { id: "in-26", categoryId: "indian", name: "Butter Naan", basePrice: 90, isVeg: true },
    { id: "in-27", categoryId: "indian", name: "Garlic Naan", basePrice: 120, isVeg: true },
    { id: "in-28", categoryId: "indian", name: "Cheese Naan", basePrice: 150, isVeg: true },
    { id: "in-29", categoryId: "indian", name: "Garlic Cheese Naan", basePrice: 160, isVeg: true },

    // Curd
    { id: "in-30", categoryId: "indian", name: "Plain Curd", basePrice: 90, isVeg: true },
    { id: "in-31", categoryId: "indian", name: "Veg Raita", basePrice: 150, isVeg: true },
    { id: "in-32", categoryId: "indian", name: "Banana Honey Curd", basePrice: 170, isVeg: true },

    // --- Steaks or Sizzlers ---
    { id: "sk-1", categoryId: "steaks", name: "Veg Steak / Sizzler", description: "Tomato Sauce. Price range ₹440–₹540", basePrice: 440, priceVaries: true, isVeg: true },
    { id: "sk-2", categoryId: "steaks", name: "Veg Cheese Steak / Sizzler", description: "White Sauce with Cheese. Price range ₹470–₹570", basePrice: 470, priceVaries: true, isVeg: true },
    { id: "sk-3", categoryId: "steaks", name: "Chicken Steak / Sizzler", description: "Brown Sauce. Price range ₹530–₹630", basePrice: 530, priceVaries: true, isVeg: false },
    { id: "sk-4", categoryId: "steaks", name: "Garlic / Pepper Garlic Chicken Steak or Sizzler", description: "Price range ₹550–₹650", basePrice: 550, priceVaries: true, isVeg: false },
    { id: "sk-5", categoryId: "steaks", name: "Rum Steak / Sizzler, Chicken Steak or Sizzler", description: "Price range ₹570–₹670", basePrice: 570, priceVaries: true, isVeg: false },

    // --- Israeli ---
    { id: "is-1", categoryId: "israeli", name: "Tahina with Pitta", basePrice: 190, isVeg: true },
    { id: "is-2", categoryId: "israeli", name: "Hummus with Pitta", basePrice: 250, isVeg: true },
    { id: "is-3", categoryId: "israeli", name: "Shakshuka with Pitta", basePrice: 350, isVeg: false, containsEgg: true },
    { id: "is-4", categoryId: "israeli", name: "Veg Falafel", basePrice: 430, isVeg: true },
    { id: "is-5", categoryId: "israeli", name: "Chicken Schnitzel Lafa / Plate", basePrice: 550, isVeg: false },

    // --- Chinese ---
    { id: "ch-1", categoryId: "chinese", name: "Mushroom Chilly", basePrice: 290, isVeg: true },
    { id: "ch-2", categoryId: "chinese", name: "Veg Manchurian", basePrice: 310, isVeg: true },
    { id: "ch-3", categoryId: "chinese", name: "Paneer Chilly", basePrice: 330, isVeg: true },
    { id: "ch-4", categoryId: "chinese", name: "Chilly Chicken", basePrice: 390, isVeg: false },
    { id: "ch-5", categoryId: "chinese", name: "Chicken Manchurian", basePrice: 450, isVeg: false },
    { id: "ch-6", categoryId: "chinese", name: "Chicken in Garlic Sauce", basePrice: 450, isVeg: false },
    { id: "ch-7", categoryId: "chinese", name: "Veg Fried Rice / Noodle", basePrice: 250, isVeg: true },
    { id: "ch-8", categoryId: "chinese", name: "Mushroom Fried Rice / Noodle", basePrice: 270, isVeg: true },
    { id: "ch-9", categoryId: "chinese", name: "Egg Fried Rice / Noodle", basePrice: 280, isVeg: false, containsEgg: true },
    { id: "ch-10", categoryId: "chinese", name: "Chicken Fried Rice / Noodle", basePrice: 350, isVeg: false },

    // --- Italian ---
    // Pasta
    { id: "it-1", categoryId: "italian", name: "Pasta Alla Pummarola", description: "Tomato sauce and basil (Served with cheese and olive oil)", basePrice: 390, isVeg: true },
    { id: "it-2", categoryId: "italian", name: "Pasta Arabiata", description: "Tomato sauce and green chilli (Served with cheese and olive oil)", basePrice: 430, isVeg: true },
    { id: "it-3", categoryId: "italian", name: "Pasta Boscaiola", description: "Tomato, eggplant and mushroom (Served with cheese and olive oil)", basePrice: 450, isVeg: true },
    { id: "it-4", categoryId: "italian", name: "Pasta Alla Zingara", description: "Tomato, olive and capsicum (Served with cheese and olive oil)", basePrice: 480, isVeg: true },
    { id: "it-5", categoryId: "italian", name: "Pasta Alla Funghi", description: "White sauce and mushroom (Served with cheese and olive oil)", basePrice: 510, isVeg: true },
    { id: "it-6", categoryId: "italian", name: "Vegetable Pasta", description: "Veggies with tomato sauce and olives (Served with cheese and olive oil)", basePrice: 550, isVeg: true },
    { id: "it-7", categoryId: "italian", name: "Pasta Pollo e Pomodori", description: "Chicken with tomato / white sauce (Served with cheese and olive oil)", basePrice: 590, isVeg: false },

    // Pizza
    { id: "it-8", categoryId: "italian", name: "Margherita Pizza", description: "Tomato sauce with cheese", basePrice: 510, isVeg: true },
    { id: "it-9", categoryId: "italian", name: "Funghi Pizza", description: "Tomato sauce, mushroom and cheese", basePrice: 550, isVeg: true },
    { id: "it-10", categoryId: "italian", name: "Olive Pizza", description: "Tomato sauce, olive and cheese", basePrice: 570, isVeg: true },
    { id: "it-11", categoryId: "italian", name: "Quattro Stagioni Pizza", description: "Tomato sauce, onion, olive, eggplant, garlic and cheese", basePrice: 590, isVeg: true },
    { id: "it-12", categoryId: "italian", name: "Capo Pizza", description: "Tomato sauce, onion, mushroom, olive and cheese", basePrice: 590, isVeg: true },
    { id: "it-13", categoryId: "italian", name: "Verdure Pizza", description: "Tomato sauce, onion, capsicum, mushroom, sweet corn and cheese", basePrice: 610, isVeg: true },
    { id: "it-14", categoryId: "italian", name: "Chioccia Pizza", description: "Tomato sauce, chicken, onion, capsicum and cheese", basePrice: 650, isVeg: false },
    { id: "it-15", categoryId: "italian", name: "Chicken Pizza", description: "Chicken with tomato sauce and cheese", basePrice: 690, isVeg: false },

    // --- Himalayan Specials ---
    { id: "sp-1", categoryId: "specials", name: "Himalayan Trout - Masala Fry", description: "Served with fries and salad. Prices vary according to fish size.", basePrice: 900, priceVaries: true, isVeg: false },
    { id: "sp-2", categoryId: "specials", name: "Himalayan Trout - Butter Garlic", description: "Served with fries and salad. Prices vary according to fish size.", basePrice: 1000, priceVaries: true, isVeg: false },
    { id: "sp-3", categoryId: "specials", name: "Morel Platter (Gucchi / Morchella)", description: "The true morel mushroom.", basePrice: 1500, priceVaries: true, isVeg: true },

    // --- Desserts ---
    { id: "d-1", categoryId: "desserts", name: "Fruit Salad", basePrice: 150, isVeg: true },
    { id: "d-2", categoryId: "desserts", name: "Honey Pancake", basePrice: 180, isVeg: true },
    { id: "d-3", categoryId: "desserts", name: "Banana Chocolate Pancake", basePrice: 180, isVeg: true },
    { id: "d-4", categoryId: "desserts", name: "Nutella Pancake", basePrice: 210, isVeg: true },
    { id: "d-5", categoryId: "desserts", name: "Nutella Banana Pancake", basePrice: 230, isVeg: true },
    { id: "d-6", categoryId: "desserts", name: "Helo to the Queen", basePrice: 250, isVeg: true },
    { id: "d-7", categoryId: "desserts", name: "Cafe Special Helo to the King", basePrice: 350, isVeg: true }
  ]
}
