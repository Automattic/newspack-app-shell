// based on https://github.com/ampproject/amp-wp/pull/1519

/**
 * Internal dependencies
 */
import { fetchDocument } from './fetch';
import { hashDOMNode, compareDOMNodeCollections, fireEvent } from './utils';

/**
 * Attach event handlers to the document.
 */
function attachNavigationHandlers() {
	document.body.addEventListener('click', handleClick);
	document.body.addEventListener('submit', handleSubmit);
	window.addEventListener('popstate', () => {
		loadUrl(window.location.href);
	});
}
attachNavigationHandlers();

/**
 * Is a loadable URL.
 *
 * @param {URL} url - URL to be loaded
 * @return {boolean} Whether the URL can be loaded
 */
function isLoadableURL(url) {
	if (
		url.pathname.endsWith('.php') ||
		url.href.startsWith(APP_SHELL_WP_DATA.adminUrl) ||
		url.pathname.endsWith('/feed/')
	) {
		return false;
	}
	return url.href.startsWith(APP_SHELL_WP_DATA.homeUrl);
}

/**
 * Handle form submission - e.g. search.
 *
 * TODO: handle POSTing comments
 */
function handleSubmit(event) {
	if (
		!event.target.matches('form[action]') ||
		event.target.method.toUpperCase() !== 'GET' ||
		event.target.closest('#wpadminbar')
	) {
		return;
	}

	// Skip handling click if it was handled already.
	if (event.defaultPrevented) {
		return;
	}

	const url = new URL(event.target.action);
	if (!isLoadableURL(url)) {
		return;
	}

	for (const element of event.target.elements) {
		if (element.name && !element.disabled) {
			// @todo Need to handle radios, checkboxes, submit buttons, etc.
			url.searchParams.set(element.name, element.value);
		}
	}
	loadUrl(url, { scrollIntoView: true });
	event.preventDefault();
}

/**
 * Handler for click events fired on links.
 */
function handleClick(event) {
	const { href } = event.target;
	const url = new URL(href);

	if (
		!event.target.matches('a[href]') ||
		event.target.closest('#wpadminbar') ||
		// Skip handling click if it was handled already.
		event.defaultPrevented ||
		!isLoadableURL(url)
	) {
		return;
	}

	event.preventDefault();

	if (href === window.location.href) {
		return;
	}

	loadUrl(url, { scrollToTop: true, pushState: true });
}

const CONTENT_ELEMENT_ID = 'page';

/**
 * Fetches HTML document by URL, then replaces the perinent DOM elements
 * with new content.
 */
function loadUrl(url, options = {}) {
	fireEvent('newspack-app-shell-navigate');

	document.body.classList.add('newspack-app-shell-transitioning');

	fetchDocument(url).then(function(doc) {
		// get HTML content
		const pageHTML = doc.getElementById(CONTENT_ELEMENT_ID).innerHTML;

		// replace the #page contents
		const container = document.getElementById(CONTENT_ELEMENT_ID);
		container.innerHTML = pageHTML;

		// diff head and update all elements
		const headDiff = compareDOMNodeCollections(
			document.querySelectorAll('head > *'),
			doc.querySelectorAll('head > *')
		);
		headDiff.toRemove.map(el => document.head.removeChild(el));
		headDiff.toAdd.map(el => document.head.appendChild(el));

		// diff body, omitting the #page contents
		const canChangeBodyEl = el => el.id !== CONTENT_ELEMENT_ID;

		const bodyDiff = compareDOMNodeCollections(
			document.querySelectorAll('body > *'),
			doc.querySelectorAll('body > *')
		);
		bodyDiff.toRemove.map(el => {
			if (canChangeBodyEl(el)) {
				document.body.removeChild(el);
			}
		});
		bodyDiff.toAdd.map(el => {
			if (canChangeBodyEl(el)) {
				document.body.appendChild(el);
			}
		});

		// update body element itself
		document.body.setAttribute('class', doc.body.getAttribute('class'));

		// update history
		if (options.pushState) {
			history.pushState({}, doc.title, doc.URL);
		}

		// restore scroll position
		if (options.scrollToTop) {
			window.scrollTo(0, 0);
		}

		attachNavigationHandlers();

		document.body.classList.remove('newspack-app-shell-transitioning');

		fireEvent('newspack-app-shell-ready');
	});
}
