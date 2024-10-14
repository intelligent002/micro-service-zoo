// Your existing imports
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
import {CdkDragDrop, CdkDropList, DragDropModule, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop'; // Ensure all CDK imports are correct

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, TaskCreateComponent, TaskEditComponent, ProjectCreateComponent, CdkDropList, DragDropModule]
})
export class TaskListComponent implements OnInit {
  @Input() project!: Project;
  @Input() connectedDropLists: string[] | null = [];
  tasks$: Observable<Task[]> = of([]);

  // Control create form visibility
  showCreateForm: boolean = false;

  constructor(public taskService: TaskService) {
  }

  ngOnInit(): void {
    this.tasks$ = this.taskService.getTasks(this.project.id);
    this.loadTasks();  // Load tasks from server
  }

  loadTasks(): void {
    this.taskService.loadTasksFromServer(this.project.id);
  }

  // Task create related
  toggleCreateTask(): void {
    this.showCreateForm = !this.showCreateForm;
  }

  handleTaskCreated(): void {
    this.showCreateForm = false;
  }

  // Task edit related
  toggleUpdateTask(task: Task): void {
    task.isEditing = !task.isEditing;
  }

  handleTaskUpdated(task: Task): void {
    task.isEditing = false;
  }

  drop(event: CdkDragDrop<Task[], any>, targetProject: Project): void {
    if (event.previousContainer === event.container) {
      // Reordering within the same project
      console.log('same container');

      // Reorder the tasks directly from event.container.data
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      const taskIds = event.container.data.map(task => task.id);  // Get task IDs for reordering

      // Send updated task order to server
      this.taskService.prioritizeTasks({
        projectId: targetProject.id,
        taskIds: taskIds
      }).subscribe(() => {
        console.log('Task order updated successfully within the same project');
      });
    } else {
      // Moving task to a different project
      console.log('other container');

      // Ensure data is transferred between project task arrays
      const previousTasks = event.previousContainer.data as Task[]; // Get tasks from the previous project
      const targetTasks = event.container.data as Task[];  // Get tasks from the target project

      // Transfer task from the previous project to the new project
      transferArrayItem(previousTasks, targetTasks, event.previousIndex, event.currentIndex);

      // The task that was moved
      const movedTask = targetTasks[event.currentIndex];
      movedTask.project_id = targetProject.id;  // Update project ID for the task

      // Send updated task information to the server to persist changes
      this.taskService.migrateTask({
        taskId: movedTask.id,
        projectId: targetProject.id,
      }).subscribe(() => {
        console.log(`Task ${movedTask.id} migrated to project ${targetProject.id} successfully`);
      });
    }
  }


  // Delete task
  deleteTask(taskId: number): void {
    this.taskService.deleteTask({
      projectId: this.project.id,
      taskId: taskId
    }).subscribe();
  }
}
