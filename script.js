document.addEventListener('DOMContentLoaded', function() {
    const movieList = document.getElementById('movieList');
  
    // TMDb API Anahtarını buraya ekleyin
    const apiKey = '31e2f677000d670732152ca0cf5ba062';
  
    // TMDb API'den popüler filmleri çekmek için isteği oluşturun
    fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`)
      .then(response => response.json())
      .then(data => {
        const movies = data.results;

        
        
        // Her film için bir kart oluşturun
        movies.forEach(movie => {
          const movieCard = createMovieCard(movie);
          movieList.appendChild(movieCard);
        });
      })
      .catch(error => console.error('Error fetching movies:', error));
  });
  
  
  function createMovieCard(movie) {
    const movieCard = document.createElement('div');
    movieCard.classList.add('movie-card');
  
    // Poster Image
    const poster = document.createElement('img');
    poster.src = `https://image.tmdb.org/t/p/w300${movie.poster_path}`; // Use TMDb image base URL
    poster.alt = `${movie.title} Poster`;
    movieCard.appendChild(poster);
  
    // Title
    const title = document.createElement('h2');
    title.textContent = movie.title;
  
    // Release Date
    const releaseDate = document.createElement('p');
    releaseDate.textContent = `Release Date: ${movie.release_date}`;
  
    // Genres
    const genres = document.createElement('p');
    const genreIds = movie.genre_ids || [];
    fetchGenreList(genreIds)
      .then(genres => {
        const genreNames = genres.map(genre => genre.name);
        const genreString = genreNames.join(', ');
        genres.textContent = `Genres: ${genreString}`;
        
      })
      .catch(error => console.error('Error fetching genres:', error));
  
    // Overview
    const overview = document.createElement('p');
    overview.textContent = movie.overview;
  
    movieCard.appendChild(title);
    movieCard.appendChild(releaseDate);
    movieCard.appendChild(genres);
    movieCard.appendChild(overview);

    movieCard.addEventListener('click', () => openMovieModal(movie));
  
    return movieCard;
  }
  
  fetchGenreList()
    .then(genres => {
      const filterButtons = document.getElementById('filterButtons');
      genres.forEach(genre => {
        const button = document.createElement('button');
        button.textContent = genre.name;
        button.onclick = () => filterByGenre(genre.id);
        filterButtons.appendChild(button);
      });
    })
    .catch(error => console.error('Error fetching genres:', error));
// Function to fetch genre list
async function fetchGenreList() {
  const apiKey = '31e2f677000d670732152ca0cf5ba062'; // Replace with your TMDb API key

  try {
    const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`);
    const data = await response.json();
    return data.genres;
  } catch (error) {
    return console.error('Error fetching genre list:', error);
  }
}

// Function to filter movies by genre
function filterByGenre(genreId) {
  const movieList = document.getElementById('movieList');
  const apiKey = '31e2f677000d670732152ca0cf5ba062'; // Replace with your TMDb API key

  // Fetch popular movies
  fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`)
    .then(response => response.json())
    .then(data => {
      const movies = data.results;

      // Filter movies by genre
      const filteredMovies = movies.filter(movie => {
        return movie.genre_ids.includes(genreId);
      });

      // Clear existing movie list
      movieList.innerHTML = '';

      // Display filtered movies
      filteredMovies.forEach(movie => {
        const movieCard = createMovieCard(movie);
        movieList.appendChild(movieCard);
      });
    })
    .catch(error => console.error('Error fetching movies:', error));
}

function openMovieModal(movie) {
  // Create modal container
  const modalContainer = document.createElement('div');
  modalContainer.classList.add('modal-container');

  // Create modal content
  const modalContent = document.createElement('div');
  modalContent.classList.add('modal-content');

  // Title
  const modalTitle = document.createElement('h2');
  modalTitle.textContent = movie.title;

  // Release Date
  const modalReleaseDate = document.createElement('p');
  modalReleaseDate.textContent = `Release Date: ${movie.release_date}`;

  // Genres
const modalGenres = document.createElement('p');
const genres = movie.genres ? movie.genres : [];
modalGenres.textContent = `Genres: ${genres.map(genre => genre.name).join(', ')}`;

  // Overview
  const modalOverview = document.createElement('p');
  modalOverview.textContent = movie.overview;

  // Close button
  const closeButton = document.createElement('button');
  closeButton.textContent = 'Close';
  closeButton.addEventListener('click', () => {
    document.body.removeChild(modalContainer);
  });

  // Append elements to modal content
  modalContent.appendChild(modalTitle);
  modalContent.appendChild(modalReleaseDate);
  modalContent.appendChild(modalGenres);
  modalContent.appendChild(modalOverview);
  modalContent.appendChild(closeButton);

  // Append modal content to modal container
  modalContainer.appendChild(modalContent);

  // Append modal container to the body
  document.body.appendChild(modalContainer);
}