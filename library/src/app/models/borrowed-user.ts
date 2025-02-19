export interface BorrowedUser {
    userId: string;
    username: string;
    issueDate: Date;
    returnDate: Date;
    isOverdue: boolean
}
