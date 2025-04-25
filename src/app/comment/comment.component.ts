// comment.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { CommentService } from '../services/comment.service';
import { BlogComment } from '../models/BlogComment';
import {DatePipe, JsonPipe, NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    DatePipe,
    JsonPipe
  ],
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  @Input() blogId!: number;  // Blog ID input to fetch comments
  comments: BlogComment[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(private commentService: CommentService) {}

  ngOnInit(): void {
    if (this.blogId) {
      this.loadComments();
    }
  }

  loadComments(): void {
    this.isLoading = true;
    this.error = null;

    this.commentService.getCommentsByBlogId(this.blogId).subscribe({
      next: (data: BlogComment[]) => {
        this.comments = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load comments';
        this.isLoading = false;
        console.error(err);
      }
    });
  }
}
