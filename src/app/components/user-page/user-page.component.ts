import { Component } from '@angular/core';
import { UserDetailsComponent } from './user-details/user-details.component';
import { PostContentComponent } from '../posts-list/post-content/post-content.component';
import { PostCommentComponent } from '../posts-list/post-comment/post-comment.component';
@Component({
  selector: 'app-user-page',
  standalone: true,
  imports: [UserDetailsComponent, PostContentComponent, PostCommentComponent],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.scss',
})
export class UserPageComponent {}
