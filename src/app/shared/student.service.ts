import { Injectable } from '@angular/core';
import { Student } from './student';
import { HttpClient } from '@angular/common/http';
import {
  catchError,
  EMPTY,
  map,
  Observable,
  of,
  pluck,
  reduce,
  Subject,
  Subscription,
  take,
  tap,
} from 'rxjs';
import { StudentItem } from './student-item';
import { isNgTemplate } from '@angular/compiler';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  listChangedSubject: Subject<void> = new Subject();
  activeList: Student[] = [];
  youngestList: Student[] = [];

  constructor(private httpClient: HttpClient) {}

  getStudents(): Observable<any> {
    let list: Student[] = [];
    let result = this.httpClient
      .get<Student[]>(
        'https://ng-complete-guide-9f2a2-default-rtdb.firebaseio.com/students.json'
      )
      .pipe(
        map((items) => {
          Object.keys(items).map((studentId) => {
            list.push(new Student(studentId, items[studentId]));
          });
          this.activeList = list;
        }),
        catchError(() => EMPTY)
      );
    return result;
  }

  //error management hatayi ekrana don
  postStudents(student: StudentItem): Observable<any> {
    return this.httpClient
      .post(
        'https://ng-complete-guide-9f2a2-default-rtdb.firebaseio.com/students.json',
        student
      )
      .pipe(
        map((response) => {
          Object.keys(response).map((studentId) => {
            this.activeList.push(new Student(response[studentId], student));
          });
          this.listChangedSubject.next();
        }),
        catchError(() => EMPTY)
      );
  }

  deleteStudents(key: String): Observable<any> {
    return this.httpClient
      .delete(
        'https://ng-complete-guide-9f2a2-default-rtdb.firebaseio.com/students/' +
          key +
          '.json'
      )
      .pipe(
        tap(() => {
          this.activeList.forEach((value, index) => {
            if (value.key == key) this.activeList.splice(index, 1);
          });
          this.listChangedSubject.next();
        }),
        catchError(() => EMPTY)
      );
  }
}
