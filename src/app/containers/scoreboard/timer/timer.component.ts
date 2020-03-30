import { Component, ChangeDetectionStrategy, Input, OnInit, SimpleChanges, OnChanges } from '@angular/core';

import { QuizQuestion } from '../../../models/QuizQuestion';
import { QuizService } from 'src/app/services/quiz.service';
import { TimerService } from 'src/app/services/timer.service';


@Component({
  selector: 'codelab-scoreboard-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
  providers: []
})
export class TimerComponent implements OnInit, OnChanges {
  answer;
  @Input() set selecteAnaswer(value) {
    this.answer = value;
  }
  hasAnswer: boolean;

  interval;
  timeLeft: number;
  timePerQuestion = 20;
  elapsedTime: number;
  elapsedTimes: [];
  quizIsOver: boolean;

  constructor(
    private quizService: QuizService,
    private timerService: TimerService) { }

  ngOnInit(): void {

    this.timerService.getLeftTime$.subscribe(data=>{
      this.timeLeft=data;
    });
    this.timer();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.selecteAnaswer && changes.selecteAnaswer.currentValue != changes.selecteAnaswer.firstChange) {
      this.answer = changes.selecteAnaswer.currentValue;
    }
  }

  // countdown clock
  timer() {
    this.interval = setInterval(() => {
      this.quizTimerLogic();
    }, 1000);
    clearInterval();
  }

  quizTimerLogic() {
    if (this.timeLeft > 0) {
      this.timeLeft--;
      if (this.answer !== null) {
        this.hasAnswer = true;
        this.elapsedTime = Math.ceil(this.timePerQuestion - this.timeLeft);
        this.timerService.addElapsedTimeToElapsedTimes(this.elapsedTime);
        this.timerService.calculateTotalElapsedTime(this.elapsedTimes);
      }

      if (this.timeLeft === 0) {
        if (!this.quizService.isFinalQuestion()) {
          this.timerService.quizDelay(3000);
          this.quizService.nextQuestion();
        }
        if (this.quizService.isFinalQuestion() && this.hasAnswer === true) {
          this.quizService.navigateToResults();
          this.quizIsOver = true;
        }
        clearInterval(this.interval);
      }
    } else {
      this.timeLeft = 20;
    }
  }

  pauseTimer() {
    clearInterval(this.interval);
  }
}
