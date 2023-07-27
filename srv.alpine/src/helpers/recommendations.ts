import natural from 'natural'

// Create a tokenizer and stemmer from the natural library
const tokenizer = new natural.WordTokenizer()
const stemmer = natural.PorterStemmer

// Example product data stored in MongoDB
const products = [
  { id: 1, name: 'Product 1', description: 'This is product 1 in Category A' },
  { id: 2, name: 'Product 2', description: 'This is product 2 in Category B' },
  { id: 3, name: 'Product 3', description: 'This is product 3 in Category A' },
  // Add more fake product data here
]

// Function to calculate cosine similarity
function calculateCosineSimilarity(setA: Set<string>, setB: Set<string>): number {
  const intersectionSize = new Set([...setA].filter((x) => setB.has(x))).size
  const magnitudeA = Math.sqrt(setA.size)
  const magnitudeB = Math.sqrt(setB.size)
  return intersectionSize / (magnitudeA * magnitudeB)
}

// Function to preprocess and tokenize text
function preprocessAndTokenize(text: string): Set<string> {
  const tokenizedText = tokenizer.tokenize(text)
  if (!tokenizedText) {
    return new Set<string>() // Return an empty set if tokenization fails
  }

  const stemmedTokens = tokenizedText.map((token) => stemmer.stem(token))
  return new Set(stemmedTokens)
}

// Function to retrieve recommended products based on cosine similarity
export function getRecommendedProducts(userInput: string): typeof products {
  const userSet = preprocessAndTokenize(userInput)

  // Calculate cosine similarity between the user input and each product description
  const similarityThreshold = 0.1 // Adjust the threshold as needed
  const recommendedProducts = products.filter((product) => {
    const productSet = preprocessAndTokenize(product.description)
    const similarity = calculateCosineSimilarity(userSet, productSet)
    return similarity >= similarityThreshold
  })

  return recommendedProducts
}
