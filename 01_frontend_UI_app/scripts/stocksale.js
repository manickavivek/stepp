let availableStock = "";
$( document ).ready(function() {
    $("#second_section_id").hide();
    $("#submit_id").hide();
    let payload = {};
    genericApiCalls("GET", "/getAvailableStocks", payload, avlbStocksSuccesscb, errorcb)

    function avlbStocksSuccesscb(data) {
        let optionHtml = "";
        availableStock = data["response"];
        let dbData = data["response"];
        for(let record in dbData) {
            optionHtml += '<option value="'+dbData[record]["model_number"]+'">'+dbData[record]["model_number"]+'</option>';
        }
        $("#model_no_id").html(optionHtml);
        /* This block will remove duplicate options from the UI (copied from net) - start*/
        let map = {};
        $('#model_no_id option').each(function () {
            if (map[this.value]) 
                $(this).remove();
            map[this.value] = true;
        });
        /* This block will remove duplicate options from the UI (copied from net) - start*/
        setTimeout(function(){ 
            $("#loadingPopup").modal("hide");
        }, 500);
    }

    $("#model_rate_per_piece_id").keydown(function (event) {
        rateInputHandle(event, $(this));
    });

    $("#customization_cost_id").keydown(function (event) {
        rateInputHandle(event, $(this));
    });

    $("#discounts_id").keydown(function (event) {
        rateInputHandle(event, $(this));
    });
});

function confirmBtnClick() {
    let modelNoInp = ($("#model_no_id").val()).trim();
    let modelTypInp = $("#model_type_id").val();
    let modelSizInp = $("#model_size_id").val();
    let modelClrInp = $("#model_color_id").val();
    let avlStockCount = 0;
    for(let record in availableStock) {
        let recordLoop = availableStock[record];
        if(modelNoInp == recordLoop["model_number"] && modelTypInp == recordLoop["model_type"] && modelSizInp == recordLoop["model_size"] && modelClrInp == recordLoop["model_color"]) {
            if(recordLoop["available_count"] <= 0) {
                //do nothing
            } else {
                avlStockCount = recordLoop["available_count"];
            }
        }
    }
    if(avlStockCount == 0) {
        alert("No stock availabe in store for the this product!!")
    } else {
        $("#second_section_id").show();
        $("#available_count_id").html(avlStockCount);
        $("#submit_id").show();
        $("#confirm_id").hide();
        $("#model_no_id").attr("disabled", "true");
        $("#model_type_id").attr("disabled", "true");
        $("#model_size_id").attr("disabled", "true");
        $("#model_color_id").attr("disabled", "true");
        modelTypeChange();
    }
}

function modelTypeChange() {
    if($("#model_type_id").val() == "standard") {
        $("#customization_cost_id").val("NA").prop('readonly', true);
    } else {
        $("#customization_cost_id").val("").prop('readonly', false);
    }
}

function stocksaleBtnClick() {

    let modelNoInp = ($("#model_no_id").val()).trim();
    let modelTypInp = $("#model_type_id").val();
    let modelSizInp = $("#model_size_id").val();
    let modelClrInp = $("#model_color_id").val();
    let modelRteppInp = $("#model_rate_per_piece_id").val();
    let txnDateInp = $("#txn_date_id").val()+":00Z";
    let billNoInp = ($("#txn_bill_no_id").val()).trim();
    let txnQuanInp = $("#txn_quantity_id").val();
    let discountsInp = $("#discounts_id").val();
    let custCostInp = $("#customization_cost_id").val();
    let commentsInp = ($("#comments_id").val()).trim();

    if(modelNoInp == "" || modelRteppInp == "" || txnDateInp == ":00Z" || billNoInp == "" || txnQuanInp == "" || discountsInp == "") {
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

    if(parseInt($("#available_count_id").html()) < parseInt(txnQuanInp)) {
        $("#modelMsg").html("Entered quantity is not available in store!!");
        $("#alertPopup").modal("show");
        return;
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
    addStockTxnPayload["txn_type"] = "stock sale";
    addStockTxnPayload["txn_income"] = (parseInt(modelRteppInp)*parseInt(txnQuanInp)) - parseInt(discountsInp);
    addStockTxnPayload["txn_expense"] = "NA";
    addStockTxnPayload["txn_date"] = txnDateInp;
    addStockTxnPayload["txn_bill_no"] = billNoInp;
    addStockTxnPayload["txn_quantity"] = txnQuanInp;
    addStockTxnPayload["discounts"] = discountsInp;
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
            updateStockCountPayload["update_type"] = "remove";
            updateStockCountPayload["update_count"] = parseInt(txnQuanInp);

            console.log("Calling updateStockCount API..");
            genericApiCalls("POST", "/updateStockCount", updateStockCountPayload, updateStockCountSuccesscb, errorcb)
        } else {
            $("#modelMsg").html("Stock sale txn failed!!");
            $("#alertPopup").modal("show");
        }
    }

    function updateStockCountSuccesscb(data) {
        setTimeout(function(){ 
            $("#loadingPopup").modal("hide");
        }, 500);
        if(data["response"] == "Stock count updated for new entry!!" || data["response"] == "Stock count updated for existing entry!!") {
            console.log(data["response"]);
            $("#indexPgmodelMsg").html("Stock sale entry added!!");
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
