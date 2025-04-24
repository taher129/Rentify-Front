// home.component.ts
import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category';
import {NgForOf, NgStyle} from "@angular/common";
import {RouterLink} from "@angular/router";
import {SlickCarouselModule} from "ngx-slick-carousel";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [
    NgStyle,
    NgForOf,
    RouterLink,
    SlickCarouselModule
  ],
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  randomCategories: Category[] = [];
  categories: any[] = [];

  slideConfig = {
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    dots: true,
    autoplay: true,
    autoplaySpeed: 3000,
    infinite: true, // Add this for infinite scrolling
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  };
  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
    this.categoryService.getAllCategories().subscribe({
      next: (categories: Category[]) => {
        const fullUrlCategories = categories.map(cat => ({
          ...cat,
          categoryImage: 'http://localhost:8084' + cat.categoryImage
        }));
        this.randomCategories = this.shuffleArray(fullUrlCategories).slice(0, 4);
      },
      error: err => {
        console.error('Error loading categories', err);
      }
    });
  }


  shuffleArray(array: Category[]): Category[] {
    return array.sort(() => Math.random() - 0.5);
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (categories: any[]) => {
        // Map categories to include full image URLs
        this.categories = categories.map(category => ({
          ...category,
          categoryImage: 'http://localhost:8084' + category.categoryImage
        }));
      },
      error: (err) => console.error('Error loading categories', err)
    });
  }
}
