$(document).ready(function () {

    $('#myTable_safety').DataTable({
         processing :   true,
         ordering   :   true,
         serverSide :   true,
         pageLength :   10,
         paginate   :   true,
         searching  :   true,
         ajax       :"/some_data_safety"
    });


    $("addNewdata_safety").click(function(){
        
    })
    
    
      
})
