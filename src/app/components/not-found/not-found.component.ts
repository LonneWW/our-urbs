import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
})
export class NotFoundComponent {
  protected errorMessage: string =
    'Something went wrong, please try again later.';
  protected errorStatus: string = 'Unknown';
  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    const navMessage = navigation?.extras?.state?.['message'];
    const navStatus = navigation?.extras?.state?.['status'];
    if (navMessage) this.errorMessage = navMessage;
    if (navStatus) this.errorStatus = navStatus;
  }
}
