export const useWordsHeader = (words: string[]) => {
	const MathRandom = (min: number = 0, max: number = words.length - 1) => {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};

	return words[MathRandom()];
};
