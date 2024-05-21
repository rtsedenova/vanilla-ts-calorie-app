import Meal from "./Meal"
import Workout from "./Workout"

class Tracker {
    private _calorieLimit: number;
    private _totalCalories: number;
    protected _meals: Meal[]; 
    protected _workouts: Workout[]; 

    constructor(calorieLimit: number, totalCalories: number, meals: Meal[], workouts: Workout[]) {
        this._calorieLimit = calorieLimit;
        this._totalCalories = totalCalories;
        this._meals = meals; 
        this._workouts = workouts; 
    
        this._displayCaloriesTotal()
    }

// Public

    getMeals() {
        return this._meals;
    }

    getWorkouts() {
        return this._workouts;
    }

    addMeal(meal: Meal) {
        this._meals.push(meal);
        this._totalCalories += meal.calories; 

        this._displayAddedMeal(meal)
        this._render()
    }

    addWorkout(workout: Workout) {
        this._workouts.push(workout);
        this._totalCalories -= workout.calories; 

        this._displayAddedWorkout(workout)
        this._render()
    }

    removeMeal(meal: Meal) {
        this._meals = this._meals.filter(m => m.id !== meal.id);
        this._totalCalories -= meal.calories;
        this._render();
    }

    removeWorkout(workout: Workout) {
        this._workouts = this._workouts.filter(w => w.id !== workout.id);
        this._totalCalories += workout.calories;
        this._render();
    }

    reset() {
        console.log("Resetting tracker...");
        this._totalCalories = 0;
        this._meals = [];
        this._workouts = [];
        this._render();
    }

    setLimit(calorieLimit) {
        this._calorieLimit = calorieLimit;
        this._displayCaloriesLimit();
        this._render();
      }

    // Private

    _displayCaloriesTotal(){
        const totalCaloriesEl: HTMLElement | null = document.getElementById("calories-total")
        if (totalCaloriesEl) {
            totalCaloriesEl.innerHTML = String(this._totalCalories);
        } 
    }

    _displayCaloriesLimit(){
        const calorieLimitEl: HTMLElement | null = document.getElementById("calories-limit")
        if (calorieLimitEl) {
            calorieLimitEl.innerHTML = String(this._calorieLimit);
        } 
    }

    // переделать в функцию, чтобы она принимала тип
    _displayCaloriesConsumed(){
        const caloriesConsumedEl : HTMLElement | null = document.getElementById("calories-consumed")
        if (caloriesConsumedEl) {
            const consumed = this._meals.reduce(
                (total, meal) => total + meal.calories,
                0
            );
            // сделать свитч кейс для каждого типа
            caloriesConsumedEl.innerHTML = String(consumed);
        } 
    }

    _displayCaloriesBurned(){
        const caloriesBurnedEl : HTMLElement | null = document.getElementById("calories-burned")
        if (caloriesBurnedEl ) {
            const burned = this._workouts.reduce(
                (total, workout) => total + workout.calories,
                0
            );
            caloriesBurnedEl.innerHTML = String(burned);
        } 
    }

    _displayCaloriesRemaining(){
        const remainingEl : HTMLElement | null = document.getElementById("remainingEl")
        const caloriesRemainingEl : HTMLElement | null = document.getElementById("calories-remaining")
        const progressEl : HTMLElement | null = document.getElementById('calorie-progress');
        
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

        // посмотреть есть ли стандартная функция clamp если нет то написать самой, 
        //потом сравнить что есть в тутриале каком нибудь или chatgpt
        // использовать её для this._totalCalories вместо this._totalCalories
        if (progressEl) {
            const progress = (this._totalCalories / this._calorieLimit) * 100;
            progressEl.style.width = progress + "%";
        }
    }

    _displayAddedMeal(meal: Meal){
        const mealsEl = document.getElementById('meal-items');
        if (mealsEl) {
            mealsEl.appendChild(this._createCard(meal));
        }
    }

    _displayAddedWorkout(workout: Workout){
        const workoutsEl = document.getElementById('workout-items');
        if (workoutsEl) {
            workoutsEl.appendChild(this._createCard(workout));
        }
    }

    _createCard(item: Meal | Workout): HTMLElement {
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
        return card
    }

    _removeItem(item: Meal | Workout, card: HTMLElement) {
        if (item instanceof Meal) {
            this.removeMeal(item);
        } else {
            this.removeWorkout(item);
        }

        card.remove();
    }

    _render(){
        this._displayCaloriesTotal()
        this._displayCaloriesLimit()
        this._displayCaloriesConsumed()
        this._displayCaloriesBurned()
        this._displayCaloriesRemaining()
    }
}

export default Tracker
