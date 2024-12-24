import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { GorestService } from '../../../services/gorest.service';
import { Subscription } from 'rxjs';
import { User } from '../../../interfaces/user';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconButton,
    MatIconModule,
  ],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss',
})
export class UserCardComponent {
  @Input() user!: User;
  @Output() onDeleteUser = new EventEmitter();
  @Output() toUserPage = new EventEmitter();
  protected isFocused: boolean = false;
  private deleteUserSubscription!: Subscription;

  constructor(private http: GorestService) {}

  toggleFocus(): void {
    this.isFocused = !this.isFocused;
  }

  onUserClick(): void {
    this.toUserPage.emit(this.user);
  }

  deleteUser(user: User): void {
    this.onDeleteUser.emit(user);
  }
}
