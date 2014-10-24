$( document ).ready(function(){

    NProgress.configure({ ease: 'ease', speed: 500 });
    NProgress.start();

    $(document).tooltip({
      content: function () {
          return $(this).prop('title');
      },
      show: { duration: 200 }
    });

    var counter=0;

    $.getJSON("data/tests/bridge_reachability/per_bridge/data.json", function(report_data){

        $.each(report_data, function(cc, bridges) {

            if(Object.getOwnPropertyNames(bridges).length != 0){

                // for every country

                $("#bridge_results").append("<div class='country "+cc+"'>");
                $("."+cc).append("<h3>"+cc+"</h3>");

                $.each(bridges, function(key, reports) {

                    // for each bridge in the country
                    $("."+cc).append("<div class='bridge_title'>"+key+"</div>")
                    $("."+cc).append("<div class='bridge_result bridge"+counter+"'>")

                    reports.sort(function(a, b) {
                        return new Date(a.start_time) - new Date(b.start_time);
                    })

                    for(i=0; i<reports.length; i++){

                        // for all the reports of each bridge in this country

                        if(reports[i].success){
                            var color_class = "yes";
                        }
                        if(!reports[i].success){
                            var color_class = "no";
                        }
                        if(typeof(reports[i].start_time) == "undefined"){
                            var color_class = "probably_no";
                        }
                        var label = "<div class='tooltip_date'>"+new Date(reports[i].start_time*1000)+"</div>";

                        $.each(reports[i], function(k, v) {
                            label += "<li>"
                            label += k+ " : "+v
                            label += "</li>"
                        })
                        var full_url = reports[i].file_url
                        var entry = $("<div onclick='window.open(\""+full_url+"\")' title='' class='result_item result_entry "+counter+" "+color_class+"'></div>");
                        $(".bridge"+counter).append(entry)
                        $(entry).prop('title', label);
                        if(i%15 == 0){
                            $(".bridge"+counter).append("<div style='margin-left:"+i*6.2+"px' class='date_indicator'>"+new Date(reports[i].start_time*1000).yyyymmdd()+"</div>")
                        }

                    }

                    $("."+cc).append("<hr />")
                    counter+=1;
                });
            }

            $("#bridge_results").append("</div>")

        });

        NProgress.done();

    });


})

Date.prototype.yyyymmdd = function() {
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
    var dd  = this.getDate().toString();
    return yyyy + "-" + (mm[1]?mm:"0"+mm[0]) + "-"+ (dd[1]?dd:"0"+dd[0]); // padding
};