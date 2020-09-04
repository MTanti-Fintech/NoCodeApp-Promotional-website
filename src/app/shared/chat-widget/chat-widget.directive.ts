import {Renderer2,Inject,HostListener, OnInit, Injectable, Component, Directive} from "@angular/core";
import { DOCUMENT } from "@angular/common";

@Directive({
  selector: "chatWidget"
})
export class ChatWidgetComponent implements OnInit{
    constructor(
      private renderer: Renderer2,
      @Inject(DOCUMENT) private document,
    ){}
  ngOnInit(): void {
    const s = this.renderer.createElement("script");
    s.type = "text/javascript";
    var code = `function initFreshChat() {       window.fcWidget.init({           token: "761b52c4-1994-41df-a761-c9cdc9002b86",           host: "https://wchat.in.freshchat.com"       });   }   function initialize(i, t) { var e; i.getElementById(t) ? initFreshChat() : ((e = i.createElement("script")).id = t, e.async = !0, e.src = "https://wchat.in.freshchat.com/js/widget.js", e.onload = initFreshChat, i.head.appendChild(e)) } function initiateCall() {initialize(document, "freshchat-js-sdk")} window.addEventListener ? window.addEventListener("load", initiateCall, !1) : window.attachEvent("load", initiateCall, !1);`;
    s.appendChild(this.document.createTextNode(code));
    this.renderer.appendChild(this.document.body, s);
  }
}