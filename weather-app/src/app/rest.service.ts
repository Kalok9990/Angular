import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  endpoint = 'http:localhost:3000/api/v1/';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  private extractData(res: Response){
    let body = res;
    return body || { };
  }

  getProducts(): Observable<any> {
    return this.http.get(this.endpoint + 'products/').pipe(map(this.extractData));
  }

  getProduct(id): Observable<any> {
    return this.http.get(this.endpoint + 'products/' + id).pipe(map(this.extractData));
  }

  addProduct (product): Observable<any> {
    console.log(product);
    return this.http.post<any>(this.endpoint + 'products', JSON.stringify(product), this.httpOptions).pipe(tap(_ => console.log(`added product w/ id=${product.id}`)),
    catchError(this.handleError<any>(`updateProduct`))
    );
  }

  updateProduct (id, product): Observable<any> {
    return this.http.put(this.endpoint + 'products/' + id, JSON.stringify(product), this.httpOptions).pipe(tap(_ => console.log(`updated product id=${id}`)),
      catchError(this.handleError<any>('updateProduct'))
    );
  }

  deleteProduct (id): Observable<any> {
    return this.http.delete<any>(this.endpoint + 'products/' + id, this.httpOptions).pipe(tap(_=> console.log(`deleted product id=${id}`)),
    catchError(this.handleError<any>('deleteProduct'))
    )
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error);
      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result
      return of(result as T);
    }
  }

}
