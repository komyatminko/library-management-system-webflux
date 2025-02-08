import { Book } from "./book";
import { BorrowedBook } from "./borrowed-book";

export interface User {
    userId: string;
    username: string;
    email: string;
    roles: string[];
    borrowedBooks?: BorrowedBook[];
}
