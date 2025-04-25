import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../services/blog.service';
import { CommonModule } from '@angular/common';
import { CommentComponent } from "../comment/comment.component";
import { CommentService } from "../services/comment.service";

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-post.component.html',
  standalone: true,
  imports: [CommonModule, CommentComponent],
  styleUrls: ['./blog-post.component.scss']
})
export class BlogPostComponent implements OnInit, AfterViewInit {
  blogPost: any = null;
  isLoading = true;
  error: string | null = null;
  defaultTags = ['Blog', 'Tour', 'Holidays', 'Ticket Booking', 'Deep learning'];
  blogId: number = -1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blogService: BlogService,
    private commentService: CommentService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const blogId = params.get('id');
      if (blogId) {
        this.loadBlogDetails(blogId);
      } else {
        this.error = 'Blog ID not found';
        this.isLoading = false;
      }
    });
  }

  loadBlogDetails(id: string): void {
    this.isLoading = true;
    this.error = null;

    const numericId = Number(id);
    if (isNaN(numericId)) {
      this.error = 'Invalid blog ID';
      this.isLoading = false;
      return;
    }

    this.blogService.getBlogById(numericId).subscribe({
      next: (data) => {
        if (data.image) {
          data.image = 'http://localhost:8087' + data.image;
        }

        this.blogPost = data;
        this.blogId = data.idBlog;  // Save blog ID for comment component

        if (this.blogPost.content) {
          this.blogPost.processedContent = this.processContent(this.blogPost.content);
        }

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading blog:', error);
        this.error = 'Failed to load blog details';
        this.isLoading = false;
      }
    });
  }

  processContent(content: string): any {
    if (content.includes('<')) {
      return content;
    }

    return {
      paragraphs: this.extractParagraphs(content),
      bulletPoints: this.extractBulletPoints(content)
    };
  }

  extractParagraphs(content: string): string[] {
    return content.split('\n\n')
      .map(p => p.trim())
      .filter(p => p && !p.startsWith('•') && !p.startsWith('-'));
  }

  extractBulletPoints(content: string): string[] {
    const lines = content.split('\n');
    return lines
      .filter(line => line.startsWith('•') || line.startsWith('-'))
      .map(line => line.replace(/^[•-]\s*/, '').trim());
  }

  calculateReadTime(content: string): string {
    if (!content) return '5 min read';
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  }

  getFacebookShareUrl(): string {
    const url = encodeURIComponent(window.location.href);
    return `https://www.facebook.com/sharer/sharer.php?u=${url}`;
  }

  getTwitterShareUrl(): string {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(this.blogPost?.title || 'Check out this blog post');
    return `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
  }

  getInstagramShareUrl(): string {
    return '#';
  }

  ngAfterViewInit() {
    console.log('BlogPost ID being passed to comments:', this.blogId);
  }
}
