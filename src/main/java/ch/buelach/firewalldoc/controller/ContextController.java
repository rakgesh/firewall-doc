package ch.buelach.firewalldoc.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ch.buelach.firewalldoc.model.Context;
import ch.buelach.firewalldoc.model.ContextCreateDTO;
import ch.buelach.firewalldoc.repository.ContextRepository;

@RestController
@RequestMapping("/context")
public class ContextController {

    @Autowired
    ContextRepository contextRepository;

    @PostMapping("")
    public ResponseEntity<Context> createContext(
            @RequestBody ContextCreateDTO cDTO) {
        Context cDAO = new Context(cDTO.getName(), cDTO.getIp(), cDTO.getSubnet(), cDTO.getDescription());
        Context c = contextRepository.save(cDAO);
        return new ResponseEntity<>(c, HttpStatus.CREATED);
    }

    @GetMapping("")
    public ResponseEntity<List<Context>> getAllContexts() {
        List<Context> allContexts = contextRepository.findAll();
        return new ResponseEntity<>(allContexts, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Context> getFirewallTypeById(@PathVariable String id) {
        Optional<Context> optContext = contextRepository.findById(id);
        if (optContext.isPresent()) {
            return new ResponseEntity<>(optContext.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

}
