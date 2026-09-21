import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookService } from '../../../core/book';
import { Book } from '../../../models/book.model';

@Component({
  selector: 'app-book-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './book-list.html',
  styleUrl: './book-list.scss',
})
export class BookList implements OnInit {
  books: Book[] = [];

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.bookService.getBooks().subscribe({
      next: (data) => this.books = data,
      error: (err) => console.error('Kunde inte hämta böcker:', err)
    });
  }

  deleteBook(id: number): void {
    if (confirm('Är du säker på att du vill radera denna bok?')) {
      this.bookService.deleteBook(id).subscribe({
        next: () => this.loadBooks(),
        error: (err) => console.error('Kunde inte radera bok:', err)
      });
    }
  }
}
