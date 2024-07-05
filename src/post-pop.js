  // Get a reference to the database service
const database = firebase.database();

const td = new Date();
const today = ""+td.getFullYear() +"_"+ (td.getMonth()+1)+"_" + td.getDate() + "/";
let logInUser = "none";
const colors = ["#d2691e", "#ff0000", "#0000ff", "#000000"]


/*
//以下でログイン処理を行う，ポップアップログインに変更（Firebaseの仕様変更）．
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
      firebase.auth().signInWithPopup(provider);
    }
    });
}
*/
  //ボタンでGoogle Auth
  document.getElementById("logginButton").onclick =function (e){
      alert("test");
      firebase.auth().signInWithPopup(provider)
          .then((result) => {
              const user = result.user;
              document.getElementById("User").innerText = user + "でログインしています．";
          }).catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              const email = error.customData.email;
              document.getElementById("User").innerText = errorCode + " : " + errorMessage;
          });
  }

  //realtime databaseに書き込む
function writeUserData(comment) {
    let date = new Date();
    let time = date.getTime();
    let txtColor = document.getElementById("strColor").value;
    if (txtColor === "random") txtColor = getRandomColor();
    database.ref("comments/"+today).push({
        comment: comment,
        timeStamp: time,
        txtColor: txtColor,
        user : logInUser
    });
  
  }
  
function getRandomColor() {
    const rnd = Math.floor(Math.random() * colors.length);
    return colors[rnd];
}
  
  //ボタンでdatabaseに送信
  document.getElementById("sendButton").onclick =function (e){
    let input_message = document.getElementById("input_message").value;
    writeUserData(input_message)
    document.getElementById("input_message").value = "";
  }
