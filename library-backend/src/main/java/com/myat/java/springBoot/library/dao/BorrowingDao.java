package com.myat.java.springBoot.library.dao;

import org.springframework.data.mongodb.repository.ReactiveMongoRepository;

import com.myat.java.springBoot.library.model.Borrowing;

import reactor.core.publisher.Flux;

public interface BorrowingDao extends ReactiveMongoRepository<Borrowing, String>{

	Flux<Borrowing> findByBookId(String bookId);
	
}
