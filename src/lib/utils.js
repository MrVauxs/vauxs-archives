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
	if (extra) return game.i18n.format(string, extra);
	return game.i18n.localize(string);
}

/**
 * Validates an object based on required properties.
 *
 * @param {obj} schema - The schema to be used for validation.
 *
 * @param {object} obj - The object to be validated.
 *
 * @returns {boolean} True if the object is valid, false otherwise.
 */
export function validateObject(schema, obj) {
	if (typeof obj !== "object" || obj === null) {
		return false;
	}

	for (const key in schema) {
		if (!Object.prototype.hasOwnProperty.call(obj, key) || typeof obj[key] !== schema[key]) {
			return false;
		}
	}

	return true;
}

