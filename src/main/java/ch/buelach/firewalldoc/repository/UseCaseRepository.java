package ch.buelach.firewalldoc.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import ch.buelach.firewalldoc.model.UseCase;

public interface UseCaseRepository extends
        MongoRepository<UseCase, String> {

}
