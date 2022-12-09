package ch.buelach.firewalldoc.model;

public class FirewallRuleDetail {
    private String fwId;
    private FirewallType fwType;
    private Context context;
    private HostObject sHo;
    private HostObjectsToHostGroup sHgoWithHo;
    private NetworkObject sNo;
    private NetworkObjectsToNetworkGroup sNgoWithNo;
    private HostObject dHo;
    private HostObjectsToHostGroup dHgoWithHo;
    private NetworkObject dNo;
    private NetworkObjectsToNetworkGroup dNgoWithNo;
    private ServiceGroupObject sgo;
    private UseCase uc; 
    private FirewallStatus firewallStatus;

    
    public FirewallRuleDetail() {
    }


    public String getFwId() {
        return fwId;
    }


    public void setFwId(String fwId) {
        this.fwId = fwId;
    }


    public FirewallType getFwType() {
        return fwType;
    }


    public void setFwType(FirewallType fwType) {
        this.fwType = fwType;
    }


    public Context getContext() {
        return context;
    }


    public void setContext(Context context) {
        this.context = context;
    }


    public HostObject getsHo() {
        return sHo;
    }


    public void setsHo(HostObject sHo) {
        this.sHo = sHo;
    }


    public HostObjectsToHostGroup getsHgoWithHo() {
        return sHgoWithHo;
    }


    public void setsHgoWithHo(HostObjectsToHostGroup sHgoWithHo) {
        this.sHgoWithHo = sHgoWithHo;
    }


    public NetworkObject getsNo() {
        return sNo;
    }


    public void setsNo(NetworkObject sNo) {
        this.sNo = sNo;
    }


    public NetworkObjectsToNetworkGroup getsNgoWithNo() {
        return sNgoWithNo;
    }


    public void setsNgoWithNo(NetworkObjectsToNetworkGroup sNgoWithNo) {
        this.sNgoWithNo = sNgoWithNo;
    }


    public HostObject getdHo() {
        return dHo;
    }


    public void setdHo(HostObject dHo) {
        this.dHo = dHo;
    }


    public HostObjectsToHostGroup getdHgoWithHo() {
        return dHgoWithHo;
    }


    public void setdHgoWithHo(HostObjectsToHostGroup dHgoWithHo) {
        this.dHgoWithHo = dHgoWithHo;
    }


    public NetworkObject getdNo() {
        return dNo;
    }


    public void setdNo(NetworkObject dNo) {
        this.dNo = dNo;
    }


    public NetworkObjectsToNetworkGroup getdNgoWithNo() {
        return dNgoWithNo;
    }


    public void setdNgoWithNo(NetworkObjectsToNetworkGroup dNgoWithNo) {
        this.dNgoWithNo = dNgoWithNo;
    }


    public ServiceGroupObject getSgo() {
        return sgo;
    }


    public void setSgo(ServiceGroupObject sgo) {
        this.sgo = sgo;
    }


    public UseCase getUc() {
        return uc;
    }


    public void setUc(UseCase uc) {
        this.uc = uc;
    }


    public FirewallStatus getFirewallStatus() {
        return firewallStatus;
    }


    public void setFirewallStatus(FirewallStatus firewallStatus) {
        this.firewallStatus = firewallStatus;
    }

}
