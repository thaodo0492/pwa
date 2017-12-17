(function() {
'use strict';

var app = {};

/*****************************************************************************
*
* Event listeners for UI elements
*
****************************************************************************/

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
	
	//Materialize - setup side drawer navigation
    $(".button-collapse").sideNav();


/*****************************************************************************
*
* TO DELETE
*
****************************************************************************/

  $('.sign-up-btn').click(function() {
  	$('#senpai2').css("display","block");
  	$('#senpai1').css("display","none");
  });


})();
