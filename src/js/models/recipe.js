import axios from 'axios';
export default class Recipe{
    constructor(id){
        this.id=id;
    }
    async getRecipe(){
        try{
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.author=res.data.recipe.publisher;
            this.title=res.data.recipe.title;
            this.img=res.data.recipe.image_url;
            this.url=res.data.recipe.source_url;
            this.ing=res.data.recipe.ingredients;
            
        }
        catch(error){
            alert(error);
        }
    }
    calcTime(){
        const numIng=this.ing.length;
        const periods=Math.ceil(numIng/3);
        this.time=periods*15;
    }
    calcServings(){
        this.servings=4;

    }
    parseIngredients(){
        const unitsLong=["teaspoons","teaspoon","tablespoons","tablespoon","ounces","ounce","cups","pounds"]
        const unitsShort=["tsp","tsp","tbsp","tbsp","oz","oz","cup","pound"];
        const newIngredients=this.ing.map(el=>{
            let ingredient=el.toLowerCase();
            unitsLong.forEach((unit,i)=>{
                ingredient=ingredient.replace(unit,unitsShort[i]);

            });
           ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");
           const arrIng=ingredient.split(" ");
           const temp=arrIng.findIndex(el2=>unitsShort.includes(el2));
           let finalObj;

           if(temp>-1){
            let count1=1; 
            const arrCount=arrIng.slice(0,temp);
            if(arrCount.length===1){
                count1=eval(arrIng[0].replace("-","+"));
                console.log(count1);
            }
            else if(arrCount.length>1){
                count1=eval(arrIng.slice(0,temp).join("+"));
                console.log(count1);
            }
            finalObj={
                count:count1,
                unit:arrIng[temp],
                ingredient:arrIng.slice(temp+1).join(" ")
            };
           }
           else if(parseInt(arrIng[0],10)){
            
                finalObj={
                    count:parseInt(arrIng[0],10),
                    unit:"",
                    ingredient:arrIng.slice(1).join(' ')
                }
           }
           else if(temp===-1){
                finalObj={
                    count:1,
                    unit:"",
                    ingredient:ingredient
                }
           }
           return finalObj;
        });

        this.ing=newIngredients;
    }
    updateServings(type){
        const newServings=type==='dec'?this.servings-1:this.servings+1;
        this.ing.forEach(ings=>{
            ings.count*=(newServings/this.servings);

        });
        this.servings=newServings;
    }
}