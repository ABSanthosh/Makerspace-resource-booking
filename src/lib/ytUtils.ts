function getYtId(url: string): string {
	// Ref: https://gist.github.com/rodrigoborgesdeoliveira/987683cfbfcc8d800192da1e73adc486?permalink_comment_id=4342805#gistcomment-4342805
	const regex = /(?<=[=\/&])[a-zA-Z0-9_\-]{11}(?=[=\/&?#\n\r]|$)/;

	const match = url.match(regex);
	if (match) {
		return match[0];
	}
	return '';
}

// Ref: https://gist.github.com/pinceladasdaweb/6662290
export function getYtThumbnail(url: string, size?: 'small' | 'big'): string {
	if (url === null) {
		return '';
	}

	const output = getYtId(url);

	size = size === null ? 'big' : size;
	if (size === 'small') {
		return 'http://img.youtube.com/vi/' + output + '/2.jpg';
	}
	return 'http://img.youtube.com/vi/' + output + '/0.jpg';
}

export function getYtEmbedLink(url: string): string {
	if (url === null) {
		return '';
	}

	const output = getYtId(url);
	return 'https://www.youtube.com/embed/' + output;
}
