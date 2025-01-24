import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';
import { User } from '../../../interfaces/user';
import { UserCardComponent } from './user-card.component';

describe('UserCardComponent', () => {
  let component: UserCardComponent;
  let fixture: ComponentFixture<UserCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatCardModule, MatIconModule, UserCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserCardComponent);
    component = fixture.componentInstance;
    component.user = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      gender: 'male',
      status: 'active',
    } as User;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit the "toUserPage" event on click', () => {
    spyOn(component.toUserPage, 'emit');

    const card = fixture.debugElement.query(By.css('mat-card'));
    card.triggerEventHandler('click', null);

    expect(component.toUserPage.emit).toHaveBeenCalledWith(component.user);
  });
});
