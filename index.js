import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyCOB2qEHCqj4ogZdjIH4Ff-tl-StyLShOk",
  authDomain: "cpprog03.firebaseapp.com",
  projectId: "cpprog03",
  storageBucket: "cpprog03.appspot.com",
  messagingSenderId: "316552887176",
  appId: "1:316552887176:web:2d8b0fc17477132873d83d"
};

  import {
    getFirestore, doc, getDoc, collection, addDoc, setDoc, updateDoc, deleteDoc, deleteField, onSnapshot
  }
  from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  const client = getFirestore();
//Web-view
let deskStat=[];
let studeData;
let count;
let Tablecells;
let Late;
const close_form = document.getElementById('close_form');
let qrbtn = document.getElementById('qr-btn');
const stid = document.getElementById('stud-id');
const stname = document.getElementById('stud-name');
const stsec = document.getElementById('sect-name');
const courseName = document.getElementById('course-name');
const save_btn = document.getElementById('save_btn');
const tname = document.getElementById('teacher-name');


//web-view
  async function checkSit(){

    db.collection("COMLAB-ATTENDANCE-TABLE").onSnapshot((querySnapshot) => {
      querySnapshot.forEach((studentdata) => {
        studeData = studentdata.data();
        const dataID = studentdata.id;
        //console.log(data,dataID);
        deskStat.push({ ...studeData,dataID});

        deskStat.forEach((data)=>{
          if (data.Status==="Occupied" && data.SchoolOnTime==="true"){
            const cells = document.getElementsByTagName('td');
            cells[data.Desk].style = "background-color: yellow; padding:10px; color: navy;";
            cells[data.Desk].innerHTML = '<span class="desk">' + data.Com_Unit_Num + '</span>' + "Occupied! <br> BUT LATE!";
          }else if (data.Status==="Occupied" && data.SchoolOnTime==="false"){
            const cells = document.getElementsByTagName('td');
            cells[data.Desk].style = "background-color: red; padding:10px;";
            cells[data.Desk].innerHTML = '<span class="desk">' + data.Com_Unit_Num + '</span>' + "Occupied! <br> Ontime";
          }else{
            const cells = document.getElementsByTagName('td');
            cells[data.Desk].style = "background-color: lightgreen;";
          }
         })
      })
    })
  }

      document.addEventListener('DOMContentLoaded', function() {
        let cells = document.getElementsByTagName('td');
        for (let i = 0; i < cells.length; i++) {
          (function(i) {
            cells[i].addEventListener('click', function(){
              if(cells[i].innerHTML !== ""){
                alert("This Pc is occupied!");
              }else{
                getDateHour();
                Tablecells = i;
                Takepc();
                document.getElementById('web-form').style="display: block;";
              }
            })
          })(i); 
        }
      });

      let pcnumber = "B1-28_DESKTOPPCNUMBER-"+Tablecells;
      let ToDeleteDoc;
      async function Takepc(){
      const pcDisplay = Tablecells;  
      pcnumber = "B1-28_DESKTOPPCNUMBER-"+Tablecells;
        ToDeleteDoc = doc(client, "SOME-IS-TYPING",pcnumber);
                setDoc( 
                  ToDeleteDoc, {
                    Desk : pcDisplay,
            })
      }

      async function ToSaveData(){
      const pcDisplay = Tablecells+1;  
      pcnumber = "B1-28_DESKTOPPCNUMBER-"+Tablecells;
      console.log(pcnumber);
        var ref = doc(client, "COMLAB-ATTENDANCE-TABLE",pcnumber);
                setDoc( 
                ref, {
                    Desk : Tablecells,
                    Status : "Occupied",
                    Student_ID : stid.value,
                    Student_Name :stname.value,
                    Student_Section : stsec.value,
                    Student_Course : courseName.value,
                    Teacher_Name : tname.value,
                    Com_Unit_Num : pcDisplay,
                    SchoolOnTime : Late,
                    Date_Scan : getDateHour()
            })
        }

      close_form.addEventListener('click', async function(){
        await deleteDoc(ToDeleteDoc);
        //TypingCheck()
        TypingCheckStudent();
        document.getElementById('web-form').style="display: none;";
      })
      save_btn.addEventListener('click', async function(){
        await deleteDoc(ToDeleteDoc);
        ToSaveData();
        alert("Data Save Successfully");
        document.getElementById('web-form').style="display: none;";
        setInterval(function() {
          location.reload();
        }, 2000);
        
      })
      

//Phone-view

