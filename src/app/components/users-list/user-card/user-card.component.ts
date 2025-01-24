import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../../interfaces/user';

@Component({
  selector: 'app-user-card',
  imports: [CommonModule, RouterModule, MatCardModule, MatIconModule],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss',
})
export class UserCardComponent {
  @Input() user!: User;
  @Output() toUserPage: EventEmitter<any> = new EventEmitter();

  onUserClick(): void {
    this.toUserPage.emit(this.user);
  }
}
