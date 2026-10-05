function History() {

  const history = [
    "React Advanced Guide",
    "Python Mastery",
    "Database Systems"
  ];

  return (
    <div>

      <h2>🕘 Reading History</h2>

      {history.length === 0 ? (

        <div className="empty">
          No reading history available
        </div>

      ) : (

        history.map((book, index) => (
          <div className="history-item" key={index}>
            📖 {book}
          </div>
        ))

      )}

    </div>
  );
}

export default History;