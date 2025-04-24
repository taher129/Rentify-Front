import { Routes } from '@angular/router';
import { AboutComponent } from './pages/about/about.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { StoreLocatorComponent } from './pages/store-locator/store-locator.component';
import { FaqComponent } from './pages/faq/faq.component';
import { ComingSoonComponent } from './pages/coming-soon/coming-soon.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { BecomeALenderComponent } from './pages/become-a-lender/become-a-lender.component';
import { InsuranceComponent } from './pages/insurance/insurance.component';
import { SustainabilityComponent } from './pages/sustainability/sustainability.component';
import { HomeComponent } from './layout/home/home.component';
import {SignupComponent} from "./Modules/userManagement/FrontOFFICE/auth/signup/signup.component";
import {LoginComponent} from "./Modules/userManagement/FrontOFFICE/auth/login/login.component";
import {DashboardComponent} from "./Modules/userManagement/FrontOFFICE/dashboard/dashboard.component";
import {VerifyEmailComponent} from "./Modules/userManagement/FrontOFFICE/auth/verify-email/verify-email.component";
import {
  ResetPasswordRequestComponent
} from "./Modules/userManagement/FrontOFFICE/auth/reset-password-request/reset-password-request.component";
import {VerifyOtpComponent} from "./Modules/userManagement/FrontOFFICE/auth/verify-otp/verify-otp.component";
import {ProfileComponent} from "./Modules/userManagement/FrontOFFICE/profile/profile.component";
import {
  ResetPasswordComponent
} from "./Modules/userManagement/FrontOFFICE/auth/reset-password/reset-password.component";
import {AuthGuard} from "./Modules/userManagement/FrontOFFICE/auth/guards/auth.guard";

export const routes: Routes = [
  // Page d'accueil
  { path: '', redirectTo: '/login', pathMatch: 'full'  ,data: { hideNavbar: true }},  // Redirect to login if no path is matched

  // Pages principales
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactUsComponent },
  { path: 'store-locator', component: StoreLocatorComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'coming-soon', component: ComingSoonComponent },
  { path: 'become-a-lender', component: BecomeALenderComponent },
  { path: 'insurance', component: InsuranceComponent },
  { path: 'sustainability', component: SustainabilityComponent },

  // user pages

  { path: 'signup', component: SignupComponent ,data: { hideNavbar: true }},
  { path: 'login', component: LoginComponent ,data: { hideNavbar: true }},
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'verify-email', component: VerifyEmailComponent,data: { hideNavbar: true } },
  { path: 'reset-password-request', component: ResetPasswordRequestComponent ,data: { hideNavbar: true }  },
  { path: 'verify-otp', component: VerifyOtpComponent ,data: { hideNavbar: true }  },
  { path: 'reset-password', component: ResetPasswordComponent ,data: { hideNavbar: true }  },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'profile/:userId', component: ProfileComponent, canActivate: [AuthGuard]},

  { path: '**', redirectTo: '/login' }, // Redirect to login if path does not exist

  // Page de gestion des erreurs 404
  { path: '404', component: NotFoundComponent },


];
