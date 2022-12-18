<script>
  import axios from "axios";
  import { isAuthenticated, user, jwt_token } from "../store";

  const api_root = window.location.origin + "/api";
  //-----------------------------

  let firewallRules = [];
  let firewallRule = {
    fwTypeId: null,
    contextId: null,
    sourceId: null,
    destinationId: null,
    serviceGroupObjectId: null,
    useCaseId: null,
    userMail: null,
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

  let fwEdit = {
    id: null,
    fwTypeId: null,
    contextId: null,
    sourceId: null,
    destinationId: null,
    serviceGroupObjectId: null,
    useCaseId: null,
    firewallStatus: null,
  };

  let fwrDelete = {
    id: null,
    fwTypeName: null,
    contextName: null,
    sourceName: null,
    destionationName: null,
    serviceGroupObjectName: null,
    useCaseName: null,
  };

  let fwStatusToChange = {
    fwId: null,
    status: null,
    userMail: null,
  };

  let fwrStatus = {
    id: null,
    fwTypeName: null,
    contextName: null,
    sourceName: null,
    destionationName: null,
    serviceGroupObjectName: null,
    useCaseName: null,
    status: null,
    userMail: null,
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
      headers: { Authorization: "Bearer " + $jwt_token },
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
    firewallRule.userMail = $user.email;
    var config = {
      method: "post",
      url: api_root + "/firewall-rule",
      headers: {
        Authorization: "Bearer " + $jwt_token,
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
    firewallRule = {
      fwTypeId: null,
      contextId: null,
      sourceId: null,
      destinationId: null,
      serviceGroupObjectId: null,
      useCaseId: null,
    };
  }

  //-----------------------------

  //-----------fwTypes------------------------------
  function getfwTypes() {
    var config = {
      method: "get",
      url: api_root + "/firewall-type",
      headers: { Authorization: "Bearer " + $jwt_token },
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
      headers: { Authorization: "Bearer " + $jwt_token },
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
      headers: { Authorization: "Bearer " + $jwt_token },
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
      headers: { Authorization: "Bearer " + $jwt_token },
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
      headers: { Authorization: "Bearer " + $jwt_token },
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
      headers: { Authorization: "Bearer " + $jwt_token },
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
      headers: { Authorization: "Bearer " + $jwt_token },
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
      headers: { Authorization: "Bearer " + $jwt_token },
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

  function getFwToEdit(fw) {
    fwEdit.id = fw.fwId;
    fwEdit.fwTypeId = fw.fwType.id;
    fwEdit.contextId = fw.context.id;
    if (fw.sNgoWithNo) {
      fwEdit.sourceId = fw.sNgoWithNo.ngoId;
    } else if (fw.sNo) {
      fwEdit.sourceId = fw.sNo.id;
    } else if (fw.sHgoWithHo) {
      fwEdit.sourceId = fw.sHgoWithHo.hgoId;
    } else if (fw.sHo) {
      fwEdit.sourceId = fw.sHo.id;
    }

    if (fw.dNgoWithNo) {
      fwEdit.destinationId = fw.dNgoWithNo.ngoId;
    } else if (fw.dNo) {
      fwEdit.destinationId = fw.dNo.id;
    } else if (fw.dHgoWithHo) {
      fwEdit.destinationId = fw.dHgoWithHo.hgoId;
    } else if (fw.dHo) {
      fwEdit.destinationId = fw.dHo.id;
    }

    fwEdit.serviceGroupObjectId = fw.sgo.id;
    fwEdit.useCaseId = fw.uc.id;
    fwEdit.firewallStatus = fw.firewallStatus;
  }

  function editFw() {
    var config = {
      method: "put",
      url: api_root + "/firewall-rule",
      headers: {
        Authorization: "Bearer " + $jwt_token,
        "Content-Type": "application/json",
      },
      data: fwEdit,
    };

    axios(config)
      .then(function (response) {
        getFirewallRules();
      })
      .catch(function (error) {
        alert("Could not edit Firewall Rule");
        console.log(error);
      });
  }

  function getFwrToDelete(fwrD) {
    fwrDelete.id = fwrD.fwId;
    fwrDelete.fwTypeName = fwrD.fwType.name;
    fwrDelete.contextName = fwrD.context.name;
    if (fwrD.sNgoWithNo) {
      fwrDelete.sourceName = fwrD.sNgoWithNo.ngoName;
    } else if (fwrD.sNo) {
      fwrDelete.sourceName = fwrD.sNo.name;
    } else if (fwrD.sHgoWithHo) {
      fwrDelete.sourceName = fwrD.sHgoWithHo.hgoName;
    } else if (fwrD.sHo) {
      fwrDelete.sourceName = fwrD.sHo.name;
    }

    if (fwrD.dNgoWithNo) {
      fwrDelete.destionationName = fwrD.dNgoWithNo.ngoName;
    } else if (fwrD.dNo) {
      fwrDelete.destionationName = fwrD.dNo.name;
    } else if (fwrD.dHgoWithHo) {
      fwrDelete.destionationName = fwrD.dHgoWithHo.hgoName;
    } else if (fwrD.dHo) {
      fwrDelete.destionationName = fwrD.dHo.name;
    }

    fwrDelete.serviceGroupObjectName = fwrD.sgo.name;
    fwrDelete.useCaseName = fwrD.uc.name;
  }

  function deleteFwr(id) {
    var config = {
      method: "delete",
      url: api_root + "/firewall-rule/" + id,
      headers: { Authorization: "Bearer " + $jwt_token },
    };

    axios(config)
      .then(function (response) {
        getFirewallRules();
      })
      .catch(function (error) {
        alert("Could not delete Firewall Rule");
        console.log(error);
      });
  }

  function getFwToChangeStatus(fw) {
    fwrStatus.id = fw.fwId;
    fwrStatus.fwTypeName = fw.fwType.name;
    fwrStatus.contextName = fw.context.name;
    if (fw.sNgoWithNo) {
      fwrStatus.sourceName = fw.sNgoWithNo.ngoName;
    } else if (fw.sNo) {
      fwrStatus.sourceName = fw.sNo.name;
    } else if (fw.sHgoWithHo) {
      fwrStatus.sourceName = fw.sHgoWithHo.hgoName;
    } else if (fw.sHo) {
      fwrStatus.sourceName = fw.sHo.name;
    }

    if (fw.dNgoWithNo) {
      fwrStatus.destionationName = fw.dNgoWithNo.ngoName;
    } else if (fw.dNo) {
      fwrStatus.destionationName = fw.dNo.name;
    } else if (fw.dHgoWithHo) {
      fwrStatus.destionationName = fw.dHgoWithHo.hgoName;
    } else if (fw.dHo) {
      fwrStatus.destionationName = fw.dHo.name;
    }

    fwrStatus.serviceGroupObjectName = fw.sgo.name;
    fwrStatus.useCaseName = fw.uc.name;
    fwrStatus.status = fw.firewallStatus;
    fwrStatus.userMail = fw.userMail;
  }

  function changeFwStatus() {
    fwStatusToChange.fwId = fwrStatus.id;
    fwStatusToChange.status = fwrStatus.status;
    fwStatusToChange.userMail = fwrStatus.userMail;
    var config = {
      method: "post",
      url: api_root + "/service/change-status",
      headers: {
        Authorization: "Bearer " + $jwt_token,
        "Content-Type": "application/json",
      },
      data: fwStatusToChange,
    };

    axios(config)
      .then(function (response) {
        getFirewallRules();
      })
      .catch(function (error) {
        alert("Could not change Status of Firewall Rule");
        console.log(error);
      });
  }

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

<div style="margin-left: -52px; margin-right: -52px;">
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
        <th scope="col" />
      </tr>
    </thead>
    <tbody>
      {#each firewallRules as fwr}
        <tr>
          <td>{fwr.fwType.name}</td>

          <td>{fwr.context.name}</td>

          <td>
            {#if fwr.sHo}
              <li class="list-group-item">
                <button
                  style="border: none; background: none;"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#source{fwr.sHo.id}{fwr.fwId}"
                  aria-expanded="false"
                  aria-controls="source"
                >
                  {fwr.sHo.name}
                </button>
              </li>
              <div class="collapse" id="source{fwr.sHo.id}{fwr.fwId}">
                <li class="list-group-item" style="font-style: italic;">
                  {fwr.sHo.ip}
                </li>
              </div>
            {/if}

            {#if fwr.sHgoWithHo}
              <li class="list-group-item">
                <button
                  style="border: none; background: none;"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#source{fwr.sHgoWithHo.hgoId}{fwr.fwId}"
                  aria-expanded="false"
                  aria-controls="source"
                >
                  {fwr.sHgoWithHo.hgoName}
                </button>
              </li>
              <div class="collapse" id="source{fwr.sHgoWithHo.hgoId}{fwr.fwId}">
                {#each fwr.sHgoWithHo.members as m}
                  <li class="list-group-item" style="font-style: italic;">
                    {m.name}
                  </li>
                  <li class="list-group-item" style="font-style: italic;">
                    {m.ip}
                  </li>
                {/each}
              </div>
            {/if}

            {#if fwr.sNo}
              <li class="list-group-item">
                <button
                  style="border: none; background: none;"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#source{fwr.sNo.id}{fwr.fwId}"
                  aria-expanded="false"
                  aria-controls="source"
                >
                  {fwr.sNo.name}
                </button>
              </li>
              <div class="collapse" id="source{fwr.sNo.id}{fwr.fwId}">
                <li class="list-group-item" style="font-style: italic;">
                  {fwr.sNo.ip}{fwr.sNo.subnet}
                </li>
              </div>
            {/if}

            {#if fwr.sNgoWithNo}
              <li class="list-group-item">
                <button
                  style="border: none; background: none;"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#source{fwr.sNgoWithNo.ngoId}{fwr.fwId}"
                  aria-expanded="false"
                  aria-controls="source"
                >
                  {fwr.sNgoWithNo.ngoName}
                </button>
              </li>
              <div class="collapse" id="source{fwr.sNgoWithNo.ngoId}{fwr.fwId}">
                {#each fwr.sNgoWithNo.members as m}
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
            {#if fwr.dHo}
              <li class="list-group-item">
                <button
                  style="border: none; background: none;"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#destination{fwr.dHo.id}{fwr.fwId}"
                  aria-expanded="false"
                  aria-controls="destination"
                >
                  {fwr.dHo.name}
                </button>
              </li>
              <div class="collapse" id="destination{fwr.dHo.id}{fwr.fwId}">
                <li class="list-group-item" style="font-style: italic;">
                  {fwr.dHo.ip}
                </li>
              </div>
            {/if}

            {#if fwr.dHgoWithHo}
              <li class="list-group-item">
                <button
                  style="border: none; background: none;"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#destination{fwr.dHgoWithHo.hgoId}{fwr.fwId}"
                  aria-expanded="false"
                  aria-controls="destination"
                >
                  {fwr.dHgoWithHo.hgoName}
                </button>
              </li>
              <div
                class="collapse"
                id="destination{fwr.dHgoWithHo.hgoId}{fwr.fwId}"
              >
                {#each fwr.dHgoWithHo.members as m}
                  <li class="list-group-item" style="font-style: italic;">
                    {m.name}
                  </li>
                  <li class="list-group-item" style="font-style: italic;">
                    {m.ip}
                  </li>
                {/each}
              </div>
            {/if}

            {#if fwr.dNo}
              <li class="list-group-item">
                <button
                  style="border: none; background: none;"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#destination{fwr.dNo.id}{fwr.fwId}"
                  aria-expanded="false"
                  aria-controls="destination"
                >
                  {fwr.dNo.name}
                </button>
              </li>
              <div class="collapse" id="destination{fwr.dNo.id}{fwr.fwId}">
                <li class="list-group-item" style="font-style: italic;">
                  {fwr.dNo.ip}{fwr.dNo.subnet}
                </li>
              </div>
            {/if}

            {#if fwr.dNgoWithNo}
              <li class="list-group-item">
                <button
                  style="border: none; background: none;"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#destination{fwr.dNgoWithNo.ngoId}{fwr.fwId}"
                  aria-expanded="false"
                  aria-controls="destination"
                >
                  {fwr.dNgoWithNo.ngoName}
                </button>
              </li>
              <div
                class="collapse"
                id="destination{fwr.dNgoWithNo.ngoId}{fwr.fwId}"
              >
                {#each fwr.dNgoWithNo.members as m}
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
                style="border: none; background: none;"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#port{fwr.sgo.id}{fwr.fwId}"
                aria-expanded="false"
                aria-controls="collapseExample"
              >
                {fwr.sgo.name}
              </button>
            </li>
            <div class="collapse" id="port{fwr.sgo.id}{fwr.fwId}">
              {#each fwr.sgo.port as port}
                <li class="list-group-item" style="font-style: italic;">
                  {port}
                </li>
              {/each}
            </div>
          </td>
          <td>
            <button
              style="border: none; background: none;"
              data-toggle="modal"
              data-target="#getUC"
              on:click={() => getusecase(fwr.uc)}>{fwr.uc.name}</button
            ></td
          >
          <td>{fwr.firewallStatus}</td>
          {#if ($isAuthenticated && $user.user_roles && $user.user_roles.includes("admin")) || $user.email === fwr.userMail}
            <td
              ><button
                style="border: none; background: none;"
                data-toggle="modal"
                data-target="#changeStatusOfFW"
                on:click={() => getFwToChangeStatus(fwr)}
                ><i
                  class="fa fa-check-square-o fa-lg"
                  title="change status"
                /></button
              ></td
            >{:else}
            <td />
          {/if}
          <td
            ><button
              style="border: none; background: none;"
              data-toggle="modal"
              data-target="#editFW"
              on:click={() => getFwToEdit(fwr)}
              ><i
                class="fa fa-pencil-square-o fa-lg"
                aria-hidden="true"
              /></button
            ></td
          >
          <td
            ><button
              style="border: none; background: none;"
              data-toggle="modal"
              data-target="#deleteFWR"
              on:click={() => getFwrToDelete(fwr)}
            >
              <i class="fa fa-trash-o fa-lg" aria-hidden="true" /></button
            ></td
          >
        </tr>
      {/each}
    </tbody>
  </table>
</div>
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
          on:click={createFirewallRule}
          data-dismiss="modal">Add</button
        >
      </div>
    </div>
  </div>
</div>

<div
  class="modal fade"
  id="editFW"
  tabindex="-1"
  role="dialog"
  aria-labelledby="formEditFirewallRule"
  aria-hidden="true"
>
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="editFirewallRule">Edit Fireall Rule</h5>
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
              <label class="form-label" for="id">Id</label>
              <input
                bind:value={fwEdit.id}
                class="form-control"
                id="id"
                type="text"
                disabled
              />
            </div>
          </div>
          <div class="row mb-3">
            <div class="col">
              <label class="form-label" for="fwType">FW Type</label>
              <select
                class="form-select"
                aria-label="fwType"
                bind:value={fwEdit.fwTypeId}
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
                bind:value={fwEdit.contextId}
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
                bind:value={fwEdit.sourceId}
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
                bind:value={fwEdit.destinationId}
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
                bind:value={fwEdit.serviceGroupObjectId}
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
                bind:value={fwEdit.useCaseId}
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
          on:click={editFw}
          data-dismiss="modal">Edit</button
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

<div
  class="modal fade"
  id="deleteFWR"
  tabindex="-1"
  role="dialog"
  aria-labelledby="formDeleteFWR"
  aria-hidden="true"
>
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="deleteFWR">Delete Firewall-Rule</h5>
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
        Are you sure, that you want to delete the following Firewall Rule?
        <br />
        <br />
        <h6><strong>FW type:</strong></h6>
        {fwrDelete.fwTypeName}
        <br />
        <br />
        <h6><strong>Context:</strong></h6>
        {fwrDelete.contextName}
        <br />
        <br />
        <h6><strong>Source:</strong></h6>
        {fwrDelete.sourceName}
        <br />
        <br />
        <h6><strong>Destination:</strong></h6>
        {fwrDelete.destionationName}
        <br />
        <br />
        <h6><strong>Service Group Object:</strong></h6>
        {fwrDelete.serviceGroupObjectName}
        <br />
        <br />
        <h6><strong>Use Case:</strong></h6>
        {fwrDelete.useCaseName}
        <br />
        <br />
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal"
          >Close</button
        >
        <button
          type="button"
          class="btn"
          data-dismiss="modal"
          style="background-color: #c73834; color: #fff"
          on:click={deleteFwr(fwrDelete.id)}>Delete</button
        >
      </div>
    </div>
  </div>
</div>

<!-------------------------------------------->

<div
  class="modal fade"
  id="changeStatusOfFW"
  tabindex="-1"
  role="dialog"
  aria-labelledby="formChangeStatusOfFW"
  aria-hidden="true"
>
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="changeStatusOfFW">
          Change Status of Firewall Rule
        </h5>
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
              <label class="form-label" for="id">Id</label>
              <input
                bind:value={fwrStatus.id}
                class="form-control"
                id="id"
                type="text"
                disabled
              />
            </div>
          </div>
          <div class="row mb-3">
            <div class="col">
              <label class="form-label" for="fwType">FW Type</label>
              <input
                bind:value={fwrStatus.fwTypeName}
                class="form-control"
                id="id"
                type="text"
                disabled
              />
            </div>
          </div>
          <div class="row mb-3">
            <div class="col">
              <label class="form-label" for="context">Context</label>
              <input
                bind:value={fwrStatus.contextName}
                class="form-control"
                id="id"
                type="text"
                disabled
              />
            </div>
          </div>
          <div class="row mb-3">
            <div class="col">
              <label class="form-label" for="source">Source</label>
              <input
                bind:value={fwrStatus.sourceName}
                class="form-control"
                id="id"
                type="text"
                disabled
              />
            </div>
          </div>
          <div class="row mb-3">
            <div class="col">
              <label class="form-label" for="destination">Destination</label>
              <input
                bind:value={fwrStatus.destionationName}
                class="form-control"
                id="id"
                type="text"
                disabled
              />
            </div>
          </div>
          <div class="row mb-3">
            <div class="col">
              <label class="form-label" for="sgo">Service Group Object</label>
              <input
                bind:value={fwrStatus.serviceGroupObjectName}
                class="form-control"
                id="id"
                type="text"
                disabled
              />
            </div>
          </div>
          <div class="row mb-3">
            <div class="col">
              <label class="form-label" for="uc">Use Case</label>
              <input
                bind:value={fwrStatus.useCaseName}
                class="form-control"
                id="id"
                type="text"
                disabled
              />
            </div>
          </div>
          <div class="row mb-3">
            <div class="col">
              <label class="form-label" for="uc">Status</label>
              <select
                class="form-select"
                aria-label="status"
                bind:value={fwrStatus.status}
              >
                <option value="EDITED" hidden>EDITED</option>
                {#if fwrStatus.status === "REQUESTED_FOR_APPROVAL" && $isAuthenticated && $user.user_roles && $user.user_roles.includes("admin")}
                  <option value="REQUESTED_FOR_APPROVAL" hidden
                    >REQUESTED_FOR_APPROVAL</option
                  >
                  <option value="APPROVED">APPROVED</option>
                  <option value="REJECTED">REJECTED</option>
                {:else if fwrStatus.status === "APPROVED" && ($isAuthenticated && $user.user_roles && $user.user_roles.includes("admin") || $user.email === fwrStatus.userMail)}
                  <option value="APPROVED" hidden>APPROVED</option>
                  <option value="ORDERED">ORDERED</option>
                {:else if fwrStatus.status === "ORDERED" && ($isAuthenticated && $user.user_roles && $user.user_roles.includes("admin") || $user.email === fwrStatus.userMail)}
                  <option value="ORDERED" hidden>ORDERED</option>
                  <option value="ACTIVE">ACTIVE</option>
                {:else if fwrStatus.status === "ACTIVE" && $user.email === fwrStatus.userMail}
                  <option value="ACTIVE" hidden>ACTIVE</option>
                  {:else if fwrStatus.status === "ACTIVE" && $isAuthenticated && $user.user_roles && $user.user_roles.includes("admin")}
                  <option value="ACTIVE" hidden>ACTIVE</option>
                  <option value="DELETED">DELETED</option>
                  <option value="DISABLED">DISABLED</option>
                {:else if fwrStatus.status === "DISABLED" && $isAuthenticated && $user.user_roles && $user.user_roles.includes("admin")}
                  <option value="DISABLED" hidden>DISABLED</option>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="DELETED">DELETED</option>
                {:else if $isAuthenticated && $user.user_roles && $user.user_roles.includes("admin")}
                  <option value="REQUESTED_FOR_APPROVAL" hidden
                    >REQUESTED_FOR_APPROVAL</option
                  >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="APPROVED">APPROVED</option>
                  <option value="DELETED">DELETED</option>
                  <option value="DISABLED">DISABLED</option>
                  <option value="EDITED">EDITED</option>
                  <option value="ORDERED">ORDERED</option>
                  <option value="REJECTED">REJECTED</option>
                {/if}
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
          on:click={changeFwStatus}
          data-dismiss="modal">Edit</button
        >
      </div>
    </div>
  </div>
</div>
