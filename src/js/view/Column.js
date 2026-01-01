import kanban from "./kanban.js";

export default class Column{
    constructor(id, title){
        this.elements = {};
        this.elements.root = Column.createRoot();
        this.elements.title = this.elements.root.querySelector(".kanban_col_title");
        this.elements.items = this.elements.root.querySelector(".kanban_col_items");
        this.elements.addItem = this.elements.root.querySelector(".kanban_additem");

        this.elements.root.dataset.id = id;
        this.elements.title.textContent = title;

        this.elements.addItem.addEventListener("click", ()=>{

        });

        kanbanAPI.getItems(id).forEach(item => {
            console.log(item);
        });
    }

    static createRoot(){
        const range = document.createRange(); 
        range.selectNode(document.body);
        return range.createContextualFragment(`       
             <div class="kanban_col">
            <div class="kanban_col_title">Not Started</div>
            <div class="kanban_col_items">
            </div>
            <button class="kanban_add_item" type="button">+ Add</button>`).children[0]; 
    }

    renderItem(data){
        
    }
} 

