package alpine.api.v1.user.interfaces;

import alpine.api.v1.user.User;

import java.util.List;
import java.util.Optional;

public interface IUserService {
    List<User> getUsers();

    Optional<User> findByEmail(String email);


}
