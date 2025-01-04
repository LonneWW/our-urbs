import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';
import { Post } from '../interfaces/post';

@Injectable({
  providedIn: 'root',
})
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
    console.log('setSession (da eliminare console.log)');
    console.log(token);
    if (token) sessionStorage.setItem('token', token);
  }

  getUsers(
    page: number,
    resultsPerPage: number = 12,
    searchString?: string
  ): Observable<Object> {
    let filter: string = '';
    let searchingByMail: boolean | undefined =
      searchString?.indexOf('@') !== -1;
    if (searchString) {
      searchingByMail ? (filter = '&email=') : (filter = '&name=');
    }
    return this.http.get(
      `${this.apiUrl}/users?page=${page}&per_page=${resultsPerPage}${
        searchString ? filter + searchString : ''
      }` //aggiungere parametro page e resultPerPage con property binding dalla navbar
    );
  }

  createUser(user: User): Observable<Object> {
    const body = JSON.stringify(user);
    console.log(body);
    return this.http.post(`${this.apiUrl}/users`, body);
  }

  deleteUser(user: User): Observable<Object> {
    return this.http.delete(`${this.apiUrl}/users/${user.id}`);
  }

  getPosts(
    page: number,
    resultsPerPage: number = 20,
    searchQuery?: string
  ): Observable<Object> {
    return this.http.get(
      `${this.apiUrl}/posts?page=${page}&per_page=${resultsPerPage}${
        searchQuery ? searchQuery : ''
      }` //aggiungere parametro page con property binding dalla navbar
    );
  }

  createPost(post: any): Observable<Object> {
    // Since the REST API does not allow us to register
    // a real User, the body of the post
    // does not require a user id
    //post.user_id = user.id;

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
