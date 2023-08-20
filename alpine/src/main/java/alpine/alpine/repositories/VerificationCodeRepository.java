package alpine.alpine.repositories;

import alpine.alpine.user.VerificationCode;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VerificationCodeRepository extends JpaRepository<VerificationCode, Long> {
    VerificationCode findVerificationCodeByToken(String token);
}
