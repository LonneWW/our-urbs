import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PostContentComponent } from './post-content/post-content.component';
import { PostCommentComponent } from './post-comment/post-comment.component';
import { PaginatorComponent } from '../paginator/paginator.component';
import { GorestService } from '../../services/gorest.service';
import { SearchService } from '../../services/search.service';
import { Post } from '../../interfaces/post';
import { User } from '../../interfaces/user';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-posts-list',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    PostContentComponent,
    PostCommentComponent,
    PaginatorComponent,
  ],
  templateUrl: './posts-list.component.html',
  styleUrl: './posts-list.component.scss',
})
export class PostsListComponent implements OnInit, OnDestroy, OnChanges {
  /* The `@Input() user!: User;` is defining an input property named `user` of type `User`. 
  The `@Input()` decorator is used in Angular to allow data binding from a parent component to a child component. 
  In this case, the `user` property is provided by the "user-page" component when this one is integrated ther.
  */
  @Input() user!: User;
  /* The 'currentUser' property represent the user currently logged in.
  Its values it's taken from the GorestService on the ngOnInit.
  */
  protected currentUser!: User;
  /* The 'allPostPage' property is a boolean that represent if the current page
  is or isn't the "posts-list" one, since the component is also used on the "user-page".
  Its values, if needs to be changed, it's taken from the "user-page" component through property binding.
  I preferred this method instead of using the route.
  */
  @Input() allPostsPage: boolean = true;
  /* The `onPostAvailability' event emitter is used to communicate
  with the "user-page" component and through it to the "user-details" one. 
  It indicates if there are or not posts made by the user displayed:
  if there are it passes them to the "user-page" component otherwise it
  passes an empty array.
  */
  @Output() onPostsAvailability = new EventEmitter();
  /* The line `private destroy$: Subject<void> = new Subject<void>();` is declaring a private property
  named `destroy$` of type `Subject<void>` and initializing it with a new instance of
  `Subject<void>`. */
  private destroy$: Subject<void> = new Subject<void>();
  /* The ` resultsPerPage` property represents the posts displayed per page.
  It can be updated by the paginator with the "updatePostsByPaginator" function and
  it is used to make the http calls to ge the posts.
  */
  public resultsPerPage: number = 8;
  /* The `createPostForm` property in the `PostsListComponent` class is creating a form group named
  `createPostForm` using Angular's `FormGroup` class. This form group is used to handle the form
  controls for creating a new post. */
  public createPostForm: FormGroup = new FormGroup({
    title: new FormControl<string>(``, [
      Validators.minLength(5),
      Validators.required,
    ]),
    body: new FormControl<string>(``, [
      Validators.minLength(20),
      Validators.required,
    ]),
  });

  /* The  "posts" property is an array of type `Post` and initializing it as an empty
  array `[]`. This property is used to store the list of posts that will be displayed in the
  component. By declaring it as `protected`, it can be accessed within the class as well as by any
  subclasses that may extend the `PostsListComponent` class.
  The value is updated mainly by "updatePosts* and the other update functions to reset its value.*/
  public posts: Post[] = [];
  /* The `page` property represents the page currently displayed.
  It is used to make the http calls to get the posts.*/
  public page: number = 1;
  /* The `searchString` property represents the string inserted by the user during the research.
  Its value is obtained from the "SearchService", that store and provide the "search$" stream 
  (the origin of the "search string" made by the user).
  It is used to make the http calls to get the posts.*/
  private searchString: string = '';
  /* The `path` property indicates the path of the current page.
  It takes its value on the ngOnInit.
  It's used to modify the searchQuery based on the page*/
  private path: string = '';
  /* The `lastQuery` property is an array that stores the last http call parameters.
  Its purpose is to avoid the repetition of calls,
  since the subscription to the stream "search$" may cause unnecessary ones. */
  private lastQuery!: [number, number, string];
  /* The `loading` property is a boolean that indicate when the page is fetching users.
  It's used to show or hide the mat-spinner*/
  public loading: boolean = false;

  constructor(
    protected http: GorestService,
    private searchService: SearchService,
    private _snackbar: MatSnackBar,
    private titleService: Title
  ) {}

  /**
  The function ngOnChanges emits the onPostsAvailability event to clear the posts property of the "user-page" component and update the search based on user changes.
  It's a necessary measure since the client has the possibility to change the displayed user without triggering the ngOnDestroy of this component.
  For example, by pasting the id on the url or simply visiting his profile clicking the button on the navbar while on another one.
  */
  ngOnChanges(changes: SimpleChanges): void {
    this.onPostsAvailability.emit([]);
    if (changes['user']) {
      if (this.user?.id) this.searchService.updateSearch(this.user.id);
    }
  }

