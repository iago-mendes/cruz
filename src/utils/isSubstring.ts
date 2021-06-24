export function isSubstring(string?: string, substring?: string) {
	if (!string && !substring) return false

	const tmpString = String(string).trim().toLowerCase()
	const tmpSubstring = String(substring).trim().toLowerCase()

	return tmpString.includes(tmpSubstring)
}
