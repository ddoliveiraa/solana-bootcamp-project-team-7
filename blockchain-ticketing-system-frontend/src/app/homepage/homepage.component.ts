
import { NgClass } from '@angular/common';
import { Component, computed, inject, TemplateRef } from '@angular/core';
import {
  ConnectionStore,
  injectConnected,
  injectPublicKey,
  injectWallet,
  WalletStore,
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
import { clusterApiUrl, Connection, Keypair, PublicKey, SystemProgram } from '@solana/web3.js';
import { AnchorProvider, Idl, Program } from '@project-serum/anchor';
import idl from '../../assets/idl/ticketingsystem.json';

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
    EventCardComponent
  ],
  templateUrl: './homepage.component.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent
{
  public program: Program;
  public readonly wallet = injectWallet();
  public readonly connected = injectConnected();
  public readonly publicKey = injectPublicKey();
  public readonly walletName = computed(() => this.wallet()?.adapter.name ?? 'None');
  public connection: Connection;
  public provider: AnchorProvider;
  public LAMPORTS_PER_SOL = 1000000000;

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
      date: new Date(),
      address: "Avenida Lourenço Peixinho",
      country: "PT",
      city: "Aveiro",
      description: "Experience the rich flavors of Italian cuisine at our annual food festival.",
      imageUrl: ""
    }
  ];

  public imageUrl: string | undefined;

  constructor(
    private readonly hdConnectionStore: ConnectionStore,
    private readonly hdWalletStore: WalletStore
  ) {}

  public async ngOnInit(): Promise<void> {
    this.hdConnectionStore.setEndpoint('https://api.devnet.solana.com');
    this.setProviderAndConnect();
    
  }

  public async setProviderAndConnect(): Promise<void> {
    const programID = new PublicKey(
      'BWmuCxJqRqUwXu7rH4oJ5fYUQJjpu5umSw3SUidkY1Lq'
    );

    this.connection = new Connection(clusterApiUrl("devnet"));


    this.hdWalletStore.anchorWallet$.subscribe((wallet) => {
      if (wallet) {
        this.provider = new AnchorProvider(
          this.connection,
          wallet,
          { commitment: "processed" }
        );

        this.program = new Program(idl as Idl, programID, this.provider);
        
        this.hdWalletStore.connected$.subscribe(async () => {
          console.log('ESTOU AQUI');
          const eventAccounts = await this.program.account.event.all();
          console.log('eventAccounts ', eventAccounts);
        });
      }
    })


    
  }

  public async addNewEvent(modal: any): Promise<void> {
    const event = Keypair.generate();

    await this.program.methods.addNewEvent(Date.now().toString(), this.LAMPORTS_PER_SOL/10, "Portugal", "Aveiro", "Address", "Description", 100).accounts({
      event: event.publicKey,
      creator: this.provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    }).signers([event]).rpc();

    modal.close();
  }

  public selectAndOpen(content: TemplateRef<any>, event: any): void
  {
    this.open(content);
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
      reader.onload = () =>
      {
        this.imageUrl = reader.result as string;
      };
    }
  }

  public removeImage(): void
  {
    this.imageUrl = undefined;
  }
}