  /**
   * The function `updatePosts` in TypeScript updates posts based on search criteria and pagination,
   * making API calls only if the query has changed.
   */
  updatePosts(): void {
    let searchQuery = this.path == '/posts' ? '&title=' : '&user_id=';
    searchQuery = this.searchString ? searchQuery + this.searchString : '';
    const currentQuery = [this.page, this.resultsPerPage, searchQuery];
    if (!this.areArraysEqual(currentQuery, this.lastQuery)) {
      this.posts = [];
      this.loading = true;
      this.lastQuery = [this.page, this.resultsPerPage, searchQuery];
      this.http
        .getPosts(this.page, this.resultsPerPage, searchQuery)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (r) => {
            this.loading = false;
            this.posts = r as Post[];
            if (this.posts[0]) {
              if (
                searchQuery !== '?title=' &&
                this.user &&
                this.posts[0]?.user_id != this.user?.id
              ) {
                this.onPostsAvailability.emit([]);
                this._snackbar.open(
                  'All available posts have been loaded',
                  'Ok'
                );
              } else {
                this.onPostsAvailability.emit(this.posts);
              }
            } else {
              if (this.page > 1) this.page--;
            }
          },
          error: (e) => {
            this.loading = false;
            this._snackbar.open(
              "Couldn't get any posts, check the console for more details",
              'Ok'
            );
            console.log(e);
          },
        });
    }
  }

  /**
   * The function `updatePostsBySearch` resets the page number to 1 and then updates the posts.
   * It is called on every change by the subscription to the "search$" stream.
   */
  updatePostsBySearch(): void {
    this.page = 1;
    this.updatePosts();
  }

  /**
   * The function `updatePostsByPaginator` updates the page number and results per page, then calls the
   * `updatePosts` function.
   * @param {number} page - The `page` parameter represents the page number of the posts you want to
   * display.
   * @param {number | null} resultsPerPage - The `resultsPerPage` parameter in the
   * `updatePostsByPaginator` function specifies the number of results to display per page when
   * paginating through posts. It can be a number indicating the desired number of results per page or
   * `null` if the number of results per page is not specified.
   */
  updatePostsByPaginator(page: number, resultsPerPage: number | null): void {
    this.page = page;
    if (resultsPerPage) {
      this.resultsPerPage = resultsPerPage;
    }
    this.updatePosts();
  }

  /**
   * The function `onPostCreation` creates a new post, associates it with the current user, sends a
   * request to create the post via HTTP, and handles success and error responses accordingly.
   */
  onPostCreation() {
    const post = this.createPostForm.value as Post;
    if (this.http.currentUser) {
      post.user_id = this.http.currentUser?.id;
    } else {
      post.user_id = JSON.parse(localStorage.getItem('user')!).id;
    }
    this.http
      .createPost(post)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.posts.unshift(post);
          this._snackbar.open('Post created successfully', 'Ok', {
            duration: 2000,
          });
          //MAT SNACKBAR
        },
        error: (e) => {
          this._snackbar.open(
            `Couldn't create post successfully, check the console for more details`,
            'Ok'
          );
          console.log(e); // DA IMPLEMENTARE
        },
      });
    this.createPostForm.reset();
  }

  /**
   * The `patchPost` function sends a PATCH request to update a post with the provided data and handles
   * success and error responses accordingly.
   * @param data - The `patchPost` method takes an array `data` as a parameter. The first element of the
   * array (`data[0]`) is the post object that you want to update, and the second element (`data[1]`) is
   * the new body content that you want to patch to the
   */
  patchPost(data: Array<any>): void {
    const post = data[0];
    const body = data[1];
    this.http
      .patchPost(post, body)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this._snackbar.open('Post modified successfully', 'Ok', {
            duration: 4000,
          });
        },
        error: (e) => {
          this._snackbar.open(
            "Couldn't modify post, check the console for more details",
            'Ok'
          );
          console.log(e);
        },
      });
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

  /**
   * The `ngOnInit` function initializes component properties and subscribes to search query changes.
   */
  ngOnInit(): void {
    this.path = window.location.pathname;
    this.searchService.search$
      .pipe(takeUntil(this.destroy$))
      .subscribe((query) => {
        this.searchString = query;
        this.updatePostsBySearch();
      });
    this.currentUser = this.http.currentUser;
    if (this.allPostsPage) {
      this.titleService.setTitle('OurUrbs - Forum');
    }
  }
  /**
   * The `ngOnDestroy` function in TypeScript is used to clean up resources and unsubscribe from
   * observables when a component is destroyed.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.searchService.updateSearch('');
  }
}
