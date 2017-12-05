import firebase from "firebase";

var config = {
	apiKey: "AIzaSyCy93G3wD2478MhVTsVeseWfNLCaR70RXk",
	authDomain: "yamex-a0b5a.firebaseapp.com",
	databaseURL: "https://yamex-a0b5a.firebaseio.com",
	projectId: "yamex-a0b5a",
	storageBucket: "yamex-a0b5a.appspot.com",
	messagingSenderId: "549234297570"
};
firebase.initializeApp(config);
export default firebase;
