class ViewController {

    constructor() {
        window.addEventListener('load', this.handleHashChange);
        window.addEventListener('hashchange', this.handleHashChange);
    }


    handleHashChange = () => {
        const pageIds = ['login', 'register', 'home'];

        let hash = location.hash.slice(1) || pageIds[0];

        if (hash === 'home') {
            if (!userManager.loggedUser) {
                location.hash = 'login';
                return;
            }
        }

        pageIds.forEach(pageId => {
            let element = document.getElementById(pageId);
            if (pageId === hash) {
                element.style.display = 'flex';
            } else {
                element.style.display = 'none';
            }
        });

        switch (hash) {
            case 'login':
                this.renderLogin();
                break;

            case 'register':
                this.validateRegister();
                this.renderRegister();
                break;
        }
    }

    renderLogin = () => {
        let form = document.getElementById('loginForm');
        let usernameInput = document.getElementById('usernameInput');
        let passwordInput = document.getElementById('passwordInput');
        let errorMassage = document.getElementById('loginError');
        let loginButton = document.getElementById('loginButton');

        usernameInput.addEventListener('input', () => {
            loginButton.disabled = !(usernameInput.value && passwordInput.value);
        });

        passwordInput.addEventListener('input', () => {
            loginButton.disabled = !(usernameInput.value && passwordInput.value);
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let username = e.target.elements.username.value;
            let pass = e.target.elements.pass.value;

            if (this.validateLogin({ username, pass })) {
                let successfulLogin = userManager.login({ username, pass });

                if (!successfulLogin) {
                    errorMassage.innerText = 'Wrong username or password!';
                    errorMassage.style.display = 'block';

                } else {
                    location.hash = 'home';
                    errorMassage.innerText = "";
                    form.reset();
                }
            }
        });

        loginButton.disabled = !(usernameInput.value && passwordInput.value);
    }


    validateLogin = ({ username, pass }) => {
        if (!username || !pass) {
            return false;
        }
        return true;
    }


    validateRegister = () => {
        let registerError = document.getElementById('registerError');
        let username = document.getElementById('username').value;
        let pass = document.getElementById('pass').value;
        let confirmPass = document.getElementById('confirm-pass').value;
        let registerButton = document.getElementById('registerButton');

        let passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{6,}$/;

            if (username && pass && confirmPass) {

                if (pass === confirmPass) {
                    if (passRegex.test(pass)) {
                        registerButton.disabled = false;
                        registerError.innerText = "";
                        return true;

                    } else {
                        registerError.innerText = 'Password must be at least 6 characters long and contain at least one special character, one lowercase letter, and one uppercase letter.';
                    }

                } else {
                    registerError.innerText = 'Password and confirm password do not match.';
                }
            }

            registerError.style.display = 'block';
            registerButton.disabled = true;
            return false;
        }

    renderRegister = () => {
        let registerForm = document.getElementById("registerForm");
        let registerButton = document.getElementById('registerButton');
        let registerError = document.getElementById('registerError');

        registerButton.disabled = true;

        document.getElementById('username').addEventListener('input', () => {
            this.validateRegister();
        });

        document.getElementById('pass').addEventListener('input', () => {
            this.validateRegister();
        });

        document.getElementById('confirm-pass').addEventListener('input', () => {
            this.validateRegister();
        });

        registerForm.addEventListener("submit", (e) => {
            e.preventDefault();

            if (this.validateRegister()) {
                let username = document.getElementById('username').value;
                let pass = document.getElementById('pass').value;
                let registrationSuccessful = userManager.register({ username, pass });

                if (registrationSuccessful) {
                    userManager.loggedUser = { username, pass };
                    location.hash = "home";
                } else {
                    registerError.innerText = 'Username already taken';
                    registerError.style.display = 'block';
                }
            }
            registerForm.reset();
        });
    }
}

let viewController = new ViewController();



