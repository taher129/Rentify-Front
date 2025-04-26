import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  images: string[];
}

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css'
})
export class BlogComponent {
  blogPosts: BlogPost[] = [
    {
      id: 1,
      title: 'How to Make Money by Renting Your Items',
      excerpt: 'Detailed guide on how you can start earning through Rentify...',
      images: ['assets/images/blog/image0_0.jpg', 'assets/images/blog/blog11.jpg']
    },
    {
     
      id: 2,
      title: 'Top 5 Most Rented Items on Rentify',
      excerpt: 'Here’s a breakdown of the most sought-after items on Rentify...',
      images: ['assets/images/blog/image1_0 (1).jpg', 'assets/images/blog/blog11.jpg']
    },
    {
      id: 3,
      title: 'Why Renting is the Future of Sustainable Living',
      excerpt: 'Learn about the impact of renting on sustainability...',
      images: ['assets/images/blog/image1_0 (2).jpg', 'assets/images/blog/image0_0 (2).jpg']
    }
  ];

}

