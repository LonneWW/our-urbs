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
import { Subscription } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PostContentComponent } from './post-content/post-content.component';
import { PostCommentComponent } from './post-comment/post-comment.component';
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
    PostContentComponent,
    PostCommentComponent,
  ],
  templateUrl: './posts-list.component.html',
  styleUrl: './posts-list.component.scss',
})
export class PostsListComponent implements OnInit, OnDestroy {
  @Input() user!: User;
  @Input() showForm: boolean = true;
  @Output() onPostsAvailability = new EventEmitter();
  protected createPostForm: FormGroup = new FormGroup({
    user_id: new FormControl<string>(''),
    title: new FormControl<string>(''),
    body: new FormControl<string>(''),
  });
  private createdPostSubscritpion!: Subscription;
  protected posts: Post[] = [];
  private postSubscription!: Subscription;
  private resultsPerPage: number = 20; //Da settare col gorest service? Avrebbe senso mantenere lo stesso numero di risultati indipendentemente dalla pagina
  private page: number = 1;
  private searchString: string = '';
  private searchSubscription!: Subscription;
  private loading: boolean = false;
  private path: string = '';
  private searchQuery: string = '';

  constructor(
    private http: GorestService,
    private searchService: SearchService,
    private route: ActivatedRoute
  ) {}

  @HostListener('window: scroll')
  onScroll(): void {
    if (
      window.scrollY + window.innerHeight >= document.body.scrollHeight * 0.8 &&
      !this.loading
    ) {
      if (this.postSubscription) this.postSubscription.unsubscribe();
      this.updatePosts();
    }
  }

  updatePosts(): void {
    this.loading = true;
    console.log(this.searchQuery);
    this.searchQuery = this.path == 'posts' ? '&title=' : '&user_id=';
    this.searchQuery = this.searchString
      ? this.searchQuery + this.searchString
      : '';
    console.log(this.searchQuery);
    this.postSubscription = this.http
      .getPosts(this.page, this.resultsPerPage, this.searchQuery)
      .subscribe({
        next: (r) => {
          this.posts = [...this.posts, ...(r as Post[])];
          if (
            this.searchQuery !== '?title=' &&
            this.posts[0].user_id != this.user?.id
          ) {
            console.log('click');
            this.onPostsAvailability.emit([]);
          } else {
            console.log('clock');
            this.onPostsAvailability.emit(this.posts);
          }
          this.loading = false;
          this.page++;
        },
        error: (e) => {
          console.log('clck');
          this.loading = true;
        }, //DA IMPLEMENTARE
      });
  }

  updatePostsBySearch(): void {
    this.page = 1;
    this.posts = [];
    this.updatePosts();
  }

  onPostCreation() {
    const post = this.createPostForm.value as Post;
    console.log(post);
    this.createdPostSubscritpion = this.http.createPost(post).subscribe({
      next: (r) => {
        console.log(r);
        alert('Post created successfully');
      },
      error: (e) => {
        console.log(e); // DA IMPLEMENTARE
        // this.createPostForm.reset()
      },
    });
  }

  ngOnInit(): void {
    console.log('Io vengo dal onInit di post-list');
    this.path = this.route.snapshot.url[0].path;
    if (this.path !== 'posts') {
      this.searchService.updateSearch(this.user.id);
    }
    this.searchSubscription = this.searchService.search$.subscribe((query) => {
      this.searchString = query;
      this.updatePostsBySearch();
    });
  }
  ngOnDestroy(): void {
    if (this.postSubscription) this.postSubscription.unsubscribe();
    if (this.searchSubscription) this.searchSubscription.unsubscribe();
    this.searchService.updateSearch('');
  }
}
