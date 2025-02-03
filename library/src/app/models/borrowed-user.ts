export interface BorrowedUser {
    id: string;
    username: string;
    issueDate: Date;
    returnDate: Date;
    isOverdue: boolean
}
