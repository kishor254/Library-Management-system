function BookStatus({ available }) {
  return available ? (
    <span className="status available">
      ● Available
    </span>
  ) : (
    <span className="status unavailable">
      ● Unavailable
    </span>
  );
}

export default BookStatus;