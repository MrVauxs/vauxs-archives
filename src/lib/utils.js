/**
 * Translates and formats an internationalization (i18n) string.
 *
 * @param {string} string - The string to be translated or formatted.
 *
 * @param {object} [extra] - Additional data to be used for formatting the string.
 *
 * @returns {string} The translated or formatted string.
 */
export function i(string, extra) {
	string = `vauxs-archival.${string.trim()}`;
	if (extra) {
		return game.i18n.format(string, extra);
	}
	return game.i18n.localize(string);
}

