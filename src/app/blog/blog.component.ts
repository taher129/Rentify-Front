import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BlogService } from '../services/blog.service';
import { Blog } from '../models/blog';
import { Router } from '@angular/router';



@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

  blogs: Blog[] = [];
  featuredBlogs: Blog[] = [];
  latestBlogs: Blog[] = [];
  blogRows: Blog[][] = [];
  searchQuery: string = '';
  filteredBlogs: Blog[] = [];

  constructor(
    private blogService: BlogService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBlogs();
  }

  loadBlogs(): void {
    this.blogService.getAllBlogs().subscribe({
      next: (blogs) => {
        this.blogs = blogs;
        this.filteredBlogs = blogs;

        // Sort by view count for featured blogs (most viewed)
        const sortedByViews = [...blogs].sort((a, b) => b.viewCount - a.viewCount);
        this.featuredBlogs = sortedByViews.slice(0, 3);

        // Sort by date for latest blogs (most recent)
        const sortedByDate = [...blogs].sort((a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        this.latestBlogs = sortedByDate.slice(3);

        // Create rows of 3 blogs each
        this.blogRows = this.chunkArray(this.latestBlogs, 3);
      },
      error: (error) => {
        console.error('Error loading blogs:', error);
      }
    });
  }

  // Helper function to chunk array into rows
  chunkArray(array: Blog[], size: number): Blog[][] {
    const result: Blog[][] = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }

  onSearch(): void {
    if (!this.searchQuery.trim()) {
      this.filteredBlogs = this.blogs;
      return;
    }

    const query = this.searchQuery.toLowerCase();
    this.filteredBlogs = this.blogs.filter(blog =>
      blog.title.toLowerCase().includes(query) ||
      (blog.description && blog.description.toLowerCase().includes(query)) ||
      blog.content.toLowerCase().includes(query)
    );
  }




}
