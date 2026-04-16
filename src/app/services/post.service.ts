import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Post } from '../models/post';
import { PostRequest } from '../models/post-request';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private readonly apiUrl = `${environment.apiUrl}/posts`;

  constructor(private http: HttpClient) {}

  getAllPosts(value?: string, date?: string): Observable<Post[]> {
    const params = new URLSearchParams();

    if (value?.trim()) {
      params.set('value', value.trim());
    }
    if (date?.trim()) {
      params.set('date', date.trim());
    }

    const query = params.toString();
    const url = query ? `${this.apiUrl}?${query}` : this.apiUrl;

    return this.http.get<Post[]>(url).pipe(
      catchError(this.handleError('getAllPosts'))
    );
  }

  getPostsByCategoryId(categoryId: string): Observable<Post[]> {
    return this.http.get<Post[]>(`${environment.apiUrl}/categories/${categoryId}/posts`).pipe(
      catchError(this.handleError('getPostsByCategoryId'))
    );
  }

  getPostById(id: string): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError('getPostById'))
    );
  }

  createPost(post: PostRequest): Observable<Post> {
    return this.http.post<Post>(this.apiUrl, post).pipe(
      catchError(this.handleError('createPost'))
    );
  }

  updatePost(id: string, post: PostRequest): Observable<Post> {
    return this.http.put<Post>(`${this.apiUrl}/${id}`, post).pipe(
      catchError(this.handleError('updatePost'))
    );
  }

  deletePost(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError('deletePost'))
    );
  }

  private handleError(operation: string) {
    return (error: HttpErrorResponse): Observable<never> => {
      console.error(`${operation} failed: ${error.message}`, error);
      return throwError(() => error);
    };
  }
}

