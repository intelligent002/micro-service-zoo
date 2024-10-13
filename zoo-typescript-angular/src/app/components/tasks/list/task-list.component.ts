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
import {CdkDragDrop, CdkDropList, DragDropModule, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, TaskCreateComponent, TaskEditComponent, ProjectCreateComponent, CdkDropList, DragDropModule]
})
export class TaskListComponent implements OnInit {
  @Input() project!: Project;
  tasks$: Observable<Task[]> = of([]);
  // Control create form visibility
  showCreateForm: boolean = false;

  constructor(public taskService: TaskService) {
  }

  ngOnInit(): void {
    this.tasks$ = this.taskService.getTasks(this.project.id);
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.loadTasksFromServer(this.project.id);
  }

  // task create related
  toggleCreateTask(): void {
    this.showCreateForm = !this.showCreateForm;
  }

  // task create related
  handleTaskCreated(): void {
    this.showCreateForm = false;  // Hide the form after submission
  }

  // task edit related
  toggleUpdateTask(task: Task): void {
    task.isEditing = !task.isEditing;
  }

  // task edit related
  handleTaskUpdated(task: Task): void {
    task.isEditing = false;  // Hide the form after submission
  }

  drop(event: CdkDragDrop<Task[]>): void {
    // Subscribe to the tasks$ observable to access the current task list
    this.tasks$.subscribe(tasks => {
      moveItemInArray(tasks, event.previousIndex, event.currentIndex);
      const taskIds = tasks.map(task => task.id);

      // Optionally, update the task order on the server
      this.taskService.prioritizeTasks(this.project.id, taskIds).subscribe(() => {
        console.log('Task order updated successfully');
      });
    });
  }

  reorderTask(taskId: number, direction: 'up' | 'down'): void {
    this.taskService.prioritizeTasks(this.project.id, []);
  }

  moveTask(taskId: number, anotherProjectId: number): void {
    this.taskService.migrateTasks(taskId);
  }

  deleteTask(taskId: number): void {
    this.taskService.deleteTask(this.project.id, taskId).subscribe();
  }
}
