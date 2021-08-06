let nodeApiURL = "http://127.0.0.1:3000";

$( document ).ready(function() {
    let popupsHtml = `<div id="loadingPopup" class="modal fade" role="dialog" data-keyboard="false" data-backdrop="static" style="margin-top: 15%;">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-body">
                                Loading.. Please wait!!
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="alertPopup" class="modal fade" role="dialog" data-keyboard="false" data-backdrop="static" style="margin-top: 15%;">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div id="modelMsg" class="modal-body"></div>
                                <div class="modal-footer" style="padding: 1%;">
                                    <button type="button" class="btn btn-danger" data-dismiss="modal">
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="indexPgRedirectionPopup" class="modal fade" role="dialog" data-keyboard="false" data-backdrop="static" style="margin-top: 15%;">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div id="indexPgmodelMsg" class="modal-body"></div>
                                <div class="modal-footer" style="padding: 1%;">
                                    <button onclick="function go(){window.location.href='index.html';}go();" type="button" class="btn btn-danger" data-dismiss="modal">
                                        OK
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>`;
    $("body").append(popupsHtml);
});

function genericApiCalls(type, path, payload, successcb, errorcb) {
    $("#loadingPopup").modal("show");
    let payloadData = JSON.stringify(payload);
    let URLData = nodeApiURL + path
    $.ajax({
        type: type,
        url: URLData,
        contentType: 'application/json',
        dataType: "json",
        data: payloadData,
        success: successcb,
        error: errorcb
    });
}

function errorcb(jqXHR, textStatus, errorThrown) {
    console.log(jqXHR);
    console.log(textStatus);
    console.log(errorThrown);
    $("#indexPgmodelMsg").html("Something went wrong.. Please try later!!");
    setTimeout(function(){ 
        $("#indexPgRedirectionPopup").modal("show");
    }, 500);
}