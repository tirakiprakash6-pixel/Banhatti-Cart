import { Product, AppSettings } from '../types';

export const CATEGORIES = [
  '🛵 Just Order',
  '🥘 Break fast for morning',
  '🍔 snacks of evening',
  '🍦 favourite Ice cream',
  '🧁 Bakery items',
  '🛒 Grocery items'
] as const;

export const DEFAULT_SETTINGS: AppSettings = {
  storeName: 'Banhatti Cart',
  tagline: 'Your Personal Local Delivery Concierge in Banhatti',
  ownerPhone: '+917899342585',
  ownerWhatsApp: '917899342585',
  googleScriptUrl: 'https://script.google.com/macros/s/AKfycbyH0dSF7Eul9lmQZd_RdrQFGBdFbb2O_wiVF5n84Ez-lalxJItQRVn_TuPyi2sIQ8_1/exec',
  productsScriptUrl: 'https://script.google.com/macros/s/AKfycbzciBm0UN2XDSMOmsWKugzc7z7DKbSHW3dyD4sJkyo3v2Hz_3BUbY-bm0l130pD5I02Aw/exec',
  isStoreOpen: true,
  serviceNotice: '⚡ Instant Local Delivery across Banhatti & Rabkhandi. We buy fresh from local shops upon your order and deliver directly to you!',
  deliveryArea: 'Banhatti, Rabkhandi & nearby areas (Karnataka)',
  currencySymbol: '₹'
};

