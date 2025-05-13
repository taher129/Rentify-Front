import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BlogService } from '../services/blog.service';
import { Blog } from '../models/blog';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  // Core blog data
  blogs: Blog[] = [];
  featuredBlogs: Blog[] = [];
  latestBlogs: Blog[] = [];
  filteredBlogs: Blog[] = [];

  // Search properties
  searchQuery: string = '';
  isSearching: boolean = false;
  private searchTerms = new Subject<string>();

  // Pagination properties
  currentPage: number = 1;
  pageSize: number = 6; // 6 blogs per page (2 rows of 3)
  totalPages: number = 1;
  currentPageBlogs: Blog[] = [];

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
        this.isSearching = true;
        if (!term.trim()) {
          // if empty term, return all blogs
          return this.blogService.getAllBlogs();
        } else {
          // else return search results
          return this.blogService.searchBlogs(term);
        }
      }),
      finalize(() => {
        this.isSearching = false;
      })
    ).subscribe({
      next: (blogs) => {
        this.handleSearchResults(blogs);
        this.isSearching = false;
      },
      error: (error) => {
        console.error('Search error:', error);
        this.filteredBlogs = [];
        this.updatePagination();
        this.isSearching = false;
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
      // Only prepend the base URL if the image path doesn't already have it
      if (blog.image && !blog.image.startsWith('http')) {
        blog.image = 'http://www.rentify.duckdns.org:8087' + blog.image;
      }
      return blog;
    });

    this.filteredBlogs = [...this.blogs];
    this.updateFeaturedAndLatestBlogs();
    this.updatePagination();
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

  updatePagination(): void {
    // Calculate total pages
    this.totalPages = Math.ceil(this.filteredBlogs.length / this.pageSize);

    // Ensure current page is valid after filter changes
    if (this.currentPage > this.totalPages) {
      this.currentPage = Math.max(1, this.totalPages);
    }

    // Get current page blogs
    this.updateCurrentPageBlogs();
  }

  updateCurrentPageBlogs(): void {
    // Sort the filtered blogs by date (newest first)
    const sortedBlogs = [...this.filteredBlogs]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Calculate start and end indices for the current page
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, sortedBlogs.length);

    // Get blogs for the current page
    this.currentPageBlogs = sortedBlogs.slice(startIndex, endIndex);
  }

  changePage(pageNumber: number): void {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.currentPage = pageNumber;
      this.updateCurrentPageBlogs();
      // Scroll to top of blog list
      window.scrollTo({
        top: (document.querySelector('.blog-list') as HTMLElement)?.offsetTop - 100 || 0,
        behavior: 'smooth'
      });

    }
  }

  // Generate array of page numbers to display in pagination
  getPageNumbers(): number[] {
    const pageNumbers: number[] = [];

    // If few pages, show all
    if (this.totalPages <= 5) {
      for (let i = 1; i <= this.totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Complex pagination with ellipsis
      if (this.currentPage <= 3) {
        // Near the start
        pageNumbers.push(1, 2, 3, 4, 5);
      } else if (this.currentPage >= this.totalPages - 2) {
        // Near the end
        for (let i = this.totalPages - 4; i <= this.totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // Middle pages
        for (let i = this.currentPage - 2; i <= this.currentPage + 2; i++) {
          pageNumbers.push(i);
        }
      }
    }

    return pageNumbers;
  }

  handleSearchResults(blogs: Blog[]): void {
    this.filteredBlogs = blogs.map(blog => {
      // Only prepend the base URL if the image path doesn't already have it
      if (blog.image && !blog.image.startsWith('http')) {
        blog.image = 'http://www.rentify.duckdns.org:8087' + blog.image;
      }
      return blog;
    });

    this.updateFeaturedAndLatestBlogs();
    this.updatePagination();
  }

  // Push search terms into the observable stream
  onSearch(): void {
    this.searchTerms.next(this.searchQuery);
  }
}
