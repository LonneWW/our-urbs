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
  public name: string = '';
  public email: string = '';
  constructor(private http: HttpClient) {}

  setName(name: string) {
    this.name = name;
  }

  setEmail(email: string) {
    this.email = email;
  }

  getUsers(
    page: number,
    resultsPerPage: number = 20,
    searchString?: string
  ): Observable<Object> {
    return this.http.get(
      `${this.apiUrl}/users?page=${page}&per_page=${resultsPerPage}${
        searchString ? '&name=' + searchString : ''
      }` //aggiungere parametro page e resultPerPage con property binding dalla navbar
    );
  }

  createUser(user: User): Observable<Object> {
    const body = JSON.stringify(user);
    return this.http.post(`${this.apiUrl}/users`, body);
  }

  deleteUser(user: User): Observable<Object> {
    return this.http.delete(`${this.apiUrl}/users/${user.id}`);
  }

  getPosts(
    page: number,
    resultsPerPage: number = 20,
    searchString?: string
  ): Observable<Object> {
    return this.http.get(
      `${this.apiUrl}/posts?page=${page}&per_page=${resultsPerPage}${
        searchString ? '&title=' + searchString : ''
      }` //aggiungere parametro page con property binding dalla navbar
    );
  }

  createPost(post: Post): Observable<Object> {
    // Since the REST API does not allow us to register
    // a real User, the body of the post
    // does not require a user id
    //post.user_id = user.id;

    const body = JSON.stringify(post);
    return this.http.post(`${this.apiUrl}/posts`, body);
  }

  getPostComments(post: Post): Observable<Object> {
    return this.http.get(`${this.apiUrl}/comments?post_id=${post.id}`);
  }

  postComment(post: Post, body: any) {
    return this.http.post(`${this.apiUrl}/posts/${post.id}/comments`, body);
  }
}
