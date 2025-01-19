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
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth.service';
import { SearchService } from '../../services/search.service';
import { User } from '../../interfaces/user';

@Component({
  selector: 'app-nav-bar',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatMenuModule,
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
  /* The `searchForm` property represent a form used to by the user to make resources*/
  protected searchForm!: FormGroup;
  /* The `path` property represent the current path. 
  It is used to toggle the "placeholder" and "searchablePage" property based on the current path.*/
  private path: any;
  /* The `searchablePage` property indicates if the page requires or not the searchbar.
  Its value is dermined by the current path.*/
  protected searchablePage!: boolean;
  /* The `placeholder` property is a string that determines
  the contents of the searchbar placeholder based on the current path.*/
  protected placeholder: string = '';
  /* The `userId` property is a string that indicates the user's current logged in id.
  It is used for the button that redirects to the user personal profile.*/
  protected userId: string | undefined = '';
  /* The `userLoggedIn` property is a boolean that indicates if the user is currently logged in or not.
  It is used to handle the visibility of some elements.
  Its value is taken from the AuthService*/
  protected userLoggedIn: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private searchService: SearchService
  ) {}

  /**
   * The `ngOnInit` lifecycle hook is used to initialize the component.
   * It sets up the search form and listens to router events to update the
   * `searchablePage`, `placeholder` and `userId` properties based on the current path.
   */
  ngOnInit(): void {
    this.searchForm = new FormGroup({
      searchField: new FormControl(''),
    });

    /**
     * The router events are piped through the `filter` operator to only
     * listen to `NavigationEnd` events. This is because the `NavigationEnd`
     * event is emitted after the route has been resolved and the component
     * has been initialized.
     */
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        /**
         * The `userLoggedIn` property is set to the result of the
         * `isLoggedIn` method of the `AuthService`.
         */
        this.userLoggedIn = this.authService.isLoggedIn;

        /**
         * If the user is logged in, the `userId` property is set to the
         * id of the current user.
         */
        const currentUser = JSON.parse(localStorage.getItem('user')!) as User;
        if (this.userLoggedIn && currentUser) {
          this.userId = currentUser.id;
        }

        /**
         * The `path` property is set to the current route path.
         */
        this.path = event.urlAfterRedirects;

        /**
         * The search form is cleared by patching the value of the search
         * field to an empty string.
         */
        this.searchForm.patchValue({ searchField: '' });

        /**
         * The `searchablePage` and `placeholder` properties are set based
         * on the current route path.
         */
        switch (this.path) {
          case '/users':
            this.placeholder = 'Search users by name or email';
            this.searchablePage = true;
            break;
          case '/posts': {
            this.placeholder = 'Search posts by title';
            this.searchablePage = true;
            break;
          }
          default:
            this.searchablePage = false;
            break;
        }
      });
  }

  /**
   * Handles the search form submission by retrieving the query from the form
   * and updating the search service with the new query.
   */
  onSearchSubmit(): void {
    // Retrieve the user's search query from the form
    const query = this.searchForm.get('searchField')!.value;
    // Update the search service with the new query
    this.searchService.updateSearch(query);
  }

  changeQuery(query: string): void {
    this.searchService.updateSearch(query);
  }

  onProfileClick() {
    this.router.navigate([`/users/${this.userId}`]);
  }

  onNavButtonClick(string: string) {
    this.router.navigate([`/${string}`]);
  }

  onLogout(): void {
    const approval = confirm('Do you wish to logout?');
    if (approval) {
      this.authService.loggingOut();
      this.router.navigate(['/login']);
    }
  }
}
