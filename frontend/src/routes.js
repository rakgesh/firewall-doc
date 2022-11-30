
import Home from "./pages/Home.svelte";
import FirewallRules from "./pages/Firewall-Rules.svelte";
import Contexts from "./pages/Contexts.svelte";
import NetworkObjects from "./pages/Network-Objects.svelte";
import NetworkGroupObjects from "./pages/Network-Group-Objects.svelte";
import HostObjects from "./pages/Host-Objects.svelte";
import HostGroupObjects from "./pages/Host-Group-Objects.svelte";
import ServiceGroupObjects from "./pages/Service-Group-Objects.svelte";
import UseCases from "./pages/Use-Cases.svelte";




export default {
    '/': Home,
    '/home': Home,
    '/firewall-Rules': FirewallRules,
    '/contexts': Contexts,
    '/network-Objects' : NetworkObjects,
    '/network-Group-Objects': NetworkGroupObjects,
    '/host-Objects': HostObjects,
    '/host-Group-Objects': HostGroupObjects,
    '/service-Group-Objects': ServiceGroupObjects,
    '/use-cases': UseCases,
    
    
    
}