$( document ).ready(function() {

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
                { title: "Date", width: '10%', className: "text-center" },
                { title: "Category", width: '15%', className: "text-center" },
                { title: "Bill No.", width: '10%', className: "text-center" },
                { title: "Description", width: '45%' },
                { title: "Income", width: '10%', className: "text-center" },
                { title: "Expense", width: '10%', className: "text-center" }
            ]
        });

        $("#get_txn_btn").remove();
    }
}