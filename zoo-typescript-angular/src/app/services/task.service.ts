import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, EMPTY, Observable} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {Task} from '../models/task.model';
import {ConfigService} from './config.service';
import {RestApiResponse} from '../models/rest-api-response.model';
import {RestApiResponseHandlerService} from './rest-api-response-handler.service';
import {Project} from '../models/project.model';

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

  // Get the observable tasks list
  getTasks(project: Project): Observable<Task[]> {
    // Initialize the BehaviorSubject for the project if it doesn't exist
    if (!this.tasksSubject[project.id]) {
      this.tasksSubject[project.id] = new BehaviorSubject<Task[]>([]);
      this.loadTasksFromServer(project.id).subscribe();
    }
    return this.tasksSubject[project.id].asObservable();
  }

  // Load tasks for a specific project from server
  loadTasksFromServer(projectId: number): Observable<Task[]> {
    return this.responseHandler.handleResponse(
      this.http.get<RestApiResponse<Task[]>>(`${this.apiUrl}/api/projects/${projectId}/tasks`)
    ).pipe(
      tap((tasks) => {
        // Initialize the BehaviorSubject for the project if it doesn't exist
        if (!this.tasksSubject[projectId]) {
          this.tasksSubject[projectId] = new BehaviorSubject<Task[]>([]);
        }
        // Update the tasks BehaviorSubject with new data
        this.tasksSubject[projectId].next(tasks);
        console.debug(`Project #${projectId} had its tasks loaded successfully`);
      }),
      catchError((error) => {
        console.error(`Error listing tasks per project #${projectId}:`, error);
        return EMPTY;
      })
    );
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
      this.http.post<RestApiResponse<Task>>(`${this.apiUrl}/api/projects/${projectId}/tasks`, taskData)
    ).pipe(
      // post-factum emit the updated list
      tap((newTask) => {
        if (this.tasksSubject[projectId]) {
          const currentTasks = this.tasksSubject[projectId].getValue();
          this.tasksSubject[projectId].next([...currentTasks, newTask]);
        }
        console.debug(`Task #${newTask.id} was created successfully`);
      }),
      catchError((error) => {
        console.error(`Error creating task per project #${projectId}:`, error);
        return EMPTY;
      })
    );
  }

  // Update a task for a specific project
  updateTask(
    task: Task
  ): Observable<Task> {
    // no speedups, perform the actual job
    return this.responseHandler.handleResponse(
      this.http.post<RestApiResponse<Task>>(`${this.apiUrl}/api/projects/${task.project_id}/tasks/${task.id}`, task)
    ).pipe(
      // post-factum emit the updated list
      tap((updatedTask) => {
        if (this.tasksSubject[task.project_id]) {
          const currentTasks = this.tasksSubject[task.project_id].getValue();
          const index = currentTasks.findIndex(t => t.id === task.id);
          if (index !== -1) {
            currentTasks[index] = updatedTask;
            this.tasksSubject[task.project_id].next(currentTasks);
          }
        }
        console.debug(`Task #${task.id} was updated successfully`);
      }),
      catchError((error) => {
        console.error(`Error updating task #${task.id}`, error);
        return EMPTY;
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
      this.http.delete<RestApiResponse<Task>>(`${this.apiUrl}/api/projects/${projectId}/tasks/${taskId}`)
    ).pipe(
      tap(() => {
        console.debug(`Task #${taskId} was deleted successfully`);
      }),
      catchError((error) => {
        console.error(`Error deleting task #${taskId}:`, error);
        return EMPTY;
      })
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
      this.http.post<RestApiResponse<Task>>(`${this.apiUrl}/api/projects/${projectId}/tasks/prioritize`, {task_ids: taskIds})
    ).pipe(
      tap(() => {
        console.debug(`Project #${projectId} had its task prioritized successfully`);
      }),
      catchError((error) => {
        console.error(`Error prioritizing tasks in project #${projectId}:`, error);
        return EMPTY;
      })
    );
  }

  // update tasks state BehaviourSubj
  updateTasksState({projectId, tasks}: { projectId: number, tasks: Task[] }) {
    if (this.tasksSubject[projectId]) {
      this.tasksSubject[projectId].next(tasks);
    }
  }

  // migrate a task to another project
  migrateTask(
    {
      project,
      task
    }: {
      project: Project,
      task: Task
    }): Observable<Task> {
    // speed up the visual part

    // perform the actual job
    return this.responseHandler.handleResponse(
      this.http.patch<RestApiResponse<Task>>(`${this.apiUrl}/api/projects/${project.id}/tasks/${task.id}/migrate`, {})
    ).pipe(
      tap(() => {
        console.debug(`Task #${task.id} migrated to project #${project.id} successfully`);
      }),
      catchError((error) => {
        console.error(`Error migrating tasks #${task.id} tp project #${project.id}:`, error);
        return EMPTY;
      })
    );
  }
}
