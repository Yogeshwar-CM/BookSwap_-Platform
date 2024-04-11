import React, { useState, useEffect } from "react";
import "./Home.css";
import { toast } from "react-toastify"; // Import toast from react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for toastify
import tempIMG from "../assets/b1.png";
import axios from "axios";
import ContactDetails from "../components/ContactDetails";

const Home = () => {
  const [books, setBooks] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserContactInfo, setSelectedUserContactInfo] = useState(null); // State to store contact info
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [newBook, setNewBook] = useState({
    age: "",
    title: "",
    comment: "",
    contactNumber: "",
    location: "",
    address: "",
    imageUrl: "",
  });
  const currentUser = sessionStorage.getItem("userName");

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleContactClick = async (userId) => {
    setSelectedUserId(userId);
    try {
      // Fetch the book details to get the owner's contact information
      const response = await axios.get(`http://localhost:3000/books/${userId}`);
      setSelectedUserContactInfo(response.data._id); // Assuming 'owner' property contains the contact information
    } catch (error) {
      console.error("Failed to fetch contact info: ", error);
    }
  };

  const handleCloseContactDetails = () => {
    setSelectedUserId(null);
    setSelectedUserContactInfo(null); // Reset contact info when closing contact details
  };

  const fetchBooks = async () => {
    try {
      const response = await axios.get("http://localhost:3000/books");
      const filteredBooks = response.data.filter(
        (book) => book.owner !== currentUser
      );
      setBooks(filteredBooks);
    } catch (error) {
      console.error("Failed to fetch books: ", error);
    }
  };

  const toggleAddBook = () => {
    setIsAddingBook(!isAddingBook);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewBook({
      ...newBook,
      [name]: value,
    });
  };

  const handleAddBook = async (event) => {
    event.preventDefault();
    try {
      const owner = sessionStorage.getItem("userName");
      const bookToAdd = { ...newBook, owner }; // Add owner to the new book object
      await axios.post("http://localhost:3000/books", bookToAdd);
      fetchBooks();
      setIsAddingBook(false);
      setNewBook({
        age: "",
        title: "",
        comment: "",
        contactNumber: "",
        location: "",
        address: "",
        imageUrl: "",
      });
      // Show success toast
      toast.success("Book added successfully!");
    } catch (error) {
      console.error("Failed to add book: ", error);
    }
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    try {
      const title = document.querySelector(
        ".search-fields[placeholder='Title']"
      ).value;
      const location = document.querySelector(
        ".search-fields[placeholder='Location']"
      ).value;
      const maxAge = document.querySelector(
        ".search-fields[placeholder='Max Age']"
      ).value;

      const response = await axios.get("http://localhost:3000/books");
      const filteredBooks = response.data.filter((book) => {
        return (
          (!title || book.title.toLowerCase().includes(title.toLowerCase())) &&
          (!location ||
            book.location.toLowerCase().includes(location.toLowerCase())) &&
          (!maxAge || parseInt(book.age) <= parseInt(maxAge))
        );
      });
      setBooks(filteredBooks);
    } catch (error) {
      console.error("Failed to search books: ", error);
    }
  };

  return (
    <div className="Home">
      <h2>Search what books you want</h2>
      <div className="bd1"></div>
      <div className="bd"></div>
      {selectedUserId && selectedUserContactInfo && (
        <ContactDetails
          info={selectedUserContactInfo} // Pass address
          onClose={handleCloseContactDetails}
        />
      )}

      <button className="add-book-btn" onClick={toggleAddBook}>
        Add New Book
      </button>
      {isAddingBook && (
        <div className="overlay">
          <div className="add-book-form">
            <h3>Add New Book</h3>

            <form onSubmit={handleAddBook} className="add-b">
              <input
                type="number"
                placeholder="Age"
                name="age"
                value={newBook.age}
                onChange={handleInputChange}
              />
              <input
                type="text"
                placeholder="Title"
                name="title"
                value={newBook.title}
                onChange={handleInputChange}
              />
              <input
                type="text"
                placeholder="Comment"
                name="comment"
                value={newBook.comment}
                onChange={handleInputChange}
              />
              <input
                type="text"
                placeholder="Contact Number"
                name="contactNumber"
                value={newBook.contactNumber}
                onChange={handleInputChange}
              />
              <input
                type="text"
                placeholder="Location"
                name="location"
                value={newBook.location}
                onChange={handleInputChange}
              />
              <input
                type="text"
                placeholder="Address"
                name="address"
                value={newBook.address}
                onChange={handleInputChange}
              />
              <input
                type="text"
                placeholder="Image URL"
                name="imageUrl"
                value={newBook.imageUrl}
                onChange={handleInputChange}
              />
              <button type="submit">Add Book</button>
              <button className="close-btn" onClick={toggleAddBook}>
                Close
              </button>
            </form>
          </div>
        </div>
      )}
      <form className="search-books" onSubmit={handleSearch}>
        <input type="text" className="search-fields" placeholder="Title" />
        <input type="text" className="search-fields" placeholder="Location" />
        <input type="number" className="search-fields" placeholder="Max Age" />
        <button type="submit" className="search-books-btn">Search</button>
      </form>
      <div className="exp">
        {books.map((book) => (
          <div className="expsec" key={book._id}>
            <img src={tempIMG} alt="" />
            <div className="exp-dets">
              <p>
                {book.title} - {book.age}
              </p>
              <p>
                {book.age} | {book.location}
              </p>
              <br />
              <br />
              <p>{book.comment}</p>
            </div>
            <button className="swap-btn">SWAP</button>
            <button
              className="contact-btn"
              onClick={() => handleContactClick(book._id)}
            >
              Contact
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
