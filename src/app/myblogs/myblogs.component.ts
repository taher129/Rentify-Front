import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogService } from '../services/blog.service';
import { Blog } from '../models/blog';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-blog-by-user',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './myblogs.component.html',
  styleUrls: ['./myblogs.component.css']
})
export class MyblogsComponent implements OnInit {
  userId: number = 2; // Static user ID
  userBlogs: Blog[] = [];
  isLoading: boolean = true;

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.loadUserBlogs();
  }

  loadUserBlogs(): void {
    this.blogService.getBlogsByUserId(this.userId).subscribe({
      next: (blogs) => {
        this.userBlogs = blogs.map(blog => {
          // Fix the image URL to match your Nginx configuration
          if (blog.image) {
            // If the image already starts with /uploads/, use it as is
            if (blog.image.startsWith('/uploads/')) {
              blog.image = blog.image;
            }
            // If it's just a filename, prepend /uploads/
            else if (!blog.image.startsWith('http')) {
              blog.image = `/uploads/${blog.image}`;
            }
            // If it's already a full URL, keep it as is
          }
          return blog;
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading user blogs:', error);
        this.isLoading = false;
      }
    });
  }

  deleteBlog(blogId: number): void {
    if (confirm('Are you sure you want to delete this blog?')) {
      this.blogService.deleteBlog(blogId).subscribe({
        next: () => {
          // Remove the deleted blog from the array
          this.userBlogs = this.userBlogs.filter(blog => blog.idBlog !== blogId);
        },
        error: (error) => {
          console.error('Error deleting blog:', error);
          alert('Failed to delete blog. Please try again.');
        }
      });
    }
  }
}
