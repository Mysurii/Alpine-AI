package alpine.api.v1.auth;

import alpine.api.v1.user.VerificationCode;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VerificationCodeRepository extends JpaRepository<VerificationCode, Long> {
    VerificationCode findVerificationCodeByToken(String token);
}
