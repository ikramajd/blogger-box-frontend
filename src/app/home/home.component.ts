import { Component, OnInit } from '@angular/core';
import { Category } from '../models/category';
import { Post } from '../models/post';
import { CategoryService } from '../services/category.service';
import { PostService } from '../services/post.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: false,
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  categories: Category[] = [];
  posts: Post[] = [];
  searchValue = '';
  selectedDate = '';
  selectedCategoryId = '';
  errorMessage = '';
  loading = true;
  deletingPostId = '';

  constructor(
    private postService: PostService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadPosts();
  }

  loadPosts(): void {
    this.loading = true;
    this.errorMessage = '';

    const request = this.selectedCategoryId
      ? this.postService.getPostsByCategoryId(this.selectedCategoryId)
      : this.postService.getAllPosts(this.searchValue, this.selectedDate);

    request.subscribe({
      next: (posts) => {
        this.posts = this.selectedCategoryId && this.searchValue
          ? posts.filter((post) => {
              const value = this.searchValue.toLowerCase();
              return post.title.toLowerCase().includes(value) || post.content.toLowerCase().includes(value);
            })
          : posts;
        if (this.selectedCategoryId && this.selectedDate) {
          this.posts = this.posts.filter((post) => post.createdDate.startsWith(this.selectedDate));
        }
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Error while loading posts.';
        this.loading = false;
      }
    });
  }

  resetFilters(): void {
    this.searchValue = '';
    this.selectedDate = '';
    this.selectedCategoryId = '';
    this.loadPosts();
  }

  deletePost(post: Post): void {
    Swal.fire({
      title: 'Delete this post?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      this.deletingPostId = post.id;
      this.errorMessage = '';

      this.postService.deletePost(post.id).subscribe({
        next: () => {
          this.posts = this.posts.filter((currentPost) => currentPost.id !== post.id);
          this.deletingPostId = '';
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Post deleted',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true
          });
        },
        error: (error) => {
          this.deletingPostId = '';
          this.errorMessage = this.getErrorMessage(error, 'Error while deleting the post.');
        }
      });
    });
  }

  private loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: () => {
        this.errorMessage = 'Error while loading categories.';
      }
    });
  }

  private getErrorMessage(error: unknown, fallback: string): string {
    if (typeof error === 'object' && error !== null && 'error' in error) {
      const response = (error as { error?: { message?: string } }).error;
      if (response?.message) {
        return response.message;
      }
    }

    return fallback;
  }
}
