package alpine.api.v1.auth;

import alpine.api.v1.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Calendar;
import java.util.Date;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class VerificationCode {
    private static final int EXPIRATION_TIME_IN_MINUTES = 15;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String code;
    private Date expirationDate;

    @OneToOne(mappedBy = "verificationCode")
    private User user;

    public VerificationCode(String code, User user) {
        this.code = code;
        this.user = user;
        this.expirationDate = this.getTokenExpirationDate();
    }

    private Date getTokenExpirationDate() {
        Calendar calendar = Calendar.getInstance();
        calendar.setTimeInMillis(new Date().getTime());
        calendar.add(Calendar.MINUTE, EXPIRATION_TIME_IN_MINUTES);
        return new Date(calendar.getTime().getTime());
    }


}
