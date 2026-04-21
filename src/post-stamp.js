const database = firebase.database();

const td = new Date();
const today = "" + td.getFullYear() + "_" + (td.getMonth() + 1) + "_" + td.getDate() + "/";
let logInUser = "none";
const colors = ["#d2691e", "#ff0000", "#0000ff", "#000000"];

const loginButton = document.getElementById("loginButton");
const userDiv = document.getElementById("User");
const stampButtons = document.querySelectorAll(".stamp-btn");
const toast = document.getElementById("toast");

function onLoggedIn(user) {
    logInUser = user.displayName;
    userDiv.innerText = user.displayName + " でログインしています";
    loginButton.style.display = "none";
    stampButtons.forEach(btn => btn.disabled = false);
}

function onLoggedOut() {
    logInUser = "none";
    userDiv.innerText = "ログインしていません";
    loginButton.style.display = "inline-block";
    stampButtons.forEach(btn => btn.disabled = true);
}

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        onLoggedIn(user);
    } else {
        onLoggedOut();
    }
});

loginButton.onclick = function () {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({ hd: "g.u-fukui.ac.jp" });
    firebase.auth().signInWithPopup(provider)
        .catch((error) => {
            userDiv.innerText = "ログインエラー: " + error.code + " : " + error.message;
            console.error("signInWithPopup error:", error);
        });
};

function getRandomColor() {
    const rnd = Math.floor(Math.random() * colors.length);
    return colors[rnd];
}

function writeStamp(text) {
    const date = new Date();
    const time = date.getTime();
    const txtColor = getRandomColor();
    database.ref("comments/" + today).push({
        comment: text,
        timeStamp: time,
        txtColor: txtColor,
        user: logInUser
    });
}

function showToast(text) {
    toast.textContent = text + " を送信しました";
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 1500);
}

stampButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const text = btn.dataset.text;
        writeStamp(text);
        showToast(text);
    });
});
