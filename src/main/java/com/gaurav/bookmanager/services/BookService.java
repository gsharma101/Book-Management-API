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

    public Book update(Long id, Book update) {
        Book existing = findById(id);
        if (update.getTitle() != null) existing.setTitle(update.getTitle());
        if (update.getAuthor() != null) existing.setAuthor(update.getAuthor());
        return repo.save(existing);
    }

    public void delete(Long id) {
        Book existing = findById(id);
        repo.delete(existing);
    }
}
