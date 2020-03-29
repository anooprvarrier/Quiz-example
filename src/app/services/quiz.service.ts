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
  quizData: Quiz = QUIZ_DATA;
  question: QuizQuestion;
  answer: number;
  // correctAnswersCount: number=0;
  // correctAnaswer$.asObservable()

  public correctAnswersCount = new BehaviorSubject<number>(0);
  public correctAnaswer$ = this.correctAnswersCount.asObservable();
  totalQuestions: number;
  completionTime: number;
  answered: boolean;
  correctAnswer: boolean;
  progressValue: number;

  questionIndex = 0;
  questionID = 1;
  percentage: number;
  finalAnswers = [];
  correctAnswerText: string;
  correctAnswerStr: string;
  correctAnswers = [];
  explanation: string;
  explanationOptions: string;
  explanationOptionsText: string;
  correctAnswerMessage: string;
  matRadio: boolean;

  constructor(
    private timerService: TimerService,
    private router: Router
  ) { }

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
    } else {
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>Something went wrong...");
    }
    console.log('>>>>>>this.question:', this.question);
    console.log('>>>>>>>>optionIndex: ', optionIndex);
  }

  setExplanationOptionsAndCorrectAnswerMessages(correctAnswers) {
    this.question = this.getQuestion;
    if (this.question)
      this.explanation =
        " is correct because " + this.question.explanation + ".";

    if (
      this.correctAnswers &&
      this.correctAnswers.length === 1 &&
      correctAnswers &&
      correctAnswers.length > 0
    ) {
      let correctAnswersText = correctAnswers[0];
      this.explanationOptionsText =
        "Option " + correctAnswersText + this.explanation;
      this.correctAnswerMessage =
        "The correct answer is Option " + correctAnswers[0] + ".";
    }

    if (
      this.correctAnswers &&
      this.correctAnswers.length > 1 &&
      correctAnswers &&
      correctAnswers.length > 0
    ) {
      if (correctAnswers[0] && correctAnswers[1]) {
        let correctAnswersText = correctAnswers[0].concat(
          " and ",
          correctAnswers[1]
        );
        this.explanationOptionsText =
          "Options " + correctAnswersText + this.explanation;
        this.correctAnswerMessage =
          "The correct answers are Options " + correctAnswersText + ".";
      }
      if (correctAnswers[0] && correctAnswers[1] && correctAnswers[2]) {
        let correctAnswersText = correctAnswers[0].concat(
          ", ",
          correctAnswers[1],
          " and ",
          correctAnswers[2]
        );
        this.explanationOptionsText =
          "Options " + correctAnswersText + this.explanation + ".";
        this.correctAnswerMessage =
          "The correct answers are Options " + correctAnswersText + ".";
      }
      if (
        correctAnswers[0] &&
        correctAnswers[1] &&
        correctAnswers[2] &&
        correctAnswers[3]
      ) {
        let correctAnswersText = correctAnswers[0].concat(
          ", ",
          correctAnswers[1],
          ", " + correctAnswers[2],
          " and ",
          correctAnswers[3]
        );
        this.explanationOptionsText =
          "Options " + correctAnswersText + this.explanation;
        this.correctAnswerMessage =
          "The correct answers are Options " + correctAnswersText + ".";
      }
    }
  }

  // checks whether the question is valid and is answered correctly
  checkIfAnsweredCorrectly() {
    this.answered = true;
    this.question = this.getQuestion;

    // check if the selected option is equal to the correct answer
    if (this.question) {
      if (
        this.question.options && this.question.options["selected"] === this.question.options["correct"]
      ) {
        this.timerService.stopTimer();
        this.correctAnswer = true;

        // need to check if there's more than one answer and if all selected answers are correct
        // this.correctAnswersCount++;
        this.timerService.quizDelay(3000);
        this.addFinalAnswerToFinalAnswers();
        this.timerService.resetTimer();
        //this.navigateToNextQuestion();
      } else {
        this.answered = false;
        this.correctAnswer = false;
      }
    }
  }

  

  addFinalAnswerToFinalAnswers() {
    this.finalAnswers = [...this.finalAnswers, this.answer];
  }

  increaseProgressValue() {
    this.progressValue = parseFloat(
      ((100 * (this.getQuestionIndex() + 1)) / this.totalQuestions).toFixed(1)
    );
  }

  nextQuestion() {
    this.navigateToNextQuestion();
    this.timerService.resetTimer();
  }

  navigateToNextQuestion(): void {
    this.router.navigate(["/question", this.questionID]);
  }

  navigateToResults(): void {
    this.router.navigate(["/results"], {
      state: {
        questions: this.quizData ? this.quizData.questions : [],
        results: {
          correctAnswers: this.correctAnswers,
          completionTime: this.completionTime
        }
      }
    });
  }

  /*
   *  public API for service
   */
  getQuiz() {
    return this.quizData;
  }

  getQuestionIndex() {
    return this.questionIndex;
  }

  setQuestionIndex(idx: number) {
    return (this.questionIndex = idx);
  }

  numberOfQuestions() {
    if (this.quizData && this.quizData.questions)
      return this.quizData.questions.length;
    else return 0;
  }

  isThereAnotherQuestion(): boolean {
    return this.questionIndex <= this.numberOfQuestions();
  }

  isFinalQuestion(): boolean {
    return this.questionIndex === this.totalQuestions;
  }

  get getQuestion(): QuizQuestion {
    return this.quizData.questions[this.questionIndex];
  }

  // if the question has a single answer, use mat-radio-button in the form, else use mat-checkbox in the form
  getQuestionType(): boolean {
    return (this.correctAnswers && this.correctAnswers.length === 1);
  }
}