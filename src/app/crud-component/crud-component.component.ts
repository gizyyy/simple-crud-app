import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Student } from '../shared/student';
import { StudentItem } from '../shared/student-item';
import { StudentService } from '../shared/student.service';

@Component({
  selector: 'app-crud-component',
  templateUrl: './crud-component.component.html',
  styleUrls: ['./crud-component.component.css'],
})
export class CrudComponentComponent implements OnInit, OnDestroy {
  students: Student[] = [];

  yougestStudents: Student[] = [];
  avarageAge: number = 0;
  registerForm: FormGroup;
  constructor(private studentService: StudentService) {}

  ngOnDestroy(): void {
    this.studentService.listChangedSubject.unsubscribe();
  }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      name: new FormControl('', Validators.required),
      age: new FormControl('', Validators.required),
    });

    this.studentService.listChangedSubject.subscribe(() => {
      this.studentService.getStudents().subscribe(() => {
        this.students = this.studentService.activeList;
      });
    });

    this.studentService.getStudents().subscribe(() => {
      this.students = this.studentService.activeList;
    });
  }

  onSubmit(student: StudentItem) {
    this.studentService.postStudents(student).subscribe();
  }

  onRemove(key: String) {
    this.studentService.deleteStudents(key).subscribe();
  }
}
