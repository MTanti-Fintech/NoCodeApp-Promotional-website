import { BrowserModule } from "@angular/platform-browser";
import { NgModule, ErrorHandler } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { Utility } from "./shared/Utility";
import { HomeComponent } from "./pages/home/home.component";
import { ContactUsComponent } from "./pages/contact-us/contact-us.component";
import { FaqPopupComponent } from "./pages/contact-us/contact-us.component";
import { ToastrModule } from "ngx-toastr";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatButtonModule } from "@angular/material/button";
import { MAT_SNACK_BAR_DATA } from "@angular/material/snack-bar";
import { MatInputModule } from "@angular/material/input";
import { MatPasswordStrengthModule } from "@angular-material-extensions/password-strength";
import { MatConfirmDialogComponent } from "./shared/mat-confirm-dialog/mat-confirm-dialog.component";
import { PasswordConfirmDialogComponent } from "./shared/password-confirm-dialog/password-confirm-dialog.component";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from "ng-pick-datetime";
import { NgxTrimDirectiveModule } from "ngx-trim-directive";
import { GlobalErrorHandler } from "src/GlobalErrorHandler";
import { ChartsModule } from "ng2-charts";

// For scrolling inside the page
import { LoaderComponent } from "./pages/miscellaneous/loader/loader.component";
import { NgxPageScrollModule } from "ngx-page-scroll";

import { MaterialModule } from "src/material-modules";
import { DeleteConfirmationDialogComponent } from "./shared/delete-confirmation-dialog/delete-confirmation-dialog.component";
import { AppHttpInterceptor } from "./shared/http.interceptor";
import { HttpCancelService } from "./shared/httpcancel.service";
import { ManageHttpInterceptor } from "./shared/managehttp.interceptor";
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
import { CarouselModule } from "ngx-owl-carousel-o";
import { LoaderInterceptor } from "./shared/loading.interceptor";
import { NgCircleProgressModule } from "ng-circle-progress";
import { TrackScollDirective } from "./shared/track-scoll.directive";
import { SoftwareFilterPipe } from "./shared/softwareSearch.pipe";
import { StaticSearchPipe } from "./shared/static-search.pipe";
import { HighlightOnFilterPipe } from "./shared/highlight-on-filter.pipe";
import { SuccesfulInvoicePopupComponent } from "./shared/succesful-invoice-popup/succesful-invoice-popup.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { NgxFreshChatModule } from "ngx-freshchat";
import {
  CounterTickDown,
  FormatTimePipe,
} from "./shared/counter-tick-down/counter-tick-down.component";
import { ChatWidgetComponent } from "./shared/chat-widget/chat-widget.directive";
import { FocusElementDirective } from "./shared/focus-element.directive";
import { ConfirmPopUpComponent } from './pages/confirm-pop-up/confirm-pop-up.component';
import { OfficebcpFooterComponent } from './shared/officebcp-footer/officebcp-footer.component';

@NgModule({
  declarations: [
    AppComponent,
    
    HomeComponent,
    // ChangePassPopupComponent,
    MatConfirmDialogComponent,
    PasswordConfirmDialogComponent,
    
    ContactUsComponent,
    ConfirmPopUpComponent,
    LoaderComponent,
    OfficebcpFooterComponent,
    FaqPopupComponent,
    
    DeleteConfirmationDialogComponent,
    TrackScollDirective,
    SoftwareFilterPipe,
    StaticSearchPipe,
    HighlightOnFilterPipe,
    SuccesfulInvoicePopupComponent,
    CounterTickDown,
    FormatTimePipe,
    ChatWidgetComponent,
    FocusElementDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgxFreshChatModule,
    // MatDialogModule,
    MatFormFieldModule,
    // MatIconModule,
    // MatSnackBarModule,
    MatInputModule,
    // MatSelectModule,
    MatPasswordStrengthModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NgxTrimDirectiveModule,
    // MatMomentDateModule,
    // MatCheckboxModule,
    // MatSidenavModule,
    // MatTabsModule,
    // MatTableModule,
    // MatPaginator,
    // MatSort,
    // MatTableDataSource,
    // MatPaginatorModule,
    // MatSortModule,
    // SelectionModel,
    // MatExpansionModule,
    NgxPageScrollModule,
    // MatDatepickerModule,
    // MatSlideToggleModule,
    // MatMenuModule,
    // MatDatepickerModule,
    // MatSlideToggleModule,
    // MatMenuModule,
    // MatTooltipModule,
    MaterialModule,
    NgxMaterialTimepickerModule,
    ChartsModule,
    CarouselModule,
    NgCircleProgressModule.forRoot({}),
  ],
  exports: [MatButtonModule, MatInputModule],
  providers: [
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    },
    {
      provide: MAT_SNACK_BAR_DATA,
      useValue: {},
    },
    Utility,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppHttpInterceptor,
      multi: true,
    },
    
    SoftwareFilterPipe,
    
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ConfirmPopUpComponent,
    ContactUsComponent,
    PasswordConfirmDialogComponent,
    
    FaqPopupComponent,
    
    DeleteConfirmationDialogComponent,
    MatConfirmDialogComponent,
    SuccesfulInvoicePopupComponent,
  ],
})
export class AppModule {}
