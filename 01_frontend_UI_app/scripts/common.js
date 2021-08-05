let nodeApiURL = "http://127.0.0.1:3000";

function genericApiCalls(type, path, payload, successcb, errorcb) {
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
    alert("Something went wrong.. Please try later!!");
    window.location.href = 'index.html';
    console.log(jqXHR);
    console.log(textStatus);
    console.log(errorThrown);
}