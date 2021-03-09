//selector
const q = (id) => document.querySelector(id);
//elements
const title = q("#title");
const author = q("#author");
const isbn = q("#isbn");
const alert = q("#alert");
const tbody = q("#tbody");
const submit = q("input[type=submit]");
const ALERT_TIMEOUT = 3000;
const ERROR_MESSAGE = "Please give all inputs properly";
const LOCAL_STOR = "books";
class Book {
  constructor(bookTitle, authorName, isbn) {
    this.bookTitle = bookTitle;
    this.authorName = authorName;
    this.isbn = isbn;
    this.created = new Date().getTime();
  }
}

class UI {
  constructor() {
    this.lsBooks = new LocalStor("books");
    this.initEvents();
  }
  initEvents() {
    submit.addEventListener("click", () => this.addBook());
    this.loadBooks();
  }
  loadBooks() {
    this.lsBooks.getBooks().forEach((book) => {
      this.book = book;
      this.showInTable();
    });
  }
  addBook() {
    // console.log("clicked");
    this.book = new Book(title.value, author.value, isbn.value);
    const isValid = this.validateBook();
    if (!isValid) return this.alert(ERROR_MESSAGE, "danger");
    title.value = author.value = isbn.value = "";
    this.lsBooks.storeBook(this.book);
    this.showInTable();
    this.alert("Book added successfully", "success");
  }
  showInTable() {
    const { bookTitle, authorName, isbn, created } = this.book;
    const a = document.createElement("a");
    a.href = "#";
    a.textContent = "X";
    a.setAttribute("data", created);
    a.addEventListener("click", (e) => this.removeRow(e));

    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${bookTitle}</td><td>${authorName}</td><td>${isbn}</td>`;
    const tdClose = document.createElement("td");
    tdClose.appendChild(a);
    tr.appendChild(tdClose);
    tbody.appendChild(tr);
  }
  removeRow(e) {
    this.lsBooks.removeBook(e.target.getAttribute("data"));
    // console.log(e.target.getAttribute("data"));
    e.target.parentNode.parentNode.remove();
    this.alert("Item deleted successfully", "success");
  }
  validateBook(book) {
    // console.log(title, author, isbn, "no ",q("#title").value);
    const { bookTitle, authorName, isbn } = this.book;
    if (bookTitle !== "" && authorName !== "" && isbn !== "") return true;
    return false;
  }
  alert(message, className) {
    alert.className = "alert " + className;
    alert.textContent = message;
    alert.style.visibility = "visible";
    setTimeout(() => (alert.style.visibility = "hidden"), ALERT_TIMEOUT);
  }
}
class LocalStor {
  constructor(storName) {
    this.storName = storName;
  }

  storeBook(book) {
    const books = this.getBooks();

    books.push(book);

    this.storBooks(books);
  }
  storBooks(books) {
    localStorage.setItem(this.storName, JSON.stringify(books));
  }
  getBooks() {
    const books = localStorage.getItem(this.storName) || "[]";
    return JSON.parse(books);
  }
  removeBook(created) {
    const books = this.getBooks();
    books.forEach((book, index) => {
      if (book.created == created) books.splice(index, 1);
    });
    this.storBooks(books);
  }
}

const ui = new UI();
