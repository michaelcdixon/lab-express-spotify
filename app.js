require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
	clientId: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
	.clientCredentialsGrant()
	.then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
	.catch((error) =>
		console.log(
			"Something went wrong when retrieving an access token",
			error
		)
	);

// Our routes go here:
//1. Create a route /index
//render a view called index.hbs
//create a form with artistName field
//redirect to /artist-search with a query string http://localhost:3000?artistName="insertArtistName"
app.get("/", (req, res) => {
	res.render("index");
});

//2. Create an /artist-search route
//get the artistName that comes from the query params
//pass that artist name to

app.get("/artist-search", async (req, res) => {
	const data = await spotifyApi.searchArtists(req.query.artistName);
	console.log(data.body.artists);
	const allArtists = data.body.artists.items;
	//3. Create a artist-search-results view
	//render that view passing allArtists
	//iterate through all artists in the view (each)
	//display their name and id
	res.render("artist-search-results", { allArtists });
});

app.get("/albums/:artistId", async (req, res) => {
	const data = await spotifyApi.getArtistAlbums(req.params.artistId);
	const allAlbums = data.body.items;
	res.render("albums", { allAlbums });
});

app.get("/view-tracks/:trackId", async (req, res) => {
	const data = await spotifyApi.getAlbumTracks(req.params.trackId);
	const allTracks = data.body.items;
	res.render("view-tracks", { allTracks });
});

app.listen(3000, () =>
	console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
