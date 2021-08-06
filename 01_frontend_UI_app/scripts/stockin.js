$( document ).ready(function() {

    modelTypeChange();

    $("#model_rate_per_piece_id").keydown(function (event) {
        rateInputHandle(event, $(this));
    });

    $("#customization_cost_id").keydown(function (event) {
        rateInputHandle(event, $(this));
    });

    function rateInputHandle(event, thisObj) {
        if (event.shiftKey == true) {
            event.preventDefault();
        }
        if ((event.keyCode >= 48 && event.keyCode <= 57) || 
            (event.keyCode >= 96 && event.keyCode <= 105) || 
            event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 37 ||
            event.keyCode == 39 || event.keyCode == 46 || event.keyCode == 190) {
            //Do nothing
        } else {
            event.preventDefault();
        }
        if(thisObj.val().indexOf('.') !== -1 && event.keyCode == 190) {
            event.preventDefault();
            //if a decimal has been added, disable the "."-button
        }
    }    
});

function modelTypeChange() {
    if($("#model_type_id").val() == "standard") {
        $("#customization_cost_id").val("NA").prop('readonly', true);
    } else {
        $("#customization_cost_id").val("").prop('readonly', false);
    }
}

function stockinBtnClick() {

    let modelNoInp = ($("#model_no_id").val()).trim();
    let modelTypInp = $("#model_type_id").val();
    let modelSizInp = $("#model_size_id").val();
    let modelClrInp = $("#model_color_id").val();
    let modelRteppInp = $("#model_rate_per_piece_id").val();
    let txnDateInp = $("#txn_date_id").val()+":00Z";
    let billNoInp = ($("#txn_bill_no_id").val()).trim();
    let txnQuanInp = $("#txn_quantity_id").val();
    let custCostInp = $("#customization_cost_id").val();
    let commentsInp = ($("#comments_id").val()).trim();

    if(modelNoInp == "" || modelRteppInp == "" || txnDateInp == ":00Z" || billNoInp == "" || txnQuanInp == "") {
        $("#modelMsg").html("Enter all mandatory inputs!!");
        $("#alertPopup").modal("show");
        return;
    }

    if(modelTypInp == "customized") {
        if(custCostInp == "") {
            $("#modelMsg").html("Enter customization cost!!");
            $("#alertPopup").modal("show");
            return;
        }
    }

    let confirmation = confirm("Are you sure to update the stock inventory??");
    if (confirmation == false) {
        return;
    }

    let addStockTxnPayload = {};
    addStockTxnPayload["model_number"] = modelNoInp;
    addStockTxnPayload["model_type"] = modelTypInp;
    addStockTxnPayload["model_size"] = modelSizInp;
    addStockTxnPayload["model_color"] = modelClrInp;
    addStockTxnPayload["model_rate_per_piece"] = modelRteppInp;
    addStockTxnPayload["txn_type"] = "stock in";
    addStockTxnPayload["txn_income"] = "NA";
    addStockTxnPayload["txn_expense"] = parseInt(modelRteppInp)*parseInt(txnQuanInp);
    addStockTxnPayload["txn_date"] = txnDateInp;
    addStockTxnPayload["txn_bill_no"] = billNoInp;
    addStockTxnPayload["txn_quantity"] = txnQuanInp;
    addStockTxnPayload["discounts"] = "NA";
    addStockTxnPayload["customization_cost"] = custCostInp;
    addStockTxnPayload["comments"] = commentsInp

    console.log("Calling addStockTransaction API..");
    genericApiCalls("POST", "/addStockTransaction", addStockTxnPayload, addStockTxnSuccesscb, errorcb)

    function addStockTxnSuccesscb(data) {
        if(data["response"] == "Transaction Updated!!") {
            console.log(data["response"]);

            let updateStockCountPayload = {};
            updateStockCountPayload["model_number"] = modelNoInp;
            updateStockCountPayload["model_type"] = modelTypInp;
            updateStockCountPayload["model_size"] = modelSizInp;
            updateStockCountPayload["model_color"] = modelClrInp;
            updateStockCountPayload["update_type"] = "add";
            updateStockCountPayload["update_count"] = parseInt(txnQuanInp);

            console.log("Calling updateStockCount API..");
            genericApiCalls("POST", "/updateStockCount", updateStockCountPayload, updateStockCountSuccesscb, errorcb)
        } else {
            $("#modelMsg").html("Add stock txn failed!!");
            $("#alertPopup").modal("show");
        }
    }

    function updateStockCountSuccesscb(data) {
        setTimeout(function(){ 
            $("#loadingPopup").modal("hide");
        }, 500);
        if(data["response"] == "Stock count updated for new entry!!" || data["response"] == "Stock count updated for existing entry!!") {
            console.log(data["response"]);
            $("#indexPgmodelMsg").html("Stock In entry added!!");
            setTimeout(function(){ 
                $("#indexPgRedirectionPopup").modal("show");
            }, 500);
        } else {
            $("#modelMsg").html("Update stock count failed!!");
            setTimeout(function(){
                $("#alertPopup").modal("show");
            }, 500);  
        }
    }
}


