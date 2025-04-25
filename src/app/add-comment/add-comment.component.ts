import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BlogComment } from '../models/BlogComment';
import { CommentService } from '../services/comment.service';
import { CommonModule } from '@angular/common';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./add-comment.component.scss']
})
export class AddCommentComponent {
  @Input() blogId!: number; // Assurez-vous que blogId est toujours fourni
  @Output() commentAdded = new EventEmitter<BlogComment>();

  commentContent: string = '';

  constructor(private commentService: CommentService) {}

  submitComment(): void {
    if (!this.commentContent.trim() || !this.blogId) return;

    const formData = new FormData();
    formData.append('blogId', this.blogId.toString());
    formData.append('content', this.commentContent);
    formData.append('userId', '1'); // Your user ID

    this.commentService.addComment(formData).subscribe({
      next: () => {
        window.location.reload(); // This will refresh the entire page
      },
      error: (err) => console.error('Error:', err)
    });
  }
  }
