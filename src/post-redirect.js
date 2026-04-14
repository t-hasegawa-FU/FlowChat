const database = firebase.database();

const td = new Date();
const today = "" + td.getFullYear() + "_" + (td.getMonth() + 1) + "_" + td.getDate() + "/";
let logInUser = "none";
const colors = ["#d2691e", "#ff0000", "#0000ff", "#000000"];

function enableSendButton() {
    document.getElementById("sendButton").disabled = false;
}

function showLoginRedirectMessage() {
    document.getElementById("caution-redirect").style.display = "block";
}

function redirectToLogin() {
    showLoginRedirectMessage();
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({ hd: "g.u-fukui.ac.jp" });
    // リダイレクト前に少し待ってメッセージを表示する
    setTimeout(() => {
        firebase.auth().signInWithRedirect(provider);
    }, 800);
}

// リダイレクト後の結果を取得してからログイン状態を確認する
window.addEventListener("DOMContentLoaded", () => {
    firebase.auth().getRedirectResult()
        .then((result) => {
            // リダイレクト結果の処理完了後にonAuthStateChangedが発火するので特に何もしない
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            document.getElementById("User").innerText = "ログインエラー: " + errorCode + " : " + errorMessage;
            console.error("getRedirectResult error:", error);
        });

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            logInUser = user.displayName;
            document.getElementById("User").innerText = user.displayName + " でログインしています";
            document.getElementById("caution-redirect").style.display = "none";
            enableSendButton();
        } else {
            document.getElementById("User").innerText = "ログインしていません";
            redirectToLogin();
        }
    });
});

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

document.getElementById("sendButton").onclick = function () {
    const input_message = document.getElementById("input_message").value;
    if (input_message.trim() === "") return;
    writeUserData(input_message);
    document.getElementById("input_message").value = "";
};
