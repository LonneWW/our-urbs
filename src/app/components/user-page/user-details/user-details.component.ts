import { Component, Input } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../../interfaces/user';
import { Post } from '../../../interfaces/post';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule, TitleCasePipe, MatCardModule, MatIconModule],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss',
})
export class UserDetailsComponent {
  @Input() user!: User;
  @Input() posts!: Post[];
}
