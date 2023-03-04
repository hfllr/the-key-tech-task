// This function takes in a text string, extracts all the words, counts the occurrence of each word, and returns a sorted object of the word count

export const getWordCountMap = (text) => {
  const words =
    text
      .toLowerCase() // Converts all text to lowercase
      .replace(/(<([^>]+)>)/gi, "") // Removes all HTML tags
      .match(/[a-zA-Zäöüß]+/g) || []; // Extracts all words using a regular expression, and falls back to an empty array if there are no matches

  const wordCountMap = {};

  // Iterates through the array of words and counts the occurrence of each word
  words.forEach((word) => {
    if (!wordCountMap[word]) {
      wordCountMap[word] = 1;
    } else {
      wordCountMap[word]++;
    }
  });

  // Converts the wordCountMap object into an array of key-value pairs and sorts it by descending order of the value
  const sortedWordCountArray = Object.entries(wordCountMap).sort(
    (a, b) => b[1] - a[1]
  );

  // Converts the sortedWordCountArray back into an object
  const sortedWordCountMap = Object.fromEntries(sortedWordCountArray);

  return sortedWordCountMap;
};

// Defines the URL of the WordPress API endpoint
export const WORDPRESS_API_URL =
  "https://www.thekey.academy/wp-json/wp/v2/posts";

// Defines the interval in milliseconds at which the app fetches new data
export const API_FETCH_INTERVAL = 5000;
