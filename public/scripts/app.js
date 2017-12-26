var app;(function () {
    'use strict';

     app = {
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

        //data
        data: {
            fridgeProducts: undefined
        },
        

        //is app loading
        isLoading: true
    };
    
    //https://stackoverflow.com/a/39914235
    //https://stackoverflow.com/a/46100662
    //sleep - A promise awaiter. 
    //Pass an object with booleans which will be set to true in the promises "then"
    //Set ms for each time the awaiter checks if the promise was resolved
    
    function isBooleanTrue(aBoolean){
        return aBoolean;
    }
    function delay(ms) {
            return new Promise((resolve, reject) => {
                    setTimeout(resolve, ms);
            });
    }
    async function sleep(testFlagObj,ms) {
        //var i = 0;
        while(true){
            await delay(ms);
            var shouldStop = Object.values(testFlagObj).every(isBooleanTrue);
            if(shouldStop){
                break;
            }
            //console.log(i);
            //i = i+1;
        }
    }


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

    //returns a promise that gets products
    async function loadMyFridgePage(){

        toggleLoaderOn(true);

        //things to await
        var objWaitable = {
            isFridgeHTMLloaded: false,
            isProductsDataLoaded: false
        }
        var ProductsData;

        //async request for HTML partial
        $.ajax({
          url: "partials/myFridge.html"
        }).done(function( data ) {
            $(".main").html(data);
            objWaitable.isFridgeHTMLloaded = true;
        });

        //async request for products data about the logged in users fridge
        app.db.collection("fridges/"+app.user.uid+"/products").get().then(function(querySnapshot) {
            ProductsData = querySnapshot;
            objWaitable.isProductsDataLoaded = true;
        });

        //wait promises for data and html content to be done
        await sleep(objWaitable,100);

        var fridgeCollectionUL = document.querySelector('.fridge-collection');
        //var fridgeCollectionULjQuery = $(".fridge-collection");
        var observer = new MutationObserver(function(mutations) {});
        observer.observe(fridgeCollectionUL, { childList: true });

        function deleteElement(element){
            element.style.display = 'none';
        }
        
        function resetElement(element){
            element.style.left = 0;
        }

        function addInteractionToProductsInFridge(mutationRecords){
            mutationRecords.forEach(function(mutationRecord){
                //for (var i = 0; i < mutation.addedNodes.length; i++) {
                //    console.log('"' + mutation.addedNodes[i].textContent + '" added');
                //}
                var domObject = mutationRecord.addedNodes[0];

                var hammertime = new Hammer(domObject, {preventDefault: true});
                hammertime.on("dragup dragdown swipeup swipedown", function(ev){});
                
                //do stuff on swipe/drag left/right
                var newHammer = new Hammer (domObject);
                newHammer.on("panstart panend panleft panright", function(ev2){
                    if (ev2.type == "panend"){
                        if(ev2.deltaX < -120){
                            deleteElement(domObject);
                        }else{
                            resetElement(domObject);
                        }
                    }else{
                        if(ev2.center.x == 0 && ev2.center.y ==0){
                        }else{
                            var x = $(".main").find(ev2.target).closest('.removableFridgeItem');
                            x.css("left",ev2.deltaX+"px");
                        }   
                    }
                });
            });
        }

       /* (async () => {
            var bar = document.createElement('div');
            bar.textContent = 'bar';
            fridgeCollectionUL.appendChild(bar);
            console.log(observer.takeRecords());
            while(true){
                await sleep({x:true},1000);
                (observer.takeRecords()).forEach(function(mutation) {
                        console.log(mutation);
                        console.log(mutation.addedNodes);
                    for (var i = 0; i < mutation.addedNodes.length; i++) {
                        console.log('"' + mutation.addedNodes[i].textContent + '" added');
                        var domObject = mutation.addedNodes[i];
                        var hammertime = new Hammer(domObject, {preventDefault: true});
                        hammertime.on("dragup dragdown swipeup swipedown", function(ev){});

                        //do stuff on swipe/drag left/right
                        var newHammer = new Hammer (domObject);
                        newHammer.on("panstart panend panleft panright", function(ev2){
                            console.log(ev2);
                            if (ev2.type == "panend"){
                                if(ev2.deltaX < -120){
                                    deleteElement(domObject);
                                }else{
                                    resetElement(domObject);
                                }
                            }else{
                                if(ev2.center.x == 0 && ev2.center.y ==0){
                                }else{
                                    var x = $(".main").find(ev2.target).closest('.removableFridgeItem');
                                    x.css("left",ev2.deltaX+"px");
                                }   
                            }
                        });
                    }
                });
            }
        })();*/

        //Check how many products found in user fridge
        if(ProductsData.size == 0){
            //fridge is empty
            $(".main").addClass("fridge-empty");
        }else{
            //fridge has some products



            var productTemplate = document.querySelector('#templateRemovableFridgeItem');

            var productName = productTemplate.content.querySelector(".fridge-item-name");
            var productQuantity = productTemplate.content.querySelector(".fridge-item-quantity");
            var productTime = productTemplate.content.querySelector(".fridge-item-time-left");

            ProductsData.forEach(function(doc) {
                productName.textContent = doc.data().name;
                productTime.textContent = doc.data().time;
                productQuantity.textContent = doc.data().quantity;

                var productTemplateClone = document.importNode(productTemplate.content, true);
                fridgeCollectionUL.appendChild(productTemplateClone);
                addInteractionToProductsInFridge(observer.takeRecords());
            });
        }

        toggleLoaderOn(false);
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

    // After a user was created with Auth.module, create settings and fridge for the user in the firestore database
     function setUpAccountData(){
        app.db.collection("user-settings").doc(app.user.uid).set({
            isSetupFinished: false
        })
        .then(function() {
            app.db.collection("fridges").doc(app.user.uid).set({

            })
            .then(function(){
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
        app.user = user;
        if (user!=undefined && user.emailVerified) {
            if(app.isFirstAuthCheckDone){
                showSenpai(2);
                //load fridge page
            }else{
                app.isFirstAuthCheckDone=true;
                showSenpai(2);
                //show senpai2
                app.docRefUserSettings = app.db.collection("user-settings").doc(user.uid);
                //get the user-settings document
                app.docRefUserSettings.get().then(function(doc) {
                    if (doc.exists) {
                        //check if user finished settup
                            //true
                        if(doc.data().isSetupFinished) {
                                //load fridge page in senpai2
                        }else{
                            loadMyFridgePage();

                            //false
                                // load setup page in senpai2
                        }
                    } else {

                    }
                }).catch(function(error) {

                });

            }
        } else if(user && !user.emailVerified) {
            setUpAccountData();

            //send verification e-mail
            user.sendEmailVerification().then(function() {
                //swal
                swal({
                    title: 'Successfully registered',
                    text: "Please verify your e-mail",
                    type: 'success',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    cancelButtonText: 'Resend confirmation e-mail',
                    confirmButtonText: 'Open yahoo! mail',
                    allowOutsideClick: false
                }).then((result) => {
                    if (result.value) {
                        document.location = "http://yahoo.com"
                    }else if(result.dismiss === 'cancel'){
                        swal({
                            type: 'success',
                            title: 'Your confirmation e-mail has been sent to ...@...com',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }
                });
            }).catch(function(error) {
              // An error happened.
            });

            

            //show a verification screen and continue

            /*user.sendEmailVerification().then(function() {
              // Email sent.
            }).catch(function(error) {
              // An error happened.
            });*/
            toggleLoaderOn(false);
        }else{
            if(app.isFirstUnauthCheckDone){
                //User is signed out
                
            }else{
                //load signup page
                //executes when app runs for the first time if user is not auth.
                app.isFirstUnauthCheckDone = true;
            }
            toggleLoaderOn(false);
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
