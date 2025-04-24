import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { AuthService } from '../services/auth.service'; // Assume you have an AuthService for authentication
import { UserService } from '../services/user.service'; // A service for interacting with the backend
import {HttpClient, HttpClientModule, HttpHeaders} from '@angular/common/http';
import { Router } from '@angular/router';
import {NgIf, NgOptimizedImage} from "@angular/common";
// Optional: For displaying notifications
import { Gender } from '../models/gender.enum';
import { Role } from '../models/role.enum';
import {PasswordUpdateRequestDTO, ProfileUpdateRequestDTO, UserDetails, UserDTO} from "../models/user";
import {environment} from "../../../../../environment";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgIf,
    NgOptimizedImage,
    MatProgressSpinner
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent  {
  // user: UserDetails | null = null;
  // isLoading = true;
  //
  // constructor(
  //   private authService: AuthService,
  //   private userService: UserService
  // ) {}
  //
  // ngOnInit(): void {
  //   this.loadUserData();
  // }
  //
  // loadUserData(): void {
  //   this.userService.getCurrentUserDetails().subscribe({
  //     next: (user) => {
  //       this.user = user;
  //       this.isLoading = false;
  //     },
  //     error: (err) => {
  //       console.error('Failed to load user data', err);
  //       this.isLoading = false;
  //     }
  //   });
  // }
}
