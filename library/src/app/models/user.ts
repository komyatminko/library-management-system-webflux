import { Book } from "./book";
import { BorrowedBook } from "./borrowed-book";
import { Role } from "./role";

export interface User {
    id?: string;
    username: string;
    password?: string;
    email: string;
    roles: Role[];
    phone: string;
    address: string;
    borrowedBooks?: BorrowedBook[];
}
