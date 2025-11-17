package com.gaurav.bookmanager.repositories;

import com.gaurav.bookmanager.entities.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    // add custom queries here if needed later
}
