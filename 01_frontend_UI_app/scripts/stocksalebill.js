let res = "";
let id = "";
$( document ).ready(function() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    let getStockSaleBillPayload = {};
    getStockSaleBillPayload["id"] = params["id"];
    id = params["id"];

    genericApiCalls("POST", "/getTransaction", getStockSaleBillPayload, getStockinBillSuccesscb, errorcb);
    function getStockinBillSuccesscb(data) {
        setTimeout(function(){ 
            $("#loadingPopup").modal("hide");
        }, 500);
        let resObj = data["response"][0];
        $("#bill_no").val(resObj["bill_no"]);
        $("#cust_name").val(resObj["customer_name"] == "" ? "Not Available" : resObj["customer_name"] );
        $("#cust_ph").val(resObj["customer_phone"] == "" ? "Not Available" : resObj["customer_phone"] );
        $("#cust_address").val(resObj["customer_address"] == "" ? "Not Available" : resObj["customer_address"] );
        $("#bill_amt").val(resObj["income"]);
        let [ date, time ] = resObj["date"].split("T");
        $("#bill_date").val(date);
        res = resObj["more_details"];
        let newTrHtml = "";
        for(let resLoop in res) {
            newTrHtml += '<tr>';
            newTrHtml += '<td>';
            newTrHtml += '<select class="form-control">';
            newTrHtml += '<option value="'+res[resLoop]["model"]+'">'+res[resLoop]["model"]+'</option>';
            newTrHtml += '</select>';
            newTrHtml += "</td>";
            newTrHtml += '<td>';
            newTrHtml += '<select class="form-control">';
            newTrHtml += '<option value="'+res[resLoop]["size"]+'">'+res[resLoop]["size"]+'</option>';
            newTrHtml += '</select>';
            newTrHtml += "</td>";
            newTrHtml += '<td>';
            newTrHtml += '<select class="form-control">';
            newTrHtml += '<option value="'+res[resLoop]["color"]+'">'+res[resLoop]["color"]+'</option>';
            newTrHtml += '</select>';
            newTrHtml += "</td>";
            newTrHtml += '<td>';
            newTrHtml += '<select class="form-control">';
            newTrHtml += '<option value="'+res[resLoop]["type"]+'">'+res[resLoop]["type"]+'</option>';
            newTrHtml += '</select>';
            newTrHtml += "</td>";
            newTrHtml += '<td>';
            newTrHtml += '<input class="form-control" type="text" readonly="true" value="'+res[resLoop]["quantity"]+'"/>';
            newTrHtml += "</td>";
            newTrHtml += '<td>';
            newTrHtml += '<div class="input-group">';
            newTrHtml += '<div class="input-group-prepend">';
            newTrHtml += '<div class="input-group-text">₹</div>';
            newTrHtml += '</div>';
            newTrHtml += '<input class="form-control" type="text" id="'+resLoop+"_purchase_rate"+'" value="'+res[resLoop]["purchase_rate"]+'" onkeydown="rateInputHandle(event, this)" placeholder="Enter amount"/>';
            newTrHtml += '</div>';
            newTrHtml += "</td>";
            newTrHtml += '<td>';
            newTrHtml += '<div class="input-group">';
            newTrHtml += '<div class="input-group-prepend">';
            newTrHtml += '<div class="input-group-text">₹</div>';
            newTrHtml += '</div>';
            newTrHtml += '<input class="form-control" type="text" readonly="true" value="'+res[resLoop]["sale_rate"]+'"/>';
            newTrHtml += '</div>';
            newTrHtml += "</td>";
            newTrHtml += "</tr>";
        }
        $("#prdTbl").append(newTrHtml);
    }
});

function updatePurRate() {
    let confirmation = confirm("Are you sure to update the purchase rates??");
    if (confirmation == false) {
        return;
    }

    for(let resLoop in res) { 
        res[resLoop]["purchase_rate"] =  $("#"+resLoop+"_purchase_rate").val();
    }
    let updatePurchaseRatePayload = {};
    updatePurchaseRatePayload["id"] = id;
    updatePurchaseRatePayload["more_details"] = res;
    genericApiCalls("POST", "/updatePurchaseRate", updatePurchaseRatePayload, updatePurchaseRateSuccesscb, errorcb);
    function updatePurchaseRateSuccesscb(data) {
        setTimeout(function(){ 
            $("#loadingPopup").modal("hide");
        }, 500);
        window.top.close();
    }
}
