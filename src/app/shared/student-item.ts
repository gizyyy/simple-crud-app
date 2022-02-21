export class StudentItem {
  constructor(public name: String, public age: number) {}

  getAge(): number {
    return this.age;
  }
}
