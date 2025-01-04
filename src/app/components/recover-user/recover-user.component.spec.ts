import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoverUserComponent } from './recover-user.component';

describe('RecoverUserComponent', () => {
  let component: RecoverUserComponent;
  let fixture: ComponentFixture<RecoverUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecoverUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecoverUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
