import {Component, OnInit} from '@angular/core';
import {ProjectService} from '../../../services/project.service';
import {Project} from '../../../models/project.model';
import {Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {TasksComponent} from '../../tasks/tasks.component';

@Component({
  selector: 'app-projects',
  templateUrl: './project-list.component.html',
  standalone: true,
  styleUrls: ['./project-list.component.scss'],
  imports: [CommonModule, TasksComponent]
})
export class ProjectListComponent implements OnInit {
  projects: Project[] = [];

  constructor(private projectService: ProjectService, private router: Router) {
  }

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.projectService.getProjectsList().subscribe({
      next: (data) => {
        this.projects = data;
      },
      error: (err) => {
        console.error('Error fetching projects:', err);
      }
    });
  }

  async createProject(): Promise<void> {
    try {
      const result = await this.router.navigate(['/project/create']); // Navigate to a create project form
      if (!result)
        console.error('failed to navigate towards /project/create')
    } catch (err) {
      console.error('Navigation towards /project/create error:', err);
    }
  }

  async viewTasks(projectId: number): Promise<void> {
    try {
      const result = await this.router.navigate([`/project/${projectId}/tasks`]); // Navigate to project tasks
      if (!result)
        console.error('failed to navigate towards /project/${projectId}/tasks')
    } catch (err) {
      console.error('Navigation towards /project/${projectId}/tasks error:', err);
    }
  }

  async editProject(projectId: number): Promise<void> {
    try {
      const result = await this.router.navigate([`/project/${projectId}/edit`]); // Navigate to edit form
      if (!result)
        console.error('failed to navigate towards /project/${projectId}/edit')
    } catch (err) {
      console.error('Navigation towards /project/${projectId}/edit error:', err);
    }
  }

  deleteProject(projectId: number): void {
    if (confirm('Are you sure you want to delete this project and its tasks?')) {
      this.projectService.deleteProject(projectId).subscribe(() => {
        this.loadProjects(); // Refresh the project list after deletion
      });
    }
  }

}
