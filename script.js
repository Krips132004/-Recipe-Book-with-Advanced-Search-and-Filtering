function getRecipes() {
  return JSON.parse(localStorage.getItem("recipes")) || [];
}

function saveRecipes(recipes) {
  localStorage.setItem("recipes", JSON.stringify(recipes));
}
function displayRecipes(recipes) {
  const container = document.getElementById("recipes-container");
  container.innerHTML = "";

  if (recipes.length === 0) {
    container.innerHTML = "<p style='text-align:center;'>No recipes found.</p>";
    return;
  }

  recipes.forEach(recipe => {
    const card = document.createElement("div");
    card.className = "recipe-card";
    card.innerHTML = `
      <h3>${recipe.title}</h3>
      <p><strong>Ingredients:</strong> ${recipe.ingredients.join(", ")}</p>
      <p><strong>Instructions:</strong> ${recipe.instructions}</p>
      <p><strong>Cuisine:</strong> ${recipe.cuisine}</p>
      <button class="edit" onclick="editRecipe(${recipe.id})">Edit</button>
      <button class="delete" onclick="deleteRecipe(${recipe.id})">Delete</button>
    `;
    container.appendChild(card);
  });
}

function addRecipe(e) {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const ingredients = document.getElementById("ingredients").value.trim();
  const instructions = document.getElementById("instructions").value.trim();
  const cuisine = document.getElementById("cuisine").value;

  if (!title || !ingredients) {
    alert("Please enter both title and ingredients.");
    return;
  }

  const newRecipe = {
    id: Date.now(),
    title,
    ingredients: ingredients.split(",").map(item => item.trim()),
    instructions,
    cuisine
  };

  const recipes = getRecipes();
  recipes.push(newRecipe);
  saveRecipes(recipes);
  displayRecipes(recipes);

  document.getElementById("recipe-form").reset();
}

function deleteRecipe(id) {
  let recipes = getRecipes();
  recipes = recipes.filter(recipe => recipe.id !== id);
  saveRecipes(recipes);
  displayRecipes(recipes);
}

function editRecipe(id) {
  const recipes = getRecipes();
  const recipe = recipes.find(r => r.id === id);
  if (!recipe) return;

  document.getElementById("title").value = recipe.title;
  document.getElementById("ingredients").value = recipe.ingredients.join(", ");
  document.getElementById("instructions").value = recipe.instructions;
  document.getElementById("cuisine").value = recipe.cuisine;

  deleteRecipe(id);
}

function applyFilters() {
  const titleInput = document.getElementById("search-title").value.toLowerCase();
  const ingredientInput = document.getElementById("search-ingredients").value.toLowerCase();
  const cuisineFilter = document.getElementById("filter-cuisine").value;

  let recipes = getRecipes();

  const filtered = recipes.filter(recipe => {
    const titleMatch = recipe.title.toLowerCase().includes(titleInput);
    const ingredientMatch = recipe.ingredients.join(", ").toLowerCase().includes(ingredientInput);
    const cuisineMatch = cuisineFilter ? recipe.cuisine === cuisineFilter : true;

    return titleMatch && ingredientMatch && cuisineMatch;
  });

  displayRecipes(filtered);
}

document.getElementById("recipe-form").addEventListener("submit", addRecipe);
document.getElementById("search-title").addEventListener("input", applyFilters);
document.getElementById("search-ingredients").addEventListener("input", applyFilters);
document.getElementById("filter-cuisine").addEventListener("change", applyFilters);

window.onload = () => {
  displayRecipes(getRecipes());
};
