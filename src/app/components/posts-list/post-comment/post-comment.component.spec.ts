import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PostCommentComponent } from './post-comment.component';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { GorestService } from '../../../services/gorest.service';
import { Post } from '../../../interfaces/post';
import { User } from '../../../interfaces/user';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('PostCommentComponent', () => {
  let component: PostCommentComponent;
  let fixture: ComponentFixture<PostCommentComponent>;
  let mockGorestService: jasmine.SpyObj<GorestService>;
  let mockMatSnackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    mockGorestService = jasmine.createSpyObj('GorestService', [
      'getPostComments',
      'postComment',
    ]);
    mockMatSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        PostCommentComponent,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        FormsModule,
        MatInputModule,
        MatButtonModule,
        MatFormFieldModule,
        MatSnackBarModule,
      ],
      declarations: [],
      providers: [
        { provide: GorestService, useValue: mockGorestService },
        { provide: MatSnackBar, useValue: mockMatSnackBar },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostCommentComponent);
    component = fixture.componentInstance;
    component.post = {
      id: 1,
      user_id: 1,
      title: 'Post title',
      body: 'Post content',
    } as Post;
    localStorage.setItem(
      'user',
      JSON.stringify({
        id: '7651788',
        name: 'Hari Banerjee',
        email: 'hari_banerjee@conroy.example',
        gender: 'male',
        status: 'inactive',
      } as User)
    );
    fixture.detectChanges();

    const comments = [
      {
        id: 135254,
        post_id: 187566,
        name: 'Kanti Reddy',
        email: 'kanti_reddy@oreilly.example',
        body: 'Ducimus error aspernatur. Maiores voluptatum blanditiis.',
      },
    ];
    mockGorestService.getPostComments.and.returnValue(of(comments));
  });

  afterEach(() => {
    localStorage.removeItem('user');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize comments and user on init', () => {
    const comments = [
      {
        id: 135254,
        post_id: 187566,
        name: 'Kanti Reddy',
        email: 'kanti_reddy@oreilly.example',
        body: 'Ducimus error aspernatur. Maiores voluptatum blanditiis.',
      },
    ];
    mockGorestService.getPostComments.and.returnValue(of(comments));

    component.ngOnInit();
    fixture.detectChanges();

    expect(component['comments']).toEqual(comments);
    expect(component['user']).toEqual({
      id: '7651788',
      name: 'Hari Banerjee',
      email: 'hari_banerjee@conroy.example',
      gender: 'male',
      status: 'inactive',
    } as User);
  });

  it('should submit a comment', () => {
    const commentResponse = {
      id: 135254,
      post_id: 187566,
      name: 'Kanti Reddy',
      email: 'kanti_reddy@oreilly.example',
      body: 'Ducimus error aspernatur. Maiores voluptatum blanditiis.',
    };
    component.comments = [];
    mockGorestService.postComment.and.returnValue(of(commentResponse));
    spyOn(component, 'onSubmit').and.callThrough();

    component.commentForm.setValue({
      id: component.post.id,
      user_id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      body: 'New comment',
    });

    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('submit', null);

    expect(component.onSubmit).toHaveBeenCalledWith(component.post);
    expect(mockGorestService.postComment).toHaveBeenCalled();
    expect(mockMatSnackBar.open).toHaveBeenCalledWith(
      'Comment posted successfully',
      'Ok'
    );
    expect(component['comments']).toEqual([commentResponse]);
  });

  it('should handle error on submitting comment', () => {
    mockGorestService.postComment.and.returnValue(
      throwError(() => new Error('Error'))
    );
    spyOn(component, 'onSubmit').and.callThrough();
    spyOn(console, 'log');

    component.commentForm.setValue({
      id: component.post.id,
      user_id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      body: 'New comment',
    });

    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('submit', null);

    expect(component.onSubmit).toHaveBeenCalledWith(component.post);
    expect(mockGorestService.postComment).toHaveBeenCalled();
    expect(mockMatSnackBar.open).toHaveBeenCalledWith(
      `It was not possibile to post your comment, check the console for more details`,
      'Ok'
    );
    expect(console.log).toHaveBeenCalledWith(jasmine.any(Error));
  });
});
