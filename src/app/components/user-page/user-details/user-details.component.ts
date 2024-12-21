import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { User } from '../../../interfaces/user';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss',
})
export class UserDetailsComponent {
  protected user: User = {
    name: 'ugo',
    email: 'e@mail.com',
    gender: 'male',
    status: 'online',
  };
}
