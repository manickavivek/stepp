let dynamicRowNo = 0;
let prodLists = [];
$( document ).ready(function() {
    genericApiCalls("GET", "/product", "", getProductsSuccesscb, errorcb);
    function getProductsSuccesscb(data) {
        setTimeout(function(){ 
            $("#loadingPopup").modal("hide");
        }, 500);
        console.log(data);
        prodLists = data["response"];
    }
});

function totalBillAmtCalculator() {
    let totalBillAmt = 0;
    $($('[id^="amount_"]')).each(function(index) {
        if($(this).val() == "") {
            //Do Nothing
        } else {
            totalBillAmt = totalBillAmt + parseFloat($(this).val());
        }
    });
    $("#bill_amt").val(totalBillAmt);
}

function addRow() {
    let uniqueNo = dynamicRowNo++;
    let newTrHtml = "";
    newTrHtml += '<tr id="tr_'+uniqueNo+'" uniqueid="'+uniqueNo+'">';
    newTrHtml += '<td>';
    newTrHtml += '<select class="form-control" id="model_'+uniqueNo+'" uniqueid="'+uniqueNo+'" onchange="onModelChange(this)">';
    newTrHtml += '<option value="NA">NA</option>';
    let modelArr = [];
    for(let model in prodLists) {
        modelArr.push(prodLists[model]["model"]);
    }
    let modelUniqueArr = [... new Set(modelArr)];
    for(let uniModel in modelUniqueArr) {
        newTrHtml += '<option value="'+modelUniqueArr[uniModel]+'">'+modelUniqueArr[uniModel]+'</option>';
    }
    newTrHtml += '</select>';
    newTrHtml += "</td>";
    newTrHtml += '<td>';
    newTrHtml += '<select class="form-control" id="size_'+uniqueNo+'" uniqueid="'+uniqueNo+'" onchange="onSizeChange(this)">';
    newTrHtml += '<option value="NA">NA</option>';
    newTrHtml += '</select>';
    newTrHtml += "</td>";
    newTrHtml += '<td>';
    newTrHtml += '<select class="form-control" id="color_'+uniqueNo+'" uniqueid="'+uniqueNo+'" onchange="onColorChange(this)">';
    newTrHtml += '<option value="NA">NA</option>';
    newTrHtml += '</select>';
    newTrHtml += "</td>";
    newTrHtml += '<td>';
    newTrHtml += '<select class="form-control" id="type_'+uniqueNo+'">';
    newTrHtml += '<option value="NA">NA</option>';
    newTrHtml += '<option value="base">Base</option>';
    newTrHtml += '<option value="custom">Custom</option>';
    newTrHtml += '</select>';
    newTrHtml += "</td>";
    newTrHtml += '<td>';
    newTrHtml += '<input class="form-control" id="quantity_'+uniqueNo+'" type="number" min="1" placeholder="min 1" onkeypress="onQuantityKeyPress(event)" oncopy="return false" onpaste="return false" onchange="onQuantityChange(this)"/>'
    newTrHtml += "</td>";
    newTrHtml += '<td>';
    newTrHtml += '<div class="input-group">';
    newTrHtml += '<div class="input-group-prepend">';
    newTrHtml += '<div class="input-group-text">₹</div>';
    newTrHtml += '</div>';
    newTrHtml += '<input class="form-control" id="amount_'+uniqueNo+'" type="text" onkeydown="rateInputHandle(event, this)" onkeyup="totalBillAmtCalculator()" placeholder="Enter amount"/>'
    newTrHtml += '</div>';
    newTrHtml += "</td>";
    newTrHtml += '<td>';
    newTrHtml += '<svg id="delete_'+uniqueNo+'" uniqueid="'+uniqueNo+'" onclick="onDeletBtnClick(this); totalBillAmtCalculator()" xmlns="http://www.w3.org/2000/svg" style="margin-top: 7px" width="25" height="25" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>';
    newTrHtml += "</td>";
    newTrHtml += "</tr>";
    $("#prdTbl").append(newTrHtml);
}

