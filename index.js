const API_URL = 'https://api.freeapi.app/api/v1/public/books';
let currentPage = 1;
let totalPages = 1;
let books = [];

const booksContainer = document.getElementById('booksContainer');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const listViewBtn = document.getElementById('listViewBtn');
const gridViewBtn = document.getElementById('gridViewBtn');
const prevPageBtn = document.getElementById('prevPageBtn');
const nextPageBtn = document.getElementById('nextPageBtn');
const currentPageSpan = document.getElementById('currentPage');

async function fetchBooks(page = 1) {
    try {
        const response = await fetch(`${API_URL}?page=${page}&limit=10&inc=kind,id,etag,volumeInfo`);
        const data = await response.json();

        books = data.data.data;
        totalPages = data.data.totalPages;

        updatePaginationControls(page);
        renderBooks(books);
    } catch (error) {
        console.error('Error fetching books:', error);
    }
}

function renderBooks(booksToRender) {
    booksContainer.innerHTML = '';

    booksToRender.forEach(book => {
        const bookElement = document.createElement('div');
        bookElement.classList.add('book-item');

        const thumbnailUrl = book.volumeInfo.imageLinks?.thumbnail || '/api/placeholder/100/150';

        bookElement.innerHTML = `
            <img src="${thumbnailUrl}" alt="${book.volumeInfo.title}">
            <div class="book-details">
                <h2>${book.volumeInfo.title}</h2>
                <p>Author: ${book.volumeInfo.authors?.join(', ') || 'Unknown'}</p>
                <p>Published: ${book.volumeInfo.publishedDate || 'N/A'}</p>
                <a href="/bookLib/bookDetail.html?id=${book.id}" target="_blank">More Details</a>
            </div>
        `;

        booksContainer.appendChild(bookElement);
    });
}

function updatePaginationControls(page) {
    currentPage = page;
    currentPageSpan.textContent = `Page ${page}`;

    prevPageBtn.disabled = page === 1;
    nextPageBtn.disabled = page === totalPages;
}

function filterBooks() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredBooks = books.filter(book =>
        book.volumeInfo.title.toLowerCase().includes(searchTerm) ||
        book.volumeInfo.authors?.some(author => author.toLowerCase().includes(searchTerm))
    );

    renderBooks(filteredBooks);
}

function sortBooks() {
    const [sortType, sortOrder] = sortSelect.value.split('-');

    const sortedBooks = [...books].sort((a, b) => {
        let valueA, valueB;

        switch (sortType) {
            case 'title':
                valueA = a.volumeInfo.title;
                valueB = b.volumeInfo.title;
                break;
            case 'author':
                valueA = a.volumeInfo.authors?.[0] || '';
                valueB = b.volumeInfo.authors?.[0] || '';
                break;
            case 'date':
                valueA = new Date(a.volumeInfo.publishedDate || 0);
                valueB = new Date(b.volumeInfo.publishedDate || 0);
                break;
        }

        return sortOrder === 'asc'
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
    });

    renderBooks(sortedBooks);
}

function toggleView(view) {
    if (view === 'list') {
        booksContainer.classList.add('list-view');
        listViewBtn.classList.add('active');
        gridViewBtn.classList.remove('active');
    } else {
        booksContainer.classList.remove('list-view');
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
    }
}

// Event Listeners
searchInput.addEventListener('input', filterBooks);
sortSelect.addEventListener('change', sortBooks);
listViewBtn.addEventListener('click', () => toggleView('list'));
gridViewBtn.addEventListener('click', () => toggleView('grid'));

prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        fetchBooks(currentPage - 1);
    }
});

nextPageBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
        fetchBooks(currentPage + 1);
    }
});

// Initial Load
fetchBooks();
gridViewBtn.classList.add('active');