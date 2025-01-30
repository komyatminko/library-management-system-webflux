package com.myat.java.springBoot.library.dao;

import org.springframework.data.mongodb.repository.ReactiveMongoRepository;

import com.myat.java.springBoot.library.model.User;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface UserDao extends ReactiveMongoRepository<User, String>{

	Mono<User> findByUsername(String username);
	
}
