import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, provideHttpClient, withFetch} from "@angular/common/http";
import {ReactiveFormsModule} from "@angular/forms";
import {JwtInterceptor} from "./Modules/userManagement/FrontOFFICE/interceptors/jwt.interceptor";
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import {AuthGuard} from "./Modules/userManagement/FrontOFFICE/auth/guards/auth.guard";


export const appConfig: ApplicationConfig = {
  providers: [
    AuthGuard, // Ensure AuthGuard is provided
    provideRouter(routes),
    provideHttpClient(withFetch()),
    importProvidersFrom(ReactiveFormsModule),
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }, provideAnimationsAsync()
  ]
};
