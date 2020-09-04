import { AppComponent } from './../app.component';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap, catchError } from 'rxjs/operators';
import { Observable, throwError, of, Subject } from 'rxjs';
import { CommonService } from './common.service';
import { Router } from '@angular/router';
import { CookieService } from './cookie.service';

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {
    private cancelPendingRequests$ = new Subject<void>()
    constructor(private commonser: CommonService, private router: Router,
        private Cookie: CookieService, ) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(req).pipe(
            tap(() => { }),
            catchError(err => {
                if (err instanceof HttpErrorResponse) {
                    try {
                        if (err.status === 503) {
                            // tslint:disable-next-line: max-line-length
                            this.commonser.openSnackBarError('There is some temporary error on the server. Please try again or let us know if the error persist.', 'X');
                            throwError(err);
                        } else if (err.status === 404) {
                            // tslint:disable-next-line: max-line-length
                            this.commonser.openSnackBarError('The resource you are looking for is not available on the server. Please try again or let us know if the error persist.', 'X');
                            throwError(err);

                        } else if (err.status === 401 && err.error && err.error.message) {
                            this.Cookie.clearCookies();
                            this.router.navigate(['/login']);
                            // this.commonser.openSnackBarError(err.error.message, 'X');
                            CommonService.GlobalVar = [];
                            throwError(err);
                        } else if (err.status === 502) {
                            this.commonser.openSnackBarError('Bad Gateway.', 'X');
                            throwError(err);

                        } else if (err.status === 401) {
                            this.router.navigate(['/login']);
                            this.Cookie.clearCookies();
                            CommonService.GlobalVar = [];
                        }
                        else{
                            console.log("error");
                            this.commonser.openSnackBarError('Something went wrong ! Please try again or let us know if the error persist.', 'X');
                                throwError(err);

                        }
                    } catch (e) {
                        throwError(e);

                    }
                }
                return of(err);
            })
        );

    }
}
