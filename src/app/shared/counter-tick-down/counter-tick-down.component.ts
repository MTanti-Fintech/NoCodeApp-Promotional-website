import { Component, OnInit, OnDestroy, Injectable } from "@angular/core";
import { timer, Subscription } from "rxjs";
import { Pipe, PipeTransform } from "@angular/core";

@Injectable()
export class MyService {
  getCounter(tick) {
    return timer(0, tick);
  }
}


@Component({
  selector: "my-app-counter",
  templateUrl: "./counter-tick-down.component.html",
  providers: [MyService]
})
export class CounterTickDown implements OnInit, OnDestroy {
  countDown: Subscription;
  counter = 121;
  tick = 1000;

  constructor(private myService: MyService) {}

  ngOnInit() {
    this.countDown = this.myService
      .getCounter(this.tick)
      .subscribe(() => {
        if(this.counter>0){
            this.counter--;
        }
        
      }
      );
  }

  ngOnDestroy() {
    this.countDown = null;
  }
}

@Pipe({
  name: "formatTime"
})
export class FormatTimePipe implements PipeTransform {
  transform(value: number): string {
    //MM:SS format
    const minutes: number = Math.floor(value / 60);
    return (
      ("00" + minutes).slice(-2) +
      ":" +
      ("00" + Math.floor(value - minutes * 60)).slice(-2)
    );

    // for HH:MM:SS
    //const hours: number = Math.floor(value / 3600);
    //const minutes: number = Math.floor((value % 3600) / 60);
    //return ('00' + hours).slice(-2) + ':' + ('00' + minutes).slice(-2) + ':' + ('00' + Math.floor(value - minutes * 60)).slice(-2);
  }
}
