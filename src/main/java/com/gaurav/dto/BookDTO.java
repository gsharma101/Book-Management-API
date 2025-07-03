package com.gaurav.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookDTO {
    private Long id;
    private String title;
    private String author;
    private double price;
}
