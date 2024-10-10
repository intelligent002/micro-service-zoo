import {Component, OnInit} from '@angular/core';
import {ProjectService} from '../../../services/project.service';
import {Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {TasksComponent} from '../../tasks/tasks.component';
import {ProjectCreateComponent} from '../create/project-create.component';


@Component({
  selector: 'app-projects',
  templateUrl: './project-list.component.html',
  standalone: true,
  styleUrls: ['./project-list.component.scss'],
  imports: [CommonModule, TasksComponent, ProjectCreateComponent]
})
export class ProjectListComponent implements OnInit {
  showCreateForm: boolean = false;  // Control form visibility

  constructor(public projectService: ProjectService, private router: Router) {
  }

  ngOnInit(): void {

    // Trigger projects loading, this shall happen once, since we use RouteReuseStrategy
    console.debug('issued full load of projects')
    this.projectService.loadProjectsFromServer();
  }

  deleteProject(projectId: number): void {
    if (confirm('Are you sure you want to delete this project and its tasks?')) {
      // Dispatch REST method for deletion from server side
      this.projectService.deleteProject(projectId).subscribe({
        error: () => {
          console.error('Error deleting project');
          // Reload the projects list from server after a failed deletion
          this.projectService.loadProjectsFromServer();
        }, complete: () => {
          console.log('Project deleted successfully');
        }
      });
    }
  }

  async viewTasks(projectId: number): Promise<void> {
    try {
      const result = await this.router.navigate([`/project/${projectId}/tasks`]); // Navigate to project tasks
      if (!result) console.error('failed to navigate towards /project/${projectId}/tasks')
    } catch (err) {
      console.error('Navigation towards /project/${projectId}/tasks error:', err);
    }
  }

  async editProject(projectId: number): Promise<void> {
    try {
      const result = this.router.navigate([`/project/${projectId}/edit`]); // Navigate to edit form
      if (!result) console.error('failed to navigate towards /project/${projectId}/edit')
    } catch (err) {
      console.error('Navigation towards /project/${projectId}/edit error:', err);
    }
  }

  // Toggle the form visibility
  toggleCreateProject(): void {
    this.showCreateForm = !this.showCreateForm;
  }

  // Handle the form submission event
  handleProjectCreated(): void {
    this.showCreateForm = false;  // Hide the form after submission
  }
}
