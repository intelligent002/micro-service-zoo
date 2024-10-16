import {Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
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

  constructor(private fb: FormBuilder, private taskService: TaskService, private renderer: Renderer2) {
    this.createForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  // Focus the input field after the view is rendered
  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.taskNameInput) {
        this.renderer.selectRootElement(this.taskNameInput.nativeElement).focus();
      }
    });
  }

  ngOnInit(): void {
  }

  createTask(): void {
    if (this.createForm.valid) {
      // let's speed up a bit the hide of the form
      this.taskCreated.emit();
      // and now handle the creation
      const taskData = this.createForm.value;
      this.taskService.createTask({
        projectId: this.project.id,
        taskData: taskData
      }).subscribe();
    }
  }
}
