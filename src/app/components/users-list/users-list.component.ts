import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { GorestService } from '../../services/gorest.service';
import { User } from '../../interfaces/user';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
})
export class UsersListComponent implements OnInit {
  usersList: User[] = [];
  constructor(private gorestService: GorestService) {}
  ngOnInit() {
    this.usersList = this.gorestService.users;
  }
}
