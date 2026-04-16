import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PostCreateComponent } from './post-create/post-create.component';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { SignInComponent } from './sign-in/sign-in.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'add-post', component: PostCreateComponent },
  { path: 'posts/create', redirectTo: 'add-post' },
  { path: 'posts/:id', component: PostDetailComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
