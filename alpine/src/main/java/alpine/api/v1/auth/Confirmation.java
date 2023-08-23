package alpine.api.v1.auth;

import alpine.api.v1.user.User;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;

import java.util.Calendar;
import java.util.Date;
import java.util.UUID;

@NoArgsConstructor
@Entity
@Data
@Table(name = "confirmations")
public class Confirmation {
    private static final int EXPIRATION_TIME_IN_MINUTES = 15;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String token;
    @Temporal(TemporalType.TIMESTAMP)
    @CreatedDate
    private Date expirationDate;

    @OneToOne(targetEntity = User.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public Confirmation(User user) {
        this.user = user;
        this.expirationDate = this.getTokenExpirationDate();
        this.token = UUID.randomUUID().toString();
    }

    private Date getTokenExpirationDate() {
        Calendar calendar = Calendar.getInstance();
        calendar.setTimeInMillis(new Date().getTime());
        calendar.add(Calendar.MINUTE, EXPIRATION_TIME_IN_MINUTES);
        return new Date(calendar.getTime().getTime());
    }


}
