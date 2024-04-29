
import { NgClass } from '@angular/common';
import { Component, computed, inject, TemplateRef } from '@angular/core';
import {
  injectConnected,
  injectPublicKey,
  injectWallet,
} from '@heavy-duty/wallet-adapter';
import { HdObscureAddressPipe } from '@heavy-duty/wallet-adapter-cdk';
import { HdWalletMultiButtonComponent } from '@heavy-duty/wallet-adapter-material';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [
    NgClass,
    HdObscureAddressPipe,
    HdWalletMultiButtonComponent,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatSelectModule
  ],
  templateUrl: './homepage.component.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent
{
  public readonly wallet = injectWallet();
  public readonly connected = injectConnected();
  public readonly publicKey = injectPublicKey();
  public readonly walletName = computed(() => this.wallet()?.adapter.name ?? 'None');

  private modalService = inject(NgbModal);
	closeResult = '';

  public countries = [
    { code: "AT", label: "🇦🇹 Austria" },
    { code: "BE", label: "🇧🇪 Belgium" },
    { code: "BG", label: "🇧🇬 Bulgaria" },
    { code: "HR", label: "🇭🇷 Croatia" },
    { code: "CY", label: "🇨🇾 Cyprus" },
    { code: "CZ", label: "🇨🇿 Czech Republic" },
    { code: "DK", label: "🇩🇰 Denmark" },
    { code: "EE", label: "🇪🇪 Estonia" },
    { code: "FI", label: "🇫🇮 Finland" },
    { code: "FR", label: "🇫🇷 France" },
    { code: "DE", label: "🇩🇪 Germany" },
    { code: "GR", label: "🇬🇷 Greece" },
    { code: "HU", label: "🇭🇺 Hungary" },
    { code: "IE", label: "🇮🇪 Ireland" },
    { code: "IT", label: "🇮🇹 Italy" },
    { code: "LV", label: "🇱🇻 Latvia" },
    { code: "LT", label: "🇱🇹 Lithuania" },
    { code: "LU", label: "🇱🇺 Luxembourg" },
    { code: "MT", label: "🇲🇹 Malta" },
    { code: "NL", label: "🇳🇱 Netherlands" },
    { code: "PL", label: "🇵🇱 Poland" },
    { code: "PT", label: "🇵🇹 Portugal" },
    { code: "RO", label: "🇷🇴 Romania" },
    { code: "SK", label: "🇸🇰 Slovakia" },
    { code: "SI", label: "🇸🇮 Slovenia" },
    { code: "ES", label: "🇪🇸 Spain" },
    { code: "SE", label: "🇸🇪 Sweden" },
    { code: "GB", label: "🇬🇧 United Kingdom" },
    { code: "US", label: "🇺🇸 United States" },
  ];

	public open(content: TemplateRef<any>): void
  {
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
			(result) =>
      {
				this.closeResult = `Closed with: ${result}`;
			},
			(reason) =>
      {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			},
		);
	}

	private getDismissReason(reason: any): string
  {
		switch (reason)
    {
			case ModalDismissReasons.ESC:
				return 'by pressing ESC';
			case ModalDismissReasons.BACKDROP_CLICK:
				return 'by clicking on a backdrop';
			default:
				return `with: ${reason}`;
		}
	}
}
