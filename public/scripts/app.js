(function () {
    'use strict';

  var app = {
    isFirstAuthCheck: true,

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

    //Create a function for registering 
    //and create a function for logging in
    $(".login-register-btn").click(function(){
        firebase.auth().createUserWithEmailAndPassword($("#email").val(), $("#password").val()).catch(function(error) {
        /*
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // ...
          console.log(errorCode + " "+ errorMessage);*/
        });
        firebase.auth().signInWithEmailAndPassword($("#email").val(), $("#password").val()).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // ...
        });

    });
    
    /*****************************************************************************
     *
     * Methods to update/refresh the UI
     *
     ****************************************************************************/

    /*****************************************************************************
     *
     * Methods for dealing with the model
     *
     ****************************************************************************/

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
     //toggle loader on
    firebase.auth().onAuthStateChanged(function(user) {
        if(app.isFirstAuthCheck){
            app.isFirstAuthCheck == false;
            if (user!=undefined && user.emailVerified) {
                //check if user finished settup
                    //true
                        //load fridge page in senpai2
                    //false
                        // load setup page in senpai2
                //show senpai2
                //toggle loader off
            } else if(user && !user.emailVerified) {
                //show a verification screen and continue
            }else{
            //User is signed out
            }
        }else{
            if (user!=undefined && user.emailVerified) {
            } else if(user && !user.emailVerified) {
            }else{
            //User is signed out
            }
        }
    });

    //Materialize - setup side drawer navigation
    $(".button-collapse").sideNav();

})();

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js');
    });
}
