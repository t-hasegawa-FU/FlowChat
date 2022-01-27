  // Get a reference to the database service
const database = firebase.database();

const td = new Date();
const today = ""+td.getFullYear() +"_"+ (td.getMonth()+1)+"_" + td.getDate() + "/";
let logInUser = "none";


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
      let provider = new firebase.auth.GoogleAuthProvider();
      provider.setCustomParameters({
        hd: 'g.u-fukui.ac.jp'
      });
      firebase.auth().signInWithRedirect(provider);
    }
    });
}




  //realtime databaseに書き込む
function writeUserData(comment) {
    let date = new Date();
    let time = date.getTime();
    let txtColor = document.getElementById("strColor").value;
    database.ref("comments/"+today).push({
        comment: comment,
        timeStamp: time,
        txtColor: txtColor,
        user : logInUser
    });
  
  }
  
  
  //ボタンでdatabaseに送信
  document.getElementById("sendButton").onclick =function (e){
    let input_message = document.getElementById("input_message").value;
    writeUserData(input_message)
    document.getElementById("input_message").value = "";
  }