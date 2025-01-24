import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostsListComponent } from './posts-list.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PostContentComponent } from './post-content/post-content.component';
import { PostCommentComponent } from './post-comment/post-comment.component';
import { PaginatorComponent } from '../paginator/paginator.component';
import { GorestService } from '../../services/gorest.service';
import { SearchService } from '../../services/search.service';
import { Post } from '../../interfaces/post';
import { User } from '../../interfaces/user';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { SimpleChanges } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('PostsListComponent', () => {
  let component: PostsListComponent;
  let fixture: ComponentFixture<PostsListComponent>;
  let mockGorestService: jasmine.SpyObj<GorestService>;
  let mockSearchService: jasmine.SpyObj<SearchService>;

  beforeEach(async () => {
    mockGorestService = jasmine.createSpyObj(
      'GorestService',
      ['getPosts', 'createPost', 'patchPost', 'setCurrentUser'],
      { currentUser: { id: '1', name: 'John Doe' } as User }
    );
    mockSearchService = jasmine.createSpyObj(
      'SearchService',
      ['updateSearch'],
      { search$: of('') }
    );

    await TestBed.configureTestingModule({
      imports: [
        PostsListComponent,
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSnackBarModule,
        MatProgressSpinnerModule,
        PostContentComponent,
        PostCommentComponent,
        PaginatorComponent,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: GorestService, useValue: mockGorestService },
        { provide: SearchService, useValue: mockSearchService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call updatePosts on ngOnInit', () => {
    spyOn(component, 'updatePosts');
    component.ngOnInit();
    expect(component.updatePosts).toHaveBeenCalled();
  });

  it('should emit onPostsAvailability with empty array on ngOnChanges', () => {
    spyOn(component.onPostsAvailability, 'emit');
    const dummyUser = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      gender: 'male',
      status: 'active',
    };
    const changes: SimpleChanges = {
      user: {
        currentValue: {
          id: '124352',
          name: 'Jane Doe',
          email: 'jane@example.com',
          gender: 'female',
          status: 'inactive',
        },
        previousValue: dummyUser,
        firstChange: true,
        isFirstChange: () => true,
      },
    };
    component.ngOnChanges(changes);
    expect(component.onPostsAvailability.emit).toHaveBeenCalledWith([]);
  });

  it('should update posts when search string changes', () => {
    spyOn(component, 'updatePostsBySearch');
    mockSearchService.search$ = of('test');
    component.ngOnInit();
    expect(component.updatePostsBySearch).toHaveBeenCalled();
  });

  it('should create a new post on form submit', () => {
    component.createPostForm.setValue({
      title: 'Test Title',
      body: 'Test Body',
    });

    const newPost: Post = {
      user_id: '1',
      title: 'Test Title',
      body: 'Test Body',
    };
    mockGorestService.createPost.and.returnValue(of(newPost));

    component.onPostCreation();

    expect(mockGorestService.createPost).toHaveBeenCalledWith(newPost);
    expect(component.posts.length).toBeGreaterThan(0);
  });

  it('should update posts by paginator', () => {
    spyOn(component, 'updatePosts');
    component.updatePostsByPaginator(2, 12);
    expect(component.page).toBe(2);
    expect(component.resultsPerPage).toBe(12);
    expect(component.updatePosts).toHaveBeenCalled();
  });

  it('should patch post', () => {
    const post: Post = {
      id: 1,
      user_id: '1',
      title: 'Test Title',
      body: 'Test Body',
    };
    const changes = { title: 'Updated Title' };
    mockGorestService.patchPost.and.returnValue(of(post));

    component.patchPost([post, changes]);

    expect(mockGorestService.patchPost).toHaveBeenCalledWith(post, changes);
  });

  it('should handle loading state correctly', () => {
    component.loading = true;
    fixture.detectChanges();
    const spinner = fixture.debugElement.query(By.css('mat-spinner'));
    expect(spinner).toBeTruthy();
  });
});
