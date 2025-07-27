// utils/formatRecipeData.js

function formatRecipeData(recipe) {
    return {
      spoonacularId: recipe.id.toString(),
      title: recipe.title,
      image: recipe.image,
      instructions: recipe.instructions || '',
      servings: recipe.servings,
      readyInMinutes: recipe.readyInMinutes,
      ingredients: recipe.extendedIngredients?.map(ing => ing.original) || [],
      numberOfIngredients: recipe.extendedIngredients ? recipe.extendedIngredients.length : 0
    };
  }
  
  module.exports = formatRecipeData;
  