const loginButton = document.querySelector(".btn")
const users = document.querySelectorAll(".user")

let selectedUser = null;

users.forEach(user => {
    user.onclick = () => {
        if (selectedUser) {
            selectedUser.style.backgroundColor = "";
        }
        if (selectedUser === user) {
            selectedUser = null;
        } else {
            user.style.backgroundColor = "#60656b";
            selectedUser = user;
        }

    };
});


loginButton.onclick = () => {
    if (selectedUser) {
        localStorage.setItem('user', JSON.stringify(selectedUser.id))
        window.location.href = 'index.html';

        alert(`${selectedUser.id} logged in`);
    } else {
        alert("No user selected");
    }

};