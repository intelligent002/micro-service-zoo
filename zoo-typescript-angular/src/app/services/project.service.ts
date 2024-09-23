import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Project } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private projects: Project[] = [
    { id: 1, name: 'Project A', tasks: [{ id: 1, name: 'Task 1', completed: false }] },
    { id: 2, name: 'Project B', tasks: [{ id: 2, name: 'Task 2', completed: true }] }
  ];

  // Get all projects
  getProjects(): Observable<Project[]> {
    return of(this.projects);
  }

  // Add a new project
  addProject(project: Project): Observable<Project> {
    project.id = this.projects.length + 1; // Generate new id
    this.projects.push(project);
    return of(project);
  }

  // Delete a project
  deleteProject(id: number): Observable<boolean> {
    this.projects = this.projects.filter(p => p.id !== id);
    return of(true);
  }

  // Update a project
  updateProject(updatedProject: Project): Observable<Project | null> { // <-- Change return type to Project | null
    const projectIndex = this.projects.findIndex(p => p.id === updatedProject.id);
    if (projectIndex >= 0) {
      this.projects[projectIndex] = updatedProject;
      return of(updatedProject);
    }
    return of(null); // Now this matches the updated return type
  }
}
