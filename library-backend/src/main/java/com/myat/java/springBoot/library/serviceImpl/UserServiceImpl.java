package com.myat.java.springBoot.library.serviceImpl;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.myat.java.springBoot.library.dao.AuthorDao;
import com.myat.java.springBoot.library.dao.BookDao;
import com.myat.java.springBoot.library.dao.BorrowingDao;
import com.myat.java.springBoot.library.dao.UserDao;
import com.myat.java.springBoot.library.dto.BorrowedBookDto;
import com.myat.java.springBoot.library.dto.UserDto;
import com.myat.java.springBoot.library.exception.AuthorNotFoundException;
import com.myat.java.springBoot.library.exception.BookDetailsNotFoundException;
import com.myat.java.springBoot.library.model.Borrowing;
import com.myat.java.springBoot.library.model.User;
import com.myat.java.springBoot.library.service.UserService;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
@Service
public class UserServiceImpl implements UserService{

	@Autowired
	private UserDao userDao;
	
	@Autowired
	private BookDao bookDao;
	
	@Autowired
	private AuthorDao authorDao;
	
	@Autowired
	private BorrowingDao borrowingDao;
	
	ModelMapper modelMapper = new ModelMapper();
	
	@Override
	public Flux<UserDto> getAllUsers() {
		
		return this.userDao.findAll()
				.map(user -> this.modelMapper.map(user, UserDto.class))
				.flatMap(userDto -> this.getBorrowedBooksDto(userDto.getId())
									.map(books -> {
										userDto.setBorrowedBooks(books);
										return userDto;  
									})
				);
	}
	
	private Mono<List<BorrowedBookDto>> getBorrowedBooksDto(String userId){
		Flux<Borrowing> borrowings = this.borrowingDao.findByUserId(userId)
										.switchIfEmpty(Mono.empty());
		Mono<List<BorrowedBookDto>> borrowedBooksList = borrowings
			.flatMap(borrowing -> 
									 this.bookDao.findById(borrowing.getBookId())
									 		.switchIfEmpty(Mono.error(new BookDetailsNotFoundException("Book not found.")))
											.flatMap(bookEntity -> this.authorDao.findById(bookEntity.getAuthor().getId())
																	.switchIfEmpty(Mono.error(new AuthorNotFoundException("Author not found.")))
																	.map(authorEntity -> new BorrowedBookDto(bookEntity.getId(), 
																											bookEntity.getName(), 
																											authorEntity.getFirstName() + " " + authorEntity.getLastName(), 
																											borrowing.getIssueDate(), 
																											borrowing.getReturnDate(), 
																											borrowing.getIsOverdue())
																	)
											)
				
				
		)
		.collectList();
		
		return borrowedBooksList;
	}

	@Override
	public Mono<UserDto> saveUser(UserDto userDto) {
		System.out.println("incoming user is " + userDto);
		User user = this.modelMapper.map(userDto, User.class);
		return this.userDao.save(user)
				.map(userEntity-> this.modelMapper.map(userEntity, UserDto.class));
				
	}


	



}
