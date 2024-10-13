import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {TaskService} from '../../../services/task.service';
import {CommonModule} from '@angular/common';
import {Task} from '../../../models/task.model';
import {Project} from '../../../models/project.model';

@Component({
  selector: 'app-task-create',
  templateUrl: './task-create.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  styleUrls: ['./task-create.component.scss']
})

export class TaskCreateComponent implements OnInit {
  createForm: FormGroup;

  @Input() project!: Project;
  @Output() taskCreated = new EventEmitter<Task>();
  @ViewChild('taskNameInput') taskNameInput!: ElementRef;

  constructor(private fb: FormBuilder, private taskService: TaskService) {
    this.createForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngAfterViewInit(): void {
    // Automatically focus on the task name input field when the component is loaded
    this.taskNameInput.nativeElement.focus();
  }

  ngOnInit(): void {
  }

  async createTask(): Promise<void> {
    if (this.createForm.valid) {
      // let's speed up a bit the hide of the form
      this.taskCreated.emit();
      // and now handle the creation
      const taskData = this.createForm.value;
      this.taskService.createTask({projectId: this.project.id, taskData: taskData}).subscribe({
        next: () => {
          console.log('Task created successfully');
        }, error: (error) => {
          console.error('Error creating project:', error);
        }
      });
    }
  }
}
