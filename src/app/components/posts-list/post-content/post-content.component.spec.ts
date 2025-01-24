import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PostContentComponent } from './post-content.component';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('PostContentComponent', () => {
  let component: PostContentComponent;
  let fixture: ComponentFixture<PostContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PostContentComponent,
        ReactiveFormsModule,
        FormsModule,
        MatButtonModule,
        MatIconModule,
        NoopAnimationsModule,
      ],
      declarations: [],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostContentComponent);
    component = fixture.componentInstance;
    component.post = {
      id: 247884,
      user_id: 764328,
      title: 'Discovering the misteries of the deep',
      body: 'glugluglugluglugluglugluglugluglgug',
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display post title and body', () => {
    const titleElement = fixture.debugElement.query(
      By.css('.post-title')
    ).nativeElement;
    const bodyElement = fixture.debugElement.query(
      By.css('.post-body')
    ).nativeElement;

    expect(titleElement.textContent).toContain(
      'Discovering the misteries of the deep'
    );
    expect(bodyElement.textContent).toContain(
      'glugluglugluglugluglugluglugluglgug'
    );
  });

  it('should toggle modifyPost', () => {
    component.modifyPost();

    expect(component.getModifyingPost()).toBeTrue();
    expect(component.getEditIconToggle()).toBe('close');

    component.modifyPost();

    expect(component.getModifyingPost()).toBeFalse();
    expect(component.getEditIconToggle()).toBe('edit_note');
  });

  it('should patch post and emit event', () => {
    spyOn(component.patchingPostRequest, 'emit');
    component
      .getPostEditForm()
      .setValue({ title: 'Updated title', body: 'Updated content' });

    component.patchPost();

    expect(component.post.title).toBe('Updated title');
    expect(component.post.body).toBe('Updated content');
    expect(component.patchingPostRequest.emit).toHaveBeenCalledWith([
      component.post,
      component.getPostEditForm().value,
    ]);
    expect(component.getModifyingPost()).toBeFalse();
    expect(component.getEditIconToggle()).toBe('close');
  });
});
