import {Component, OnInit} from '@angular/core';
import {ProjectService} from '../../../services/project.service';
import {TaskService} from '../../../services/task.service';
import {CommonModule} from '@angular/common';
import {ProjectCreateComponent} from '../create/project-create.component';
import {Project} from '../../../models/project.model';
import {FormsModule} from '@angular/forms';
import {ProjectEditComponent} from '../edit/project-edit.component';
import {TaskListComponent} from '../../tasks/list/task-list.component';

@Component({
  selector: 'app-projects',
  templateUrl: './project-list.component.html',
  standalone: true,
  styleUrls: ['./project-list.component.scss'],
  imports: [CommonModule, FormsModule, ProjectCreateComponent, ProjectEditComponent, TaskListComponent]
})
export class ProjectListComponent implements OnInit {

  // Control create form visibility
  showCreateForm: boolean = false;

  // Control task visibility per each project
  tasksListVisible: { [projectId: number]: boolean } = {};

  constructor(public projectService: ProjectService, public taskService: TaskService) {
  }

  // project create related
  toggleCreateProject(): void {
    this.showCreateForm = !this.showCreateForm;
  }

  handleProjectCreated(): void {
    this.showCreateForm = false;  // Hide the form after submission
  }

  ngOnInit(): void {
    // Trigger projects loading, this shall happen once, since we use RouteReuseStrategy
    console.debug('issued full load of projects');
    this.projectService.loadProjectsFromServer();
  }

  // project edit related controls:
  toggleUpdateProject(project: Project): void {
    project.isEditing = !project.isEditing;
  }

  handleProjectUpdated(project: Project): void {
    project.isEditing = false;
  }

  // project delete related controls:
  deleteProject(projectId: number): void {
    if (confirm('Are you sure you want to delete this project and its tasks?')) {
      // Dispatch REST method for deletion from server side
      this.projectService.deleteProject(projectId).subscribe({
        next: () => {
          console.log('Project deleted successfully');
        }, error: () => {
          // Reload the projects list from server after a failed deletion
          console.error('Error deleting project, issued full load of projects');
          this.projectService.loadProjectsFromServer();
        }
      });
    }
  }

  // task view related
  toggleTasksListView(projectId: number): void {
    this.tasksListVisible[projectId] = !this.tasksListVisible[projectId];
    if (this.tasksListVisible[projectId]) {
      // Load tasks when expanding
      this.taskService.loadTasksFromServer(projectId);
    }
  }
}
