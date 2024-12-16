import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  FormGroup,
  FormsModule,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from './services/auth.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { GorestService } from './services/gorest.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'our-urbs';
  searchForm!: FormGroup;
  constructor(
    private authService: AuthService,
    private router: Router,
    private gorest: GorestService
  ) {}

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      searchField: new FormControl(''),
    });
  }

  onSearchSubmit(event: Event) {
    console.log(event);
  }

  onLogout(): void {
    console.log('logout');
    this.authService.isLoggedIn = false;
    this.authService.setAuthToken('');
    this.router.navigate(['/login']);
  }
}
