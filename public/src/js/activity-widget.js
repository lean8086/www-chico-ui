(function() {
    /**
     * Github Activity Widget
     * @class Activity
     */
    var i = 0,
    
    ul = $("<ul>"),
    
    renderEvent = function( event ) {
        
//        if ( !event.public ) { return }
        
        var render = "<li class=\"clearfix\">";
            // Avatar
            render += "<img class=\"avatar\" src=\"http://www.gravatar.com/avatar/" + event.actor.gravatar_id + "?s=30\" hspace=\"3\" vspace=\"3\" /><p>" ;
        
        switch (event.type) {
        
            case "IssuesEvent":
            
                render += event.actor.login + " has " + event.payload.action + " issue #" + event.payload.number + ".";
            
                break;
            
            case "WatchEvent":    

                render += event.actor.login + " " + event.payload.action + " to watch the repo.";
            
                break;
            
            case "PushEvent":

                render += event.actor.login + " pushed " + event.payload.size + " commit" + ( (event.payload.size > 1) ? "s." : ".") ;
                
                render += "<ul>";
                
                var e = 0;
                
                for ( e ; e < event.payload.size ; e ++) {
                    render += "<li>"+event.payload.shas[e][2]+"</li>";
                }
                
                render += "</ul>";
                
                break;
                        
            case "PullRequestEvent":
            
                render += event.actor.login + " " + event.payload.action + " a pull request." ;
                
                break;
            
            default:
                return;
                break;
        }
        
        render += "</p></li>";
        
        i++;
        
        return render;
        
    }
    
    $(".activity").append("<h3>Github activity:</h3>").append("<li class=\"loading\">");
    
    $.getJSON( "https://api.github.com/repos/mercadolibre/chico/events?callback=?" , function(github) {        
        
        
        $(".activity .loading").remove();
        
        $( renderEvent( github.data[i] ) ).appendTo(ul);
        $( renderEvent( github.data[1] ) ).appendTo(ul);
        $( renderEvent( github.data[2] ) ).appendTo(ul);
        $( renderEvent( github.data[3] ) ).appendTo(ul);
        $( renderEvent( github.data[4] ) ).appendTo(ul);        
        ul.appendTo(".activity");

    });

})($);
