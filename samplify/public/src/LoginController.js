import { getAuth } from "firebase/auth";
import { firebaseConfig } from "../../firebase";
import { initializeApp } from "firebase/app";

export const app = initializeApp(firebaseConfig);

/**
 * Set a cookie using the given name, value and expiry.
 *
 * @param cname Cookie name
 * @param cvalue Cookie value
 * @param cdays Expiry (days from now)
 */
 function setCookie(cname, cvalue, cdays) {
    const date = new Date();
    date.setTime(date.getTime() + (cdays * 24 * 60 * 60 * 1000));
    const expires = "expires="+date.toUTCString();
    const cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    document.cookie = cookie;
    console.log(cookie);
}

/**
 * Get the value of a cookie by the given name.
 *
 * @param cname Cookie name
 */
export function getCookie(cname) {
    const name = cname + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

/**
 * Uses Firebase to authenticate a user with the given email and password.
 *
 * @param email Email
 * @param password Password
 */
 async function authenticate(email, password) {
    const auth = getAuth(app);
    signInWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
        const user = userCredential.user;
        console.log(user);
        setCookie(cname, "email", 3);
          window.location.reload();
        
    })
    .catch((error) => {
        const errorCode = error.code;
        // const errorMessage = error.message;
        const message = document.querySelector<HTMLElement>('#login > .message');
        if(message != null){
            if(errorCode === 'auth/invalid-email'
                || errorCode === 'auth/user-disabled'
                || errorCode === 'auth/user-not-found'
                || errorCode === 'auth/wrong-password'){
                message.textContent = "Invalid email or password";
            }
        }
    });
}


/**
 * Check if a cookie by the given name is set to the expected value.
 *
 * @param cname Cookie name
 * @param expected Expected cookie value
 */
export function checkCookie(cname, expected) {
    const stored = getCookie(cname);
    return stored === expected;
}

/**
 * 
 * @param {*} e 
 */
function submit(e) {
    e.preventDefault();
    const login = document.getElementById('login');
    if(login != null){
        const inputs = login.getElementsByTagName('input');
        const email = inputs[0].value;
        const password = inputs[1].value;
        authenticate(email, password);
    }

}

export default function Login() {
    if(getCookie("email")) return (<div></div>); // Logged in already

    return( // Not logged in
        <form id="login" onSubmit={(e) => submit(e)}>
             <input type='email' name='email' placeholder='Email' id='email' required/>
             <input type='password' name='password' placeholder='Password' id='password' required/>
             <p className='message'>&nbsp;</p>
             <button type="submit" className='submit'>Login</button>
         </form>
    );
}