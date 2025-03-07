package com.myat.java.springBoot.library.controller.rest;

import java.io.IOException;
import java.util.Collections;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

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
	
	@GetMapping
	public ResponseEntity<Flux<ApiResponse>> getAllBooks() {
	    Flux<BookDto> books = this.bookService.getAllBook();

	    return ResponseEntity.ok()
	            .body(books.map(book -> ApiResponse.success("Books have been retrieved successfully.", 200, book)));
	}
	
	@GetMapping("/limit")
	public Mono<ResponseEntity<ApiResponse>> getBooksWithLimit(
							@RequestParam(value = "page", defaultValue = "0") int page,
						    @RequestParam(value = "size", defaultValue = "10") int size) {
	    Flux<BookDto> books = this.bookService.getBooksWithLimit(page, size);
	    Mono<Long> totalBooks = this.bookService.getTotalBookCount();

	    return totalBooks.flatMap(count -> {
	        return books.collectList().map(bookList -> 
	            ApiResponse.success("10 books have been retrieved successfully.", 200, 
	                Map.of(
	                    "bookList", bookList, 
	                    "collectionSize", count // Include total count
	                )
	            )
	        );
	    }).map(response -> ResponseEntity.ok().body(response));
	}
	
	@GetMapping("/find")
	public Flux<BookDto> getAllBooksByKeyword(@RequestParam("keyword") String keyword){
		return this.bookService.searchBooks(keyword);
	}

	@GetMapping("/{id}")
	public Mono<ResponseEntity<ApiResponse>> getBookById(@PathVariable String id){
		
		return this.bookService.getBookById(id)
				.map(book -> {
					return ResponseEntity.ok().body(ApiResponse.success("Book retrieved successfully.", 200, book));
				})
				.onErrorResume(BookNotFoundException.class,err -> {
					return Mono.just(ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(404, "Book not found.", err.getMessage())));
				});
		
	}
	
//	@GetMapping
//	public Mono<ResponseEntity<ApiResponse>> getBookByName(@RequestParam String name){
//		
//		return this.bookService.getBookByName(name)
//				.map(book -> {
//					return ResponseEntity.ok().body(ApiResponse.success("Book retrieved successfully.", 200, book));
//				})
//				.onErrorResume(BookNotFoundException.class,err -> {
//					return Mono.just(ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(404, "Book not found", err.getMessage())));
//				});
//		
//	}
	
	///findBookByWithBorrowedUsers
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
		System.out.println("save controller method");
		return this.bookService.saveBook(bookDto)
				.map(savedBook -> {
					return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Book saved successfully.", 201, savedBook));
				});
//				.onErrorResume(BookNotFoundException.class,err -> {
//					return Mono.just(ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(404, "Book not found.", err.getMessage())));
//				});
		
	}
	
	@PutMapping("/{id}")
	public Mono<ResponseEntity<ApiResponse>> updateBook(@Valid @RequestBody BookDto bookDto){
		return this.bookService.updateBook(bookDto)
				.map(updatedBook -> ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success("Book updated successfully.", 200, updatedBook)))
				.onErrorResume(BookNotFoundException.class,err -> {
					return Mono.just(ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(404, "Book not found to update.", err.getMessage())));
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
	
	//for saving book cover before saving a new book
	@PostMapping(value = "/upload/bookCover", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Mono<Map<String, String>> uploadBookCover(@RequestPart("file") FilePart file) {
		System.out.println("upload method controller");
        return bookService.uploadImage(file, "books")
                .map(url -> Collections.singletonMap("imgUrl", url));
    }
	
	//delete method to remove image from local folder
	@DeleteMapping("/delete/bookCover")
    public Mono<Map<String, String>> deleteBookCover(@RequestParam("filePath") String filePath) {
		System.out.println("delete book cover controller");
		System.out.println(filePath);
        return this.bookService.deleteImage(filePath)
                .map(deleted -> deleted ? "File deleted successfully" : "File not found")
                .map(message -> Collections.singletonMap("message", message));
    }
	
}
