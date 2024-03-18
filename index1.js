document.addEventListener('DOMContentLoaded', function(){
    const { Client } = Appwrite;
    const client = new Client();
    const signupForm = document.querySelector('#signupform');
    const loginForm = document.querySelector('#loginform');
    var loggedin = false;
    // const ram = document.querySelector("#auth-btn")

    client
        .setEndpoint('https://cloud.appwrite.io/v1')
        .setProject('65f28458b660f4d34292');

    const account = new Appwrite.Account(client);

    const authHandler = async () => {
        const user = await account.get()
        if (user) {
            console.log("entered");
            // console.log(document.getElementById('.auth-btn'))
            const logoutBtn = document.createElement('button')
            logoutBtn.id = 'logoutBtn'
            logoutBtn.className = 'ds-btn ds-btn-primary ds-btn-wide px-2 py-4 '
            logoutBtn.innerHTML = 'Logout'
            logoutBtn.addEventListener('click', logout)

        } else {
            console.log("not entered");
            document.querySelector('.auth-btn-wrapper').style.display = "flex";
            document.querySelector('#logoutBtn')?.removeEventListener('click', logout)
            document.querySelector('#logoutBtn')?.remove()
        }
    }

    const logout = async () => {
        account.deleteSession('current').then(r => location.reload()).catch(e => console.log(e))
        authHandler()
    }

    const fetchdata = async () =>{
        try{
        const response = await fetch('index.html');
        const html = await response.text();
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        const authBtn = tempDiv.querySelector('#auth-btn');
        console.log('auth-btn element:', authBtn);
        authBtn.textContent = "logout";
        console.log('auth-btn element:', authBtn);
        // window.location.href = 'index.html';
        }
        catch (error) {
            console.log('Error fetching data:', error);
        }
    }

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!signupForm.querySelector('#email').value.includes('@gmail.com')) {
                alert('Enter Valid Email Address');
                return;
            }
            if (signupForm.querySelector('#password').value.length < 8) {
                alert('The password should be at least 8 characters');
                return;
            }
            account.create(
                Appwrite.ID.unique(),
                signupForm.querySelector('#email').value,
                signupForm.querySelector('#password').value
            ).then(r => {
                localStorage['user'] = JSON.stringify(r);
                alert("Account created successfully");
                window.location.href = 'LoginSignup.html';
                authHandler(); // Call authHandler after successful signup
            }).catch((error) => {
                if (error.code === 409) { // for duplicate user
                    alert('Account already exists. Please login instead.');
                    window.location.href = 'LoginSignup.html';
                }
            });
        });
    }


    loginForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!loginForm.querySelector('#email').value.includes('@gmail.com')) {
            alert('Enter Correct Email Credentials');
            return;
        }
        if (loginForm.querySelector('#password').value.length < 8) {
            alert('Enter Correct Password');
            return;
        }
        account.createEmailSession(
            loginForm.querySelector('#email').value,
            loginForm.querySelector('#password').value
        ).then(r => {
            localStorage['user'] = JSON.stringify(r);
            alert('Logged in successfully');
            // const logoutBtn = document.createElement('button')
            // logoutBtn.id = 'logoutBtn'
            // logoutBtn.className = 'ds-btn ds-btn-primary ds-btn-wide px-2 py-4 '
            // logoutBtn.innerHTML = 'Logout'
            // authHandler(); // Call authHandler after successful lo  gin
            loggedin = true;
            fetchdata();
            
        }).catch((error) => {
            console.log(error);
            alert("Invalid Credentails");
        });
    });

})


