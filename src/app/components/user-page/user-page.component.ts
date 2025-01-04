import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDetailsComponent } from './user-details/user-details.component';
import { PostsListComponent } from '../posts-list/posts-list.component';
import { User } from '../../interfaces/user';
import { Router } from '@angular/router';
import { SearchService } from '../../services/search.service';
import { Post } from '../../interfaces/post';

@Component({
  selector: 'app-user-page',
  standalone: true,
  imports: [CommonModule, UserDetailsComponent, PostsListComponent],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.scss',
})
export class UserPageComponent implements OnInit, OnDestroy {
  protected user!: User;
  protected posts: Post[] = [];
  protected allPostsPage: boolean = false;
  protected showPosts: boolean = true;
  constructor(private router: Router, private searchService: SearchService) {
    const navigation = this.router.getCurrentNavigation();
    this.user = navigation?.extras?.state?.['user'];
  }

  postsAvailability(posts: Post[]): void {
    console.log(posts);
    this.posts = posts;
    this.showPosts = true;
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.searchService.updateSearch('');
    this.showPosts = false;
  }
}
