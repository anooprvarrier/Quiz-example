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
  styleUrls: ['./dependency-injection-quiz.component.scss'],
  providers: []
})
export class DependencyInjectionQuizComponent implements OnInit {
  question: QuizQuestion;
  answer: number;
  totalQuestions: number;
  questionIndex: number;
  optionIndex: number;
  hasAnswer: boolean;
  progressValue: number;
  explanationOptionsText: string;
  disabled: boolean;
  questionID: any;

  constructor(private quizService: QuizService,
    private route: ActivatedRoute,
    private router: Router,
    private timerService:TimerService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      console.log(params);
      if (params.questionID) {
        this.questionID = params.questionID;
        this.getQuestion();
      }
    });
    if(this.questionID=='1'){
      this.quizService.correctAnswersCount.next(0);
    }
    this.totalQuestions = this.quizService.numberOfQuestions();
    this.progressValue = ((this.questionID) / this.totalQuestions) * 100;
    this.explanationOptionsText = this.quizService.explanationOptionsText;
  }



  private getQuestion() {
    this.question = this.quizService.quizData.questions[parseInt(this.questionID) - 1];
    this.explanationOptionsText = this.question.explanation;
  }

  selectedAnswer(data){
    this.answer=data;
  }

  nextQuestion() {
    this.router.navigate(["/question", parseInt(this.questionID) + 1]);
    
    this.checkIfAnsweredCorrectly();
  }

  results() {
    this.checkIfAnsweredCorrectly();
    this.router.navigate(["/results"], {
      state: {
        questions: this.quizService.quizData,
        results: {
          correctAnswers: this.quizService.correctAnswers,
          completionTime: this.quizService.completionTime
        }
      }
    });
  }

  checkIfAnsweredCorrectly() {
    if (this.question) {
      if (
        this.question.options && this.question.options["selected"] === this.question.options["correct"]
      ) {
        let count;
        this.quizService.correctAnaswer$.subscribe(data=>{
          count=data+1;
          console.log('>>>>>>>>: count',count)
        })
        this.quizService.correctAnswersCount.next(count);
        this.quizService.addFinalAnswerToFinalAnswers();

        this.quizService.finalAnswers = [...this.quizService.finalAnswers, this.answer];
        this.timerService.resetTimer();
      }
    }
  }
}
