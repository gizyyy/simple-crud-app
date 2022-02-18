import { Injectable } from '@angular/core';
import { Student } from './student';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, Subject, Subscription } from 'rxjs';
import { StudentItem } from './student-item';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  listChangedSubject: Subject<any> = new Subject();
  getSubscription: Subscription = new Subscription();

  constructor(private httpClient: HttpClient) {}

  onGet(): Student[] {
    let list = [];
    this.getSubscription = this.getStudents()
      .pipe()
      .subscribe((response) => {
        if (response === undefined || response === null) {
          return list;
        }
        Object.keys(response).map(function (key) {
          list.push(new Student(key, response[key]));
        });
        return list;
      });
    return list;
  }

  getStudents() {
    return this.httpClient
      .get<Student[]>(
        'https://ng-complete-guide-9f2a2-default-rtdb.firebaseio.com/students.json'
      )
      .pipe();
  }

  //error management hatayi ekrana don
  postStudents(student: StudentItem) {
    let studentReturning: Student;

    this.httpClient
      .post(
        'https://ng-complete-guide-9f2a2-default-rtdb.firebaseio.com/students.json',
        student
      )
      .pipe()
      .subscribe((response) => {
        Object.keys(response).map(function (key) {
          studentReturning = new Student(response[key], student);
        });

        this.listChangedSubject.next(studentReturning);
      });
  }

  deleteStudents(key: String) {
    let studentReturning: Student;

    this.httpClient
      .delete(
        'https://ng-complete-guide-9f2a2-default-rtdb.firebaseio.com/students/' +
          key +
          '.json'
      )
      .pipe()
      .subscribe((response) => {
        this.listChangedSubject.next(response);
      });
  }
}
