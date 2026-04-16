import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Category } from '../models/category';
import { CategoryRequest } from '../models/category-request';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly apiUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  getAll(name?: string): Observable<Category[]> {
    const url = name ? `${this.apiUrl}?name=${encodeURIComponent(name)}` : this.apiUrl;
    return this.http.get<Category[]>(url).pipe(
      catchError(this.handleError('getAllCategories'))
    );
  }

  create(category: CategoryRequest): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category).pipe(
      catchError(this.handleError('createCategory'))
    );
  }

  update(id: string, category: CategoryRequest): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${id}`, category).pipe(
      catchError(this.handleError('updateCategory'))
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError('deleteCategory'))
    );
  }

  private handleError(operation: string) {
    return (error: HttpErrorResponse): Observable<never> => {
      console.error(`${operation} failed: ${error.message}`, error);
      return throwError(() => error);
    };
  }
}
