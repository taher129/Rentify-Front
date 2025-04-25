import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BlogService } from '../services/blog.service';
import { Blog } from '../models/blog';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';

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
  private searchTerms = new Subject<string>();

  constructor(
    private blogService: BlogService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBlogs();

    // Setup search with debounce
    this.searchTerms.pipe(
      debounceTime(300),        // wait 300ms after each keystroke
      distinctUntilChanged(),   // ignore if same as previous term
      switchMap((term: string) => {
        if (!term.trim()) {
          // if empty term, return all blogs
          return this.blogService.getAllBlogs();
        } else {
          // else return search results
          return this.blogService.searchBlogs(term);
        }
      })
    ).subscribe({
      next: (blogs) => {
        this.handleSearchResults(blogs);
      },
      error: (error) => {
        console.error('Search error:', error);
        this.filteredBlogs = [];
        this.updateBlogRows();
      }
    });
  }

  loadBlogs(): void {
    this.blogService.getAllBlogs().subscribe({
      next: (blogs) => {
        this.processBlogs(blogs);
      },
      error: (error) => {
        console.error('Error loading blogs:', error);
      }
    });
  }

  processBlogs(blogs: Blog[]): void {
    // Fix image paths
    this.blogs = blogs.map(blog => {
      blog.image = 'http://localhost:8087' + blog.image;
      return blog;
    });

    this.filteredBlogs = [...this.blogs];
    this.updateFeaturedAndLatestBlogs();
    this.updateBlogRows();
  }

  updateFeaturedAndLatestBlogs(): void {
    // Sort by view count for featured blogs (most viewed)
    this.featuredBlogs = [...this.filteredBlogs]
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, 4); // Get top 4 most viewed (1 featured + 3 suggestions)

    // Sort by date for latest blogs (newest first)
    this.latestBlogs = [...this.filteredBlogs]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  updateBlogRows(): void {
    // Use filteredBlogs for search functionality, but sort by date
    const sortedFiltered = [...this.filteredBlogs]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    this.blogRows = this.chunkArray(sortedFiltered, 3);
  }

  handleSearchResults(blogs: Blog[]): void {
    this.filteredBlogs = blogs.map(blog => {
      blog.image = 'http://localhost:8087' + blog.image;
      return blog;
    });
    this.updateFeaturedAndLatestBlogs();
    this.updateBlogRows();
  }

  // Push search terms into the observable stream
  onSearch(): void {
    this.searchTerms.next(this.searchQuery);
  }

  // Helper function to chunk array into rows
  chunkArray(array: Blog[], size: number): Blog[][] {
    const result: Blog[][] = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }
}
