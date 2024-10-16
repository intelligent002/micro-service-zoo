import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, EMPTY, Observable} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {Project} from '../models/project.model';
import {ConfigService} from './config.service';
import {RestApiResponse} from '../models/rest-api-response.model';
import {RestApiResponseHandlerService} from './rest-api-response-handler.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private readonly apiUrl: string;

  // BehaviourStates
  private projectsSubject: BehaviorSubject<Project[]> = new BehaviorSubject<Project[]>([]);
  private connectedDropZonesSubject: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  // read-only observable for components to subscribe
  private projects$: Observable<Project[]> = this.projectsSubject.asObservable();
  private connectedDropZones$: Observable<string[]> = this.connectedDropZonesSubject.asObservable();

  bindSubjectsConnectedDropListsToProjects() {
    // Subscribe to projectsSubject and update innerConnectedDropListsSubject & outerConnectedDropListsSubject whenever projects change
    this.projects$.subscribe((projects) => {
      const outerIds=projects.map(project => `o-${project.id}`);
      const innerIds=projects.map(project => `i-${project.id}`);
      const allIds = [...outerIds, ...innerIds]
      this.connectedDropZonesSubject.next(allIds);
    });
  }

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private responseHandler: RestApiResponseHandlerService
  ) {
    // Get API URL from config.json
    this.apiUrl = this.configService.getConfig().apiUrl;
    this.bindSubjectsConnectedDropListsToProjects();
  }

  // Load projects from the server and manage BehaviorSubjects
  loadProjectsFromServer(): Observable<Project[]> {
    return this.responseHandler.handleResponse(
      this.http.get<RestApiResponse<Project[]>>(`${this.apiUrl}/projects`)
    ).pipe(
      tap((projects) => {
        if (!this.projectsSubject) {
          // Initialize the BehaviorSubject for the projects if it doesn't exist
          this.projectsSubject = new BehaviorSubject<Project[]>([]);
        }
        // Emit the list of projects
        this.projectsSubject.next(projects);
        console.debug(`Projects was loaded successfully`);
      }),
      catchError((error) => {
        console.error(`Error loading projects`, error);
        return EMPTY;
      })
    );
  }

  // Get the observable list of projects
  getProjects(): Observable<Project[]> {
    return this.projects$;
  }

  // Get the observable list of connected drop lists
  getConnectedDropZones(): Observable<string[]> {
    return this.connectedDropZones$;
  }

  // Create a new project
  createProject(project: Project): Observable<Project> {
    return this.responseHandler.handleResponse(
      this.http.post<RestApiResponse<Project>>(`${this.apiUrl}/projects`, project)
    ).pipe(
      tap((newProject) => {
        // we cannot render anything quick, until we actually get the data to render.
        // unless we want to render a semi-populated object prior calling the server,
        // and update it with the full data received from server, here
        // which is a bit of an overkill, while 100% possible to achieve, for cash :)
        const currentProjects = this.projectsSubject.getValue();
        this.projectsSubject.next([...currentProjects, newProject]);  // Add the new project
        console.debug(`Project #${newProject.id} was created successfully`);
      }),
      catchError((error) => {
        console.error(`Error creating project`, error);
        return EMPTY;
      })
    );
  }

  // Update a project
  updateProject(project: Project): Observable<Project> {
    return this.responseHandler.handleResponse(
      this.http.put<RestApiResponse<Project>>(`${this.apiUrl}/projects/${project.id}`, project)
    ).pipe(
      tap((updatedProject) => {
        const currentProjects = this.projectsSubject.getValue();
        const index = currentProjects.findIndex(p => p.id === updatedProject.id);
        currentProjects[index] = updatedProject;  // Update the project in the list
        this.projectsSubject.next(currentProjects);  // Emit the updated list
        console.debug(`Project #${project.id} was updated successfully`);
      }),
      catchError((error) => {
        console.error(`Error updating project #${project.id}`, error);
        return EMPTY;
      })
    );
  }

  // Delete a project
  deleteProject(projectId: number): Observable<Project> {
    // speed up the visual part
    const currentProjects = this.projectsSubject.getValue();
    const updatedProjects = currentProjects.filter(p => p.id !== projectId);
    this.projectsSubject.next(updatedProjects);  // Emit the updated list

    // perform the actual job
    return this.responseHandler.handleResponse(
      this.http.delete<RestApiResponse<Project>>(`${this.apiUrl}/projects/${projectId}`)
    ).pipe(
      tap(() => {
        console.debug(`Project #${projectId} was deleted successfully`)
      }),
      catchError((error) => {
        console.error(`Error deleting project #${projectId}, reloading ...`, error);
        this.loadProjectsFromServer().subscribe();
        return EMPTY;
      })
    );
  }
}
