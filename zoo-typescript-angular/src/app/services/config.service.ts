import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {firstValueFrom, of} from 'rxjs';
import {Config} from '../models/config.model'; // Import the interface

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config: Config = {apiUrl: ""};  // Use 'object' to store the full JSON response

  constructor(private http: HttpClient) {
  }

  // Async method to load config.json and store the full response as an object
  async loadConfig(): Promise<void> {
    try {
      this.config = await firstValueFrom(
        this.http.get<Config>('/assets/config.json').pipe(
          catchError(() => {
            console.error('Could not load config.json');
            return of({apiUrl: ""});  // Handle error gracefully
          })
        )
      );
    } catch (error) {
      console.error('Error loading config:', error);
    }
  }

  // Method to get the full config object
  getConfig(): Config {
    return this.config;
  }
}
