var CSVResults;

function _main() {

    //TODO parse dependant on file format & details

    //get sheet object as JSON object or array

    var sheet = CSVResults.data;


    isPortrait = window.matchMedia("only screen and (max-width: 1024px)").matches;
    isLandscape = !isPortrait;

    var portraitContainer = {
        mapKey: 'name',
        listKey: 'name',
        scaleMap: true,
        staticState: true,
        stroke: true,
        fillOpacity: 0.2,
        strokeOpacity: 1.0,
        strokeWidth: 0,
        showToolTip: false,
        toolTipClose: ["tooltip-click"],
        // mouseoutDelay: 2000,
        render_highlight: {
            fillOpacity: 0.5,
            stroke: true,
            strokeOpacity: 0,
            strokeWidth: 0
        },
        areas: [],
        toolTipContainer: '<div class="ingot-box"></div>',
    };

    var landscapeContainer = {
        mapKey: 'name',
        listKey: 'name',
        scaleMap: true,
        staticState: true,
        stroke: true,
        fillOpacity: 0,
        strokeOpacity: 0,
        strokeWidth: 0,
        showToolTip: true,
        toolTipClose: ["tooltip-click", "area-click"],
        // mouseoutDelay: 2000,
        render_highlight: {
            fillOpacity: 1,
            stroke: true,
            strokeOpacity: 0,
            strokeWidth: 0
        },
        areas: [],
        toolTipContainer: '<div class="ingot-box"></div>',

    };

    var overviewContainer = {
        onClick: function () {
            window.location = this.href;
            return false;
        },
        mapKey: 'name',
        listKey: 'name',
        scaleMap: true,
        staticState: true,
        stroke: true,
        fillOpacity: 0.2,
        strokeOpacity: 1.0,
        strokeWidth: 0,
        showToolTip: false,
        toolTipClose: ["tooltip-click"],
        mouseoutDelay: 2000,
        render_highlight: {
            fillOpacity: 1,
            stroke: true,
            strokeOpacity: 0,
            strokeWidth: 0,
        },
        areas: [
            {
                name: 'area-1',
                title: 'Stage 16',
                key: 'area-1',
                fillColor: "15371C",
                fillOpacity: 1,
                strokeOpacity: 0,
                strokeColor: "8c7503",
                render_highlight: {
                    fillColor: "f37321",
                    strokeColor: "8c7503",
                },
                isSelectable: true,
            },

        ],
        toolTipContainer: '<div class="ingot-box"></div>',

    }

    //for each row in the sheet;
    sheet.forEach((row, index, array) => {

        // row.title == row.Name;

        if (row.Image == "") {
            row.blurb = "<span class='close'>&#215;</span><h3 style='color:#939598;' class='ingot-title'>" + row.Name + "</h3>"
                + "<p><strong class='ingot-sub-title'> " + row.Role + "</strong></p> "
                + "<p><a style='color:#f37321;' href='mailto:" + row.Email + "'>" + row.Email + "</a></p>"
                + "<p><a style='color:#f37321;' href='tel:" + row.Phone + "'>" + row.Phone + "</a></p>"
                ;



        }
        else {

            row.blurb = "<span class='close'>&#215;</span><img style='height:100px;' src=" + row.Image + "/>"
                + "<h3 style='color:#939598;'  class='ingot-title'>" + row.Name + "</h3>"
                + "<p><strong class='ingot-sub-title'>" + row.Role + "</strong></p> "
                + "<p><a class='contact-details' style='color:#f37321;' href='mailto:" + row.Email + "'>" + row.Email + "</a></p>"
                + "<p><a class='contact-details' style='color:#f37321;' href='tel:" + row.Phone + "'>" + row.Phone + "</a></p>"
                ;


        }


        var area = {
            key: "area-" + row.Region,
            fillColor: row.fillColor,
            strokeColor: row.strokeColour,
            showToolTip: true,
            toolTipClose: ["tooltip-click"],
            render_highlight: {
                fillColor: "f37321",
                strokeColor: row.strokeColour
            },
            isSelectable: row.mouseover,
            toolTip:
                // '<h3 class="ingot-title">' + row.title + '</h3>' +
                '<p>' + row.blurb + '</p><script type="text/javascript">var el = document.querySelector(".close");el.addEventListener("click",function(){document.querySelector(".ingot-box.mapster_tooltip").style.display = "none !important";});</script>',
        };


        portraitContainer.areas.push(area);

        landscapeContainer.areas.push(area);

    });


    // if (isPortrait) {
    //     $.mapster.utils.areaCorners = newAreaCorners;
    // } else {
    //     $.mapster.utils.areaCorners = origAreaCorners;
    // }
    $.mapster.utils.areaCorners = newAreaCorners;

    // if (isPortrait) {
    //     $('.map-portrait-overview').mapster(overviewContainer);
    //     $('.map-portrait-stage-16').mapster(portraitContainer);
    //     $('.map-portrait-stage-17').mapster(portraitContainer);
    // } else {
    $('.fertco_image_map_nz').mapster(landscapeContainer);
    $('.north_island_mobile').mapster(landscapeContainer);
    $('.south_island_mobile').mapster(landscapeContainer);


    // }
}

