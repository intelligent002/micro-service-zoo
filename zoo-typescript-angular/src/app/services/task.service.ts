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
    // Get API URL from config.json
    this.apiUrl = this.configService.getConfig().apiUrl;
  }

  // Load tasks for a specific project from server
  loadTasksFromServer(projectId: number): void {
    this.responseHandler.handleResponse(
      this.http.get<RestApiResponse<Task[]>>(`${this.apiUrl}/projects/${projectId}/tasks`)
    ).pipe(
      tap((tasks) => {
        if (!this.tasksSubject[projectId]) {
          // Initialize the BehaviorSubject for the project if it doesn't exist
          this.tasksSubject[projectId] = new BehaviorSubject<Task[]>([]);
        }
        // Update the tasks BehaviorSubject with new data
        this.tasksSubject[projectId].next(tasks);
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

  // Create a new task in a specific project
  createTask(
    {
      projectId,
      taskData
    }: {
      projectId: number,
      taskData: Task
    }): Observable<Task> {
    return this.responseHandler.handleResponse(
      this.http.post<RestApiResponse<Task>>(`${this.apiUrl}/projects/${projectId}/tasks`, taskData)
    ).pipe(
      // post-factum emit the updated list
      tap((newTask) => {
        if (this.tasksSubject[projectId]) {
          const currentTasks = this.tasksSubject[projectId].getValue();
          this.tasksSubject[projectId].next([...currentTasks, newTask]);
        }
      })
    );
  }

  // Update a task for a specific project
  updateTask(
    taskData: Task
  ): Observable<Task> {
    // no speedups, perform the actual job
    return this.responseHandler.handleResponse(
      this.http.post<RestApiResponse<Task>>(`${this.apiUrl}/projects/${taskData.project_id}/tasks/${taskData.id}`, taskData)
    ).pipe(
      // post-factum emit the updated list
      tap((updatedTask) => {
        if (this.tasksSubject[taskData.project_id]) {
          const currentTasks = this.tasksSubject[taskData.project_id].getValue();
          const index = currentTasks.findIndex(task => task.id === updatedTask.id);
          if (index !== -1) {
            currentTasks[index] = updatedTask;
            this.tasksSubject[taskData.project_id].next(currentTasks);
          }
        }
      })
    );
  }


  // Delete a task
  deleteTask(
    {
      projectId,
      taskId
    }: {
      projectId: number,
      taskId: number
    }): Observable<Task> {
    // speed up the visual part
    if (this.tasksSubject[projectId]) {
      const currentTasks = this.tasksSubject[projectId].getValue();
      const updatedTasks = currentTasks.filter(p => p.id !== taskId);
      this.tasksSubject[projectId].next(updatedTasks);
    }
    // perform the actual job
    return this.responseHandler.handleResponse(
      this.http.delete<RestApiResponse<Task>>(`${this.apiUrl}/projects/${projectId}/tasks/${taskId}`)
    );
  }

  // modify priority of the tasks
  prioritizeTasks(
    {
      projectId,
      taskIds
    }: {
      projectId: number,
      taskIds: number[]
    }): Observable<Task> {
    // nothing to speedup, already drag-n-dropped
    // perform the actual job
    return this.responseHandler.handleResponse(
      this.http.post<RestApiResponse<Task>>(`${this.apiUrl}/projects/${projectId}/tasks/prioritize`, {task_ids: taskIds})
    );
  }

  // migrate a task to another project
  migrateTask(
    {
      projectId,
      taskId
    }: {
      projectId: number,
      taskId: number
    }): Observable<Task> {
    // nothing to speedup, already drag-n-dropped
    // perform the actual job
    return this.responseHandler.handleResponse(
      this.http.patch<RestApiResponse<Task>>(`${this.apiUrl}/projects/${projectId}/tasks/${taskId}/migrate`, {})
    );
  }
}
