package alpine.api.v1.user;

import alpine.common.exceptions.BadRequestException;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@RestController()
@RequestMapping("/api/v1/users")
@AllArgsConstructor
public class UserController {

    private final UserServiceImpl userService;


    @GetMapping
    public List<User> getAllUsers() {
        return userService.getUsers();
    }

    @GetMapping("/{email}")
    public Optional<User> getUserById(@PathVariable String email) {
        return userService.findByEmail(email);
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id ,@RequestBody User user) {
        if (!Objects.equals(id, user.getId())) throw new BadRequestException("Path id does not equal userId");
        return userService.createUser(user);
    }


}
