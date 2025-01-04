import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { GorestService } from '../../../services/gorest.service';
import { User } from '../../../interfaces/user';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatIconModule],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss',
})
export class UserCardComponent {
  @Input() user!: User;
  @Output() toUserPage = new EventEmitter();

  constructor(private http: GorestService) {}

  onUserClick(): void {
    this.toUserPage.emit(this.user);
  }
}
