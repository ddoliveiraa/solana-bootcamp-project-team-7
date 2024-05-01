
import { NgClass } from '@angular/common';
import { Component, computed, inject, OnInit, TemplateRef } from '@angular/core';
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
import { EventCardComponent } from './event-card/event-card.component';
import { createHelia } from 'helia'
import { strings } from '@helia/strings'
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

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
    MatSelectModule,
    EventCardComponent,
    ReactiveFormsModule
  ],
  templateUrl: './homepage.component.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent implements OnInit
{
  public helia: any;

  constructor()
  {

  }
  public async ngOnInit(): Promise<void>
  {


  }

  public readonly wallet = injectWallet();
  public readonly connected = injectConnected();
  public readonly publicKey = injectPublicKey();
  public readonly walletName = computed(() => this.wallet()?.adapter.name ?? 'None');

  public eventForm = new FormGroup({
    name: new FormControl(''),
    price: new FormControl(0),
    numberOfTickets: new FormControl(0),
    date: new FormControl(''),
    address: new FormControl(''),
    country: new FormControl(''),
    city: new FormControl(''),
    description: new FormControl(''),
    imageUrl: new FormControl(''),
  });

  public selectedEvent = {
    name: '',
    price: 0,
    numberOfTickets: 0,
    date: '',
    address: '',
    country: '',
    city: '',
    description: '',
    imageUrl: '',
  };

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

  public events = [
    {
      name: "Concert in the Park",
      price: 50,
      numberOfTickets: 50,
      date: new Date(),
      address: "123 Main St, Anytown USA",
      country: "US",
      city: "New York",
      description: "Join us for an evening of live music and fun in Central Park.",
      imageUrl: ""
    },
    {
      name: "Tech Conference",
      price: 200,
      numberOfTickets: 100,
      date: new Date(),
      address: "456 Elm St, Anytown USA",
      country: "US",
      city: "Berlin",
      description: "A conference for tech enthusiasts and professionals, featuring talks and workshops on the latest trends and technologies.",
      imageUrl: ""
    },
    {
      name: "Food Festival",
      price: 30,
      numberOfTickets: 50,
      date: new Date(),
      address: "789 Oak St, Anytown USA",
      country: "IT",
      city: "Rome",
      description: "Experience the rich flavors of Italian cuisine at our annual food festival.",
      imageUrl: ""
    },
    {
      name: "Food Festival",
      price: 30,
      numberOfTickets: 50,
      date: new Date(),
      address: "Avenida Lourenço Peixinho",
      country: "PT",
      city: "Aveiro",
      description: "Experience the rich flavors of Italian cuisine at our annual food festival.",
      imageUrl: ""
    }
  ];

  public imageUrl: string | undefined;

  public selectAndOpen(content: TemplateRef<any>, event: any): void
  {
    this.open(content);
    this.eventForm.patchValue(event);
    this.selectedEvent = event;
    this.imageUrl = event.imageUrl;
  }

	public open(content: TemplateRef<any>): void
  {
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg' }).result.then(
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

  public uploadImage(input: HTMLInputElement): void
  {
    input.click();
  }

  public onFileSelected(event: any): void
  {
    const file: File = event.target.files[0];

    if (file)
    {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () =>
      {
        this.imageUrl = reader.result as string;


      };
    }
  }

  public removeImage(): void
  {
    this.imageUrl = undefined;
  }

  private async saveInIPFS(): Promise<string>
  {
    const helia = await createHelia();
    const s = strings(helia);

    const myImmutableAddress = await s.add(this.imageUrl as string);

    return myImmutableAddress.toString();
  }

  public async saveEvent(modal: any): Promise<void>
  {
    await this.saveInIPFS().then((image: string) =>
    {
      this.eventForm.get("imageUrl")?.setValue(image);
    });

    modal.close();
  }

  public async saveEditedEvent(modal: any): Promise<void>
  {
    await this.saveInIPFS().then((image: string) =>
    {
      this.eventForm.get("imageUrl")?.setValue(image);
    });

    modal.close();
  }
}
