import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {Task} from '../models/task.model';
import {ConfigService} from './config.service';
import {RestApiResponse} from '../models/rest-api-response.model';
import {RestApiResponseHandlerService} from './rest-api-response-handler.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly apiUrl: string;
  private tasksSubject: { [projectId: number]: BehaviorSubject<Task[]> } = {};

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private responseHandler: RestApiResponseHandlerService
  ) {
    this.apiUrl = this.configService.getConfig().apiUrl;  // Get API URL from config.json
  }

  // Load tasks for a specific project from the server
  loadTasksFromServer(projectId: number): void {
    this.responseHandler.handleResponse(
      this.http.get<RestApiResponse<Task[]>>(`${this.apiUrl}/projects/${projectId}/tasks/`)
    ).pipe(
      tap((tasks) => {
        if (!this.tasksSubject[projectId]) {
          this.tasksSubject[projectId] = new BehaviorSubject<Task[]>([]);
        }
        this.tasksSubject[projectId].next(tasks);  // Update the tasks BehaviorSubject with new data
      })
    ).subscribe();
  }

  // Get the observable tasks list
  getTasks(projectId: number): Observable<Task[]> {
    // Initialize the BehaviorSubject for the project if it doesn't exist
    if (!this.tasksSubject[projectId]) {
      this.tasksSubject[projectId] = new BehaviorSubject<Task[]>([]);
    }
    return this.tasksSubject[projectId].asObservable();
  }

  // Create a new task for a specific project
  createTask(
    {
      projectId,
      taskData
    }: {
      projectId: number,
      taskData: Task
    }): Observable<Task> {
    return this.responseHandler.handleResponse(
      this.http.post<RestApiResponse<Task>>(`${this.apiUrl}/projects/${projectId}/tasks/`, taskData)
    ).pipe(
      tap((newTask) => {
        if (this.tasksSubject[projectId]) {
          // Get the current task list for the project
          const currentTasks = this.tasksSubject[projectId].getValue();
          // Add the new task to the task list for the specific project
          this.tasksSubject[projectId].next([...currentTasks, newTask]);
        }
      })
    );
  }

  // Update a task for a specific project
  updateTask(taskData: Task): Observable<Task> {
    return this.responseHandler.handleResponse(
      this.http.post<RestApiResponse<Task>>(`${this.apiUrl}/projects/${taskData.project_id}/tasks/${taskData.id}`, taskData)
    ).pipe(
      tap((updatedTask) => {
        const currentTasks = this.tasksSubject[taskData.project_id].getValue();
        const index = currentTasks.findIndex(task => task.id === updatedTask.id);
        if (index !== -1) {
          currentTasks[index] = updatedTask;
          this.tasksSubject[taskData.project_id].next(currentTasks);  // Emit the updated list (create a new array reference)
        }
      })
    );
  }


  // Delete a task
  deleteTask(projectId: number, taskId: number): Observable<Task> {
    // speed up the visual part
    const currentTasks = this.tasksSubject[projectId].getValue();
    const updatedTasks = currentTasks.filter(p => p.id !== taskId);
    this.tasksSubject[projectId].next(updatedTasks);  // Emit the updated list

    // perform the actual job
    return this.responseHandler.handleResponse(
      this.http.delete<RestApiResponse<Task>>(`${this.apiUrl}/projects/${projectId}/tasks/${taskId}`)
    );
  }

  prioritizeTasks(projectId: number): Observable<Task> {
    // perform the actual job
    return this.responseHandler.handleResponse(
      this.http.get<RestApiResponse<Task>>(`${this.apiUrl}/projects/${projectId}/tasks/`)
    );
  }

  migrateTasks(projectId: number): Observable<Task> {
    // perform the actual job
    return this.responseHandler.handleResponse(
      this.http.get<RestApiResponse<Task>>(`${this.apiUrl}/projects/${projectId}/tasks/`)
    );
  }
}
