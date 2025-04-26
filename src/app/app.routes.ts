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
import {SignupComponent} from "./userManagement/auth/signup/signup.component";
import {LoginComponent} from "./userManagement/auth/login/login.component";
import {DashboardComponent} from "./userManagement/dashboard/dashboard.component";
import {VerifyEmailComponent} from "./userManagement/auth/verify-email/verify-email.component";
import {VerifyOtpComponent} from "./userManagement/auth/verify-otp/verify-otp.component";
import {ProfileComponent} from "./userManagement/profile/profile.component";
import {AuthGuard} from "./userManagement/auth/guards/auth.guard";
import {VisitorHomeComponent} from "./visitor-home/visitor-home.component";
import {
  Oauth2RedirectComponent
} from "./userManagement/auth/oauth2-redirect/oauth2-redirect.component";


export const routes: Routes = [
  // Page d'accueil
  { path: '', redirectTo: 'visit', pathMatch: 'full' },
  { path: 'visit', component: VisitorHomeComponent },

  // Pages principales
  { path: 'about', component: AboutComponent, canActivate: [AuthGuard] },
  { path: 'contact', component: ContactUsComponent , canActivate: [AuthGuard]},
  { path: 'store-locator', component: StoreLocatorComponent , canActivate: [AuthGuard]},
  { path: 'faq', component: FaqComponent, canActivate: [AuthGuard] },
  { path: 'coming-soon', component: ComingSoonComponent, canActivate: [AuthGuard] },
  { path: 'become-a-lender', component: BecomeALenderComponent , canActivate: [AuthGuard]},
  { path: 'insurance', component: InsuranceComponent , canActivate: [AuthGuard]},
  { path: 'sustainability', component: SustainabilityComponent, canActivate: [AuthGuard] },
  { path: 'verify-otp', component: VerifyOtpComponent },


  // user pages

  { path: 'signup', component: SignupComponent ,data: { hideNavbar: true }},
  { path: 'login', component: LoginComponent ,data: { hideNavbar: true }},
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'verify-email', component: VerifyEmailComponent,data: { hideNavbar: true } },
  { path: 'verify-otp', component: VerifyOtpComponent ,data: { hideNavbar: true }  },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'profile/:userId', component: ProfileComponent, canActivate: [AuthGuard]},

  { path: '**', redirectTo: 'visit' },
  { path: 'oauth2-redirect', component: Oauth2RedirectComponent },

  // Page de gestion des erreurs 404
  { path: '404', component: NotFoundComponent },


];
