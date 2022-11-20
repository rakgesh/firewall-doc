
import Home from "./pages/Home.svelte";
import HostGroupObjects from "./pages/Host-Group-Objects.svelte";
import HostObjects from "./pages/Host-Objects.svelte";
import NetworkObjects from "./pages/Network-Objects.svelte";
import NetworkGroupObjects from "./pages/Network-Group-Objects.svelte";

export default {
    '/': Home,
    '/home': Home,
    '/host-Group-Objects': HostGroupObjects,
    '/network-Objects' : NetworkObjects,
    '/host-Objects': HostObjects,
    '/network-Group-Objects': NetworkGroupObjects,
}