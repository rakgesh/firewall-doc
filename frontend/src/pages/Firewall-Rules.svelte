<script>
    import axios from "axios";

 
  
  
  
   
    const api_root = "http://localhost:8080/api";
  //-----------------------------
  
    let firewallRules = [];
    let firewallRule = {
        fwTypeId: null,
        contextId: null,
        sourceId: null,
        destinationId: null,
        serviceGroupObjectId: null,
        useCaseId: null,
    };
  
    function getFirewallRules() {
      var config = {
        method: "get",
        url: api_root + "/service/findFwD",
        headers: {},
      };
  
      axios(config)
        .then(function (response) {
            firewallRules = response.data;
        })
        .catch(function (error) {
          alert("Could not get Firewall Rules");
          console.log(error);
        });
    }
    getFirewallRules();


  
  //-----------------------------
  
  function createFirewallRule() {
      var config = {
        method: "post",
        url: api_root + "/firwall-rule",
        headers: {
          "Content-Type": "application/json",
        },
        data: firewallRule,
      };
  
      axios(config)
        .then(function (response) {
            getFirewallRules();
        })
        .catch(function (error) {
          alert("Could not create Firewall Rules");
          console.log(error);
        });
    }
  
  //-----------------------------
    
    let sortBy = {col: "fwType", ascending: true};
      
      $: sort = (column) => {
          
          if (sortBy.col == column) {
              sortBy.ascending = !sortBy.ascending
          } else {
              sortBy.col = column
              sortBy.ascending = true
          }
          
          // Modifier to sorting function for ascending or descending
          let sortModifier = (sortBy.ascending) ? 1 : -1;
          
          let sort = (a, b) => 
              (a[column] < b[column]) 
              ? -1 * sortModifier 
              : (a[column] > b[column]) 
              ? 1 * sortModifier 
              : 0;
          
              firewallRules = firewallRules.sort(sort);
      }
  
  // search
  
  </script>
  
  <div class="container-fluid">
    <div class="row">
      <div class="col">
        <h3 style="margin-top: 15px; font-weight: bold;">Firewall Rules</h3>
      </div>
      <div class="col" />
      <div class="col" style="text-align-last: right;">
        <button
          type="button"
          class="btn"
          data-toggle="modal" data-target="#createFWR"
          style="margin-top: 9px; background-color: #c73834; color: #fff"
          >Add Firewall Rule</button
        >
      </div>
    </div>
  </div>
  <table class="table table-striped table-hover" id="allFirwallRules">
    <thead>
      <tr>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <th scope="col">FW Type <span on:click={sort("fwType")}> <i class="fa fa-fw fa-sort"></i></span></th>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <th scope="col">Context <span on:click={sort("context")}> <i class="fa fa-fw fa-sort"></i></span></th>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <th scope="col" >Source <span on:click={sort("source")}> <i class="fa fa-fw fa-sort"></i></span></th>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <th scope="col" >Destination <span on:click={sort("destination")}> <i class="fa fa-fw fa-sort"></i></span></th>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <th scope="col" >Ports <span on:click={sort("ports")}> <i class="fa fa-fw fa-sort"></i></span></th>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <th scope="col" >Use Case <span on:click={sort("usecase")}> <i class="fa fa-fw fa-sort"></i></span></th>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <th scope="col" >Status <span on:click={sort("firewallStatus")}> <i class="fa fa-fw fa-sort"></i></span></th>
        <th scope="col" ></th>
        <th scope="col"></th>
      </tr>
    </thead>
    <tbody>
      {#each firewallRules as fwr}
        <tr>
          <td>{fwr.fwType.name}</td>
          
          <td>{fwr.context.name}</td>

        <td>
            {#if fwr.sho}
            <li class="list-group-item">{fwr.sho.name}</li>
            <li class="list-group-item">{fwr.sho.ip}</li>           
          {/if}

            {#if fwr.shgo}
            <li class="list-group-item">{fwr.shgo.name}</li>
          {/if}

          {#if fwr.sno}
          <li class="list-group-item">{fwr.sno.name}</li>
          <li class="list-group-item">{fwr.sno.ip}{fwr.sno.subnet}</li>          
          {/if}

          {#if fwr.sngo}
            <li class="list-group-item">{fwr.sngo.name}</li>
          {/if}
        </td>

        <td>
          {#if fwr.dho}
            <li class="list-group-item">{fwr.dho.name}</li>
            <li class="list-group-item">{fwr.dho.ip}</li>         
          {/if}

          {#if fwr.dhgo}
            <li class="list-group-item">{fwr.dhgo.name}</li>
          {/if}

          {#if fwr.dno}
            <li class="list-group-item">{fwr.dno.name}</li>
            <li class="list-group-item">{fwr.dno.ip}{fwr.dno.subnet}</li>            
          {/if}

          {#if fwr.dngo}
            <li class="list-group-item">{fwr.dngo.name}</li>          
          {/if}
    </td>
    <td>
            {#each fwr.sgo.port as port}
            <li class="list-group-item">{port}</li>  
            {/each}
            <li class="list-group-item">{fwr.sgo.name}</li>
        </td>
        <td><a href="http://localhost:8080/use-case/{fwr.uc.id}">{fwr.uc.name}</a></td>
        <td>{fwr.firewallStatus}</td>
          <td><i class="fa fa-pencil-square-o fa-lg" aria-hidden="true"></i></td>
          <td><i class="fa fa-trash-o fa-lg" aria-hidden="true"></i></td>
        </tr>
        {/each}
    </tbody>
  </table>
  
  <div class="modal fade" id="createFWR" tabindex="-1" role="dialog" aria-labelledby="formCreateFirewallRule" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="createFirewallRule">Add Fireall Rule</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form class="mb-5">
            <div class="row mb-3">
              <div class="col">
                <label class="form-label" for="name">FW Type</label>
                <input
                  bind:value={firewallRule.fwTypeId}
                  class="form-control"
                  id="fwType"
                  type="text"
                />
              </div>
            </div>
            <div class="row mb-3">
              <div class="col">
                <label class="form-label" for="context">Context</label>
                <input
                  bind:value={firewallRule.contextId}
                  class="form-control"
                  id="context"
                  type="text"
                />
              </div>
            </div>
            <div class="row mb-3">
                <div class="col">
                  <label class="form-label" for="source">Source</label>
                  <input
                    bind:value={firewallRule.sourceId}
                    class="form-control"
                    id="source"
                    type="text"
                  />
                </div>
              </div>
              <div class="row mb-3">
                <div class="col">
                  <label class="form-label" for="destination">Destination</label>
                  <input
                    bind:value={firewallRule.destinationId}
                    class="form-control"
                    id="context"
                    type="text"
                  />
                </div>
              </div>
              <div class="row mb-3">
                <div class="col">
                  <label class="form-label" for="sgo">Service Group Object</label>
                  <input
                    bind:value={firewallRule.serviceGroupObjectId}
                    class="form-control"
                    id="sgo"
                    type="text"
                  />
                </div>
              </div>
              <div class="row mb-3">
                <div class="col">
                  <label class="form-label" for="uc">Use Case</label>
                  <input
                    bind:value={firewallRule.useCaseId}
                    class="form-control"
                    id="uc"
                    type="text"
                  />
                </div>
              </div>
              
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="button" class="btn" style="background-color: #008000; color: #fff" on:click={createFirewallRule}>Add</button>
        </div>
      </div>
    </div>
  </div>
  

 
  <!--------------->
  