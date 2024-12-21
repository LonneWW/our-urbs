import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import {
  FormGroup,
  FormsModule,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth.service';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-search-bar',
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
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
})
export class SearchBarComponent implements OnInit {
  protected searchForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      searchField: new FormControl(''),
    });
  }

  onSearchSubmit() {
    const query = this.searchForm.get('searchField')!.value;
    console.log(query, 'vengo da submit ts');
    this.searchService.updateSearch(query);
  }

  onLogout(): void {
    console.log('logout');
    this.authService.isLoggedIn = false;
    this.authService.setAuthToken('');
    this.router.navigate(['/login']);
  }
}
