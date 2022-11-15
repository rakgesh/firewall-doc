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

import ch.buelach.firewalldoc.model.FirewallRule;
import ch.buelach.firewalldoc.model.FirewallRuleCreateDTO;
import ch.buelach.firewalldoc.repository.FirewallRuleRepository;

@RestController
@RequestMapping("/firewall-rule")
public class FirewallRuleController {
    @Autowired
    FirewallRuleRepository firewallRuleRepository;

    @PostMapping("")
    public ResponseEntity<FirewallRule> createFirewallRule(
        @RequestBody FirewallRuleCreateDTO fwRuleDTO) {
            FirewallRule fwRuleDAO = new FirewallRule(fwRuleDTO.getFwTypeId(), fwRuleDTO.getContextId(), fwRuleDTO.getSourceId(), fwRuleDTO.getDestinationId(), fwRuleDTO.getSecurityGroupObjectId(), fwRuleDTO.getUseCaseId());
            FirewallRule fwRule = firewallRuleRepository.save(fwRuleDAO);
            return new ResponseEntity<>(fwRule, HttpStatus.CREATED);
        }

    @GetMapping("")
    public ResponseEntity<List<FirewallRule>> getAllFirewallRules() {
        List<FirewallRule> allFirewallRules = firewallRuleRepository.findAll();
        return new ResponseEntity<>(allFirewallRules, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FirewallRule> getFirewallRuleById(@PathVariable String id) {
        Optional<FirewallRule> optFwRule = firewallRuleRepository.findById(id);
        if (optFwRule.isPresent()) {
            return new ResponseEntity<>(optFwRule.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
}