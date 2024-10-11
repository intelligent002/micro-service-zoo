import {Component, ElementRef, OnInit, QueryList, ViewChildren} from '@angular/core';
import {ProjectService} from '../../../services/project.service';
import {Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {TasksComponent} from '../../tasks/tasks.component';
import {ProjectCreateComponent} from '../create/project-create.component';
import {Project} from '../../../models/project.model';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-projects',
  templateUrl: './project-list.component.html',
  standalone: true,
  styleUrls: ['./project-list.component.scss'],
  imports: [CommonModule, TasksComponent, ProjectCreateComponent, FormsModule]
})
export class ProjectListComponent implements OnInit {
  showCreateForm: boolean = false;  // Control form visibility
  currentEditingProjectId: number | null = null;  // To track the current editing project
  // Collect references to all input fields using ViewChildren
  @ViewChildren('projectNameInput') projectNameInputs!: QueryList<ElementRef>;

  constructor(public projectService: ProjectService, private router: Router) {
  }

  ngOnInit(): void {
    // Trigger projects loading, this shall happen once, since we use RouteReuseStrategy
    console.debug('issued full load of projects');
    this.projectService.loadProjectsFromServer();
  }

  ngAfterViewChecked(): void {
    // Focus the input field of the last/current editing project, if applicable
    if (this.currentEditingProjectId !== null) {
      const inputElement = this.projectNameInputs.find((el) => el.nativeElement.id === `project-${this.currentEditingProjectId}`);
      if (inputElement) {
        inputElement.nativeElement.focus();
        this.currentEditingProjectId = null;
      }
    }
  }

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

  updateProject(project: Project): void {
    this.projectService.updateProject(project).subscribe({
      error: (err) => {
        console.error('Error updating project:', err);
      }, complete: () => {
        console.log('Project updated successfully');
      }
    });
  }

  async viewTasks(projectId: number): Promise<void> {
    try {
      const result = await this.router.navigate([`/project/${projectId}/tasks`]); // Navigate to project tasks
      if (!result) console.error('failed to navigate towards /project/${projectId}/tasks');
    } catch (err) {
      console.error('Navigation towards /project/${projectId}/tasks error:', err);
    }
  }

  toggleCreateProject(): void {
    this.showCreateForm = !this.showCreateForm;
  }

  handleProjectCreated(): void {
    this.showCreateForm = false;  // Hide the form after submission
  }

  // Toggle editing and set the currentEditingProjectId
  toggleEditMode(project: Project): void {
    // save if was in edit mode
    if (project.isEditing) {
      // Save the project if it's in editing mode
      this.updateProject(project);
    }
    // toggle the mode
    project.isEditing = !project.isEditing;
    if (project.isEditing) {
      this.currentEditingProjectId = project.id;  // Track the current project being edited
    }
  }
}
