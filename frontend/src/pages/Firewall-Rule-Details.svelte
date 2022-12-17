<script>
  import axios from "axios";
  import {jwt_token} from "../store";
  export let params = {};

  const api_root = "http://localhost:8080/api";

  let id;
  let firewallRules = [];
  let firewallType = [];
  let context = [];
  let sHo = [];
  let sHgoWithHo = {
    hgoId: null,
    hgoName: null,
    hgoDescription: null,
    membersId: [],
    members: [],
  };
  let sNo = [];
  let sNgoWithNo = {
    ngoId: null,
    ngoName: null,
    ngoDescription: null,
    membersId: [],
    members: [],
  };
  let dHo = [];
  let dHgoWithHo = {
    hgoId: null,
    hgoName: null,
    hgoDescription: null,
    membersId: [],
    members: [],
  };
  let dNo = [];
  let dNgoWithNo = {
    ngoId: null,
    ngoName: null,
    ngoDescription: null,
    membersId: [],
    members: [],
  };
  let sgo = {
    id: null,
    name: null,
    port: [],
  };
  let uc = [];
  let success = null;

  let fwStatusToChange = {
    fwId: null,
    status: null,
  };

  $: {
    id = params.id;
    getFirewallRules();
  }

  function getFirewallRules() {
    var config = {
      method: "get",
      url: api_root + "/service/findFwD/" + id,
      headers: { Authorization: "Bearer " + $jwt_token },
    };

    axios(config)
      .then(function (response) {
        firewallRules = response.data;
        firewallType = response.data.fwType;
        context = response.data.context;
        sHo = response.data.sHo;
        sHgoWithHo = response.data.sHgoWithHo;
        sNo = response.data.sNo;
        sNgoWithNo = response.data.sNgoWithNo;
        dHo = response.data.dHo;
        dHgoWithHo = response.data.dHgoWithHo;
        dNo = response.data.dNo;
        dNgoWithNo = response.data.dNgoWithNo;
        sgo = response.data.sgo;
        uc = response.data.uc;
        success = "yes";
      })
      .catch(function (error) {
        alert("Could not get Firewall Rule");
        console.log(error);
      });
  }

  function changeFwStatusApproved(fw) {
    fwStatusToChange.fwId = fw.fwId;
    fwStatusToChange.status = "APPROVED";
    var config = {
      method: "post",
      url: api_root + "/service/change-status",
      headers: {Authorization: "Bearer "+$jwt_token,
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

  function changeFwStatusRejected(fw) {
    fwStatusToChange.fwId = fw.fwId;
    fwStatusToChange.status = "REJECTED";
    var config = {
      method: "post",
      url: api_root + "/service/change-status",
      headers: {Authorization: "Bearer "+$jwt_token,
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
</script>

{#if success}
  <div class="row row-cols-1 row-cols-md-3 g-4">
    <div class="col" />
    <div class="col">
      <div class="card" style="margin-top: 20px;">
        <div class="card-header" style="font-size: 24px;">
          New Firewall Rule
        </div>
        <div class="card-body">
          <h5 class="card-title" style="font-weight: bold;">Firewall Type</h5>
          <p class="card-text">{firewallType.name}</p>
          <h5 class="card-title" style="font-weight: bold;">Context</h5>
          <p class="card-text">{context.name}</p>
          <h5 class="card-title" style="font-weight: bold;">Source</h5>
          {#if sHo}
            <p class="card-text">
              {sHo.name}
              <br />
              {sHo.ip}
            </p>
          {/if}
          {#if sHgoWithHo}
            <p class="card-text">
              {sHgoWithHo.hgoName}
              {#each sHgoWithHo.members as m}
                <br />
                {m.name}
                <br />
                {m.ip}
              {/each}
            </p>
          {/if}
          {#if sNo}
            <p class="card-text">
              {sNo.name}
              <br />
              {sNo.ip}{sNo.subnet}
            </p>
          {/if}
          {#if sNgoWithNo}
            <p class="card-text">
              {sNgoWithNo.ngoName}
              {#each sNgoWithNo.members as m}
                <br />
                {m.name}
                <br />
                {m.ip}{m.subnet}
              {/each}
            </p>
          {/if}
          <h5 class="card-title" style="font-weight: bold;">Destination</h5>
          {#if dHo}
            <p class="card-text">
              {dHo.name}
              <br />
              {dHo.ip}
            </p>
          {/if}
          {#if dHgoWithHo}
            <p class="card-text">
              {dHgoWithHo.hgoName}
              {#each dHgoWithHo.members as m}
                <br />
                {m.name}
                <br />
                {m.ip}
              {/each}
            </p>
          {/if}
          {#if dNo}
            <p class="card-text">
              {dNo.name}
              <br />
              {dNo.ip}{dNo.subnet}
            </p>
          {/if}
          {#if dNgoWithNo}
            <p class="card-text">
              {dNgoWithNo.ngoName}
              {#each dNgoWithNo.members as m}
                <br />
                {m.name}
                <br />
                {m.ip}{m.subnet}
              {/each}
            </p>
          {/if}
          <h5 class="card-title" style="font-weight: bold;">Service Group</h5>
          <p class="card-text">
            {sgo.name}
            {#each sgo.port as p}
              <br />
              {p}
            {/each}
          </p>
          <h5 class="card-title" style="font-weight: bold;">Use Case</h5>
          <p class="card-text">{uc.name}</p>
          <h5 class="card-title" style="font-weight: bold;">Status</h5>
          <p class="card-text">{firewallRules.firewallStatus}</p>
        </div>
        <div class="card-footer">
          <button
            type="button"
            data-toggle="modal"
            data-target="#reject"
            class="btn"
            style="background-color: #c73834; color: #fff"
            on:click={changeFwStatusRejected(firewallRules)}>Reject</button
          >
          <button
            type="button"
            data-toggle="modal"
            data-target="#approve"
            class="btn btn-success"
            style="color: #fff"
            on:click={changeFwStatusApproved(firewallRules)}>Approve</button
          >
        </div>
      </div>
    </div>
  </div>
{/if}

<div
  class="modal fade"
  id="reject"
  tabindex="-1"
  role="dialog"
  aria-hidden="true"
>
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="reject">Rejected</h5>
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
        <p>This firewall rule has been rejected</p>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal"
            >Close</button
          >
          <button
            type="button"
            class="btn"
            data-dismiss="modal"
            style="background-color: #c73834; color: #fff">OK</button
          >
        </div>
      </div>
    </div>
  </div>
</div>

<div
  class="modal fade"
  id="approve"
  tabindex="-1"
  role="dialog"
  aria-hidden="true"
>
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="approve">Approved</h5>
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
        <p>This firewall rule has been approved</p>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal"
            >Close</button
          >
          <button
            type="button"
            class="btn"
            data-dismiss="modal"
            style="background-color: #c73834; color: #fff">OK</button
          >
        </div>
      </div>
    </div>
  </div>
</div>
