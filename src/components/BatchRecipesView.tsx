import React, { useState } from 'react';
import { PartyPlan, BatchRecipe, ShoppingItem } from '../types';
import { 
  UtensilsCrossed, 
  Wine, 
  Clock, 
  Users, 
  Sparkles, 
  Check, 
  PlusCircle, 
  ChefHat, 
  Sliders,
  DollarSign
} from 'lucide-react';

interface BatchRecipesViewProps {
  plan: PartyPlan;
  onAddItemsToList: (items: Partial<ShoppingItem>[]) => void;
}

export const BatchRecipesView: React.FC<BatchRecipesViewProps> = ({
  plan,
  onAddItemsToList
}) => {
  const [scaleFactors, setScaleFactors] = useState<Record<string, number>>({});
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  const recipes = plan.signatureRecipes || [];

  const handleScaleChange = (recipeName: string, newServings: number) => {
    setScaleFactors(prev => ({
      ...prev,
      [recipeName]: newServings
    }));
  };

  const handleAddRecipeIngredients = (recipe: BatchRecipe, currentServings: number) => {
    const scale = currentServings / recipe.servings;
    const newItems: Partial<ShoppingItem>[] = recipe.ingredients.map((ing, idx) => ({
      name: ing.item,
      category: recipe.type === 'cocktail' || recipe.type === 'mocktail' ? 'beverages' : 'groceries',
      quantity: Math.round(scale * 10) / 10,
      unit: ing.amount,
      estimatedCost: Math.round((recipe.costPerServing || 2.5) * currentServings / recipe.ingredients.length * 100) / 100,
      store: recipe.type === 'cocktail' ? 'Liquor Store' : 'Supermarket / Grocery',
      priority: 'must-have',
      purchased: false,
      notes: `For ${recipe.name} (${currentServings} servings)`
    }));

    onAddItemsToList(newItems);
    setAddedNotice(`Added ingredients for "${recipe.name}" to shopping list!`);
    setTimeout(() => setAddedNotice(null), 4000);
  };

  if (recipes.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
        <ChefHat className="w-10 h-10 text-slate-300 mx-auto mb-2" />
        <h3 className="text-sm font-bold text-slate-800">No batch recipes generated yet</h3>
        <p className="text-xs text-slate-500 mt-1">
          Open the Shopping Agent chat to generate custom punch, cocktail, or appetizer recipes.
        </p>
      </div>
    );
  }

  return (
    <div id="batch-recipes-view" className="space-y-5">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-amber-700" />
            <h2 className="text-base font-bold text-slate-900">
              Big-Batch Recipes & Mixology Guides
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Designed specifically for {plan.guestCount.total} guests. Scale portions or sync ingredients to your cart.
          </p>
        </div>

        {addedNotice && (
          <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 animate-fade-in">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{addedNotice}</span>
          </div>
        )}
      </div>

      {/* Recipes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {recipes.map((recipe, idx) => {
          const currentServings = scaleFactors[recipe.name] || recipe.servings;
          const scale = currentServings / recipe.servings;

          return (
            <div
              key={idx}
              id={`recipe-card-${idx}`}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs flex flex-col justify-between"
            >
              <div>
                {/* Card Header */}
                <div className="p-5 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-slate-50 border-b border-slate-200/70">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-white text-slate-700 px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                      {recipe.type.toUpperCase()}
                    </span>
                    <div className="flex items-center gap-3 text-xs text-slate-600">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {recipe.prepTime}
                      </span>
                      {recipe.costPerServing && (
                        <span className="flex items-center gap-0.5 font-semibold text-emerald-700">
                          <DollarSign className="w-3.5 h-3.5" />
                          {recipe.costPerServing.toFixed(2)}/serving
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {recipe.name}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {recipe.description}
                  </p>
                </div>

                {/* Servings Slider */}
                <div className="px-5 py-3 bg-slate-50/70 border-b border-slate-200/60 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-amber-700" />
                    <span className="text-xs font-semibold text-slate-700">
                      Scale Recipe:
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="4"
                      max="60"
                      step="2"
                      value={currentServings}
                      onChange={(e) => handleScaleChange(recipe.name, Number(e.target.value))}
                      className="w-28 sm:w-36 accent-amber-600 cursor-pointer"
                    />
                    <span className="text-xs font-bold text-slate-900 bg-white border border-slate-200 px-2 py-0.5 rounded-md min-w-14 text-center">
                      {currentServings} servings
                    </span>
                  </div>
                </div>

                {/* Ingredients & Instructions */}
                <div className="p-5 space-y-4 text-xs">
                  {/* Ingredients */}
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                      <UtensilsCrossed className="w-3.5 h-3.5 text-amber-600" />
                      Ingredients Needed ({recipe.ingredients.length}):
                    </h4>
                    <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/70 space-y-1.5">
                      {recipe.ingredients.map((ing, i) => (
                        <div key={i} className="flex items-start justify-between gap-2">
                          <span className="text-slate-800 font-medium">
                            • {ing.item}
                          </span>
                          <span className="text-slate-500 font-semibold shrink-0">
                            {scale !== 1 ? `(~${Math.round(scale * 10) / 10}x) ` : ''}{ing.amount}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Step by step */}
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                      <ChefHat className="w-3.5 h-3.5 text-amber-600" />
                      Instructions:
                    </h4>
                    <ol className="space-y-2 text-slate-700 pl-4 list-decimal leading-relaxed">
                      {recipe.instructions.map((step, sIdx) => (
                        <li key={sIdx} className="pl-1">
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-4 bg-slate-50 border-t border-slate-200/80">
                <button
                  onClick={() => handleAddRecipeIngredients(recipe, currentServings)}
                  className="w-full py-2 px-4 rounded-xl text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 transition-colors flex items-center justify-center gap-2 shadow-2xs"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Sync Recipe Ingredients to Shopping List</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
