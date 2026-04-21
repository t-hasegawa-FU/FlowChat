const database = firebase.database();

const td = new Date();
const today = "" + td.getFullYear() + "_" + (td.getMonth() + 1) + "_" + td.getDate() + "/";
const launchTime = new Date().getTime();

const marquee  = document.getElementById("marquee");
const logTable = document.getElementById("logTable");

let msgCount = 0;
const MSG_LIMIT = 30;

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
    // 先頭の絵文字だけを取り出す（空白の前まで）
    const match = text.match(/^(\S+)/);
    return match ? match[1] : text;
}

// ---- スタンプアニメーション ----
function showStampAnimation(msg) {
    const popup = document.createElement("div");
    popup.className = "stamp-popup";

    // ランダムな横位置（画面幅の10%〜80%）
    const xPos = Math.random() * (window.innerWidth * 0.7) + window.innerWidth * 0.1;
    popup.style.left = xPos + "px";

    const emojiDiv = document.createElement("div");
    emojiDiv.className = "stamp-emoji";
    emojiDiv.textContent = extractEmoji(msg.comment);

    const userDiv = document.createElement("div");
    userDiv.className = "stamp-user";
    userDiv.textContent = msg.user || "";

    popup.appendChild(emojiDiv);
    popup.appendChild(userDiv);
    document.body.appendChild(popup);

    // アニメーション終了後に要素を削除
    popup.addEventListener("animationend", () => {
        document.body.removeChild(popup);
    });
}

// ---- 通常テキストの横スクロール ----
function showScrollText(msg) {
    const p = document.createElement("p");
    p.textContent = msg.comment;

    const yPos = Math.random() * (window.innerHeight - 100);
    p.style.top = yPos + "px";
    p.style.color = msg.txtColor;

    marquee.appendChild(p);
    msgCount++;

    if (msgCount > MSG_LIMIT) {
        // 古いメッセージを削除（最初のp要素）
        const first = marquee.querySelector("p");
        if (first) marquee.removeChild(first);
        msgCount--;
    }

    p.addEventListener("animationend", () => {
        if (marquee.contains(p)) marquee.removeChild(p);
        msgCount = Math.max(0, msgCount - 1);
    });
}

// ---- ログテーブルへ追記 ----
function addToLog(msg) {
    const row = logTable.insertRow(0);
    const cell = row.insertCell();
    cell.textContent = (msg.user || "") + ": " + msg.comment;
}

// ---- Firebase 受信 ----
database.ref("comments/" + today).on("child_added", (data) => {
    const msg = data.val();
    if (msg.timeStamp < launchTime) return;

    if (isStamp(msg.comment)) {
        showStampAnimation(msg);
    } else {
        showScrollText(msg);
    }
    addToLog(msg);
});

// ---- Shiftキーでログ表示切替 ----
document.addEventListener("keydown", (event) => {
    if (event.code === "ShiftLeft" || event.code === "ShiftRight") {
        const log = document.getElementById("commentLog");
        log.style.visibility = log.style.visibility === "visible" ? "hidden" : "visible";
    }
});
