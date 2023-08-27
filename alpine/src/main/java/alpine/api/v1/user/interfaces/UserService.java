package alpine.api.v1.user.interfaces;

import alpine.api.v1.user.User;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;
import java.util.Optional;

public interface UserService extends UserDetailsService {
    List<User> getUsers();
    Optional<User> findByEmail(String email);
    User createUser(User user);
    User updateUser(Long id, User updatedUser);
    void deleteUser(Long id);
}
