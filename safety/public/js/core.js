$(document).ready(function () {

    $('#myTable_safety').DataTable({
        // rowCallback : function( row, data, index ) {
        //               $(row).click(function(row, data, index){
        //                 var myModalIDs = ["idin","datein", "codein", "namein" ,"hoursin"];
        //                 for (var i=0; i<data.length; i++)
        //                 {
        //                     $('#' + myModalIDs[i]).val(data[i])
        //                 }

        //                 $("#myModal2").modal("show");
        //               }.bind(this, row, data, index));
        //               },
         processing :   true,
         ordering   :   true,
         serverSide :   true,
         pageLength :   10,
         paginate   :   true,
         searching  :   true,
         ajax       :"/some_data_safety"
         
        });
    // $("#edit_labor").click(function(){
    //    var id               = $("#idin").val();
    //    var newdateid        = $("#datein").val();
    //    var newcodeid        = $("#codein").val();
    //    var newnameid        = $("#namein").val();
    //    var newhoursid       = $("#hoursin").val();
    
       
    //    var updated_data  = {id,newdateid,newcodeid,newnameid,newhoursid};
    //    console.log(updated_data);
    //      $.ajax({
    //            url         :"/update_cell_labor",
    //            type        : "POST",
    //            contentType : "application/json",
    //            data        : JSON.stringify(updated_data),
    //            processData : false
    //          });
    // });

    // $("#submit_labor").click(function(){
    //     var date =$("#datebox").val();
        
    //     console.log(typeof(date));
    //     var code   = [];
    //     var name   = [];
    //     var hours  = [];
    //     for (var i=0;i<9;i++){
    //       code.push($("#code_"+i).text());
    //       name.push($("#name_"+i).text());
    //       hours.push($("#hour_"+i).val());
    //     }
         
    
    //     var new_data  = {date, code,name,hours};
        
    //     $.ajax({
    //             url         :"/insert_cell_labor",
    //             type        : "POST",
    //             contentType : "application/json",
    //             data        : JSON.stringify(new_data),
    //             processData : false
    //     });
    

    // });
      
})
