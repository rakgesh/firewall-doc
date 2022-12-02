package ch.buelach.firewalldoc.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ch.buelach.firewalldoc.model.UseCase;
import ch.buelach.firewalldoc.model.UseCaseCreateDTO;
import ch.buelach.firewalldoc.model.UseCaseEditDTO;
import ch.buelach.firewalldoc.repository.UseCaseRepository;

@RestController
@RequestMapping("/api/use-case")
public class UseCaseController {
    @Autowired
    UseCaseRepository useCaseRepository;

    @PostMapping("")
    public ResponseEntity<UseCase> createUseCase(
            @RequestBody UseCaseCreateDTO uDTO) {
        UseCase uDAO = new UseCase(uDTO.getName(), uDTO.getDescription(), uDTO.getTags());
        UseCase u = useCaseRepository.save(uDAO);
        return new ResponseEntity<>(u, HttpStatus.CREATED);
    }

    @GetMapping("")
    public ResponseEntity<List<UseCase>> getAllUsecases() {
        List<UseCase> allUseCases = useCaseRepository.findAll();
        return new ResponseEntity<>(allUseCases, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UseCase> getUseCaseById(@PathVariable String id) {
        Optional<UseCase> optUseCase = useCaseRepository.findById(id);
        if (optUseCase.isPresent()) {
            return new ResponseEntity<>(optUseCase.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("")
    public ResponseEntity<UseCase> editUseCase(@RequestBody UseCaseEditDTO ucEditDTO) {
        UseCase uDAO = useCaseRepository.findById(ucEditDTO.getId()).get();
        uDAO.setName(ucEditDTO.getName());
        uDAO.setDescription(ucEditDTO.getDescription());
        uDAO.setTags(ucEditDTO.getTags());
        UseCase u = useCaseRepository.save(uDAO);
        return new ResponseEntity<>(u, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<UseCase> getUseCaseToDeleteById(@PathVariable String id) {
        UseCase u = useCaseRepository.findById(id).get();
        useCaseRepository.delete(u);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
