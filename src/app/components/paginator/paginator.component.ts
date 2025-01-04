import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss',
})
export class PaginatorComponent {
  @Input() pageSizeOptions: number[] = [];
  @Input() hidePageSize: boolean = false;
  @Output() pageEvent: EventEmitter<{
    page: number;
    resultsPerPage: number | null;
  }> = new EventEmitter();
  resultsPerPage: FormControl = new FormControl(5);
  protected page: number = 1;
  selectFormControl = new FormControl('');
  onChange(): void {
    console.log(this.resultsPerPage);
    this.pageEvent.emit({
      page: this.page,
      resultsPerPage: this.resultsPerPage.value as number,
    });
  }

  onChangePage(n: number): void {
    this.page = this.page + n;
    this.onChange();
  }
}
