(function () {
    'use strict';

  var app = {
    isFirstUnauthCheckDone: false,
    isFirstAuthCheckDone: false,

    currentPage: "",
    user: undefined,
    db: firebase.firestore(),

    isLoading: true,
    visibleCards: {},
    selectedCities: [],
    spinner: document.querySelector('.loader'),
    cardTemplate: document.querySelector('.cardTemplate'),
    container: document.querySelector('.main'),
    addDialog: document.querySelector('.dialog-container'),
    daysOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  };

    /*****************************************************************************
     *
     * Event listeners for UI elements
     *
     ****************************************************************************/

    $("#senpai1 .login-register-btn").click(function(){
        if(app.currentPage == "signup"){
            signupUser();
            loginUser();
        }else{
            loginUser();
        }
    });

     $("#senpai1 .login-register-page-change a").click(switchSenpaiPage);

    /*****************************************************************************
     *
     * Methods to update/refresh the UI
     *
     ****************************************************************************/
    function loadSignupPage(){
        $("#senpai1 .login-register-btn").text("Sign up");
        $("#senpai1 .login-register-page-change span").text("Have an account?");
        $("#senpai1 .login-register-page-change a").text("Log in!");
        app.currentPage = "signup";
    }

    function loadLoginPage(){
        $("#senpai1 .login-register-btn").text("Log in");
        $("#senpai1 .login-register-page-change span").html("Don't have an account?");
        $("#senpai1 .login-register-page-change a").text("Sign up!");
        app.currentPage = "login";
    }

    function switchSenpaiPage(){
        if (app.currentPage == "login"){
            loadSignupPage();
        }else{
            loadLoginPage();
        }
    }

    /*****************************************************************************
     *
     * Methods for dealing with the model
     *
     ****************************************************************************/



    /*****************************************************************************
     *
     * Methods for User Authentication
     *
     ****************************************************************************/

     function signupUser(){
        firebase.auth().createUserWithEmailAndPassword($("#email").val(), $("#password").val()).catch(function(error) {
            /*// Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;*/
        });
     }

     function setUpAccountData(){
        app.db.collection("user-settings").doc(app.user.uid).set({
            isSetupFinished: false
        })
        .then(function() {
            console.log("Document successfully written!");
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });
     }

     function loginUser(){
        firebase.auth().signInWithEmailAndPassword($("#email").val(), $("#password").val()).catch(function(error) {
          /*// Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;*/
        });
     }


    /************************************************************************
     *
     * Code required to start the app
     *
     * NOTE: To simplify this codelab, we've used localStorage.
     *   localStorage is a synchronous API and has serious performance
     *   implications. It should not be used in production applications!
     *   Instead, check out IDB (https://www.npmjs.com/package/idb) or
     *   SimpleDB (https://gist.github.com/inexorabletash/c8069c042b734519680c)
     ************************************************************************/

    firebase.auth().onAuthStateChanged(function(user) {
        app.user = user;
        if (user!=undefined && user.emailVerified) {
            if(app.isFirstAuthCheckDone){
                //show senpai2
                //load fridge page
            }else{
                app.isFirstAuthCheckDone=true;
                //check if user finished settup
                    //true
                        //load fridge page in senpai2
                    //false
                        // load setup page in senpai2
            }
        } else if(user && !user.emailVerified) {
            setUpAccountData();
            //show a verification screen and continue
        }else{
            if(app.isFirstUnauthCheckDone){
                //User is signed out
                
            }else{
                //load signup page
                //executes when app runs for the first time if user is not auth.
                app.isFirstUnauthCheckDone = true;
                switchSenpaiPage();
            }
        }
    });

    //Materialize - setup side drawer navigation
    $(".button-collapse").sideNav();

})();

// Register our service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js');
    });
}
