package ch.buelach.firewalldoc.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@RequiredArgsConstructor
@Document("context")
public class Context {

    @Id
    private String id;
    @NonNull
    private String name;
    @NonNull
    private String ip;
    @NonNull
    private String subnet;
    @NonNull
    private String description;
}
