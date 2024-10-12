import {Component, OnInit} from '@angular/core';
import {ProjectService} from '../../../services/project.service';
import {Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {TasksComponent} from '../../tasks/tasks.component';
import {ProjectCreateComponent} from '../create/project-create.component';
import {Project} from '../../../models/project.model';
import {FormsModule} from '@angular/forms';
import {ProjectEditComponent} from '../edit/project-edit.component';

@Component({
  selector: 'app-projects',
  templateUrl: './project-list.component.html',
  standalone: true,
  styleUrls: ['./project-list.component.scss'],
  imports: [CommonModule, TasksComponent, ProjectCreateComponent, FormsModule, ProjectEditComponent]
})
export class ProjectListComponent implements OnInit {

  // project create related controls:
  showCreateForm: boolean = false;  // Control create form visibility

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // project list related controls:

  constructor(public projectService: ProjectService, private router: Router) {
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  ngOnInit(): void {
    // Trigger projects loading, this shall happen once, since we use RouteReuseStrategy
    console.debug('issued full load of projects');
    this.projectService.loadProjectsFromServer();
  }

  toggleCreateProject(): void {
    this.showCreateForm = !this.showCreateForm;
  }

  handleProjectCreated(): void {
    this.showCreateForm = false;  // Hide the form after submission
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // project edit related controls:

  toggleUpdateProject(project: Project): void {
    project.isEditing = !project.isEditing;
  }

  handleProjectUpdated(project: Project): void {
    project.isEditing = false;  // Hide the form after submission
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // project delete related controls:

  deleteProject(projectId: number): void {
    if (confirm('Are you sure you want to delete this project and its tasks?')) {
      // Dispatch REST method for deletion from server side
      this.projectService.deleteProject(projectId).subscribe({
        error: () => {
          // Reload the projects list from server after a failed deletion
          console.error('Error deleting project, issued full load of projects');
          this.projectService.loadProjectsFromServer();
        }, complete: () => {
          console.log('Project deleted successfully');
        }
      });
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // project tasks view related controls:

  async viewTasks(projectId: number): Promise<void> {
    try {
      const result = await this.router.navigate([`/project/${projectId}/tasks`]); // Navigate to project tasks
      if (!result) console.error('failed to navigate towards /project/${projectId}/tasks');
    } catch (err) {
      console.error('Navigation towards /project/${projectId}/tasks error:', err);
    }
  }
}
