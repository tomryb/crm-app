import {
  Component,
  OnInit
} from '@angular/core';
import { BreakpointObserver, Breakpoints, MediaMatcher } from '@angular/cdk/layout';

interface InfoBox {
  bgClass: string;
  icon: string;
  title: string;
  subtitle: string;
}

@Component({
  selector: 'dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  colNum: number = 4;
  rowHeight = '120px';
  cardClass = 'dash-card';

  mediaQueryList: any = null;
  mediaQueryMin: any = null;
  isMobile = false;


  constructor(
    private breakpointObserver: BreakpointObserver,) {

    breakpointObserver.observe([
      Breakpoints.HandsetLandscape,
      Breakpoints.HandsetPortrait
    ])
  }

  infoBoxes: InfoBox[] = [
    {
      bgClass: "user-registration",
      icon: "account_circle",
      title: "User Registrations",
      subtitle: "68",
    },
    {
      bgClass: "bounce-rate",
      icon: "assessment",
      title: "Bounce Rate",
      subtitle: "36%  ",
    },
    {
      bgClass: "membership",
      icon: "card_membership",
      title: "Unique Visitors",
      subtitle: "32",
    }
  ]


  ngOnInit() {

  }
}
