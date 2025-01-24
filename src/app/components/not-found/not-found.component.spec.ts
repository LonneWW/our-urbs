import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersListComponent } from '../users-list/users-list.component';
import { NotFoundComponent } from './not-found.component';
import { provideRouter, Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('NotFoundComponent', () => {
  let component: NotFoundComponent;
  let fixture: ComponentFixture<NotFoundComponent>;
  let mockRouter: any;
  let button: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotFoundComponent],
      providers: [
        provideRouter([{ path: 'users', component: UsersListComponent }]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NotFoundComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router);
    fixture.detectChanges();
    button = fixture.debugElement.query(By.css('#to-userslist-link'));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to /users when link is clicked', () => {
    const navigateSpy = spyOn(mockRouter, 'navigate');

    button.triggerEventHandler('click');

    expect(navigateSpy).toHaveBeenCalledWith(['/users']);
  });
});
