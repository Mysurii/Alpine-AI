package alpine.alpine.user.interfaces;

import alpine.alpine.user.User;

import java.util.List;
import java.util.Optional;

public interface IUserService {
    List<User> getUsers();

    Optional<User> findByEmail(String email);


}
