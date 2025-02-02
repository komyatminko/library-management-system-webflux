package com.myat.java.springBoot.library.test;

import java.util.Date;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.myat.java.springBoot.library.dao.BookDao;
import com.myat.java.springBoot.library.dao.BorrowingDao;
import com.myat.java.springBoot.library.model.Book;
import com.myat.java.springBoot.library.model.Borrowing;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

@SpringBootTest
public class QueryTest {

	@Autowired
	BookDao bookDao;
	
	@Autowired
	BorrowingDao borrowingDao;
//	@Test
//	void RetrieveTest() {
//		Flux<Book> books = this.bookDao.findAllBooks();
//		books.subscribe(book -> System.out.println(book));
//	}
	
	@Test
	void borrowingTest() {
		String userId = "6797932ec6c8e2529fb09dcf"; //user one
		String bookId = "679f396e0568f856a50323ec"; //book three
		Date issueDate = new Date(2025,2,1);
		Date returnDate = new Date(2025,2,6);
		Boolean isOverdue = false;
		
		Borrowing borrowing = new Borrowing(userId, bookId, issueDate, returnDate, isOverdue);
		Mono<Borrowing> entity = this.borrowingDao.save(borrowing);
		StepVerifier.create(entity)
        .expectNextMatches(savedEntity -> savedEntity.getUserId().equals(userId))
        .verifyComplete();

	}
}
