// https://amp.dev/documentation/guides-and-tutorials/integrate/amp-in-pwa

// unfortunately fetch() does not support retrieving documents,
// so we have to resort to good old XMLHttpRequest.
export const fetchDocument = url => {
	var xhr = new XMLHttpRequest();

	return new Promise( function( resolve, reject ) {
		xhr.open( 'GET', url, true );
		xhr.responseType = 'document';
		xhr.setRequestHeader( 'Accept', 'text/html' );
		xhr.onload = function() {
			// .responseXML contains a ready-to-use Document object
			resolve( xhr.responseXML );
		};
		xhr.send();
	} );
};
