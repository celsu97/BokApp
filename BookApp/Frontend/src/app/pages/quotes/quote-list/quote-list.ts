import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuoteService } from '../../../core/quote';
import { Quote } from '../../../models/quote.model';

@Component({
  selector: 'app-quote-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './quote-list.html',
  styleUrl: './quote-list.scss',
})
export class QuoteList implements OnInit {
  quotes: Quote[] = [];
  newQuote: Quote = { text: '', author: '' };
  editingId: number | null = null;
  editBuffer: Quote = { text: '', author: '' };

  constructor(private quoteService: QuoteService) {}

  ngOnInit(): void {
    this.loadQuotes();
  }

  loadQuotes(): void {
    this.quoteService.getQuotes().subscribe({
      next: (data) => this.quotes = data,
      error: (err) => console.error('Kunde inte hämta citat:', err)
    });
  }

  addQuote(): void {
    if (!this.newQuote.text.trim()) return;

    this.quoteService.createQuote(this.newQuote).subscribe({
      next: () => {
        this.newQuote = { text: '', author: '' };
        this.loadQuotes();
      },
      error: (err) => console.error('Kunde inte lägga till citat:', err)
    });
  }

  startEdit(quote: Quote): void {
    this.editingId = quote.id!;
    this.editBuffer = { ...quote };
  }

  cancelEdit(): void {
    this.editingId = null;
  }

  saveEdit(id: number): void {
    this.quoteService.updateQuote(id, this.editBuffer).subscribe({
      next: () => {
        this.editingId = null;
        this.loadQuotes();
      },
      error: (err) => console.error('Kunde inte uppdatera citat:', err)
    });
  }

  deleteQuote(id: number): void {
    if (confirm('Är du säker på att du vill radera detta citat?')) {
      this.quoteService.deleteQuote(id).subscribe({
        next: () => this.loadQuotes(),
        error: (err) => console.error('Kunde inte radera citat:', err)
      });
    }
  }
}
