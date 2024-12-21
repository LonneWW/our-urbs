import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { GorestService } from '../../services/gorest.service';
import { SearchService } from '../../services/search.service';
import { Post } from '../../interfaces/post';
import { PostContentComponent } from './post-content/post-content.component';
import { PostCommentComponent } from './post-comment/post-comment.component';

@Component({
  selector: 'app-posts-list',
  standalone: true,
  imports: [CommonModule, PostContentComponent, PostCommentComponent],
  templateUrl: './posts-list.component.html',
  styleUrl: './posts-list.component.scss',
})
export class PostsListComponent implements OnInit, OnDestroy {
  protected posts: Post[] = [];
  private postSubscription!: Subscription;
  private resultsPerPage: number = 20; //Da settare col gorest service? Avrebbe senso mantenere lo stesso numero di risultati indipendentemente dalla pagina
  private page: number = 1;
  private searchString: string = '';
  private searchSubscription!: Subscription;
  private loading: boolean = false;

  constructor(
    private http: GorestService,
    private searchService: SearchService
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
    this.postSubscription = this.http
      .getPosts(this.page, this.resultsPerPage, this.searchString)
      .subscribe({
        next: (r) => {
          this.posts = [...this.posts, ...(r as Post[])];
          console.log(this.posts);
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

  ngOnInit(): void {
    this.postSubscription = this.http.getPosts(this.page).subscribe({
      next: (r) => {
        this.posts = r as Post[];
        console.log(this.posts);
        this.page++;
      },
      error: (e) => {}, //DA IMPLEMENTARE
    });
    this.searchSubscription = this.searchService.search$.subscribe((query) => {
      this.searchString = query;
      this.updatePostsBySearch();
    });
  }
  ngOnDestroy(): void {
    if (this.postSubscription) this.postSubscription.unsubscribe();
    if (this.searchSubscription) this.searchSubscription.unsubscribe();
  }
}
