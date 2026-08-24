import { PartyPlan, PartyFormInput } from '../types';

export const PARTY_TEMPLATES: {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  badge?: string;
  input: PartyFormInput;
}[] = [
  {
    id: 'tapas-sangria',
    name: 'Tapas & Sangria Soirée',
    emoji: '🍷',
    tagline: 'Casual elegant gathering with sangria pitchers, charcuterie, and warm tapas',
    badge: 'Most Popular',
    input: {
      title: 'Tapas & Sangria Sunset Soirée',
      theme: 'Spanish Bodega & Warm Sunset',
      eventType: 'cocktail',
      adults: 16,
      kids: 0,
      drinkers: 14,
      durationHours: 4,
      targetBudget: 260,
      venue: 'indoor-home',
      dietaryRestrictions: ['Vegetarian option', 'Gluten-Free crackers'],
      specialRequests: 'Create two big batch sangria recipes (red & sparkling white), artisanal cheese & cured meat board, patatas bravas sauce ingredients, warm lighting ambiance decor.'
    }
  },
  {
    id: 'backyard-bbq',
    name: 'Backyard Smokehouse BBQ',
    emoji: '🔥',
    tagline: 'Smoked pulled pork sliders, grilled chicken, craft beers, and lawn games',
    badge: 'Crowd Favorite',
    input: {
      title: 'Summer Smokehouse BBQ Bash',
      theme: 'Rustic Southern BBQ & Lawn Games',
      eventType: 'bbq',
      adults: 20,
      kids: 6,
      drinkers: 16,
      durationHours: 5,
      targetBudget: 420,
      venue: 'backyard',
      dietaryRestrictions: ['Dairy-Free', 'Nut-Free for kids'],
      specialRequests: 'Pulled pork brioche buns, grilled chicken sliders, watermelon wedges, mac & cheese, sweet tea dispenser, lemonades, craft beer 24-pack, heavy duty disposable plates and insect repellant.'
    }
  },
  {
    id: 'game-day',
    name: 'Ultimate Game Day Tailgate',
    emoji: '🏈',
    tagline: 'Loaded nacho bar, slow-cooker queso, crispy wings, and cold drinks',
    badge: 'Budget Friendly',
    input: {
      title: 'Championship Game Day Gathering',
      theme: 'Sports Bar & Tailgate Snack Stadium',
      eventType: 'gamenight',
      adults: 14,
      kids: 4,
      drinkers: 12,
      durationHours: 4,
      targetBudget: 210,
      venue: 'indoor-home',
      dietaryRestrictions: ['Vegetarian chili option'],
      specialRequests: 'Build-your-own nacho station with slow-cooker queso, crispy wings, veggies with ranch, pretzel bites, IPA beers, soda variety pack, team color napkins and cups.'
    }
  },
  {
    id: 'kids-birthday',
    name: 'Galaxy Explorers Kids Party',
    emoji: '🚀',
    tagline: 'Space themed cupcakes, 100% juice boxes, sheet pizza, and glow party favors',
    badge: 'Kid-Safe & Nut-Free',
    input: {
      title: 'Leo\'s 7th Galaxy Space Party',
      theme: 'Outer Space & Neon Stars',
      eventType: 'kids',
      adults: 10,
      kids: 14,
      drinkers: 6,
      durationHours: 3,
      targetBudget: 300,
      venue: 'indoor-home',
      dietaryRestrictions: ['Strictly Peanut-Free', 'Dairy-Free pizza for 2'],
      specialRequests: 'Space-themed cupcakes, juice pouches, sheet pizza, galaxy balloon garland, astronaut photo props, glow sticks, goodie bags, cosmic blue punch.'
    }
  },
  {
    id: 'cozy-dinner',
    name: 'Tuscan Candlelight Dinner',
    emoji: '🍝',
    tagline: 'Fresh tagliatelle, Chianti pairings, burrata starter, and tiramisu',
    badge: 'Gourmet Selection',
    input: {
      title: 'Tuscan Trattoria Dinner Party',
      theme: 'Rustic Italian Candlelit Table',
      eventType: 'dinner',
      adults: 8,
      kids: 0,
      drinkers: 8,
      durationHours: 4,
      targetBudget: 190,
      venue: 'indoor-home',
      dietaryRestrictions: ['1 Pescatarian'],
      specialRequests: 'Fresh tagliatelle with slow-simmered sauce, burrata & heirloom tomato starter, Chianti Classico, espresso & tiramisu components, taper candles, linen-style napkins.'
    }
  }
];

