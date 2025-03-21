import { Author } from "./author";
import { BookDetails } from "./book-details";
import { BorrowedUser } from "./borrowed-user";

export interface Book {

    id?: string;
    uniqueBookId?: string,
    name: string;
    price: number;
    imgUrl: string;
    bookDetails: BookDetails;
    author?: Author;
    rating: number;
    isAvailable?: boolean;
    totalCount: number;
    availableCount: number;
    borrowedBy?: Array<BorrowedUser>;

}
