import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { ImageUploadComponent } from './image-upload/component';

export const routes: Routes = [
  {
    path: 'homepage',
    component: HomepageComponent
  },
  {
    path: 'image-upload',
    component: ImageUploadComponent
  }
];
