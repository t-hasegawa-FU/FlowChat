//学外で使用したいとの要望を受けログインなしでも利用できるように作成
//学内者用のとほぼ同じ


var database = firebase.database();

const td = new Date();
const today = ""+td.getFullYear() +"_"+ (td.getMonth()+1)+"_" + td.getDate() + "/";
var logInUser = "guest";


  //realtime databaseに書き込む
function writeUserData(comment) {
    var date = new Date();
    var time = date.getTime();
    var txtColor = document.getElementById("strColor").value;
    database.ref("comments/"+today).push({
        comment: comment,
        timeStamp: time,
        txtColor: txtColor,
        user : logInUser
    });
  
  }
  
  
  //ボタンでdatabaseに送信
  document.getElementById("sendButton").onclick =function (e){
    var input_message = document.getElementById("input_message").value;
    writeUserData(input_message)
    document.getElementById("input_message").value = "";
  }