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
 * @param {object} schema - The schema to be used for validation.
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

/**
 * @type {boolean} Whether the current environment is a development environment.
 */
export const dev = import.meta.env.DEV;

/**
 * Get JSON from path.
 *
 * @param {string} path - The url to get JSON from.
 *
 * @returns {Promise<object|false>} The JSON object.
 */
export async function getJSON(path) {
	try {
		const response = await fetch(path);
		const json = await response.json();
		return { json, lastModified: response.headers.get("last-modified") };
	} catch (error) {
		ui.notifications.error("Could not load JSON. Check the console for more information.");
		if (path.includes("%20")) {
			ui.notifications.warn(
				"Your file contains spaces. Try renaming the file to remove the spaces with <code class='varch-code'>%20</code> or <code class='varch-code'>-</code>.",
				{
					permanent: true,
				}
			);
		}
		console.error(error);
		return false;
	}
}