export const INITIAL_DEFAULT_PLAN: PartyPlan = {
  id: 'cymbal-plan-001',
  title: 'Tapas & Sangria Sunset Soirée',
  theme: 'Spanish Bodega & Warm Sunset',
  vibe: 'Relaxed, celebratory, warm acoustic music and candlelight',
  eventType: 'cocktail',
  guestCount: {
    adults: 16,
    kids: 0,
    total: 16,
    drinkers: 14,
    nonDrinkers: 2
  },
  durationHours: 4,
  targetBudget: 260,
  venue: 'indoor-home',
  eventDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
  dietaryRestrictions: ['Vegetarian options', 'Gluten-Free crackers'],
  createdAt: new Date().toISOString(),
  items: [
    {
      id: 'item-1',
      name: 'Cymbal Select Spanish Rioja Tempranillo (Sangria Base)',
      category: 'beverages',
      quantity: 4,
      unit: 'bottles (750ml)',
      estimatedCost: 32.00,
      originalCost: 44.00,
      store: 'Cymbal Spirits & Beverages',
      aisle: 'Aisle 14: Wine & Spirits',
      cymbalSku: 'CYM-WINE-701',
      brandTier: 'Cymbal Select',
      inStock: true,
      priority: 'must-have',
      purchased: false,
      notes: 'Fruity, rich dry red — perfect balance for fresh citrus sangria'
    },
    {
      id: 'item-2',
      name: 'Cymbal Select Triple Sec & Brandy Mixer Pack',
      category: 'beverages',
      quantity: 1,
      unit: 'bottle (375ml)',
      estimatedCost: 12.50,
      store: 'Cymbal Spirits & Beverages',
      aisle: 'Aisle 14: Wine & Spirits',
      cymbalSku: 'CYM-SPIR-302',
      brandTier: 'Cymbal Select',
      inStock: true,
      priority: 'recommended',
      purchased: false,
      notes: 'Essential aromatic kicker for authentic Spanish sangria'
    },
    {
      id: 'item-3',
      name: 'CymbalMart Organic Valencia Oranges, Lemons & Honeycrisp Apples',
      category: 'groceries',
      quantity: 1,
      unit: '5 lb variety bag',
      estimatedCost: 6.99,
      store: 'CymbalMart Supercenter',
      aisle: 'Aisle 1: Fresh Produce',
      cymbalSku: 'CYM-PROD-108',
      brandTier: 'Organic Fresh',
      inStock: true,
      priority: 'must-have',
      purchased: false,
      notes: 'Slice on wheels and cubes for sangria pitchers and platter garnish'
    },
    {
      id: 'item-4',
      name: 'Cymbal Select Sparkling Brut Cava (Welcome Toast)',
      category: 'beverages',
      quantity: 3,
      unit: 'bottles (750ml)',
      estimatedCost: 29.97,
      store: 'Cymbal Spirits & Beverages',
      aisle: 'Aisle 14: Wine & Spirits',
      cymbalSku: 'CYM-WINE-404',
      brandTier: 'Cymbal Select',
      inStock: true,
      priority: 'recommended',
      purchased: false,
      notes: 'Chilled bubbly toast as guests arrive'
    },
    {
      id: 'item-5',
      name: 'CymbalMart Citrus Sparkling Water & Club Soda (12-pack)',
      category: 'beverages',
      quantity: 2,
      unit: '12-packs (cans)',
      estimatedCost: 8.50,
      store: 'CymbalMart Supercenter',
      aisle: 'Aisle 8: Soft Drinks & Seltzers',
      cymbalSku: 'CYM-BEV-205',
      brandTier: 'Cymbal Select',
      inStock: true,
      priority: 'must-have',
      purchased: false,
      notes: 'Effervescent fizz for non-drinkers and sangria top-off'
    },
    {
      id: 'item-6',
      name: 'Cymbal Pure Party Ice (20 lb Bag)',
      category: 'essentials',
      quantity: 2,
      unit: 'bags (10 lbs each)',
      estimatedCost: 6.98,
      store: 'CymbalMart Supercenter',
      aisle: 'Aisle 16: Ice & Frozen Goods',
      cymbalSku: 'CYM-ICE-001',
      brandTier: 'Cymbal Select',
      inStock: true,
      priority: 'must-have',
      purchased: false,
      notes: '1 bag for ice buckets/glasses, 1 bag for chiller cooler'
    },
    {
      id: 'item-7',
      name: 'Cymbal Deli Spanish Tapas Cheese Trio (Manchego, Iberico, Goat)',
      category: 'groceries',
      quantity: 1.5,
      unit: 'lbs tray',
      estimatedCost: 22.50,
      originalCost: 32.00,
      store: 'CymbalMart Supercenter',
      aisle: 'Aisle 2: Deli & Charcuterie',
      cymbalSku: 'CYM-DELI-550',
      brandTier: 'Cymbal Select',
      inStock: true,
      priority: 'must-have',
      purchased: false,
      notes: 'Pre-portioned wedges ready to arrange on grazing boards'
    },
    {
      id: 'item-8',
      name: 'Cymbal Gourmet Jamón Serrano & Dry Cured Chorizo Sampler',
      category: 'groceries',
      quantity: 12,
      unit: 'oz platter pack',
      estimatedCost: 16.99,
      store: 'CymbalMart Supercenter',
      aisle: 'Aisle 2: Deli & Charcuterie',
      cymbalSku: 'CYM-DELI-552',
      brandTier: 'Cymbal Select',
      inStock: true,
      priority: 'must-have',
      purchased: false
    },
    {
      id: 'item-9',
      name: 'Cymbal Bakery Fresh Artisan Baguettes & Rustic Sourdough',
      category: 'bakery',
      quantity: 3,
      unit: 'loaves',
      estimatedCost: 9.99,
      store: 'CymbalMart Supercenter',
      aisle: 'Aisle 3: In-Store Bakery',
      cymbalSku: 'CYM-BAKE-112',
      brandTier: 'Cymbal Select',
      inStock: true,
      priority: 'must-have',
      purchased: false,
      notes: 'Baked fresh daily. Slice on bias and toast with garlic olive oil'
    },
    {
      id: 'item-10',
      name: 'Cymbal Organic Gluten-Free Seed Artisan Crackers',
      category: 'groceries',
      quantity: 2,
      unit: 'boxes',
      estimatedCost: 7.98,
      store: 'CymbalMart Supercenter',
      aisle: 'Aisle 5: Snacks & Crackers',
      cymbalSku: 'CYM-SNK-401',
      brandTier: 'Organic Fresh',
      inStock: true,
      priority: 'must-have',
      purchased: false,
      dietaryTags: ['Gluten-Free']
    },
    {
      id: 'item-11',
      name: 'Cymbal Deli Marinated Mediterranean Olive Blend',
      category: 'groceries',
      quantity: 16,
      unit: 'oz tub',
      estimatedCost: 6.50,
      store: 'CymbalMart Supercenter',
      aisle: 'Aisle 2: Deli & Charcuterie',
      cymbalSku: 'CYM-DELI-204',
      brandTier: 'Cymbal Select',
      inStock: true,
      priority: 'recommended',
      purchased: false
    },
    {
      id: 'item-12',
      name: 'Cymbal Fresh Yukon Gold Potatoes & Smoked Paprika (Patatas Bravas)',
      category: 'groceries',
      quantity: 1,
      unit: '5 lb bag + spice',
      estimatedCost: 6.49,
      store: 'CymbalMart Supercenter',
      aisle: 'Aisle 1: Fresh Produce',
      cymbalSku: 'CYM-PROD-315',
      brandTier: 'Cymbal Select',
      inStock: true,
      priority: 'recommended',
      purchased: false
    },
    {
      id: 'item-13',
      name: 'Cymbal Bakery Cinnamon Churro Bites with Chocolate Dip',
      category: 'bakery',
      quantity: 20,
      unit: 'pieces pack',
      estimatedCost: 14.50,
      store: 'CymbalMart Supercenter',
      aisle: 'Aisle 3: In-Store Bakery',
      cymbalSku: 'CYM-BAKE-901',
      brandTier: 'Cymbal Select',
      inStock: true,
      priority: 'recommended',
      purchased: false
    },
    {
      id: 'item-14',
      name: 'Cymbal Living Amber Glass Votive Candle Pack (8-count)',
      category: 'decor',
      quantity: 1,
      unit: '8-pack',
      estimatedCost: 9.99,
      store: 'CymbalMart Supercenter',
      aisle: 'Aisle 11: Home & Party Decor',
      cymbalSku: 'CYM-DECR-102',
      brandTier: 'Cymbal Select',
      inStock: true,
      priority: 'recommended',
      purchased: false,
      notes: 'Creates atmospheric golden hour candlelight'
    },
    {
      id: 'item-15',
      name: 'Cymbal Eco Palm Leaf Cocktail Plates & Bamboo Picks',
      category: 'tableware',
      quantity: 1,
      unit: '50-pack combo',
      estimatedCost: 13.99,
      store: 'CymbalMart Supercenter',
      aisle: 'Aisle 10: Paper & Tableware',
      cymbalSku: 'CYM-TABL-301',
      brandTier: 'Cymbal Select',
      inStock: true,
      priority: 'must-have',
      purchased: false,
      notes: 'Sturdy, leak-resistant, and 100% compostable'
    },
    {
      id: 'item-16',
      name: 'Cymbal Everyday Heavy 3-Ply Terracotta Cocktail Napkins',
      category: 'tableware',
      quantity: 1,
      unit: '100-pack',
      estimatedCost: 4.99,
      store: 'CymbalMart Supercenter',
      aisle: 'Aisle 10: Paper & Tableware',
      cymbalSku: 'CYM-TABL-105',
      brandTier: 'Cymbal Select',
      inStock: true,
      priority: 'must-have',
      purchased: false
    },
    {
      id: 'item-17',
      name: 'Cymbal Tough Flex Drawstring Trash & Recycling Bags',
      category: 'essentials',
      quantity: 1,
      unit: 'box (15 count)',
      estimatedCost: 5.49,
      store: 'CymbalMart Supercenter',
      aisle: 'Aisle 9: Household Essentials',
      cymbalSku: 'CYM-ESNT-040',
      brandTier: 'Cymbal Select',
      inStock: true,
      priority: 'must-have',
      purchased: false
    }
  ],
  drinkCalc: {
    totalDrinksNeeded: 70,
    alcoholicDrinks: 56,
    nonAlcoholicDrinks: 14,
    beerCasesEstimate: 1,
    wineBottlesEstimate: 7,
    liquorBottlesEstimate: 1,
    softDrinksLiters: 8,
    waterGallons: 3,
    icePoundsNeeded: 24,
    formulaNotes: '14 drinkers × 4 hrs (2 drinks hr 1 + 1/hr after = ~4-5 drinks/person) = ~56-60 alcoholic drinks. 2 non-drinkers + hydration = 14 non-alcoholic servings.'
  },
  foodCalc: {
    appetizerBitesPerPerson: 8,
    totalAppetizerPieces: 128,
    meatOzPerPerson: 4,
    sideServingsPerPerson: 3,
    dessertPortions: 16,
    foodVibeNotes: 'Substantial cocktail tapas spread with grazing charcuterie board, hot crispy potatoes, and crusty bread that replaces a formal sit-down dinner.'
  },
  signatureRecipes: [
    {
      name: 'Cymbal Classic Bodega Red Sangria (Serves 10-12)',
      servings: 10,
      prepTime: '15 mins + 2 hrs chill',
      type: 'cocktail',
      description: 'Bright, citrus-kissed Spanish sangria with Cymbal Select Tempranillo, brandy, and fresh macerated fruit.',
      ingredients: [
        { item: 'Cymbal Select Tempranillo Red Wine', amount: '2 bottles (750ml each)', notes: 'Aisle 14' },
        { item: 'Cymbal Brandy / Orange Liqueur', amount: '1/2 cup (4 oz)', notes: 'Aisle 14' },
        { item: 'Freshly squeezed orange juice', amount: '1 cup', notes: 'Aisle 1' },
        { item: 'Diced orange, green apple, & lemon wheels', amount: '2 cups', notes: 'Aisle 1' },
        { item: 'Cinnamon stick', amount: '2 sticks', notes: 'Aisle 4' },
        { item: 'Cymbal Citrus Sparkling Water (to top before serving)', amount: '1 cup', notes: 'Aisle 8' }
      ],
      instructions: [
        'In a large glass beverage dispenser, combine sliced fruit, brandy, and cinnamon sticks.',
        'Muddle gently with a wooden spoon to release citrus oils and juices.',
        'Pour in the 2 bottles of red wine and orange juice. Stir thoroughly.',
        'Refrigerate for at least 2 hours (or overnight) for flavors to develop.',
        'Right before guests arrive, stir in fresh ice and top with chilled citrus sparkling water.'
      ],
      costPerServing: 2.30
    },
    {
      name: 'Golden Patatas Bravas with Smoked Garlic Aioli',
      servings: 16,
      prepTime: '25 mins',
      type: 'appetizer',
      description: 'Crispy roasted Yukon gold potato cubes smothered in spicy smoked paprika bravas sauce and garlic aioli.',
      ingredients: [
        { item: 'Cymbal Yukon Gold potatoes, diced into 1-inch cubes', amount: '4 lbs', notes: 'Aisle 1' },
        { item: 'Extra virgin olive oil', amount: '4 tbsp', notes: 'Aisle 4' },
        { item: 'Smoked Spanish pimentón (paprika)', amount: '1.5 tbsp', notes: 'Aisle 4' },
        { item: 'Crushed tomatoes & tomato paste', amount: '1 cup', notes: 'Aisle 6' },
        { item: 'Minced garlic & sherry vinegar', amount: '4 cloves + 1 tbsp vinegar', notes: 'Aisle 1' },
        { item: 'Garlic aioli sauce', amount: '1/2 cup for topping', notes: 'Aisle 7' }
      ],
      instructions: [
        'Toss diced potatoes with olive oil, salt, and pepper. Roast at 425°F (220°C) for 35 mins until golden and crunchy.',
        'Simmer tomato paste, crushed tomatoes, garlic, smoked paprika, and sherry vinegar in a saucepan for 8 mins.',
        'Transfer crispy potatoes to a warm platter, spoon warm bravas sauce over top, and drizzle with garlic aioli.'
      ],
      costPerServing: 0.85
    }
  ],
  timeline: [
    { timeframe: '3 Days Before', action: 'Order items via CymbalMart Curbside Pickup or Delivery; buy non-perishables and tableware.', category: 'shopping' },
    { timeframe: '1 Day Before', action: 'Pick up fresh produce, bakery bread, and cheeses. Pre-batch sangria pitchers and refrigerate.', category: 'prep' },
    { timeframe: '3 Hours Before', action: 'Slice cheeses and cured meats; cover with damp paper towel and arrange boards.', category: 'prep' },
    { timeframe: '1 Hour Before', action: 'Set up drink station with ice bucket, glasses, and sangria dispenser. Light candles and turn on playlist.', category: 'setup' },
    { timeframe: 'Party Kickoff', action: 'Pop Cava for arriving guests, roast hot tapas, and enjoy hosting stress-free!', category: 'hosting' }
  ],
  shoppingTips: [
    'Choose Cymbal Select brand items for pantry staples, paper goods, and wines to save 25-35% vs name brands.',
    'Pre-batching signature sangria in a drink dispenser prevents long queues at a DIY bar and cuts liquor waste.',
    'Opt for CymbalMart Express Pickup (ready in 2 hours) so you don\'t waste party day walking store aisles.',
    'Pick up fresh ice bags the morning of the event so they stay loose and crystal clear.'
  ],
  budgetBreakdown: {
    groceries: 67.45,
    beverages: 82.97,
    bakery: 24.49,
    decor: 9.99,
    tableware: 18.98,
    entertainment: 0,
    essentials: 12.47
  },
  agentSummary: 'Your Tapas & Sangria party plan is curated for 16 guests with CymbalMart store inventory. Total estimated spend is $216.35, giving you a $43.65 budget buffer under your $260 target with full beverage formula, batch recipes, and aisle-sorted checklist.'
};
