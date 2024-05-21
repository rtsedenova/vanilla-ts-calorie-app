import Tracker from './classes/tracker';

import ParentClass from "./classes/ParentClass"

interface TrackerAppInterface {
    _tracker: Tracker;
}

class App implements TrackerAppInterface {
    _tracker: Tracker;

    constructor(calorieLimit: number, totalCalories: number, items: ParentClass[]) {
        this._tracker = new Tracker(calorieLimit, totalCalories, items);

        this._tracker._render();

        this._eventListeners();
    }

    _eventListeners(): void {
        const mealBtn = document.getElementById('meal-btn');
        mealBtn?.addEventListener('click', this._toggleForm.bind(this, 'meal'));

        const workoutBtn = document.getElementById('workout-btn');
        workoutBtn?.addEventListener('click', this._toggleForm.bind(this, 'workout'));

        const mealForm = document.getElementById('meal-form');
        mealForm?.addEventListener('submit', this._newItem.bind(this, 'meal'));

        const workoutForm = document.getElementById('workout-form');
        workoutForm?.addEventListener('submit', this._newItem.bind(this, 'workout'));

        document.getElementById('filter-meals')?.addEventListener('keyup', this._filterItems.bind(this, 'meal'));
        document.getElementById('filter-workouts')?.addEventListener('keyup', this._filterItems.bind(this, 'workout'));
        document.getElementById('reset-btn')?.addEventListener('click', this._reset.bind(this));
        document.getElementById('set-daily-limit')?.addEventListener('click', this._showLimitModal.bind(this));
        document.getElementById('limit-form')?.addEventListener('submit', this._setLimit.bind(this));
        document.getElementById('close-modal-btn')?.addEventListener('click', this._closeLimitModal.bind(this));
    }

    _toggleForm(type: string) {
        const collapseElement = document.querySelector(`.collapse-${type}`);
        collapseElement?.classList.toggle('show');
    }

    _newItem(type: string, e: Event) {
        e.preventDefault();

        const nameInput = document.getElementById(`${type}-name`) as HTMLInputElement;
        const caloriesInput = document.getElementById(`${type}-calories`) as HTMLInputElement;

        if (!nameInput.value || !caloriesInput.value) {
            alert('Please fill in all fields');
            return;
        }

        const item = new ParentClass(nameInput.value, +caloriesInput.value, type);
        this._tracker.addItem(item);

        nameInput.value = '';
        caloriesInput.value = '';
    }

    _filterItems(type: string, e: Event): void {
        const input = e.target as HTMLInputElement;
        const text = input.value.toLowerCase();

        const items = document.querySelectorAll(`#${type}-items .card`);
        items.forEach((item) => {
            const nameElement = item.firstElementChild?.firstElementChild as HTMLElement;
            const name = nameElement?.textContent?.toLowerCase();

            if (name && name.indexOf(text) !== -1) {
                (item as HTMLElement).style.display = 'block';
            } else {
                (item as HTMLElement).style.display = 'none';
            }
        });
    }

    _showLimitModal(e: Event): void {
        e.preventDefault();
        console.log('set visible');
        const modal = document.querySelector('.limit-modal') as HTMLDivElement;

        modal.classList.toggle('visible');
    }

    _closeLimitModal(e: Event): void {
        const modal = document.querySelector('.limit-modal') as HTMLDivElement;
        modal.classList.remove("visible");
    }

    _setLimit(e: Event) {
        e.preventDefault();
        const limit = document.getElementById("limit") as HTMLInputElement;

        if (limit.value === '') {
            alert('Please add a limit');
            return;
        }

        this._tracker.setLimit(+limit.value);
        limit.value = '';
    }

    _reset() {
        console.log("Resetting app...");
        this._tracker.reset();

        const mealItems = document.getElementById('meal-items')!;
        mealItems.innerHTML = '';

        const workoutItems = document.getElementById('workout-items')!;
        workoutItems.innerHTML = '';

        const filterMeals = document.getElementById('filter-meals') as HTMLInputElement;
        filterMeals.value = '';

        const filterWorkouts = document.getElementById('filter-workouts') as HTMLInputElement;
        filterWorkouts.value = '';
    }
}

const app = new App(2000, 0, []);
