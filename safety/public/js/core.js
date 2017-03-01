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


    $("#addNewData_safety").click(function(){
         $.ajax({
            url: "/alert_severity",
            type:"GET",
            contentType:"application/json",
            processData: false,
            complete:function(data){
                var alert =[];
                var data = JSON.parse(data.responseText);
                console.log(data);
                for (var i = 1; i < data.length; i++) {
                    alert[i] =data[i].alert_sev; 
                } 
                var st="";
                for (var i = 1; i < alert.length; i++) {
                  st += "<option>" + alert[i]+ "</option>";
                }
                $("#alertsev").html( st );  

            }
         })
          $.ajax({
            url: "/injury_type",
            type:"GET",
            contentType:"application/json",
            processData: false,
            complete:function(data){
                var injury =[];
                var data = JSON.parse(data.responseText);
                console.log(data);
                for (var i = 1; i < data.length; i++) {
                    injury[i] =data[i].injury_type; 
                } 
                var st="";
                for (var i = 1; i < injury.length; i++) {
                  st += "<option>" + injury[i]+ "</option>";
                }
                $("#injury").html( st );  

            }
         })




         $("#plant").change(function(){
         var st="";
         if($("#plant").val()=="GR"){
           console.log($("#plant").val())
           st+= "<option> Mixing</option>";
           st+="<option>Cementing</option>";
           st+="<option>Automation</option>"
          }else {
           st+="<option>Cementing</option>";
           st+="<option>Assembly </option>";
           st+="<option>Molding</option>";
           st+="<option>Automation</option>";
          }
         $("#department").html(st);
        })
    })
})
