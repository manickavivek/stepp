$( document ).ready(function() {

    // let payload = {};
    // genericApiCalls("GET", "/product", payload, getProductsSuccesscb, errorcb)

    // function getProductsSuccesscb(data) {
    //     setTimeout(function(){ 
    //         $("#loadingPopup").modal("hide");
    //     }, 500);
    //     console.log(data);
});

function getTxns() {
    let getTxnsPayload = {};
    getTxnsPayload["from"] = $("#from_date").val();
    getTxnsPayload["to"] = $("#to_date").val();
    genericApiCalls("POST", "/getTransactions", getTxnsPayload, getTxnsSuccesscb, errorcb)

    function getTxnsSuccesscb(data) {
        setTimeout(function(){ 
            $("#loadingPopup").modal("hide");
        }, 500);
        console.log(data);

        let dataSet = [];
        let dataSetRec = [];
        let dbData = data["response"];
        for(let record in dbData) {
            dataSetRec = [];
            let dateArr = (dbData[record]["date"]).split("T");
            dataSetRec.push(dateArr[0]);
            dataSetRec.push(dbData[record]["type"]);
            dataSetRec.push(dbData[record]["bill_no"]);
            dataSetRec.push(dbData[record]["description"]);
            dataSetRec.push(dbData[record]["income"]);
            dataSetRec.push(dbData[record]["expense"]);
            dataSet.push(dataSetRec);
        }

        if(dataSet.length == 0) {
            $("#indexPgmodelMsg").html("No data available for this date range!!");
            setTimeout(function(){ 
                $("#indexPgRedirectionPopup").modal("show");
            }, 500);
        }

        $('#transacrions_tbl').DataTable({
            data: dataSet,
            columns: [
                { title: "Date", width: '10%' },
                { title: "Category", width: '15%' },
                { title: "Bill", width: '10%' },
                { title: "Description", width: '45%' },
                { title: "Income", width: '10%' },
                { title: "Expense", width: '10%' }
            ]
        });

        $("#get_txn_btn").remove();
    }
}