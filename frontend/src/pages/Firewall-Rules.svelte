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

  let fwTypes = [];
  let contexts = [];
  let hostOs = [];
  let hostGs = [];
  let networkOs = [];
  let networkGs = [];
  let serviceGs = [];
  let usecases = [];

  let usecase = {
    name: null,
    description: null,
    tags: null,
  };

  function getusecase(uc) {
    usecase.name = uc.name;
    usecase.description = uc.description;
    usecase.tags = uc.tags;
  }

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
      url: api_root + "/firewall-rule",
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

  //-----------fwTypes------------------------------
  function getfwTypes() {
    var config = {
      method: "get",
      url: api_root + "/firewall-type",
      headers: {},
    };

    axios(config)
      .then(function (response) {
        fwTypes = response.data;
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  getfwTypes();
  //-----------------------------------------------

  //-----------contexts------------------------------
  function getcontexts() {
    var config = {
      method: "get",
      url: api_root + "/context",
      headers: {},
    };

    axios(config)
      .then(function (response) {
        contexts = response.data;
      })
      .catch(function (error) {});
  }
  getcontexts();
  //-----------------------------------------------

  //-----------hostOs------------------------------
  function getHostOs() {
    var config = {
      method: "get",
      url: api_root + "/host-object",
      headers: {},
    };

    axios(config)
      .then(function (response) {
        hostOs = response.data;
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  getHostOs();
  //-----------------------------------------------

  //-----------hostGs------------------------------
  function getHostGs() {
    var config = {
      method: "get",
      url: api_root + "/service/findHo",
      headers: {},
    };

    axios(config)
      .then(function (response) {
        hostGs = response.data;
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  getHostGs();
  //-----------------------------------------------

  //-----------networkOs------------------------------
  function getNetworkOs() {
    var config = {
      method: "get",
      url: api_root + "/network-object",
      headers: {},
    };

    axios(config)
      .then(function (response) {
        networkOs = response.data;
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  getNetworkOs();
  //-----------------------------------------------

  //-----------networkGs------------------------------
  function getNetworkGs() {
    var config = {
      method: "get",
      url: api_root + "/service/findNo",
      headers: {},
    };

    axios(config)
      .then(function (response) {
        networkGs = response.data;
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  getNetworkGs();
  //-----------------------------------------------

  //-----------serviceGs------------------------------
  function getServiceGs() {
    var config = {
      method: "get",
      url: api_root + "/service-group-object",
      headers: {},
    };

    axios(config)
      .then(function (response) {
        serviceGs = response.data;
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  getServiceGs();
  //-----------------------------------------------

  //-----------usecases------------------------------
  function getUseCases() {
    var config = {
      method: "get",
      url: api_root + "/use-case",
      headers: {},
    };

    axios(config)
      .then(function (response) {
        usecases = response.data;
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  getUseCases();
  //-----------------------------------------------

  let sortBy = { col: "fwType", ascending: true };

  $: sort = (column) => {
    if (sortBy.col == column) {
      sortBy.ascending = !sortBy.ascending;
    } else {
      sortBy.col = column;
      sortBy.ascending = true;
    }

    // Modifier to sorting function for ascending or descending
    let sortModifier = sortBy.ascending ? 1 : -1;

    let sort = (a, b) =>
      a[column] < b[column]
        ? -1 * sortModifier
        : a[column] > b[column]
        ? 1 * sortModifier
        : 0;

    firewallRules = firewallRules.sort(sort);
  };

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
        data-toggle="modal"
        data-target="#createFWR"
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
      <th scope="col"
        >FW Type <span on:click={sort("fwType")}>
          <i class="fa fa-fw fa-sort" /></span
        ></th
      >
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <th scope="col"
        >Context <span on:click={sort("context")}>
          <i class="fa fa-fw fa-sort" /></span
        ></th
      >
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <th scope="col"
        >Source <span on:click={sort("source")}>
          <i class="fa fa-fw fa-sort" /></span
        ></th
      >
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <th scope="col"
        >Destination <span on:click={sort("destination")}>
          <i class="fa fa-fw fa-sort" /></span
        ></th
      >
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <th scope="col"
        >Ports <span on:click={sort("ports")}>
          <i class="fa fa-fw fa-sort" /></span
        ></th
      >
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <th scope="col"
        >Use Case <span on:click={sort("usecase")}>
          <i class="fa fa-fw fa-sort" /></span
        ></th
      >
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <th scope="col"
        >Status <span on:click={sort("firewallStatus")}>
          <i class="fa fa-fw fa-sort" /></span
        ></th
      >
      <th scope="col" />
      <th scope="col" />
    </tr>
  </thead>
  <tbody>
    {#each firewallRules as fwr, i}
      <tr>
        <td>{fwr.fwType.name}</td>

        <td>{fwr.context.name}</td>

        <td>
          {#if fwr.sho}
            <li class="list-group-item">
              <button
                style="border: none; background: none; text-decoration: underline;"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#source{fwr.sho.id}{+1}"
                aria-expanded="false"
                aria-controls="source"
              >
                {fwr.sho.name}
              </button>
            </li>
            <div class="collapse" id="source{fwr.sho.id}{+1}">
              <li class="list-group-item" style="font-style: italic;">
                {fwr.sho.ip}
              </li>
            </div>
          {/if}

          {#if fwr.shgoWithHo}
            <li class="list-group-item">
              <button
                style="border: none; background: none; text-decoration: underline;"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#source{fwr.shgoWithHo.hgoId}"
                aria-expanded="false"
                aria-controls="source"
              >
                {fwr.shgoWithHo.hgoName}
              </button>
            </li>
            <div class="collapse" id="source{fwr.shgoWithHo.hgoId}">
              {#each fwr.shgoWithHo.members as m}
                <li class="list-group-item" style="font-style: italic;">
                  {m.name}
                </li>
                <li class="list-group-item" style="font-style: italic;">
                  {m.ip}
                </li>
              {/each}
            </div>
          {/if}

          {#if fwr.sno}
            <li class="list-group-item">
              <button
                style="border: none; background: none; text-decoration: underline;"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#source{fwr.sno.id}"
                aria-expanded="false"
                aria-controls="source"
              >
                {fwr.sno.name}
              </button>
            </li>
            <div class="collapse" id="source{fwr.sno.id}">
              <li class="list-group-item" style="font-style: italic;">
                {fwr.sno.ip}{fwr.sno.subnet}
              </li>
            </div>
          {/if}

          {#if fwr.sngoWithNo}
            <li class="list-group-item">
              <button
                style="border: none; background: none; text-decoration: underline;"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#source{fwr.sngoWithNo.ngoId}"
                aria-expanded="false"
                aria-controls="source"
              >
                {fwr.sngoWithNo.ngoName}
              </button>
            </li>
            <div class="collapse" id="source{fwr.sngoWithNo.ngoId}">
              {#each fwr.sngoWithNo.members as m}
                <li class="list-group-item" style="font-style: italic;">
                  {m.name}
                </li>
                <li class="list-group-item" style="font-style: italic;">
                  {m.ip}{m.subnet}
                </li>
              {/each}
            </div>
          {/if}
        </td>
        <!--------------------------------------------------------------------------->

        <td>
          {#if fwr.dho}
            <li class="list-group-item">
              <button
                style="border: none; background: none; text-decoration: underline;"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#destination{fwr.dho.id}"
                aria-expanded="false"
                aria-controls="destination"
              >
                {fwr.dho.name}
              </button>
            </li>
            <div class="collapse" id="destination{fwr.dho.id}">
              <li class="list-group-item" style="font-style: italic;">
                {fwr.dho.ip}
              </li>
            </div>
          {/if}

          {#if fwr.dhgoWithHo}
            <li class="list-group-item">
              <button
                style="border: none; background: none; text-decoration: underline;"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#destination{fwr.dhgoWithHo.hgoId}"
                aria-expanded="false"
                aria-controls="destination"
              >
                {fwr.dhgoWithHo.hgoName}
              </button>
            </li>
            <div class="collapse" id="destination{fwr.dhgoWithHo.hgoId}">
              {#each fwr.dhgoWithHo.members as m}
                <li class="list-group-item" style="font-style: italic;">
                  {m.name}
                </li>
                <li class="list-group-item" style="font-style: italic;">
                  {m.ip}
                </li>
              {/each}
            </div>
          {/if}

          {#if fwr.dno}
            <li class="list-group-item">
              <button
                style="border: none; background: none; text-decoration: underline;"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#destination{fwr.dno.id}"
                aria-expanded="false"
                aria-controls="destination"
              >
                {fwr.dno.name}
              </button>
            </li>
            <div class="collapse" id="destination{fwr.dno.id}">
              <li class="list-group-item" style="font-style: italic;">
                {fwr.dno.ip}{fwr.dno.subnet}
              </li>
            </div>
          {/if}

          {#if fwr.dngoWithNo}
            <li class="list-group-item">
              <button
                style="border: none; background: none; text-decoration: underline;"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#destination{fwr.dngoWithNo.ngoId}"
                aria-expanded="false"
                aria-controls="destination"
              >
                {fwr.dngoWithNo.ngoName}
              </button>
            </li>
            <div class="collapse" id="destination{fwr.dngoWithNo.ngoId}">
              {#each fwr.dngoWithNo.members as m}
                <li class="list-group-item" style="font-style: italic;">
                  {m.name}
                </li>
                <li class="list-group-item" style="font-style: italic;">
                  {m.ip}{m.subnet}
                </li>
              {/each}
            </div>
          {/if}
        </td>

        <!---------------------------------------------------------------------------->
        <td>
          <li class="list-group-item">
            <button
              style="border: none; background: none; text-decoration: underline;"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseExample{fwr.sgo.id}"
              aria-expanded="false"
              aria-controls="collapseExample"
            >
              {fwr.sgo.name}
            </button>
          </li>
          <div class="collapse" id="collapseExample{fwr.sgo.id}">
            {#each fwr.sgo.port as port}
              <li class="list-group-item" style="font-style: italic;">
                {port}
              </li>
            {/each}
          </div>
        </td>
        <td>
          <button
            style="border: none; background: none; text-decoration: underline;"
            data-toggle="modal"
            data-target="#getUC"
            on:click={() => getusecase(fwr.uc)}>{fwr.uc.name}</button
          ></td
        >
        <td>{fwr.firewallStatus}</td>
        <td><i class="fa fa-pencil-square-o fa-lg" aria-hidden="true" /></td>
        <td><i class="fa fa-trash-o fa-lg" aria-hidden="true" /></td>
      </tr>
    {/each}
  </tbody>
</table>

<div
  class="modal fade"
  id="createFWR"
  tabindex="-1"
  role="dialog"
  aria-labelledby="formCreateFirewallRule"
  aria-hidden="true"
>
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="createFirewallRule">Add Fireall Rule</h5>
        <button
          type="button"
          class="close"
          data-dismiss="modal"
          aria-label="Close"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form class="mb-5">
          <div class="row mb-3">
            <div class="col">
              <label class="form-label" for="fwType">FW Type</label>
              <select
                class="form-select"
                aria-label="fwType"
                bind:value={firewallRule.fwTypeId}
              >
                <option hidden />
                {#each fwTypes as fwT}
                  <option value={fwT.id}>{fwT.name}</option>
                {/each}
              </select>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col">
              <label class="form-label" for="context">Context</label>
              <select
                class="form-select"
                aria-label="context"
                bind:value={firewallRule.contextId}
              >
                <option hidden />
                {#each contexts as c}
                  <option value={c.id}>{c.name}</option>
                {/each}
              </select>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col">
              <label class="form-label" for="source">Source</label>
              <select
                class="form-select"
                aria-label="source"
                bind:value={firewallRule.sourceId}
              >
                <option hidden />
                <optgroup label="Host Objects">
                  {#each hostOs as ho}
                    <option value={ho.id}>{ho.name}</option>
                  {/each}
                </optgroup>
                <optgroup label="Host Group Objects">
                  {#each hostGs as hg}
                    <option value={hg.hgoId}>{hg.hgoName}</option>
                  {/each}
                </optgroup>
                <optgroup label="Network Objects">
                  {#each networkOs as no}
                    <option value={no.id}>{no.name}</option>
                  {/each}
                </optgroup>
                <optgroup label="Network Group Objects">
                  {#each networkGs as ng}
                    <option value={ng.ngoId}>{ng.ngoName}</option>
                  {/each}
                </optgroup>
              </select>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col">
              <label class="form-label" for="destination">Destination</label>
              <select
                class="form-select"
                aria-label="destination"
                bind:value={firewallRule.destinationId}
              >
                <option hidden />
                <optgroup label="Host Objects">
                  {#each hostOs as ho}
                    <option value={ho.id}>{ho.name}</option>
                  {/each}
                </optgroup>
                <optgroup label="Host Group Objects">
                  {#each hostGs as hg}
                    <option value={hg.hgoId}>{hg.hgoName}</option>
                  {/each}
                </optgroup>
                <optgroup label="Network Objects">
                  {#each networkOs as no}
                    <option value={no.id}>{no.name}</option>
                  {/each}
                </optgroup>
                <optgroup label="Network Group Objects">
                  {#each networkGs as ng}
                    <option value={ng.ngoId}>{ng.ngoName}</option>
                  {/each}
                </optgroup>
              </select>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col">
              <label class="form-label" for="sgo">Service Group Object</label>
              <select
                class="form-select"
                aria-label="sgo"
                bind:value={firewallRule.serviceGroupObjectId}
              >
                <option hidden />
                {#each serviceGs as sgo}
                  <option value={sgo.id}>{sgo.name}</option>
                {/each}
              </select>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col">
              <label class="form-label" for="uc">Use Case</label>
              <select
                class="form-select"
                aria-label="uc"
                bind:value={firewallRule.useCaseId}
              >
                <option hidden />
                {#each usecases as u}
                  <option value={u.id}>{u.name}</option>
                {/each}
              </select>
            </div>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal"
          >Close</button
        >
        <button
          type="button"
          class="btn"
          style="background-color: #008000; color: #fff"
          on:click={createFirewallRule}>Add</button
        >
      </div>
    </div>
  </div>
</div>

<!--------------->

<div
  class="modal fade"
  id="getUC"
  tabindex="-1"
  role="dialog"
  aria-labelledby="formGetUseCase"
  aria-hidden="true"
>
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="deleteUseCase">Use-Case info</h5>
        <button
          type="button"
          class="close"
          data-dismiss="modal"
          aria-label="Close"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <h6><strong>Name:</strong></h6>
        {usecase.name}
        <br />
        <br />
        <h6><strong>Description:</strong></h6>
        {usecase.description}
        <br />
        <br />
        <h6><strong>Tags:</strong></h6>
        {usecase.tags}
        <br />
        <br />
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal"
          >Close</button
        >
      </div>
    </div>
  </div>
</div>
