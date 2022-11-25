package ch.buelach.firewalldoc.model;

import javax.validation.constraints.Pattern;

import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
public class ContextCreateDTO {
    private String name;
    private String ip;
    @Pattern(regexp = "/([0-9]|[1-2][0-9]|3[0-2])$",
    message = "username must be of 6 to 12 length with no special characters")
    private String subnet;
    private String description;
    
}
