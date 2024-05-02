use anchor_lang::prelude::*;

declare_id!("BWmuCxJqRqUwXu7rH4oJ5fYUQJjpu5umSw3SUidkY1Lq");

#[program]
pub mod ticketingsystem {
    use super::*;

    pub fn add_new_event(
        ctx: Context<AddNewEvent>,
        creation_date: String,
        price: i32,
        country: String, 
        city: String,
        address: String,
        description: String,
        initial_amount_of_tickets: i32
    ) -> Result<()> {
        let event = &mut ctx.accounts.event;
        let creator = &ctx.accounts.creator;

        event.id = event.key();
        event.creator = creator.key();
        event.creation_date = creation_date;
        event.price = price;
        event.country = country;
        event.city = city;
        event.address = address;
        event.description = description;
        event.initial_amount_of_tickets = initial_amount_of_tickets;
        event.amount_of_tickets_sold = 0;

        Ok(())
    }

    pub fn edit_event(
        ctx: Context<EditEvent>,
        price: i32,
        country: String, 
        city: String,
        address: String,
        description: String,
        initial_amount_of_tickets: i32
    ) -> Result<()> {
        let event = &mut ctx.accounts.event;
        let creator = &ctx.accounts.creator;

        if event.creator != creator.key() {
            return Err(ErrorCode::InvalidCreator.into())
        }

        event.price = price;
        event.country = country;
        event.city = city;
        event.address = address;
        event.description = description;
        event.initial_amount_of_tickets = initial_amount_of_tickets;

        Ok(())
    }

    pub fn delete_event(ctx: Context<DeleteEvent>) -> Result<()> {
        let event = &mut ctx.accounts.event;
        let creator = &ctx.accounts.creator;

        if event.creator != *creator.key {
            return Err(ErrorCode::InvalidCreator.into())
        }

        if event.initial_amount_of_tickets != 0 {
            return Err(ErrorCode::InvalidDelete.into())
        }

        Ok(())
    }

    pub fn buy_ticket(
        ctx: Context<BuyTicket>,
        transaction_date: String,
        amount: i32,
    ) -> Result<()> {
        let ticket = &mut ctx.accounts.ticket;          
        let buyer = &mut ctx.accounts.buyer;
        let event = &mut ctx.accounts.event;
        let creator = &mut ctx.accounts.creator;                  

        let ix = anchor_lang::solana_program::system_instruction::transfer(
            &buyer.key(),
            &creator.key(),
            (event.price * amount).try_into().unwrap(),
        );    
        
        anchor_lang::solana_program::program::invoke(
            &ix,
            &[
                buyer.to_account_info(),
                creator.to_account_info(),
            ],
        )?;

        ticket.id = ticket.key();   
        ticket.event_id = event.key();
        ticket.buyer_id = buyer.key();
        ticket.transaction_date = transaction_date;
        ticket.amount = amount;
        ticket.total_price = event.price * amount;
        event.amount_of_tickets_sold += amount;

        Ok(())  
    }
}

#[derive(Accounts)]
pub struct AddNewEvent<'info> {
    #[account(init, payer = creator, space = Event::LEN)]
    pub event: Account<'info, Event>,
    #[account(mut)]
    pub creator: Signer<'info>,
    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
pub struct EditEvent<'info> {
    #[account(mut)]
    pub event: Account<'info, Event>,
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub creator: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct DeleteEvent<'info> {
    #[account(mut, close = creator)] 
    pub event: Account<'info, Event>,
    #[account(mut)]
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub creator: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct BuyTicket<'info> {
    #[account(init, payer = buyer, space = Ticket::LEN)]
    pub ticket: Account<'info, Ticket>,
    #[account(mut)]
    pub buyer: Signer<'info>,
    pub event: Account<'info, Event>,
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub creator: AccountInfo<'info>,
    pub system_program: Program<'info, System>
}


#[account]
pub struct Event {
    pub id: Pubkey,
    pub creator: Pubkey,
    pub creation_date: String,
    pub price: i32,
    pub country: String,
    pub city: String,
    pub address: String,
    pub description: String,
    pub initial_amount_of_tickets: i32,
    pub amount_of_tickets_sold: i32
}

const DISCRIMINATOR_LENGTH: usize = 8;
const ID_LENGTH: usize = 32;
const CREATOR_LENGTH: usize = 32;
const CREATION_DATE_LENGTH: usize = 8;
const PRICE_LENGTH: usize = 4;
const COUNTRY_LENGTH: usize = 10 * 4; // 10 chars max.
const CITY_LENGTH: usize = 10 * 4; // 10 chars max.
const ADDRESS_LENGTH: usize = 50 * 4; // 50 chars max.
const DESCRIPTION_LENGTH: usize = 280 * 4; // 280 chars max.
const INITIAL_AMOUNT_OF_TICKETS_LENGTH: usize = 4;
const AMOUNT_OF_TICKETS_SOLD_LENGTH: usize = 4;

impl Event {
    const LEN: usize = DISCRIMINATOR_LENGTH
        + ID_LENGTH
        + CREATOR_LENGTH
        + CREATION_DATE_LENGTH
        + PRICE_LENGTH
        + COUNTRY_LENGTH
        + CITY_LENGTH
        + ADDRESS_LENGTH
        + DESCRIPTION_LENGTH
        + INITIAL_AMOUNT_OF_TICKETS_LENGTH
        + AMOUNT_OF_TICKETS_SOLD_LENGTH;
}

#[account]
pub struct Ticket {
    pub id: Pubkey,
    pub event_id: Pubkey,
    pub buyer_id: Pubkey,
    pub transaction_date: String,
    pub amount: i32,
    pub total_price: i32
}

const EVENT_ID_LENGTH: usize = 32;
const BUYER_ID_LENGTH: usize = 32;
const TRANSACTION_DATE_LENGTH: usize = 8;
const AMOUNT_LENGTH: usize = 4;
const TOTAL_PRICE_LENGTH: usize = 4;

impl Ticket {
    const LEN: usize = DISCRIMINATOR_LENGTH
        + ID_LENGTH
        + EVENT_ID_LENGTH
        + BUYER_ID_LENGTH
        + TRANSACTION_DATE_LENGTH
        + AMOUNT_LENGTH
        + TOTAL_PRICE_LENGTH;
}

#[error_code]
pub enum ErrorCode {
    #[msg("NOT ALLOWED TO DELETE")]
    InvalidDelete,
    #[msg("Invalid Creator")]
    InvalidCreator
}