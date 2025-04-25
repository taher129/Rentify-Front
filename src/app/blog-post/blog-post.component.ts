import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../services/blog.service';
import { CommonModule } from '@angular/common';
import { CommentComponent } from "../comment/comment.component";
import { CommentService } from "../services/comment.service";
import { AddCommentComponent } from "../add-comment/add-comment.component";
import { BlogComment } from "../models/BlogComment";
import { ShareService } from '../services/share.service'; // New import

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-post.component.html',
  standalone: true,
  imports: [CommonModule, CommentComponent, AddCommentComponent],
  styleUrls: ['./blog-post.component.scss']
})
export class BlogPostComponent implements OnInit, AfterViewInit {
  blogPost: any = null;
  isLoading = true;
  error: string | null = null;
  defaultTags = ['Blog', 'Tour', 'Holidays', 'Ticket Booking', 'Deep learning'];
  blogId: number = -1;
  comments: BlogComment[] = [];
  currentUrl: string = '';
  shareText: string = 'Check out this blog post: ';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blogService: BlogService,
    private commentService: CommentService,
    private shareService: ShareService // New service
  ) {}

  ngOnInit(): void {
    this.currentUrl = window.location.href;
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
        this.blogId = data.idBlog;
        this.shareText += data.title; // Update share text with blog title

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

  // Social sharing methods
  shareOnFacebook(): void {
    this.shareService.shareOnFacebook(this.currentUrl);
  }

  shareOnTwitter(): void {
    this.shareService.shareOnTwitter(this.currentUrl, this.shareText);
  }

  shareOnLinkedIn(): void {
    this.shareService.shareOnLinkedIn(this.currentUrl);
  }

  shareOnInstagram(): void {
    this.shareService.shareOnInstagram();
  }




  // Content processing methods
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

  ngAfterViewInit() {
    console.log('BlogPost ID being passed to comments:', this.blogId);
  }

  handleNewComment(comment: BlogComment) {
    this.comments = [comment, ...this.comments];
  }

  handleCommentDeleted(commentId: number) {
    this.comments = this.comments.filter(c => c.id !== commentId);
  }

  copyToClipboard(): void {
    navigator.clipboard.writeText(this.currentUrl).then(() => {
      alert('Link copied to clipboard!');
    });
  }
  shareOnWhatsApp(): void {
    window.open(`https://wa.me/?text=${encodeURIComponent(this.shareText + ' ' + this.currentUrl)}`, '_blank');
  }
}
