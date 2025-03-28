document.addEventListener('DOMContentLoaded', () => {
    const bookDetailContainer = document.getElementById('bookDetailContainer');
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('id');

    async function fetchBookDetails() {
        try {
            const response = await fetch(`https://api.freeapi.app/api/v1/public/books/${bookId}`);
            const data = await response.json();
            const book = data.data;

            const thumbnailUrl = book.volumeInfo.imageLinks?.thumbnail || '/api/placeholder/300/450';

            bookDetailContainer.innerHTML = `
                <div class="book-detail-content">
                    <img src="${thumbnailUrl}" alt="${book.volumeInfo.title}" class="book-detail-image">
                    <div class="book-detail-info">
                        <h1>${book.volumeInfo.title}</h1>
                        <h2>${book.volumeInfo.subtitle || ''}</h2>
                        <p><strong>Authors:</strong> ${book.volumeInfo.authors?.join(', ') || 'Unknown'}</p>
                        <p><strong>Publisher:</strong> ${book.volumeInfo.publisher || 'N/A'}</p>
                        <p><strong>Published Date:</strong> ${book.volumeInfo.publishedDate || 'N/A'}</p>
                        <p><strong>Categories:</strong> ${book.volumeInfo.categories?.join(', ') || 'N/A'}</p>
                        
                        <div class="book-description">
                            <h3>Description</h3>
                            <p>${book.volumeInfo.description || 'No description available.'}</p>
                        </div>

                        <div class="book-links">
                            <a href="${book.volumeInfo.previewLink}" target="_blank" class="preview-link">Preview Book</a>
                            <a href="${book.volumeInfo.infoLink}" target="_blank" class="info-link">More Information</a>
                        </div>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Error fetching book details:', error);
            bookDetailContainer.innerHTML = '<p>Unable to load book details. Please try again later.</p>';
        }
    }

    if (bookId) {
        fetchBookDetails();
    } else {
        bookDetailContainer.innerHTML = '<p>No book selected.</p>';
    }
});