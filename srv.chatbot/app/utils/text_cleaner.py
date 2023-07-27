import string
import emoji
import re
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import word_tokenize
from textblob import TextBlob

lemmatizer = WordNetLemmatizer()

def correct_word_spelling(word):
    word = TextBlob(word)
    result = word.correct()
    return str(result)

def clean_text(text: str) -> str:
    text = text.lower()
    text = text.translate(str.maketrans('', '', string.punctuation))
    text = emoji.demojize(text)
    text = re.sub(r"\:(.*?)\:", '', text)
    text = re.sub(r"\s+", " ", text)

    tokens = word_tokenize(text)
    words = []

    for token in tokens:
        words.append(lemmatizer.lemmatize(token))


    text = ' '.join(words)
    return text
