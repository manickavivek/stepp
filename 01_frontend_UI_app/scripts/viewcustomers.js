$( document ).ready(function() {

    let payload = {};
    genericApiCalls("GET", "/getCustomerDatabase", payload, getCustomersSuccesscb, errorcb)

    function getCustomersSuccesscb(data) {
        setTimeout(function(){ 
            $("#loadingPopup").modal("hide");
        }, 500);
        console.log(data);

        let dataSet = [];
        let dataSetRec = [];
        let dbData = data["response"];
        for(let record in dbData) {
            dataSetRec = [];
            dataSetRec.push(dbData[record]["_id"]);
            dataSetRec.push(dbData[record]["bill_no"]);
            dataSetRec.push(dbData[record]["customer_name"]);
            dataSetRec.push(dbData[record]["customer_phone"]);
            dataSetRec.push(dbData[record]["customer_address"]);
            dataSet.push(dataSetRec);
        }

        if(dataSet.length == 0) {
            $("#indexPgmodelMsg").html("No data available!!");
            setTimeout(function(){ 
                $("#indexPgRedirectionPopup").modal("show");
            }, 500);
        }

        $('#cust_inventory_tbl').DataTable( {
            data: dataSet,
            columnDefs: [
                {
                    targets: [ 1 ], // Start with the last
                    render: function ( data, type, row, meta ) {
                        data = '<a target="_blank" href="stocksalebill.html?id='+row[0]+'">'+row[1]+'</a>';
                        return data;
                    }
                },
                {
                    "targets": [ 0 ],
                    "visible": false
                }
            ],
            columns: [
                { title: "ID", width: '10%', className: "text-center" },
                { title: "Bill No", width: '10%', className: "text-center" },
                { title: "Name", width: '10%', className: "text-center" },
                { title: "Phone", width: '10%', className: "text-center" },
                { title: "Address", width: '60%', className: "text-center" }
            ]
        } );
    }
});