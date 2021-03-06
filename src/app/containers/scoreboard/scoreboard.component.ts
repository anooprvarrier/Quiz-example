import { Component, ChangeDetectionStrategy, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { QuizService } from 'src/app/services/quiz.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'codelab-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.scss'],
  providers: []
})
export class ScoreboardComponent implements OnInit, OnChanges {
  answer;
  @Input() set selecteAnaswer(value) {
    this.answer = value;
  }
  totalQuestions: number;
  badgeQuestionNumber: number;


  constructor(private quizService: QuizService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    let questionID
    this.route.params.subscribe(params => {
      console.log(params);
      if (params.questionID) {
        questionID = params.questionID;
        this.badgeQuestionNumber = questionID;
      }
    });

    this.totalQuestions = this.quizService.numberOfQuestions();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.selecteAnaswer && changes.selecteAnaswer.currentValue != changes.selecteAnaswer.firstChange) {
      this.answer = changes.selecteAnaswer.currentValue;
    }
  }
}
