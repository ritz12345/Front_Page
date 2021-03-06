$(document).ready(function () {
    $('#myTable_safety').DataTable({
         createdRow  : function(row,data,index){
             console.log(data[8]);
             
            if(data[8] == "0000-00-00"){

              $(row).css('color','red')
            }
        },
         rowCallback : function( row, data, index ) {
                      $(row).click(function(row, data, index){
                        var myModalIDs = ["idin", "reportin","date_postedin","alertsevin","plantin","deptind","areain","injuryin","date_closedin"];
                      for (var i=0; i<data.length; i++)
                        {
                            $('#' + myModalIDs[i]).val(data[i])
                        }

                        $("#myModal2").modal("show");
                      }.bind(this, row, data, index));
                      },
         processing :   true,
         ordering   :   true,
         serverSide :   true,
         pageLength :   10,
         paginate   :   true,
         searching  :   true,
         ajax       :"/some_data_safety"
    });

     $("#edit_safety").click(function(){
         var idin=$("#idin").val(), 
         reportin =$("#reportin").val(),
         date_postedin=$("#date_postedin").val(),
         alertsevin=$("#alertsevin").val(),
         plantin=$("#plantin").val(),
         deptin=$("#deptin").val(),
         areain=$("#areain").val(),
         injuryin=$("#injuryin").val(),
         date_closedin=$("#date_closedin").val();
        

          var update_data = {idin,reportin,date_postedin,alertsevin,plantin,deptin,areain,injuryin,date_closedin};
        
         $.ajax({
          url         :"/update_cell_safety",
          type        : "POST",
          contentType : "application/json",
          data        : JSON.stringify(update_data),
          processData : false
        }); 
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
    $("#submit_safety").click(function(){
        var date_posted =$("#date_posted").val(),
        report_id   =$("#report_id").val(),
        plant   =$("#plant").val(),
        department=$("#department").val(),
        area =$("#area").val(),
        alertsev=$("#alertsev").val(),
        category=$("#category").val(),
        injury =$("#injury").val(),
        osha =$("#osha").val(),
        alert =$("#alert").val(),
        issue =$("#issue").val(),
        corrective =$("#corrective").val(),
        comments=$("#comments").val(),
        date_closed=$("#date_closed").val();
        var new_data  = {date_posted,report_id,plant,department,area,alertsev,category,injury,osha,alert,issue,corrective,comments,date_closed};
        console.log(new_data);
        $.ajax({
                url         :"/insert_cell_safety",
                type        : "POST",
                contentType : "application/json",
                data        : JSON.stringify(new_data),
                processData : false
        });
      })
})
