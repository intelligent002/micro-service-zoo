import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Project} from '../models/project.model';
import {ConfigService} from './config.service';
import {RestApiResponse} from '../models/rest-api-response.model';
import {RestApiResponseHandlerService} from './rest-api-response-handler.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService, private responseHandler: RestApiResponseHandlerService) {
    this.apiUrl = this.configService.getConfig().apiUrl;  // Get API URL from config.json
  }

  // Fetch the list of projects
  getProjectsList(): Observable<Project[]> {
    return this.responseHandler.handleResponse(this.http.get<RestApiResponse<Project[]>>(`${this.apiUrl}/projects/`));
  }

  // Fetch project by its ID
  getProjectById(id: number): Observable<Project> {
    return this.responseHandler.handleResponse(this.http.get<RestApiResponse<Project>>(`${this.apiUrl}/projects/${id}`));
  }

  // Delete project by its ID
  deleteProject(id: number): Observable<Project> {
    return this.responseHandler.handleResponse(this.http.delete<RestApiResponse<Project>>(`${this.apiUrl}/projects/${id}`));
  }

// Create a new project and handle the response using handleResponse
  createProject(projectData: Project): Observable<Project> {
    return this.responseHandler.handleResponse(this.http.post<RestApiResponse<Project>>(`${this.apiUrl}/projects/`, projectData));
  }
}
