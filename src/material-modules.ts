import { environment } from 'src/environments/environment';
import { AlphabetOnlyDirective } from './app/shared/alphabet-only.directive';
import { NgModule, ErrorHandler } from '@angular/core';
// import { OwlMomentDateTimeModule } from 'ng-pick-datetime-moment';
const config = environment
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/Input';
import { MatNativeDateModule, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

import { MatDialogModule } from '@angular/material/dialog';
import { ScrollDirective } from './app/shared/scroll.directive';
import { NumberDirective } from './app/shared/number-only.directive';
import { DecimalDirective } from './app/shared/Decimal-only.directive';
import { MatPasswordStrengthModule } from '@angular-material-extensions/password-strength';
import { GlobalErrorHandler } from './GlobalErrorHandler';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { OWL_DATE_TIME_FORMATS } from 'ng-pick-datetime';
import { ValidNumber } from './app/shared/numbervalid-directive';
import { AlphaNumericDirective } from './app/shared/alpha-numeric.directive';
import { AutofocusDirective } from './app/shared/auto-focus.directive';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NumberCommaDirective } from './app/shared/number-comma.directive';
import { MatMenuModule } from '@angular/material/menu';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

@NgModule({

    declarations: [
        ScrollDirective,
        NumberDirective,
        NumberCommaDirective,
        DecimalDirective,
        AlphabetOnlyDirective,
        AlphaNumericDirective,
        ValidNumber,
        AutofocusDirective,
    ],

    imports: [

        DragDropModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatDialogModule,
        MatExpansionModule,
        MatIconModule,
        MatInputModule,
        MatNativeDateModule,
        MatPaginatorModule,
        MatRadioModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatSortModule,
        MatTableModule,
        MatTooltipModule,
        NgxTrimDirectiveModule,
        // OwlMomentDateTimeModule,
        MatMenuModule,
        MatStepperModule,
        MatSidenavModule,
        MatListModule
    ],

    providers: [
        { provide: ErrorHandler, useClass: GlobalErrorHandler },
        {
            provide: MatMomentDateModule,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE]
        },
        {
            provide: MAT_DATE_FORMATS,
            useValue: {
                parse: {
                    dateInput: 'LL',
                },
                display: {
                    dateInput: config.DateFormat,
                    monthYearLabel: 'MMM YYYY',
                },
            },
        },
        {
            provide: OWL_DATE_TIME_FORMATS, useValue: {
                parseInput: config.DateTimeFormat,
                fullPickerInput: config.DateTimeFormat,
                datePickerInput: config.DateFormat,
                timePickerInput: config.TimeFormat,
                monthYearLabel: 'MMM YYYY',
            },
        },

    ],

    exports: [

        MatTabsModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatDialogModule,
        MatExpansionModule,
        MatIconModule,
        MatInputModule,
        MatNativeDateModule,
        MatPaginatorModule,
        MatRadioModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        MatSortModule,
        MatTableModule,
        MatTooltipModule,
        ScrollDirective,
        NumberDirective,
        NumberCommaDirective,
        DecimalDirective,
        MatPasswordStrengthModule,
        NgxTrimDirectiveModule,
        AlphabetOnlyDirective,
        AlphaNumericDirective,
        ValidNumber,
        AutofocusDirective,
        MatMenuModule,
        DragDropModule,
        MatStepperModule,
        MatSidenavModule,
        MatListModule
    ]

})

export class MaterialModule { }
