from keras.models import Sequential
from keras.layers import Dense, Dropout

def get_model(iShape, oShape):
  model = Sequential()
  model.add(Dense(128, input_shape=iShape, activation='relu'))
  model.add(Dropout(0.5))
  model.add(Dense(64, activation='relu'))
  model.add(Dropout(0.3))
  model.add(Dense(oShape, activation='softmax'))
  
  model.compile(loss='categorical_crossentropy', optimizer='adam', metrics=['accuracy'])

  return model