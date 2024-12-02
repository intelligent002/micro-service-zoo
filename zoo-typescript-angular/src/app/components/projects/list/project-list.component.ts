import {Component, OnInit} from '@angular/core';
import {ProjectService} from '../../../services/project.service';
import {TaskService} from '../../../services/task.service';
import {concatMap, Observable, of} from 'rxjs';
import {Project} from '../../../models/project.model';
import {TaskListComponent} from '../../tasks/list/task-list.component';
import {AsyncPipe, DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {ProjectCreateComponent} from '../create/project-create.component';
import {ProjectEditComponent} from '../edit/project-edit.component';
import {CdkDragDrop, CdkDropList} from '@angular/cdk/drag-drop';
import {Task} from '../../../models/task.model';

@Component({
  selector: 'app-projects',
  templateUrl: './project-list.component.html',
  standalone: true,
  imports: [TaskListComponent, AsyncPipe, DatePipe, ProjectCreateComponent, NgIf, NgForOf, ProjectEditComponent, CdkDropList, NgClass],
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {

  showCreateForm: boolean = false;

  // Use observables from the service
  projects$: Observable<Project[]> = of([]);
  connectedDropZones$: Observable<string[]> = of([]);
  isDragging: boolean = false;

  constructor(public projectService: ProjectService, public taskService: TaskService) {
  }

  ngOnInit(): void {

    // Just load the projects from the server, reactivity handled by observables
    this.projects$ = this.projectService.getProjects();
    this.connectedDropZones$ = this.projectService.getConnectedDropZones();
    this.projectService.loadProjectsFromServer().subscribe();
  }

  toggleCreateProject(): void {
    this.showCreateForm = !this.showCreateForm;
  }

  handleProjectCreated(): void {
    this.showCreateForm = false;
  }

  toggleUpdateProject(project: Project): void {
    project.isEditing = !project.isEditing;
  }

  handleProjectUpdated(project: Project): void {
    project.isEditing = false;
  }

  deleteProject(projectId: number): void {
    if (confirm('Are you sure you want to delete this project and its tasks?')) {
      this.projectService.deleteProject(projectId).subscribe();
    }
  }

  toggleTasksListView(project: Project): void {
    project.isExpanded = !project.isExpanded;
  }

  onDragStart() {
    setTimeout(() => {
      this.isDragging = true;
      console.debug('drag started');
    });

  }

  onDragEnd() {
    setTimeout(() => {
      this.isDragging = false;
      console.debug('drag ended');
    });
  }

  // Middleware that detects drop on project card level
  onProjectDrop(
    {
      $event,
      project
    }: {
      $event: CdkDragDrop<any>,
      project: Project
    }
  ): void {
    console.debug('migration without priority')
    // Get tasks from the previous project
    const sourceTasks = $event.previousContainer.data as Task[];
    // The task that was moved
    const movedTask = sourceTasks[$event.previousIndex];
    // Send updated task information to the server to persist changes
    this.taskService.migrateTask({
      task: movedTask,
      project: project,
    }).pipe(
      // Once migration is complete, load tasks for the source project
      concatMap(() => this.taskService.loadTasksFromServer(movedTask.project_id)),
      // Once the source project tasks are loaded, load tasks for the target project
      concatMap(() => this.taskService.loadTasksFromServer(project.id)),
    ).subscribe({
      next: () => {
        console.debug('Migration and task reloading completed successfully.');
      },
      error: (error) => {
        console.error('Error during task migration or loading:', error);
      }
    });
  }
}
