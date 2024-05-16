<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

<link rel="stylesheet" href="https://pagination.js.org/dist/2.1.5/pagination.min.js">

<?php

function games_func( $atts ){
    ob_start();
    ?>
    
    <script>
        let baseURL = 'http://localhost:3000';
        let configData = null;
        let baseImageURL = null;
        let clientID = '9duzyvi1tja7b54ih6un160it2zqx2';
        let Auth = 'Bearer chmweebsimv03cfnoth4407ygni4c0';

        var globalOmitArr = [];
        var sourceElement;
    
        
        let getConfig = function () {
            let url = baseURL;

            // https://api.igdb.com/v4/games/?search=Stalker&fields=*&limit=10&id=101440

            // https://api.themoviedb.org/3/configuration?api_key=aa580713a716db313e8787bd2efc7203

            fetch( baseURL )
            .then( res => res.json() )
            .then( data => {
                return data.json;
            })

            // fetch(url, {method: "POST", headers: {'Client-ID': clientID, 'Authorization': Auth}})
            // .then((result)=>{
            //     alert(result);
            //     return result.json();
            // })
            // .catch(function(err){
            //     alert(err);
            // });  

            $('.btnDel').click(function(event){
                rankedMovieId = parseInt( $(this)[0].dataset.id, 10);
                var delIndex = globalOmitArr.indexOf( rankedMovieId );

                if(delIndex != -1){
                    globalOmitArr.splice(delIndex, 1);
                }

                $(this).parent().prev().html('');
                $(this).parent().prev().prev().html('');

                search();
            });
        }
    
        let runSearch = function (keyword) {
            let url = baseURL; // + "?fields=*,cover.image_id,release_dates.human&search=" + keyword;

            fetch( url, { method: "POST", body: keyword } )
            .then( res => console.log(res) )
            .then( data => {
                // console.log(data[0].release_dates[0]);
                if( data ){
                    console.log(data);
                    // Filter out items in Ranking list
                    data = data.filter(function(item) {
                        for (let i = 0; i < globalOmitArr.length; i++) {
                            if (item.id === globalOmitArr[i]){
                                return false;
                            }
                        }
                        return true;
                    });
                    data.splice(10,19);

                    // Process the returned data
                    let tableBuffer = "<thead><tr><th style='width:10%;'>Poster</th><th style='width:10%;'>Title</th><th style='width:70%;'>Overview</th><th style='width:12%;text-align:center;'>Release Date</th><th style='width:8%;text-align:center;'>Average Rating</th></tr></thead><tbody>";
                    for (var i = 0; i < data.length; i++) {
                        var obj = data[i];

                        if(typeof data[i].release_dates !== 'undefined') {
                            var gDate = obj.release_dates[0].human;
                        } else {
                            var gDate = 'N/A';
                        }
                        if(typeof obj['cover'] !== 'undefined') {
                            var gImage = obj['cover'].image_id;
                        } else {
                            // TODO: placeholder
                            var gImage = 'undefined';
                        }

                        tableBuffer += "<tr>"
                        + "<td class='droppable'><img class='targetclass' src='https://images.igdb.com/igdb/image/upload/t_cover_big/" + gImage + ".jpg' data-id='" + obj['id'] + "'></td>"
                        + "<td style='text-align:center;'>" + obj.name + "</td>"
                        + "<td>" + obj.summary + "</td>"
                        + "<td style='text-align:center;'>" + gDate + "</td>"
                        + "<td style='text-align:center;'>" + (Math.round(obj.total_rating * 10) / 100).toFixed(1) + "</td>"
                        + "</tr>";
                    }
                    tableBuffer += "</tbody>";
                    $('#output').html(tableBuffer);
                    // Work with results array...
                } else {
                    $('#output').html("");
                }

                $(".targetclass").draggable( {
                    opacity: .4,
                    revert: 'invalid',
                    create: function(){
                        $(this).data('position',$(this).position())
                    },
                    cursorAt:{left:0, top:0},
                    cursor:'move',
                    start:function(event, ui){
                        sourceElement = "#" + $(this).parent().next().next().find('button').attr('id');
                        $(this).stop( true, true );
                    }
                });

                $('.droppable').droppable({
                    drop:function(event, ui){
                        var $this = $(this);

                        $(this)[0].dataset.id = ui.draggable[0].dataset.id;

                        if ( sourceElement ){
                            $(sourceElement).trigger('click', event);
                        }

                        ui.draggable.position({
                            my: "center",
                            at: "center",
                            of: $this,
                            using: function(pos) {
                                $(this).animate(pos, 0, "linear");
                            }
                        });

                        ui.draggable.remove();
                    }
                });
            })
        }
    
        document.addEventListener('DOMContentLoaded', getConfig)

        function search() {
            var input = document.getElementById("movieQuery");
            if(input){
                input.addEventListener('keyup',runSearch(input.value));
            }
        }

        window.addEventListener('DOMContentLoaded', (event) => {
            var observer = new MutationObserver(function(mutations) {

                var div = $('#' + mutations[0].target.id);

                let gameId = div[0].dataset.id;
                console.log(div[0].dataset);

                let url = baseURL;

                fetch(url)
                .then(result=>result.json())
                .then((data)=>{
                    console.log(data);
                    div.html("<img class='targetclass' style='max-width: 100%; height: 100%;' src='https://images.igdb.com/igdb/image/upload/t_cover_big/" + data.image_id + ".jpg' data-id='" + data.id + "'/>");

                    div.next().html(data.title);

                    div.next().next().children("button").attr("data-id", data.id);

                    if (!globalOmitArr.includes(data.id)) {
                        globalOmitArr.push(data.id);
                    }
                    
                    //remove item from api list when moved to ranking
                    search();
                })
            });

            observer.observe(document.getElementById("rankFirst"), {
                attributeFilter: ['data-id']
            });
            observer.observe(document.getElementById("rankSecond"), {
                attributeFilter: ['data-id']
            });
            observer.observe(document.getElementById("rankThird"), {
                attributeFilter: ['data-id']
            });
            observer.observe(document.getElementById("rankForth"), {
                attributeFilter: ['data-id']
            });
            observer.observe(document.getElementById("rankFifth"), {
                attributeFilter: ['data-id']
            });
        });

    </script>



        <div>
            <table style="border: 3px solid #ddd;">
                <colgroup>
                    <col span="1" style="width: 5%;">
                    <col span="1" style="width: 15%;">
                    <col span="1" style="width: 80%;">
                </colgroup>
                <thead>
                    <th></th>
                    <th>RANKING</th>
                    <th>TITLE</th>
                </thead>
                <tbody style="text-align: center;">
                    <tr class='spaces' style="max-height:100px">
                        <td>1</td>
                        <td id="rankFirst" class="droppable" data-id=""></td>
                        <td></td>
                        <td><button id="btnDel1" class="btnDel" data-id=""><i class="fa fa-close"></i></button></td>
                    </tr>
                    <tr class='spaces'>
                        <td>2</td>
                        <td id="rankSecond" class="droppable" data-id=""></td>
                        <td></td>
                        <td><button id="btnDel2" class="btnDel" data-id=""><i class="fa fa-close"></i></button></td>
                    </tr>
                    <tr class='spaces'>
                        <td>3</td>
                        <td id="rankThird" class="droppable" data-id=""></td>
                        <td></td>
                        <td><button id="btnDel3" class="btnDel" data-id=""><i class="fa fa-close"></i></button></td>
                    </tr>
                    <tr class='spaces'>
                        <td>4</td>
                        <td id="rankForth" class="droppable" data-id=""></td>
                        <td></td>
                        <td><button id="btnDel4" class="btnDel" data-id=""><i class="fa fa-close"></i></button></td>
                    </tr>
                    <tr class='spaces'>
                        <td>5</td>
                        <td id="rankFifth" class="droppable" style="object-fit: contain;" data-id=""></td>
                        <td></td>
                        <td><button id="btnDel5" class="btnDel" data-id=""><i class="fa fa-close"></i></button></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div>
            <label for="movieQuery">Search: </label>
            <input type="text" id="movieQuery" name="movieQuery" style="width: 100%" autocomplete="off" onkeyup="search()"><br><br>
        </div>
        <h1>Using IGDB.com API v4</h1>
        <table id="output">
        </table>
    <?php

    return ob_get_clean();
}

add_shortcode( 'games', 'games_func' );

?>

