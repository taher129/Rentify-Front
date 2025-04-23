import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { questions } from '../../assets/questions';
import { BlogService } from "../services/blog.service";
import { StatsService } from "../services/stats.service";

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.scss',
  providers: [StatsService] // Ensure service is provided for standalone component
})
export class QuizComponent implements OnInit {
  questions: Array<any> = []; // Changed from Object to any for better type safety
  questionNo: number = 0;
  question: any;
  answers: Array<number | null> = new Array(10).fill(null); // More specific type
  @Output('endQuiz') endQuiz: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private blogService: BlogService,
    private statsService: StatsService
  ) {}

  // Shuffle algorithm (Fisher-Yates)
  shuffle(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  ngOnInit(): void {
    this.questions = this.randomQuestions();
    this.question = this.questions[0];
    this.blogService.setQuestions(this.questions);
  }

  submitAnswer(questionId: number, chosenOption: number) {
    this.statsService.submitResponse(questionId, chosenOption).subscribe({
      next: () => console.log('Response recorded successfully'),
      error: (err) => console.error('Failed to record response:', err)
    });
  }

  randomQuestions() {
    const shuffled = [...questions]; // Create a copy to shuffle
    this.shuffle(shuffled);
    return shuffled.slice(0, 10);
  }

  setQuestion(queNo: number) {
    if (queNo >= 0 && queNo < this.questions.length) {
      this.questionNo = queNo;
      this.question = this.questions[queNo];
    }
  }

  setAnswer(index: number, answer: number) {
    if (index >= 0 && index < this.answers.length) {
      this.answers[index] = answer;
      this.blogService.setAnswers(this.answers);
      this.submitAnswer(index, answer); // Track the response
    }
  }

  nextQue() {
    if (this.questionNo < this.questions.length - 1) {
      this.setQuestion(this.questionNo + 1);
    }
  }

  prevQue() {
    if (this.questionNo > 0) {
      this.setQuestion(this.questionNo - 1);
    }
  }

  clear() {
    this.answers[this.questionNo] = null;
    this.blogService.setAnswers(this.answers);
  }

  submit() {
    // Submit all answers before ending quiz
    this.answers.forEach((answer, index) => {
      if (answer !== null) {
        this.submitAnswer(index, answer);
      }
    });
    this.endQuiz.emit();
  }
}
