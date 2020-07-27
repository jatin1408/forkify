import {elements, elementStrings} from './base'
export const getInput=()=>elements.searchInput.value;
export const clearInput=()=>{
    elements.searchInput.value='';
};
export const clearResults=()=>{
    elements.searchResList.innerHTML="";
    elements.searchPages.innerHTML="";
};

export const highlightSelected = id => {
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    });
    document.querySelector(`.results__link[href*="${id}"]`).classList.add('results__link--active');
};
export const cutTitle= (title,limit=17)=>{
    const titleArr=[];
    if(title.length>limit){
        title.split(' ').reduce((acc,cur)=>{
            if(acc+cur.length<=limit){
                titleArr.push(cur);
            }
            return acc+cur.length;
        },0);
       return `${titleArr.join(' ')} ...`; 
    }
    return title;
}
const render=rec=>{
    var markup=
    `<li>
    <a class="results__link" href="#${rec.recipe_id}">
        <figure class="results__fig">
            <img src="${rec.image_url}" alt="${rec.title}">
        </figure>
        <div class="results__data">
            <h4 class="results__name">${cutTitle(rec.title)}</h4>
            <p class="results__author">${rec.publisher}</p>
        </div>
    </a>
    </li>`;
    elements.searchResList.insertAdjacentHTML('beforeend',markup);

}
const createButton=(page,type)=>{

    return `<button class="btn-inline results__btn--${type}" data-goto=${type==='prev'?page-1:page+1}>
    <span>Page ${type==='prev'?page-1:page+1}</span>
    <svg class="search__icon">
        <use href="img/icons.svg#icon-triangle-${type==='prev'?'left':'right'}"></use>
    </svg>
    
    </button>` ;
};

const renderButtons=(page,numResults,resPerPage)=>
{
    let button;
    
    const pages=Math.ceil(numResults/resPerPage);
    if(page===1 && pages>1){
        
        button=createButton(page,"next");
        
    }
    else if(page<pages){
        button=
        `
        ${createButton(page,"next")}
        ${createButton(page,"prev")}
        `;
    }
    else if(page=== pages && pages>1){
        button=createButton(page,'prev');
    }
   
    elements.searchPages.insertAdjacentHTML("afterbegin",button);
};

export const renderResults=(recipes,page=1,resPerPage=10) =>{
    const start=(page-1)* resPerPage;
    const end=page*resPerPage;
    recipes.slice(start,end).forEach(render);

    renderButtons(page,recipes.length,resPerPage);
}