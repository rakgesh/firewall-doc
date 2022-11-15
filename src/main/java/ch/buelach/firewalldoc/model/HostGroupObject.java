package ch.buelach.firewalldoc.model;

import java.util.List;

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
@Document("host-group-object")
public class HostGroupObject {

    @Id
    private String id;
    @NonNull
    private String name;
    @NonNull
    private String description;
    private List<String> membersId;

}
