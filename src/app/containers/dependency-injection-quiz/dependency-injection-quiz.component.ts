import { Component, ChangeDetectionStrategy, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';

import { QUIZ_DATA } from '../../quiz';
import { Quiz } from '../../models/quiz';
import { QuizQuestion } from '../../models/QuizQuestion';
import { QuizService } from 'src/app/services/quiz.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { TimerService } from 'src/app/services/timer.service';

@Component({
  selector: 'dependency-injection-quiz-component',
  templateUrl: './dependency-injection-quiz.component.html',
  styleUrls: ['./dependency-injection-quiz.component.scss']
})
export class DependencyInjectionQuizComponent implements OnInit {
  question: QuizQuestion;
  answer: number;
  totalQuestions: number;
  progressValue: number;
  explanationOptionsText: string;
  questionID: number;
  count: number;
  constructor(private quizService: QuizService,
    private route: ActivatedRoute,
    private router: Router,
    private timerService: TimerService) { }

  ngOnInit() {
    this.quizService.correctAnaswer$.subscribe(data => {
      this.count = data + 1;
    })

    this.route.params.subscribe(params => {
      this.totalQuestions = this.quizService.numberOfQuestions();
      if (params.questionID) {
        this.questionID = parseInt(params.questionID);
        this.quizService.currentQuestionID = this.questionID;
        this.getQuestion();
        if (this.questionID == 1) {
          this.progressValue = 0;
        } else
          this.progressValue = ((this.questionID - 1) / this.totalQuestions) * 100;
        this.explanationOptionsText = this.quizService.explanationOptionsText;
      }
    });
    if (this.questionID == 1) {
      this.quizService.correctAnswersCount.next(0);
    }
  }

  private getQuestion() {
    this.question = this.quizService.getQuestions().questions[this.questionID - 1];
    this.explanationOptionsText = this.question.explanation;
  }

  selectedAnswer(data) {
    this.answer = data;
  }

  nextQuestion() {
    this.checkIfAnsweredCorrectly();
    this.quizService.nextQuestion();
  }

  results() {
    this.checkIfAnsweredCorrectly();
    this.quizService.navigateToResults();
  }

  checkIfAnsweredCorrectly() {
    if (this.question) {
      if (
        this.question.options && this.question.options[this.answer] && this.question.options[this.answer]["selected"] && this.question.options[this.answer]["correct"]
      ) {
        this.quizService.correctAnswersCount.next(this.count);
        this.quizService.finalAnswers = [...this.quizService.finalAnswers, this.answer];
        this.timerService.resetTimer();
      } else {
        console.log('>>>>>>>>>Inside else<<<<<<<<<<<<<');
      }
    }
  }
}
