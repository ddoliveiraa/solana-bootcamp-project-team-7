import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { CommonModule, DatePipe } from '@angular/common';
@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatMenuModule, MatIconModule],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.scss',
  providers: [DatePipe],
})
export class EventCardComponent
{
  @Input() public eventAccount: any;
  @Input() public name: string | undefined;
  @Input() public price: number | undefined;
  @Input() public date: Date | undefined;
  @Input() public country: string | undefined;
  @Input() public city: string | undefined;
  @Input() public description: string | undefined;
  @Input() public imageUrl: string | undefined;

  @Output() viewEvent = new EventEmitter<void>();
  @Output() editEvent = new EventEmitter<void>();
  @Output() deleteEvent = new EventEmitter<void>();

  public onViewEvent(): void
  {
    this.viewEvent.emit();
  }

  public onEditEvent(): void
  {
    this.editEvent.emit();
  }

  public onDeleteEvent(): void
  {
    this.deleteEvent.emit();
  }
}
