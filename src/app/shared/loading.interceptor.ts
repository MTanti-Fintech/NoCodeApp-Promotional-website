import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoaderService } from '../pages/miscellaneous/loader/loader.service';
import { finalize } from 'rxjs/operators';


@Injectable()
export class LoaderInterceptor implements HttpInterceptor {

  activeRequests = 0;

  /**
   * URLs for which the loading screen should not be enabled
   */
  skipUrls = [
     ];

  constructor(private loadingScreenService: LoaderService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let displayLoadingScreen = true;

    for (const skipUrl of this.skipUrls) {
      if (new RegExp(skipUrl).test(request.url)) {
        displayLoadingScreen = false;
        break;
      }
    }

    if (displayLoadingScreen) {
      if (this.activeRequests === 0) {
        this.loadingScreenService.startLoading();
      }
      this.activeRequests++;

      return next.handle(request).pipe(
        finalize(() => {
          this.activeRequests--;
          if (this.activeRequests === 0) {
            this.loadingScreenService.stopLoading();
          }
        })
      )
    } else {
      return next.handle(request);
    }
  };
}
