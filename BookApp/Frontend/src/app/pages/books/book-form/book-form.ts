import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../../../core/book';
import { Book } from '../../../models/book.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-book-form',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './book-form.html',
  styleUrl: './book-form.scss',
})
export class BookForm implements OnInit {
  book: Book = { title: '', author: '', publishedDate: '' };
  isEditMode = false;
  bookId: number | null = null;

  constructor(
    private bookService: BookService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.bookId = +idParam;
      this.bookService.getBook(this.bookId).subscribe({
        next: (data) => {
          this.book = { ...data, publishedDate: data.publishedDate.substring(0, 10) };
        },
        error: (err) => console.error('Kunde inte hämta bok:', err)
      });
    }
  }

  onSubmit(): void {
    if (this.isEditMode && this.bookId !== null) {
      this.bookService.updateBook(this.bookId, this.book).subscribe({
        next: () => this.router.navigate(['/books']),
        error: (err) => console.error('Kunde inte uppdatera bok:', err)
      });
    } else {
      this.bookService.createBook(this.book).subscribe({
        next: () => this.router.navigate(['/books']),
        error: (err) => console.error('Kunde inte skapa bok:', err)
      });
    }
  }
}
