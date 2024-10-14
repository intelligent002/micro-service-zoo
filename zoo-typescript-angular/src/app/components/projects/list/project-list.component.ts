import {Component, OnInit} from '@angular/core';
import {ProjectService} from '../../../services/project.service';
import {TaskService} from '../../../services/task.service';
import {Observable, of} from 'rxjs';
import {Project} from '../../../models/project.model';
import {TaskListComponent} from '../../tasks/list/task-list.component';
import {AsyncPipe, DatePipe, NgForOf, NgIf} from '@angular/common';
import {ProjectCreateComponent} from '../create/project-create.component';
import {ProjectEditComponent} from '../edit/project-edit.component';

@Component({
  selector: 'app-projects',
  templateUrl: './project-list.component.html',
  standalone: true,
  imports: [TaskListComponent, AsyncPipe, DatePipe, ProjectCreateComponent, NgIf, NgForOf, ProjectEditComponent],
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {

  showCreateForm: boolean = false;
  tasksListVisible: { [projectId: number]: boolean } = {};

  // Use observables from the service
  projects$: Observable<Project[]> = of([]);
  connectedDropLists$: Observable<string[]> = of([]);

  constructor(public projectService: ProjectService, public taskService: TaskService) {
  }

  ngOnInit(): void {

    // Just load the projects from the server, reactivity handled by observables
    this.projects$ = this.projectService.getProjects();
    this.connectedDropLists$ = this.projectService.getConnectedDropLists();
    this.projectService.loadProjectsFromServer();
    this.connectedDropLists$.subscribe(dropLists => {
      console.log('Drop lists are ready:', dropLists);
    });
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
      this.projectService.deleteProject(projectId).subscribe(() => {
        console.log('Project deleted successfully');
      });
    }
  }

  toggleTasksListView(projectId: number): void {
    this.tasksListVisible[projectId] = !this.tasksListVisible[projectId];
    if (this.tasksListVisible[projectId]) {
      this.taskService.loadTasksFromServer(projectId);
    }
  }
}
