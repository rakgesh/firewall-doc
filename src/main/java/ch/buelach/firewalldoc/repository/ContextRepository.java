package ch.buelach.firewalldoc.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import ch.buelach.firewalldoc.model.Context;

public interface ContextRepository extends
        MongoRepository<Context, String> {

}
