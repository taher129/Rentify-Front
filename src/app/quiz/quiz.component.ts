// src/app/components/quiz/quiz.component.ts

import { Component, OnInit } from '@angular/core';
import { QuizService} from "../services/quiz.service";
import { question } from '../models/question';
import {NgClass, NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  standalone: true,
  imports: [
    NgClass,
    NgForOf,
    NgIf
  ],
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {
  questions: question[] = [];
  question!: question;
  answers: (number | null)[] = Array(10).fill(null);
  questionNo: number = 0;

  constructor(private quizService: QuizService) {}

  ngOnInit() {
    this.loadQuiz();
  }

  loadQuiz() {
    this.quizService.getQuestions().subscribe({
      next: (questions) => {
        this.questions = questions;
        this.question = this.questions[0];
      },
      error: (err) => console.error(err)
    });
  }

  setAnswer(qIndex: number, answerIndex: number) {
    this.answers[qIndex] = answerIndex;
  }

  setQuestion(i: number) {
    this.questionNo = i;
    this.question = this.questions[this.questionNo];
  }

  nextQue() {
    if (this.questionNo < this.questions.length - 1) {
      this.questionNo++;
      this.question = this.questions[this.questionNo];
    }
  }

  prevQue() {
    if (this.questionNo > 0) {
      this.questionNo--;
      this.question = this.questions[this.questionNo];
    }
  }

  clear() {
    this.answers[this.questionNo] = null;
  }

  submit() {
    const payload = {
      answers: this.answers
    };
    console.log('Submitting quiz:', payload);
    // you can send payload to backend here if you want
  }

  submitQuiz() {
    const payload = {
      questions: this.questions, // full questions (text and options)
      answers: this.answers // array of selected indexes
    };

    this.quizService.submitQuiz(payload).subscribe({
      next: (res) => {
        console.log('Quiz submitted successfully');
      },
      error: (err) => {
        console.error('Failed to submit quiz', err);
      }
    });
  }

}


