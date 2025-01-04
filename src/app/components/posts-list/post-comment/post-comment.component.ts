import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { GorestService } from '../../../services/gorest.service';
import { Post } from '../../../interfaces/post';
import { User } from '../../../interfaces/user';

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
  private user!: User;

  @Input() post!: Post;

  constructor(private http: GorestService, private _snackbar: MatSnackBar) {}

  protected commentForm: FormGroup = new FormGroup({
    id: new FormControl<number | string>(''),
    user_id: new FormControl<number | string>(''),
    name: new FormControl<string>(''), //To be obtained from user info
    email: new FormControl<string>(''),
    body: new FormControl<string>(''),
  });

  onSubmit(post: Post) {
    const form = this.commentForm;
    this.commentForm.patchValue({
      id: this.post.id,
      user_id: this.user.id,
      name: this.user.name,
      email: this.user.email,
    });
    // form.get('name')?.patchValue(this.http.name);
    // form.get('email')?.patchValue(this.http.email); CREDENZIALI DURANTE L'INSERIMENTO DI POST
    const body = JSON.stringify(form.value);
    this.postedCommentSubscription = this.http
      .postComment(post, body)
      .subscribe({
        next: (r) => {
          console.log(r);
          this._snackbar.open('Comment posted successfully', 'Ok');
          this.comments = [r, ...this.comments];
        },
        error: (e) => {
          this._snackbar.open(
            `Error: ${e.message.field} ${e.message.message}`,
            'Ok'
          );
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
    const userString = localStorage.getItem('user');
    console.log(userString);
    if (userString) {
      this.user = JSON.parse(userString);
    }
    console.log(this.user);
  }

  ngOnDestroy(): void {
    if (this.commentsSubscription) this.commentsSubscription.unsubscribe();
    if (this.postedCommentSubscription)
      this.postedCommentSubscription.unsubscribe();
  }
}
