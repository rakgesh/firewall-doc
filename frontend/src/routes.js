
import Home from "./pages/Home.svelte";
import HostGroupObjects from "./pages/Host-Group-Objects.svelte";
import HostObjects from "./pages/Host-Objects.svelte";

export default {
    '/': Home,
    '/home': Home,
    '/host-Group-Objects': HostGroupObjects,

    '/host-Objects': HostObjects,
}