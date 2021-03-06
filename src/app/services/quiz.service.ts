import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { QUIZ_DATA } from "../quiz";
import { Quiz } from "../models/quiz";
import { QuizQuestion } from "../models/QuizQuestion";
import { TimerService } from "./timer.service";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class QuizService {
  quizData: Quiz = { ...QUIZ_DATA };
  question: QuizQuestion;
  answer: number;

  public correctAnswersCount = new BehaviorSubject<number>(0);
  public correctAnaswer$ = this.correctAnswersCount.asObservable();
  totalQuestions: number;
  completionTime: number;

  currentQuestionID = 1;
  finalAnswers = [];
  correctAnswerStr: string;
  correctAnswers = [];
  explanationOptions: string;
  explanationOptionsText: string;
  correctAnswerMessage: string;

  constructor(
    private timerService: TimerService,
    private router: Router
  ) {

  }

  getQuestions() {
    return { ...this.quizData };
  }

  resetAll() {
    this.correctAnswersCount.next(0);
    this.currentQuestionID = 1;
    this.correctAnswers = [];
    this.correctAnswerMessage = undefined;
  }

  setExplanationOptionsText() {
    this.explanationOptions = this.explanationOptionsText;
  }

  getExplanationOptionsText() {
    return this.explanationOptions;
  }

  addCorrectIndexesToCorrectAnswerOptionsArray(optionIndex: number): void {
    if (
      this.question &&
      optionIndex &&
      this.question.options &&
      this.question.options[optionIndex]["correct"] === true
    ) {
      this.correctAnswers = [...this.correctAnswers, optionIndex + 1];
      
    }else{
      console.log('else')
    }
  }

  addFinalAnswerToFinalAnswers() {
    this.finalAnswers = [...this.finalAnswers, this.answer];
  }

  numberOfQuestions() {
    if (this.quizData && this.quizData.questions)
      return this.quizData.questions.length;
    else return 0;
  }


  getQuestionType(): boolean {
    return (this.correctAnswers && this.correctAnswers.length === 1);
  }

  isFinalQuestion() {
    return this.quizData.questions.length == this.currentQuestionID;
  }

  nextQuestion() {
    let questionId = this.currentQuestionID + 1;
    this.router.navigate(["/question", questionId]);
  }
  navigateToResults() {
    this.router.navigate(["/results"], {
      state: {
        questions: this.quizData,
        results: {
          correctAnswers: this.correctAnswers,
          completionTime: 20,
          totalQuestions: this.totalQuestions,
          correctAnswersCount: this.correctAnswers ? this.correctAnswers.length : 0
        }
      }
    });
  }
}
