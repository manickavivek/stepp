$( document ).ready(function() {

    let payload = {};
    genericApiCalls("GET", "/getAvailableStocks", payload, avlbStocksSuccesscb, errorcb)

    function avlbStocksSuccesscb(data) {
        setTimeout(function(){ 
            $("#loadingPopup").modal("hide");
        }, 500);
        console.log(data);

        let dataSet = [];
        let dataSetRec = [];
        let dbData = data["response"];
        for(let record in dbData) {
            dataSetRec = [];
            dataSetRec.push(dbData[record]["model_number"]);
            dataSetRec.push(dbData[record]["model_type"]);
            dataSetRec.push(dbData[record]["model_size"]);
            dataSetRec.push(dbData[record]["model_color"]);
            dataSetRec.push(dbData[record]["available_count"]);
            dataSet.push(dataSetRec);
        }

        if(dataSet.length == 0) {
            $("#indexPgmodelMsg").html("No data available!!");
            setTimeout(function(){ 
                $("#indexPgRedirectionPopup").modal("show");
            }, 500);
        }

        $('#available_stocks_tbl').DataTable( {
            data: dataSet,
            columns: [
                { title: "Model Number" },
                { title: "Model Type" },
                { title: "Model Size" },
                { title: "Model Color" },
                { title: "Availabe Count" }
            ]
        } );
    }
});