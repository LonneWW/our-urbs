import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostCommentComponent } from './post-comment.component';

describe('PostCommentComponent', () => {
  let component: PostCommentComponent;
  let fixture: ComponentFixture<PostCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostCommentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
