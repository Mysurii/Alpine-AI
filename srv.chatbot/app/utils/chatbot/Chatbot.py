# standard imports
import numpy as np 
import random
import pickle
from pathlib import Path
from nltk import word_tokenize
from ..exceptions import NotFound

# necessary functions for training
from keras.models import load_model
from .model import get_model
from ..text_cleaner import clean_text


DEFAULT_RESPONSE = {'type': 'text', 'text': 'Sorry, I don\'t understand'}

class Chatbot():

    def __init__(self,id ,intents) -> None:
        self.intents = intents
        self.tags = sorted(list(set([i["tag"] for i in intents])))
        self.path = Path(__file__).parent / 'company' / id


    def train(self) -> bool:
        """Function that is used to train the chatbot with the Bag of Words method"""

        # Do NOT train if there are no intents available..
        if len(self.intents) <= 0:
            return False

        words = []
        documents = []

        # get the train data out of the object
        for intent in self.intents:
            for pattern in intent['patterns']:
                cleaned_pattern = clean_text(pattern) # clean the text. E.g. remove punctuation
                tokens = word_tokenize(cleaned_pattern)

                # words are needed to track the bag of words
                words.extend(tokens)
                # save X & y in documents
                documents.append((tokens, intent['tag']))

       
        words = sorted(list(set(words))) # remove duplicate tokens

        training_data = []
        X = []
        y = []

        for document in documents:
            bow = []

            pattern = document[0]

            for word in words:
                bow.append(1) if word in pattern else bow.append(0)

            # Label encoding -> change tags to numbers (corrosponding tag gets a 1, rest 0)
            output_row = [0] * len(self.tags)
            output_row[self.tags.index(document[1])] = 1
            training_data.append([bow, output_row])

        random.shuffle(training_data) # model trains better while shuffeling. --> higher accuracy
        
        training_data = np.array(training_data)
        
        # X = patterns, y = tags
        X = list(training_data[:, 0])
        y = list(training_data[:, 1])

        input_shape = (len(X[0]),)
        output_shape = len(y[0])
        model = get_model(input_shape, output_shape)

        # train the model
        model.fit(X, y, epochs=200, verbose=1)

        model.save(f"{self.path}/chatbot_model.h5")

        with open(f"{self.path}/words.pickle", 'wb') as handle:
          pickle.dump(words, handle, protocol=pickle.HIGHEST_PROTOCOL)
        
        return True
    
    def _bow(self, text):
        """Returns a numpy array of the same size as the words list. Based on the text, the tokens that are in the text are provided with 1
        others with 0."""
        # clean text and split text to tokens
        cleaned_text = clean_text(text)
        tokens = word_tokenize(cleaned_text)

        try:
            with open(f"{self.path}/words.pickle", 'rb') as handle:
                        words = pickle.load(handle)
        except:
            raise NotFound('File not found')


        # Activate the words from the sentence that are in the BoW
        bow = [0] * len(words)

        for token in tokens:
            for idx, word in enumerate(words):
                if word == token:
                    bow[idx] = 1
        return np.array(bow)
        

    def _predict_tag(self, text) -> str | None:
        """
        Function needed to predict the tag with the help of the trained model. If the softmax layer returns a result
         where all the percentages all lower than 20%, than it returns None.
        """
        bow = self._bow(text)

        # load trained model
        try:
            model = load_model(f"{self.path}/chatbot_model.h5")
        except:
            raise NotFound('File not found')

        result = model.predict(np.array([bow]))[0]

        if np.max(result) < 0.2:
            return None
        
        return self.tags[result.argmax()]


    def chatbot_response(self, text) -> object:
        predicted_tag = self._predict_tag(text)

        if predicted_tag == None:
            return DEFAULT_RESPONSE

        for intent in self.intents:
            if (intent['tag']) == predicted_tag:
                result = random.choice(intent['responses'])
                break
        if result:        
            return result
        return DEFAULT_RESPONSE
