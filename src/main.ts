/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { EnvironmentLoaderService } from 'ngx-env';

const loader = new EnvironmentLoaderService();

// Load the environment variables before bootstrapping the application
loader.load().then(() => {
  bootstrapApplication(AppComponent, appConfig)
    .catch((err) => console.error(err));
}).catch((err:any) => {
  console.error('Error loading environment variables:', err);
});
