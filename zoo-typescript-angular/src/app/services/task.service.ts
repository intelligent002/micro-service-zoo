import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Task} from '../models/task.model';
import {ConfigService} from './config.service';
import {RestApiResponse} from '../models/rest-api-response.model';
import {RestApiResponseHandlerService} from './rest-api-response-handler.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl: string;

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private responseHandler: RestApiResponseHandlerService
  ) {
    this.apiUrl = this.configService.getConfig().apiUrl;  // Get API URL from config.json
  }

  // Fetch the tasks for a specific project
  getTasks(project_id: number): Observable<Task[]> {
    return this.responseHandler.handleResponse(
      this.http.get<RestApiResponse<Task[]>>(`${this.apiUrl}/projects/${project_id}/tasks`)
    );
  }

  // Fetch the tasks for a specific project
  getTaskById(project_id: number, task_id: number): Observable<Task[]> {
    return this.responseHandler.handleResponse(
      this.http.get<RestApiResponse<Task[]>>(`${this.apiUrl}/projects/${project_id}/tasks/${task_id}`)
    );
  }

}