qrbtn.addEventListener('click', function() {
  getDateHour();
  if(stid.value==="" || stname.value==="" || stsec.value ==="" || courseName.value===""){
    alert("Please fill all the requirements!");
  }else if(Late ==="not Allow"){
    alert("attendance and log in will cancel")
  }else{
    myqrcode.classList.add("show");
    document.getElementById('myqrcode').style="display: block;";
    function domReady(fn) {
        if (document.readyState === "complete" || document.readyState === "interactive") {
            setTimeout(fn, 1);
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }
    domReady(function() {
        var myqr = document.getElementById('you-qr-result');
        var lastResult, counterResults = 0;
        function onScanSuccess(decodeText, decodeResult) {
            if (decodeText !== lastResult) {
                ++counterResults;
                lastResult = decodeText;
                
                //https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ROOMB1.28,B1-28_DESKTOPPCNUMBER-00,0,1
                let qrResults = decodeText,decodeResult;
                const Toseperate = qrResults.split(",");
                qrResults = Toseperate[1];
                const Desk = Toseperate[2];
                const pcDisplay = Toseperate[3];
                createData(qrResults,Desk,pcDisplay);
                myqrcode.classList.remove("show");
                document.getElementById('myqrcode').style="display: none;";
                alert("Scan Successfully");
                myqr.innerHTML = `You scanned ${decodeText}`;
            }
            
        }
        var htmlscanner = new Html5QrcodeScanner("my-qr-reader", { fps: 10, qrbox: 250 });
        htmlscanner.render(onScanSuccess);
    });
  }
});


async function createData(pcnumber,Desk,pcDisplay){
  
  var ref = doc(client, "COMLAB-ATTENDANCE-TABLE",pcnumber);
                setDoc( 
                ref, {
                    Desk : Desk,
                    Status : "Occupied",
                    Student_ID : stid.value,
                    Student_Name :stname.value,
                    Student_Section : stsec.value,
                    Student_Course : courseName.value,
                    Teacher_Name : tname.value,
                    Com_Unit_Num : pcDisplay,
                    SchoolOnTime : Late,
                    Date_Scan : getDateHour()
            })
        }

closecamera.addEventListener("click", function () {
myqrcode.classList.remove("show");
document.getElementById('myqrcode').style="display: none;";
  });
  window.addEventListener("click", function (event) {
  if (event.target == myqrcode) {
    myqrcode.classList.remove("show");
  }
  });
  closePopup.addEventListener("click", function () {
    myPopup.classList.remove("show");
  });
  window.addEventListener("click", function (event) {
  if (event.target == myPopup) {
    myPopup.classList.remove("show");
  }
  });

function getDateHour(){
let date = new Date();
let hours = date.getHours();
let minutes = date.getMinutes();
let ampm = hours >= 12 ? 'pm' : 'am';
hours = hours % 12;
hours = hours ? hours : 12; 
minutes = minutes < 10 ? '0'+minutes : minutes;

let strTime = hours + ':' + minutes + ampm;

let day = ("0" + date.getDate()).slice(-2);
let month = ("0" + (date.getMonth() + 1)).slice(-2);
let year = date.getFullYear();
let strDate =  month + "/" + day + "/" + year;
let dateTime = strTime + " " + strDate;


if(date.getMinutes() > 20){
  Late = "true";
} else if(date.getMinutes()>40) {
  Late ="not Allow"
}else{
  Late = "false";
}

return dateTime
}

/*
async function TypingCheck(){
  const cells = document.getElementsByTagName('td');
  let desk = 0;
  db.collection("SOME-IS-TYPING").onSnapshot((querySnapshot) => {
    if (querySnapshot.empty){
      const ref = db.collection("SOME-IS-TYPING").doc(pcnumber);
      ref.onSnapshot((docSnapshot) => {
        if (docSnapshot.exists) {
          const TypingData = docSnapshot.data();
          const type = TypingData.TYPING;
          desk = TypingData.Desk;
          console.log(type);
          
          cells[desk].style = "background-color: purple; padding: 10px;";
        }else{

          cells[desk].style = "background-color: red;padding:10px;";
        }
      });
    }
  })
}
*/
async function TypingCheckStudent(){
  let noTyping = 0;
  db.collection("SOME-IS-TYPING").onSnapshot((querySnapshot) => {
    querySnapshot.forEach((studentdata) => {
      const desk = studentdata.data().Desk;
      const cells = document.getElementsByTagName('td');
      cells[desk].style = "background-color: purple; padding: 10px; ";
      noTyping = desk;
  })
  if (querySnapshot.size === 0) {
    console.log("working");
    const cells = document.getElementsByTagName('td');
    cells[noTyping].style = "background-color: lightgreen; padding: 10px;";
}
  })
}

window.onload = function() {
  //TypingCheck();
  TypingCheckStudent();
  checkSit();
  };

  
setInterval(function() {
  if (count < 3) {
    // Your function here
    
    count++;
  } else {
    location.reload();
    count="";
  }
}, 15000);
