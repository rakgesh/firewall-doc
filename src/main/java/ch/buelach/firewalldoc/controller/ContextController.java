package ch.buelach.firewalldoc.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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
        if (cDAO.getSubnet().equals("128.0.0.0")) {
            cDAO.setSubnet("/1");
        } else if (cDAO.getSubnet().equals("192.0.0.0")) {
            cDAO.setSubnet("/2");
        } else if (cDAO.getSubnet().equals("224.0.0.0")) {
            cDAO.setSubnet("/3");
        } else if (cDAO.getSubnet().equals("240.0.0.0")) {
            cDAO.setSubnet("/4");
        } else if (cDAO.getSubnet().equals("248.0.0.0")) {
            cDAO.setSubnet("/5");
        } else if (cDAO.getSubnet().equals("252.0.0.0")) {
            cDAO.setSubnet("/6");
        } else if (cDAO.getSubnet().equals("254.0.0.0")) {
            cDAO.setSubnet("/7");
        } else if (cDAO.getSubnet().equals("255.0.0.0")) {
            cDAO.setSubnet("/8");
        } else if (cDAO.getSubnet().equals("255.128.0.0")) {
            cDAO.setSubnet("/9");
        } else if (cDAO.getSubnet().equals("255.192.0.0")) {
            cDAO.setSubnet("/10");
        } else if (cDAO.getSubnet().equals("255.224.0.0")) {
            cDAO.setSubnet("/11");
        } else if (cDAO.getSubnet().equals("255.240.0.0")) {
            cDAO.setSubnet("/12");
        } else if (cDAO.getSubnet().equals("255.248.0.0")) {
            cDAO.setSubnet("/13");
        } else if (cDAO.getSubnet().equals("255.252.0.0")) {
            cDAO.setSubnet("/14");
        } else if (cDAO.getSubnet().equals("255.254.0.0")) {
            cDAO.setSubnet("/15");
        } else if (cDAO.getSubnet().equals("255.255.0.0")) {
            cDAO.setSubnet("/16");
        } else if (cDAO.getSubnet().equals("255.255.128.0")) {
            cDAO.setSubnet("/17");
        } else if (cDAO.getSubnet().equals("255.255.192.0")) {
            cDAO.setSubnet("/18");
        } else if (cDAO.getSubnet().equals("255.255.224.0")) {
            cDAO.setSubnet("/19");
        } else if (cDAO.getSubnet().equals("255.255.240.0")) {
            cDAO.setSubnet("/20");
        } else if (cDAO.getSubnet().equals("255.255.248.0")) {
            cDAO.setSubnet("/21");  
        } else if (cDAO.getSubnet().equals("255.255.252.0")) {
            cDAO.setSubnet("/22");
        } else if (cDAO.getSubnet().equals("255.255.254.0")) {
            cDAO.setSubnet("/23");
        } else if (cDAO.getSubnet().equals("255.255.255.0")) {
            cDAO.setSubnet("/24");
        } else if (cDAO.getSubnet().equals("255.255.255.128")) {
            cDAO.setSubnet("/25");
        } else if (cDAO.getSubnet().equals("255.255.255.192")) {
            cDAO.setSubnet("/26");
        } else if (cDAO.getSubnet().equals("255.255.255.224")) {
            cDAO.setSubnet("/27");
        } else if (cDAO.getSubnet().equals("255.255.255.240")) {
            cDAO.setSubnet("/28");
        } else if (cDAO.getSubnet().equals("255.255.255.248")) {
            cDAO.setSubnet("/29");
        } else if (cDAO.getSubnet().equals("255.255.255.252")) {
            cDAO.setSubnet("/30");
        } else if (cDAO.getSubnet().equals("255.255.255.254")) {
            cDAO.setSubnet("/31");
        } else if (cDAO.getSubnet().equals("255.255.255.255")) {
            cDAO.setSubnet("/32");
        }
        Context c = contextRepository.save(cDAO);
        return new ResponseEntity<>(c, HttpStatus.CREATED);
    }

    @GetMapping("")
    public ResponseEntity<List<Context>> getAllContexts() {
        List<Context> allContexts = contextRepository.findAll();
        return new ResponseEntity<>(allContexts, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Context> getContextById(@PathVariable String id) {
        Optional<Context> optContext = contextRepository.findById(id);
        if (optContext.isPresent()) {
            return new ResponseEntity<>(optContext.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    /*
    @PutMapping("/{id}/edit")
    public ResponseEntity<Context> editContext(@PathVariable String id) {
        Optional<Context> optContext = contextRepository.findById(id);
            
        return new ResponseEntity<>(c, HttpStatus.CREATED); 
        }

        "/([0-9]|[1-2][0-9]|3[0-2])$"gm

         */
}
