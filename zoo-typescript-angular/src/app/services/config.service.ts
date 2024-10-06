import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config: object | null = null;  // Use 'object' to store the full JSON response

  constructor(private http: HttpClient) {}

  // Async method to load config.json and store the full response as an object
  async loadConfig(): Promise<void> {
    try {
      this.config = await firstValueFrom(
        this.http.get<object>('/assets/config.json').pipe(
          catchError(() => {
            console.error('Could not load config.json');
            return of(null);  // Handle error, return null if the config can't be loaded
          })
        )
      );
    } catch (error) {
      console.error('Error loading config:', error);
    }
  }

  // Method to get the full config object
  getConfig(): object | null {
    return this.config;
  }
}