export const INITIAL_PRODUCTS: Product[] = [
  // ==========================================
  // 🥘 2nd Category: Break fast for morning
  // ==========================================
  {
    id: 'BF-01',
    category: '🥘 Break fast for morning',
    name: 'Crispy Butter Masala Dosa',
    description: 'Golden roasted crispy dosa stuffed with spiced potato palya, served with freshly grated coconut chutney and piping hot spiced sambar.',
    price: 60,
    offerPrice: 50,
    unit: '1 Plate (1 pc)',
    images: [
      'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1630383249896-424e482df921?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'BF-02',
    category: '🥘 Break fast for morning',
    name: 'Steamed Idli & Crispy Uddin Vada',
    description: '2 soft melt-in-mouth steamed idlis and 1 crunchy medu vada with fresh green chili coconut chutney & aromatic hotel sambar.',
    price: 45,
    offerPrice: 40,
    unit: '1 Plate (2 Idli + 1 Vada)',
    images: [
      'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'BF-03',
    category: '🥘 Break fast for morning',
    name: 'Morning Lemon Rice & Khara Pongal',
    description: 'Freshly tempered tangy lemon rice with crunchy peanuts, curry leaves, and hot ghee khara pongal served with spicy coconut chutney.',
    price: 50,
    offerPrice: 45,
    unit: '1 Portion',
    images: [
      'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'BF-04',
    category: '🥘 Break fast for morning',
    name: 'Puri Bhaji with Spiced Sagu',
    description: '3 golden fluffy fried puris served with mild spiced potato bhaji and traditional vegetable sagu.',
    price: 50,
    offerPrice: 45,
    unit: '1 Plate (3 Puris)',
    images: [
      'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'BF-05',
    category: '🥘 Break fast for morning',
    name: 'Banhatti Special Morning Girmit & Mirchi Bajji',
    description: 'Famous North Karnataka style puffed rice tossed in tangy onion-garlic masala, topped with fine sev, roasted peanuts & accompanied by 2 hot mirchi bajjis.',
    price: 40,
    offerPrice: 35,
    unit: '1 Portion + 2 Bajjis',
    images: [
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'BF-06',
    category: '🥘 Break fast for morning',
    name: 'Soft Sponge Set Dosa',
    description: '3 fluffy, spongy set dosas served with mixed vegetable saagu, red chili paste and rich coconut chutney.',
    price: 55,
    offerPrice: 45,
    unit: '1 Plate (3 Dosas)',
    images: [
      'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1630383249896-424e482df921?w=600&auto=format&fit=crop&q=80'
    ]
  },

  // ==========================================
  // 🍔 3rd Category: snacks of evening
  // ==========================================
  {
    id: 'SN-01',
    category: '🍔 snacks of evening',
    name: 'Street-Style Spicy Egg Rice',
    description: 'Wok-tossed aromatic rice with double scrambled eggs, crunchy onions, green chilies, curry leaves, and spicy red masala.',
    price: 70,
    offerPrice: 60,
    unit: '1 Full Plate',
    images: [
      'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'SN-02',
    category: '🍔 snacks of evening',
    name: 'Crispy Gobi Manchurian (Dry / Semi-Gravy)',
    description: 'Crispy deep-fried cauliflower florets tossed in tangy garlic-ginger soy chili sauce with fresh capsicum and spring onions.',
    price: 80,
    offerPrice: 70,
    unit: '1 Full Plate',
    images: [
      'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'SN-03',
    category: '🍔 snacks of evening',
    name: 'Hot Mumbai Vada Pav (2 Pcs)',
    description: 'Spicy potato batata vada stuffed inside toasted soft pav with dry garlic coconut chutney and fried green salted chilies.',
    price: 45,
    offerPrice: 40,
    unit: '2 Pieces',
    images: [
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'SN-04',
    category: '🍔 snacks of evening',
    name: 'Hot Pav Bhaji with Amul Butter',
    description: 'Thick spicy mashed vegetable gravy served with 2 buttery toasted soft pavs, diced onions and juicy lemon.',
    price: 80,
    offerPrice: 70,
    unit: '1 Plate (2 Pavs)',
    images: [
      'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'SN-05',
    category: '🍔 snacks of evening',
    name: 'Cheesy Veg Margherita Pizza (7 inch)',
    description: 'Freshly baked 7-inch thin crust pizza topped with rich Italian herb tomato sauce, melted mozzarella cheese, capsicum and sweet corn.',
    price: 130,
    offerPrice: 110,
    unit: '1 Pizza (7 inch)',
    images: [
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'SN-06',
    category: '🍔 snacks of evening',
    name: 'Spicy Mirchi Bajji Platter',
    description: 'Fresh green banana chilies dipped in spiced gram flour batter, deep fried crispy and served with chopped onions and lemon wedges.',
    price: 35,
    offerPrice: 30,
    unit: '4 Pieces',
    images: [
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80'
    ]
  },

  // ==========================================
  // 🍦 4th Category: favourite Ice cream
  // ==========================================
  {
    id: 'IC-01',
    category: '🍦 favourite Ice cream',
    name: 'Classic Vanilla & Chocolate Cup Ice-Cream',
    description: 'Creamy twin-flavor cup ice cream with rich bourbon vanilla and dark cocoa swirls. Chilled from trusted dairy parlour.',
    price: 35,
    offerPrice: 30,
    unit: '1 Cup (100ml)',
    images: [
      'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1560008511-11c63416e52d?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'IC-02',
    category: '🍦 favourite Ice cream',
    name: 'Kesar Pista Matka Kulfi',
    description: 'Rich, dense, traditional slow-cooked rabri kulfi infused with Kashmiri saffron strands, chopped pistachios and almonds in clay pot.',
    price: 60,
    offerPrice: 50,
    unit: '1 Clay Pot (100ml)',
    images: [
      'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1560008511-11c63416e52d?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'IC-03',
    category: '🍦 favourite Ice cream',
    name: 'Butterscotch Crunch Cone Ice Cream',
    description: 'Crispy baked chocolate-lined waffle cone packed with caramelized butterscotch ice cream, cashew praline and chocolate crown.',
    price: 50,
    offerPrice: 45,
    unit: '1 Waffle Cone',
    images: [
      'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1560008511-11c63416e52d?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'IC-04',
    category: '🍦 favourite Ice cream',
    name: 'Special Royal Rose Faluda',
    description: 'Chilled rich milk dessert layered with rose syrup, soaked sabja seeds, silky vermicelli, topped with ice cream scoop & dry fruits.',
    price: 90,
    offerPrice: 80,
    unit: '1 Tall Glass',
    images: [
      'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1560008511-11c63416e52d?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'IC-05',
    category: '🍦 favourite Ice cream',
    name: 'Royal Gadbad (Gudbad) Ice Cream Sundae',
    description: 'Legendary coastal Karnataka layered sundae with vanilla, strawberry, and mango ice cream scoops, dry fruits, tutti frutti and jelly.',
    price: 110,
    offerPrice: 95,
    unit: '1 Tall Cup',
    images: [
      'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1560008511-11c63416e52d?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'IC-06',
    category: '🍦 favourite Ice cream',
    name: 'Chilled Cool Drinks & Cold Badam Milk',
    description: 'Ice-chilled cold drinks (Thums Up 750ml, Sprite, or rich creamy Kesar Badam Milk). Specify your preference during order.',
    price: 45,
    offerPrice: 40,
    unit: '1 Bottle / Pack',
    images: [
      'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=600&auto=format&fit=crop&q=80'
    ]
  },

  // ==========================================
  // 🧁 5th Category: Bakery items
  // ==========================================
  {
    id: 'BK-01',
    category: '🧁 Bakery items',
    name: 'Chocolate & Vanilla Cup Cake (Pack of 2)',
    description: 'Soft, moist bakery cupcakes topped with whipped buttercream swirls and colorful sprinkles.',
    price: 50,
    offerPrice: 40,
    unit: 'Pack of 2',
    images: [
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'BK-02',
    category: '🧁 Bakery items',
    name: 'Fresh Black Forest Cold Pastry Cake',
    description: 'Layered chilled chocolate sponge cake with whipped dairy cream, sour cherries, and shaved dark chocolate curls.',
    price: 70,
    offerPrice: 60,
    unit: '1 Pastry Slice',
    images: [
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'BK-03',
    category: '🧁 Bakery items',
    name: 'Traditional Iyengar Honey Cake',
    description: 'Classic bakery sponge cake drenched in sweet honey syrup, topped with mixed fruit jam layer and desiccated dry coconut flakes.',
    price: 45,
    offerPrice: 35,
    unit: '2 Slices',
    images: [
      'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'BK-04',
    category: '🧁 Bakery items',
    name: 'Crispy Veg Puff (Weg Pups - 2 Pcs)',
    description: 'Hot multi-layered flaky golden puff pastry filled with spiced potato, green peas and onion masala.',
    price: 35,
    offerPrice: 30,
    unit: '2 Pieces',
    images: [
      'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'BK-05',
    category: '🧁 Bakery items',
    name: 'Spicy Baked Egg Puff (Egg Pups - 2 Pcs)',
    description: 'Crisp layered baked puff filled with seasoned hard-boiled egg half and rich onion-tomato masala.',
    price: 45,
    offerPrice: 40,
    unit: '2 Pieces',
    images: [
      'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'BK-06',
    category: '🧁 Bakery items',
    name: 'Freshly Baked Milk Bread & Sweet Bun',
    description: 'Extra soft daily morning fresh milk sandwich bread loaf (400g) plus 2 fluffy sweet cream buns.',
    price: 60,
    offerPrice: 50,
    unit: '1 Loaf + 2 Buns',
    images: [
      'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'BK-07',
    category: '🧁 Bakery items',
    name: 'Crispy Butter Khari (Kare) & Elaichi Toast (Rusk)',
    description: 'Freshly baked flaky butter khari puffs (300g) and crunchy cardamom tea rusk toasts (300g) from Banhatti bakery.',
    price: 70,
    offerPrice: 60,
    unit: 'Combo Pack (600g)',
    images: [
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=600&auto=format&fit=crop&q=80'
    ]
  },

  // ==========================================
  // 🛒 6th Category: Grocery items
  // ==========================================
  {
    id: 'GR-01',
    category: '🛒 Grocery items',
    name: 'Premium Aged Sona Masoori Rice (5 Kg)',
    description: 'Aged, clean, aromatic and polished pure Sona Masoori rice sourced directly from trusted Banhatti grain merchants.',
    price: 320,
    offerPrice: 285,
    unit: '5 Kg Bag',
    images: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'GR-02',
    category: '🛒 Grocery items',
    name: 'Pure Crystal White Sugar (1 Kg)',
    description: 'Refined sulphur-free sparkling white crystal sugar for tea, coffee, sweets, and daily kitchen cooking.',
    price: 48,
    offerPrice: 44,
    unit: '1 Kg Packet',
    images: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'GR-03',
    category: '🛒 Grocery items',
    name: 'Brooke Bond Red Label Tea Powder (500g)',
    description: 'Strong, aromatic black tea granules blended with natural flavours for refreshing morning and evening tea.',
    price: 260,
    offerPrice: 240,
    unit: '500g Box',
    images: [
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'GR-04',
    category: '🛒 Grocery items',
    name: 'Everest Garam Masala & Turmeric Powder Combo',
    description: 'Pure authentic ground spices: 100g Everest Garam Masala plus 100g Agmark pure Haldi Turmeric Powder.',
    price: 95,
    offerPrice: 85,
    unit: 'Combo Pack (200g)',
    images: [
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'GR-05',
    category: '🛒 Grocery items',
    name: 'Unpolished High-Protein Toor Dal (1 Kg)',
    description: 'Farm-fresh unpolished high-protein toor dal / arhar dal for daily sambar, dal tadka and rasam preparation.',
    price: 175,
    offerPrice: 155,
    unit: '1 Kg Pouch',
    images: [
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'GR-06',
    category: '🛒 Grocery items',
    name: 'Pure Filtered Cooking Oil (1 Litre)',
    description: 'Refined sunflower/groundnut cooking oil, fortified with Vitamin A & D, ideal for daily deep fry and curries.',
    price: 160,
    offerPrice: 145,
    unit: '1 Litre Pouch',
    images: [
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?w=600&auto=format&fit=crop&q=80'
    ]
  }
];

export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * =========================================================================
 * BANHATTI CART - GOOGLE APPS SCRIPT BACKEND (Code.gs)
 * =========================================================================
 * 
 * INSTRUCTIONS:
 * 1. Open Google Sheets (create a new spreadsheet named "Banhatti Cart Database").
 * 2. Create 3 tabs (sheets): "Products", "Orders", and "Settings".
 * 3. Go to Extensions -> Apps Script.
 * 4. Replace all code in Code.gs with this script.
 * 5. Click "Deploy" -> "New deployment".
 * 6. Select type "Web app".
 * 7. Set:
 *    - Description: "Banhatti Cart API"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone" (Crucial for web requests without Google login)
 * 8. Click "Deploy", authorize permissions, and copy the Web App URL!
 * 9. Paste the URL into the Banhatti Cart website settings.
 */

// Handle GET requests (Read Products, Settings, or Orders)
function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : 'getProducts';
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  try {
    if (action === 'getProducts') {
      var sheet = getOrCreateSheet(ss, 'Products', getProductsHeaders());
      var data = sheet.getDataRange().getValues();
      var headers = data[0];
      var products = [];
      
      for (var i = 1; i < data.length; i++) {
        var row = data[i];
        if (!row[0] && !row[2]) continue; // Skip empty rows
        
        var images = [];
        // Col indices: Image 1 (6), Image 2 (7), Image 3 (8), Image 4 (9)
        for (var col = 6; col <= 9; col++) {
          if (row[col] && String(row[col]).trim() !== '') {
            images.push(String(row[col]).trim());
          }
        }
        
        products.push({
          id: String(row[0] || ('P-' + i)),
          category: String(row[1] || '🛵 Just Order'),
          name: String(row[2] || ''),
          description: String(row[3] || ''),
          price: Number(row[4]) || 0,
          offerPrice: row[5] ? Number(row[5]) : undefined,
          images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1542838132-92c53300491e?w=600'],
          unit: String(row[10] || '1 pc'),
          isAvailable: row[11] !== false && String(row[11]).toLowerCase() !== 'no' && String(row[11]).toLowerCase() !== 'false'
        });
      }
      
      return createJsonResponse({ status: 'success', products: products });
    }
    
    if (action === 'getSettings') {
      var setSheet = getOrCreateSheet(ss, 'Settings', ['Key', 'Value', 'Description']);
      var setData = setSheet.getDataRange().getValues();
      var settings = {};
      for (var s = 1; s < setData.length; s++) {
        if (setData[s][0]) {
          settings[String(setData[s][0]).trim()] = setData[s][1];
        }
      }
      return createJsonResponse({ status: 'success', settings: settings });
    }

    if (action === 'ping') {
      return createJsonResponse({ status: 'success', message: 'Banhatti Cart API is active!' });
    }

    return createJsonResponse({ status: 'error', message: 'Unknown action: ' + action });
  } catch (err) {
    return createJsonResponse({ status: 'error', message: err.toString() });
  }
}

// Handle POST requests (Create Order)
function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var lock = LockService.getScriptLock();
  
  try {
    lock.waitLock(10000);
    var body = {};
    if (e && e.postData && e.postData.contents) {
      body = JSON.parse(e.postData.contents);
    } else if (e && e.parameter) {
      body = e.parameter;
    }
    
    var orderSheet = getOrCreateSheet(ss, 'Orders', getOrdersHeaders());
    
    var now = new Date();
    var dateStr = body.date || Utilities.formatDate(now, 'Asia/Kolkata', 'yyyy-MM-dd');
    var timeStr = body.time || Utilities.formatDate(now, 'Asia/Kolkata', 'hh:mm:ss a');
    
    var newRow = [
      body.orderId || ('BC-' + Math.floor(1000 + Math.random() * 9000)),
      body.orderType || 'PRODUCT_ORDER',
      body.customerName || 'Local Customer',
      body.phone || '',
      body.request || '',
      body.productsSummary || '',
      body.subtotal || 0,
      body.customerLocation || '',
      body.googleMapsLink || '',
      dateStr,
      timeStr,
      body.status || 'NEW_ORDER'
    ];
    
    orderSheet.appendRow(newRow);
    
    return createJsonResponse({
      status: 'success',
      message: 'Order saved successfully in Google Sheets!',
      orderId: newRow[0]
    });
  } catch (err) {
    return createJsonResponse({ status: 'error', message: err.toString() });
  } finally {
    lock.releaseLock();
  }
}

// Helper: Ensure sheets exist with correct column headers
function getOrCreateSheet(ss, name, defaultHeaders) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(defaultHeaders);
    sheet.getRange(1, 1, 1, defaultHeaders.length).setFontWeight('bold').setBackground('#E2E8F0');
  }
  return sheet;
}

function getProductsHeaders() {
  return [
    'ID',
    'Category',
    'Name',
    'Description',
    'Price',
    'Offer Price',
    'Image 1',
    'Image 2',
    'Image 3',
    'Image 4',
    'Unit',
    'Is Available'
  ];
}

function getOrdersHeaders() {
  return [
    'Order ID',
    'Order Type',
    'Customer Name',
    'Phone',
    'Request',
    'Products',
    'Subtotal',
    'Customer Location',
    'Google Maps Link',
    'Date',
    'Time',
    'Status'
  ];
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
`;
