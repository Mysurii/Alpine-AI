package com.alpine.api.v1.user;

import com.alpine.api.v1.user.exceptions.UserAlreadyExistsException;
import com.alpine.api.v1.user.interfaces.UserService;
import com.alpine.common.exceptions.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;


    @Override
    public List<User> getUsers() {
        return userRepository.findAll();
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmailIgnoreCase(email);
    }

    @Override
    public User createUser(User user) {
        if (userRepository.existsByEmail(user.getEmail()))
            throw new UserAlreadyExistsException("User already exists");
        user.setVerified(false); // to be sure that new user is not verified already
        user.setPassword(new BCryptPasswordEncoder().encode(user.getPassword()));
        return userRepository.save(user);
    }

    @Override
    public User updateUser(Long id, User updatedUser) {
        if (!userRepository.existsByEmail(updatedUser.getEmail()))
            return null;

        updatedUser.setId(id);
        return userRepository.save(updatedUser);

    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return  userRepository.findByEmailIgnoreCase(username).orElseThrow(() -> new NotFoundException("User not found"));
    }
}
