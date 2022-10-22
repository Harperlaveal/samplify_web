# NWEN304

a) 
Using Web application: 
 Run npm install in project terminal, then run application with npm start.
 Go to localhost:3002 and then sign up with a new account.
 Once signed up, login with your account. This will bring your to the search page, where samples can be searched up using the search bar.
 You can also search for other user's playlists via the search area in the nav bar. (note: anauthorised users can still search)

The playlists page is where songs can be added to your own playlists. You can update playlist information on this page (name and description) as well as delete samples. 
The profile page has your email and username, and the option to log out.

**Our heroku hosting is using another GitLab project as we were not able to change the pipeline. We can provide evidence of this. Our website is hosted here: i-samplify.herokuapp.com**

**REST API:**
To update you're playlist you must know your uid
An example command is as follows
curl -X POST -H "Content-Type: application/json"  \  -d '{"uid": "16b7a24a60834dc0b91cdf11e390953d", "title": "Brand New", "desc": "Awesome Beats"}'  \  "https://i-samplify.herokuapp.com/json/Jayman"

To get a user's samples you can type the following command for example with oldelplaso being the username.
curl -H "Accept: application/json" "https://i-samplify.herokuapp.com/json/oldelplaso" | json_pp

**b)**
The web application's interface:
Interface is a web browser. 

REST API interface:
Interface for REST API is the terminal.

c) Error handling:

Page redirection:
- If a user doesn't have access to a page it will redirect to either /search or /login. If a page doesn't exist, it will redirect to an "oops" page. 


Try/catch:
- This allows us to execute a piece of code whist being tested for errors. (Runtime errors)
- Used in conjunction with redirection i.e it redirects in case of failures. 
