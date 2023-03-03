export const getWordCountMap = (text) => {
  const words =
    text
      .toLowerCase()
      .replace(/(<([^>]+)>)/gi, "")
      .match(/[a-zA-Zäöüß]+/g) || [];
  const wordCountMap = {};

  words.forEach((word) => {
    if (!wordCountMap[word]) {
      wordCountMap[word] = 1;
    } else {
      wordCountMap[word]++;
    }
  });
  // Converts the wordCountMap object into an array of key-value pairs and sorts it
  const sortedWordCountArray = Object.entries(wordCountMap).sort(
    (a, b) => b[1] - a[1]
  );
  // Converts the sortedWordCountArray back into an object
  const sortedWordCountMap = Object.fromEntries(sortedWordCountArray);

  return sortedWordCountMap;
};

export const WORDPRESS_API_URL =
  "https://www.thekey.academy/wp-json/wp/v2/posts";
export const FETCH_INTERVAL = 5000;
