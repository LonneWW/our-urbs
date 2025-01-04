import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PostContentComponent } from './post-content/post-content.component';
import { PostCommentComponent } from './post-comment/post-comment.component';
import { PaginatorComponent } from '../paginator/paginator.component';
import { GorestService } from '../../services/gorest.service';
import { SearchService } from '../../services/search.service';
import { Post } from '../../interfaces/post';
import { User } from '../../interfaces/user';

@Component({
  selector: 'app-posts-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    PostContentComponent,
    PostCommentComponent,
    PaginatorComponent,
  ],
  templateUrl: './posts-list.component.html',
  styleUrl: './posts-list.component.scss',
})
export class PostsListComponent implements OnInit, OnDestroy {
  @Input() user!: User;
  @Input() allPostsPage: boolean = true;
  @Output() onPostsAvailability = new EventEmitter();
  private destroy$: Subject<void> = new Subject<void>();
  protected resultsPerPage: number = 5;
  protected createPostForm: FormGroup = new FormGroup({
    title: new FormControl<string>(''),
    body: new FormControl<string>(''),
  });
  protected posts: Post[] = [];
  private page: number = 1;
  private searchString: string = '';
  private loading: boolean = false;
  private path: string = '';
  private searchQuery: string = '';

  constructor(
    private http: GorestService,
    private searchService: SearchService,
    private route: ActivatedRoute,
    private _snackbar: MatSnackBar
  ) {}

  // @HostListener('window: scroll')
  // onScroll(): void {
  //   if (
  //     window.scrollY + window.innerHeight >= document.body.scrollHeight * 0.8 &&
  //     !this.loading
  //   ) {
  //     if (this.postSubscription) this.postSubscription.unsubscribe();
  //     this.updatePosts();
  //   }
  // }

  updatePosts(): void {
    this.loading = true;
    this.searchQuery = this.path == 'posts' ? '&title=' : '&user_id=';
    this.searchQuery = this.searchString
      ? this.searchQuery + this.searchString
      : '';
    this.http
      .getPosts(this.page, this.resultsPerPage, this.searchQuery)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (r) => {
          this.posts = [...this.posts, ...(r as Post[])];
          if (this.posts[0]) {
            if (
              this.searchQuery !== '?title=' &&
              this.posts[0]?.user_id != this.user?.id
            ) {
              this.onPostsAvailability.emit([]);
            } else {
              this.onPostsAvailability.emit(this.posts);
            }
          }
          this.loading = false;
          this.page++;
        },
        error: (e) => {
          this.loading = true;
        }, //DA IMPLEMENTARE
      });
  }

  updatePostsBySearch(): void {
    this.page = 1;
    this.posts = [];
    this.updatePosts();
  }

  loadPosts(page: number, resultsPerPage: number | null) {
    this.page = page;
    if (resultsPerPage) {
      this.resultsPerPage = resultsPerPage;
    }
  }

  onPostCreation() {
    const post = this.createPostForm.value as Post;
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      post.user_id = user.id;
    }
    this.http
      .createPost(post)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (r) => {
          console.log(r);
          this.posts.unshift(post);
          this._snackbar.open('Post created successfully', 'Ok');
          //MAT SNACKBAR
        },
        error: (e) => {
          this._snackbar.open(
            `Error: ${e.message.field} ${e.message.message}`,
            'Ok'
          );
          console.log(e); // DA IMPLEMENTARE
        },
      });
    this.createPostForm.reset();
  }

  ngOnInit(): void {
    this.path = this.route.snapshot.url[0].path;
    if (this.path !== 'posts') {
      this.searchService.updateSearch(this.user.id);
    }
    this.searchService.search$
      .pipe(takeUntil(this.destroy$))
      .subscribe((query) => {
        this.searchString = query;
        this.updatePostsBySearch();
      });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.searchService.updateSearch('');
  }
}
