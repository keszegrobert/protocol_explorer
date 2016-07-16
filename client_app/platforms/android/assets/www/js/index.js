$(document).ready(function(){
    jQuery.getJSON("protocols.json", function(data){    
        elements = ''; 
        for (counter in data.protocols)
        {
            p = data.protocols[counter];
            elements += '<li><a href="#'+counter+'">'+p.name+'</a></li>';
        }
        $('#lst_protocol').html(elements).listview("refresh");
    });
});