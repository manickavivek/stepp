$( document ).ready(function() {

    let payload = {};
    genericApiCalls("GET", "/getAvailableStocks", payload, avlbStocksSuccesscb, errorcb)

    function avlbStocksSuccesscb(data) {
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
            alert("No data available!!")
            window.location.href = 'index.html';
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

    function errorcb(jqXHR, textStatus, errorThrown) {
        alert("Fetching data from database failed!!");
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
    }

});