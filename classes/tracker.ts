import ParentClass from './ParentClass'

class Tracker {
    private _calorieLimit: number;
    private _totalCalories: number;
    private _items: ParentClass[]; 

    constructor(calorieLimit: number, totalCalories: number, items: ParentClass[]) {
        this._calorieLimit = calorieLimit;
        this._totalCalories = totalCalories;
        this._items = items; 
    
        this._displayCaloriesTotal();
    }

// Public

getItems() {
    return this._items;
}

addItem(item: ParentClass) {
    this._items.push(item);
    if (item.type === 'meal') {
        this._totalCalories += item.calories;
    } else {
        this._totalCalories -= item.calories;
    }

    this._displayAddedItem(item);
    this._render();
}

removeItem(item: ParentClass) {
    this._items = this._items.filter(i => i.id !== item.id);
    if (item.type === 'meal') {
        this._totalCalories -= item.calories;
    } else {
        this._totalCalories += item.calories;
    }
    this._render();
}

reset() {
    this._totalCalories = 0;
    this._items = [];
    this._render();
}

setLimit(calorieLimit: number) {
    this._calorieLimit = calorieLimit;
    this._displayCaloriesLimit();
    this._render();
}

    // Private

_displayCaloriesTotal() {
    const totalCaloriesEl: HTMLElement | null = document.getElementById("calories-total");
    if (totalCaloriesEl) {
        totalCaloriesEl.innerHTML = String(this._totalCalories);
    } 
}

_displayCaloriesLimit() {
    const calorieLimitEl: HTMLElement | null = document.getElementById("calories-limit");
    if (calorieLimitEl) {
        calorieLimitEl.innerHTML = String(this._calorieLimit);
    } 
}

_displayCaloriesActions(type: string, action: string){
    const caloriesEl: HTMLElement | null = document.getElementById(`calories-${action}`)!; 
    if (type === 'meal'){
        action = "consumed"
        const consumed = this._items.filter(item => item.type === 'meal').reduce((total, item) => total + item.calories, 0);
        caloriesEl.innerHTML = String(consumed);
    } else if (type === "workout") {
        action = "burned"
        const burned = this._items.filter(item => item.type === 'workout').reduce((total, item) => total + item.calories, 0);
        caloriesEl.innerHTML = String(burned);
    }
}


_displayCaloriesRemaining(){
    const remainingEl : HTMLElement | null = document.getElementById("remainingEl")
    const caloriesRemainingEl : HTMLElement | null = document.getElementById("calories-remaining")
    const progressEl = document.getElementById('calorie-progress')!

    const remaining = this._calorieLimit - this._totalCalories;

    if (caloriesRemainingEl) {
        caloriesRemainingEl.innerHTML = String(remaining);
    
        if (remainingEl) {
            if (remaining <= 0) {
                remainingEl.classList.remove("stats-item-lower");
                remainingEl.classList.add("negative-remaining");
    
                caloriesRemainingEl.classList.add("warning-state");
                caloriesRemainingEl.classList.remove("usual-state");
            } else {
                remainingEl.classList.add("stats-item-lower");
                remainingEl.classList.remove("negative-remaining");
    
                caloriesRemainingEl.classList.remove("warning-state");
                caloriesRemainingEl.classList.add("usual-state");
            }
        } 
    }

    // написать clamp функцию, принимающую мин, макс и среднее значение
    if (progressEl) {
        const progress = (this._totalCalories / this._calorieLimit) * 100;
        progressEl.style.width = this._clamp(0, progress , 100) + "%";
    }

}

_clamp(min: number, value: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

_displayAddedItem(item: ParentClass) {
    const itemsEl = document.getElementById(`${item.type}-items`);
    if (itemsEl) {
        itemsEl.appendChild(this._createCard(item));
    }
}

_createCard(item: ParentClass): HTMLElement {
    const card = document.createElement('div');
    card.classList.add('card');
    card.setAttribute('data-id', item.id);
    card.innerHTML = `
        <div class="card-body flex-row">
            <h4>${item.name}</h4>
            <div class="card-calories">
                Calories: <span>${item.calories}</span>
            </div>
            <button class="noselect">
                <span class="text">Delete</span>
                <span class="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"></path></svg>
                </span>
            </button>
        </div>
        <div class="delete-popup">
            <p>Are you sure?</p>
            <div class="flex-row">
                <button class="agree-btn">Yes</button>
                <button class="disagree-btn">Cancel</button>
            </div>
        </div>
    `;

    const noselectBtn = card.querySelector('.noselect') as HTMLButtonElement;
    const popup = card.querySelector('.delete-popup') as HTMLDivElement;

    if (noselectBtn && popup) {
        noselectBtn.addEventListener('click', () => {
            popup.style.display = popup.style.display === 'block' ? 'none' : 'block';
        });

        const agreeBtn = popup.querySelector('.agree-btn') as HTMLButtonElement;
        if (agreeBtn) {
            agreeBtn.addEventListener('click', () => {
                this._removeItem(item, card);
            });
        }

        const disagreeBtn = popup.querySelector('.disagree-btn') as HTMLButtonElement;
        if (disagreeBtn) {
            disagreeBtn.addEventListener('click', () => {
                popup.style.display = 'none';
            });
        }
    }
    return card;
}

_removeItem(item: ParentClass, card: HTMLElement) {
    this.removeItem(item);
    card.remove();
}

_render() {
    this._displayCaloriesTotal();
    this._displayCaloriesLimit();
    this._displayCaloriesActions('meal', 'consumed')
    this._displayCaloriesActions('workout', 'burned')
    this._displayCaloriesRemaining();
    }
}

export default Tracker
