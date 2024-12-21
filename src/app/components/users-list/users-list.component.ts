import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { GorestService } from '../../services/gorest.service';
import { User } from '../../interfaces/user';
import { Subscription } from 'rxjs';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
})
export class UsersListComponent implements OnInit, OnDestroy {
  users: User[] = [];
  private page: number = 2;
  private resultsPerPage: number = 20;
  private userSubscription!: Subscription;
  private searchString: string | undefined = '';
  private searchSubscription!: Subscription;
  private loading: boolean = false;
  constructor(
    private http: GorestService,
    private searchService: SearchService
  ) {}

  @HostListener('window: scroll')
  onScroll(): void {
    if (
      window.scrollY + window.innerHeight >= document.body.scrollHeight * 0.8 &&
      !this.loading
    ) {
      if (this.userSubscription) this.userSubscription.unsubscribe();
      this.updateUsers();
    }
  }

  updateUsers(): void {
    this.loading = true;
    this.userSubscription = this.http
      .getUsers(this.page, this.resultsPerPage, this.searchString)
      .subscribe({
        next: (r) => {
          this.users = [...this.users, ...(r as User[])];
          console.log(this.users);
          this.loading = false;
          this.page++;
        },
        error: (e) => {
          this.loading = true;
        }, //DA IMPLEMENTARE
      });
  }

  updateUsersBySearch(): void {
    this.page = 1;
    this.users = [];
    this.updateUsers();
  }

  ngOnInit(): void {
    this.searchSubscription = this.searchService.search$.subscribe((query) => {
      this.searchString = query;
      this.updateUsersBySearch();
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) this.userSubscription.unsubscribe();
    if (this.searchSubscription) this.searchSubscription.unsubscribe();
  }

  onAddUser() {} //Da implementare
}
