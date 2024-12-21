import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { Post } from '../../../interfaces/post';

@Component({
  selector: 'app-post-content',
  standalone: true,
  imports: [],
  templateUrl: './post-content.component.html',
  styleUrl: './post-content.component.scss',
})
export class PostContentComponent {
  @Input() post!: Post;
}
