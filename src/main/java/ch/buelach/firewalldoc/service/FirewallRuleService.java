package ch.buelach.firewalldoc.service;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ch.buelach.firewalldoc.model.FirewallRule;
import ch.buelach.firewalldoc.model.FirewallRuleDetail;
import ch.buelach.firewalldoc.model.FirewallType;
import ch.buelach.firewalldoc.model.HostGroupObject;
import ch.buelach.firewalldoc.model.HostObject;
import ch.buelach.firewalldoc.model.NetworkGroupObject;
import ch.buelach.firewalldoc.model.NetworkObject;
import ch.buelach.firewalldoc.model.ServiceGroupObject;
import ch.buelach.firewalldoc.model.UseCase;
import ch.buelach.firewalldoc.repository.ContextRepository;
import ch.buelach.firewalldoc.repository.FirewallRuleRepository;
import ch.buelach.firewalldoc.repository.FirewallTypeRepository;
import ch.buelach.firewalldoc.repository.HostGroupObjectRepository;
import ch.buelach.firewalldoc.repository.HostObjectRepository;
import ch.buelach.firewalldoc.repository.NetworkGroupObjectRepository;
import ch.buelach.firewalldoc.repository.NetworkObjectRepository;
import ch.buelach.firewalldoc.repository.ServiceGroupObjectRepository;
import ch.buelach.firewalldoc.repository.UseCaseRepository;

@Service
public class FirewallRuleService {
    @Autowired
    FirewallRuleRepository firewallRuleRepository;
    @Autowired
    FirewallTypeRepository firewallTypeRepository;
    @Autowired
    ContextRepository contextRepository;
    @Autowired
    HostGroupObjectRepository hostGroupObjectRepository;
    @Autowired
    HostObjectRepository hostObjectRepository;
    @Autowired
    NetworkGroupObjectRepository networkGroupObjectRepository;
    @Autowired
    NetworkObjectRepository networkObjectRepository;
    @Autowired
    ServiceGroupObjectRepository serviceGroupObjectRepository;
    @Autowired
    UseCaseRepository useCaseRepository;
    

    public List<FirewallRuleDetail> getFirewallruleDetail() {
        List<FirewallRuleDetail> all = new ArrayList<FirewallRuleDetail>();
        List<FirewallRule> allFirewallRules = firewallRuleRepository.findAll();
        List<FirewallType> allFirewallTypes = firewallTypeRepository.findAll();
        List<HostObject> allHostObjects = hostObjectRepository.findAll();
        List<HostGroupObject> allHostGroupObject = hostGroupObjectRepository.findAll();
        List<NetworkObject> allNetworkObject = networkObjectRepository.findAll();
        List<NetworkGroupObject> allNetworkGroupObject = networkGroupObjectRepository.findAll();
        List<ServiceGroupObject> allServiceGroupObjects = serviceGroupObjectRepository.findAll();
        List<UseCase> allUseCases = useCaseRepository.findAll();

        for (FirewallRule f : allFirewallRules) {
            FirewallRuleDetail one = new FirewallRuleDetail();
            one.setFwId(f.getId());

            for (FirewallType ft : allFirewallTypes) {
                if (ft.getId().equals(f.getFwTypeId())) {
                    one.setFwType(ft);
                }                
            }

            for (HostObject ho : allHostObjects) {
                if (ho.getId().equals(f.getSourceId())) {
                    one.setSHo(ho);
                } 
            }

            for (HostGroupObject hgo : allHostGroupObject) {
                if (hgo.getId().equals(f.getSourceId())) {
                    one.setSHgo(hgo);
                }
            }
            
            for (NetworkObject no : allNetworkObject) {
                if (no.getId().equals(f.getSourceId())) {
                    one.setSNo(no);
                }
            }

            for (NetworkGroupObject ngo : allNetworkGroupObject) {
                if (ngo.getId().equals(f.getSourceId())) {
                    one.setSNgo(ngo);
                }
            }

            for (HostObject ho : allHostObjects) {
                if (ho.getId().equals(f.getDestinationId())) {
                    one.setDHo(ho);
                } 
            }

            for (HostGroupObject hgo : allHostGroupObject) {
                if (hgo.getId().equals(f.getDestinationId())) {
                    one.setDHgo(hgo);
                }
            }
            
            for (NetworkObject no : allNetworkObject) {
                if (no.getId().equals(f.getDestinationId())) {
                    one.setDNo(no);
                }
            }

            for (NetworkGroupObject ngo : allNetworkGroupObject) {
                if (ngo.getId().equals(f.getDestinationId())) {
                    one.setDNgo(ngo);
                }
            }

            for (ServiceGroupObject sgo : allServiceGroupObjects) {
                if (sgo.getId().equals(f.getServiceGroupObjectId())) {
                    one.setSgo(sgo);
                }                
            }

            for (UseCase uc : allUseCases) {
                if (uc.getId().equals(f.getUseCaseId())) {
                    one.setUc(uc);
                }
            }

            one.setFirewallStatus(f.getFirewallStatus());

            all.add(one);

            }

            return all; 

        }
  

    
}

