package com.myat.java.springBoot.library.serviceImpl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.myat.java.springBoot.library.dao.AuthorDao;
import com.myat.java.springBoot.library.dao.BookDao;
import com.myat.java.springBoot.library.dao.BookDetailsDao;
import com.myat.java.springBoot.library.dao.BorrowingDao;
import com.myat.java.springBoot.library.dao.UserDao;
import com.myat.java.springBoot.library.dto.AuthorDto;
import com.myat.java.springBoot.library.dto.BookDetailsDto;
import com.myat.java.springBoot.library.dto.BookDto;
import com.myat.java.springBoot.library.dto.BorrowedUserDto;
import com.myat.java.springBoot.library.exception.AuthorNotFoundException;
import com.myat.java.springBoot.library.exception.BookDetailsNotFoundException;
import com.myat.java.springBoot.library.exception.BookNotFoundException;
import com.myat.java.springBoot.library.exception.BorrowingNotFoundException;
import com.myat.java.springBoot.library.model.Author;
import com.myat.java.springBoot.library.model.Book;
import com.myat.java.springBoot.library.model.BookDetails;
import com.myat.java.springBoot.library.model.BorrowedUser;
import com.myat.java.springBoot.library.model.Borrowing;
import com.myat.java.springBoot.library.model.User;
import com.myat.java.springBoot.library.response.ApiResponse;
import com.myat.java.springBoot.library.service.BookService;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class BookServiceImpl implements BookService{

	@Autowired
	BookDao bookDao;
	
	@Autowired
	BookDetailsDao detailsDao;
	
	@Autowired
	AuthorDao authorDao;
	
	@Autowired
	BorrowingDao borrowingDao;
	
	@Autowired
	UserDao userDao;
	
	ModelMapper modelMapper = new ModelMapper();
	private static final String BASE_UPLOAD_DIR = "images/uploads/";
	
	@Override
	public Flux<BookDto> getAllBook() {
		
		return this.bookDao.findAll()
//				.flatMap(book -> Mono.zip(this.detailsDao.findById(book.getBookDetails().getId()), 
//											this.authorDao.findById(book.getAuthor().getId()))
//								.map(tuple -> {
//									book.setBookDetails(tuple.getT1());
//									book.setAuthor(tuple.getT2());
//									return book;
//								})
//				)
				.map(book -> this.bookEntityToDto(book))
				.flatMap(bookDto -> this.getBorrowedUsersDto(bookDto.getId())
									.map(users -> {
										bookDto.setBorrowedBy(users);  
										return bookDto;  
									})
				);
		
	}	
	
	@Override
	public Mono<BookDto> getBookById(String id) {
		Mono<List<BorrowedUserDto>> userList = getBorrowedUsersDto(id);
		return this.bookDao.findById(id)
				.switchIfEmpty(Mono.error(new BookNotFoundException("Failed to retrieve book by id.")))
				.map(book -> this.bookEntityToDto(book))
				.flatMap(bookDto ->
							userList.map(users -> {
								bookDto.setBorrowedBy(users);  
								return bookDto;  
							})
				);
	}

	@Override
	public Mono<BookDto> getBookByName(String name) {
		
		return this.bookDao.findByName(name)
				.switchIfEmpty(Mono.error(new BookNotFoundException("Failed to retrieve book by name.")))
				.map(book -> this.bookEntityToDto(book));
	}
	
	@Override
	public Mono<BookDto> getBookByIdWithBorrowedUsers(String id) {
		Mono<Book> bookEntity = this.bookDao.findById(id).switchIfEmpty(Mono.error(new BookNotFoundException("Book not found.")));
		Mono<List<BorrowedUserDto>> userList = getBorrowedUsersDto(id);
		
		Mono<BookDto> dto = bookEntity.map(book -> this.bookEntityToDto(book));

		return dto.flatMap(bookDto ->
		    userList.map(users -> {
		        bookDto.setBorrowedBy(users);  
		        return bookDto;  
		    })
		);


	}

	@Override
	public Mono<BookDto> saveBook(BookDto bookDto) {
		Mono<List<BorrowedUserDto>> userList = getBorrowedUsersDto(bookDto.getId());
		String uniqueBookId = this.generateBookId(bookDto.getBookDetails().getGenres(), bookDto.getName());

		bookDto.setUniqueBookId(uniqueBookId);
		Book book = this.bookDtoToEntity(bookDto);
		book.setBorrowing(new ArrayList<>());
		
		return Mono.zip(this.detailsDao.save(book.getBookDetails()), this.authorDao.save(book.getAuthor()))
				.flatMap(tuple -> {
					book.setBookDetails(tuple.getT1());
					book.setAuthor(tuple.getT2());
					return this.bookDao.save(book);	
					
				})
				.map(savedBook -> this.bookEntityToDto(savedBook))
				.flatMap(dto ->
					userList.map(users -> {
						dto.setBorrowedBy(users);  
						return dto;  
					})
				);
				
	}

	
	private Mono<List<BorrowedUserDto>> getBorrowedUsersDto(String bookId) {
		Flux<Borrowing> borrowings = this.getBorrowingByBookId(bookId);

		Mono<List<BorrowedUserDto>> userList = borrowings
												.flatMap(borrowing -> this.userDao.findById(borrowing.getUserId()) 
																		.map(user -> new BorrowedUserDto(borrowing.getId(),
																										user.getId(), 
																										user.getUsername(), 
																										borrowing.getIssueDate(),
																										borrowing.getReturnDate(), 
																										borrowing.getIsOverdue())
																		)
												)
												.collectList();
		return userList;
	}
	
	@Override
	public Mono<BookDto> updateBook(BookDto bookDto) {
		System.out.println("request body " + bookDto);
	    return this.bookDao.findById(bookDto.getId())
	            .switchIfEmpty(Mono.error(new BookNotFoundException("Book not found.")))
	            .flatMap(oldBook -> {
	                oldBook.setName(bookDto.getName());
	                oldBook.setImgUrl(bookDto.getImgUrl());
	                oldBook.setPrice(bookDto.getPrice());
	                oldBook.setBookDetails(modelMapper.map(bookDto.getBookDetails(), BookDetails.class));
	                oldBook.setAuthor(modelMapper.map(bookDto.getAuthor(), Author.class));
	                oldBook.setRating(bookDto.getRating());
	                oldBook.setTotalCount(bookDto.getTotalCount());
	                
					
	                
	               //delete borrowed user from issued book when borrowed user is deleted
		           removeBorrowedUserAndUpdateIssuedBook(bookDto, oldBook);
		           
	               //save and update borrowed user
	               updateIssuedBook(bookDto, oldBook);
	               
	               if (oldBook.getAvailableCount() == 0) {
						oldBook.setIsAvailable(false);
					} else {
						oldBook.setIsAvailable(true);
					}
	                
	               
	               
	                return this.authorDao.save(oldBook.getAuthor())  
	                        .then(this.detailsDao.save(oldBook.getBookDetails())) 
	                        .then(this.bookDao.save(oldBook)); 
	            })
	            .map(this::bookEntityToDto)
	            .flatMap(dto ->{
	            	
	            	return this.getBorrowedUsersDto(dto.getId()).map(users -> {
						dto.setBorrowedBy(users);  
						return dto;  
					});
	            }
				
			);
	}
	
	private void removeBorrowedUserAndUpdateIssuedBook(BookDto bookDto, Book oldBook) {
		if (oldBook.getBorrowing().size() > bookDto.getBorrowedBy().size()) {
			
			oldBook.setAvailableCount(oldBook.getTotalCount() - bookDto.getBorrowedBy().size());
			
			List<Borrowing> removedUsers = oldBook.getBorrowing()
					.stream()
					.filter(oldUser -> bookDto.getBorrowedBy()
												.stream()
												.noneMatch(newUser -> newUser.getId().equals(oldUser.getId()))
					)
					.collect(Collectors.toList());
		
			 Flux.fromIterable(removedUsers)
		            .flatMap(user -> this.borrowingDao.delete(user))
		            .doOnComplete(() -> {
		                oldBook.getBorrowing().removeAll(removedUsers);
		            })
		            .subscribe();
			
		}	

	}

	private void updateIssuedBook(BookDto bookDto, Book oldBook) {
		
		if(bookDto.getBorrowedBy().size() > 0 
		&& bookDto.getBorrowedBy().size() > oldBook.getBorrowing().size()
		) {
			oldBook.setAvailableCount(Math.max(0, oldBook.getAvailableCount() - 1));

			   //check whether book has borrowing in db, if not, create new list
			   if(oldBook.getBorrowing() == null || oldBook.getBorrowing().size() == 0) {
				   List<Borrowing> borrowings = new ArrayList<>();
				   
				   bookDto.getBorrowedBy().stream().forEach(user-> {
					   Borrowing borrowing = new Borrowing(user.getUserId(), oldBook.getId(), user.getIssueDate(), user.getReturnDate(), user.getIsOverdue());
					   borrowings.add(borrowing);
					   oldBook.setBorrowing(borrowings);
					   this.borrowingDao.save(borrowing).subscribe();
				   });
			   }
			   //if yes, add borrowing to existing list
			   else {
				   List<Borrowing> existingBorrowings = oldBook.getBorrowing();
				   for(BorrowedUserDto borrowedUser: bookDto.getBorrowedBy()) {
					   if(borrowedUser.getId() != null) {
						   this.borrowingDao.findByUserId(borrowedUser.getUserId())
						   		.flatMap(oldUser -> {
						   			oldUser.setId(borrowedUser.getId());
						   			oldUser.setUserId(borrowedUser.getUserId());
						   			oldUser.setBookId(bookDto.getId());
						   			oldUser.setIssueDate(borrowedUser.getIssueDate());
						   			oldUser.setReturnDate(borrowedUser.getReturnDate());
						   			oldUser.setIsOverdue(borrowedUser.getIsOverdue());
						   			return this.borrowingDao.save(oldUser);
						   		})
						   		.map(savedUser -> {
						   			existingBorrowings.removeIf(b -> b.getId().equals(savedUser.getId()));
//						   			existingBorrowings.clear();
						   			return existingBorrowings.add(savedUser);
						   		})
//						   		.then(
//						   				
//						   				this.userDao.findById(borrowedUser.getUserId())
//		        				   		.flatMap(user -> {
//		        				   			user.setUsername(borrowedUser.getUsername());
//		        				   			return this.userDao.save(user);
//		        				   		})
//						   		)
						   		.subscribe();
						   	
						   
					   }
					   else {
						   Borrowing borrowing = new Borrowing(borrowedUser.getUserId(), oldBook.getId(), borrowedUser.getIssueDate(), borrowedUser.getReturnDate(), borrowedUser.getIsOverdue());
						   existingBorrowings.add(borrowing);
						   this.borrowingDao.save(borrowing).subscribe();
					   }
				   }
			   }
			   
		   }
	}

	
	@Override
	public Mono<BookDto> deleteBookById(String id) {
		return this.getBookByIdWithBorrowedUsers(id)
				.flatMap(bookDto -> {
					return Mono
							.when(this.detailsDao.deleteById(bookDto.getBookDetails().getId()),
									this.borrowingDao.deleteByBookId(id),
									this.bookDao.deleteById(id))
							.thenReturn(bookDto);
				});
	}
	
	
	
	
	
	
	private Mono<BookDetails> getBookDetailsById(String id){
		return this.detailsDao.findById(id)
					.switchIfEmpty(Mono.error(new BookDetailsNotFoundException("Book details not found.")));
	}
	
	private Mono<Author> getAuthorById(String id){
		return this.authorDao.findById(id)
					.switchIfEmpty(Mono.error(new AuthorNotFoundException("Author not found.")));
	}
	
	private Flux<Borrowing> getBorrowingByBookId(String bookId){
		return this.borrowingDao.findByBookId(bookId)
				.switchIfEmpty(Mono.empty());
	}
	
	

	
	
	public Mono<String> uploadImage(FilePart filePart, String uploadFolderName) {
        // Generate a unique file name
        String fileName = UUID.randomUUID().toString() + "_" + filePart.filename();
        Path uploadPath = Paths.get(BASE_UPLOAD_DIR + uploadFolderName);

        // Ensure the directory exists
        return Mono.fromCallable(() -> {
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            return uploadPath;
        }).flatMap(path -> {
            Path filePath = path.resolve(fileName);
            return filePart.transferTo(filePath).thenReturn(BASE_UPLOAD_DIR + uploadFolderName + "/" + fileName);
        });
    }
	
	public Mono<Boolean> deleteImage(String filePath) {
        return Mono.fromCallable(() -> {
            Path path = Paths.get(filePath);
            if (Files.exists(path)) {
                return Files.deleteIfExists(path);
            }
            return false;
        });
    }
	
	
	
	
	
	
	private Book bookDtoToEntity(BookDto bookDto) {
		
		Book book = modelMapper.map(bookDto, Book.class);
		if(bookDto.getBookDetails() != null) {
			BookDetails details = modelMapper.map(bookDto.getBookDetails(), BookDetails.class);
			book.setBookDetails(details);
		}
		if(bookDto.getAuthor() != null) {
			Author author = modelMapper.map(bookDto.getAuthor(), Author.class);
			book.setAuthor(author);
		}
		
		return book;
	}
	
	private BookDto bookEntityToDto(Book book) {
		
		BookDto bookDto = modelMapper.map(book, BookDto.class);
		if(book.getBookDetails() != null) {
			BookDetailsDto detailsDto = modelMapper.map(book.getBookDetails(), BookDetailsDto.class);
			bookDto.setBookDetails(detailsDto);
		}
		if(book.getAuthor() != null) {
			AuthorDto authorDto = modelMapper.map(book.getAuthor(), AuthorDto.class);
			bookDto.setAuthor(authorDto);
		}
		
		return bookDto;
	}

	public String generateBookId(List<String> genres, String bookName) {
		final SecureRandom random = new SecureRandom();
        String genreCode = genres.stream()
                .map(genre -> genre.substring(0, 1).toUpperCase()) 
                .collect(Collectors.joining(""));

        String bookCode = "";
        String [] name = bookName
                .toUpperCase()
                .split(" "); 
        
        if(bookName.length() >= 7) {
        	for(String word : name) {
            	bookCode += word.charAt(0);
            }
        }
        else if(bookName.length() == 3){
        	bookCode = bookName.toUpperCase().substring(0,3);
        }
        else {
        	bookCode = bookName.toUpperCase().substring(0,1);
        }
                

        // Generate a random 3-digit number
        int randomDigits = 100 + random.nextInt(900);

        // Combine all parts
        return String.format("%s-%s-%03d", genreCode, bookCode, randomDigits);
    }

	@Override
	public Flux<BookDto> searchBooks(String keyword) {
		// TODO Auto-generated method stub
		return this.bookDao.findAllBooksByText(keyword)
				.switchIfEmpty(this.bookDao.findAllBooksByTextRegx(keyword))
				.switchIfEmpty(Mono.error(new BookNotFoundException("Book not found")))
				.map(books-> this.bookEntityToDto(books)
				);
	}


	


	

	
}
