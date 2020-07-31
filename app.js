class Book {
  constructor(title, author, numer) {
    this.title = title
    this.author = author
    this.numer = numer
  }
}

class UI {
  static displayBooks() {
    const books = Store.getBooks()

    books.forEach((book) => UI.addBookToList(book))
  }

  static addBookToList(book) {
    const list = document.querySelector('#book-list')

    const row = document.createElement('tr')

    row.innerHTML = `
      <td style="word-break: break-word;">${book.title}</td>
      <td style="word-break: break-word;">${book.author}</td>
      <td style="word-break: break-word;">${book.numer}</td>
      <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
    `

    list.appendChild(row)
  }

  static deleteBook(el) {
    if(el.classList.contains('delete')) {
      el.parentElement.parentElement.remove()
    }
  }

  static showAlert(message, className) {
    const div = document.createElement('div')
    div.className = `alert alert-${className}`
    div.appendChild(document.createTextNode(message))
    const container = document.querySelector('.container')
    const form = document.querySelector('#book-form')
    container.insertBefore(div, form)

    setTimeout(() => document.querySelector('.alert').remove(), 3000)
  }

  static clearFields() {
    document.querySelector('#title').value = ''
    document.querySelector('#author').value = ''
    document.querySelector('#numer').value = ''
  }
}

class Store {
  static getBooks() {
    let books
    if(localStorage.getItem('books') === null) {
      books = []
    } else {
      books = JSON.parse(localStorage.getItem('books'))
    }

    return books
  }

  static addBook(book) {
    const books = Store.getBooks()
      books.push(book)
    localStorage.setItem('books', JSON.stringify(books))
  }

  static removeBook(numer) {
    const books = Store.getBooks()

    books.forEach((book, index) => {
      if(book.numer === numer) {
        books.splice(index, 1)
      }
    })

    localStorage.setItem('books', JSON.stringify(books))
  }
}

document.addEventListener('DOMContentLoaded', UI.displayBooks)

document.querySelector('#book-form').addEventListener('submit', (e) => {
  e.preventDefault()

  const title = document.querySelector('#title').value
  const author = document.querySelector('#author').value
  const numer = document.querySelector('#numer').value

  if(title === '' || author === '' || numer === '') {
    UI.showAlert('Please fill in all fields', 'danger')
  } else {
    const book = new Book(title, author, numer)

    UI.addBookToList(book)

    Store.addBook(book)

    UI.showAlert('Book Added', 'success')

    UI.clearFields()
  }
})

document.querySelector('#book-list').addEventListener('click', (e) => {
  UI.deleteBook(e.target)

  Store.removeBook(e.target.parentElement.previousElementSibling.textContent)

  UI.showAlert('Book Removed', 'success')
})
