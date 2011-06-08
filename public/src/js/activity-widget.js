(function() {
    /**
     * Github Activity Widget
     * @class Activity
     */
    
    var renderEvent = function( event ) {
        
//        if ( !event.public ) { return }
        
        var render = "<li class=\"clearfix\">";
            // Avatar
            render += "<img class=\"avatar\" src=\"http://www.gravatar.com/avatar/" + event.actor.gravatar_id + "?s=30\" hspace=\"3\" vspace=\"3\" /><p>" ;
        
        switch (event.type) {
            case "IssueCommentEvent":

                render += event.actor.login + " has commented: <ul><li><cite id=\""+event.payload.comment_id+"\" class=\"comment\"></cite></li></ul>";

                $.getJSON( event.repo.url + "/issues/comments/" + event.payload.comment_id + "?callback=?", function(comment) {
                  $("#"+event.payload.comment_id+".comment").append( comment.data.body );
                });

                /* The API Wont giveme the related issue number, aleready reported: 
                $.getJSON( event.repo.url + "/issues/", function(issue) {
                  //$("#"+event.payload.issue_id+".issueComment").html(issue.data.body);
                  console.log("#"+event.payload.issue_id+".issue");
                });
                */
                break;            
            case "CreateEvent":

                render += event.actor.login + " has created a new " + event.payload.ref_type + ": " + event.payload.ref + ".</p> <ul><li>on branch " + event.payload.master_branch + "</li></ul>";
    
                break;

            case "IssuesEvent":
            
                render += event.actor.login + " has " + event.payload.action + " an issue.</p> <ul id=\"issue" + event.payload.action + event.payload.number + "\"></ul>";
    
                $.getJSON( event.repo.url + "/issues/" + event.payload.number + "?callback=?", function( issue ) {
                
                    var labels = "";
                    $(issue.data.labels).each( function( i, e ) {

                        var style = "background-color: #" + e.color;
                            style = ( e.color === "e10c02" ) ? "color:#eee;"+style : style ;
                            
                        labels += "<span class=\"issueLabel\" style=\"" + style + "\">" + e.name + "</span>";
                    });
                        
                    $("#issue" + event.payload.action + event.payload.number)
                        .append( "<li><a href=\"" + issue.data.html_url + "\">" + issue.data.title + "</a></li>" )
                        .append( "<li>" + labels + "</li>" );
                });
                
                break;
            
            case "WatchEvent":    

                render += event.actor.login + " " + event.payload.action + " to watch Chico-UI's repository on Github.";
            
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
    
                render += "<p>" + event.actor.login + " has " + event.payload.action + " a pull request.</p>" ;
                render += "<ul><li>#" + event.payload.number + " " + event.payload.pull_request.title + "</li>";
                render += "<li>with " + event.payload.pull_request.commits + " commits</li>";
                render += "<li> + " + event.payload.pull_request.additions + " additions</li>";
                render += "<li> - " + event.payload.pull_request.deletions + " deletions</li></ul>";
                break;
            
            default:
                render += "Undefined?";
                break;
        }
        
        render += "</li>";
        
        return render;
        
    }
    
    $(".activity").append("<h3>Github activity:</h3>").append("<li class=\"loading\">");
    
    $.getJSON( "https://api.github.com/repos/mercadolibre/chico/events?callback=?" , function(github) {
        
        $(".activity .loading").remove();
        
        var ul = $("<ul>"), i = 0, t = github.data.length, render = "";

        for ( i ; i < t ; i ++) {
            
            render += renderEvent( github.data[i] );
        }
        
        $(render).appendTo(ul);
        
        $(".activity").append(ul);

    });

})($);
