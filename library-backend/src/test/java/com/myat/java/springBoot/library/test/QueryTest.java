package com.myat.java.springBoot.library.test;

import java.util.Date;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.myat.java.springBoot.library.dao.AuthorDao;
import com.myat.java.springBoot.library.dao.BookDao;
import com.myat.java.springBoot.library.dao.BookDetailsDao;
import com.myat.java.springBoot.library.dao.BorrowingDao;
import com.myat.java.springBoot.library.model.Author;
import com.myat.java.springBoot.library.model.Book;
import com.myat.java.springBoot.library.model.BookDetails;
import com.myat.java.springBoot.library.model.Borrowing;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

@SpringBootTest
public class QueryTest {

	@Autowired
	BookDao bookDao;
	
	@Autowired
	AuthorDao authorDao;
	
	@Autowired
	BookDetailsDao detailsDao;
	
	@Autowired
	BorrowingDao borrowingDao;
//	@Test
//	void RetrieveTest() {
//		Flux<Book> books = this.bookDao.findAllBooks();
//		books.subscribe(book -> System.out.println(book));
//	}
	
//	@Test
//	void borrowingTest() {
//		String userId = "67978e5bc6c8e2529fb09dc9"; //user one
//		String bookId = "67a1be39ff865a2ae9addc9a"; //book three
//		Date issueDate = new Date(2025,2,1);
//		Date returnDate = new Date(2025,2,6);
//		Boolean isOverdue = false;
//		
//		Borrowing borrowing = new Borrowing(userId, bookId, issueDate, returnDate, isOverdue);
//		Mono<Borrowing> entity = this.borrowingDao.save(borrowing);
//		StepVerifier.create(entity)
//        .expectNextMatches(savedEntity -> savedEntity.getUserId().equals(userId))
//        .verifyComplete();
//
//	}
	
	@Test
	void borrowingTest() {
		String id = "67978e5bc6c8e2529fb09dc9";
		this.borrowingDao.findByUserId(id).subscribe(borrowing -> System.out.println(borrowing));
	}
	
//	@Test
//	void borrowingTest() {
//		String bookId = "67ac8e9692d3da0a8efc9c58"; 
//		
//		Mono<Book> book = this.bookDao.findById(bookId);
//		book.subscribe(b ->  {
//			b.setName("book one update");
//			b.getAuthor().setLastName("author one update");
//			b.getBookDetails().setDetails("book one detail update");
//			System.out.println(b);
//			this.authorDao.save(b.getAuthor());
//			this.detailsDao.save(b.getBookDetails());
//			this.bookDao.save(b);
//		});
		
//		Date birthday = new Date(2000,2,6);
//		Author author = new Author();
//		author.setFirstName("test");
//		author.setLastName("one");
//		author.setBirthday(birthday);
//		Mono<Author> entity = this.authorDao.save(author);
		
		
//		Flux<Book> entity = this.bookDao.saveAll(book);
//		String id = "67ad86d2701cdd65e21181e6";
//		Mono<Author> result = authorDao.findById(id)
//                .flatMap(author -> {
//                    author.setLastName("1");
//                    return authorDao.save(author);
//                });
//		
//		StepVerifier.create(result)
//					.expectNextMatches(savedEntity -> savedEntity.getLastName().equals("1"))
//					.verifyComplete();
//	}
}
