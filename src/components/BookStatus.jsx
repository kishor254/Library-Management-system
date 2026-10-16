export default function BookStatus({ available }) {
return (
<span className={available ? "book-available" : "book-unavailable"}>
{available ? "Available" : "Currently Unavailable"} </span>
);
}
