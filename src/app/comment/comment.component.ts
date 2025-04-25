import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommentService } from '../services/comment.service';
import { BlogComment } from '../models/BlogComment';
import { DatePipe, JsonPipe, NgForOf, NgIf } from "@angular/common";
import { FormsModule } from '@angular/forms'; // Added for ngModel

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    DatePipe,
    JsonPipe,
    FormsModule // Added for textarea binding
  ],
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  @Input() blogId!: number;
  @Input() currentUserId: number = 1; // Should come from auth service
  @Output() commentDeleted = new EventEmitter<number>();
  @Output() commentUpdated = new EventEmitter<BlogComment>();

  comments: BlogComment[] = [];
  isLoading = false;
  error: string | null = null;

  // Edit state management
  editingStates: { [key: number]: boolean } = {};
  editContents: { [key: number]: string } = {};

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

  startEdit(comment: BlogComment): void {
    this.editingStates[comment.id] = true;
    this.editContents[comment.id] = comment.content;
  }

  cancelEdit(commentId: number): void {
    this.editingStates[commentId] = false;
  }

  saveEdit(commentId: number): void {
    const newContent = this.editContents[commentId];
    if (!newContent?.trim()) return;

    this.commentService.updateComment(commentId, newContent).subscribe({
      next: (updatedComment) => {
        this.editingStates[commentId] = false;
        // Update local comments array
        const index = this.comments.findIndex(c => c.id === commentId);
        if (index !== -1) {
          this.comments[index] = updatedComment;
        }
        this.commentUpdated.emit(updatedComment);
      },
      error: (err) => {
        console.error('Error updating comment:', err);
        this.error = 'Failed to update comment';
      }
    });
  }

  deleteComment(commentId: number): void {
    if (confirm('Are you sure you want to delete this comment?')) {
      this.commentService.deleteComment(commentId).subscribe({
        next: () => {
          this.commentDeleted.emit(commentId);
          // Optimistic update
          this.comments = this.comments.filter(c => c.id !== commentId);
        },
        error: (err) => {
          console.error('Error deleting comment:', err);
          this.error = 'Failed to delete comment';
        }
      });
    }
  }
}
