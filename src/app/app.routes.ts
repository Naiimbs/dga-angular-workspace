import { Routes } from '@angular/router';
import { DesignSystemComponent } from './pages/design-system/design-system';
import { Docs } from './pages/design-system/docs/docs';

export const routes: Routes = [
  { path: 'design-system/docs', component: Docs },
  { path: 'design-system', component: DesignSystemComponent },
  { path: '', pathMatch: 'full', redirectTo: 'design-system' },
  { path: '**', redirectTo: 'design-system' },
];
