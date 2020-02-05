/**
 * External dependencies
 */
import stringHash from 'string-hash';
import difference from 'lodash.difference';

/**
 * Takes a DOM node and returns a content hash.
 *
 * @param node
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
 * @param  {NodeList} collection
 * @param  {NodeList} newCollection
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
 * @param name
 */
export function fireEvent( name ) {
	const readyEvent = new CustomEvent( name, {
		cancelable: false,
		detail: {},
	} );
	window.dispatchEvent( readyEvent );
}
