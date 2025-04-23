// stats.component.ts
import { Component, OnInit } from '@angular/core';
import { StatsService } from '../services/stats.service';
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgForOf
  ],
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {
  statsData: any[] = [];
  loading = true;
  error = false;

  constructor(private statsService: StatsService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loading = true;
    this.error = false;

    // Example for 10 questions - adjust based on your actual questions
    for (let i = 0; i < 10; i++) {
      this.statsService.getQuestionStats(i + 1).subscribe({
        next: (data) => {
          this.statsData[i] = {
            questionId: i + 1,
            questionText: this.getQuestionText(i),
            ...data,
            percentages: this.calculatePercentages(data.responseCounts, data.totalResponses)
          };

          if (i === 9) { // When last question is loaded
            this.loading = false;
          }
        },
        error: (err) => {
          console.error('Error loading stats:', err);
          this.error = true;
          this.loading = false;
        }
      });
    }
  }

  getQuestionText(index: number): string {
    // Replace with your actual questions or fetch from service
    const sampleQuestions = [
      "How would you rate our rental blog content?",
      "Which content would you like to see more?",
      // Add all 10 questions here
    ];
    return sampleQuestions[index] || `Question ${index + 1}`;
  }

  calculatePercentages(counts: any, total: number): any {
    const percentages: any = {};
    for (const [option, count] of Object.entries(counts)) {
      percentages[option] = total > 0 ? Math.round((count as number / total) * 100) : 0;
    }
    return percentages;
  }
}
