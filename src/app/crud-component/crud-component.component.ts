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
  registerForm: FormGroup;
  constructor(private studentService: StudentService) {}

  refreshedSubscribe = new Subscription();

  ngOnDestroy(): void {
    this.refreshedSubscribe.unsubscribe();
  }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      name: new FormControl('', Validators.required),
      age: new FormControl('', Validators.required),
    });
    this.students = this.studentService.onGet();

    this.studentService.listChangedSubject.subscribe(() => {
      this.students = this.studentService.onGet();
    });
  }

  onSubmit(student: StudentItem) {
    this.studentService.postStudents(student);
  }

  onRemove(key: String) {
    this.studentService.deleteStudents(key);
  }
}
