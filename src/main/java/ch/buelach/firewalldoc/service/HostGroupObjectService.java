package ch.buelach.firewalldoc.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ch.buelach.firewalldoc.model.HostGroupObject;
import ch.buelach.firewalldoc.model.HostObject;
import ch.buelach.firewalldoc.model.HostObjectsToHostGroup;
import ch.buelach.firewalldoc.repository.HostGroupObjectRepository;
import ch.buelach.firewalldoc.repository.HostObjectRepository;

@Service
public class HostGroupObjectService {

    @Autowired
    HostGroupObjectRepository hostGroupObjectRepository;
    @Autowired
    HostObjectRepository hostObjectRepository;


    public List<HostObjectsToHostGroup> getHoOfHgroup() {
        List<HostGroupObject> allHostGroupObjects = hostGroupObjectRepository.findAll();
        List<HostObject> allHostObjects = hostObjectRepository.findAll();
        List<HostObjectsToHostGroup> all = new ArrayList<HostObjectsToHostGroup>();
        
        for (HostGroupObject hgo: allHostGroupObjects) {
            HostObjectsToHostGroup one = new HostObjectsToHostGroup();
            one.setHgoId(hgo.getId());
            one.setHgoName(hgo.getName());
            one.setHgoDescription(hgo.getDescription());
            one.setMembersId(hgo.getMembersId());

            for (String id: hgo.getMembersId()){
                List<HostObject> members = allHostObjects.stream().filter(x-> x.getId().equals(id)).collect(Collectors.toList());
                if (one.getMembers() == null ) {
                    one.setMembers(members);
                } else {
                    one.getMembers().addAll(members);
                }
                
            }
            
           all.add(one); 
        }
         
        
        return all;
    }
 }