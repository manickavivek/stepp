$( document ).ready(function() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    let getStockinBillPayload = {};
    getStockinBillPayload["id"] = params["id"];

    genericApiCalls("POST", "/getTransaction", getStockinBillPayload, getStockinBillSuccesscb, errorcb);
    function getStockinBillSuccesscb(data) {
        setTimeout(function(){ 
            $("#loadingPopup").modal("hide");
        }, 500);
        let resObj = data["response"][0];
        console.log(resObj);
        $("#bill_no").val(resObj["bill_no"]);
        $("#bill_amt").val(resObj["expense"]);
        let [ date, time ] = resObj["date"].split("T");
        $("#bill_date").val(date);
        let res = resObj["more_details"];
        let newTrHtml = "";
        for(let resLoop in res) {
            newTrHtml += '<tr>';
            newTrHtml += '<td>';
            newTrHtml += '<select class="form-control">';
            newTrHtml += '<option value="'+res[resLoop]["model"]+'">'+res[resLoop]["model"]+'</option>';
            newTrHtml += '</select>';
            newTrHtml += '</td>';
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
            newTrHtml += '<input class="form-control" type="number" min="1" placeholder="min 1" readonly="true" value="'+res[resLoop]["quantity"]+'"/>'
            newTrHtml += "</td>";
            newTrHtml += '<td>';
            newTrHtml += '<div class="input-group">';
            newTrHtml += '<div class="input-group-prepend">';
            newTrHtml += '<div class="input-group-text">₹</div>';
            newTrHtml += '</div>';
            newTrHtml += '<input class="form-control" type="text" placeholder="Enter amount" readonly="true" value="'+res[resLoop]["purchase_rate"]+'"/>'
            newTrHtml += '</div>';
            newTrHtml += "</td>";
            newTrHtml += "</tr>";
        }
        $("#prdTbl").append(newTrHtml);
    }
});
