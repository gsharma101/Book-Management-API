package com.gaurav.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data // creates getters, setters, toString, equals, hashCode
@NoArgsConstructor
@AllArgsConstructor
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String author;
    private double price;
}