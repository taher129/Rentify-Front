import { Component, Input, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {DatePipe, NgIf} from "@angular/common";

export interface Comment {
  id: number;
  content: string;
  userId: number;
  createdAt: Date;
}

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    DatePipe
  ],
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  @Input() blogPost: any;
  commentForm: FormGroup;

  // Simulating a logged-in user ID (in a real app, you would get this from authentication service)
  currentUserId = 123;

  constructor(private fb: FormBuilder) {
    this.commentForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  ngOnInit(): void {
    // Initialize comments array if it doesn't exist
    if (!this.blogPost.comments) {
      this.blogPost.comments = [];
    }
  }

  submitComment(): void {
    if (this.commentForm.valid) {
      // Create a new comment
      const newComment: Comment = {
        id: this.generateCommentId(),
        content: this.commentForm.value.content,
        userId: this.currentUserId,
        createdAt: new Date()
      };

      // Add the comment to the blog post
      this.blogPost.comments.unshift(newComment);

      // Reset the form
      this.commentForm.reset();

      // In a real application, you would save this to your backend:
      // this.commentService.addComment(this.blogPost.id, newComment).subscribe(response => {
      //   console.log('Comment added successfully', response);
      // });
    }
  }

  private generateCommentId(): number {
    // In a real app, the backend would generate IDs
    // This is just a simple client-side implementation for demo purposes
    return this.blogPost.comments.length > 0
      ? Math.max(...this.blogPost.comments.map((c: Comment) => c.id)) + 1
      : 1;
  }
}
