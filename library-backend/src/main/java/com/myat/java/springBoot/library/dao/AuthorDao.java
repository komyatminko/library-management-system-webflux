package com.myat.java.springBoot.library.dao;

import org.springframework.data.mongodb.repository.ReactiveMongoRepository;

import com.myat.java.springBoot.library.model.Author;

public interface AuthorDao extends ReactiveMongoRepository<Author, String> {

}
