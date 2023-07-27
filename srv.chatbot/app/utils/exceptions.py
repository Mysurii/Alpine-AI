class BaseError(Exception):
  def __init__(self, message='Something went wrong..') -> None:
    super().__init__(message)
    self.status = 500
    self.error = 'API Error'
    self.message = message

class ServerError(BaseError):
  def __init__(self, message="Object not found") -> None:
    super().__init__(message)
    
class BadRequest(BaseError):
  def __init__(self, message="Bad request") -> None:
    super().__init__(message)
    self.status = 400
    self.error = 'Bad Request'

class NotFound(BaseError):
  def __init__(self, message="Object not found") -> None:
    super().__init__(message)
    self.status = 404
    self.error='Not Found'

