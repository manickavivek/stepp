$( document ).ready(function() {

    $("#model_rate_per_piece_id").keydown(function (event) {
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
        if($(this).val().indexOf('.') !== -1 && event.keyCode == 190) {
            event.preventDefault();
            //if a decimal has been added, disable the "."-button
        }
    });

    $("#customization_cost_id").keydown(function (event) {
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
        if($(this).val().indexOf('.') !== -1 && event.keyCode == 190) {
            event.preventDefault();
            //if a decimal has been added, disable the "."-button
        }
    });

    modelTypeChange();
});

function modelTypeChange() {
    if($("#model_type_id").val() == "standard") {
        $("#customization_cost_id").val("NA");
        $("#customization_cost_id").prop('readonly', true);
    } else {
        $("#customization_cost_id").val("");
        $("#customization_cost_id").prop('readonly', false);
    }
}

function stockinBtnClick() {

    //Add validations

    let confirmation = confirm("Are you sure to update the stock inventory??");
    if (confirmation == false) {
        return;
    }

    let addStockTxnPayload = {};
    addStockTxnPayload["model_number"] = $("#model_no_id").val();
    addStockTxnPayload["model_type"] = $("#model_type_id").val();
    addStockTxnPayload["model_size"] = $("#model_size_id").val();;
    addStockTxnPayload["model_color"] = $("#model_color_id").val();
    addStockTxnPayload["model_rate_per_piece"] = $("#model_rate_per_piece_id").val();
    addStockTxnPayload["txn_type"] = "stock in";
    addStockTxnPayload["txn_income"] = "NA";
    addStockTxnPayload["txn_expense"] = parseInt($("#model_rate_per_piece_id").val())*parseInt($("#txn_quantity_id").val());
    addStockTxnPayload["txn_date"] = $("#txn_date_id").val()+":00Z";
    addStockTxnPayload["txn_bill_no"] = $("#txn_bill_no_id").val();
    addStockTxnPayload["txn_quantity"] = $("#txn_quantity_id").val();
    addStockTxnPayload["discounts"] = "NA";
    addStockTxnPayload["customization_cost"] = $("#customization_cost_id").val();
    addStockTxnPayload["comments"] = $("#comments_id").val();

    console.log("Calling addStockTransaction API..");
    genericApiCalls("POST", "/addStockTransaction", addStockTxnPayload, addStockTxnSuccesscb, errorcb)

    function addStockTxnSuccesscb(data) {
        if(data["response"] == "Transaction Updated!!") {
            console.log(data["response"]);

            let updateStockCountPayload = {};
            updateStockCountPayload["model_number"] = $("#model_no_id").val();
            updateStockCountPayload["model_type"] = $("#model_type_id").val();
            updateStockCountPayload["model_size"] = $("#model_size_id").val();;
            updateStockCountPayload["model_color"] = $("#model_color_id").val();
            updateStockCountPayload["update_type"] = "add";
            updateStockCountPayload["update_count"] = parseInt($("#txn_quantity_id").val());

            console.log("Calling updateStockCount API..");
            genericApiCalls("POST", "/updateStockCount", updateStockCountPayload, updateStockCountSuccesscb, errorcb)
        } else {
            alert("Add stock txn failed!!");
        }
    }

    function updateStockCountSuccesscb(data) {
        if(data["response"] == "Stock count updated for new entry!!" || data["response"] == "Stock count updated for existing entry!!") {
            console.log(data["response"]);
            alert("Stock In entry added!!")
            window.location.href = 'index.html';
        } else {
            alert("Update stock count failed!!");
        }
    }

    function errorcb(jqXHR, textStatus, errorThrown) {
        alert("Database update Failed!!");
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
    }
}


