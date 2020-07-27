export default class Likes{
    constructor(){
        this.likes=[];
    }
    addLike(id,title,author,img){
        const item={id,title,author,img};
        this.likes.push(item);
        this.persistData();
        return item;
    }
    deleteLike(id){
        const index=this.likes.findIndex(el=>{
            el.id===id
        });
        this.likes.splice(index,1);
        this.persistData();
    }
    isLiked(id){
        return this.likes.findIndex(el=>el.id===id)!==-1;
    }
    getNumLikes(){
        return this.likes.length;
    }
    persistData(){
        localStorage.setItem('likes',JSON.stringify(this.likes));
    }
    restoreData(){
        const arr=JSON.parse(localStorage.getItem('likes'));
        if(arr){
            this.likes=arr;
        }
    }
}