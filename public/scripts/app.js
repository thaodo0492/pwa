(function () {
    'use strict';

    var app = {
        //ELEMENTS
        sp1: $("#senpai1"),
        sp2: $("#senpai2"),
        loader: $("#loader"),

        /*
         * Used to figure out if we should show the user 
         */
        isFirstUnauthCheckDone: false,
        isFirstAuthCheckDone: false,

        //page currently shown (it's going to load signup first)
        currentPage: "signup",
        currentSenpai: $("#senpai1"),

        //user object
        user: undefined,
        //userSettings document
        docRefUserSettings: undefined,

        //database
        db: firebase.firestore(),

        //is app loading
        isLoading: true
    };

    /*****************************************************************************
     *
     * Event listeners for UI elements
     *
     ****************************************************************************/

    $("#senpai1 .login-register-btn").click(function(){
        toggleLoaderOn(true);
        if(app.currentPage == "signup"){
            signupUser();
            loginUser();
        }else{
            loginUser();
        }
    });

     $("#senpai1 .login-register-page-change a").click(switchLoginSignupPage);

    /*****************************************************************************
     *
     * Methods to update/refresh the UI
     *
     ****************************************************************************/
    function toggleLoaderOn(toggleOn){
        if(toggleOn == undefined){
            if(app.isLoading){
                toggleLoaderOn(false);
            }else{
                toggleLoaderOn(true);
            }
        }else{
            if(toggleOn){
                app.isLoading=true;
                app.loader.css("display","block");
            }else{
                app.isLoading=false;
                app.loader.css("display","none");
            }
        }
    }

    function loadSignupPage(){
        $("#senpai1 .login-register-btn").text("Sign up");
        $("#senpai1 .login-register-page-change span").text("Have an account?");
        $("#senpai1 .login-register-page-change a").text("Log in!");
        app.currentPage = "signup";
        app.currentSenpai = app.sp1;
    }

    function loadLoginPage(){
        $("#senpai1 .login-register-btn").text("Log in");
        $("#senpai1 .login-register-page-change span").html("Don't have an account?");
        $("#senpai1 .login-register-page-change a").text("Sign up!");
        app.currentPage = "login";
        app.currentSenpai = app.sp1;
    }

    function switchLoginSignupPage(page){
        if(page == "login" || page == "signup"){
            if(page == "login"){
                loadLoginPage();
            }else{
                loadSignupPage();
            }
        }else{
            if (app.currentPage == "login"){
                loadSignupPage();
            }else{
                loadLoginPage();
            }   
        }
    }

    function showSenpai(number){
        if(number==1){
            app.currentSenpai = app.sp1;
            app.sp1.css("display","block");
            app.sp2.css("display","none");
        }else{
            app.currentSenpai = app.sp2;
            app.sp1.css("display","none");
            app.sp2.css("display","block");
        }
    }

    function loadMyFridgePage(){
        toggleLoaderOn(true);
        $.get( "partials/myFridge.html", function( data ) {
          $( ".main" ).html( data );
        }).always(function() {
            //request finished
            getProductsCollection().forEach(function(doc){
                console.log("inside load fridge");
                console.log(doc.id);
            });
            alert( "finished" );
        });
        toggleLoaderOn(false);
    }


    /*****************************************************************************
     *
     * Methods for dealing with the model
     *
     ****************************************************************************/
     
     function getProductsCollection(){
        var collectionProducts;
        app.db.collection("fridges/"+app.user.uid+"/products").get().then(function(querySnapshot) {
            collectionProducts = querySnapshot;
            querySnapshot.forEach(function(doc) {
                console.log(doc.id, " => ", doc.data());
            });
            return collectionProducts;
        });
    };


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

    // After a user was created with Auth.module, create settings and fridge for the user in the firestore database
     function setUpAccountData(){
        app.db.collection("user-settings").doc(app.user.uid).set({
            isSetupFinished: false
        })
        .then(function() {
            console.log("User settings successfully created!");
            app.db.collection("fridges").doc(app.user.uid).set({

            })
            .then(function(){
                console.log("User fridge successfully created!");
                /*app.db.collection("fridges/"+app.user.uid+"/products").add({

                })
                .then(function(docRef) {
                    console.log("User products created!: ", docRef.id);
                })
                .catch(function(error) {
                    console.error("Error adding document: ", error);
                });*/
            })
            .catch(function(error){
                console.error("Error writing document: ", error);
            });
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
        toggleLoaderOn(false);
        app.user = user;
        if (user!=undefined && user.emailVerified) {
            if(app.isFirstAuthCheckDone){
                showSenpai(2);
                //load fridge page
            }else{
                app.isFirstAuthCheckDone=true;
                showSenpai(2);
                //show senpai2
                docRefUserSettings = app.db.collection("user-settings").doc(user.uid);
                //get the user-settings document
                docRef.get().then(function(doc) {
                    if (doc.exists) {
                        //check if user finished settup
                            //true
                        if(doc.data().isSetupFinished) {
                                //load fridge page in senpai2
                            loadMyFridgePage();
                        }else{
                            loadMyFridgePage();
                            //false
                                // load setup page in senpai2
                        }
                    } else {
                        console.log("No such user-settings document!");
                    }
                }).catch(function(error) {
                    console.log("Error getting settings document:", error);
                });

            }
        } else if(user && !user.emailVerified) {
            if(app.isFirstAuthCheckDone=true){ //todelete if
                setUpAccountData();
            }//todelete if

            //don't verify e-mail just yet
                app.isFirstAuthCheckDone=true;
                showSenpai(2);
                loadMyFridgePage();
                //check if user finished settup
                    //true
                        //load fridge page in senpai2
                    //false
                        // load setup page in senpai2


            //swal
            //show a verification screen and continue

            /*user.sendEmailVerification().then(function() {
              // Email sent.
            }).catch(function(error) {
              // An error happened.
            });*/
        }else{
            if(app.isFirstUnauthCheckDone){
                //User is signed out
                
            }else{
                //load signup page
                //executes when app runs for the first time if user is not auth.
                app.isFirstUnauthCheckDone = true;
            }
        }
    });

    switchLoginSignupPage("signup");

    //Materialize - setup side drawer navigation
    $(".button-collapse").sideNav();
})();

// Register our service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js');
    });
}
