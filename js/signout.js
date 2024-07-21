document.addEventListener('DOMContentLoaded', () => {
    const signOutBtn = document.getElementById('signout');
    const usernameSpan = document.getElementById('username');

    const signOut = () => {
        sessionStorage.removeItem("user-creds");
        sessionStorage.removeItem("user-info");
        window.location.href = '../index.html';
    };

    const checkCredentials = () => {
        const userInfo = sessionStorage.getItem("user-info");
        if (!userInfo) {
            window.location.href = '../index.html';
        } else {
            const user = JSON.parse(userInfo);
            usernameSpan.textContent = user.usuario;
        }
    };

    signOutBtn.addEventListener('click', signOut);
    checkCredentials();
});
