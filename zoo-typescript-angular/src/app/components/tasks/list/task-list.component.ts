import {Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TaskService} from '../../../services/task.service';
import {Observable, of} from 'rxjs';
import {Task} from '../../../models/task.model';
import {TaskCreateComponent} from '../create/task-create.component';
import {TaskEditComponent} from '../edit/task-edit.component';
import {Project} from '../../../models/project.model';
import {FormsModule} from '@angular/forms';
import {ProjectCreateComponent} from '../../projects/create/project-create.component';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, TaskCreateComponent, TaskEditComponent, ProjectCreateComponent]
})
export class TaskListComponent implements OnInit {
  @Input() project!: Project;
  tasks$: Observable<Task[]> = of([]);
  // Control create form visibility
  showCreateForm: boolean = false;

  constructor(public taskService: TaskService) {
  }

  ngOnInit(): void {
    this.taskService.loadTasksFromServer(this.project.id);
    this.tasks$ = this.taskService.getTasks(this.project.id);
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.loadTasksFromServer(this.project.id);
  }

  // project create related
  toggleCreateTask(): void {
    this.showCreateForm = !this.showCreateForm;
  }

  handleTaskCreated(): void {
    this.showCreateForm = false;  // Hide the form after submission
  }


  // project edit related controls:
  toggleUpdateTask(task: Task): void {
    task.isEditing = !task.isEditing;
  }

  handleTaskUpdated(task: Task): void {
    task.isEditing = false;  // Hide the form after submission
  }

  reorderTask(taskId: number, direction: 'up' | 'down'): void {
    this.taskService.prioritizeTasks(this.project.id);
  }

  moveTask(taskId: number, anotherProjectId: number): void {
    this.taskService.migrateTasks(taskId);
  }

  deleteTask(taskId: number): void {
    this.taskService.deleteTask(this.project.id, taskId).subscribe();
  }
}
