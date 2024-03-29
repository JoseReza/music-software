//_FILESYSTEM

var SOUNDS_FILESYSTEM_HOST_PRODUCTION = "https://josereza.github.io/music-sounds";
var SOUNDS_FILESYSTEM_HOST_DEVELOPMENT = "http://localhost:4000";
var SOUNDS_FILESYSTEM_HOST = (window.location.hostname == "localhost" || window.location.hostname == "127.0.0.1") ? SOUNDS_FILESYSTEM_HOST_DEVELOPMENT : SOUNDS_FILESYSTEM_HOST_PRODUCTION; 

var SCRIPTS_FILESYSTEM_HOST_PRODUCTION = "https://canicanremaster.ddns.net:81/music-scripts";
var SCRIPTS_FILESYSTEM_HOST_DEVELOPMENT = "http://localhost:3750/music-scripts";
var SCRIPTS_FILESYSTEM_HOST = (window.location.hostname == "localhost" || window.location.hostname == "127.0.0.1") ? SCRIPTS_FILESYSTEM_HOST_DEVELOPMENT : SCRIPTS_FILESYSTEM_HOST_PRODUCTION; 

//_FRONTEND

var SOUNDS_FRONTEND_HOST_PRODUCTION = "https://josereza.github.io/music-sounds";
var SOUNDS_FRONTEND_HOST_DEVELOPMENT = "http://localhost:3500";
var SOUNDS_FRONTEND_HOST = (window.location.hostname == "localhost" || window.location.hostname == "127.0.0.1") ? SOUNDS_FRONTEND_HOST_DEVELOPMENT : SOUNDS_FRONTEND_HOST_PRODUCTION; 

var SCRIPTS_FRONTEND_HOST_PRODUCTION = "https://josereza.github.io/music-scripts";
var SCRIPTS_FRONTEND_HOST_DEVELOPMENT = "http://localhost:3250";
var SCRIPTS_FRONTEND_HOST = (window.location.hostname == "localhost" || window.location.hostname == "127.0.0.1") ? SCRIPTS_FRONTEND_HOST_DEVELOPMENT : SCRIPTS_FRONTEND_HOST_PRODUCTION; 

//_PUBLISH

var PUBLISH_HOST_DEVELOPMENT = "http://localhost:3000/src/assets/publish.html";
var PUBLISH_HOST_PRODUCTION = "https://josereza.github.io/music-software/src/assets/publish.html";
var PUBLISH_HOST = (window.location.hostname == "localhost" || window.location.hostname == "127.0.0.1") ? PUBLISH_HOST_DEVELOPMENT : PUBLISH_HOST_PRODUCTION; 

//_OAUTH

var CLIENT_ID = "e5b9ae3903d5b3c533c7";
var CLIENT_HOST = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}`;
var CLIENT_HOST_LOGOUT = "https://github.com/logout";

var CLIENT_HOST_API_DEVELOPMENT = "http://localhost:4250/oauth";
var CLIENT_HOST_API_PRODUCTION = "https://canicanremaster.ddns.net:81/oauth";
var CLIENT_HOST_API = (window.location.hostname == "localhost" || window.location.hostname == "127.0.0.1") ? CLIENT_HOST_API_DEVELOPMENT : CLIENT_HOST_API_PRODUCTION;

//_VERSION

var VERSION = "1.4.0";