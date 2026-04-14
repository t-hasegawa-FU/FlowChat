const database = firebase.database();

const td = new Date();
const today = "" + td.getFullYear() + "_" + (td.getMonth() + 1) + "_" + td.getDate() + "/";
let logInUser = "none";
const colors = ["#d2691e", "#ff0000", "#0000ff", "#000000"];

const loginButton = document.getElementById("loginButton");
const sendButton = document.getElementById("sendButton");
const userDiv = document.getElementById("User");

function onLoggedIn(user) {
    logInUser = user.displayName;
    userDiv.innerText = user.displayName + " でログインしています";
    loginButton.style.display = "none";
    sendButton.disabled = false;
}

function onLoggedOut() {
    logInUser = "none";
    userDiv.innerText = "ログインしていません";
    loginButton.style.display = "inline-block";
    sendButton.disabled = true;
}

// ページ読み込み時にログイン状態を確認（既存セッションがあればそのまま使う）
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        onLoggedIn(user);
    } else {
        onLoggedOut();
    }
});

// ボタン押下でポップアップログイン（ユーザー操作起因なのでブロックされない）
loginButton.onclick = function () {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({ hd: "g.u-fukui.ac.jp" });
    firebase.auth().signInWithPopup(provider)
        .catch((error) => {
            userDiv.innerText = "ログインエラー: " + error.code + " : " + error.message;
            console.error("signInWithPopup error:", error);
        });
};

// realtime database に書き込む
function writeUserData(comment) {
    const date = new Date();
    const time = date.getTime();
    let txtColor = document.getElementById("strColor").value;
    if (txtColor === "random") txtColor = getRandomColor();
    database.ref("comments/" + today).push({
        comment: comment,
        timeStamp: time,
        txtColor: txtColor,
        user: logInUser
    });
}

function getRandomColor() {
    const rnd = Math.floor(Math.random() * colors.length);
    return colors[rnd];
}

sendButton.onclick = function () {
    const input_message = document.getElementById("input_message").value;
    if (input_message.trim() === "") return;
    writeUserData(input_message);
    document.getElementById("input_message").value = "";
};
