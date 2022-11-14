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

import ch.buelach.firewalldoc.model.FirewallType;
import ch.buelach.firewalldoc.model.FirewallTypeCreateDTO;
import ch.buelach.firewalldoc.repository.FirewallTypeRepository;

@RestController
@RequestMapping("/firewall-type")
public class FirewallTypeController {
    @Autowired
    FirewallTypeRepository firewallTypeRepository;

    @PostMapping("")
    public ResponseEntity<FirewallType> createFirewallType(
            @RequestBody FirewallTypeCreateDTO fwTypeDTO) {
        FirewallType fwTypeDAO = new FirewallType(fwTypeDTO.getName(), fwTypeDTO.getDescription());
        FirewallType fwType = firewallTypeRepository.save(fwTypeDAO);
        return new ResponseEntity<>(fwType, HttpStatus.CREATED);
    }

    @GetMapping("")
    public ResponseEntity<List<FirewallType>> getAllFirewallTypes() {
        List<FirewallType> allFirewallTypes = firewallTypeRepository.findAll();
        return new ResponseEntity<>(allFirewallTypes, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FirewallType> getFirewallTypeById(@PathVariable String id) {
        Optional<FirewallType> optFwType = firewallTypeRepository.findById(id);
        if (optFwType.isPresent()) {
            return new ResponseEntity<>(optFwType.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

}
