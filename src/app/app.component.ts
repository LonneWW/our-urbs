import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from './services/auth.service';
import { GorestService } from './services/gorest.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, MatButtonModule, MatIconModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'our-urbs';
  constructor(private authService: AuthService, private router: Router) {}

  onLogout(): void {
    console.log('logout');
    this.authService.isLoggedIn = false;
    this.authService.setAuthToken('');
    this.router.navigate(['/login']);
  }
}
