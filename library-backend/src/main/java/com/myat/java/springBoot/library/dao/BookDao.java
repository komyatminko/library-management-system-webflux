package com.myat.java.springBoot.library.dao;

import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;

import com.myat.java.springBoot.library.model.Book;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface BookDao extends ReactiveMongoRepository<Book, String>{

	public Mono<Book> findByName(String name);
	
	
}
