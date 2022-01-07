$( document ).ready(function() {

});

function submitScanTxn() {
    let scnBillNo = $("#bill_no").val();
    let scnDate = $("#date").val();
    let scnDesc = $("#description").val();
    let scnAmt = $("#amount").val();

    if(scnBillNo == "" || scnDate == "" || scnDesc == "" || scnAmt == "") {
        $("#modelMsg").html("Enter all mandatory inputs!!");
        $("#alertPopup").modal("show");
        return;
    }

    let confirmation = confirm("Are you sure to add the scan transaction??");
    if (confirmation == false) {
        return;
    }

    let scnPayload = {};
    scnPayload["date"] = scnDate;
    scnPayload["bill_no"] = scnBillNo;
    scnPayload["description"] = scnDesc;
    scnPayload["transaction_type"] = "Scan";
    scnPayload["income"] = scnAmt;
    scnPayload["expense"] = 0;

    console.log("Calling transactions API..");
    genericApiCalls("POST", "/transactions", scnPayload, scnSuccesscb, errorcb);

    function scnSuccesscb(data) {
        if(data["response"] == "transactions collection updated successfully!!") {
            $("#indexPgmodelMsg").html("Scan transaction updated successfully!!");
            setTimeout(function(){
                $("#indexPgRedirectionPopup").modal("show");
            }, 500);
        }
    }
}