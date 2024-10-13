import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  Renderer2,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Task} from '../../../models/task.model';
import {TaskService} from '../../../services/task.service';

@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class TaskEditComponent implements OnChanges {
  updateForm!: FormGroup;

  @Input() task!: Task;  // Receive the task from the parent
  @ViewChild('taskNameInput') taskNameInput!: ElementRef;
  @Output() taskUpdated = new EventEmitter<Task>();

  constructor(private fb: FormBuilder, private taskService: TaskService, private renderer: Renderer2) {
  }

  // Initialize the form with the task data when the task input changes
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task'] && changes['task'].currentValue) {
      const task = changes['task'].currentValue;
      this.updateForm = this.fb.group({
        name: [task.name, Validators.required]
      });
    }
  }

  // Focus the input field after the view is rendered
  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.taskNameInput) {
        this.renderer.selectRootElement(this.taskNameInput.nativeElement).focus();
      }
    });
  }

  async updateTask(): Promise<void> {
    if (this.updateForm.valid) {
      // quickly switch to view mode
      const updatedTask = {...this.task, ...this.updateForm.value};
      this.taskUpdated.emit(updatedTask);
      // update task in the background and trigger its modifications via observable object
      this.taskService.updateTask(updatedTask).subscribe({
        next: () => {
          console.log('Task updated successfully');
        }, error: (error) => {
          console.error('Error updating task:', error);
        }
      });
    }
  }
}
