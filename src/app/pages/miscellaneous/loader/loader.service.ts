import { Injectable } from '@angular/core';
import { Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class LoaderService {

    private isLoading = false;
    loadingStatus: Subject<boolean> = new Subject();

    get loading(): boolean {
        return this.isLoading;
    }

    set loading(value) {
        this.isLoading = value;
        this.loadingStatus.next(value);
    }

    startLoading() {
        this.loading = true;
    }

    stopLoading() {
        this.loading = false;
    }
}