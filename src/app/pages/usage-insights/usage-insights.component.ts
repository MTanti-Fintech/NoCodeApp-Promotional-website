import { Component, OnInit } from '@angular/core';
import { Color } from 'ng2-charts';

@Component({
  selector: 'app-usage-insights',
  templateUrl: './usage-insights.component.html',
  styleUrls: ['./usage-insights.component.scss']
})
export class UsageInsightsComponent implements OnInit {
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };

  public barChartLabels = ['Jan', 'Feb', 'Mar', 'April', 'May'];
  public barChartType = 'line';
  public barChartLegend = true;
  public barChartColors: Color[] = [
    { backgroundColor: '#EE7B11',borderColor:'black',pointBackgroundColor:'#5A6881' },
  ]
  public barChartData = [
    {
      data: [65, 59, 80, 81, 56],
      label: 'Cost per month($)'
    }
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
