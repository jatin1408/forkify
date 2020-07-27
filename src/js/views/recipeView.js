import {elements} from './base';
import { Fraction } from 'fractional';
export const clearRecipe=()=>{
    elements.renderRecipe.innerHTML="";
    
};
const parseCount=count=>{
    
    if(count){
    const newCount=Math.round(count*1000)/1000;
    const [int,dec]=newCount.toString().split(".").map(el=>parseInt(el,10));
    if(!dec){
        return newCount;
    }
    if(int===0){
        const dem=new Fraction(newCount);
        return `${dem.numerator}/${dem.denominator}`;
    }
    else{
        const dem=new Fraction(newCount-int);
        return `${int} ${dem.numerator}/${dem.denominator}`;
    }
}
return `?`;
}
const createIngrident=ingrident=>{

    return `<li class="recipe__item">
    <svg class="recipe__icon">
        <use href="img/icons.svg#icon-check"></use>
    </svg>
    <div class="recipe__count">${parseCount(ingrident.count)}</div>
    <div class="recipe__ingredient">
        <span class="recipe__unit">${ingrident.unit}</span>
        ${ingrident.ingredient}
    </div>
    </li>`;
}
export const renderRecipe=(recipe,isLiked)=>{
    const markup =`
    <figure class="recipe__fig">
    <img src="${recipe.img}" alt="${recipe.title}" class="recipe__img">
    <h1 class="recipe__title">
        <span>${recipe.title}</span>
    </h1>
    </figure>
    <div class="recipe__details">
    <div class="recipe__info">
        <svg class="recipe__info-icon">
            <use href="img/icons.svg#icon-stopwatch"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--minutes">${recipe.time}</span>
        <span class="recipe__info-text"> minutes</span>
    </div>
    <div class="recipe__info">
        <svg class="recipe__info-icon">
            <use href="img/icons.svg#icon-man"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
        <span class="recipe__info-text"> servings</span>

        <div class="recipe__info-buttons">
            <button class="btn-tiny btn-dec">
                <svg>
                    <use href="img/icons.svg#icon-circle-with-minus"></use>
                </svg>
            </button>
            <button class="btn-tiny btn-inc">
                <svg>
                    <use href="img/icons.svg#icon-circle-with-plus"></use>
                </svg>
            </button>
        </div>

    </div>
    <button class="recipe__love">
        <svg class="header__likes">
            <use href="img/icons.svg#icon-heart${isLiked?'':'-outlined'}"></use>
        </svg>
    </button>
</div>



<div class="recipe__ingredients">
    <ul class="recipe__ingredient-list">
       ${recipe.ing.map(el=>createIngrident(el)).join(" ")}
    </ul>

    <button class="btn-small recipe__btn recipe__btn__add
    ">
        <svg class="search__icon">
            <use href="img/icons.svg#icon-shopping-cart"></use>
        </svg>
        <span>Add to shopping list</span>
    </button>
</div>

<div class="recipe__directions">
    <h2 class="heading-2">How to cook it</h2>
    <p class="recipe__directions-text">
        This recipe was carefully designed and tested by
        <span class="recipe__by">${recipe.author}</span>. Please check out directions at their website.
    </p>
    <a class="btn-small recipe__btn" href="${recipe.url}" target="_blank">
        <span>Directions</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-right"></use>
        </svg>

    </a>
</div>`
    elements.renderRecipe.insertAdjacentHTML("afterbegin",markup);
}

export const updateServingsIngredients=recipe=>{
    document.querySelector('.recipe__info-data--people').textContent=recipe.servings;
    const temp=Array.from(document.querySelectorAll('.recipe__count'));
    temp.forEach((el,i)=>{
        el.textContent=parseCount(recipe.ing[i].count);
    })
}