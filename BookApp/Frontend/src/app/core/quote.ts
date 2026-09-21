import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Quote } from '../models/quote.model';

@Injectable({
  providedIn: 'root',
})
export class QuoteService {
  private apiUrl = 'https://bokapp.onrender.com/api/quotes';

  constructor(private http: HttpClient) {}

  getQuotes(): Observable<Quote[]> {
    return this.http.get<Quote[]>(this.apiUrl);
  }

  createQuote(quote: Quote): Observable<Quote> {
    return this.http.post<Quote>(this.apiUrl, quote);
  }

  updateQuote(id: number, quote: Quote): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, quote);
  }

  deleteQuote(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
