import { customAlphabet, urlAlphabet } from 'nanoid';

const nanoid = customAlphabet(urlAlphabet, 7);

export default nanoid;
