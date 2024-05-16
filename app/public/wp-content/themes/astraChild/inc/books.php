<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

<?php

function books_func( $atts ){
    ob_start();
    ?>
    
    <script>
        let baseURL = 'https://api.themoviedb.org/3/';
        let configData = null;
        let baseImageURL = null;
        let APIKEY = 'aa580713a716db313e8787bd2efc7203';

        var globalOmitArr = [];
        var sourceElement;
    
        
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
            let url = ''.concat(baseURL, 'search/movie?api_key=', APIKEY, '&query=', keyword, '&include_adult=false');
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
                    let tableBuffer = "<thead><tr><th>Poster</th><th>Title</th><th>Overview</th><th>Release Date</th><th>Rating Average</th></tr></thead><tbody>";
                    for (var i = 0; i < data.results.length; i++) {
                        var obj = data.results[i];
                        tableBuffer += "<tr>"
                        + "<td class='droppable'><img class='targetclass' src='https://image.tmdb.org/t/p/w185" + obj['poster_path'] + "' data-id='" + obj['id'] + "'></td>"
                        + "<td>" + obj['original_title'] + "</td>"
                        + "<td>" + obj['overview'] + "</td>"
                        + "<td>" + obj['release_date'] + "</td>"
                        + "<td>" + obj['vote_average'] + "</td>"
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
                        console.log( sourceElement );
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

                let movieId = div[0].dataset.id;
                let url = ''.concat(baseURL, 'movie/', movieId, '?api_key=', APIKEY);

                fetch(url)
                .then(result=>result.json())
                .then((data)=>{
                    div.html("<img class='targetclass' style='max-width: 100%; height: 100%;' src='https://image.tmdb.org/t/p/w185" + data.poster_path + "' data-id='" + data.id + "'/>");

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
        <h1>Using TheMovieDB.org API v3</h1>
        <table id="output">
        </table>
    <?php

    return ob_get_clean();
}

add_shortcode( 'books', 'books_func' );

?>

