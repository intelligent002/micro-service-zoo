import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { APP_INITIALIZER } from '@angular/core';
import { AppComponent } from './app/app.component';
import { ConfigService } from './app/services/config.service';

// Function to initialize configuration before app start
export function initializeApp(configService: ConfigService) {
  return () => configService.loadConfig(); // Returns the promise to load the config.json
}

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(), // Ensure HttpClient is available
    ConfigService,       // Provide the ConfigService
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp, // Attach the initializer function
      deps: [ConfigService],     // Inject the ConfigService
      multi: true                // Ensure this is run before app startup
    }
  ]
}).catch(err => console.error(err));
