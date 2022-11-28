<script>
    import axios from "axios";
  
  
    // TODO: Setze hier die URL zu deinem mit Postman erstellten Mock Server
    const api_root = "http://localhost:8080";
  
    let useCases = [];
    let useCase = {
      name: null,
      description: null,
      tags: [],
    };

    


    function getUseCases() {
      var config = {
        method: "get",
        url: api_root + "/use-case",
        headers: {},
      };
  
      axios(config)
        .then(function (response) {
            useCases = response.data;
        })
        .catch(function (error) {
          alert("Could not get Use Cases");
          console.log(error);
        });
    }
    getUseCases();
  
    function createUseCase() {


      var config = {
        method: "post",
        url: api_root + "/use-case",
        headers: {
          "Content-Type": "application/json",
        },
        data: useCase,
      };
  
      axios(config)
        .then(function (response) {
          alert("Use Case created");
          getUseCases();
        })
        .catch(function (error) {
          alert("Could not create Use Case");
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
          
        useCases = useCases.sort(sort);
      }
  
  
  
  </script>

<div class="container-fluid">
    <div class="row">
      <div class="col">
        <h3 style="margin-top: 15px; font-weight: bold;">All Use Cases</h3>
      </div>
      <div class="col" />
      <div class="col" style="text-align-last: right;">
        <button
          type="button"
          class="btn"
          data-toggle="modal" data-target="#crateUC"
          style="margin-top: 9px; background-color: #c73834; color: #fff"
          >Add Use Case</button
        >
      </div>
    </div>
  </div>
  <table class="table table-striped table-hover" id="allUseCases">
    <thead>
      <tr>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <th scope="col">Name  <span on:click={sort("name")}> <i class="fa fa-fw fa-sort"></i></span></th>
        <th scope="col">Description </th>
        <th scope="col">Tags (Standort/Bereich)</th>
        <th scope="col" ></th>
        <th scope="col"></th>
      </tr>
    </thead>
    <tbody>
      {#each useCases as useCase}
        <tr>
          <td>{useCase.name}</td>
          <td>{useCase.description}</td>
          <td>{useCase.tags}</td>
          <td>edit</td>
          <td>delete</td>
        </tr>
      {/each}
    </tbody>
  </table>
  <p> Bearbeiten | Löschen </p>
  
  <div class="modal fade" id="crateUC" tabindex="-1" role="dialog" aria-labelledby="formCreateUseCase" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="crateUseCase">Add Use-Case</h5>
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
                  bind:value={useCase.name}
                  class="form-control"
                  id="name"
                  type="text"
                />
              </div>
            </div>
            <div class="row mb-3">
              <div class="col">
                <label class="form-label" for="description">Description</label>
                <input
                  bind:value={useCase.description}
                  class="form-control"
                  id="description"
                  type="text"
                />
              </div>
            </div>
            <div class="row mb-3">
              <div class="col">
                <label class="form-label" for="description">Tags (Standort/Organisation) </label>
                <input
                  bind:value={useCase.tags}
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
          <button type="button" class="btn" style="background-color: #008000; color: #fff" on:click={createUseCase}>Add</button>
        </div>
      </div>
    </div>
  </div>