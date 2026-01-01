import Item from "./item.js";
import KanbanAPI from "../api/kanbanAPI.js";

export default class Column{
    constructor(id, title){
        this.elements = {};
        this.elements.root = Column.createRoot();
        this.elements.title = this.elements.root.querySelector(".kanban_col_title");
        this.elements.items = this.elements.root.querySelector(".kanban_col_items");
        this.elements.addItem = this.elements.root.querySelector(".kanban_add_item");

        this.elements.root.dataset.id = id;
        this.elements.title.textContent = title;

        this.elements.addItem.addEventListener("click", ()=>{
            const newItem = KanbanAPI.insertItem(id, "");
            const item = this.renderItem(newItem);
            // focus the input so user can start typing immediately
            item.elements.input.focus();
        });

        // render saved items from storage
        KanbanAPI.getItems(id).forEach(item => {
            this.renderItem(item);
        });

        // drag/drop handlers for moving items between columns
        this.elements.items.addEventListener("dragover", (e) => {
            e.preventDefault();
            const afterElement = Column.getDragAfterElement(this.elements.items, e.clientY);
            const dragging = document.querySelector(".kanban_dragging");
            if (!dragging) return;
            if (afterElement == null) {
                this.elements.items.appendChild(dragging);
            } else {
                this.elements.items.insertBefore(dragging, afterElement);
            }
            this.elements.items.classList.add("kanban_dropzone_active");
        });

        this.elements.items.addEventListener("dragleave", (e) => {
            this.elements.items.classList.remove("kanban_dropzone_active");
        });

        this.elements.items.addEventListener("drop", (e) => {
            e.preventDefault();
            const id = e.dataTransfer.getData("text/plain");
            const draggable = document.querySelector("[data-id=\"" + id + "\"]");
            const afterElement = Column.getDragAfterElement(this.elements.items, e.clientY);
            if (afterElement == null) {
                this.elements.items.appendChild(draggable);
            } else {
                this.elements.items.insertBefore(draggable, afterElement);
            }
            this.elements.items.classList.remove("kanban_dropzone_active");
            // update storage with new column and position
            const newPosition = [...this.elements.items.querySelectorAll(".kanban_item")].indexOf(draggable);
            KanbanAPI.updateItem(parseInt(id), { columnId: parseInt(this.elements.root.dataset.id), position: newPosition });
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
            <button class="kanban_add_item" type="button">+ Add</button>
            </div>`).children[0]; 
    }

    static getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.kanban_item:not(.kanban_dragging)')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    renderItem(data){
        const item = new Item(data.id, data.content);
        this.elements.items.appendChild(item.elements.root);
        return item;
    }
} 

