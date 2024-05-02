
import { NgClass } from '@angular/common';
import { Component, computed, inject, OnInit, TemplateRef } from '@angular/core';
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
import { createHelia } from 'helia';
import { strings } from '@helia/strings';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
    EventCardComponent,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './homepage.component.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent implements OnInit
{
  public helia: any;
  public program: Program;
  public readonly wallet = injectWallet();
  public readonly connected = injectConnected();
  public readonly publicKey = injectPublicKey();
  public readonly walletName = computed(() => this.wallet()?.adapter.name ?? 'None');
  public connection: Connection;
  public provider: AnchorProvider;
  public LAMPORTS_PER_SOL = 1000000000;
  public amountToBuy = 0;

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

  public selectedEvent: any;

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

  public events: any[] = [];

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
      '8ehbcUofKS5iPesjv6a8bDfuayeABcQ3vRbC7QfHizq5'
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
          const eventAccounts = await this.program.account.event.all();
          eventAccounts.forEach((eventAccount: any) => {
            this.events.push({
              eventAccount: eventAccount,
              name: eventAccount.account.name,
              price: eventAccount.account.price,
              numberOfTickets: eventAccount.account.initialAmountOfTickets,
              date: new Date(Number(eventAccount.account.creationDate)),
              address: eventAccount.account.address,
              country: eventAccount.account.country,
              city: eventAccount.account.city,
              description: eventAccount.account.description,
              imageUrl: ""
            });
          })
          console.log('eventAccounts ', eventAccounts);
        });
      }
    })



  }

  public async addNewEvent(modal: any): Promise<void> {
    /*await this.saveInIPFS().then((image: string) =>
    {
      this.eventForm.get("imageUrl")?.setValue("bafkreib6c25gbncjav7yo6k2ynwgcvtk4jjhigunrfddp7g3m6t25qcnky");
    });

    console.log('this.eventForm.value.imageUrl ', this.eventForm.value.imageUrl);*/
    this.eventForm.get("imageUrl")?.setValue("bafkreib6c25gbncjav7yo6k2ynwgcvtk4jjhigunrfddp7g3m6t25qcnky");

    const event = Keypair.generate();

    await this.program.methods.addNewEvent(new Date(`${this.eventForm.value.date}`).getTime().toString(), parseInt(`${this.eventForm.value.price}`), 
    this.eventForm.value.country, this.eventForm.value.city, this.eventForm.value.address, this.eventForm.value.description, parseInt(`${this.eventForm.value.numberOfTickets}`), 
    this.eventForm.value.imageUrl, this.eventForm.value.name).accounts({
      event: event.publicKey,
      creator: this.provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    }).signers([event]).rpc();

    modal.close();
  }

  public async buy(): Promise<void>
  {
    const ticket = Keypair.generate();

    await this.program.methods.buyTicket(new Date().getTime().toString(), parseInt(`${this.amountToBuy}`)).accounts({
      ticket: ticket.publicKey,
      buyer: this.provider.wallet.publicKey,
      event: this.selectedEvent.eventAccount.publicKey,
      creator: this.selectedEvent.eventAccount.account.creator,
      systemProgram: SystemProgram.programId,
    }).signers([ticket]).rpc();

    const ticketAccounts = await this.program.account.ticket.all();
    console.log('ticket accounts ', ticketAccounts);
  }

  public selectAndOpen(content: TemplateRef<any>, event: any): void
  {
    this.open(content);
    this.eventForm.patchValue(event);
    this.selectedEvent = event;
    this.imageUrl = event.imageUrl;
  }

  public async deleteEvent(event: any): Promise<void>
  {
    console.log('event.eventAccount ', event);
    await this.program.methods.deleteEvent().accounts({
      event: event.eventAccount.publicKey,
      creator: this.provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    }).signers([]).rpc();
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

  public async saveEditedEvent(modal: any): Promise<void>
  {

    this.eventForm.get("imageUrl")?.setValue("bafkreib6c25gbncjav7yo6k2ynwgcvtk4jjhigunrfddp7g3m6t25qcnky");

    await this.program.methods.addNewEvent(new Date(`${this.eventForm.value.date}`).getTime().toString(), parseInt(`${this.eventForm.value.price}`), 
    this.eventForm.value.country, this.eventForm.value.city, this.eventForm.value.address, this.eventForm.value.description, parseInt(`${this.eventForm.value.numberOfTickets}`), 
    this.eventForm.value.imageUrl, this.eventForm.value.name).accounts({
      event: this.selectedEvent.eventAccount.publicKey,
      creator: this.provider.wallet.publicKey
    }).signers([this.selectedEvent.eventAccount]).rpc();

    modal.close();
  }
}
