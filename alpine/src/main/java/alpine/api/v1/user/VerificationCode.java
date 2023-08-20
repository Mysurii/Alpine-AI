package alpine.api.v1.user;

import jakarta.persistence.*;

import java.util.Date;

@Entity
public class VerificationCode {
    private static final int EXPIRTAION = 60 * 24;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "verification_id")
    private Long id;

    private String token;

    @OneToOne(targetEntity = User.class, fetch=FetchType.EAGER)
    private User user;

    @Temporal(TemporalType.TIMESTAMP)
    private Date createdDate;





}
