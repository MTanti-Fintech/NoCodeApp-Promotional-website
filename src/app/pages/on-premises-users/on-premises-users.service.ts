import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'src/app/shared/cookie.service';
import { ErrorhandlerService } from 'src/app/shared/errorhandler.service';
import { environment } from 'src/environments/environment';
const rootURL = environment


@Injectable({
    providedIn: 'root'
})
export class OnPremisesUsersService {
    constructor(
        private http: HttpClient,
        private Cookie: CookieService,
    ) { }

    httpHeader = {
        headers: new HttpHeaders({
            Authorization: this.Cookie.getCookie('usertoken').toString()
        }),
    };

    onPremisesApiUrl = rootURL.APIurl.URL + '/on-premises-user';

    public getOnPremisesUsers(organizationID) {
        return this.http.get(this.onPremisesApiUrl, {
            headers: new HttpHeaders({
                Authorization: this.Cookie.getCookie('usertoken').toString()
            }),
            params: { organizationId: organizationID }
        });
    }

    
    public postOnPremisesUser(onPremisesUser) {
        return this.http.post(this.onPremisesApiUrl, onPremisesUser, this.httpHeader);
    }

    public putOnPremisesUser(onPremisesUser) {
        return this.http.put(this.onPremisesApiUrl, onPremisesUser, this.httpHeader);
    }
}
