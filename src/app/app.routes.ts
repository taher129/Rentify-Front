import { Routes } from '@angular/router';
import { AboutComponent } from './pages/about/about.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { StoreLocatorComponent } from './pages/store-locator/store-locator.component';
import { FaqComponent } from './pages/faq/faq.component';
import { ComingSoonComponent } from './pages/coming-soon/coming-soon.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { BlogPostComponent } from './blog-post/blog-post.component';
import { BlogComponent } from './blog/blog.component';
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

import { CategoryListComponent } from './category-list/category-list.component';
import {ProductListComponent} from "./product-list/product-list.component";
import {ProductDetailComponent} from "./product-detail/product-detail.component";
import {LeafletComponent} from "./leaflet/leaflet.component";
import {ReservationComponent} from "./reservation-service/reservation/reservation.component";
import {MyreservationComponent} from "./reservation-service/myreservation/myreservation.component";
import {MessegingPageComponent} from "./reservation-service/messeging-page/messeging-page.component";
import {ResponseDetailComponent} from "./response-detail/response-detail.component";
import {ComplaintComponent} from "./complaint/complaint.component";
import {ComplaintAddComponent} from "./complaint-add/complaint-add.component";
import {ComplaintDetailComponent} from "./complaint-detail/complaint-detail.component";
import {ComplaintUpdateComponent} from "./complaint-update/complaint-update.component";
import {ChatbotComplaintComponent} from "./chatbot-complaint/chatbot-complaint.component";
import {ImageToTextComponent} from "./image-to-text/image-to-text.component";
import {AddBlogComponent} from "./add-blog/add-blog.component";
import {QuizComponent} from "./quiz/quiz.component";
import {MyblogsComponent} from "./myblogs/myblogs.component";
import {EditBlogComponent} from "./editblog/editblog.component";
import {CustomerReviewComponent} from "./customer-review/customer-review.component";

import {ResetPasswordComponent} from "./userManagement/auth/reset-password/reset-password.component";
import {ForgotPasswordComponent} from "./userManagement/auth/forgot-password/forgot-password.component";

export const routes: Routes = [
  // Home/Visitor Page
  { path: '', redirectTo: 'visit', pathMatch: 'full' },
  { path: 'visit', component: VisitorHomeComponent },

  // Authentication Pages
  { path: 'signup', component: SignupComponent, data: { hideNavbar: true } },
  { path: 'login', component: LoginComponent, data: { hideNavbar: true } },
  { path: 'forgot-password', component: ForgotPasswordComponent, data: { hideNavbar: true } },
  { path: 'verify-email', component: VerifyEmailComponent, data: { hideNavbar: true } },
  { path: 'verify-otp', component: VerifyOtpComponent, data: { hideNavbar: true } },
  { path: 'reset-password', component: ResetPasswordComponent, data: { hideNavbar: true } },
  { path: 'password-reset-success', component: ResetPasswordComponent, data: { hideNavbar: true } },
  { path: 'oauth2-redirect', component: Oauth2RedirectComponent },

  // Main Pages (Protected)
  { path: 'about', component: AboutComponent, canActivate: [AuthGuard] },
  { path: 'contact', component: ContactUsComponent, canActivate: [AuthGuard] },
  { path: 'store-locator', component: StoreLocatorComponent, canActivate: [AuthGuard] },
  { path: 'faq', component: FaqComponent, canActivate: [AuthGuard] },
  { path: 'coming-soon', component: ComingSoonComponent, canActivate: [AuthGuard] },
  { path: 'become-a-lender', component: BecomeALenderComponent, canActivate: [AuthGuard] },
  { path: 'insurance', component: InsuranceComponent, canActivate: [AuthGuard] },
  { path: 'sustainability', component: SustainabilityComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },

  // Product & Categories
  { path: 'products/category/:categoryId', component: ProductListComponent },
  { path: 'categories', component: CategoryListComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'leaflet', component: LeafletComponent },




 //reservation-service
  {path: 'myreservation', component: MyreservationComponent},
  {path: 'chat', component: MessegingPageComponent},
  {path: 'reservation/:id', component: ReservationComponent},



  // Pages principales
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactUsComponent },
  { path: 'store-locator', component: StoreLocatorComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'coming-soon', component: ComingSoonComponent },
  { path: 'become-a-lender', component: BecomeALenderComponent },
  { path: 'insurance', component: InsuranceComponent },
  { path: 'sustainability', component: SustainabilityComponent },

  // Blog et articles de blog
  { path: 'blog', component: BlogComponent },
  { path: 'blogpost/:id', component: BlogPostComponent },
  { path: 'addblog', component: AddBlogComponent },
  { path: 'quiz', component: QuizComponent },
  { path: 'myblogs', component: MyblogsComponent },
  {path: 'editblog/:id', component: EditBlogComponent},

  //complaints
  { path: 'complaint', component: ComplaintComponent },
  { path: 'complaint-add', component: ComplaintAddComponent },
  { path: 'complaint-add/:id', component: ComplaintAddComponent },
  { path: 'complaint-detail/:id', component: ComplaintDetailComponent },

  { path: 'complaint/update/:id', component: ComplaintUpdateComponent },
  { path: 'chatbot-complaint', component: ChatbotComplaintComponent },
  { path: 'image-to-text', component: ImageToTextComponent },

  {
    path: 'complaint/detail/:id',
    loadComponent: () =>
      import('./complaint-detail/complaint-detail.component').then(
        (m) => m.ComplaintDetailComponent
      ),
  },


//Responses
{
   path: 'complaintresponse/:id',
   component: ResponseDetailComponent
 },








  // {
  //    path: 'rating',
  //    loadComponent: () => import('./rating/rating.component').then(m => m.RatingComponent)
  //  },

  // Page de gestion des erreurs 404
  { path: '404', component: NotFoundComponent },

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
  { path: 'profile/:userId', component: ProfileComponent, canActivate: [AuthGuard] },

  { path: '**', redirectTo: 'visit' },
  { path: 'oauth2-redirect', component: Oauth2RedirectComponent },


];
