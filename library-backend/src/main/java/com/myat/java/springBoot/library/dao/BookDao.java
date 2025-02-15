package com.myat.java.springBoot.library.dao;

import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;

import com.myat.java.springBoot.library.model.Book;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface BookDao extends ReactiveMongoRepository<Book, String>{
	
	@Query("{$text: {$search: ?0}}")
	Flux<Book> findAllBooksByText(String keyword);
	
	@Query("{'name': {$regex: ?0, $options: 'i'}}")
	Flux<Book> findAllBooksByTextRegx(String keyword);

	public Mono<Book> findByName(String name);
	
	
}
