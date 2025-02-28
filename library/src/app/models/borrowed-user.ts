export interface BorrowedUser {
    id?: string;
    userId: string;
    username?: string;
    issueDate: Date;
    returnDate: Date;
    isOverdue: boolean
}
