import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';
import { Post } from '../interfaces/post';

@Injectable({
  providedIn: 'root',
})
/* The `GorestService` class in TypeScript provides methods for interacting with a REST API to manage
users, posts, and comments. */
export class GorestService {
  private apiUrl: string = environment.apiEndpoint;
  public currentUser!: User;

  constructor(private http: HttpClient) {}

  setCurrentUser(user: User): void {
    this.currentUser = user;
    if (user.token) delete user.token;
    const userString = JSON.stringify(user);
    localStorage.setItem('user', userString);
  }

  deleteCurrentUser(): void {
    this.currentUser;
  }

  setSession(token: string | undefined): any {
    if (token) sessionStorage.setItem('token', token);
  }

  getUsers(
    page: number,
    resultsPerPage: number,
    searchString?: string
  ): Observable<Object> {
    let filter: string = '';
    if (searchString) {
      let searchingByMail: boolean | undefined =
        searchString?.indexOf('@') !== -1;
      let searchingById: boolean = Number.isInteger(Number(searchString));
      if (searchString) {
        if (searchingByMail) filter = '&email=';
        if (searchingById) {
          filter = '&id=';
        }
        if (!searchingById && !searchingByMail) {
          filter = '&name=';
        }
      }
    }
    return this.http.get(
      `${this.apiUrl}/users?page=${page}&per_page=${resultsPerPage}${
        searchString ? filter + searchString : ''
      }`
    );
  }

  createUser(user: User): Observable<Object> {
    const body = JSON.stringify(user);
    return this.http.post(`${this.apiUrl}/users`, body);
  }

  deleteUser(user: User): Observable<Object> {
    return this.http.delete(`${this.apiUrl}/users/${user.id}`);
  }

  patchUser(user: User, change: any): Observable<Object> {
    const body = JSON.stringify(change);
    return this.http.patch(`${this.apiUrl}/users/${user.id}`, body);
  }

  patchPost(post: Post, change: any): Observable<Object> {
    const body = JSON.stringify(change);
    return this.http.patch(`${this.apiUrl}/posts/${post.id}`, body);
  }

  getPosts(
    page: number,
    resultsPerPage: number,
    searchQuery?: string
  ): Observable<Object> {
    return this.http.get(
      `${this.apiUrl}/posts?page=${page}&per_page=${resultsPerPage}${
        searchQuery ? searchQuery : ''
      }`
    );
  }

  createPost(post: any): Observable<Object> {
    const body = JSON.stringify(post);
    return this.http.post(`${this.apiUrl}/users/${post.user_id}/posts`, body);
  }

  getPostComments(post: Post): Observable<Object> {
    return this.http.get(`${this.apiUrl}/comments?post_id=${post.id}`);
  }

  postComment(post: Post, body: any) {
    return this.http.post(`${this.apiUrl}/posts/${post.id}/comments`, body);
  }
}
