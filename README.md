# Newspack App Shell

Objective: A persistent audio player. User should be able to navigate the page, while the audio player is playing.

## How to prepare the theme

1. If there is any JS code that attaches handlers after DOM loads, it has to re-attach them on `newspack-app-shell-ready`
1. CSS transitions can be added by utilising the `newspack-app-shell-transitioning` class that is added to the body element while page is transitioning.
1. If theme is using the AMP-WP plugin, the AMP plugin should be run in [Transitional mode](https://amp-wp.org/documentation/how-the-plugin-works/amp-plugin-serving-strategies/), because AMP will not allow the custom script on AMP pages.


## Background

Based on [work done in AMP-WP plugin](https://github.com/ampproject/amp-wp/pull/1519). The scope of this work is bigger that what we want to achieve here. In the future the Newspack App Shell plugin might be abandoned in favour of the App Shell feature of AMP-WP plugin.
