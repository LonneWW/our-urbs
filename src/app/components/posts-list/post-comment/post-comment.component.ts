import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { GorestService } from '../../../services/gorest.service';
import { Post } from '../../../interfaces/post';

@Component({
  selector: 'app-post-comment',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './post-comment.component.html',
  styleUrl: './post-comment.component.scss',
})
export class PostCommentComponent implements OnInit, OnDestroy {
  protected comments!: any;
  private commentsSubscription!: Subscription;
  private postedCommentSubscription!: Subscription;
  @Input() post!: Post;

  constructor(private http: GorestService) {}

  protected commentForm: FormGroup = new FormGroup({
    id: new FormControl<number | string>('To be obtained from user info'),
    user_id: new FormControl<number | string>('To be obtained from user info'),
    name: new FormControl<string>(''), //To be obtained from user info
    email: new FormControl<string>('To be obtained from user info'),
    body: new FormControl<string>(''),
  });

  onSubmit(post: Post) {
    const form = this.commentForm;
    form.get('name')?.patchValue(this.http.name);
    form.get('email')?.patchValue(this.http.email);
    const body = JSON.stringify(form.value);
    this.postedCommentSubscription = this.http
      .postComment(post, body)
      .subscribe({
        next: (r) => {
          console.log(r);
          console.log('Commento inserito con successo');
          this.comments = [r, ...this.comments];
        },
        error: (e) => {
          console.log(e); //DA IMPLEMENTARE
        },
      });
    form.reset();
  }

  ngOnInit(): void {
    this.commentsSubscription = this.http.getPostComments(this.post).subscribe({
      next: (r) => {
        this.comments = r;
      },
      error: (e) => {
        throw new Error('Errore in post-comment');
      },
    });
  }

  ngOnDestroy(): void {
    if (this.commentsSubscription) this.commentsSubscription.unsubscribe();
    if (this.postedCommentSubscription)
      this.postedCommentSubscription.unsubscribe();
  }
}
