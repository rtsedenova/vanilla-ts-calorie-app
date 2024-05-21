class ParentClass {
    id: string;
    name: string;
    calories: number;
    type: string;

    constructor(name: string, calories: number, type: string) {
        this.id = Math.random().toString(16).slice(2);
        this.name = name;
        this.calories = calories;
        this.type = type;
    }
}

export default ParentClass;