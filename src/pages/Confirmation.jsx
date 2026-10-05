import {
  useLocation,
  useNavigate
} from "react-router-dom";

function Confirmation() {

  const { state } = useLocation();

  const navigate = useNavigate();

  if (!state) {
    return <h2>Invalid request</h2>;
  }

  return (
    <div className="confirmation">

      <div className="success-icon">
        ✓
      </div>

      <h1>
        {state.type} Confirmed!
      </h1>

      <p>
        Your {state.type.toLowerCase()} request
        for <b>{state.book.title}</b> has been
        successfully submitted.
      </p>

      <button
        className="primary-btn"
        onClick={() => navigate("/member")}
      >
        Go to Member Dashboard
      </button>

      <button
        className="secondary-btn"
        onClick={() => navigate("/books")}
      >
        Continue Browsing
      </button>

    </div>
  );
}

export default Confirmation;