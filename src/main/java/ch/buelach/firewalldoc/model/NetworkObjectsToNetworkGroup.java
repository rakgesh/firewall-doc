package ch.buelach.firewalldoc.model;

import java.util.List;

public class NetworkObjectsToNetworkGroup {
    private String ngoId;
    private String ngoName;
    private String ngoDescription;
    private List<String> membersId;
    private List<NetworkObject> members;

    public NetworkObjectsToNetworkGroup() {
    }

    public String getNgoId() {
        return ngoId;
    }

    public void setNgoId(String ngoId) {
        this.ngoId = ngoId;
    }

    public String getNgoName() {
        return ngoName;
    }

    public void setNgoName(String ngoName) {
        this.ngoName = ngoName;
    }

    public String getNgoDescription() {
        return ngoDescription;
    }

    public void setNgoDescription(String ngoDescription) {
        this.ngoDescription = ngoDescription;
    }

    public List<String> getMembersId() {
        return membersId;
    }

    public void setMembersId(List<String> membersId) {
        this.membersId = membersId;
    }

    public List<NetworkObject> getMembers() {
        return members;
    }

    public void setMembers(List<NetworkObject> members) {
        this.members = members;
    }

}
