export interface BorrowedUser {
    id?: string;
    userId: string;
    // bookId: string | undefined;
    username?: string;
    issueDate: Date;
    returnDate: Date;
    isOverdue: boolean
}
