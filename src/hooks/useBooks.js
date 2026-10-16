
import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:3001";

export default function useBooks() {
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError("");

        const [bookResponse, memberResponse] =
          await Promise.all([
            axios.get(`${API}/books`),
            axios.get(`${API}/members`)
          ]);

        setBooks(bookResponse.data);
        setMembers(memberResponse.data);
      } catch {
        setError("Unable to load library data. Start the API server and try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { books, members, loading, error };
}