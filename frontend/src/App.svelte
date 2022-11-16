<script>
  import Router from "svelte-spa-router";
  import Home from "./pages/Home.svelte";
  import routes from "./routes";
</script>

<div class="container-fluid" style="background-color: #ececee;">
<div style="padding-top: 15px; padding-bottom: 15px;">
<div class="row">
    <div class="col"><img
		src="https://www.buelach.ch/fileadmin/cd/Images/logo_stadtbuelach.png"
		alt="Stadt Bülach Logo"
		style="height: 50px; width: 231px;"
	  /></div>
    <div class="col"><h1 style="font-weight: bold;"><center> Firewall Documentation </center></h1></div>
	<div class="col"></div> 
</div>
</div>
</div>
<!-- Navigation -->
<div id="app">
  <nav
    class="navbar navbar-expand-lg"
    style="background-color: #969FAA; color: black; height: 38pt;"
  >
    <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarNav"
      aria-controls="navbarNav"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon" />
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav mx-auto">
        <li class="nav-item">
			<a class="nav-link" href="#/home">Home</a>
		  </li>
      <li class="nav-item">
          <a class="nav-link" aria-current="page" href="#/firewall-rules"
            >Firewall-Rules</a
          >
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#/contexts">Contexts</a>
        </li>
		
        <li class="nav-item">
          <a class="nav-link" href="#/network-Objects">Network-Objects</a>
		</li>
    <li class="nav-item">
          <a class="nav-link" href="#/network-Group-Objects"
            >Network-Group-Objects</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#/host-Objects">Host-Objects</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#/host-Group-Objects">Host-Group-Objects</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#/use-cases">Use-Cases</a>
        </li>
      </ul>
    </div>
  </nav>

  <div class="container">
    <Router {routes} />
  </div>
</div>
