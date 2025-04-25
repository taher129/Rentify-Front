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
        // Fix image paths
        this.blogs = blogs.map(blog => {
          blog.image = 'http://localhost:8087' + blog.image;
          return blog;
        });

        this.filteredBlogs = [...this.blogs];

        // Sort by view count for featured blogs (most viewed)
        this.featuredBlogs = [...this.blogs]
          .sort((a, b) => b.viewCount - a.viewCount)
          .slice(0, 4); // Get top 4 most viewed (1 featured + 3 suggestions)

        // Sort by date for latest blogs (newest first)
        this.latestBlogs = [...this.blogs]
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        // Create rows of 3 blogs each for display
        this.updateBlogRows();
      },
      error: (error) => {
        console.error('Error loading blogs:', error);
      }
    });
  }

  updateBlogRows(): void {
    // Use filteredBlogs for search functionality, but sort by date
    const sortedFiltered = [...this.filteredBlogs]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    this.blogRows = this.chunkArray(sortedFiltered, 3);
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
      this.filteredBlogs = [...this.blogs];
    } else {
      const query = this.searchQuery.toLowerCase();
      this.filteredBlogs = this.blogs.filter(blog =>
        blog.title.toLowerCase().includes(query) ||
        (blog.description && blog.description.toLowerCase().includes(query)) ||
        blog.content.toLowerCase().includes(query)
      );
    }

    // Update rows with sorted and filtered results
    this.updateBlogRows();
  }
}
