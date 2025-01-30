package com.myat.java.springBoot.library.dao;

import org.springframework.data.mongodb.repository.ReactiveMongoRepository;

import com.myat.java.springBoot.library.model.Book;
import com.myat.java.springBoot.library.model.BookDetails;

public interface BookDetailsDao extends ReactiveMongoRepository<BookDetails, String> {

}
