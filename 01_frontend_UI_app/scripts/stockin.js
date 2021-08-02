function stockinBtnClick() {
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
            console.log("Transaction Updated!!");
            console.log("Calling updateStockCount API..");
        }
    }
    
}

function errorcb(jqXHR, textStatus, errorThrown) {
    alert("Database update Failed!!");
    console.log(jqXHR);
    console.log(textStatus);
    console.log(errorThrown);
}
