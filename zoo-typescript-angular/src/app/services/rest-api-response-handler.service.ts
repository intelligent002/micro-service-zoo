import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {RestApiResponse} from '../models/rest-api-response.model';

@Injectable({
  providedIn: 'root'
})
export class RestApiResponseHandlerService {

  constructor() {
  }

  // Generic handler for API responses
  handleResponse<T>(response: Observable<RestApiResponse<T>>): Observable<T> {
    return response.pipe(
      map(res => {
        if (res.status === 'OK') {
          return res.result as T; // Return the result if status is 'ok'
        } else {
          throw new Error(res.error || 'Unknown error occurred');
        }
      }),
      catchError((error) => {
        console.error('Error occurred:', error);
        return throwError(() => new Error(error.message || 'Server Error'));
      })
    );
  }
}
