/**
 * External dependencies
 */
import stringHash from 'string-hash';
import difference from 'lodash.difference';

/**
 * Takes a DOM node and returns a content hash.
 *
 * @param {HTMLElement} node DOM node
 * @return {number} number result of the DOM node hashing
 */
export function hashDOMNode( node ) {
	return stringHash(
		JSON.stringify( {
			name: node.tagName,
			innerHTML: node.innerHTML,
			attributes: [ ...node.attributes ].map( ( { name, value } ) => ( {
				[ name ]: value,
			} ) ),
		} )
	);
}
/**
 * Compare two collections of nodes.
 *
 * @param  {NodeList} collection list of nodes
 * @param  {NodeList} newCollection list of nodes
 * @return  {Object} Object with DOM elements to add and to remove
 */
export function compareDOMNodeCollections( collection, newCollection ) {
	const headNodes = [ ...collection ].reduce( ( acc, val ) => {
		acc[ hashDOMNode( val ) ] = val;
		return acc;
	}, {} );
	const headNodesHashes = Object.keys( headNodes );

	const newHeadNodes = [ ...newCollection ].reduce( ( acc, val ) => {
		acc[ hashDOMNode( val ) ] = val;
		return acc;
	}, {} );
	const newHeadNodesHashes = Object.keys( newHeadNodes );

	return {
		toAdd: difference( newHeadNodesHashes, headNodesHashes ).map( hash => newHeadNodes[ hash ] ),
		toRemove: difference( headNodesHashes, newHeadNodesHashes ).map( hash => headNodes[ hash ] ),
	};
}

/**
 * Fire custom events.
 *
 * @param {string} name name of the custom event
 */
export function fireEvent( name ) {
	const readyEvent = new CustomEvent( name, {
		cancelable: false,
		detail: {},
	} );
	window.dispatchEvent( readyEvent );
}

const FORM_ERROR_MESSAGE_CLASS = 'newspack-app-shell-form__error';

/**
 * Display form submission error message.
 *
 * @param {HTMLElement} formEl form element
 * @param {string} message message
 */
export function updateFormErrorMessage( formEl, message ) {
	const foundEl = formEl.querySelector( `.${ FORM_ERROR_MESSAGE_CLASS }` );
	if ( foundEl ) {
		foundEl.innerHTML = message;
	} else {
		const messageEl = document.createElement( 'div' );
		messageEl.innerHTML = message;
		messageEl.classList.add( FORM_ERROR_MESSAGE_CLASS );
		formEl.prepend( messageEl );
	}
}
