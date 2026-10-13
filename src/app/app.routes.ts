import { Routes } from '@angular/router';
import { DesignSystemComponent } from './pages/design-system/design-system';
import { Docs } from './pages/design-system/docs/docs';
import { ContactTemplate } from './pages/templates/contact/contact-template';
import { FaqTemplate } from './pages/templates/faq/faq-template';
import { ServiceGuideTemplate } from './pages/templates/service-guide/service-guide-template';

export const routes: Routes = [
  { path: 'design-system/docs', component: Docs },
  { path: 'templates/faq', component: FaqTemplate },
  { path: 'templates/service-guide', component: ServiceGuideTemplate },
  { path: 'templates/contact', component: ContactTemplate },
  { path: 'design-system', component: DesignSystemComponent },
  { path: '', pathMatch: 'full', redirectTo: 'design-system' },
  { path: '**', redirectTo: 'design-system' },
];
