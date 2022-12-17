<script>
  import Router from "svelte-spa-router";
  import routes from "./routes";
  import { isAuthenticated, user } from "./store";
  import auth from "./auth.service";
</script>

<div class="container-fluid" style="background-color: #ececee;">
  <div style="padding-top: 15px; padding-bottom: 15px;">
    <div class="row">
      <div class="col">
        <a href="#/home"
          ><img
            src="https://www.buelach.ch/fileadmin/cd/Images/logo_stadtbuelach.png"
            alt="Stadt Bülach Logo"
            style="height: 50px; width: 231px;"
          /></a
        >
      </div>
      <div class="col">
        <h1 style="font-weight: bold;">
          <center> Firewall Documentation </center>
        </h1>
      </div>
      <div class="col" style="margin-top: 6px;">
        {#if $isAuthenticated}
        <div class="input-group" style="width: 300px; float: right; margin-right: 10px;">
          <input type="text" class="form-control" placeholder="{$user.name}" aria-label="username" aria-describedby="button-addon2" readonly>
          <button
            type="button"
            class="btn"
            data-dismiss="modal"
            style="background-color: #c73834; color: #fff; font-size: 18px;"
            on:click={auth.logout}>Log Out</button
          ></div>
        {:else}
          <button
            type="button"
            class="btn"
            data-dismiss="modal"
            style="background-color: #c73834; color: #fff; float: right; margin-right: 10px; font-size: 18px;"
            on:click={auth.loginWithPopup}>Log In</button
          >
        {/if}
      </div>
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
        {#if $isAuthenticated}
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
              >Network-Group-Objects</a
            >
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#/host-Objects">Host-Objects</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#/host-Group-Objects"
              >Host-Group-Objects</a
            >
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#/service-Group-Objects"
              >Service-Group-Objects</a
            >
          </li>
        {/if}
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
