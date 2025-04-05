import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

interface BlogPost {
  id: number;
  title: string;
  content: string;
  publishDate: string;
  images: string[];
}

@Component({
  selector: 'app-blog-post',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './blog-post.component.html',
  styleUrls: ['./blog-post.component.css']
})
export class BlogPostComponent {
  post: BlogPost | undefined;

  blogPosts: BlogPost[] = [
    {
      id: 1,
      title: 'How to Make Money by Renting Your Items',
      content: `Discover how to generate passive income by renting out items you rarely use.
  
      <ol>
        <li><strong>Identify Valuable Items</strong>
          <ul>
            <li>Electronics (Laptops, Cameras, Drones)</li>
            <li>Home Appliances (Projectors, Coffee Machines)</li>
            <li>Outdoor Gear (Bicycles, Camping Equipment)</li>
          </ul>
        </li>
        <li><strong>Set Competitive Pricing</strong>
          <ul>
            <li>Research market prices</li>
            <li>Offer flexible rental durations</li>
            <li>Secure your items with deposits</li>
          </ul>
        </li>
        <li><strong>Ensure Secure Transactions</strong>
          <ul>
            <li>Use Rentify’s security features</li>
            <li>Accept payments only through the platform</li>
          </ul>
        </li>
      </ol>
      
      Start your journey to earning passive income today!`,
      images: ['assets/images/blog/image0_0.jpg', 'assets/images/blog/blog11.jpg'],
      publishDate: 'January 15, 2025'
    },
    {
      id: 2,
      title: 'Top 5 Most Rented Items on Rentify',
      

      content: `Discover the most popular items being rented out on Rentify. Here's a breakdown of the top 5 items that generate the most demand:
  
      <ol>
        <li><strong>Electronics</strong>
          <ul>
            <li>Laptops</li>
            <li>Smartphones</li>
            <li>Cameras and GoPros</li>
            <li>Drones</li>
          </ul>
        </li>
        <li><strong>Outdoor Gear</strong>
          <ul>
            <li>Bicycles</li>
            <li>Camping Equipment</li>
            <li>Kayaks</li>
            <li>Tents and Sleeping Bags</li>
          </ul>
        </li>
        <li><strong>Home Appliances</strong>
          <ul>
            <li>Coffee Machines</li>
            <li>Projectors</li>
            <li>Vacuum Cleaners</li>
            <li>Blenders and Mixers</li>
          </ul>
        </li>
        <li><strong>Furniture</strong>
          <ul>
            <li>Office Desks</li>
            <li>Chairs</li>
            <li>Tables</li>
            <li>Bookshelves</li>
          </ul>
        </li>
        <li><strong>Event Equipment</strong>
          <ul>
            <li>Sound Systems</li>
            <li>Lighting</li>
            <li>Projector Screens</li>
            <li>Wedding Chairs and Tables</li>
          </ul>
        </li>
      </ol>
      
      These items are in high demand and renting them out on Rentify can help you earn passive income. Whether you're a business owner or just looking to make some extra money, these popular rentals are a great place to start.
      
      Start listing your items on Rentify today and tap into the rental economy!`,

      images: ['assets/images/blog/image1_0 (1).jpg', 'assets/images/blog/blog11.jpg'],
      publishDate: 'January 20, 2025'
    },
    {
      id: 3,
      title: 'Why Renting is the Future of Sustainable Living',
      content: `The world is facing pressing environmental challenges, and renting is emerging as a key solution for more sustainable living. Here's why renting is the future:

      <ol>
        <li><strong>Reducing Overproduction and Waste</strong>
          <ul>
            <li>Renting reduces the need for constant production of goods, which is a major contributor to environmental pollution.</li>
            <li>By sharing resources, fewer items are produced, resulting in less waste and fewer natural resources being depleted.</li>
          </ul>
        </li>
        <li><strong>Access to High-Quality Items</strong>
          <ul>
            <li>Renting allows people to access high-quality products without the need to buy them. This includes items like electronics, vehicles, and even furniture.</li>
            <li>Instead of purchasing something that might be used only a few times, renting makes it easier to access top-notch products only when needed.</li>
          </ul>
        </li>
        <li><strong>Encouraging Circular Economy</strong>
          <ul>
            <li>Renting promotes a circular economy, where products are used, returned, and reused by multiple individuals, keeping them in circulation for a longer time.</li>
            <li>This helps prevent the linear "take-make-dispose" model and encourages more sustainable practices.</li>
          </ul>
        </li>
        <li><strong>Lowering Carbon Footprint</strong>
          <ul>
            <li>With fewer items being manufactured and shipped, the carbon footprint associated with production, packaging, and transportation is reduced.</li>
            <li>By renting items, people can share resources, reducing the need for manufacturing additional products.</li>
          </ul>
        </li>
        <li><strong>Aiding in Minimalist Living</strong>
          <ul>
            <li>Renting supports a minimalist lifestyle by allowing individuals to borrow only what they need, when they need it.</li>
            <li>This can lead to less clutter and a more sustainable way of living.</li>
          </ul>
        </li>
        <li><strong>Supporting Sustainable Companies</strong>
          <ul>
            <li>Platforms like Rentify encourage the use of rental services, promoting businesses that are built around sustainability.</li>
            <li>Supporting such businesses can help drive positive change toward more sustainable and responsible consumption.</li>
          </ul>
        </li>
      </ol>
    
      <strong>Conclusion:</strong>
      Renting is not just about saving money or accessing products—it's about creating a sustainable future. By reducing overproduction, supporting a circular economy, and lowering carbon emissions, renting can help us live more responsibly and reduce our environmental impact. Join the movement toward sustainable living and start renting today!`,

      
      images: ['assets/images/blog/image1_0 (2).jpg', 'assets/images/blog/image0_0 (2).jpg'],
      publishDate: 'January 25, 2025'
    }
  ];

  constructor(private route: ActivatedRoute) {
    const postId = Number(this.route.snapshot.paramMap.get('id'));
    this.post = this.blogPosts.find(p => p.id === postId);
  }
}