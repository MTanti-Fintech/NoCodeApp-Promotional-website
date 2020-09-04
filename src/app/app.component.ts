import { environment } from './../environments/environment';
import { Component, OnInit, ViewChild, isDevMode, Inject } from '@angular/core';
import { Utility } from './shared/Utility';
import { CookieService } from './shared/cookie.service';
import { Router } from '@angular/router';
import { CommonService } from './shared/common.service';
import { MatDrawer } from '@angular/material/sidenav';
import { Location } from '@angular/common';
import { JWTToken } from 'src/app/shared/jwtToken';
import { Renderer2, HostListener, OnDestroy } from "@angular/core";
import { DOCUMENT } from "@angular/common";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends Utility implements OnInit {
  userInfo: any;

  constructor(
    private router: Router,
    private Cookie: CookieService,
    private location: Location,
    private jwtToken: JWTToken,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document,
  ) {
    super();
  }

  public static socket;
  title = 'officebcp_webclient';
  SetlocalStoragePermissison: any = [];
  expand = true;
  accesspagesignup = false;
  accespagelogin = false;
  accessPageResetPassword = false;
  notify = false;
  data = '';
  currentUrl = '';
  user_name = '';
  userEmail = '';
  errorCount = null;
  showUnReadFlag = false;
  showReadFlag = false;
  mustChangePassword = '0';
  errorStatus = 'normal';
  shownotification = false;
  readonly config = environment
  notificationData: ErrorData[] = [];
  @ViewChild('drawer') mydrawer: MatDrawer;

  ngOnInit(): void {

    this.currentUrl = this.location.path();
    this.currentUrl = this.currentUrl ? this.currentUrl.toLowerCase() : this.currentUrl;
    if (!this.Cookie.getCookie('usertoken')) {
      if (this.currentUrl.includes('/login')) {
        this.accespagelogin = true;
        this.accessPageResetPassword = false;
      } else if (this.currentUrl.includes('/reset-password/')) {
        this.accespagelogin = false;
        this.accessPageResetPassword = true;
      }

    } else {

    }
    this.callingmethod();
  }
  async callingmethod() {
    try {
    
      if (!this.Cookie.getCookie('usertoken')) {
        this.renderer.destroy();
        this.Cookie.clearCookies();
        this.user_name = '';
        if (this.accespagelogin) {
          this.router.navigate(['/login']);
        } else if (this.accesspagesignup) {
          this.router.navigate(['/signup']);
        }

        this.SetlocalStoragePermissison = [];
        CommonService.GlobalVar = [];
      } else {
        this.userInfo = await this.jwtToken.parseJWTToken(this.Cookie.getCookie('usertoken'));
        if (this.userInfo.Roles != "1") {
          const s = this.renderer.createElement("script");
          s.type = "text/javascript";
          var code = `function initFreshChat() {       window.fcWidget.init({           token: "761b52c4-1994-41df-a761-c9cdc9002b86",           host: "https://wchat.in.freshchat.com"       });   }   function initialize(i, t) { var e; i.getElementById(t) ? initFreshChat() : ((e = i.createElement("script")).id = t, e.async = !0, e.src = "https://wchat.in.freshchat.com/js/widget.js", e.onload = initFreshChat, i.head.appendChild(e)) } function initiateCall() {initialize(document, "freshchat-js-sdk")} window.addEventListener ? window.addEventListener("load", initiateCall, !1) : window.attachEvent("load", initiateCall, !1);`;
    
          s.appendChild(this.document.createTextNode(code));
          this.renderer.appendChild(this.document.body, s);

        }
        if (CommonService.GlobalVar === undefined || CommonService.GlobalVar.length === 0) {
          await this.getuserpermisison();
        }
        this.accespagelogin = true;
        this.accessPageResetPassword = false;
        await this.getdetails();
        if (this.router.url.indexOf('login') > 0 || this.router.url.indexOf('reset-password') > -1) {
          this.router.navigate(['/login']);
        } else if (this.router.url.indexOf('login') > 0) {
          this.router.navigate(['/login']);

          this.SetlocalStoragePermissison = [];
          CommonService.GlobalVar = [];
        } else {
          if (CommonService.GlobalVar === undefined || CommonService.GlobalVar.length === 0) {
            await this.getuserpermisison();
          }
          this.accespagelogin = true;
          this.accessPageResetPassword = false;
          await this.getdetails();
          if (this.router.url.indexOf('login') > 0 || this.router.url.indexOf('reset-password') > -1) {
            this.router.navigate(['/login']);
          } else if (this.router.url.indexOf('login') > 0) {
            this.router.navigate(['/login']);
          }
          // else {
          //   this.router.navigate(['/overview']);
          // }
        }
      }
    }
    catch (er) {
      console.log(er);
    }
  }



  async getdetails() {
    try {
      if (this.Cookie.getCookie('usertoken')) {
        const userInfo = this.jwtToken.parseJWTToken(this.Cookie.getCookie('usertoken'));
        this.mustChangePassword = userInfo.MustChangePasswordFlag;
      }
    } catch (e) {
      console.log(e);
    }
  }
  async getuserpermisison() {
    try {
      const data: any = [];
      data.push({
        is_active: 1,
        permission_id: null,
        permission_name: 'home',
        permissions: [2],
        total: 2,
        upm_id: null
      }
      );
      CommonService.GlobalVar = [];
      this.SetlocalStoragePermissison = [];
      for (const userper of data) {
        userper.permission_name = userper.permission_name.toLowerCase();
        if (userper.total > 0) {
          this.SetlocalStoragePermissison.push(Object.assign({}, userper));
        }
      }
      CommonService.GlobalVar = this.SetlocalStoragePermissison;
    } catch (e) {
      return;
    }
  }
  redirectToLogin() {
    this.user_name = '';
    this.SetlocalStoragePermissison = [];
    CommonService.GlobalVar = [];
    this.Cookie.clearCookies();
    this.accespagelogin = true;
    this.router.navigate(['/login']);
  }
  onSubmit() {
  }
}

export class ErrorData {
  component: string;
  messages: message[];
  showUnRead: boolean;
  showRead: boolean;
}

export class message {
  message: string;
  markasread: boolean;
  guid: string;
  type: string;
}
