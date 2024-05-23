export function getMovies() {
    return JSON.parse(localStorage.getItem('movies')) || [];
}

export function saveMovies(movies) {
    localStorage.setItem('movies', JSON.stringify(movies));
}

export function addMovie(title, image, seats) {
    const movies = getMovies();
    movies.push({ id: Date.now(), title, image, seats, reservations: [] });
    saveMovies(movies);
}

export function deleteMovie(movieId) {
    let movies = getMovies();
    movies = movies.filter(movie => movie.id !== movieId);
    saveMovies(movies);
}

export function reserveSeat(movieId, reservedSeats) {
    const movies = getMovies();
    const movie = movies.find(movie => movie.id === movieId);
    if (movie) {
        reservedSeats.forEach(seatId => {
            if (!movie.reservations.includes(seatId)) {
                movie.reservations.push(seatId);
            }
        });
        saveMovies(movies);
    }
}
