import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Post } from '../models/post';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/v1/posts`).pipe(
      catchError(() => this.http.get<Post[]>(`${this.apiUrl}/api/posts`)),
      catchError(() => this.http.get<Post[]>(`${this.apiUrl}/posts`))
    );
  }
}
