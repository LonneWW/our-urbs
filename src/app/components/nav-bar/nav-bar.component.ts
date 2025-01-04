import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import {
  FormGroup,
  FormsModule,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { filter } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth.service';
import { GorestService } from '../../services/gorest.service';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent implements OnInit {
  protected searchForm!: FormGroup;
  private path: any;
  protected searchablePage!: boolean;
  protected placeholder: string = '';
  protected userId!: string;

  constructor(
    private router: Router,
    private authService: AuthService,
    private gorestService: GorestService,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      searchField: new FormControl(''),
    });

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.path = event.urlAfterRedirects;
        if (this.path == '/users' || this.path == '/posts') {
          this.placeholder = 'Search users by name or email';
          this.searchablePage = true;
          const userString = localStorage.getItem('user');
          if (userString) {
            const user = JSON.parse(userString);
            this.userId = `/users/${user.id}`;
            console.log(this.userId);
          }
        } else {
          this.placeholder = 'Search posts by';
          this.searchablePage = false;
        }
      });
  }

  onSearchSubmit(): void {
    const query = this.searchForm.get('searchField')!.value;
    console.log(query, 'vengo da submit ts');
    this.searchService.updateSearch(query);
  }

  changeQuery(query: string): void {
    this.searchService.updateSearch(query);
  }

  onProfileClick() {
    console.log('click');
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      console.log(user);
      this.router.navigate([`/users/${user.id}`], { state: { user: user } });
    }
  }

  onLogout(): void {
    this.authService.loggingOut();
  }
}
