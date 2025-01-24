import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserDetailsComponent } from './user-details/user-details.component';
import { PostsListComponent } from '../posts-list/posts-list.component';
import { GorestService } from '../../services/gorest.service';
import { SearchService } from '../../services/search.service';
import { User } from '../../interfaces/user';
import { Post } from '../../interfaces/post';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-user-page',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    UserDetailsComponent,
    PostsListComponent,
  ],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.scss',
})
export class UserPageComponent implements OnInit, OnDestroy {
  /*The property 'user' represent the specific user's data.
  It is obtained through a http call on the initialization of the component */
  public user: User = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    gender: 'male',
    status: 'inactive',
  };
  /*The property 'posts' represent the user's personal posts.
  It is obtained through event binding from the "posts-list" component.*/
  public posts: Post[] = [];
  /* The line `private destroy$: Subject<void> = new Subject<void>();` is declaring a private property
  `destroy$` of type `Subject<void>` and initializing it with a new instance of `Subject<void>`.
  It's used to unsubscribe to multiple subscriptions on the ngOnDestroy of the component. */
  private destroy$: Subject<void> = new Subject<void>();
  /*The property 'AllPostPage' is a boolean that indicates if the current page is or isn't the "list of posts" one.
  It is passed to the "posts-list" component to handle some other internal component, like to show or not the "items per page" one.
  .*/
  protected allPostsPage: boolean = false;
  /*The property 'showPosts' is a boolean strictly connected to the number posts made by the user.
  The REST API,if it doesn't find any correlated to the specific user, returns the array of all posts.
  So, in order to handle this, this property is first binded to the "post-list" component and "bounces back" 
  through the event emitter based on the posts received after the http call: if there are some posts linked to
  the user, this property value is true and "post-list" shown; otherwise this property value is false 
  and the "post-list" component isn't shown.
  */
  public showPosts: boolean = true;
  /*The property 'currentUser' represent the user who's logged in.
  It is used to define the boolean value of the "currentUserProfile" property.
  Its value is obtained from the GorestService on the inizialization.
  .*/
  public currentUser!: User;
  /*The property 'currentUserProfile' indicates if user showed in the page is the same as the one who's logged in.
  It is used to manage some additional elements of the page, like the "delete profile" button.
  .*/
  protected currentUserProfile: boolean = false;
  /*The property 'editCredentialsForm' represent the form used from the user to edit its personal data..*/
  public editCredentialsForm = new FormGroup({
    name: new FormControl('', [Validators.minLength(3), Validators.required]),
    email: new FormControl('', [
      Validators.email,
      Validators.minLength(5),
      Validators.required,
    ]),
  });
  /*The properties 'editingName' and 'editingEmail' are booleans that represent if the user is changing the respective fields.
  Are used to handle the visibility and appearance of the elements correlated to the 'editCredentialsForm'.
  .*/
  protected editingName: boolean = false;
  protected editingEmail: boolean = false;
  constructor(
    private router: Router,
    private searchService: SearchService,
    private route: ActivatedRoute,
    private http: GorestService,
    private _snackbar: MatSnackBar,
    private titleService: Title
  ) {}

  /**
   * The function `postsAvailability` sets the posts array and updates the visibility of posts to be
   * shown. It is called by listening to the 'onPostsAvailability' event from the "posts-list" component.
   * This method sets the `posts` property of the class to the provided array of posts
   * and sets the `showPosts` property to `true`, indicating that the posts should be displayed.
   */
  postsAvailability(posts: Post[]): void {
    this.posts = posts;
    this.showPosts = true;
  }

  /**
   * The ngOnInit function subscribes to route parameter changes and fetches user data if the user ID has
   * changed.
   * It also set the current user property by the GorestService.
   */
  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const userId = params.get('id');
      if (userId && (!this.user || this.user.id !== userId)) {
        this.getUser(userId);
      }
    });
    if (this.http.currentUser) {
      this.currentUser = this.http.currentUser;
    } else {
      this.currentUser = JSON.parse(localStorage.getItem('user')!) as User;
    }
  }

  /**
   * The function `getUser` retrieves user data based on an ID, updates the user profile, and handles
   * errors.
   * @param {string} id - The `getUser` method provided is used to fetch user data based on the `id`
   * parameter passed to it. The method makes an HTTP GET request to retrieve user information, and then
   * processes the response accordingly.
   */
  getUser(id: string): void {
    this.http
      .getUsers(1, 1, id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (r) => {
          const result = r as Array<any>;
          if (result.length == 0) {
            this.router.navigate([
              '**',
              {
                state: {
                  message:
                    "Couldn't get user details, try to recover your user data",
                  status: '404',
                },
              },
            ]);
          }
          this.user = result[0];
          this.titleService.setTitle(`${this.user.name}'s profile`);
          this.currentUserProfile = this.currentUser?.id === this.user?.id;
          this.editCredentialsForm.patchValue({ name: `${this.user?.name}` });
          this.editCredentialsForm.patchValue({ email: `${this.user?.email}` });
          this.disableAllFields();
        },
        error: (e) => {
          this.router.navigate([
            '**',
            {
              state: {
                message: e.message,
                status: e.status,
              },
            },
          ]);
        },
      });
  }

  /**
   * The `deleteUser` function deletes a user from the server, clears user data from local storage and
   * session storage, and navigates to the registration page with appropriate alerts for success or
   * error.
   */
  deleteUser(): void {
    const approval = confirm(
      'Do you wish to delete your profile? This action is irriversable'
    );
    if (approval) {
      const user = JSON.parse(localStorage.getItem('user')!);
      this.http
        .deleteUser(user)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            localStorage.removeItem('user');
            sessionStorage.clear();
            this.router.navigate(['/register']);
            alert(
              'User deleted successfully. Redirected to registration page.'
            );
          },
          error: (e) => {
            this._snackbar.open(
              "Couldn't delete user profile, check the console for more details",
              'Ok'
            );
            console.log(e);
          },
        });
    }
  }

  /**
   * The function `editField` enables editing for either the name or email field based on the input
   * parameter.
   * @param {string} field - The `field` parameter in the `editField` method is a string that specifies
   * which field is being edited. The parameter, provided in the html, can be 'name' or 'email' It is used
   * in a switch statement to determine which field to enable for
   * editing - either the name field or the email field.
   */
  editField(field: string): void {
    switch (field) {
      case 'name':
        this.editingName = true;
        this.editCredentialsForm.get('name')?.enable();
        break;
      case 'email':
        this.editingEmail = true;
        this.editCredentialsForm.get('email')?.enable();
        break;
    }
  }

  /**
   * The function `cancelFieldEdit` cancels editing for a specific field in a form by disabling the field
   * and resetting its value to the original value.
   * @param {string} field - The `field` parameter in the `cancelFieldEdit` function is a string that
   * specifies which field is being edited. It can have values of `'name'` or `'email'`.
   */
  cancelFieldEdit(field: string): void {
    switch (field) {
      case 'name':
        this.disableNameField();
        this.editCredentialsForm.patchValue({ name: `${this.user?.name}` });
        break;
      case 'email':
        this.disableEmailField();
        this.editCredentialsForm.patchValue({ email: `${this.user?.email}` });
        break;
    }
  }

  /**
   * The `patchField` function prompts the user to confirm changes, then sends a PATCH request to update
   * user data and handles success and error responses accordingly.
   */
  patchField(): void {
    const approval = confirm('Do you wish to apply the changes made?');
    if (approval) {
      this.http
        .patchUser(this.user, this.editCredentialsForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (r) => {
            this._snackbar.open('User modified successfully', 'Ok', {
              duration: 4000,
            });
            const form = this.editCredentialsForm.value;
            if (form.name) {
              this.user.name = form.name as string;
            }
            if (form.email) {
              this.user.email = form.email as string;
            }
            this.disableAllFields();
            this.http.setCurrentUser(r as User);
          },
          error: (e) => {
            this._snackbar.open(
              "Couldn't modify user data, check the console for more details",
              'Ok'
            );
            console.log(e);
          },
        });
    }
  }

  /**
   * The function `disableNameField` disables the name field in a form.
   */
  disableNameField(): void {
    this.editingName = false;
    this.editCredentialsForm.get('name')?.disable();
  }

  /**
   * The function `disableEmailField` disables the email field in a form.
   */
  disableEmailField(): void {
    this.editingEmail = false;
    this.editCredentialsForm.get('email')?.disable();
  }

  /**
   * The `disableAllFields` function in TypeScript disables both the name and email fields.
   */
  disableAllFields(): void {
    this.disableNameField();
    this.disableEmailField();
  }

  /**
   * The ngOnDestroy function in TypeScript updates the search term and hides the posts.
   */
  ngOnDestroy(): void {
    this.searchService.updateSearch('');
    this.showPosts = false;
  }
}
