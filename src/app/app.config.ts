import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, provideHttpClient, withFetch} from "@angular/common/http";
import {ReactiveFormsModule} from "@angular/forms";
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import {AuthGuard} from "./userManagement/auth/guards/auth.guard";
import {JwtInterceptor} from "./userManagement/interceptors/jwt.interceptor";


export const appConfig: ApplicationConfig = {
  providers: [
    AuthGuard, // Ensure AuthGuard is provided
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withFetch()),
    importProvidersFrom(ReactiveFormsModule),
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }, provideAnimationsAsync()
  ]
};
