import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-paginator',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
  ],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss',
})
export class PaginatorComponent {
  /*The following properties are necessary for the paginator to function properly. 
  Initially their values are taken from the component in which it is inserted and later,
   when they change, they are subsequently communicated to it via EventEmitter. */
  @Input() showItemsPerPage: boolean = true;
  @Input() topPaginator: boolean = false;
  @Input() page!: number;
  @Input() itemsPerPageValues: number[] = [];
  @Input() listLenght!: number;
  @Input() profilePage: boolean = true;
  @Output() pageEvent: EventEmitter<{
    page: number;
    resultsPerPage: number | null;
  }> = new EventEmitter();
  public resultsPerPage: FormControl = new FormControl(8);

  onChange(): void {
    this.pageEvent.emit({
      page: this.page,
      resultsPerPage: this.resultsPerPage.value as number,
    });
  }

  onItemsChange() {
    this.page = 1;
    this.onChange();
  }

  onPageChange(n: number): void {
    this.page = this.page + n;
    this.onChange();
  }
}
