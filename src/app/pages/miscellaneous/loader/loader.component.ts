import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy } from '@angular/core';
import { LoaderService } from './loader.service';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
    selector: 'app-loading-screen',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements AfterViewInit, OnDestroy {
    debounceTime = 200;
    loading = false;
    loadingSubscription: Subscription;

    constructor(private loadingScreenService: LoaderService,
                private elmRef: ElementRef,
                private changeDetectorRef: ChangeDetectorRef) {
    }

    ngAfterViewInit(): void {
        this.elmRef.nativeElement.style.display = 'none';
        this.loadingSubscription = this.loadingScreenService.loadingStatus.pipe(debounceTime(this.debounceTime)).subscribe(
            (status: boolean) => {
                this.elmRef.nativeElement.style.display = status ? 'block' : 'none';
                this.changeDetectorRef.detectChanges();
            }
        );
    }

    ngOnDestroy() {
        this.loadingSubscription.unsubscribe();
    }

}