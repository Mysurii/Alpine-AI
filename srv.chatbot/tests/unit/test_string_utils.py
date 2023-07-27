from app.utils.text_cleaner import clean_text, correct_word_spelling


def test_clean_text_remove_symbols():
  text = 'hell&o # world!'
  assert 'hello world' == clean_text(text)

def test_clean_text_makes_lower_case():
  text = 'Hello World'
  assert 'hello world' == clean_text(text)

def test_clean_text():
  text = 'Hey how are @! you doing?'
  assert 'hey how are you doing' == clean_text(text)

def test_correct_word_spelling():
  text = "I amm goodd at spelling mstake."
  assert "I am good at spelling mistake." == correct_word_spelling(text)
