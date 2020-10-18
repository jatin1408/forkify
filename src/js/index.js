import Search from "./models/Search";
import * as searchView from "./views/SearchView";
import * as rv from "./views/recipeView";
import { elements, renderLoader, clearLoader } from "./views/base";
import Recipe from "./models/recipe";
import List from "./models/List";
import { renderItem, deleteItem } from "./views/listView";
import Likes from "./models/Likes";
import {
  toggleLikeBtn,
  toggleLikeMenu,
  renderLike,
  deleteLike,
} from "./views/likesView";
const state = {};

const controlSearch = async () => {
  const query = searchView.getInput();

  if (query) {
    state.search = new Search(query);
    try {
      searchView.clearInput();
      searchView.clearResults();
      renderLoader(elements.searchRes);
      await state.search.getResults();
      clearLoader();
      searchView.renderResults(state.search.results);
    } catch (err) {
      clearLoader();

      alert(err);
    }
  }
};

const controlList = () => {
  if (!state.list) state.list = new List();

  state.recipe.ing.forEach((el) => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);

    renderItem(item);
  });
};


elements.shopping.addEventListener("click", (e) => {
  const id = e.target.closest(".shopping__item").dataset.itemid;

  if (e.target.matches(".shopping__delete", ".shopping__delete *")) {
    state.list.deleteItem(id);
    deleteItem(id);
  } else if (e.target.matches(".shopping__count-value")) {
    const val = parseFloat(e.target.value, 10);
    state.list.updateCount(id, val);
  }
});

elements.searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  controlSearch();
  clearLoader();
});

elements.searchPages.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-inline");
  if (btn) {
    const gotoPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.results, gotoPage);
  }
});

const recipeController = async () => {
  const id = window.location.hash.replace("#", "");
  if (id) {
    rv.clearRecipe();
    renderLoader(elements.renderRecipe);
    state.recipe = new Recipe(id);
    if (state.search) {
      searchView.highlightSelected(id);
    }
    window.r = state.recipe;

    try {
      await state.recipe.getRecipe();

      state.recipe.parseIngredients();
      state.recipe.calcTime();
      state.recipe.calcServings();
      clearLoader();
      rv.renderRecipe(state.recipe, state.likes.isLiked(id));
    } catch (err) {
      alert(err);
    }
  }
};

const controlLike = () => {
  if (!state.likes) state.likes = new Likes();
  const currentId = state.recipe.id;
  if (!state.likes.isLiked(currentId)) {
    const newLike = state.likes.addLike(
      currentId,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );
    toggleLikeBtn(true);
    renderLike(newLike);
  } else {
    state.likes.deleteLike(currentId);
    toggleLikeBtn(false);
    deleteLike(currentId);
  }

  toggleLikeMenu(state.likes.getNumLikes());
};

["hashchange", "load"].forEach((e) =>
  window.addEventListener(e, recipeController)
);

window.addEventListener("load", () => {
  state.likes = new Likes();
  state.likes.restoreData();
  toggleLikeMenu(state.likes.getNumLikes());
  state.likes.likes.forEach((el) => {
    renderLike(el);
  });
});
elements.renderRecipe.addEventListener("click", (e) => {
  if (e.target.matches(".btn-dec,.btn-dec *")) {
    if (state.recipe.servings > 1) {
      state.recipe.updateServings("dec");
      rv.updateServingsIngredients(state.recipe);
    }
  } else if (e.target.matches(".btn-inc,.btn-inc *")) {
    state.recipe.updateServings("inc");
    rv.updateServingsIngredients(state.recipe);
  } else if (e.target.matches(".recipe__btn__add,.recipe__btn__add *")) {
    controlList();
  } else if (e.target.matches(".recipe__love,.recipe__love *")) {
    controlLike();
  }
});
