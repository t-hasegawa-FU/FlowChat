/*
ウェブページを起動したときの時間を記録，
これにより起動以前のコメントが流れないようにする．
*/
var date = new Date();
var launchTime = date.getTime();
var database = firebase.database();

const td = new Date();
const today = ""+td.getFullYear() +"_"+ (td.getMonth()+1)+"_" + td.getDate() + "/";

//動的に要素を追加するための準備
var div = document.createElement("div");

div.className = "marquee";

var commentLog = document.createElement("div");

commentLog.id = "commentLog";

var table = document.createElement( 'table' );

var msgArray = [];
let cmtLimit = 30;//表示されるコメント最大数

document.body.appendChild(div);
div.appendChild(commentLog);
commentLog.appendChild(table);



//チャット表示など
function showChat(msg){
  var p = document.createElement("p");
  p.textContent = msg.comment;

  let cmtPos = getRandomInt(0,document.body.clientHeight-100);
  if (cmtPos > document.body.clientHeight){
    cmtPos = body.clientHeight-100;
  }
  p.style.top = cmtPos + "px";
  p.style.color = msg.txtColor;
  //p.style.whiteSpace = "pre" //改行コード有効化　ただ，fontsizeいい感じに変えないと事故る
  msgArray.push(msg.comment);
  console.log(msgArray);
  div.appendChild(p);
  let newrow = table.insertRow(0);
  let newCell = newrow.insertCell();
  newCell.appendChild(document.createTextNode(msg.comment));

  

  if(msgArray.length >= cmtLimit){
    //表示バグの回避用
    div.removeChild(div.children[2]);
  };
}

//表示場所をランダムにする
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

//受信処理
database.ref("comments/"+today).on("child_added", function(data) {
  var msg = data.val();//msgオブジェクト(comment, timeStampが入ってる)
  //自分が起動してからのコメントのみを取得・表示する

    if(msg.timeStamp >= launchTime){ 
        showChat(msg);
    }
});


//シフトボタンでログ表示　or　非表示
document.addEventListener('keydown', (event) => {
  let keyName = event.code;
  let tableDiv = document.getElementById("commentLog")

  if (keyName == "ShiftLeft" || keyName == "ShiftRight" ) {
    if(tableDiv.style.visibility != "hidden"){
      tableDiv.style.visibility = "hidden";
    }else{
      tableDiv.style.visibility = "visible";
    }
      
      console.log(tableDiv.style.visibility);
  } else{
      console.log(keyName);
  }
});