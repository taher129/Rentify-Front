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

  async submitComment(): Promise<void> {
    if (!this.commentContent.trim() || !this.blogId) return;

    try {
      // Call the profanity detection API
      const response = await fetch('https://vector.profanity.dev', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: this.commentContent })
      });

      const result = await response.json();

      if (result.isProfanity) {
        alert('Your comment contains inappropriate language.');
        return;
      }

      // If no profanity detected, submit the comment
      const formData = new FormData();
      formData.append('blogId', this.blogId.toString());
      formData.append('content', this.commentContent);
      formData.append('userId', '1'); // Your user ID

      this.commentService.addComment(formData).subscribe({
        next: () => {
          window.location.reload(); // Or emit the comment instead of reloading
        },
        error: (err) => console.error('Error:', err)
      });
    } catch (error) {
      console.error('Error checking profanity:', error);
    }
  }

}
