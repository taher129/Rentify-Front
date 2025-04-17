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
import { ProductAddComponent} from "./product-add/product-add.component";
import { CategoryListComponent } from './category-list/category-list.component';
import {ProductListComponent} from "./product-list/product-list.component";
import {ProductDetailComponent} from "./product-detail/product-detail.component";


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

   // Blog et articles de blog
   { path: 'blog', component: BlogComponent },
   { path: 'blog/:id', component: BlogPostComponent },

  //Product et categories
  { path: 'product-add', component: ProductAddComponent },
  { path: 'products/category/:id_Category', component: ProductListComponent },
  { path: 'categories', component: CategoryListComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'products', component: ProductListComponent },



  // Page de gestion des erreurs 404
   { path: '404', component: NotFoundComponent },

   // Redirection vers la page d'accueil par défaut
   { path: '**', redirectTo: '/404', pathMatch: 'full' }
];
