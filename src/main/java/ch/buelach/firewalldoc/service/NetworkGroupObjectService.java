package ch.buelach.firewalldoc.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ch.buelach.firewalldoc.model.NetworkGroupObject;
import ch.buelach.firewalldoc.repository.NetworkGroupObjectRepository;
import ch.buelach.firewalldoc.repository.NetworkObjectRepository;

@Service
public class NetworkGroupObjectService {

    @Autowired
    NetworkGroupObjectRepository networkGroupObjectRepository;
    @Autowired
    NetworkObjectRepository networkObjectRepository;

    public Optional<NetworkGroupObject> assignNoToNgroupO(String ngoID, List<String> noIds) {

        if (networkGroupObjectRepository.findById(ngoID).isPresent()) {
            NetworkGroupObject networkGroupObject = networkGroupObjectRepository.findById(ngoID).get();
            List<String> noPresent = noIds.stream().filter(x -> networkObjectRepository.findById(x).isPresent())
                    .collect(Collectors.toList());
            if (networkGroupObject.getMembersId() != null) {
                List<String> noNew = noPresent.stream().filter(x -> !networkGroupObject.getMembersId().contains(x))
                        .collect(Collectors.toList());
                        networkGroupObject.getMembersId().addAll(noNew);
            } else {
                networkGroupObject.setMembersId(noPresent);
            }
            networkGroupObjectRepository.save(networkGroupObject);
            return Optional.of(networkGroupObject);
        }
        return Optional.empty();
    }
    
    
}
