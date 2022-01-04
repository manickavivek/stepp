$( document ).ready(function() {

});

function submitTxn() {
    let txnType = $("#type").val();
    let txnDate = $("#date").val();
    let txnDesc = $("#description").val();
    let txnAmt = $("#amount").val();

    if(txnType == "NA" || txnDesc == "" || txnAmt == "" || txnDate == "") {
        $("#modelMsg").html("Enter all mandatory inputs!!");
        $("#alertPopup").modal("show");
        return;
    }

    let confirmation = confirm("Are you sure to add the transaction??");
    if (confirmation == false) {
        return;
    }

    let otrTxnPayload = {};
    otrTxnPayload["date"] = txnDate;
    otrTxnPayload["bill_no"] = "NA";
    otrTxnPayload["description"] = txnDesc;
    if(txnType == "income") {
        otrTxnPayload["type"] = "Other Income";
        otrTxnPayload["income"] = txnAmt;
        otrTxnPayload["expense"] = 0;
    } else {
        otrTxnPayload["type"] = "Other Expense";
        otrTxnPayload["income"] = 0;
        otrTxnPayload["expense"] = txnAmt;
    }

    console.log("Calling transactions API..");
    genericApiCalls("POST", "/transactions", otrTxnPayload, otrTxnSuccesscb, errorcb);

    function otrTxnSuccesscb(data) {
        if(data["response"] == "transactions collection updated successfully!!") {
            $("#indexPgmodelMsg").html("Transaction updated successfully!!");
            setTimeout(function(){
                $("#indexPgRedirectionPopup").modal("show");
            }, 500);
        }
    }
}