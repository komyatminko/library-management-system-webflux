package com.myat.java.springBoot.library.controller.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.myat.java.springBoot.library.dao.BookDao;
import com.myat.java.springBoot.library.dto.BookDto;
import com.myat.java.springBoot.library.exception.BookNotFoundException;
import com.myat.java.springBoot.library.model.Book;
import com.myat.java.springBoot.library.response.ApiResponse;
import com.myat.java.springBoot.library.service.BookService;

import jakarta.validation.Valid;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/v1/books")
public class BookController {

	@Autowired
	BookService bookService;
	
	@GetMapping("/findAllBooks")
	public ResponseEntity<Flux<ApiResponse>> getAllBooks() {
	    Flux<BookDto> books = this.bookService.getAllBook();

	    return ResponseEntity.ok()
	            .body(books.map(book -> ApiResponse.success("Books have been retrieved successfully.", 200, book)));
	}

	@GetMapping("/findBookBy/{id}")
	public Mono<ResponseEntity<ApiResponse>> getBookById(@PathVariable String id){
		
		return this.bookService.getBookById(id)
				.map(book -> {
					return ResponseEntity.ok().body(ApiResponse.success("Book retrieved successfully.", 200, book));
				})
				.onErrorResume(BookNotFoundException.class,err -> {
					return Mono.just(ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(404, "Book not found.", err.getMessage())));
				});
		
	}
	
	@GetMapping("/findBy")
	public Mono<ResponseEntity<ApiResponse>> getBookByName(@RequestParam String name){
		
		return this.bookService.getBookByName(name)
				.map(book -> {
					return ResponseEntity.ok().body(ApiResponse.success("Book retrieved successfully.", 200, book));
				})
				.onErrorResume(BookNotFoundException.class,err -> {
					return Mono.just(ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(404, "Book not found", err.getMessage())));
				});
		
	}
	
	@GetMapping("/findBookByWithBorrowedUsers/{id}")
	public Mono<ResponseEntity<ApiResponse>> getBookByIdWithBorrowedUsers(@PathVariable String id){
		
		return this.bookService.getBookByIdWithBorrowedUsers(id)
				.map(book -> {
					return ResponseEntity.ok().body(ApiResponse.success("Book retrieved successfully.", 200, book));
				})
				.onErrorResume(BookNotFoundException.class,err -> {
					return Mono.just(ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(404, "Book not found.", err.getMessage())));
				});
		
	}
	
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
