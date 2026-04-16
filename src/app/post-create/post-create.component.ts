import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Category } from '../models/category';
import { PostRequest } from '../models/post-request';
import { CategoryService } from '../services/category.service';
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  standalone: false,
  styleUrl: './post-create.component.css'
})
export class PostCreateComponent implements OnInit {
  categories: Category[] = [];
  postForm: FormGroup;
  loading = true;
  saving = false;
  errorMessage = '';
  private readonly uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  private readonly toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true
  });

  constructor(
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private postService: PostService,
    private router: Router
  ) {
    this.postForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(150)]],
      categoryId: ['', [Validators.required]],
      content: ['', [Validators.required, Validators.maxLength(2500)]]
    });
  }

  ngOnInit(): void {
    this.categoryService.getAll().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Error while loading categories.';
        this.loading = false;
      }
    });
  }

  createPost(): void {
    if (this.postForm.invalid) {
      this.postForm.markAllAsTouched();
      this.toast.fire({
        icon: 'error',
        title: 'Please review your post'
      });
      return;
    }

    this.saving = true;
    this.errorMessage = '';

    const categoryId = this.resolveCategoryId(this.categoryId.value);

    if (!categoryId) {
      this.saving = false;
      this.categoryId.setErrors({ required: true });
      this.categoryId.markAsTouched();
      this.toast.fire({
        icon: 'error',
        title: 'Please review your post'
      });
      return;
    }

    const post: PostRequest = {
      title: this.title.value.trim(),
      content: this.content.value.trim(),
      categoryId
    };

    this.postService.createPost(post).subscribe({
      next: () => {
        this.saving = false;
        this.toast.fire({
          icon: 'success',
          title: 'Post Submitted Successfully'
        });
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.errorMessage = `Error while creating the post. Code: ${error.status || 'unknown'}`;
        this.toast.fire({
          icon: 'error',
          title: this.errorMessage
        });
        this.saving = false;
      }
    });
  }

  get title(): AbstractControl {
    return this.postForm.get('title') as AbstractControl;
  }

  get categoryId(): AbstractControl {
    return this.postForm.get('categoryId') as AbstractControl;
  }

  get content(): AbstractControl {
    return this.postForm.get('content') as AbstractControl;
  }

  private resolveCategoryId(value: unknown): string {
    const categoryValue = String(value ?? '').trim();

    if (this.uuidPattern.test(categoryValue)) {
      return categoryValue;
    }

    const selectedCategory = this.categories.find((category) => {
      return category.name.toLowerCase() === categoryValue.toLowerCase();
    });

    return selectedCategory?.id ?? '';
  }
}
