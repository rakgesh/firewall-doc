package ch.buelach.firewalldoc.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ch.buelach.firewalldoc.model.NetworkGroupObject;
import ch.buelach.firewalldoc.model.NetworkObject;
import ch.buelach.firewalldoc.model.NetworkObjectsToNetworkGroup;
import ch.buelach.firewalldoc.repository.NetworkGroupObjectRepository;
import ch.buelach.firewalldoc.repository.NetworkObjectRepository;

@Service
public class NetworkGroupObjectService {

    @Autowired
    NetworkGroupObjectRepository networkGroupObjectRepository;
    @Autowired
    NetworkObjectRepository networkObjectRepository;

    public List<NetworkObjectsToNetworkGroup> getNoOfNgroup() {
        List<NetworkGroupObject> allNetworkGroupObjects = networkGroupObjectRepository.findAll();
        List<NetworkObject> allNetworkObjects = networkObjectRepository.findAll();
        List<NetworkObjectsToNetworkGroup> all = new ArrayList<NetworkObjectsToNetworkGroup>();
        for (NetworkGroupObject ngo: allNetworkGroupObjects) {
            NetworkObjectsToNetworkGroup one = new NetworkObjectsToNetworkGroup();
            one.setNgoId(ngo.getId());
            one.setNgoName(ngo.getName());
            one.setNgoDescription(ngo.getDescription());
            one.setMembersId(ngo.getMembersId());

            for (String id: ngo.getMembersId()){
                List<NetworkObject> members = allNetworkObjects.stream().filter(x-> x.getId().equals(id)).collect(Collectors.toList());
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
