<script>
    import axios from "axios";
  
  
    // TODO: Setze hier die URL zu deinem mit Postman erstellten Mock Server
    const api_root = "http://localhost:8080";
  
    let contexts = [];
    let context = {
      name: null,
      ip: null,
      subnet: null,
      description: null,
    };
  
    function getContexts() {
      var config = {
        method: "get",
        url: api_root + "/context",
        headers: {},
      };
  
      axios(config)
        .then(function (response) {
            contexts = response.data;
        })
        .catch(function (error) {
          alert("Could not get Contexts");
          console.log(error);
        });
    }
    getContexts();
  
    function createContext() {
      var config = {
        method: "post",
        url: api_root + "/context",
        headers: {
          "Content-Type": "application/json",
        },
        data: context,
      };
  
      axios(config)
        .then(function (response) {
          getContexts();
        })
        .catch(function (error) {
          alert("Could not create Context");
          console.log(error);
        });
    }
  
  
    
    let sortBy = {col: "name", ascending: true};
      
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
          
        contexts = contexts.sort(sort);
      }
  
  
  
  </script>

<div class="container-fluid">
    <div class="row">
      <div class="col">
        <h3 style="margin-top: 15px; font-weight: bold;">All Contexts</h3>
      </div>
      <div class="col" />
      <div class="col" style="text-align-last: right;">
        <button
          type="button"
          class="btn"
          data-toggle="modal" data-target="#createC"
          style="margin-top: 9px; background-color: #c73834; color: #fff"
          >Add Context</button
        >
      </div>
    </div>
  </div>
  <table class="table table-striped table-hover" id="allContexts">
    <thead>
      <tr>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <th scope="col">Name<span on:click={sort("name")}> <i class="fa fa-fw fa-sort"></i></span></th>
        <th scope="col">IP</th>
        <th scope="col">Subnet</th>
        <th scope="col">Description</th>
        <th scope="col" ></th>
        <th scope="col"></th>
      </tr>
    </thead>
    <tbody>
      {#each contexts as context}
        <tr>
          <td>{context.name}</td>
          <td>{context.ip}</td>
          <td>{context.subnet}</td>
          <td>{context.description}</td>
          <td>edit</td>
          <td>delete</td>
        </tr>
      {/each}
    </tbody>
  </table>

  
  <div class="modal fade" id="createC" tabindex="-1" role="dialog" aria-labelledby="formCreateContext" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="crateContext">Add Use-Case</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form class="mb-5">
            <div class="row mb-3">
              <div class="col">
                <label class="form-label" for="name">Name</label>
                <input
                  bind:value={context.name}
                  class="form-control"
                  id="name"
                  type="text"
                />
              </div>
            </div>
            <div class="row mb-3">
                <div class="col">
                  <label class="form-label" for="ip">IP</label>
                  <input
                    bind:value={context.ip}
                    class="form-control"
                    id="description"
                    type="text"
                  />
                </div>
              </div>
              <div class="row mb-3">
                <div class="col">
                  <label class="form-label" for="subnet">Subnet</label>
                  <input
                    bind:value={context.subnet}
                    class="form-control"
                    id="description"
                    type="text"
                  />
                </div>
              </div>
            <div class="row mb-3">
              <div class="col">
                <label class="form-label" for="description">Description</label>
                <input
                  bind:value={context.description}
                  class="form-control"
                  id="description"
                  type="text"
                />
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="button" class="btn" style="background-color: #008000; color: #fff" on:click={createContext} data-dismiss="modal">Add</button>
        </div>
      </div>
    </div>
  </div>