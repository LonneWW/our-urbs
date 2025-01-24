import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserDetailsComponent } from './user-details.component';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { User } from '../../../interfaces/user';
import { Post } from '../../../interfaces/post';
import { By } from '@angular/platform-browser';

describe('UserDetailsComponent', () => {
  let component: UserDetailsComponent;
  let fixture: ComponentFixture<UserDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        UserDetailsComponent,
        CommonModule,
        TitleCasePipe,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display user name', () => {
    component.user = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      gender: 'male',
      status: 'active',
    } as User;
    fixture.detectChanges();

    const userNameElement = fixture.debugElement.query(
      By.css('h2')
    ).nativeElement;
    expect(userNameElement.textContent).toContain('John Doe');
  });

  it('should display user email', () => {
    component.user = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      gender: 'male',
      status: 'active',
    } as User;
    fixture.detectChanges();

    const userEmailElement = fixture.debugElement.query(
      By.css('p')
    ).nativeElement;
    expect(userEmailElement.textContent).toContain('john@example.com');
  });

  it('should display user gender in title case', () => {
    component.user = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      gender: 'male',
      status: 'active',
    } as User;
    fixture.detectChanges();

    const userGenderElement = fixture.debugElement.queryAll(By.css('p'))[1]
      .nativeElement;
    expect(userGenderElement.textContent).toContain('Male');
  });

  it('should display number of posts if posts are available', () => {
    component.user = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      gender: 'male',
      status: 'active',
    } as User;
    component.posts = [
      { id: 1, user_id: '1', title: 'Post 1', body: 'Post body' },
    ] as Post[];
    fixture.detectChanges();

    const userPostsElement = fixture.debugElement.queryAll(By.css('p'))[2]
      .nativeElement;
    expect(userPostsElement.textContent).toContain('Number of posts: 1');
  });

  it('should not display number of posts if no posts are available', () => {
    component.user = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      gender: 'male',
      status: 'active',
    } as User;
    component.posts = [];
    fixture.detectChanges();

    const userPostsElement = fixture.debugElement.queryAll(By.css('p')).length;
    expect(userPostsElement).toBe(2); // Solo due paragrafi, senza quello dei post
  });
});
