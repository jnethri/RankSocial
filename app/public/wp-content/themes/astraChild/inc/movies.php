<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

<?php
function rankGetMOV( $atts ){
    echo "FIRSTSTART" . get_user_meta( get_current_user_id(), 'rankFirstMOV', true) . "FIRSTEND";
    echo "SECONDSTART" . get_user_meta( get_current_user_id(), 'rankSecondMOV', true) . "SECONDEND";
    echo "THIRDSTART" . get_user_meta( get_current_user_id(), 'rankThirdMOV', true) . "THIRDEND";
    echo "FORTHSTART" . get_user_meta( get_current_user_id(), 'rankForthMOV', true) . "FORTHEND";
    echo "FIFTHSTART" . get_user_meta( get_current_user_id(), 'rankFifthMOV', true) . "FIFTHEND";
}

add_action( 'wp_ajax_rankGetMOV', 'rankGetMOV' );
add_action( 'wp_ajax_nopriv_rankGetMOV', 'rankGetMOV' );

function movies_func( $atts ){
    ob_start();
    ?>

    <script>
        let baseURL = 'https://api.themoviedb.org/3/';
        let configData = null;
        let baseImageURL = null;
        let APIKEY = 'aa580713a716db313e8787bd2efc7203';
        var globalOmitArr = [];
        var sourceElement;

        $( document ).ready(function() {
            $.ajax({
                type: 'GET',
                url: ajaxurl,
                data: {"action": "rankGetMOV"},
                success: function( data ){ 
                    $('#rankFirstMOV').attr( "data-id", data.match('(?<=FIRSTSTART)(.*)(?=FIRSTEND)' )[0] );
                    $('#rankSecondMOV').attr( "data-id", data.match('(?<=SECONDSTART)(.*)(?=SECONDEND)' )[0] );
                    $('#rankThirdMOV').attr( "data-id", data.match('(?<=THIRDSTART)(.*)(?=THIRDEND)' )[0] );
                    $('#rankForthMOV').attr( "data-id", data.match('(?<=FORTHSTART)(.*)(?=FORTHEND)' )[0] );
                    $('#rankFifthMOV').attr( "data-id", data.match('(?<=FIFTHSTART)(.*)(?=FIFTHEND)' )[0] );
                }
            });
        });

        let draggableInit = function () {

            $(".targetclass").draggable( {
                opacity: .4,
                revert: true,
                create: function(){
                    $(this).data('position',$(this).position());
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
                    //Sets item ID for image
                    $(this)[0].dataset.id = ui.draggable[0].dataset.id;
                    if ( sourceElement && sourceElement != '#undefined' && sourceElement != '#' + $(this).next().next().find('button')[0].id ){
                        $( sourceElement ).trigger('click', event);
                    }
                    let rankArray = [$(this)[0].id, ui.draggable[0].dataset.id]; //[RankFirstMOV, 6306]
                    
                    $.ajax({
                        url: "/rankpost/",
                        method: "POST",
                        data: {
                            ranking : rankArray
                        }
                    })
                    ui.draggable.position({
                        my: "center",
                        at: "center",
                        of: $(this),
                        using: function(pos) {
                            $(this).animate(pos, 0, "linear");
                        }
                    });
                    ui.draggable.remove();
                },
                tolerance: "pointer"
            });
        }

        let getConfig = function () {
            let url = "".concat(baseURL, 'configuration?api_key=', APIKEY);
            fetch(url)
            .then((result)=>{
                return result.json();
            })
            .then((data)=>{
                baseImageURL = data.images.secure_base_url;
                configData = data.images;
            })
            .catch(function(err){
                alert(err);
            });
            $('.btnDel').click(function(event){
                console.log('yo');
                rankedMovieId = parseInt( $(this)[0].dataset.id, 10);
                var delIndex = globalOmitArr.indexOf( rankedMovieId );
                if(delIndex != -1){
                    globalOmitArr.splice(delIndex, 1);
                }

                let rankArray = [$(this).parent().prev().prev().attr('id'), 'NULL'];
                $.ajax({
                    url: "/rankpost/",
                    method: "POST",
                    data: {
                        ranking : rankArray
                    }
                })

                $(this).attr("data-id", '');
                $(this).parent().prev().prev().attr("data-id", '');

                $(this).parent().prev().html('');
                $(this).parent().prev().prev().html('');

                search();
            });
        }

        let runSearch = function (keyword) {
            let url = ''.concat(baseURL, 'search/movie?api_key=', APIKEY, '&query=', keyword, '&include_adult=false');

            if(keyword){
                fetch(url)
                .then(result=>result.json())
                .then((data)=>{
                    if( data.results ){
                        // Filter out items in Ranking list
                        data.results = data.results.filter(function(item) {
                            for (let i = 0; i < globalOmitArr.length; i++) {
                                if (item.id === globalOmitArr[i]){
                                    return false;
                                }
                            }
                            return true;
                        });
                        data.results.splice(10,19);
                        // Process the returned data
                        let tableBuffer = "<thead><tr><th style='width:10%;'>Poster</th><th style='width:10%;'>Title</th><th style='width:70%;'>Overview</th><th style='width:12%;text-align:center;'>Release Date</th><th style='width:8%;text-align:center;'>Average Rating</th></tr></thead><tbody>";
                        for (var i = 0; i < data.results.length; i++) {
                            var obj = data.results[i];
                            tableBuffer += "<tr>"
                            + "<td class='droppable'><img class='targetclass' src='https://image.tmdb.org/t/p/w185" + obj['poster_path'] + "' data-id='" + obj['id'] + "'></td>"
                            + "<td style='text-align:center;'>" + obj['original_title'] + "</td>"
                            + "<td>" + obj['overview'] + "</td>"
                            + "<td style='text-align:center;'>" + obj['release_date'] + "</td>"
                            + "<td style='text-align:center;'>" + obj['vote_average'] + "</td>"
                            + "</tr>";
                        }
                        tableBuffer += "</tbody>";
                        $('#output').html(tableBuffer);
                        // Work with results array...
                    } else {
                        $('#output').html("");
                    }

                    draggableInit();
                })
            }
        }

        // document.addEventListener('DOMContentLoaded', getConfig)

        function search() {
            var input = document.getElementById("movieQuery");
            if(input){
                input.addEventListener('keyup',runSearch(input.value));
            }
        }

        window.addEventListener('DOMContentLoaded', (event) => {
            var observer = new MutationObserver(function(mutations) {
                for (let i = 0; i < mutations.length; i++) {
                    let div = $('#' + mutations[i].target.id);

                    let movieId = div[0].dataset.id;
                    let url = ''.concat(baseURL, 'movie/', movieId, '?api_key=', APIKEY);
                    console.log(div);
                    
                    fetch(url)
                    .then(result=>result.json())
                    .then((data)=>{
                        if(data.poster_path){
                            console.log(url);
                            div.html("<img class='targetclass' style='max-width: 100%; height: 100%;' src='https://image.tmdb.org/t/p/w185" + data.poster_path + "' data-id='" + data.id + "'/>");
                        }

                        draggableInit();

                        div.next().html(data.title);

                        div.next().next().children("button").attr("data-id", data.id);

                        if (!globalOmitArr.includes(data.id)) {
                            globalOmitArr.push(data.id);
                        }
                        //remove item from api list when moved to ranking
                        search();
                    })
                }
            });

            observer.observe(document.getElementById("rankFirstMOV"), {
                attributeFilter: ['data-id']
            });
            observer.observe(document.getElementById("rankSecondMOV"), {
                attributeFilter: ['data-id']
            });
            observer.observe(document.getElementById("rankThirdMOV"), {
                attributeFilter: ['data-id']
            });
            observer.observe(document.getElementById("rankForthMOV"), {
                attributeFilter: ['data-id']
            });
            observer.observe(document.getElementById("rankFifthMOV"), {
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
                        <td id="rankFirstMOV" class="droppable" data-id=""></td>
                        <td></td>
                        <td><button id="btnDel1" class="btnDel" data-id=""><i class="fa fa-close"></i></button></td>
                    </tr>
                    <tr class='spaces'>
                        <td>2</td>
                        <td id="rankSecondMOV" class="droppable" data-id=""></td>
                        <td></td>
                        <td><button id="btnDel2" class="btnDel" data-id=""><i class="fa fa-close"></i></button></td>
                    </tr>
                    <tr class='spaces'>
                        <td>3</td>
                        <td id="rankThirdMOV" class="droppable" data-id=""></td>
                        <td></td>
                        <td><button id="btnDel3" class="btnDel" data-id=""><i class="fa fa-close"></i></button></td>
                    </tr>
                    <tr class='spaces'>
                        <td>4</td>
                        <td id="rankForthMOV" class="droppable" data-id=""></td>
                        <td></td>
                        <td><button id="btnDel4" class="btnDel" data-id=""><i class="fa fa-close"></i></button></td>
                    </tr>
                    <tr class='spaces'>
                        <td>5</td>
                        <td id="rankFifthMOV" class="droppable" style="object-fit: contain;" data-id=""></td>
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
        <h1>Using TheMovieDB.org API v3</h1>
        <table id="output">
        </table>
    <?php
    return ob_get_clean();
}
add_shortcode( 'movies', 'movies_func' );
?>