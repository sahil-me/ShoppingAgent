import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent header
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === "" || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

function cleanAndParseJSON(rawText: string): any {
  if (!rawText) return {};
  try {
    return JSON.parse(rawText);
  } catch (e) {
    // Try extracting JSON from markdown code block
    const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (jsonMatch && jsonMatch[1]) {
      try {
        return JSON.parse(jsonMatch[1]);
      } catch (err) {
        // continue
      }
    }
    // Try finding first { and last }
    const firstBrace = rawText.indexOf('{');
    const lastBrace = rawText.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      try {
        return JSON.parse(rawText.substring(firstBrace, lastBrace + 1));
      } catch (err) {
        // continue
      }
    }
    throw new Error("Could not parse AI response as JSON");
  }
}

// Fallback logic for Chat Agent
function generateChatFallback(message: string, currentPlan: any) {
  const query = (message || "").toLowerCase();
  const guests = currentPlan?.guestCount?.total || 14;
  const adults = currentPlan?.guestCount?.adults || 12;
  const kids = currentPlan?.guestCount?.kids || 2;
  const drinkers = currentPlan?.guestCount?.drinkers || 10;
  const budget = currentPlan?.targetBudget || 250;

  // 1. Budget cut / cost reduction
  if (query.includes('budget') || query.includes('cut') || query.includes('save') || query.includes('cheap') || query.includes('reduce') || query.includes('$40') || query.includes('cost')) {
    return {
      text: `💡 **Smart Budget Reduction Plan (~$42 Total Estimated Savings)**\n\nHere is how to trim costs for **${currentPlan?.title || 'your party'}** without sacrificing guest satisfaction:\n\n1. **Switch Tableware & Paper Goods to Dollar / Party Supply Store**: Swap name-brand grocery plates & cups for bulk party packs (Saves ~$14.00).\n2. **Batch Signature Cocktails Instead of Open Bar**: Making a signature punch or pitcher drink uses 40% less liquor and mixers than individual cocktails (Saves ~$18.00).\n3. **Bulk Ice & Citrus from Wholesale Club**: Buying ice (20 lb bag) and a 5 lb mesh bag of limes at a club store cuts costs by half (Saves ~$10.00).\n\nWould you like me to substitute these cost-saving items in your shopping list?`,
      suggestedAction: {
        type: "add_items",
        label: "Apply $42 Budget-Saving Swaps",
        items: [
          {
            name: "Bulk Party Tableware Combo Pack",
            category: "tableware",
            quantity: 1,
            unit: "50-pack",
            estimatedCost: 9.99,
            store: "Party Supply / Dollar Store",
            priority: "must-have",
            notes: "Replaces individual supermarket plates and cutlery sets (saves $14)"
          },
          {
            name: "Wholesale Club 20lb Ice Bag",
            category: "essentials",
            quantity: 1,
            unit: "20 lb bag",
            estimatedCost: 3.49,
            store: "Wholesale Club (Costco/Sam's)",
            priority: "must-have",
            notes: "Half the cost of buying multiple 7lb bags at gas stations"
          }
        ]
      }
    };
  }

  // 2. Mocktail / signature drink
  if (query.includes('mocktail') || query.includes('drink') || query.includes('cocktail') || query.includes('bar') || query.includes('punch') || query.includes('beverage')) {
    return {
      text: `🍹 **Sparkling Rosemary Berry Mocktail & Batch Punch Formula**\n\nFor **${guests} guests** (${drinkers} drinkers, ${guests - drinkers} non-drinkers):\n\n• **Ingredients needed:**\n  - 3 bottles (2L) Cranberry-Pomegranate Juice\n  - 4 bottles (1L) San Pellegrino or Club Soda\n  - Fresh rosemary sprigs (garnish & aroma)\n  - Fresh lime wheels (4 limes)\n  - 1 bottle Simple Syrup or Agave Nectar\n\n• **Batch Method:** Mix juice, citrus, and syrup in a large beverage dispenser over a block of ice. Top with sparkling soda right before guests arrive so it stays effervescent!`,
      suggestedAction: {
        type: "add_items",
        label: "Add Signature Mocktail Supplies to List",
        items: [
          {
            name: "Cranberry-Pomegranate Juice (100% Juice)",
            category: "beverages",
            quantity: 3,
            unit: "64 oz bottles",
            estimatedCost: 11.50,
            store: "Supermarket / Grocery",
            priority: "must-have",
            notes: "Base for big-batch signature mocktail punch"
          },
          {
            name: "Sparkling Club Soda / Mineral Water",
            category: "beverages",
            quantity: 4,
            unit: "1L bottles",
            estimatedCost: 6.00,
            store: "Supermarket / Grocery",
            priority: "must-have",
            notes: "Bubbles for mocktails and highballs"
          },
          {
            name: "Fresh Rosemary & Limes Garnish Pack",
            category: "groceries",
            quantity: 1,
            unit: "pack",
            estimatedCost: 4.50,
            store: "Supermarket / Grocery",
            priority: "recommended",
            notes: "For aromatic cocktail & mocktail visual presentation"
          }
        ]
      }
    };
  }

  // 3. Kid snacks or finger foods
  if (query.includes('kid') || query.includes('child') || query.includes('finger food') || query.includes('appetizer') || query.includes('snack')) {
    return {
      text: `🥪 **Kid-Friendly Snacks & Finger Food Expansion**\n\nFor ${kids > 0 ? kids : 4} younger guests, quick no-mess finger foods keep the party running smoothly without cooking delays:\n\n• **Organic Juice Boxes & Pouches**: 100% fruit juice (easy grab-and-go)\n• **Cheddar Cheese Sticks & Pretzel Twists**: Crowd-pleasing, nut-free, easy to replenish\n• **Mini Slider Buns & Fruit Kabobs**: Fun bite-sized portions`,
      suggestedAction: {
        type: "add_items",
        label: "Add Kid Snacks & Juice Boxes",
        items: [
          {
            name: "100% Apple Juice Boxes (10-pack)",
            category: "beverages",
            quantity: 1,
            unit: "10-pack",
            estimatedCost: 4.29,
            store: "Supermarket / Grocery",
            priority: "must-have",
            notes: "Kid-safe individual hydration"
          },
          {
            name: "Individually Wrapped String Cheese",
            category: "groceries",
            quantity: 1,
            unit: "12-pack",
            estimatedCost: 4.99,
            store: "Supermarket / Grocery",
            priority: "recommended",
            notes: "Nut-free protein snack for children"
          },
          {
            name: "Mini Salted Pretzel Twists Tub",
            category: "groceries",
            quantity: 1,
            unit: "28 oz tub",
            estimatedCost: 5.50,
            store: "Wholesale Club (Costco/Sam's)",
            priority: "must-have",
            notes: "Peanut-free, dairy-free crunch snack"
          }
        ]
      }
    };
  }

  // 4. Allergens & dietary check
  if (query.includes('allergy') || query.includes('allergen') || query.includes('gluten') || query.includes('nut') || query.includes('vegan') || query.includes('dairy')) {
    return {
      text: `🛡️ **Dietary & Allergen Audit**\n\nHere is an audit of your current shopping plan for common sensitivities:\n\n• **Nut-Free Safety**: Verify that all bakery baked goods and chips are manufactured in a dedicated nut-free facility.\n• **Gluten-Free Balance**: Ensure corn tortilla chips and rice crackers are available as gluten-free carriers for dips and cheeses.\n• **Clear Labeling**: Use mini chalkboard tags or index cards next to platters to label *GF*, *V*, and *DF* dishes.\n\nWould you like me to add dedicated gluten-free and allergen-safe snack packs to your shopping list?`,
      suggestedAction: {
        type: "add_items",
        label: "Add Certified Gluten-Free / Vegan Snacks",
        items: [
          {
            name: "Certified Gluten-Free Multigrain Crackers",
            category: "groceries",
            quantity: 2,
            unit: "boxes",
            estimatedCost: 7.50,
            store: "Supermarket / Grocery",
            priority: "must-have",
            notes: "Gluten-free carrier for dips and cheeses"
          },
          {
            name: "Fresh Guacamole & Salsa Platter Tub",
            category: "groceries",
            quantity: 1,
            unit: "32 oz tub",
            estimatedCost: 8.99,
            store: "Wholesale Club (Costco/Sam's)",
            priority: "must-have",
            notes: "Naturally vegan, gluten-free, nut-free, dairy-free"
          }
        ]
      }
    };
  }

  // 5. Store comparison / Costco vs Grocery
  if (query.includes('costco') || query.includes('store') || query.includes('grocery') || query.includes('wholesale') || query.includes('sam')) {
    return {
      text: `🛒 **Store Split Optimization: Costco/Club vs Supermarket**\n\n• **Buy at Wholesale Club (Costco/Sam's)**:\n  - Large beverage cases (beer, sparkling seltzer, sodas)\n  - Bulk meats / burger patties & chicken wings\n  - Big tubs of dips (hummus, guacamole, salsa)\n  - Heavy items like 20 lb ice bags\n\n• **Buy at Local Supermarket**:\n  - Fresh herbs (mint, rosemary, basil) and specialty limes\n  - Artisan bakery buns & custom cakes\n  - Niche condiments and unique cheeses\n\n• **Buy at Party / Dollar Store**:\n  - Balloons, streamer decor, paper napkins, toothpicks & ice tongs`,
      suggestedAction: {
        type: "none"
      }
    };
  }

  // Default helpful response
  return {
    text: `✨ **Party Planning Recommendation for ${currentPlan?.title || 'your party'}**\n\nWith **${guests} guests** and a **$${budget} budget**, your event pacing is on track! \n\n• **Portion check**: Planning ~${Math.round(guests * 7)} appetizer bites and ${Math.round(drinkers * 4)} total beverages covers a 3-4 hour event.\n• **Ice rule**: Always reserve at least 1.5 lbs of ice per guest (${Math.round(guests * 1.5)} lbs total) to keep beer cold in coolers and ice pure in glasses.\n\nFeel free to ask me to adjust recipes, recalculate for new guest counts, or suggest new food themes!`,
    suggestedAction: {
      type: "none"
    }
  };
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Party Planning Generation Endpoint
app.post("/api/plan-party", async (req, res) => {
  try {
    const ai = getGeminiClient();
    const {
      title = "Backyard Party & Gathering",
      theme = "Casual & Festive",
      eventType = "bbq",
      adults = 12,
      kids = 2,
      drinkers = 10,
      durationHours = 4,
      targetBudget = 250,
      venue = "backyard",
      dietaryRestrictions = [],
      specialRequests = ""
    } = req.body;

    const totalGuests = Number(adults) + Number(kids);
    const nonDrinkers = Math.max(0, totalGuests - Number(drinkers));

    let parsed: any = null;

    if (ai) {
      try {
        const prompt = `You are the world's most capable Party Planner & Shopping Agent. Generate an exhaustive, realistic, and budget-optimized shopping list and party plan.

PARTY DETAILS:
- Title/Occasion: ${title || "Celebration Party"}
- Theme & Vibe: ${theme || "Festive & Fun"}
- Event Type: ${eventType} (e.g., cocktail, dinner, bbq, birthday, gamenight, brunch, kids)
- Guests: ${totalGuests} total (${adults} adults, ${kids} kids)
- Drinkers vs Non-drinkers: ${drinkers} alcohol drinkers, ${nonDrinkers} non-drinkers
- Duration: ${durationHours} hours
- Target Budget: $${targetBudget}
- Venue: ${venue}
- Dietary Restrictions: ${dietaryRestrictions.length > 0 ? dietaryRestrictions.join(", ") : "None specified"}
- Special Requests & Vibe Notes: ${specialRequests || "None"}

FORMULAS & LOGIC TO APPLY:
1. Beverage Calculations:
   - Standard party rate: ~2 drinks per guest in the first hour, ~1 drink per hour after.
   - For ${drinkers} drinkers over ${durationHours} hours: ~${drinkers * (1 + durationHours)} drinks. Allocate realistically across beer (12oz = 1 drink), wine (750ml bottle = 5 glasses), and spirits (750ml = 16 standard 1.5oz shots/cocktails).
   - Non-alcoholic & hydration: Soft drinks, sparkling water, mocktail batch, and water (1.5 cups per person per hour).
   - Ice formula: ~1.5 lbs of ice per person (for chilling cans and ice in drinks).
2. Food Calculations:
   - Cocktail/Finger food: 6-8 appetizer pieces/person for 2-3 hours; 10-12 pieces if replacing dinner.
   - Meal/Dinner/BBQ: 6-8 oz protein per adult, 4 oz per kid; 2-3 substantial sides; 1-2 dessert portions.
3. Realistic Pricing & Categories:
   - Categories MUST be one of: "groceries", "beverages", "bakery", "decor", "tableware", "entertainment", "essentials"
   - Stores MUST be one of: "Supermarket / Grocery", "Wholesale Club (Costco/Sam's)", "Liquor Store", "Party Supply / Dollar Store", "Bakery", "Online / Amazon", "Specialty / Farmers Market"
   - Priority MUST be: "must-have", "recommended", or "nice-to-have"
   - Target Total Estimated Cost of all items should be close to or under $${targetBudget}.
4. Provide 2 Signature Big-Batch Recipes (e.g. 1 batch drink/punch/cocktail/mocktail and 1 crowd-pleaser appetizer/main) scaled specifically for ${totalGuests} guests with step-by-step instructions.
5. Provide a realistic preparation & shopping timeline from 3 days out to party kick-off.
6. Provide actionable insider money-saving shopping tips.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.7-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                theme: { type: Type.STRING },
                vibe: { type: Type.STRING },
                eventType: { type: Type.STRING },
                drinkCalc: {
                  type: Type.OBJECT,
                  properties: {
                    totalDrinksNeeded: { type: Type.INTEGER },
                    alcoholicDrinks: { type: Type.INTEGER },
                    nonAlcoholicDrinks: { type: Type.INTEGER },
                    beerCasesEstimate: { type: Type.NUMBER },
                    wineBottlesEstimate: { type: Type.INTEGER },
                    liquorBottlesEstimate: { type: Type.INTEGER },
                    softDrinksLiters: { type: Type.NUMBER },
                    waterGallons: { type: Type.NUMBER },
                    icePoundsNeeded: { type: Type.NUMBER },
                    formulaNotes: { type: Type.STRING }
                  },
                  required: ["totalDrinksNeeded", "alcoholicDrinks", "nonAlcoholicDrinks", "icePoundsNeeded", "formulaNotes"]
                },
                foodCalc: {
                  type: Type.OBJECT,
                  properties: {
                    appetizerBitesPerPerson: { type: Type.INTEGER },
                    totalAppetizerPieces: { type: Type.INTEGER },
                    meatOzPerPerson: { type: Type.INTEGER },
                    sideServingsPerPerson: { type: Type.INTEGER },
                    dessertPortions: { type: Type.INTEGER },
                    foodVibeNotes: { type: Type.STRING }
                  },
                  required: ["appetizerBitesPerPerson", "totalAppetizerPieces", "foodVibeNotes"]
                },
                items: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      name: { type: Type.STRING },
                      category: { type: Type.STRING },
                      quantity: { type: Type.NUMBER },
                      unit: { type: Type.STRING },
                      estimatedCost: { type: Type.NUMBER },
                      store: { type: Type.STRING },
                      priority: { type: Type.STRING },
                      purchased: { type: Type.BOOLEAN },
                      notes: { type: Type.STRING },
                      dietaryTags: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                      },
                      suggestedAlternative: { type: Type.STRING }
                    },
                    required: ["name", "category", "quantity", "unit", "estimatedCost", "store", "priority"]
                  }
                },
                signatureRecipes: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      servings: { type: Type.INTEGER },
                      prepTime: { type: Type.STRING },
                      type: { type: Type.STRING },
                      description: { type: Type.STRING },
                      ingredients: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            item: { type: Type.STRING },
                            amount: { type: Type.STRING },
                            notes: { type: Type.STRING }
                          },
                          required: ["item", "amount"]
                        }
                      },
                      instructions: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                      },
                      costPerServing: { type: Type.NUMBER }
                    },
                    required: ["name", "servings", "prepTime", "type", "description", "ingredients", "instructions"]
                  }
                },
                timeline: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      timeframe: { type: Type.STRING },
                      action: { type: Type.STRING },
                      category: { type: Type.STRING }
                    },
                    required: ["timeframe", "action", "category"]
                  }
                },
                shoppingTips: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                agentSummary: { type: Type.STRING }
              },
              required: ["title", "theme", "vibe", "drinkCalc", "foodCalc", "items", "signatureRecipes", "timeline", "shoppingTips", "agentSummary"]
            }
          }
        });

        parsed = cleanAndParseJSON(response.text || "{}");
      } catch (genErr) {
        console.warn("Gemini generation failed, using intelligent math fallback:", genErr);
      }
    }

    // Fallback if AI not present or failed
    if (!parsed || !Array.isArray(parsed.items) || parsed.items.length === 0) {
      const drinksPerDrinker = drinkers * (1 + durationHours);
      const totalDrinks = Math.round(drinksPerDrinker + (nonDrinkers * durationHours * 1.5));
      const beerCases = Math.max(1, Math.round((drinksPerDrinker * 0.45) / 24 * 10) / 10);
      const wineBottles = Math.max(2, Math.round((drinksPerDrinker * 0.35) / 5));
      const liquorBottles = Math.max(1, Math.round((drinksPerDrinker * 0.20) / 16));
      const iceLbs = Math.round(totalGuests * 1.5);

      parsed = {
        title: title || "Summer Party & Celebration",
        theme: theme || "Festive & Vibrant",
        vibe: "Warm, energetic, and memorable",
        eventType,
        drinkCalc: {
          totalDrinksNeeded: totalDrinks,
          alcoholicDrinks: Math.round(drinksPerDrinker),
          nonAlcoholicDrinks: Math.round(nonDrinkers * durationHours * 1.5),
          beerCasesEstimate: beerCases,
          wineBottlesEstimate: wineBottles,
          liquorBottlesEstimate: liquorBottles,
          softDrinksLiters: Math.round(totalGuests * 0.75 * 10) / 10,
          waterGallons: Math.max(2, Math.round(totalGuests * 0.3)),
          icePoundsNeeded: iceLbs,
          formulaNotes: `Calculated for ${drinkers} drinkers and ${nonDrinkers} non-drinkers across a ${durationHours}-hour event (2 drinks hr 1 + 1/hr after).`
        },
        foodCalc: {
          appetizerBitesPerPerson: 8,
          totalAppetizerPieces: totalGuests * 8,
          meatOzPerPerson: 8,
          sideServingsPerPerson: 2,
          dessertPortions: totalGuests,
          foodVibeNotes: "Balanced hearty main dishes, finger food appetizers, and dessert bites."
        },
        items: [
          {
            name: "Craft IPA & Light Lager Variety Pack",
            category: "beverages",
            quantity: Math.max(1, Math.round(beerCases)),
            unit: "24-pack",
            estimatedCost: 32.00,
            store: "Liquor Store",
            priority: "must-have",
            notes: "Chilled variety pack for beer drinkers"
          },
          {
            name: "Crisp Sauvignon Blanc & Pinot Noir",
            category: "beverages",
            quantity: wineBottles,
            unit: "750ml bottles",
            estimatedCost: wineBottles * 12.00,
            store: "Liquor Store",
            priority: "must-have",
            notes: "Split 50/50 between chilled white and fruit-forward red"
          },
          {
            name: "Flavored Sparkling Seltzer Water",
            category: "beverages",
            quantity: 2,
            unit: "12-packs",
            estimatedCost: 11.50,
            store: "Wholesale Club (Costco/Sam's)",
            priority: "must-have",
            notes: "Zero-sugar hydration for non-drinkers and highball mixers"
          },
          {
            name: "Party Ice Bags (10-20 lbs)",
            category: "essentials",
            quantity: 2,
            unit: "bags",
            estimatedCost: 7.50,
            store: "Supermarket / Grocery",
            priority: "must-have",
            notes: "Keep in cooler; 1.5 lbs per guest"
          },
          {
            name: "Gourmet Slider Buns & Brioche Rolls",
            category: "bakery",
            quantity: 2,
            unit: "12-packs",
            estimatedCost: 8.50,
            store: "Bakery",
            priority: "must-have",
            notes: "Fresh bakery soft buns"
          },
          {
            name: "Slow-Cooker Pulled Pork / Marinated Chicken",
            category: "groceries",
            quantity: Math.max(4, Math.round(totalGuests * 0.45 * 10) / 10),
            unit: "lbs",
            estimatedCost: 28.00,
            store: "Supermarket / Grocery",
            priority: "must-have",
            notes: "Main hearty protein option"
          },
          {
            name: "Artisan Dip Duo & Tortilla Chips",
            category: "groceries",
            quantity: 2,
            unit: "tubs + bags",
            estimatedCost: 14.00,
            store: "Wholesale Club (Costco/Sam's)",
            priority: "must-have",
            notes: "Gluten-free tortilla chips with salsa & guacamole"
          },
          {
            name: "Compostable Heavy-Duty Plates & Cutlery",
            category: "tableware",
            quantity: 1,
            unit: "50-pack",
            estimatedCost: 12.50,
            store: "Party Supply / Dollar Store",
            priority: "must-have",
            notes: "Sturdy palm leaf or heavy paper plates"
          },
          {
            name: "Festive Bistro String Lights & Balloons",
            category: "decor",
            quantity: 1,
            unit: "set",
            estimatedCost: 15.00,
            store: "Party Supply / Dollar Store",
            priority: "recommended",
            notes: "Creates ambient evening lighting"
          }
        ],
        signatureRecipes: [
          {
            name: "Citrus Sunset Party Punch (Batch Cocktail)",
            servings: totalGuests,
            prepTime: "10 mins",
            type: "cocktail",
            description: "A bright, crowd-pleasing batch drink featuring bourbon or vodka, sparkling citrus soda, and fresh mint.",
            ingredients: [
              { item: "Bourbon or Vodka", amount: "750 ml" },
              { item: "Fresh Lemonade", amount: "1.5 Liters" },
              { item: "Ginger Ale or Club Soda", amount: "1 Liter" },
              { item: "Fresh Mint Leaves & Lemon Wheels", amount: "1 cup" }
            ],
            instructions: [
              "Combine spirits and lemonade in a large 2-gallon drink dispenser.",
              "Chill thoroughly for at least 2 hours before the event.",
              "Top with chilled ginger ale and fresh garnishes immediately before serving over ice."
            ],
            costPerServing: 2.25
          },
          {
            name: "Sweet & Smoky Pulled Pork Slider Platter",
            servings: totalGuests,
            prepTime: "25 mins",
            type: "main",
            description: "Tender slow-cooked pulled pork on toasted brioche slider buns with tangy coleslaw topper.",
            ingredients: [
              { item: "Boneless Pork Shoulder", amount: `${Math.round(totalGuests * 0.35)} lbs` },
              { item: "Smoky BBQ Sauce", amount: "1 bottle (18 oz)" },
              { item: "Mini Brioche Slider Buns", amount: `${totalGuests * 2} buns` },
              { item: "Crispy Cabbage Slaw", amount: "1 bag + dressing" }
            ],
            instructions: [
              "Slow cook pork with dry rub on low for 7 hours until fork-tender.",
              "Shred meat and fold in barbecue sauce.",
              "Set out warm with sliced brioche buns and coleslaw for a self-serve slider bar."
            ],
            costPerServing: 3.10
          }
        ],
        timeline: [
          { timeframe: "3 Days Before", action: "Finalize RSVP headcounts and purchase non-perishables, wine, and tableware.", category: "Shopping" },
          { timeframe: "1 Day Before", action: "Pick up fresh meats and produce. Pre-batch punch base and chill wine.", category: "Prep" },
          { timeframe: "Morning of Party", action: "Buy ice bags, arrange drink tub, and set ambient lighting and music.", category: "Setup" }
        ],
        shoppingTips: [
          "Buy beer cases and seltzers at Costco or wholesale clubs to save ~30%.",
          "Pre-batching signature punch prevents guests from waiting at a DIY bar.",
          "Label dietary platters (GF, Vegan) clearly with small place cards."
        ],
        agentSummary: `Custom ${title} shopping list configured for ${totalGuests} guests with big-batch recipe formulas, store-sorted checklist, and budget optimizations.`
      };
    }

    // Assign IDs to items if missing
    if (Array.isArray(parsed.items)) {
      parsed.items = parsed.items.map((item: any, idx: number) => ({
        ...item,
        id: item.id || `gen-item-${Date.now()}-${idx}`,
        purchased: false,
        estimatedCost: Math.round((Number(item.estimatedCost) || 5) * 100) / 100
      }));
    }

    // Calculate budget breakdown
    const budgetBreakdown: Record<string, number> = {
      groceries: 0,
      beverages: 0,
      bakery: 0,
      decor: 0,
      tableware: 0,
      entertainment: 0,
      essentials: 0
    };

    if (Array.isArray(parsed.items)) {
      for (const it of parsed.items) {
        const cat = it.category as string;
        if (budgetBreakdown[cat] !== undefined) {
          budgetBreakdown[cat] = Math.round((budgetBreakdown[cat] + (it.estimatedCost || 0)) * 100) / 100;
        } else {
          budgetBreakdown.groceries = Math.round((budgetBreakdown.groceries + (it.estimatedCost || 0)) * 100) / 100;
        }
      }
    }

    const fullPlan = {
      id: `party-${Date.now()}`,
      title: parsed.title || title,
      theme: parsed.theme || theme,
      vibe: parsed.vibe || "Celebratory & Memorable",
      eventType,
      guestCount: {
        adults: Number(adults),
        kids: Number(kids),
        total: totalGuests,
        drinkers: Number(drinkers),
        nonDrinkers: nonDrinkers
      },
      durationHours: Number(durationHours),
      targetBudget: Number(targetBudget),
      venue,
      dietaryRestrictions,
      createdAt: new Date().toISOString(),
      items: parsed.items || [],
      drinkCalc: parsed.drinkCalc,
      foodCalc: parsed.foodCalc,
      signatureRecipes: parsed.signatureRecipes || [],
      timeline: parsed.timeline || [],
      shoppingTips: parsed.shoppingTips || [],
      budgetBreakdown,
      agentSummary: parsed.agentSummary || "Your party plan has been generated with calculated quantities and budget estimates."
    };

    res.json(fullPlan);
  } catch (error: any) {
    console.error("Error generating party plan:", error);
    res.status(500).json({ error: error.message || "Failed to generate party plan" });
  }
});

// Interactive Shopping Agent Chat Endpoint
app.post("/api/agent-chat", async (req, res) => {
  try {
    const ai = getGeminiClient();
    const { message, currentPlan, chatHistory = [] } = req.body;

    // If Gemini is available, attempt AI completion
    if (ai) {
      try {
        const systemInstruction = `You are a savvy, ultra-helpful, highly responsive Party Planner Shopping Agent.
Your role:
1. Help the user optimize, adjust, customize, and shop for their party.
2. If the user asks to add items (e.g. "Add a signature gin cocktail", "Add kid snacks", "Add gluten-free dessert"), return an encouraging response AND structure actionable items in your JSON output.
3. If the user asks to cut costs (e.g. "Reduce my budget by $40"), give specific item substitutions, bulk buying tips, or items to trim.
4. If the user asks about portion math, ice formulas, bar ratios, or cooking timelines, give clear mathematical explanations.
5. Always keep the tone upbeat, professional, practical, and party-ready.
`;

        const partyContext = `Current Party Context:
Title: ${currentPlan?.title || 'Party'}
Guests: ${currentPlan?.guestCount?.total || 10} (${currentPlan?.guestCount?.adults || 10} adults, ${currentPlan?.guestCount?.kids || 0} kids)
Drinkers: ${currentPlan?.guestCount?.drinkers || 8}
Budget: $${currentPlan?.targetBudget || 200}
Item count: ${currentPlan?.items?.length || 0}
Dietary: ${(currentPlan?.dietaryRestrictions || []).join(', ') || 'None'}`;

        const prompt = `${partyContext}

Chat History:
${(chatHistory || []).map((c: any) => `${(c?.sender || 'user').toUpperCase()}: ${c?.text || ''}`).join('\n')}

USER: ${message}

Respond in JSON format with:
- "text": Your helpful conversational answer. Use markdown formatting with bullet points, bold text, and dollar amounts where helpful.
- "suggestedAction": Optional object if your answer recommends adding items or updating the plan:
   - "type": "add_items" | "none"
   - "label": Short button text (e.g. "Add 3 Mocktail Items to Shopping List")
   - "items": Array of items if type is "add_items": [{ name, category, quantity, unit, estimatedCost, store, priority, notes }]
`;

        const response = await ai.models.generateContent({
          model: "gemini-3.7-flash",
          contents: prompt,
          config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                suggestedAction: {
                  type: Type.OBJECT,
                  properties: {
                    type: { type: Type.STRING },
                    label: { type: Type.STRING },
                    items: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          name: { type: Type.STRING },
                          category: { type: Type.STRING },
                          quantity: { type: Type.NUMBER },
                          unit: { type: Type.STRING },
                          estimatedCost: { type: Type.NUMBER },
                          store: { type: Type.STRING },
                          priority: { type: Type.STRING },
                          notes: { type: Type.STRING }
                        },
                        required: ["name", "category", "quantity", "unit", "estimatedCost", "store", "priority"]
                      }
                    }
                  }
                }
              },
              required: ["text"]
            }
          }
        });

        const parsed = cleanAndParseJSON(response.text || "{}");
        if (parsed.text) {
          return res.json(parsed);
        }
      } catch (geminiError) {
        console.warn("Gemini chat API call failed, falling back to local domain handler:", geminiError);
      }
    }

    // High-quality domain fallback
    const fallbackResponse = generateChatFallback(message, currentPlan);
    return res.json(fallbackResponse);
  } catch (error: any) {
    console.error("Error in agent chat:", error);
    // Never let agent chat crash
    const fallback = generateChatFallback(req.body?.message || "", req.body?.currentPlan);
    return res.json(fallback);
  }
});

// Quick Substitution Finder
app.post("/api/suggest-substitutions", async (req, res) => {
  try {
    const ai = getGeminiClient();
    const { itemName = "Item", itemCategory = "groceries", dietaryNeed = "", currentCost = 10 } = req.body;

    if (ai) {
      try {
        const prompt = `Give 3 smart, practical alternatives/substitutions for the party item "${itemName}" (Category: ${itemCategory}, Current est: $${currentCost}).
Consider dietary need if specified: "${dietaryNeed || 'Cost saving or crowd pleasing'}".

Return JSON with an array of "substitutions":
- "name": New item name
- "description": Why it works well for parties
- "estimatedCost": Estimated price
- "costDifference": string e.g. "-$5.00 (Saves 35%)" or "+$2.00 (Gourmet upgrade)"
- "store": recommended store
- "dietaryFit": e.g. "Gluten-Free, Dairy-Free"`;

        const response = await ai.models.generateContent({
          model: "gemini-3.7-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                substitutions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      description: { type: Type.STRING },
                      estimatedCost: { type: Type.NUMBER },
                      costDifference: { type: Type.STRING },
                      store: { type: Type.STRING },
                      dietaryFit: { type: Type.STRING }
                    },
                    required: ["name", "description", "estimatedCost", "costDifference", "store"]
                  }
                }
              },
              required: ["substitutions"]
            }
          }
        });

        const parsed = cleanAndParseJSON(response.text || "{}");
        if (Array.isArray(parsed.substitutions) && parsed.substitutions.length > 0) {
          return res.json(parsed);
        }
      } catch (err) {
        console.warn("Gemini substitutions error, using smart fallback:", err);
      }
    }

    // Fallback substitutions
    const cost = Number(currentCost) || 10;
    const lowerCost = Math.round(cost * 0.65 * 100) / 100;
    const upgradeCost = Math.round(cost * 1.35 * 100) / 100;

    res.json({
      substitutions: [
        {
          name: `Wholesale Club Bulk ${itemName}`,
          description: "Buying in bulk at Costco/Sam's club significantly reduces unit cost for large parties.",
          estimatedCost: lowerCost,
          costDifference: `-$${(cost - lowerCost).toFixed(2)} (Saves 35%)`,
          store: "Wholesale Club (Costco/Sam's)",
          dietaryFit: "Bulk Host Saver"
        },
        {
          name: `Allergen-Safe & Gluten-Free ${itemName}`,
          description: "A crowd-safe alternative that accommodates guests with gluten or dairy sensitivities.",
          estimatedCost: cost,
          costDifference: "$0.00 (Dietary Safe)",
          store: "Supermarket / Grocery",
          dietaryFit: "Gluten-Free, Nut-Free"
        },
        {
          name: `Artisan Gourmet ${itemName}`,
          description: "Premium upgrade that elevates the visual presentation and taste experience.",
          estimatedCost: upgradeCost,
          costDifference: `+$${(upgradeCost - cost).toFixed(2)} (Gourmet Upgrade)`,
          store: "Specialty / Farmers Market",
          dietaryFit: "Premium Craft"
        }
      ]
    });
  } catch (error: any) {
    console.error("Error generating substitutions:", error);
    res.status(500).json({ error: error.message || "Failed to generate substitutions" });
  }
});

// Price Optimizer & Route Bundler
app.post("/api/price-compare-optimize", async (req, res) => {
  try {
    const ai = getGeminiClient();
    const { currentPlan } = req.body;
    const items = currentPlan?.items || [];
    const budget = currentPlan?.targetBudget || 200;

    if (ai) {
      try {
        const prompt = `Analyze this party shopping list and budget to provide smart optimization strategies:
Target Budget: $${budget}
Items (${items.length}):
${items.map((i: any) => `- ${i.name} (Qty: ${i.quantity} ${i.unit}, Est: $${i.estimatedCost}, Store: ${i.store}, Priority: ${i.priority})`).join('\n')}

Generate:
1. "topSavingsHacks": Array of 3-4 actionable tips specifically for this list that save $10-$50.
2. "storeRouteStrategy": Recommended store stops in logical order (e.g. Stop 1: Dollar Store / Party Supply for cheap decor, Stop 2: Costco for bulk meats/drinks, Stop 3: Grocery for fresh herbs/produce, Stop 4: Liquor Store, Stop 5: Ice morning of event).
3. "totalEstimatedSavings": Estimated total dollars that can be saved through strategic store choice and smart swaps.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.7-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                topSavingsHacks: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                      estimatedSavings: { type: Type.STRING }
                    },
                    required: ["title", "description", "estimatedSavings"]
                  }
                },
                storeRouteStrategy: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      stopNumber: { type: Type.INTEGER },
                      storeName: { type: Type.STRING },
                      itemsToBuy: { type: Type.STRING },
                      proTip: { type: Type.STRING }
                    },
                    required: ["stopNumber", "storeName", "itemsToBuy", "proTip"]
                  }
                },
                totalEstimatedSavings: { type: Type.STRING }
              },
              required: ["topSavingsHacks", "storeRouteStrategy", "totalEstimatedSavings"]
            }
          }
        });

        const parsed = cleanAndParseJSON(response.text || "{}");
        if (parsed.topSavingsHacks && parsed.storeRouteStrategy) {
          return res.json(parsed);
        }
      } catch (err) {
        console.warn("Gemini optimizer error, using smart fallback:", err);
      }
    }

    // Fallback optimizer
    res.json({
      topSavingsHacks: [
        {
          title: "Buy Non-Perishable Tableware at Dollar / Party Stores",
          description: "Paper plates, cups, and napkins are up to 60% cheaper at party specialty discount stores compared to standard supermarkets.",
          estimatedSavings: "$12 - $18"
        },
        {
          title: "Bundle Beers & Sparkling Waters at Wholesale Clubs",
          description: "Buying 24-packs of craft beer and 30-can seltzer flats at Costco or Sam's Club reduces single-can costs by 40%.",
          estimatedSavings: "$20 - $35"
        },
        {
          title: "Make 1 Big-Batch Punch Instead of Full Open Bar",
          description: "Batching a signature cocktail with fresh citrus and fruit juices requires 30% less spirits while looking gourmet.",
          estimatedSavings: "$25 - $40"
        },
        {
          title: "Pre-Salt and Marinate Bone-In / Pork Cuts",
          description: "Pork shoulder or bone-in chicken thighs cost $2-$3/lb vs $10/lb beef steaks, and yield more flavor when slow-cooked.",
          estimatedSavings: "$18 - $30"
        }
      ],
      storeRouteStrategy: [
        {
          stopNumber: 1,
          storeName: "Party Supply / Dollar Store",
          itemsToBuy: "Plates, napkins, cutlery, balloons, streamers, ice buckets",
          proTip: "Get these 3-4 days ahead of time so you aren't rushing on party day."
        },
        {
          stopNumber: 2,
          storeName: "Wholesale Club (Costco/Sam's)",
          itemsToBuy: "Beer cases, sparkling water, bulk meat, large chip bags, dips",
          proTip: "Bring cooler bags in your trunk to keep meat and dips fresh on the drive."
        },
        {
          stopNumber: 3,
          storeName: "Supermarket / Grocery",
          itemsToBuy: "Fresh limes, lemons, mint, artisan cheeses, bakery buns",
          proTip: "Shop early morning for the freshest produce and best herb selection."
        },
        {
          stopNumber: 4,
          storeName: "Liquor Store",
          itemsToBuy: "Wine bottles, specific cocktail spirits, signature liqueurs",
          proTip: "Ask for a 10% case discount if buying 6 or more bottles of wine."
        },
        {
          stopNumber: 5,
          storeName: "Local Grocery / Gas Station (Morning of Party)",
          itemsToBuy: "Fresh ice bags (1.5 lbs per guest)",
          proTip: "Keep one bag sealed for cocktail drink glasses, and pour the rest into cooler tubs."
        }
      ],
      totalEstimatedSavings: "$55.00 - $85.00"
    });
  } catch (error: any) {
    console.error("Error optimizing shopping list:", error);
    res.status(500).json({ error: error.message || "Failed to optimize shopping list" });
  }
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Party Planner Shopping Agent running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
