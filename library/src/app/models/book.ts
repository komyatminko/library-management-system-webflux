import { Author } from "./author";
import { BookDetails } from "./book-details";
import { BorrowedUser } from "./borrowed-user";

export interface Book {

    id?: string;
    name: string;
    price: number;
    imgUrl: string;
    bookDetails: BookDetails;
    author?: Author;
    rating: number;
    isAvailable?: boolean;
    availableCount: number;
    borrowedBy?: Array<BorrowedUser>;

}
