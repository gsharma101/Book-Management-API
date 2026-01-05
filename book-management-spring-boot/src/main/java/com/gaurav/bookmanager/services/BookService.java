package com.gaurav.bookmanager.services;

import com.gaurav.bookmanager.entities.Book;
import com.gaurav.bookmanager.repositories.BookRepository;
import com.gaurav.bookmanager.utils.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class BookService {

    private final BookRepository repo;

    public BookService(BookRepository repo) {
        this.repo = repo;
    }

    public Book create(Book book) {
        return repo.save(book);
    }

    public List<Book> findAll() {
        return repo.findAll();
    }

    public Book findById(Long id) {
        return repo.findById(id).orElseThrow(() ->
                new ResourceNotFoundException("Book not found with id " + id));
    }

    public Book update(Long id, Book updatedBook) {
        Book existing = findById(id);

        existing.setTitle(updatedBook.getTitle());
        existing.setAuthor(updatedBook.getAuthor());
        existing.setGenre(updatedBook.getGenre());
        existing.setYear(updatedBook.getYear());
        existing.setStatus(updatedBook.getStatus());

        return repo.save(existing);
    }


    public void delete(Long id) {
        Book existing = findById(id);
        repo.delete(existing);
    }

    public void deleteAll() {
        repo.deleteAll();
    }
}
