import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sign-in',
  standalone: false,
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent {
  signInForm: FormGroup;
  submitting = false;

  private readonly toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true
  });

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.signInForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  signIn(): void {
    if (this.signInForm.invalid) {
      this.signInForm.markAllAsTouched();
      this.toast.fire({
        icon: 'error',
        title: 'Please check your information'
      });
      return;
    }

    this.submitting = true;
    this.toast.fire({
      icon: 'success',
      title: 'Signed in successfully'
    });
    this.router.navigate(['/']);
  }

  get email(): AbstractControl {
    return this.signInForm.get('email') as AbstractControl;
  }

  get password(): AbstractControl {
    return this.signInForm.get('password') as AbstractControl;
  }
}
