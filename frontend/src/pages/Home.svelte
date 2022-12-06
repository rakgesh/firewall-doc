<script>
  import axios from "axios";
  import { each } from "svelte/internal";

  const api_root = "http://localhost:8080/api";

  let fwRulesByType = [];
  let fwRbyTypeZone = [];
  let zonenId = "63624cb4cad6de381d422c77";
  let perimId = "638b9d67ad3a355f6044babe";
  let zonenCount = 0;
  let perimCount = 0;

  function getFirewallRulesByType() {
    var config = {
      method: "get",
      url: api_root + "/firewall-rule/byFwType",
      headers: {},
    };

    axios(config)
      .then(function (response) {
        fwRulesByType = response.data;
      })
      .catch(function (error) {
        alert("Could not get Firewall Rules by Type");
        console.log(error);
      });
  }
  getFirewallRulesByType();
</script>

<div style="margin-left: -52px; margin-right: -52px;">
  <h2 style="margin-left: 20px; margin-top: 15px;"><strong>Pie chart of firewall rules on each system</strong></h2>
  <div id="my-pie-chart-container">
    <div id="my-pie-chart">
      <div id="legenda">
        <div class="entry">
          <div id="color-red" class="entry-color" />
          <div class="entry-text">Cisco Zonen Firewall (4)</div>
        </div>
        <div class="entry">
          <div id="color-grey" class="entry-color" />
          <div class="entry-text">Sophos Perimeter Firewall (1)</div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  #my-pie-chart-container {
    align-items: center;
    width: 520px;
    height: 550px;
    margin-top: 10px;
  }

  #my-pie-chart {
    height: 500px;
    width: 500px;
    border-radius: 50%;
    background: conic-gradient(#c73834 0% 80%, #969faa 80%);
    margin-left: 7px;
    padding-top: 100px;
  }

  #legenda {
    padding: 5px;
    margin-top: 420px;
  }

  .entry {
    margin-left: 180px;
    display: flex;
    align-items: center;
  }

  .entry-color {
    height: 10px;
    width: 10px;
  }

  .entry-text {
    margin-left: 5px;
  }

  #color-red {
    background-color: #c73834;
  }

  #color-grey {
    background-color: #969faa;
  }
</style>
