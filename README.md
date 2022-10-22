# NWEN304

a) 
Using Web application: 
1. Run npm install in project terminal, then run application with npm start.
2. Go to localhost 3002 and then sign up with a new account.
3. Once signed up, login with your account. This will bring your to the search page, where artists can be searched up using the search bar.
4. You can go to the playlists page where songs can be added to your own playlists.

REST API:
You can do post requests, however you need to know your uid.
curl -X POST -H "Content-Type: application/json"  \  -d '{"uid": "16b7a24a60834dc0b91cdf11e390953d", "title": "Brand New", "desc": "Awesome Beats"}'  \  "https://i-samplify.herokuapp.com/json/Jayman"

