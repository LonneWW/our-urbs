import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Input } from '@angular/core';
import { Post } from '../../../interfaces/post';

@Component({
  selector: 'app-post-content',
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatIconModule],
  templateUrl: './post-content.component.html',
  styleUrl: './post-content.component.scss',
})
export class PostContentComponent implements OnInit {
  /* The `post` input property is an object of type "Post", containing its details.
  It's passed by the parent component "posts-list". */
  @Input() post!: Post;
  /* The `patchingPostRequest` property is an EvenEmitter emitted
  when the user wants to apply some changes to a post.
  It's passed to the parent component make the patch http call. */
  @Output() patchingPostRequest: EventEmitter<any> = new EventEmitter();
  /* The `modificablePosts` property is a boolean representing if the post
  has or hasn't been made by the current user.
  It's used to handle some visual components of the html file*/
  protected modificablePosts: boolean = false;
  /* The `modifyingPost` property is a boolean representing if the post
  is currently been modified or else.
  It's used to handle some visual components of the html file*/
  protected modifyingPost: boolean = false;
  /* The `protected postEditForm` property is creating a form group
  used to manage the form controls for editing post. */
  protected postEditForm: FormGroup = new FormGroup({
    title: new FormControl<string>(`${this.post?.title}`, [
      Validators.minLength(5),
      Validators.required,
    ]),
    body: new FormControl<string>(`${this.post?.body}`, [
      Validators.minLength(20),
      Validators.required,
    ]),
  });
  /* The `editIconToggle` property is a string representing
    the value and the current state of the "edit" button.
  */
  protected editIconToggle: string = 'edit_note';

  /**
   * The function `modifyPost` toggles the values of "modifyingPost" and "editIconToggle".
   * These properties handles visual elements necessary to edit the post.
   */
  modifyPost() {
    this.modifyingPost = !this.modifyingPost;
    if (this.editIconToggle == 'close') {
      this.editIconToggle = 'edit_note';
    } else {
      this.postEditForm.patchValue({
        title: `${this.post?.title}`,
        body: `${this.post?.body}`,
      });
      this.editIconToggle = 'close';
    }
  }

  /**
   * The function `patchPost` sends a PATCH request to the server to update
   * the post with the new values provided by the user through the form.
   * It also updates the post object with the new values.
   */
  patchPost(): void {
    this.patchingPostRequest.emit([this.post, this.postEditForm.value]);
    const form = this.postEditForm.value;
    // Update the post object with the new values
    this.post.title = form.title;
    this.post.body = form.body;
    // Reset the modification state
    this.modifyingPost = false;
    this.editIconToggle = 'close';
  }

  /**
   * The function `ngOnInit` checks if the user is on their own profile page.
   * If they are, it sets the `modificablePosts` property to true, which enables
   * the modification of the posts.
   */
  ngOnInit(): void {
    const path = window.location.pathname;
    const user = JSON.parse(localStorage.getItem('user')!);
    // Check if the user is on their own profile page
    if (user && path == `/users/${user?.id}`) {
      // If they are, enable the modification of the posts
      this.modificablePosts = true;
    }
  }

  /*Methods added for testing purposes*/
  getModifyingPost(): boolean {
    return this.modifyingPost;
  }

  getEditIconToggle(): string {
    return this.editIconToggle;
  }

  getPostEditForm(): FormGroup {
    return this.postEditForm;
  }

  getModificablePosts(): boolean {
    return this.modificablePosts;
  }
}