function onModelChange(obj) {
    let chosenModel = $("#"+obj["id"]).val();
    $("#size_"+$('#'+obj["id"]).attr('uniqueid')).html('<option value="NA">NA</option>');
    $("#color_"+$('#'+obj["id"]).attr('uniqueid')).html('<option value="NA">NA</option>');
    $("#type_"+$('#'+obj["id"]).attr('uniqueid')).html('<option value="NA">NA</option>');
    if(chosenModel == "NA") {
        //Do Nothing
    } else {
        let sizeArr = [];
        for(let size in prodLists) {
            if(prodLists[size]["model"] == chosenModel) {
                sizeArr.push(prodLists[size]["size"]);
            }
        }
        let sizeUniqueArr = [... new Set(sizeArr)];
        let sizeOptHtml = '<option value="NA">NA</option>';
        for(let uniSize in sizeUniqueArr) {
            sizeOptHtml += '<option value="'+sizeUniqueArr[uniSize]+'">'+sizeUniqueArr[uniSize]+'</option>';
        }
        $("#size_"+$('#'+obj["id"]).attr('uniqueid')).html(sizeOptHtml);
    }
}

function onSizeChange(obj) {
    let chosenModel = $("#model_"+$('#'+obj["id"]).attr('uniqueid')).val();
    let chosenSize = $("#"+obj["id"]).val();
    $("#color_"+$('#'+obj["id"]).attr('uniqueid')).html('<option value="NA">NA</option>');
    $("#type_"+$('#'+obj["id"]).attr('uniqueid')).html('<option value="NA">NA</option>');
    if(chosenModel == "NA" || chosenSize == "NA") {
        //Do Nothing
    } else {
        let colorArr = [];
        for(let color in prodLists) {
            if(prodLists[color]["model"] == chosenModel) {
                colorArr.push(prodLists[color]["color"]);
            }
        }
        let sizeUniqueArr = [... new Set(colorArr)];
        let colorOptHtml = '<option value="NA">NA</option>';
        for(let uniColor in sizeUniqueArr) {
            colorOptHtml += '<option value="'+sizeUniqueArr[uniColor]+'">'+sizeUniqueArr[uniColor]+'</option>';
        }
        $("#color_"+$('#'+obj["id"]).attr('uniqueid')).html(colorOptHtml);
    }
}

function onColorChange(obj) {
    let chosenModel = $("#model_"+$('#'+obj["id"]).attr('uniqueid')).val();
    let chosenSize = $("#size_"+$('#'+obj["id"]).attr('uniqueid')).val();
    let chosenColor = $("#color_"+$('#'+obj["id"]).attr('uniqueid')).val();
    $("#type_"+$('#'+obj["id"]).attr('uniqueid')).html('<option value="NA">NA</option>');
    if(chosenModel == "NA" || chosenSize == "NA" || chosenColor == "NA") {
        //Do Nothing
    } else {
        let typeArr = [];
        let typeOptHtml = '<option value="NA">NA</option>';
        for(let type in prodLists) {
            if(prodLists[type]["model"] == chosenModel && prodLists[type]["size"] == chosenSize && prodLists[type]["color"] == chosenColor) {
                typeOptHtml += '<option value="'+prodLists[type]["type"]+'">'+prodLists[type]["type"]+'</option>';
            }
        }
        $("#type_"+$('#'+obj["id"]).attr('uniqueid')).html(typeOptHtml);
    }
}

function onDeletBtnClick(obj) {
    let chosenRow = $('#'+obj["id"]).attr('uniqueid');
    $("#tr_"+chosenRow).remove();
}

function onQuantityChange(obj) {
    let usrEnteredQuantity = parseInt($("#"+obj["id"]).val());
    if(usrEnteredQuantity == 0) {
        $("#"+obj["id"]).val("");
        $("#modelMsg").html("0 cannot be entered for quantity!!");
        $("#alertPopup").modal("show");
    }
}

