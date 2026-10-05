import { useState, useMemo } from "react";

export function useBooks() {
  const [books] = useState([
    { id: 1, title: "React", author: "John", category: "Tech", available: true },
    { id: 2, title: "Python", author: "Alex", category: "Programming", available: true },
    { id: 3, title: "Cyber Security", author: "Sam", category: "Security", available: false }
  ]);

  const [search, setSearch] = useState("");

  const filteredBooks = useMemo(() =>
    books.filter(b =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase())
    ), [books, search]);

  const availableBooks = useMemo(
    () => filteredBooks.filter(b => b.available),
    [filteredBooks]
  );

  return { books, search, setSearch, filteredBooks, availableBooks };
}