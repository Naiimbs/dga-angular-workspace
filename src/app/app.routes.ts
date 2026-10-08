import { Routes } from '@angular/router';
import { DesignSystemComponent } from './pages/design-system/design-system';

export const routes: Routes = [
  { path: 'design-system', component: DesignSystemComponent },
  { path: '', pathMatch: 'full', redirectTo: 'design-system' },
  { path: '**', redirectTo: 'design-system' },
];
