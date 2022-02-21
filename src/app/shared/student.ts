import { StudentItem } from './student-item';

export class Student {
  constructor(public key: String, public studentItem: StudentItem) {}
  getStudentItem(): StudentItem {
    return this.studentItem;
  }
}
