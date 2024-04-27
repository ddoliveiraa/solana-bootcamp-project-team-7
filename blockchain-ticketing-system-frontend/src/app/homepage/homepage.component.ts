
import { NgClass } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import {
  injectConnected,
  injectPublicKey,
  injectWallet,
} from '@heavy-duty/wallet-adapter';
import { HdObscureAddressPipe } from '@heavy-duty/wallet-adapter-cdk';
import { HdWalletMultiButtonComponent } from '@heavy-duty/wallet-adapter-material';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [NgClass, HdObscureAddressPipe, HdWalletMultiButtonComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent
{
  readonly wallet = injectWallet();
  readonly connected = injectConnected();
  readonly publicKey = injectPublicKey();
  readonly walletName = computed(() => this.wallet()?.adapter.name ?? 'None');
}
