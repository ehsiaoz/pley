//Global Variables========================================

var locationsGeo = [];
var searchLocation = "";
var searchTerm = "";
var queryLocationGeo = {};
var displayAddress = " ";
var numResults = "";


//Functions========================================================================================

$(document).ready(function() {

	//clicking enter to trigger page search button click
	$("input").keypress(function(event) {

	  // listen to see that key was "enter."
	  if (event.which === 13) {

	    // If so, run addTask.
	    pagesearchclick();
	  }
	});

//Buttons===========================

//Search Button on page
$('#page-search-button').on('click', pagesearchclick);


//Search Button in modal
$('#search-button-modal').on('click', modalsearchclick);


//Forms==============================

//Autoselection value in location input field on click
 $('#page-location-input').click( function highlight() {
    $(this).select();
  });

$('#modal-find-input').click( function highlight() {
    $(this).select();
  });

$('#modal-near-input').click( function highlight() {
    $(this).select();
  });

//Modal================================
// Get the modal
var modal = document.getElementById('searchModal');

// Get the button that opens the modal
var btn = document.getElementById("homeModal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btn.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}


//Function for Search Button click in Modal

function modalsearchclick() {

		var testFind = $('#modal-find-input').val().trim();
		var testNear = $('#modal-near-input').val().trim();
		var letters = /^[a-z0-9 ]+$/i;

		$('#modal-find-error-msg').html("");
		$('#modal-near-error-msg').html("");
		
		//Input Validation
		if (testFind === "") {

			$('#modal-find-error-msg').html("* Required Field");

			return;
		}

		if(letters.test(testFind) === false) {

        	$('#modal-find-error-msg').html("* Input must be alpha-numeric");
    		
    		return;
    	}

		if (testNear === "") {

			$('#modal-near-error-msg').html("* Required Field");

			return;
		}

		if(letters.test(testNear) === false) {

        	$('#modal-near-error-msg').html("* Input must be alpha-numeric");
    		
    		return;
    	}

		else {

		$('#search-results').empty();
		locationsGeo = [];
		modal.style.display = "none";

		searchTerm = $('#modal-find-input').val().trim();
		searchLocation = $('#modal-near-input').val().trim(); 
		var searchLatitude = searchLongitude = '';

		}

		// if(searchTerm == ''){
		// 	console.log("No search term entered..");
		// 	return;
		// }

		// if ($('#').){//nearby checkbox is checked...
		// 	var geoSuccess = function(position) {
		// 		searchLatitude = position.coords.latitude;
		// 		searchLongitude = position.coords.longitude;
		// 	};
		// 	navigator.geolocation.getCurrentPosition(geoSuccess, geoFailure);
		// 	console.log("You are searching for " + searchTerm + " near " + searchLatitude + "," + searchLongitude);
		// 	yelpSearch(searchTerm, searchLocation);
		// }
		// else{
		// 	if(searchLocation == ''){
		// 		console.log("error : no location entered...");
		// 		// error handling code here
		// 		return;
		// 	}
			yelpSearch(searchTerm, searchLocation);


		// }

		}




//document.ready
});


//Functions===============================================

//Function for Search Button click on Page
function pagesearchclick() {

	$('#form-error-msg').html("");
	var letters = /^[a-z0-9_ ]+$/i;

	//Input validation
	if ($('#modal-find-input').val().trim() === "" || $('#page-location-input').val().trim() === "") {


		$('#form-error-msg').html("* Required Field");
	}

	else if (letters.test($('#page-location-input').val().trim()) === false) { 
			 
		$('#form-error-msg').html("* Input must be alpha-numeric");
	}

	else {

		$('#search-results').empty();
		$('#search-area').empty();
		locationsGeo = [];

		searchTerm = $('#modal-find-input').val().trim();
		searchLocation = $('#page-location-input').val().trim();

		yelpSearch(searchTerm, searchLocation);

	}
}




//Function to build and append search results returned from yelp search api to the DOM

function resultBuilder(yelpObject) {

	var querylocationLatitude = yelpObject.region.center.latitude;
	var querylocationLongitude = yelpObject.region.center.longitude;

	queryLocationGeo = {
		lat: querylocationLatitude,
		long: querylocationLongitude,
	};

	//Call function to look up display name of address
	addressLookup(querylocationLatitude, querylocationLongitude);

	//To display how many search results were returned
	numResults = yelpObject.businesses.length;

	//Create search result cards
	yelpObject.businesses.forEach(function(biz, i){
		
		var business = {
			name: yelpObject.businesses[i].name,
			rating: yelpObject.businesses[i].rating,
			thumb_url: yelpObject.businesses[i].image_url || 'assets/images/noimage.jpg',
			snippet_text: yelpObject.businesses[i].snippet_text,
			geo_lat: yelpObject.businesses[i].location.coordinate.latitude,
			geo_lng: yelpObject.businesses[i].location.coordinate.longitude,
			address: yelpObject.businesses[i].location.display_address,
			phone: yelpObject.businesses[i].display_phone,
			url: yelpObject.businesses[i].url,
		}

		var bizName = "<a href=\"" + business.url + "\"><h4 class=\'biz-title\' id=\"nameh4\">" + business.name + "</h4></a>";
		var bizSnippet = "<p>\"" + business.snippet_text + "\"</p>";
		var bizPhone = "<p><img src=\"assets/images/phone.jpg\" height=\"15\"> " + business.phone + "</p>";
		var thumbnail = "<img class = thumbnail src=\"" + business.thumb_url + "\">";
		var reviewStars = "<span class=\"stars\" style=\"height: 22px\">" + business.rating + "</span>"
		var businessListing = $('<div>').addClass('row result-card').append(
								bizName,
								"<div class='col-xs-4 col-sm-2 col-md-3 col-lg-3' id='thumbnail'>"+ thumbnail + "</div>" + 
								"<div class='col-xs-7 col-xs-offset-1 col-sm-9 col-sm-offset-1 col-md-7 col-md-offset-2 col-lg-8 col-lg-offset-0' id='mainText'>"+ reviewStars + bizSnippet + bizPhone  + "</div>");

		locationsGeo.push ({
			name: business.name, 
			latlng: new google.maps.LatLng(business.geo_lat, business.geo_lng),
			content: bizName + thumbnail
		});


	//Append Search results to the DOM
	$('#search-results').append(businessListing);
	

	});

	//Convert star ratings into stars
	$(function() {
		    $('span.stars').stars();
		});	

	//Create map markers on google map
	var mapDiv = document.getElementById('map'); 
    var mapOptions = {
    	center: new google.maps.LatLng (41.9652791, -87.6756278),	
        zoom: 12,
      	mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(mapDiv, mapOptions);
     //create empty LatLngBounds object
	var bounds = new google.maps.LatLngBounds();
	var infowindow = new google.maps.InfoWindow();  

   locationsGeo.forEach(function(loc, i){
  
    	var infowindow = new google.maps.InfoWindow({
          content: loc.content
        });
     
    	var marker = new google.maps.Marker({position: loc.latlng, map:map, title:loc.name});

	    bounds.extend(marker.position);

        marker.addListener('click', function() {
          infowindow.open(map, marker);
        });
       
     });
	//now fit the map to the newly inclusive bounds
	map.fitBounds(bounds);      
	
}


//Function to trigger a GET Request to Yelp Search API using zipcode entered from user===========
function yelpSearch (searchTerm, searchLocation) {

	var auth = {
		consumerKey : "Uy18Nj8CANiQaNqh6CYurA",
		consumerSecret : "gj8dtRRrThO9O5kgj-XIk90N1w8",
		accessToken : "Lpby6Q-XK6xJ5TvJSbcvZYJiQw_jx9YK",
		accessTokenSecret : "-e1Vqkn-H-JJH3CDUdlAiEP4EYc",
		serviceProvider : {signatureMethod : "HMAC-SHA1"}
		};

	// var terms = $('#modal-find-input').val().trim();
	// console.log("This is term: " + terms);
	// var near = $('#page-location-input').val().trim();

	var accessor = {
			consumerSecret : auth.consumerSecret,
			tokenSecret : auth.accessTokenSecret
		};

	parameters = [];
	parameters.push(['term', searchTerm]);
	parameters.push(['location', searchLocation]);
	parameters.push(['callback', 'cb']);
	parameters.push(['oauth_consumer_key', auth.consumerKey]);
	parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
	parameters.push(['oauth_token', auth.accessToken]);
	parameters.push(['oauth_signature_method', 'HMAC-SHA1']);


	var message = {
	'action' : 'https://api.yelp.com/v2/search',
	'method' : 'GET',
	'parameters' : parameters
	};

	OAuth.setTimestampAndNonce(message);
	OAuth.SignatureMethod.sign(message, accessor);

	var parameterMap = OAuth.getParameterMap(message.parameters);
	parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature)
	console.log(parameterMap);

	//get call to yelp search api
	$.ajax({
		'url' : message.action,
		'data' : parameterMap,
		'cache' : true,
		'dataType' : 'jsonp',
		'jsonpCallback' : 'cb'
		})

		//If the request is successful
		.done(function(data) {

			console.log("this is data inside request: ", data);
			resultBuilder(data);

		})

		//if the request fails append error message with error code.
		.fail(function(data){

			console.log("oops : ", data);
			var errMsg = $('<div>').addClass('row').append(
				
				"<div class='col-xs-12' id='errorMsg'>" + 
				"<span id=errorCode>Error message: " + 
				data.status + 
				"</span>." + "<br><br>" + 
				"Sorry, but we didn't understand the location you entered. We accept locations in the following forms: "+ 
				"<br><br>" + 
				" - 1200 N. Michigan Ave, Chicago, IL" + "<br>" + 
				" - Chicago, IL" + "<br>" + 
				" - Chicago, IL 60640" + "<br>" + 
				" - 60640" + "<br><br>" + 
				"Also, it's possible we don't have a listing for \"" + searchLocation + "\". In that case, you should try adding a zip, or try a larger nearby city." +"</div>"); 

			//Append Search results to the DOM
			$('#search-results').append(errMsg);

		})

		//regardless or whether call was successful or failed..console.log response.
		.always(function(data){
			console.log(data);
		});
};


function initMap() {
        var mapDiv = document.getElementById('map'); 
        var mapOptions = {
        	center: new google.maps.LatLng (40.1747708, -101.0129668),	
	        zoom: 5,
          	mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(mapDiv, mapOptions);
        
}

function addressLookup(lat, long) {

		var latlng = lat + "," + long;
		console.log("this is latlng in addressLookup: " + latlng);
		var queryURL = "https:/maps.googleapis.com/maps/api/geocode/json?latlng=" + latlng 
						 + "&key=AIzaSyBbmAefrpT0YSqgufXAyKg8Stl1CmxqZpI";
		console.log("query url: " + queryURL);
		$.ajax({
				url: queryURL, 
				method: 'GET'
			}).done(function(response) {
			console.log("this is response from addressLookUp: ", response);
			var formatted_address = response.results[0].formatted_address;
			var splitAddress = formatted_address.split(",");
			var rawDisplayAddress = splitAddress[1] + "," + splitAddress[2];
			displayAddress = rawDisplayAddress.trim();
			console.log(displayAddress);

			$('#search-title').html("Best " +
						searchTerm + " in " + displayAddress + 
						" - " + 
						numResults + " Results");

			return displayAddress;
			
		});

	
}

//Convert business rating to stars====================
$.fn.stars = function() {
    return $(this).each(function() {
        // Get the value
        var val = parseFloat($(this).html());
        // Make sure that the value is in 0 - 5 range, multiply to get width
        val = Math.round(val * 2) / 2; /* To round to nearest half */
        var size = Math.max(0, (Math.min(5, val))) * 16;
        // Create stars holder
        var $span = $('<span />').width(size);
        // Replace the numerical value with stars
        $(this).html($span);
    });
}



//=============================================

window.onload = initMap;



