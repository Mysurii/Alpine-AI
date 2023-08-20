package alpine.api.v1.auth.interfaces;

import alpine.api.v1.auth.dto.SignUpDTO;
import alpine.api.v1.auth.dto.TokensDTO;

public interface AuthService {
    TokensDTO register(SignUpDTO signUpDTO);

}
