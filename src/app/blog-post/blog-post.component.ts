import {Component, Input} from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

interface ProfileData {
  name: string;
  position: string;
  company: string;
  bio: string;
  photoUrl: string;
}


@Component({
  selector: 'app-blog-post',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './blog-post.component.html',
  styleUrls: ['./blog-post.component.css']
})

export class BlogPostComponent {
  blogPost = {
    title: 'Ten unconventional tips about startups that you can\'t learn from books',
    category: 'Hotel service',
    excerpt: 'Passage its ten led hearted removal cordial. Preference any astonished unreserved Mrs. Prosperous understood Middletons in conviction an uncommonly do.',
    author: 'Lori Stevens',
    date: 'Nov 15, 2022',
    readTime: '5 min read',
    featuredImage: 'assets/images/mountain-hiker.jpg'
  };
  blogContent = {
    paragraphs: [
      'Meant balls it if up doubt small purse. Paid mind even sons does he door no. Attended overcame repeated it is perceived Marianne in. I think on style child of. Servants moreover in sensible it ye possible. Required his you put the outlived answered position.',
      'A pleasure exertion if believed provided to. All led out world this music while asked.',
      'Warrant private blushes removed an in equally totally if. Delivered dejection necessary objection do Mr prevailed. Mr feeling does chiefly cordial in do. Water timed folly right aware if oh truth.'
    ],
    bulletPoints: [
      'Our Firmament living replenish Them Created after divide said Have to give',
      'Dominion light without days face saw wherein land',
      'Fifth have Seas made lights Very Day saw Seed herb sixth light whales',
      'Saying unto Place it seeds you\'re isn\'t heaven'
    ],
    imageUrl: 'assets/beach-woman.jpg'
  };
  @Input() profileData: ProfileData = {
    name: 'Lori Stevens',
    position: 'editor',
    company: 'Booking',
    bio: 'Louis Ferguson has written about government, criminal justice, and the role of money in politics since 2015. Delivered dejection necessary objection do Mr prevailed. Mr feeling does chiefly cordial in do. Water timed folly right aware if oh truth.',
    photoUrl: '/api/placeholder/80/80'
  };
}
