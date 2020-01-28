/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { compose } from '@wordpress/compose';
import { withSelect, withDispatch } from '@wordpress/data';
import { registerPlugin } from '@wordpress/plugins';
import { PluginDocumentSettingPanel, PluginPostStatusInfo } from '@wordpress/edit-post';
import { ToggleControl } from '@wordpress/components';

const AppShellSettingPanel = ({ meta, onMetaFieldChange }) => (
	<PluginDocumentSettingPanel name="popup-settings-panel" title={__('App Shell Settings')}>
		<ToggleControl
			label={__('Fixed to bottom')}
			checked={Boolean(meta.is_fixed)}
			onChange={value => onMetaFieldChange('is_fixed', value)}
		/>
	</PluginDocumentSettingPanel>
);

const AppShellSettingPanelWithData = compose([
	withSelect(select => {
		const { getEditedPostAttribute } = select('core/editor');
		return { meta: getEditedPostAttribute('meta') || {} };
	}),
	withDispatch(dispatch => {
		return {
			onMetaFieldChange: (key, value) => {
				dispatch('core/editor').editPost({ meta: { [key]: value } });
			},
		};
	}),
])(AppShellSettingPanel);

registerPlugin('newspack-app-shell', {
	render: AppShellSettingPanelWithData,
	icon: null,
});
