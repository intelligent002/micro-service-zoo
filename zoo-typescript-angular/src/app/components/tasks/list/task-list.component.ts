// Your existing imports
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TaskService} from '../../../services/task.service';
import {Observable, of} from 'rxjs';
import {Task} from '../../../models/task.model';
import {TaskCreateComponent} from '../create/task-create.component';
import {TaskEditComponent} from '../edit/task-edit.component';
import {Project} from '../../../models/project.model';
import {FormsModule} from '@angular/forms';
import {ProjectCreateComponent} from '../../projects/create/project-create.component';
import {CdkDragDrop, CdkDropList, DragDropModule, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {tap} from 'rxjs/operators'; // Ensure all CDK imports are correct

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, TaskCreateComponent, TaskEditComponent, ProjectCreateComponent, CdkDropList, DragDropModule]
})
export class TaskListComponent implements OnInit {
  @Input() project!: Project;
  @Input() allConnectedDropLists: string[] = [];
  @Output() dragStartedEvent = new EventEmitter<void>();
  @Output() dragEndedEvent = new EventEmitter<void>();
  tasks$: Observable<Task[]> = of([]);

  // Control create form visibility
  showCreateForm: boolean = false;

  constructor(public taskService: TaskService) {
  }

  ngOnInit(): void {
    // Subscribe to the tasks$ observable and update the task count
    this.tasks$ = this.taskService.getTasks(this.project).pipe(
      tap(tasks => {
        this.project.gotTasks = (0 < tasks.length)
        console.log('project id: ', this.project.id, ' gotTasks: ', this.project.gotTasks, ' count: ', tasks.length)
      })
    );
  }

  // Task create related
  toggleCreateTask(): void {
    this.showCreateForm = !this.showCreateForm;
  }

  // Task create related
  handleTaskCreated(): void {
    this.showCreateForm = false;
  }

  // Task edit related
  toggleUpdateTask(task: Task): void {
    task.isEditing = !task.isEditing;
  }

  // Task edit related
  handleTaskUpdated(task: Task): void {
    task.isEditing = false;
  }

  // Delete task
  deleteTask(taskId: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask({
        projectId: this.project.id,
        taskId: taskId
      }).subscribe();
    }
  }

  // Emit dragStartedEvent when dragging starts
  onDragStart() {
    this.dragStartedEvent.emit();
  }

  // Emit dragEndedEvent when dragging ends
  onDragEnd() {
    this.dragEndedEvent.emit();
  }

  // migration between projects or prioritizing
  onListDrop(
    {
      $event,
      project
    }: {
      $event: CdkDragDrop<Task[], any>,
      project: Project
    }
  ): void {
    if ($event.previousContainer === $event.container) {
      // Reordering within the same project
      console.log('Prioritization');
      // Reorder the tasks directly from event.container.data
      moveItemInArray($event.container.data, $event.previousIndex, $event.currentIndex);
      // Get task IDs for reordering
      const taskIds = $event.container.data.map(task => task.id);
      // Send updated task order to server
      this.taskService.prioritizeTasks({
        projectId: project.id,
        taskIds: taskIds
      }).subscribe();
    } else {
      console.log('Migration with priority');
      // Get tasks from the previous project
      const sourceTasks = $event.previousContainer.data as Task[];
      // Get tasks from the target project
      const targetTasks = $event.container.data as Task[];
      // Transfer task from the previous project to the new project
      transferArrayItem(sourceTasks, targetTasks, $event.previousIndex, $event.currentIndex);
      // The task that was moved
      const movedTask = targetTasks[$event.currentIndex];
      // Get source project id
      const sourceProjectId = movedTask.project_id;
      // Update project ID for the task
      movedTask.project_id = project.id;
      // Send updated task information to the server to persist changes
      this.taskService.migrateTask({
        task: movedTask,
        project: project,
      }).subscribe();
      this.taskService.updateTasksState({projectId: sourceProjectId, tasks: sourceTasks});
      this.taskService.updateTasksState({projectId: project.id, tasks: targetTasks});
      this.taskService.prioritizeTasks({
        taskIds: sourceTasks.map(task => task.id),
        projectId: sourceProjectId,
      }).subscribe();
      this.taskService.prioritizeTasks({
        taskIds: targetTasks.map(task => task.id),
        projectId: project.id,
      }).subscribe();
    }
  }
}
