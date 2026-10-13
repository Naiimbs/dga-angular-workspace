import { Routes } from '@angular/router';
import { DesignSystemComponent } from './pages/design-system/design-system';
import { Docs } from './pages/design-system/docs/docs';
import { FaqTemplate } from './pages/templates/faq/faq-template';

export const routes: Routes = [
  { path: 'design-system/docs', component: Docs },
  { path: 'templates/faq', component: FaqTemplate },
  { path: 'design-system', component: DesignSystemComponent },
  { path: '', pathMatch: 'full', redirectTo: 'design-system' },
  { path: '**', redirectTo: 'design-system' },
];
