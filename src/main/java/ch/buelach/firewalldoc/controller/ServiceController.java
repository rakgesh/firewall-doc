package ch.buelach.firewalldoc.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ch.buelach.firewalldoc.model.FirewallRule;
import ch.buelach.firewalldoc.model.FirewallRuleDetail;
import ch.buelach.firewalldoc.model.FirewallStatusChangeDTO;
import ch.buelach.firewalldoc.model.HostObjectsToHostGroup;
import ch.buelach.firewalldoc.model.NetworkObjectsToNetworkGroup;
import ch.buelach.firewalldoc.repository.FirewallRuleRepository;
import ch.buelach.firewalldoc.service.FirewallRuleService;
import ch.buelach.firewalldoc.service.HostGroupObjectService;
import ch.buelach.firewalldoc.service.NetworkGroupObjectService;


@RestController
@RequestMapping("/api/service")
public class ServiceController {
    @Autowired
    HostGroupObjectService hostGroupObjectService;
    @Autowired
    NetworkGroupObjectService networkGroupObjectService;
    @Autowired
    FirewallRuleService firewallRuleService;
    @Autowired
    FirewallRuleRepository firewallRuleRepository;

    @GetMapping("/findHo")
    public ResponseEntity<List<HostObjectsToHostGroup>> getHoOfHgroup() {
        List<HostObjectsToHostGroup> all = hostGroupObjectService.getHoOfHgroup();
        return new ResponseEntity<>(all, HttpStatus.OK);
    }

    @GetMapping("/findNo")
    public ResponseEntity<List<NetworkObjectsToNetworkGroup>> getNoOfNgroup() {
        List<NetworkObjectsToNetworkGroup> all = networkGroupObjectService.getNoOfNgroup();
        return new ResponseEntity<>(all, HttpStatus.OK);
    }

    @GetMapping("/findFwD")
    public ResponseEntity<List<FirewallRuleDetail>> getFwDetail() {
        List<FirewallRuleDetail> all = firewallRuleService.getFirewallruleDetail();
        return new ResponseEntity<>(all, HttpStatus.OK);
    }

    @PostMapping("/change-status")
    public ResponseEntity<FirewallRule> changeStatus(@RequestBody FirewallStatusChangeDTO fwSC) {
        FirewallRule toChange = firewallRuleService.changeStatus(fwSC);
        return new ResponseEntity<>(toChange, HttpStatus.OK);
    }

    }
    

