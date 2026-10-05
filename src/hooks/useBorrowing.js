import { useState, useEffect, useMemo, useCallback } from "react";

export function useBorrowing() {
  const [borrowed, setBorrowed] = useState(
    JSON.parse(localStorage.getItem("borrowed")) || []
  );

  useEffect(() => {
    localStorage.setItem("borrowed", JSON.stringify(borrowed));
  }, [borrowed]);

  const borrowBook = useCallback(book => {
    setBorrowed(b => [...b, { ...book, due: "2026-09-25" }]);
  }, []);

  const returnBook = useCallback(id => {
    setBorrowed(b => b.filter(x => x.id !== id));
  }, []);

  const renewBook = useCallback(id => {
    setBorrowed(b =>
      b.map(x => x.id === id ? { ...x, due: "2026-10-05" } : x)
    );
  }, []);

  const placeHold = useCallback(book => {
    alert(`Hold placed for ${book.title}`);
  }, []);

  const clearBorrowing = useCallback(() => setBorrowed([]), []);

  const overdue = useMemo(
    () => borrowed.filter(b => new Date(b.due) < new Date()),
    [borrowed]
  );

  return {
    borrowed,
    overdue,
    borrowBook,
    returnBook,
    renewBook,
    placeHold,
    clearBorrowing
  };
}