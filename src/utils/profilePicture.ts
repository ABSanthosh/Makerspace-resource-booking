function stringToHslColor(str: string, saturation: number, lightness: number): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = hash % 360;
  return `hsl(${h}, ${saturation}%, ${lightness}%)`;
}

export function getUsernameColor(username: string): {
  backgroundColor: string;
  textColor: string;
} {
  const saturation = 100; // You can adjust these values to control the color appearance
  const lightness = 85; // Higher lightness -> lighter colors, Lower lightness -> darker colors
  const backgroundColor = stringToHslColor(username, saturation, lightness);

  // Check the brightness of the background color to determine the text color (black or white)
  const r = parseInt(backgroundColor.slice(4, 7), 10);
  const g = parseInt(backgroundColor.slice(9, 12), 10);
  const b = parseInt(backgroundColor.slice(14, 17), 10);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  // Set text color to white for dark background, black otherwise
  const textColor = brightness > 125 ? '#000000' : '#FFFFFF';
  return {
    backgroundColor,
    textColor
  };
}

export function getInitials(name: string): string | undefined {
  if (!name || !name.trim()) {
    return undefined; // Return undefined for empty or whitespace-only names
  }

  const nameSplit = name.split(' ');
  const initials = nameSplit
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase();

  return initials;
}