function parseCSV(_next) {

    Papa.parse("https://docs.google.com/spreadsheets/d/e/2PACX-1vRRs-IAYHah2I6dzMxn4XcXmlqqA5FaUQ8oJYkHU5ZiwzgBCEpkJwniSrx4vR2jsE-xxUSxRV9EK4rp/pub?gid=150723649&single=true&output=csv",
        {
            download: true,
            header: true,

            complete: function (results) {
                CSVResults = results;
                console.log(results);
                _next();
            },
        });
}

var origAreaCorners = $.mapster.utils.areaCorners;

var newAreaCorners = function (elements, image, container, width, height) {
    var u = $.mapster.utils;
    var pos,
        found,
        minX,
        minY,
        maxX,
        maxY,
        bestMinX,
        bestMaxX,
        bestMinY,
        bestMaxY,
        curX,
        curY,
        nest,
        j,
        offsetx = 0,
        offsety = 0,
        rootx,
        rooty,
        iCoords,
        radius,
        angle,
        el,
        coords = [];

    // if a single element was passed, map it to an array

    elements = elements.length ? elements : [elements];

    container = container ? $(container) : $(document.body);

    // get the relative root of calculation

    pos = container.offset();
    rootx = pos.left;
    //rootx = pos.right;
    rooty = pos.top;

    // with areas, all we know about is relative to the top-left corner of the image. We need to add an offset compared to
    // the actual container. After this calculation, offsetx/offsety can be added to either the area coords, or the target's
    // absolute position to get the correct top/left boundaries of the container.

    if (image) {
        pos = $(image).offset();
        offsetx = pos.left + 6;
        // offsetx = pos.right;
        offsety = pos.top + 15;

    }

    // map the coordinates of any type of shape to a poly and use the logic. simpler than using three different
    // calculation methods. Circles use a 20 degree increment for this estimation.

    for (j = 0; j < elements.length; j++) {
        el = elements[j];
        if (el.nodeName === 'AREA') {
            iCoords = u.split(el.coords, parseInt);

            switch (el.shape) {
                case 'circle':
                    curX = iCoords[0];
                    curY = iCoords[1];
                    radius = iCoords[2];
                    coords = [];
                    for (j = 0; j < 360; j += 20) {
                        angle = (j * Math.PI) / 180;
                        coords.push(
                            curX + radius * Math.cos(angle),
                            curY + radius * Math.sin(angle)
                        );
                    }
                    break;
                case 'rect':
                    coords.push(
                        iCoords[0],
                        iCoords[1],
                        iCoords[2],
                        iCoords[1],
                        iCoords[2],
                        iCoords[3],
                        iCoords[0],
                        iCoords[3]
                    );
                    break;
                case 'poly':
                    coords.push(
                        iCoords[0],
                        iCoords[1],
                        iCoords[2],
                        iCoords[1],
                        iCoords[2],
                        iCoords[3],
                        iCoords[0],
                        iCoords[3]
                    );
                    break;
                default:
                    coords = coords.concat(iCoords);
                    break;
            }

            // map area positions to it's real position in the container

            for (j = 0; j < coords.length; j += 2) {
                coords[j] = parseInt(coords[j], 10) + offsetx;
                coords[j + 1] = parseInt(coords[j + 1], 10) + offsety;
            }
        } else {
            el = $(el);
            pos = el.position();
            coords.push(
                pos.left,
                pos.top,
                pos.left + el.width(),
                pos.top,
                pos.left + el.width(),
                pos.top + el.height(),
                pos.left,
                pos.top + el.height()
            );
        }
    }

    minX = minY = bestMinX = bestMinY = 999999;
    maxX = maxY = bestMaxX = bestMaxY = -1;

    for (j = coords.length - 2; j >= 0; j -= 2) {
        curX = coords[j];
        curY = coords[j + 1];

        if (curX < minX) {
            minX = curX;
            bestMaxY = curY;
        }
        if (curX > maxX) {
            maxX = curX;
            bestMinY = curY;
        }
        if (curY < minY) {
            minY = curY;
            bestMaxX = curX;
        }
        if (curY > maxY) {
            maxY = curY;
            bestMinX = curX;
        }
    }

    // try to figure out the best place for the tooltip

    if (width && height) {
        found = false;
        $.each(
            [

                // [maxX, bestMinY - (height / 2)]
                [maxX - width, bestMinY - height]
                // [minX - (bestMinX / 2), minY - height],
                // [bestMaxX - width, minY - height],
                // [minX, minY - height],
                // [bestMinX, minY - height],
                // [minX - width, bestMaxY - height],
                // [minX - width, bestMinY],
                // [maxX, bestMaxY - height],
                // [maxX, bestMinY],
                // [bestMaxX - width, maxY],
                // [bestMinX, maxY]
                // [bestMinX, minY]
            ],
            function (_, e) {
                if (!found && e[0] > rootx && e[1] > rooty) {
                    nest = e;
                    found = true;
                    return false;
                }
            }
        );

        // default to lower-right corner if nothing fit inside the boundaries of the image

        if (!found) {
            nest = [maxX, maxY];
        }
    }
    return nest;
};

$(document).ready(function () {

    parseCSV(_main);

});
