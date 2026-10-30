grist.ready();

let records = [];

let statusChart;
let directionChart;

grist.onRecords(data => {

    records = data;

    initDGFilter();

    renderDashboard();

});

function initDGFilter(){

    const select = document.getElementById("dgFilter");

    const dgs = [...new Set(
      records.map(r => r["DG propriétaire"]).filter(Boolean)
    )];

    select.innerHTML =
      '<option value="">Toutes les Directions Générales</option>';

    dgs.sort().forEach(dg => {

        const option=document.createElement("option");

        option.value=dg;
        option.textContent=dg;

        select.appendChild(option);

    });

    select.onchange=renderDashboard;
}

function getFilteredData(){

    const selected =
        document.getElementById("dgFilter").value;

    if(!selected)
        return records;

    return records.filter(
        r => r["DG propriétaire"] === selected
    );
}

function renderDashboard(){

    const data = getFilteredData();

    renderKPIs(data);

    renderStatusChart(data);

    renderDirectionChart(data);

    renderTable(data);
}

function renderKPIs(data){

    document.getElementById("totalTs").textContent =
        data.length;

    document.getElementById("enService").textContent =
        data.filter(x=>x.Statut==="En service").length;

    document.getElementById("enDev").textContent =
        data.filter(x=>x.Statut==="En développement").length;

    document.getElementById("fermes").textContent =
        data.filter(x=>x.Statut==="Fermé").length;
}

function renderStatusChart(data){

    const counts={};

    data.forEach(row=>{

        const statut=row.Statut || "Inconnu";

        counts[statut]=(counts[statut]||0)+1;

    });

    const ctx=
      document.getElementById("statusChart");

    if(statusChart)
        statusChart.destroy();

    statusChart=
      new Chart(ctx,{

        type:"doughnut",

        data:{

            labels:Object.keys(counts),

            datasets:[{

                data:Object.values(counts)

            }]

        }

      });
}

function renderDirectionChart(data){

    const counts={};

    data.forEach(row=>{

        const direction =
          row["Direction propriétaire"];

        if(!direction)
            return;

        counts[direction] =
          (counts[direction]||0)+1;
    });

    const ctx =
      document.getElementById(
        "directionChart"
      );

    if(directionChart)
        directionChart.destroy();

    directionChart =
      new Chart(ctx,{

      type:"bar",

      data:{

          labels:Object.keys(counts),

          datasets:[{

              label:"Téléservices",

              data:Object.values(counts)

          }]
      }

    });

}

function renderTable(data){

    const tbody =
      document.querySelector(
        "#teleservicesTable tbody"
      );

    tbody.innerHTML="";

    data.forEach(row=>{

        const tr =
          document.createElement("tr");

        tr.innerHTML=`

          <td>${row["Titre public"]||''}</td>

          <td>${row.Statut||''}</td>

          <td>${row["Direction propriétaire"]||''}</td>

          <td>${row["Responsable MCO"]||''}</td>

          <td>${row["Application métier"]||''}</td>

        `;

        tbody.appendChild(tr);

    });
}