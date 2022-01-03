$( document ).ready(function() {

    let payload = {};
    genericApiCalls("GET", "/product", payload, getProductsSuccesscb, errorcb)

    function getProductsSuccesscb(data) {
        setTimeout(function(){ 
            $("#loadingPopup").modal("hide");
        }, 500);
        console.log(data);

        let dataSet = [];
        let dataSetRec = [];
        let dbData = data["response"];
        for(let record in dbData) {
            dataSetRec = [];
            dataSetRec.push(dbData[record]["model"]);
            dataSetRec.push(dbData[record]["size"]);
            dataSetRec.push(dbData[record]["color"]);
            dataSetRec.push(dbData[record]["count"]);
            dataSet.push(dataSetRec);
        }

        if(dataSet.length == 0) {
            $("#indexPgmodelMsg").html("No data available!!");
            setTimeout(function(){ 
                $("#indexPgRedirectionPopup").modal("show");
            }, 500);
        }

        $('#prd_inventory_tbl').DataTable( {
            data: dataSet,
            columns: [
                { title: "Model" },
                { title: "Size" },
                { title: "Color" },
                { title: "Availabe stock" }
            ]
        } );
    }
});