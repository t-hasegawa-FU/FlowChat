const database = firebase.database();

const td = new Date();
const today = "" + td.getFullYear() + "_" + (td.getMonth() + 1) + "_" + td.getDate() + "/";
let logInUser = "none";
const colors = ["#d2691e", "#ff0000", "#0000ff", "#000000"];

const loginButton = document.getElementById("loginButton");
const sendButton = document.getElementById("sendButton");
const userDiv = document.getElementById("User");
const toast = document.getElementById("toast");

// スタンプボタンはDOMContentLoaded後に取得
let stampButtons = [];

function updateButtonStates(enabled) {
    sendButton.disabled = !enabled;
    stampButtons.forEach(btn => { btn.disabled = !enabled; });
}

function onLoggedIn(user) {
    logInUser = user.displayName;
    userDiv.innerText = user.displayName + " でログインしています";
    loginButton.style.display = "none";
    updateButtonStates(true);
}

function onLoggedOut() {
    logInUser = "none";
    userDiv.innerText = "ログインしていません";
    loginButton.style.display = "inline-block";
    updateButtonStates(false);
}

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        onLoggedIn(user);
    } else {
        onLoggedOut();
    }
});

loginButton.addEventListener("click", function () {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({ hd: "g.u-fukui.ac.jp" });
    firebase.auth().signInWithPopup(provider)
        .catch((error) => {
            userDiv.innerText = "ログインエラー: " + error.code + " : " + error.message;
            console.error("signInWithPopup error:", error);
        });
});

function getRandomColor() {
    const rnd = Math.floor(Math.random() * colors.length);
    return colors[rnd];
}

function writeComment(text, txtColor) {
    const date = new Date();
    const time = date.getTime();
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

sendButton.addEventListener("click", function () {
    const input_message = document.getElementById("input_message").value;
    if (input_message.trim() === "") return;
    let txtColor = document.getElementById("strColor").value;
    if (txtColor === "random") txtColor = getRandomColor();
    writeComment(input_message, txtColor);
    document.getElementById("input_message").value = "";
});

// スタンプボタンのイベント登録
document.querySelectorAll(".stamp-btn").forEach(btn => {
    stampButtons.push(btn);
    btn.addEventListener("click", function () {
        const text = this.dataset.text;
        writeComment(text, getRandomColor());
        showToast(text);
    });
});
