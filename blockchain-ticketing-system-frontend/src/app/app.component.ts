import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { HomepageComponent } from './homepage/homepage.component';
import {MatButtonModule} from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { HdWalletAdapterMaterialModule } from '@heavy-duty/wallet-adapter-material';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    MatSlideToggleModule,
    MatButtonModule,
    HomepageComponent,
    HdWalletAdapterMaterialModule,
    HeaderComponent,
    HomepageComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'blockchain-ticketing-system-frontend';
}