function stockinBtnClick() {
    let billNumber = $("#bill_no").val();
    let billDate = $("#bill_date").val();
    let billAmt = $("#bill_amt").val();
    if(billNumber == "" || billDate == "" || billAmt == "") {
        $("#modelMsg").html("Please enter all mandatory fields!!");
        $("#alertPopup").modal("show");
        return;
    }

    let tblUniIdArr = [];
    $($('[id^="tr_"]')).each(function(trIndex) {
        tblUniIdArr.push($(this).attr("uniqueid"));
    });

    let stockInPayloadArr = [];
    for(let stock in tblUniIdArr) {
        let stockInPayloadObj = {};
        if($("#model_"+tblUniIdArr[stock]).val() == "NA") {
            $("#modelMsg").html("Please enter model for all rows!!");
            $("#alertPopup").modal("show");
            return;
        } else {
            stockInPayloadObj["model"] = $("#model_"+tblUniIdArr[stock]).val();
            if($("#size_"+tblUniIdArr[stock]).val() == "NA") {
                $("#modelMsg").html("Please enter size for all rows!!");
                $("#alertPopup").modal("show");
                return;
            } else {
                stockInPayloadObj["size"] = $("#size_"+tblUniIdArr[stock]).val();
                if($("#color_"+tblUniIdArr[stock]).val() == "NA") {
                    $("#modelMsg").html("Please enter color for all rows!!");
                    $("#alertPopup").modal("show");
                    return;
                } else {
                    stockInPayloadObj["color"] = $("#color_"+tblUniIdArr[stock]).val();
                    if($("#type_"+tblUniIdArr[stock]).val() == "NA") {
                        $("#modelMsg").html("Please enter type for all rows!!");
                        $("#alertPopup").modal("show");
                        return;
                    } else {
                        stockInPayloadObj["type"] = $("#type_"+tblUniIdArr[stock]).val();
                        if($("#quantity_"+tblUniIdArr[stock]).val() == "") {
                            $("#modelMsg").html("Please enter quantity for all rows!!");
                            $("#alertPopup").modal("show");
                            return;
                        } else {
                            stockInPayloadObj["quantity"] = $("#quantity_"+tblUniIdArr[stock]).val();
                            if($("#amount_"+tblUniIdArr[stock]).val() == "") {
                                $("#modelMsg").html("Please enter amount for all rows!!");
                                $("#alertPopup").modal("show");
                                return;
                            } else {
                                stockInPayloadObj["purchase_rate"] = $("#amount_"+tblUniIdArr[stock]).val();
                                stockInPayloadArr.push(stockInPayloadObj);
                            }
                        }
                    }
                }
            }

        }
    }

    let duplicateCheckerArr = [];
    for(let prodDate in stockInPayloadArr) {
        let chk_model = stockInPayloadArr[prodDate]["model"];
        let chk_size = stockInPayloadArr[prodDate]["size"];
        let chk_color = stockInPayloadArr[prodDate]["color"];
        let chk_type = stockInPayloadArr[prodDate]["type"];
        duplicateCheckerArr.push(chk_model+chk_size+chk_color+chk_type);
    }
    if(arrDuplicatesChecker(duplicateCheckerArr)) {
        $("#modelMsg").html("Duplicate product entries not allowed!!");
        $("#alertPopup").modal("show");
        return;
    }


        let transactionsPayloadObj = {};
        transactionsPayloadObj["date"] = billDate;
        transactionsPayloadObj["transaction_type"] = "Stock In";
        transactionsPayloadObj["bill_no"] = billNumber;
        transactionsPayloadObj["description"] = "Stock purchase";
        transactionsPayloadObj["income"] = 0;
        transactionsPayloadObj["expense"] = billAmt;
        transactionsPayloadObj["more_details"] = stockInPayloadArr;
        // 2. insert into transactions collection - transactionsPayloadObj
        genericApiCalls("POST", "/transactions", transactionsPayloadObj, transactionsSuccesscb, errorcb);
        function transactionsSuccesscb(data) {
            console.log(data);
            let prdCountPayloadArr = [];
            for(let countLoop in stockInPayloadArr) {
                let prdCountPayloadObj = {};
                prdCountPayloadObj["model"] = stockInPayloadArr[countLoop]["model"];
                prdCountPayloadObj["size"] = stockInPayloadArr[countLoop]["size"];
                prdCountPayloadObj["color"] = stockInPayloadArr[countLoop]["color"];
                prdCountPayloadObj["type"] = stockInPayloadArr[countLoop]["type"];
                prdCountPayloadObj["count"] = stockInPayloadArr[countLoop]["quantity"];
                prdCountPayloadArr.push(prdCountPayloadObj);
            }
            let prdCountPayload = {};
            prdCountPayload["updatedData"] = prdCountPayloadArr;
            // 3. update count in products collection
            genericApiCalls("POST", "/productCountUpdate", prdCountPayload, productCountSuccesscb, errorcb);
            function productCountSuccesscb(data) {
                $("#indexPgmodelMsg").html("Stock details updated successfuly!!");
                setTimeout(function(){
                    $("#indexPgRedirectionPopup").modal("show");
                }, 500);
            }
        }

}
