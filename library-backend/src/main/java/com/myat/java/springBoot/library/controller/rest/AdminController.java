package com.myat.java.springBoot.library.controller.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.myat.java.springBoot.library.dto.BookDto;
import com.myat.java.springBoot.library.exception.BookNotFoundException;
import com.myat.java.springBoot.library.response.ApiResponse;
import com.myat.java.springBoot.library.service.BookService;

import jakarta.validation.Valid;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/admin/books")
public class AdminController {
	
	@Autowired
	BookService bookService;
	
	@PostMapping("/save")
	public Mono<ResponseEntity<ApiResponse>> saveBook(@Valid @RequestBody BookDto bookDto){
		return this.bookService.saveBook(bookDto)
				.map(savedBook -> {
					return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Book saved successfully.", 201, savedBook));
				});
		
	}
	
	@DeleteMapping("/delete/{bookId}")
	public Mono<ResponseEntity<ApiResponse>> deleteBookById(@PathVariable String bookId){
		return this.bookService.deleteBookById(bookId)
				.map(savedBook -> {
					return ResponseEntity.status(HttpStatus.ACCEPTED).body(ApiResponse.success("Book saved successfully.", 204, savedBook));
				})
				.onErrorResume(BookNotFoundException.class,err -> {
					return Mono.just(ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(404, "Book not found to delete.", err.getMessage())));
				});
		
	}
}
