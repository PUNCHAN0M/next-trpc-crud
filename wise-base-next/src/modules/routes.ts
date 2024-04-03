import { create } from "domain";
import { createBook } from "./book";

export const Route = {
  signIn: '/sign-in',
  dashboard: '/dashboard',
  book: {
    bookList: "/book",
    aboutBook: (bookId: string) => ({
      details: `/book/${bookId}`,
    }),
  },
  form:{
    formbook:"/form",
  }
  
}
