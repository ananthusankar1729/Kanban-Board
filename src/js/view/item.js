import KanbanAPI from "../api/kanbanAPI.js";

export default class Item{
    constructor(id, content){
        this.id = id;
        this.elements = {};
        this.elements.root = Item.createRoot();
        this.elements.input = this.elements.root.querySelector(".kanban_item_input")
        this.elements.root.dataset.id = id;
        this.elements.input.textContent = content;
        this.content = content;

        // save on blur
        this.elements.input.addEventListener("blur", () => {
            const newContent = this.elements.input.textContent.trim();
            if (newContent !== this.content) {
                this.content = newContent;
                KanbanAPI.updateItem(this.id, { content: this.content });
            }
        });

        // pressing Enter finishes editing
        this.elements.input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                this.elements.input.blur();
            }
        });

        // drag handlers
        this.elements.root.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text/plain", this.id);
            e.dataTransfer.effectAllowed = "move";
            setTimeout(() => this.elements.root.classList.add("kanban_dragging"), 0);
        });

        this.elements.root.addEventListener("dragend", (e) => {
            this.elements.root.classList.remove("kanban_dragging");
        });
    }

    static createRoot(){
        const range = document.createRange();

        range.selectNode(document.body);
        return range.createContextualFragment(`
            <div class="kanban_item" draggable="true">
                <div class="kanban_item_input" contenteditable></div>
            </div>
            `).children[0];
    } 
}