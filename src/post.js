const firebaseConfig = {
  apiKey: "AIzaSyAYogMcVUqjPkbrltK02NGe_cGQlmO04AY",
  authDomain: "haselab-flow-chat.firebaseapp.com",
  projectId: "haselab-flow-chat",
  storageBucket: "haselab-flow-chat.appspot.com",
  messagingSenderId: "272062347835",
  appId: "1:272062347835:web:bcb7dcff8ead6b82ed3a1e",
  measurementId: "G-94RR9DC9H7"
};
const app = initializeApp(firebaseConfig);
  
  // Get a reference to the database service
const database = app.database();

const td = new Date();
const today = ""+td.getFullYear() +"_"+ (td.getMonth()+1)+"_" + td.getDate() + "/";
var logInUser = "none";


//以下でログイン処理を行う，学生の手間を省くため自動でログインするようになっている．
window.onload = function(){
  firebase.auth().getRedirectResult().then(function(result) {
    logInUser = result.user;
    }).catch(function(error) {
    console.log('failure in Redirect');
    });
    
    firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      logInUser = user.uid;
      document.getElementById("User").innerText = user.email +"でログインしています";
    } else {

      console.log('no loginn user');
      var provider = new firebase.auth.GoogleAuthProvider();
      provider.setCustomParameters({
        hd: 'g.u-fukui.ac.jp'
      });
      firebase.auth().signInWithRedirect(provider);
    }
    });
}




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