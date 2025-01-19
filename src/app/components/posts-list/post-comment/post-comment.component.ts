import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { GorestService } from '../../../services/gorest.service';
import { Post } from '../../../interfaces/post';
import { User } from '../../../interfaces/user';

@Component({
  selector: 'app-post-comment',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
  ],
  templateUrl: './post-comment.component.html',
  styleUrl: './post-comment.component.scss',
})
export class PostCommentComponent implements OnInit, OnDestroy {
  /* The `comments` property contains the comments of the correlated post.
  Its value is a response to a http call. */
  protected comments!: any;
  /* The `commentsSubscription` is a subscription made to get the comments of the post.
  Storing the subscription into a property allow us to unsubscribe later on */
  private commentsSubscription!: Subscription;
  /* The `postedCommentSubscription` is a subscription made to post the new comment of the user.
  Storing the subscription into a property allow us to unsubscribe later on */
  private postedCommentSubscription!: Subscription;
  /* The `user` property of type "User" contains the details of the current user logged in.
  Its value is taken from the local storage.*/
  private user!: User;
  /* The `post` property of type "Post" contains the details of the current post loaded.
  Its value is taken from the parent component "posts-list".*/
  @Input() post!: Post;

  constructor(private http: GorestService, private _snackbar: MatSnackBar) {}

  protected commentForm: FormGroup = new FormGroup({
    id: new FormControl<number | string>(''),
    user_id: new FormControl<number | string>(''),
    name: new FormControl<string>(''),
    email: new FormControl<string>(''),
    body: new FormControl<string>(''),
  });

  /**
   * Submits a comment for the given post, updates the UI upon success or failure,
   * and resets the comment form.
   * @param post - The post to which the comment is related.
   */
  onSubmit(post: Post) {
    const form = this.commentForm;
    // Patch form values with the current post and user details
    this.commentForm.patchValue({
      id: this.post.id,
      user_id: this.user.id,
      name: this.user.name,
      email: this.user.email,
    });
    const body = JSON.stringify(form.value); // Serialize form data
    // Post the comment to the server
    this.postedCommentSubscription = this.http
      .postComment(post, body)
      .subscribe({
        next: (r) => {
          this._snackbar.open('Comment posted successfully', 'Ok');
          this.comments = [r, ...this.comments]; // Update comments with the new comment
        },
        error: (e) => {
          this._snackbar.open(
            `It was not possibile to post your comment, check the console for more details`,
            'Ok'
          );
          console.log(e);
        },
      });
    form.reset(); // Reset the form after submission
  }

  /**
   * Initializes the component by fetching comments for the current post
   * and retrieving the current user from local storage.
   */
  ngOnInit(): void {
    // Subscribe to comments for the current post
    this.commentsSubscription = this.http.getPostComments(this.post).subscribe({
      // On successful retrieval, assign comments to the property
      next: (r) => {
        this.comments = r;
      },
      // Handle errors by throwing an error
      error: (e) => {
        this._snackbar.open(
          `Couldn't get any comments of the post '${this.post.title}', check the console for more details`,
          'Ok'
        );
        console.log(e);
      },
    });
    // Retrieve the current user from local storage
    this.user = JSON.parse(localStorage.getItem('user')!);
  }

  /**
   * The ngOnDestroy lifecycle hook is used to clean up resources and unsubscribe
   * from observables when the component is destroyed.
   */
  ngOnDestroy(): void {
    // Unsubscribe from the observable that retrieves comments for the current post
    if (this.commentsSubscription) this.commentsSubscription.unsubscribe();
    // Unsubscribe from the observable that posts new comments to the server
    if (this.postedCommentSubscription)
      this.postedCommentSubscription.unsubscribe();
  }
}
