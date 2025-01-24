import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { PaginatorComponent } from './paginator.component';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('PaginatorComponent', () => {
  let component: PaginatorComponent;
  let fixture: ComponentFixture<PaginatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PaginatorComponent,
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatButtonModule,
        MatInputModule,
        MatSelectModule,
        MatIconModule,
        BrowserAnimationsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginatorComponent);
    component = fixture.componentInstance;
    component.page = 1;
    component.itemsPerPageValues = [8, 12, 20];
    component.listLenght = 8;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit page change event', () => {
    spyOn(component.pageEvent, 'emit');
    component.page = 2;
    component.onPageChange(1);

    expect(component.pageEvent.emit).toHaveBeenCalledWith({
      page: 3,
      resultsPerPage: 8,
    });
  });

  it('should emit items per page change event', () => {
    spyOn(component.pageEvent, 'emit');
    component.resultsPerPage.setValue(12);
    component.onItemsChange();

    expect(component.page).toBe(1);
    expect(component.pageEvent.emit).toHaveBeenCalledWith({
      page: 1,
      resultsPerPage: 12,
    });
  });
});
