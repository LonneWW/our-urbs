import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { GorestService } from '../../services/gorest.service';
import { User } from '../../interfaces/user';
import { Subject, takeUntil } from 'rxjs';
import { SearchService } from '../../services/search.service';
import { UserCardComponent } from './user-card/user-card.component';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UserCardComponent,
    MatPaginatorModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
})
export class UsersListComponent implements OnInit, OnDestroy {
  users: User[] = [];
  private page: number = 2;
  protected resultsPerPage: FormControl = new FormControl(12);
  private destroy$: Subject<void> = new Subject<void>();
  private searchString: string | undefined = '';
  private loading: boolean = false;
  protected createUserForm: FormGroup = new FormGroup({
    name: new FormControl<string>(''),
    email: new FormControl<string>(''),
    gender: new FormControl<string>(''),
    status: new FormControl<string>(''),
  });
  protected showCreateForm: boolean = false;
  constructor(
    private http: GorestService,
    private searchService: SearchService,
    private router: Router
  ) {}

  // @HostListener('window: scroll')
  // onScroll(): void {
  //   if (
  //     window.scrollY + window.innerHeight >= document.body.scrollHeight * 0.8 &&
  //     !this.loading
  //   ) {
  //     if (this.userSubscription) this.userSubscription.unsubscribe();
  //     this.updateUsers();
  //   }
  // }

  updateUsers(): void {
    this.loading = true;
    this.http
      .getUsers(this.page, this.resultsPerPage.value, this.searchString)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (r) => {
          this.users = [...this.users, ...(r as User[])];
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
    this.searchService.search$.subscribe((query) => {
      this.searchString = query;
      this.updateUsersBySearch();
    });
    const userString = localStorage.getItem('user');
    console.log(userString);
    if (userString) {
      let user = JSON.parse(userString);
      console.log(user);
      if (!user.id) {
        this.http
          .getUsers(1, 1, user.email)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (r: any) => {
              let newUser = r[0] as User;
              this.http.setCurrentUser(newUser);
            },
          });
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  toggleCreateUser(): void {
    this.showCreateForm = !this.showCreateForm;
  } //Da implementare

  createUser(): void {
    const user = this.createUserForm.value as User;
    this.http
      .createUser(user)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (r) => {
          console.log('User creato con successo'); //DA RAFFINARE
          this.toggleCreateUser();
        },
        error: (e) => {
          console.log(e); //DA RAFFINARE
        },
      });
    this.createUserForm.reset();
  }

  deleteUser(user: User): void {
    //DA RAFFINARE
    if (confirm(`Sicuro di voler elimanare l'utente "${user.name}"?`)) {
      this.http
        .deleteUser(user)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (r) => {
            const deletedUser = user;
            this.users = this.users.filter(
              (user) => user.id !== deletedUser.id
            );
            console.log(`User ${user.name} id ${user.id} deleted successfully`);
            //DA FARCI UN MESSAGGIO SNACKBAR
          },
        });
    } else {
      alert('Utente non eliminato');
    }
  }

  redirectToUserPage(user: User): void {
    this.router.navigate([`/users/${user.id}`], { state: { user: user } });
  }
}
