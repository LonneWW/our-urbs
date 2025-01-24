import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavBarComponent } from './nav-bar.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth.service';
import { SearchService } from '../../services/search.service';
import { By } from '@angular/platform-browser';
import { Router, NavigationEnd, provideRouter } from '@angular/router';
import { of, Subject } from 'rxjs';
import { User } from '../../interfaces/user';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserPageComponent } from '../user-page/user-page.component';
import { PostsListComponent } from '../posts-list/posts-list.component';

describe('NavBarComponent', () => {
  let component: NavBarComponent;
  let fixture: ComponentFixture<NavBarComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockSearchService: jasmine.SpyObj<SearchService>;
  let mockRouter: Router;
  let user: User;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', [
      'isLoggedIn',
      'loggingOut',
    ]);
    mockSearchService = jasmine.createSpyObj('SearchService', ['updateSearch']);

    await TestBed.configureTestingModule({
      imports: [
        NavBarComponent,
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MatButtonModule,
        MatMenuModule,
        MatIconModule,
        MatToolbarModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: SearchService, useValue: mockSearchService },
        provideRouter([
          { path: 'users', component: MockComponent },
          {
            path: 'posts',
            component: PostsListComponent,
          },
          {
            path: 'users/:id',
            component: UserPageComponent,
          },
        ]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavBarComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router);
    user = {
      id: '7651790',
      name: 'Mr. Bhadra Singh',
      email: 'bhadra_mr_singh@kiehn-bernier.example',
      gender: 'male',
      status: 'inactive',
    };

    spyOn(mockRouter.events, 'pipe').and.returnValue(
      of(new NavigationEnd(0, '/users', '/users'))
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set userLoggedIn and userId based on AuthService', () => {
    mockAuthService.isLoggedIn = true;
    localStorage.setItem('user', JSON.stringify(user));

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.getUserLoggedIn()).toBeTrue();
    expect(component.getUserId()).toBe('7651790');
  });

  it('should update search query on form submit', () => {
    component.searchForm.setValue({ searchField: 'test query' });

    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('ngSubmit', null);

    expect(mockSearchService.updateSearch).toHaveBeenCalledWith('test query');
  });

  it('should navigate to /users/:id when profile button is clicked', () => {
    spyOn(mockRouter, 'navigate');

    const button = fixture.debugElement.query(
      By.css('#to-personal-profile-btn')
    );
    button.triggerEventHandler('click', null);

    expect(mockRouter.navigate).toHaveBeenCalledWith([
      `/users/${component.getUserId()}`,
    ]);
  });

  it('should navigate to /users when community button is clicked', () => {
    spyOn(mockRouter, 'navigate');

    const button = fixture.debugElement.query(By.css('#to-users-btn'));
    button.triggerEventHandler('click', null);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/users']);
  });

  it('should navigate to /posts when forum button is clicked', () => {
    spyOn(mockRouter, 'navigate');

    const button = fixture.debugElement.query(By.css('#to-posts-btn'));
    button.triggerEventHandler('click', null);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/posts']);
  });

  it('should logout when logout button is clicked', () => {
    spyOn(mockRouter, 'navigate');
    spyOn(window, 'confirm').and.returnValue(true);

    const button = fixture.debugElement.query(By.css('#logout-btn'));
    button.triggerEventHandler('click', null);

    expect(mockAuthService.loggingOut).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  // Definisci un MockComponent per il routing
  @Component({
    template: '',
  })
  class MockComponent {}
});
