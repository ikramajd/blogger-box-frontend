import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Category } from '../models/category';
import { Post } from '../models/post';
import { PostRequest } from '../models/post-request';
import { CategoryService } from '../services/category.service';
import { PostService } from '../services/post.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  standalone: false,
  styleUrl: './post-detail.component.css'
})
export class PostDetailComponent implements OnInit {
  post?: Post;
  categories: Category[] = [];
  editMode = false;
  saving = false;
  errorMessage = '';
  loading = true;
  formData: PostRequest = {
    title: '',
    content: '',
    categoryId: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadPost();
  }

  savePost(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      return;
    }

    this.saving = true;
    this.errorMessage = '';

    this.postService.updatePost(id, this.formData).subscribe({
      next: (post) => {
        this.post = post;
        this.editMode = false;
        this.saving = false;
      },
      error: () => {
        this.errorMessage = 'Error while updating the post.';
        this.saving = false;
      }
    });
  }

  deletePost(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      return;
    }

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

      this.postService.deletePost(id).subscribe({
        next: () => {
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Post deleted',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true
          });
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.errorMessage = `Error while deleting the post. Code: ${error.status || 'unknown'}`;
        }
      });
    });
  }

  startEdit(): void {
    if (!this.post) {
      return;
    }

    this.formData = {
      title: this.post.title,
      content: this.post.content,
      categoryId: this.post.category?.id ?? ''
    };
    this.editMode = true;
  }

  cancelEdit(): void {
    this.editMode = false;
  }

  private loadPost(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.errorMessage = 'Post not found.';
      this.loading = false;
      return;
    }

    this.postService.getPostById(id).subscribe({
      next: (data) => {
        this.post = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Error while loading the post.';
        this.loading = false;
      }
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
}
