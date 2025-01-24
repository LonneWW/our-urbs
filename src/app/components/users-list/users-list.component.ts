import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { UserCardComponent } from './user-card/user-card.component';
import { PaginatorComponent } from '../paginator/paginator.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service';
import { GorestService } from '../../services/gorest.service';
import { SearchService } from '../../services/search.service';
import { User } from '../../interfaces/user';
import { Title } from '@angular/platform-browser';

/* The `UsersListComponent` class is responsible for managing a list of users, handling
user interactions, making API calls, and subscribing to search updates and user data. */
@Component({
  selector: 'app-users-list',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UserCardComponent,
    PaginatorComponent,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
})
export class UsersListComponent implements OnInit, OnDestroy {
  /* The `public users: User[] = [];` is declaring a public property named `users` 
  which is an array of `User` objects (by default, empty).
  This property will be used to store the list of users retrieved from the API or any other source
  in the component. */
  public users: User[] = [];
  /* The page property rappresent the current page of the users list.
  It is passed to the paginator components and used to make calls to the API*/
  protected page: number = 1;
  /* The resultsPerPage property rappresent the items (users) loaded per page.
  It's used to make calls to the API*/
  protected resultsPerPage: number = 8;
  /* The line `private destroy$: Subject<void> = new Subject<void>();` is declaring a private property
  `destroy$` of type `Subject<void>` and initializing it with a new instance of `Subject<void>`.
  It's used to unsubscribe to multiple subscriptions on the ngOnDestroy of the component. */
  private destroy$: Subject<void> = new Subject<void>();
  /* The 'searchString' property rappresent the string entered by the user during the search.
  Its value is passed by a subscription from the searchService, who keeps track of its changes. 
  It's used to make calls to the API*/
  private searchString: string | undefined = '';
  /* The `protected createUserForm` property is creating a form group named `createUserForm` that
contains form controls for `name`, `email`, `gender`, and `status`. Each form control is initialized
with an empty string value and follows the user model of the API. */
  protected createUserForm: FormGroup = new FormGroup({
    name: new FormControl<string>(''),
    email: new FormControl<string>(''),
    gender: new FormControl<string>(''),
    status: new FormControl<string>(''),
  });
  protected loading: boolean = false;
  /* The 'hideSpinner' property is a boolean used to show or not the mat-spinner.
  It essential if the search returns no results.*/
  protected hideSpinner: boolean = false;
  /* The `lastQuery` property is an array that stores the last http call parameters.
  Its purpose is to avoid the repetition of calls,
  since the subscription to the stream "search$" may cause unnecessary ones. */
  private lastQuery!: [number, number, string];
  constructor(
    private authService: AuthService,
    private http: GorestService,
    private searchService: SearchService,
    private router: Router,
    private _snackbar: MatSnackBar,
    private titleService: Title
  ) {}

  /**
   * The function `updateUsers` makes an HTTP request to get users, updates the users array on success,
   * and displays an error message if there is an error.
   */
  updateUsers(): void {
    this.loading = true;
    const currentQuery = [this.page, this.resultsPerPage, this.searchString];
    if (!this.areArraysEqual(currentQuery, this.lastQuery)) {
      this.users = [];
      this.loading = true;
      if (!this.searchString) this.searchString = '';
      this.lastQuery = [this.page, this.resultsPerPage, this.searchString];
      this.http
        .getUsers(this.page, this.resultsPerPage, this.searchString)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (r) => {
            this.loading = false;
            this.users = r as User[];
            if (this.users.length == 0) {
              this.hideSpinner = true;
              this._snackbar.open(
                'There are no users with the corrisponding name or email.',
                'Ok'
              );
            }
            setTimeout(() => (this.loading = false), 2000);
          },
          error: (e) => {
            this.loading = false;
            this._snackbar.open(
              "Something went wrong. Couldn't get any users.",
              'Ok'
            );
            console.log(e);
          },
        });
    }
  }

  /**
   * The function `updateUsersBySearch`, called when the searchString changes,
   *  resets the page number, clears the users array, and then calls
   * the `updateUsers` function.
   * The condition (!this.loading) ensures that there are no other calls.
   */
  updateUsersBySearch(): void {
    this.page = 1;
    this.updateUsers();
  }

  /**
   * The function `updateUsersbyPaginator`, called when a paginators' button is clicked,
   * updates the page number and results per page for a list of users.
   * @param {number} page - The `page` parameter represents the current page number.
   * @param {number | null} resultsPerPage - The `resultsPerPage` parameter in the
   * `updateUsersbyPaginator` function specifies the number of results to display per page when
   * paginating through a list of users. If a value is provided for `resultsPerPage`, the function will
   * update the `resultsPerPage` property of the object to that value.
   */
  updateUsersbyPaginator(page: number, resultsPerPage: number | null): void {
    this.page = page;
    if (resultsPerPage) {
      this.resultsPerPage = resultsPerPage;
    }
    this.updateUsers();
  }

  redirectToUserPage(user: User): void {
    this.router.navigate([`/users/${user.id}`]);
  }

  /* On the initialization of the component it subscribes to the search
  stream of the searchService to stay updated with the changes of the searchString
  */
  ngOnInit(): void {
    this.titleService.setTitle('OurUrbs - Community');
    this.searchService.search$
      .pipe(takeUntil(this.destroy$))
      .subscribe((query) => {
        this.searchString = query;
        this.updateUsersBySearch();
      });

    /* Since the user id is essential to the navigation, 
    if it is not there already there (checking the localStorage) 
    the current user's data is fetched, 
    so that the user can visit its own profile page.
    The error handling it's not specific in this case. If some error
    may occur it should throw the wildcard route and hopefully get fixed on its own.
    */
    const userString = localStorage.getItem('user');
    if (userString) {
      let user = JSON.parse(userString);
      if (!user.id) {
        this.http
          .getUsers(1, 1, user.email)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (r: any) => {
              let newUser = r[0] as User;
              this.http.setCurrentUser(newUser);
            },
            error: () => {
              this._snackbar.open(
                'Something went wrong, please try to recover your user data',
                'Ok'
              );
              this.authService.loggingOut();
            },
          });
      }
    }
  }

  /**
   * The function `areArraysEqual` compares two arrays `arr1` and `arr2` and returns a boolean
   * value. It returns `true` if the arrays are equal (have the same elements in the same order) and
   * `false` otherwise.
   */
  areArraysEqual(arr1: any[], arr2: any[]): boolean {
    if (arr1 && arr2) {
      if (arr1.length !== arr2.length) {
        return false;
      }
      for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
          return false;
        }
      }
      return true;
    } else {
      return false;
    }
  }

  /*The method "getSearchString" returns the component's searchString. It was added for testing purposes.*/
  public getSearchString(): string | undefined {
    return this.searchString;
  }

  /**
   * The ngOnDestroy function in TypeScript is used to clean up resources and unsubscribe from
   * observables.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.searchService.updateSearch('');
  }
}
