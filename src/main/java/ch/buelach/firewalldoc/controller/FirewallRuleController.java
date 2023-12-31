package ch.buelach.firewalldoc.controller;

import java.util.Comparator;
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

import ch.buelach.firewalldoc.model.FirewallRule;
import ch.buelach.firewalldoc.model.FirewallRuleByTypeAggregationDTO;
import ch.buelach.firewalldoc.model.FirewallRuleCreateDTO;
import ch.buelach.firewalldoc.model.FirewallRuleEditDTO;
import ch.buelach.firewalldoc.model.FirewallStatus;
import ch.buelach.firewalldoc.repository.FirewallRuleRepository;
import ch.buelach.firewalldoc.service.EmailServiceImpl;


@RestController
@RequestMapping("/api/firewall-rule")
public class FirewallRuleController {
    @Autowired
    FirewallRuleRepository firewallRuleRepository;
    @Autowired
    EmailServiceImpl emailServiceImpl;

    @PostMapping("")
    public ResponseEntity<FirewallRule> createFirewallRule(
        @RequestBody FirewallRuleCreateDTO fwRuleDTO) {
            FirewallRule fwRuleDAO = new FirewallRule(fwRuleDTO.getFwTypeId(), fwRuleDTO.getContextId(), fwRuleDTO.getSourceId(), fwRuleDTO.getDestinationId(), fwRuleDTO.getServiceGroupObjectId(), fwRuleDTO.getUseCaseId(), fwRuleDTO.getUserMail());
            FirewallRule fwRule = firewallRuleRepository.save(fwRuleDAO);
            emailServiceImpl.sendMessageRequested("ganesrak@students.zhaw.ch", fwRule.getId());
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

    @PutMapping("")
    public ResponseEntity<FirewallRule> editFWRule(@RequestBody FirewallRuleEditDTO fwEditDTO) {
        FirewallRule fwDAO = firewallRuleRepository.findById(fwEditDTO.getId()).get();
        fwDAO.setFwTypeId(fwEditDTO.getFwTypeId());
        fwDAO.setContextId(fwEditDTO.getContextId());
        fwDAO.setSourceId(fwEditDTO.getSourceId());
        fwDAO.setDestinationId(fwEditDTO.getDestinationId());
        fwDAO.setServiceGroupObjectId(fwEditDTO.getServiceGroupObjectId());
        fwDAO.setUseCaseId(fwEditDTO.getUseCaseId());
        if (!fwEditDTO.getFirewallStatus().equals("REQUESTED_FOR_APPROVAL")) {
            fwDAO.setUserMail(fwEditDTO.getUserMail());
            fwDAO.setFirewallStatus(FirewallStatus.EDITED);
            emailServiceImpl.sendMessageEdited("ganesrak@students.zhaw.ch", fwEditDTO.getId());
        }
        FirewallRule fw = firewallRuleRepository.save(fwDAO);
        return new ResponseEntity<>(fw, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<FirewallRule> getFirewallRuleToDeleteById(@PathVariable String id) {
        FirewallRule fw = firewallRuleRepository.findById(id).get();
        firewallRuleRepository.delete(fw);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/byFwType")
    public ResponseEntity <List<FirewallRuleByTypeAggregationDTO>> getFirewallRuleByTypeAggregation() {
        List<FirewallRuleByTypeAggregationDTO> fwByTypeAgg = firewallRuleRepository.getFirewallRuleByTypeAggregation();
        List<FirewallRuleByTypeAggregationDTO> fwByT = fwByTypeAgg.stream().sorted(Comparator.comparing(FirewallRuleByTypeAggregationDTO::getId)).toList();
        fwByT.get(0).setName("Cisco Zonen Firewall");
        fwByT.get(1).setName("Sophos Perimeter Firewall");
        return new ResponseEntity<>(fwByT, HttpStatus.OK);
    }
    }
