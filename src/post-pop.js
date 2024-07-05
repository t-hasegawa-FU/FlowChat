  // Get a reference to the database service
const database = firebase.database();

const td = new Date();
const today = ""+td.getFullYear() +"_"+ (td.getMonth()+1)+"_" + td.getDate() + "/";
let logInUser = "none";
const colors = ["#d2691e", "#ff0000", "#0000ff", "#000000"]

//以下でログイン処理を行う，ポップアップログインに変更（Firebaseの仕様変更）．
window.onload = function(){
      let provider = new firebase.auth.GoogleAuthProvider();
      provider.setCustomParameters({
        hd: 'g.u-fukui.ac.jp'
      });
      firebase.auth().signInWithPopup(provider)
          .then((result) => {
              
          }).catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              document.getElementById("User").innerText = errorCode + " : " + errorMessage;
          });
}
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
        const message = `${user.displayName}でログインしています`;
        document.getElementById('User').innerHTML =  message;
        console.log('ログインしています');
    } else {
          const message = `Failed ?`;
          document.getElementById('User').innerHTML = message;
    }
  });

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
