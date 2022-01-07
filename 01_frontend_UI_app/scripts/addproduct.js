$( document ).ready(function() {
    genericApiCalls("GET", "/getSizes", "", getSizesSuccesscb, errorcb);
    function getSizesSuccesscb(sizeData) {
        console.log(sizeData);
        let sizeOpt = "";
        for(let size in sizeData["response"]) {
            sizeOpt += "<option value='"+sizeData["response"][size]+"'>"+sizeData["response"][size]+"</option>";
        }
        $("#size").html(sizeOpt);
        $("#loadingPopup").modal("hide");
        setTimeout(function(){
            genericApiCalls("GET", "/getColors", "", getColorsSuccesscb, errorcb);
            function getColorsSuccesscb(colorData) {
                console.log(colorData);
                let colorOpt = "";
                for(let color in colorData["response"]) {
                    colorOpt += "<option value='"+colorData["response"][color]+"'>"+colorData["response"][color]+"</option>";
                }
                $("#color").html(colorOpt);
                $("#loadingPopup").modal("hide");
            }
        }, 500);
    }
});

function addProductBtnClick() {

    let model = ($("#model").val()).trim();
    let size = $("#size").val();
    let color = $("#color").val();
    let type = $("#type").val();

    if(model == "") {
        $("#modelMsg").html("Enter all mandatory inputs!!");
        $("#alertPopup").modal("show");
        return;
    }

    let confirmation = confirm("Are you sure to add the product??");
    if (confirmation == false) {
        return;
    }

    let addPrdPayload = {};
    addPrdPayload["model"] = model;
    addPrdPayload["size"] = size;
    addPrdPayload["color"] = color;
    addPrdPayload["type"] = type;
    addPrdPayload["count"] = 0;

    console.log("Calling addProduct API..");
    genericApiCalls("POST", "/product", addPrdPayload, addPrdSuccesscb, errorcb);

    function addPrdSuccesscb(data) {
        if(data["response"] == "Product Added!!" || data["response"] == "Product Already Exist!!") {
            console.log(data["response"]);
            $("#indexPgmodelMsg").html(data["response"]);
            setTimeout(function(){
                $("#indexPgRedirectionPopup").modal("show");
            }, 500);
        } else {
            $("#modelMsg").html("Product Adding Failed!!");
            setTimeout(function(){
                $("#alertPopup").modal("show");
            }, 500);
        }
    }
}
