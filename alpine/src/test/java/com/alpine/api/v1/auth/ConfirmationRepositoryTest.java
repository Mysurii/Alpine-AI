package com.alpine.api.v1.auth;

import com.alpine.api.v1.user.User;
import com.alpine.api.v1.user.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@DataJpaTest
class ConfirmationRepositoryTest {

    @Autowired
    private ConfirmationRepository confirmationRepository;
    @Autowired
    private UserRepository userRepository;

    @AfterEach
    void tearDown() {
        confirmationRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    void itShouldFindConfirmationByCode() {
        //given
        User user = new User();
        user.setName("John Doe");
        user.setEmail("john@doe.com");
        user.setPassword("Password");
        userRepository.save(user);

        Confirmation confirmation = new Confirmation(user);
        confirmationRepository.save(confirmation);

        //when
        Optional<Confirmation> foundConfirmation = confirmationRepository.findByToken(confirmation.getToken());

        //then
        assertThat(foundConfirmation.isPresent()).isTrue();
    }

    @Test
    void itShouldNotFindConfirmationCodeWhenItDoesNotExist() {
        //given
        String token = "TokenThatDoesNotExist";

        //when
        Optional<Confirmation> foundConfirmation = confirmationRepository.findByToken(token);

        //then
        assertThat(foundConfirmation.isPresent()).isFalse();
    }
}
