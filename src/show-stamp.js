/*
ウェブページを起動したときの時間を記録，
これにより起動以前のコメントが流れないようにする．
*/
const date = new Date();
const launchTime = date.getTime();
const database = firebase.database();

const td = new Date();
const today = "" + td.getFullYear() + "_" + (td.getMonth() + 1) + "_" + td.getDate() + "/";

// 動的に要素を追加するための準備（show.js と同じ構造）
let div = document.createElement("div");
div.className = "marquee";

let commentLog = document.createElement("div");
commentLog.id = "commentLog";

let table = document.createElement("table");

let msgArray = [];
let cmtLimit = 30; // 表示されるコメント最大数

document.body.appendChild(div);
div.appendChild(commentLog);
commentLog.appendChild(table);

// スタンプとして扱う先頭絵文字の一覧
const stampEmojis = [
    "👍", "❓", "🤔", "🔄", "💡",
    "✏️", "📖", "✅", "🐢", "⚡",
    "😄", "😴", "👏", "☕", "🙋", "🎉"
];

function isStamp(text) {
    return stampEmojis.some(emoji => text.startsWith(emoji));
}

function extractEmoji(text) {
    // 先頭の絵文字部分だけ取り出す（最初のスペースの前まで）
    const match = text.match(/^(\S+)/);
    return match ? match[1] : text;
}

// スタンプアニメーション（ユーザー名は表示しない）
function showStamp(msg) {
    const popup = document.createElement("div");
    popup.className = "stamp-popup";

    // ランダムな横位置（画面幅の10%〜80%の範囲）
    const xPos = Math.random() * (window.innerWidth * 0.7) + window.innerWidth * 0.1;
    popup.style.left = xPos + "px";

    const emojiDiv = document.createElement("div");
    emojiDiv.className = "stamp-emoji";
    emojiDiv.textContent = extractEmoji(msg.comment);

    popup.appendChild(emojiDiv);
    document.body.appendChild(popup);

    popup.addEventListener("animationend", () => {
        if (document.body.contains(popup)) document.body.removeChild(popup);
    });
}

// 通常テキストの横スクロール（show.js の showChat と同じ挙動）
function showChat(msg) {
    let p = document.createElement("p");
    p.textContent = msg.comment;

    let cmtPos = getRandomInt(0, document.body.clientHeight - 100);
    if (cmtPos > document.body.clientHeight) {
        cmtPos = document.body.clientHeight - 100;
    }
    p.style.top = cmtPos + "px";
    p.style.color = msg.txtColor;

    msgArray.push(msg.comment);
    console.log(msgArray);
    div.appendChild(p);

    let newrow = table.insertRow(0);
    let newCell = newrow.insertCell();
    newCell.appendChild(document.createTextNode(msg.comment));

    if (msgArray.length >= cmtLimit) {
        div.removeChild(div.children[2]);
    }
}

// ログへの追記（スタンプも通常テキストも記録）
function addToLog(msg) {
    let newrow = table.insertRow(0);
    let newCell = newrow.insertCell();
    newCell.appendChild(document.createTextNode(msg.comment));
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

// 受信処理
database.ref("comments/" + today).on("child_added", function (data) {
    let msg = data.val();
    if (msg.timeStamp >= launchTime) {
        if (isStamp(msg.comment)) {
            showStamp(msg);
            addToLog(msg);
        } else {
            showChat(msg);
        }
    }
});

// シフトボタンでログ表示 or 非表示（show.js と同じ）
document.addEventListener("keydown", (event) => {
    let keyName = event.code;
    let tableDiv = document.getElementById("commentLog");

    if (keyName === "ShiftLeft" || keyName === "ShiftRight") {
        if (tableDiv.style.visibility !== "hidden") {
            tableDiv.style.visibility = "hidden";
        } else {
            tableDiv.style.visibility = "visible";
        }
        console.log(tableDiv.style.visibility);
    } else {
        console.log(keyName);
    }
});
