
(async function () {

    var paramNameCode = 'code';
    var paramValueCode = (new URLSearchParams(new URL(window.location.href).search)).get(paramNameCode);

    if (!localStorage.getItem(paramNameCode)) {
        if (!paramValueCode) {
            localStorage.removeItem(paramNameAccessToken);
            location.assign(CLIENT_HOST);
        } else {
            localStorage.setItem(paramNameCode, paramValueCode);
        }
    }

    var paramNameAccessToken = "accessToken";
    var paramValueAccesToken = undefined;

    if (!localStorage.getItem(paramNameAccessToken)) {
        let response = await fetch(`${CLIENT_HOST_API}/getAccessToken?code=${localStorage.getItem(paramNameCode)}`);
        let responseParsed = await response.json();
        console.log(responseParsed);
        alert()
        if (responseParsed.error) {
            localStorage.removeItem(paramNameCode);
            localStorage.removeItem(paramNameAccessToken);
            location.replace(location.href.split("?")[location.href.split("?").length - 2]);
        }
        if (responseParsed.access_token) {
            paramValueAccesToken = responseParsed.access_token;
            localStorage.setItem(paramNameAccessToken, paramValueAccesToken);
            location.assign(location.href.split("?")[0]);
        }
    }

    var paramNameUserData = "userData";
    var paramValueUserData = undefined;

    if (!localStorage.getItem(paramNameUserData)) {
        let response = await fetch(`${CLIENT_HOST_API}/getUserData?code=${localStorage.getItem(paramNameCode)}`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem(paramNameAccessToken)}`
            }
        });
        let responseParsed = await response.json();
        paramValueUserData = responseParsed;
        localStorage.setItem(paramNameUserData, JSON.stringify(paramValueUserData));
    }

    let userData = JSON.parse(localStorage.getItem(paramNameUserData));
    let divUserName = document.getElementById("divUserName");
    let divUserImage = document.getElementById("divUserImage");
    let divLogout = document.getElementById("divLogout");

    if (userData.login && divUserName) {
        divUserName.innerHTML = userData.login;
    }
    if (userData.avatar_url && divUserImage) {
        divUserImage.src = userData.avatar_url;
    }

    if (divLogout) {
        divLogout.addEventListener("click", async () => {
            localStorage.removeItem(paramNameCode);
            localStorage.removeItem(paramNameAccessToken);
            localStorage.removeItem(paramNameUserData);
            location.href = CLIENT_HOST_LOGOUT;
        });
    }

})();