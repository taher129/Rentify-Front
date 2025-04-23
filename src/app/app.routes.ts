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


export const routes: Routes = [
   // Page d'accueil
   { path: '', component: HomeComponent },
   { path: 'home', component: HomeComponent },

   // Pages principales
   { path: 'about', component: AboutComponent },
   { path: 'contact', component: ContactUsComponent },
   { path: 'store-locator', component: StoreLocatorComponent },
   { path: 'faq', component: FaqComponent },
   { path: 'coming-soon', component: ComingSoonComponent },
   { path: 'become-a-lender', component: BecomeALenderComponent },
   { path: 'insurance', component: InsuranceComponent },
   { path: 'sustainability', component: SustainabilityComponent },
 //reservation-service
  {path: 'myreservation', component: MyreservationComponent},
  {path: 'chat', component: MessegingPageComponent},
  {path: 'reservation', component: ReservationComponent},

   // Blog et articles de blog
   { path: 'blog', component: BlogComponent },
   { path: 'blog/:id', component: BlogPostComponent },


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
  { path: 'blog/:id', component: BlogPostComponent },
  { path: 'addblog', component: AddBlogComponent },
  {path: 'quiz', component: QuizComponent },

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

  // Redirection vers la page d'accueil par défaut
  { path: '**', redirectTo: '/404', pathMatch: 'full' },
];
