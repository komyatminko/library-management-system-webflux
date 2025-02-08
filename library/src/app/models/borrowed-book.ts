export interface BorrowedBook {
    bookId: string;
	bookName: string;
	authorName: string;
	issueDate: Date;
	returnDate: Date;
	isOverdue: boolean;
}
