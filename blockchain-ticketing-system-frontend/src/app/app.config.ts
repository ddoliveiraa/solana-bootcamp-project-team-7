import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideWalletAdapter } from '@heavy-duty/wallet-adapter';
import { HdWalletAdapterMaterialModule } from '@heavy-duty/wallet-adapter-material';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    importProvidersFrom([
      BrowserAnimationsModule,
      HdWalletAdapterMaterialModule,
    ]),
    provideWalletAdapter(),
  ]
};
