package alpine.api.v1.user;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController()
@RequestMapping("/api/v1/users")
@AllArgsConstructor
public class UserController {

    private final UserService userService;



    @GetMapping()
    public List<User> getAllUsers() {
        return userService.getUsers();
    }

    @GetMapping("/{email}")
    public Optional<User> getUserById(@PathVariable String email) {
        return userService.findByEmail(email);
    }
}
