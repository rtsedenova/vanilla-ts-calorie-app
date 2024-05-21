class Workout {
    id: string
    name: string
    calories: number
    constructor(name:string, calories:number) {
      this.id = Math.random().toString(16).slice(2);
      this.name = name;
      this.calories = calories;
    }
  }

  export default Workout