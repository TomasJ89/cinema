import {getMovies, saveMovies, addMovie, deleteMovie, reserveSeat} from "./module.js";
const addMovies = document.getElementById("addMovies");
const logout = document.getElementById("logout");
const form = document.getElementById('movie-form');
const back = document.getElementById("back");
const close = document.querySelector(".close");
const oneMovie = document.querySelector(".oneMovie");
const moviesSection = document.querySelector(".movies-section");

let loggedInUser = JSON.parse(localStorage.getItem('user'));
let admin = loggedInUser === "admin";


logout.onclick = () => {
    window.location.href = 'login.html';
};

!admin ? addMovies.classList.add("d-none") : "";
addMovies.onclick = () => {
    form.classList.remove("d-none");
};
close.onclick = () => {
    form.classList.add("d-none");
};

function renderMovies() {
    const MoviesContainer = document.getElementById('moviesList');
    const movies = getMovies();
    MoviesContainer.innerHTML = '';
    movies.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.className = 'movie';
        movieElement.id = movie.id;
        const deleteButton = admin? `<button class="delete-movie" data-id="${movie.id}">Delete</button>` : '';
        let btnText = admin? "Reservation" : "Reserve seats"
        movieElement.innerHTML = `
            <div>
                <img src="${movie.image}" alt="${movie.title}">
                <h3 class="mt-2">"${movie.title}"</h3>
                <p>Seats Available: ${movie.seats - movie.reservations.length}/${movie.seats}</p>
            </div>
            <div>
                ${deleteButton} 
                 <button class="reserve-seat" data-id="${movie.id}">${btnText}</button>
            </div>
            
        `;
        MoviesContainer.appendChild(movieElement);
    });

    document.querySelectorAll('.delete-movie').forEach(button => {
        button.addEventListener('click', (e) => {
            const movieId = parseInt(e.target.getAttribute('data-id'));
            deleteMovie(movieId);
            renderMovies();
        });
    });

    document.querySelectorAll(".reserve-seat").forEach(button => {
        button.addEventListener("click", (event) => {
            back.classList.remove("d-none");
            moviesSection.classList.add("d-none");
            oneMovie.classList.remove("d-none");

            const movieId = parseInt(event.target.getAttribute('data-id'));
            const selectMovie = movies.find(movie => movie.id === movieId)
            const buttonText = admin ? "Cancel reservation" : "Reserve seats";
            let reservedSeats = selectMovie.reservations.slice();

            oneMovie.innerHTML = `
                <h3>"${selectMovie.title}"</h3>
                <div class="d-flex">
                    <div class="movieImage">
                        <img src="${selectMovie.image}" alt="${selectMovie.title}">
                    </div>
                    <div class="seats d-flex gap-2 flex-wrap justify-content-center"></div>
                </div>
                <div class="btn btn-dark" id="reservation">${buttonText}</div>
            `;

            const seats = document.querySelector(".seats");
            for (let i = 0; i < selectMovie.seats; i++) {
                seats.innerHTML += `<div class="seatBox" id="${i + 1}">${i + 1}</div>`;
            }

            const seatBoxes = document.querySelectorAll(".seatBox");
            seatBoxes.forEach(seat => {
                if (reservedSeats.includes(seat.id)) {
                    seat.style.backgroundColor = "grey";
                }

                seat.onclick = () => {
                    console.log(reservedSeats);
                    if (admin) {
                        // Admin cancels reservation
                        if (reservedSeats.includes(seat.id)) {
                            seat.style.backgroundColor = "#ff4b4b";
                            reservedSeats = reservedSeats.filter(reservedSeat => reservedSeat !== seat.id);
                        }
                    } else {
                        // User reserves seat
                        if (!reservedSeats.includes(seat.id)) {
                            seat.classList.add("userSelect");
                            reservedSeats.push(seat.id);
                        } else {
                            seat.classList.remove("userSelect");
                            reservedSeats = reservedSeats.filter(reservedSeat => reservedSeat !== seat.id);
                        }
                    }
                };
            });

            const reservationButton = document.getElementById("reservation");
            reservationButton.onclick = () => {
                if (!admin) {
                    // Only save reservations for regular users
                    reserveSeat(movieId, reservedSeats);
                } else {
                    // Admin updates movie reservations directly
                    const movies = getMovies();
                    const movie = movies.find(movie => movie.id === movieId);
                    movie.reservations = reservedSeats;
                    saveMovies(movies);
                }
                renderMovies();
                back.classList.add("d-none");
                moviesSection.classList.remove("d-none");
                oneMovie.classList.add("d-none");
            };
        });
    });
}

document.getElementById('movie-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const image = document.getElementById('image').value;
    const seats = parseInt(document.getElementById('seats').value);
    addMovie(title, image, seats);
    e.target.reset();
    renderMovies();
});

back.onclick = () => {
    back.classList.add("d-none");
    moviesSection.classList.remove("d-none");
    oneMovie.classList.add("d-none");
};

renderMovies();