import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export const SOCKET = 'http://localhost:5000';
export const IMAGE = 'http://localhost:5000/uploads/profile/';
// export const SOCKET = 'http://18.116.93.143:5000';
// export const IMAGE = 'http://18.116.93.143:5000/uploads/profile/';
export const USER = 'AUTH_USER';
@Injectable({
  providedIn: 'root'
})
export class RestService {
  api = 'http://localhost:5000/api/v1/';

  httpHeader = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  create(url, credentials: any): Observable<any> {
    return this.http.post<any>(this.api + url, credentials, this.httpHeader)
      .pipe(
        catchError(this.handleError<any>('Data created'))
      );
  }

  getOne(url, id): Observable<any> {
    return this.http.get<any>(this.api + url + id)
      .pipe(
        tap(_ => console.log(`Data fetched: ${id}`)),
        catchError(this.handleError<any>(`Get one id=${id}`))
      );
  }

  getAll(url): Observable<any> {
    return this.http.get<any>(this.api + url)
      .pipe(
        tap(() => console.log('Data fetched!')),
        catchError(this.handleError<any>('Get all', []))
      );
  }

  update(url, id, credentials: any): Observable<any> {
    return this.http.put(this.api + url + id, credentials, this.httpHeader)
      .pipe(
        tap(_ => console.log(`Data updated: ${id}`)),
        catchError(this.handleError<any>('Update data'))
      );
  }

  deleteStudent(url, id): Observable<any> {
    return this.http.delete<any>(this.api + url + id, this.httpHeader)
      .pipe(
        tap(_ => console.log(`Data deleted: ${id}`)),
        catchError(this.handleError<any>('Delete data'))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

}
