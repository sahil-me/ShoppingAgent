export type PartyCategory = 
  | 'groceries'
  | 'beverages'
  | 'bakery'
  | 'decor'
  | 'tableware'
  | 'entertainment'
  | 'essentials';

export type StoreType =
  | 'CymbalMart Supercenter'
  | 'CymbalMart Express'
  | 'Cymbal Spirits & Beverages'
  | 'Supermarket / Grocery'
  | 'Wholesale Club (Costco/Sam\'s)'
  | 'Liquor Store'
  | 'Party Supply / Dollar Store'
  | 'Bakery'
  | 'Online / Amazon'
  | 'Specialty / Farmers Market';

export interface ShoppingItem {
  id: string;
  name: string;
  category: PartyCategory;
  quantity: number;
  unit: string;
  estimatedCost: number;
  originalCost?: number;
  store: StoreType;
  aisle?: string;
  cymbalSku?: string;
  inStock?: boolean;
  brandTier?: 'Cymbal Select' | 'Name Brand' | 'Organic Fresh' | 'Bulk Value';
  priority: 'must-have' | 'recommended' | 'nice-to-have';
  purchased: boolean;
  notes?: string;
  dietaryTags?: string[];
  suggestedAlternative?: string;
}

export interface BatchRecipe {
  name: string;
  servings: number;
  prepTime: string;
  description: string;
  type: 'cocktail' | 'mocktail' | 'appetizer' | 'main' | 'dessert' | 'side';
  ingredients: {
    item: string;
    amount: string;
    notes?: string;
  }[];
  instructions: string[];
  costPerServing?: number;
}

export interface TimelineEvent {
  timeframe: string; // e.g. "3 Days Before", "Morning of Party", "1 Hour Before", "During Party"
  action: string;
  category: 'shopping' | 'prep' | 'setup' | 'hosting';
  completed?: boolean;
}

export interface DrinkCalculation {
  totalDrinksNeeded: number;
  alcoholicDrinks: number;
  nonAlcoholicDrinks: number;
  beerCasesEstimate: number; // 24-packs or bottles
  wineBottlesEstimate: number; // 750ml bottles
  liquorBottlesEstimate: number; // 750ml bottles
  softDrinksLiters: number;
  waterGallons: number;
  icePoundsNeeded: number;
  formulaNotes: string;
}

export interface FoodCalculation {
  appetizerBitesPerPerson: number;
  totalAppetizerPieces: number;
  meatOzPerPerson: number;
  sideServingsPerPerson: number;
  dessertPortions: number;
  foodVibeNotes: string;
}

export interface PartyPlan {
  id: string;
  title: string;
  theme: string;
  vibe: string;
  eventType: 'cocktail' | 'dinner' | 'bbq' | 'birthday' | 'gamenight' | 'brunch' | 'kids' | 'custom';
  guestCount: {
    adults: number;
    kids: number;
    total: number;
    drinkers: number;
    nonDrinkers: number;
  };
  durationHours: number;
  targetBudget: number;
  venue: 'indoor-home' | 'backyard' | 'park' | 'rented-venue';
  eventDate?: string; // YYYY-MM-DD format
  dietaryRestrictions: string[];
  createdAt: string;
  items: ShoppingItem[];
  drinkCalc: DrinkCalculation;
  foodCalc: FoodCalculation;
  signatureRecipes: BatchRecipe[];
  timeline: TimelineEvent[];
  shoppingTips: string[];
  budgetBreakdown: {
    groceries: number;
    beverages: number;
    bakery: number;
    decor: number;
    tableware: number;
    entertainment: number;
    essentials: number;
  };
  agentSummary: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  suggestedAction?: {
    type: 'add_items' | 'remove_item' | 'update_budget' | 'apply_substitution' | 'align_budget' | 'none';
    payload?: any;
    label?: string;
    items?: any[];
  };
}

export interface PartyFormInput {
  title: string;
  theme: string;
  eventType: string;
  adults: number;
  kids: number;
  drinkers: number;
  durationHours: number;
  targetBudget: number;
  venue: string;
  eventDate?: string;
  dietaryRestrictions: string[];
  specialRequests: string;
}

export type FulfillmentMethod = 'pickup' | 'delivery' | 'in-store-route';

export interface CheckoutOrderDetails {
  orderId: string;
  fulfillmentMethod: FulfillmentMethod;
  storeLocation: string;
  slotTime: string;
  deliveryAddress?: string;
  substitutionPreference: 'best-match' | 'no-substitutions' | 'call-host';
  hostNotes?: string;
  subtotal: number;
  discountSavings: number;
  taxes: number;
  serviceFee: number;
  total: number;
  itemCount: number;
  createdAt: string;
  pointsEarned?: number;
  pointsRedeemed?: number;
  rewardTier?: string;
}

export interface UserPreferences {
  userId: string;
  userName: string;
  email?: string;
  preferredLanguage: string;
  preferredCurrency: string;
  dietaryRestrictions: string[];
  accessibility: {
    highContrast: boolean;
    largeFont: boolean;
    speechFeedback: boolean;
  };
  cookieConsent: {
    accepted: boolean;
    timestamp?: string;
  };
}

export interface SavedPlanSummary {
  id: string;
  title: string;
  theme: string;
  eventType: string;
  guestCount: number;
  targetBudget: number;
  totalCost: number;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
  planData: PartyPlan;
}
