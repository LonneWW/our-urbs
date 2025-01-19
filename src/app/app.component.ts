import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';

@Component({
  selector: 'app-root',
  imports: [RouterModule, NavBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
