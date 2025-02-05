package com.myat.java.springBoot.library.serviceImpl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.UUID;

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
	private static final String BASE_UPLOAD_DIR = "uploads/";
	
	@Override
	public Flux<BookDto> getAllBook() {
		
		return this.bookDao.findAll()
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
		
		Book book = this.bookDtoToEntity(bookDto);
		System.out.println(book);
		return Mono.zip(this.detailsDao.save(book.getBookDetails()), this.authorDao.save(book.getAuthor()))
				.flatMap(tuple -> {
					book.setBookDetails(tuple.getT1());
					book.setAuthor(tuple.getT2());
					return this.bookDao.save(book);	
					
				})
				.map(savedBook -> this.bookEntityToDto(savedBook));
				
	}
	
//	@Override
//	public Mono<BookDto> deleteBookById(String id) {
//		System.out.println("delete service");
//		return this.bookDao.findById(id)
//				.flatMap(book -> {
//					return Mono.zip(this.detailsDao.findById(book.getBookDetails().getId())
//										.switchIfEmpty(Mono.error(new BookDetailsNotFoundException("Book details not found."))), 
//									this.authorDao.findById(book.getAuthor().getId())
//										.switchIfEmpty(Mono.error(new AuthorNotFoundException("Author not found.")))
//									)
//							
//							.flatMap(tuple -> {
//								BookDetails details = tuple.getT1();
//								Author author = tuple.getT2();
//								return Mono
//										.when(this.detailsDao.deleteById(details.getId()),
//												this.authorDao.deleteById(author.getId()), 
//												this.bookDao.deleteById(id))
//										.thenReturn(this.bookEntityToDto(book));
//							});
//				});
//	}
	
	@Override
	public Mono<BookDto> deleteBookById(String id) {
		return this.getBookByIdWithBorrowedUsers(id)
				.flatMap(bookDto -> {
					return Mono
							.when(this.detailsDao.deleteById(bookDto.getBookDetails().getId()),
							this.authorDao.deleteById(bookDto.getAuthor().getId()), 
							this.borrowingDao.deleteByBookId(id),
							this.bookDao.deleteById(id))
					.thenReturn(bookDto);
				});
	}
	
	private Mono<List<BorrowedUserDto>> getBorrowedUsersDto(String id) {
		Flux<Borrowing> borrowings = this.getBorrowingByBookId(id);

		Mono<List<BorrowedUserDto>> userList = borrowings
				.flatMap(borrowing -> this.userDao.findById(borrowing.getUserId()) // Ensure this gets the user ID
						.map(user -> new BorrowedUserDto(user.getId(), user.getUsername(), borrowing.getIssueDate(),
								borrowing.getReturnDate(), borrowing.getIsOverdue())))
				.collectList();
		return userList;
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
	
//	public Map<String,String> uploadImage(MultipartFile file, String uploadFolderName) throws IOException{
//		String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
//		Path filePath = Paths.get(uploadFolderName + fileName);
//		Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
//		String fileUrl = "/" + uploadFolderName + "/" + fileName;
//		return Collections.singletonMap("imgUrl", fileUrl);
//	} 
	
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
            Path path = Paths.get(BASE_UPLOAD_DIR + filePath);
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


	

	
}
