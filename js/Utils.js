/** @license
 | Version 10.1.1
 | Copyright 2012 Esri
 |
 | Licensed under the Apache License, Version 2.0 (the "License");
 | you may not use this file except in compliance with the License.
 | You may obtain a copy of the License at
 |
 |    http://www.apache.org/licenses/LICENSE-2.0
 |
 | Unless required by applicable law or agreed to in writing, software
 | distributed under the License is distributed on an "AS IS" BASIS,
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 | See the License for the specific language governing permissions and
 | limitations under the License.
 */
var orientationChange = false; //variable for setting the flag on orientation
var tinyResponse; //variable for storing the response getting from tiny URL api
var tinyUrl; //variable for storing the tiny URL

//Function for refreshing address container div
function RemoveChildren(parentNode) {
    if (parentNode) {
        while (parentNode.hasChildNodes()) {
            parentNode.removeChild(parentNode.lastChild);
        }
    }
}

//function to remove scroll bar
function RemoveScrollBar(container) {
    if (dojo.byId(container.id + 'scrollbar_track')) {
        container.removeChild(dojo.byId(container.id + 'scrollbar_track'));
    }
}

//function to trim string
String.prototype.trim = function () {
    return this.replace(/^\s*/, "").replace(/\s*$/, "");
}

//Function to append "..." for a string
String.prototype.trimString = function (len) {
    return (this.length > len) ? this.substring(0, len) + "..." : this;
}

//function for displaying the current location of the user
function ShowMyLocation() {
    if (dojo.coords("divLayerContainer").h > 0) {
        dojo.replaceClass("divLayerContainer", "hideContainerHeight", "showContainerHeight");
        dojo.byId('divLayerContainer').style.height = '0px';
    }
    if (dojo.coords("divOperationalLayerContainer").h > 0) {
        dojo.replaceClass("divOperationalLayerContainer", "hideContainerHeight", "showContainerHeight");
        dojo.byId("divOperationalLayerContainer").style.height = "0px";
    }
    if (!isMobileDevice) {
        if (dojo.coords("divAddressHolder").h > 0) {
            dojo.replaceClass("divAddressHolder", "hideContainerHeight", "showContainerHeight");
            dojo.byId('divAddressHolder').style.height = '0px';
        }
    }
    navigator.geolocation.getCurrentPosition(
		function (position) {
		    ShowProgressIndicator();
		    mapPoint = new esri.geometry.Point(position.coords.longitude, position.coords.latitude, new esri.SpatialReference({ wkid: 4326 }));
		    var graphicCollection = new esri.geometry.Multipoint(new esri.SpatialReference({ wkid: 4326 }));
		    graphicCollection.addPoint(mapPoint);
		    geometryService.project([graphicCollection], map.spatialReference, function (newPointCollection) {
		        for (var bMap = 0; bMap < baseMapLayers.length; bMap++) {
		            for (var z = 0; z < baseMapLayers[bMap].MapURL.length; z++) {
						if (map.getLayer(baseMapLayers[bMap].Key + z).visible) {
							var bmap = baseMapLayers[bMap].Key + z;
						}
				}
		        }
		        if (!map.getLayer(bmap).fullExtent.contains(newPointCollection[0].getPoint(0))) {

		            map.getLayer(tempGraphicsLayerId).clear();
		            map.infoWindow.hide();
		            mapPoint = null;
		            selectedMapPoint = null;
		            HideProgressIndicator();
		            if (!isMobileDevice) {
		                HideServiceLayers();
		                WipeOutResults();
		            }
		            alert(messages.getElementsByTagName("geoLocation")[0].childNodes[0].nodeValue);
		            return;
		        }
		        mapPoint = newPointCollection[0].getPoint(0);
		        var ext = GetExtent(mapPoint);
		        map.setExtent(ext.getExtent().expand(zoomLevel));
		        var symbol = new esri.symbol.PictureMarkerSymbol(locatorMarkupSymbolPath, 25, 25);
		        var graphic = new esri.Graphic(mapPoint, symbol, null, null);
		        map.getLayer(tempGraphicsLayerId).add(graphic);
		        if (!isMobileDevice) {
		            WipeInResults();
		            ShowProgressIndicator();
		            QueryService(mapPoint);
		        }
		        else {
		            CreateCarousel();
		            GetServices();
		        }
		        HideProgressIndicator();
		    });
		},
		function (error) {
		    HideProgressIndicator();
		    switch (error.code) {
		        case error.TIMEOUT:
		            alert(messages.getElementsByTagName("geolocationTimeout")[0].childNodes[0].nodeValue);
		            break;
		        case error.POSITION_UNAVAILABLE:
		            alert(messages.getElementsByTagName("geolocationPositionUnavailable")[0].childNodes[0].nodeValue);
		            break;
		        case error.PERMISSION_DENIED:
		            alert(messages.getElementsByTagName("geolocationPermissionDenied")[0].childNodes[0].nodeValue);
		            break;
		        case error.UNKNOWN_ERROR:
		            alert(messages.getElementsByTagName("geolocationUnKnownError")[0].childNodes[0].nodeValue);
		            break;
		    }
		}, { timeout: 10000 });
}

//function to handle orientation change event handler
function orientationChanged() {
    orientationChange = true;
    if (map) {
        var timeout = (isMobileDevice && isiOS) ? 700 : 500;
        map.infoWindow.hide();
        setTimeout(function () {
            if (isMobileDevice) {
                map.reposition();
                map.resize();
                setTimeout(function () {
                    SetHeightAddressResults();
                    SetHeightSplashScreen();
                    setTimeout(function () {
                        if (mapPoint) {
                            map.setExtent(GetBrowserMapExtent(mapPoint));
                        }
                        isOrientationChanged = false;
                    }, 300);
                    SetMblListContainer();
                }, 300);
            }
            else {
                setTimeout(function () {
                    if (mapPoint) {
                        map.setExtent(GetMobileMapExtent(selectedGraphic));
                    }
                    isOrientationChanged = false;
                }, 500);
                FixBottomPanelWidth(); //function to set width of shortcut links in ipad orientation change
            }

        }, timeout);
    }
}

// function is used to set the height for the content div used in mobile devices in orientation change event
function SetContentHeight(content, heightReduced) {
    var height = map.height;
    if (height > 0) {
        dojo.byId(content).style.height = (height - heightReduced) + "px";
    }
}

// function is used to set scroll bar when orientation is changed
function SetMblListContainer() {

    if ((dojo.byId("divListContainer").style.display) == "block") {
        SetContentHeight("divDataListContent", 60);
        CreateScrollbar(dojo.byId("divDataListContainer"), dojo.byId("divDataListContent"));
    }

    if (dojo.byId("divRepresentativeDataContainer").style.display == "block") {
        if (dojo.byId("divRepresentativeScrollContent" + selectedFieldName).style.display == "block") {
            SetContentHeight("divContent" + selectedFieldName, 80);
            SetContentHeight("divRepresentativeScrollContent" + selectedFieldName, 80);
            CreateScrollbar(dojo.byId("divRepresentativeScrollContainer" + selectedFieldName), dojo.byId("divContent" + selectedFieldName));
        }

        if (dojo.byId("divRepresentativeDataPointDetails" + selectedFieldName)) {
            if ((dojo.byId("divRepresentativeDataPointDetails" + selectedFieldName).style.display) == "block") {
                SetContentHeight("divRepresentativeDataPointDetails" + selectedFieldName, 60);
                CreateScrollbar(dojo.byId("divRepresentativeDataPointContainer" + selectedFieldName), dojo.byId('divRepresentativeDataPointDetails' + selectedFieldName));
            }

        }

        if ((dojo.byId("divDataDirectionsContainer" + selectedFieldName).style.display) == "block") {
            SetContentHeight("divRouteListContent" + selectedFieldName, 150);
            CreateScrollbar(dojo.byId("divRouteListContainer" + selectedFieldName), dojo.byId("divRouteListContent" + selectedFieldName));
        }

    }
}

//function to hide splash screen container
function HideSplashScreenMessage() {
    if (dojo.isIE < 9) {
        dojo.byId("divSplashScreenContent").style.display = "none";
    }
    dojo.addClass('divSplashScreenContainer', "opacityHideAnimation");
    dojo.replaceClass("divSplashScreenContent", "hideContainer", "showContainer");
}

//function to set height for splash screen
function SetHeightSplashScreen() {
    var height = (isMobileDevice) ? (dojo.window.getBox().h - 110) : (dojo.coords(dojo.byId('divSplashScreenContent')).h - 80);
    dojo.byId('divSplashContent').style.height = (height + 10) + "px";
    CreateScrollbar(dojo.byId("divSplashContainer"), dojo.byId("divSplashContent"));
}

//function to handle resize browser event handler
function ResizeHandler() {
    if (map) {
        map.reposition();
        map.resize();
        FixBottomPanelWidth();
    }
}

function SetHeightLegendResults() {
    //var height = (isMobileDevice) ? (dojo.window.getBox().h - 50) : dojo.coords(dojo.byId('divLegendContentHolder')).h;
    //if (height > 0) {
    //    dojo.byId('divLegendScrollContent').style.height = (height - ((!isTablet) ? 100 : 120)) + "px";
    //}
    CreateScrollbar(dojo.byId("divLegendContainer"), dojo.byId("divLegendHolder"));
}
//function to show address container
function ShowLocateContainer() {
    dojo.byId('txtAddress').blur();

    dojo.byId("imgLocate").src = "images/locate.png";
    if (dojo.coords("divAppContainer").h > 0) {
        dojo.replaceClass("divAppContainer", "hideContainerHeight", "showContainerHeight");
        dojo.byId('divAppContainer').style.height = '0px';
    }
    if (dojo.coords("divLayerContainer").h > 0) {
        dojo.replaceClass("divLayerContainer", "hideContainerHeight", "showContainerHeight");
        dojo.byId('divLayerContainer').style.height = '0px';
    }
    if (dojo.coords("divOperationalLayerContainer").h > 0) {
        dojo.replaceClass("divOperationalLayerContainer", "hideContainerHeight", "showContainerHeight");
        dojo.byId("divOperationalLayerContainer").style.height = "0px";
    }
    if (isMobileDevice) {
        dojo.byId('divAddressContainer').style.display = "block";
        dojo.replaceClass("divAddressHolder", "showContainer", "hideContainer");
        dojo.byId("txtAddress").value = dojo.byId("txtAddress").getAttribute("defaultAddress");
    }
    else {
        if (dojo.coords("divAddressHolder").h > 0) {
            dojo.replaceClass("divAddressHolder", "hideContainerHeight", "showContainerHeight");
            dojo.byId('divAddressHolder').style.height = '0px';
            dojo.byId('txtAddress').blur();
        }
        else {
            dojo.byId('divAddressHolder').style.height = "300px";
            dojo.replaceClass("divAddressHolder", "showContainerHeight", "hideContainerHeight");
            setTimeout(function () {
                dojo.byId('txtAddress').focus();
            }, 500);
            dojo.byId("txtAddress").value = dojo.byId("txtAddress").getAttribute("defaultAddress");
        }
    }
    RemoveChildren(dojo.byId('tblAddressResults'));
    SetHeightAddressResults();
}

function HideAddressContainer() {
    if (isMobileDevice) {
        setTimeout(function () {
            dojo.byId('divAddressContainer').style.display = "none";
        }, 500);
        dojo.replaceClass("divAddressHolder", "hideContainerHeight", "showContainerHeight");

    }
    else {
        dojo.replaceClass("divAddressHolder", "hideContainerHeight", "showContainerHeight");
        dojo.byId('divAddressHolder').style.height = '0px';
    }
}

function SetHeightAddressResults() {
    var height = (isMobileDevice) ? (dojo.window.getBox().h - 50) : dojo.coords(dojo.byId('divAddressHolder')).h;
    if (height > 0) {
        dojo.byId('divAddressScrollContent').style.height = (height - ((!isTablet) ? 100 : 120)) + "px";
    }
    CreateScrollbar(dojo.byId("divAddressScrollContainer"), dojo.byId("divAddressScrollContent"));
}

//Function to open login page for facebook,tweet,email
function ShareLink(ext) {
    tinyUrl = null;
    mapExtent = GetMapExtent();
    var url = esri.urlToObject(window.location.toString());
    var urlStr = encodeURI(url.path) + "?extent=" + mapExtent;
    url = dojo.string.substitute(mapSharingOptions.TinyURLServiceURL, [urlStr]);

    dojo.io.script.get({
        url: url,
        callbackParamName: "callback",
        load: function (data) {
            tinyResponse = data;
            tinyUrl = data;
            var attr = mapSharingOptions.TinyURLResponseAttribute.split(".");
            for (var x = 0; x < attr.length; x++) {
                tinyUrl = tinyUrl[attr[x]];
            }
            if (ext) {
                if (dojo.coords("divLayerContainer").h > 0) {
                    dojo.replaceClass("divLayerContainer", "hideContainerHeight", "showContainerHeight");
                    dojo.byId('divLayerContainer').style.height = '0px';
                }
                if (dojo.coords("divOperationalLayerContainer").h > 0) {
                    dojo.replaceClass("divOperationalLayerContainer", "hideContainerHeight", "showContainerHeight");
                    dojo.byId("divOperationalLayerContainer").style.height = "0px";
                }
                if (!isMobileDevice) {
                    if (dojo.coords("divAddressHolder").h > 0) {
                        dojo.replaceClass("divAddressHolder", "hideContainerHeight", "showContainerHeight");
                        dojo.byId('divAddressHolder').style.height = '0px';
                    }
                }
                var cellHeight = (isMobileDevice || isTablet) ? 81 : 60;
                if (dojo.coords("divAppContainer").h > 0) {
                    dojo.replaceClass("divAppContainer", "hideContainerHeight", "showContainerHeight");
                    dojo.byId('divAppContainer').style.height = '0px';
                }
                else {
                    dojo.byId('divAppContainer').style.height = cellHeight + "px";
                    dojo.replaceClass("divAppContainer", "showContainerHeight", "hideContainerHeight");
                }
            }
        },
        error: function (error) {
            alert(tinyResponse.error);
        }
    });
    setTimeout(function () {
        if (!tinyResponse) {
            alert(messages.getElementsByTagName("servicesNotAvailable")[0].childNodes[0].nodeValue);
            return;
        }
    }, 6000);
}

//Function to open login page for facebook,tweet,email
function Share(site) {
    if (dojo.coords("divAppContainer").h > 0) {
        dojo.replaceClass("divAppContainer", "hideContainerHeight", "showContainerHeight");
        dojo.byId('divAppContainer').style.height = '0px';
    }
    if (tinyUrl) {
        switch (site) {
            case "facebook":
                window.open(dojo.string.substitute(mapSharingOptions.FacebookShareURL, [tinyUrl]));
                break;
            case "twitter":
                window.open(dojo.string.substitute(mapSharingOptions.TwitterShareURL, [tinyUrl]));
                break;
            case "mail":
                parent.location = dojo.string.substitute(mapSharingOptions.ShareByMailLink, [tinyUrl]);
                break;
        }
    }
    else {
        alert(messages.getElementsByTagName("tinyURLEngine")[0].childNodes[0].nodeValue);
        return;
    }
}

function GetMapExtent() {
    var extents = map.extent.xmin.toString() + ",";
    extents += map.extent.ymin.toString() + ",";
    extents += map.extent.xmax.toString() + ",";
    extents += map.extent.ymax.toString();
    return (extents);
}

//Function to get the query string value of the provided key if not found the function returns empty string
function GetQuerystring(key) {
    var _default;
    if (_default == null) _default = "";
    key = key.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + key + "=([^&#]*)");
    var qs = regex.exec(window.location.href);
    if (qs == null)
        return _default;
    else
        return qs[1];
}

function ShowProgressIndicator() {
    dojo.byId('divLoadingIndicator').style.display = "block";
}

function HideProgressIndicator() {
    dojo.byId('divLoadingIndicator').style.display = "none";
}

function CreateScrollbar(container, content) {
    console.log('Create SB');
    var yMax;
    var pxLeft, pxTop, xCoord, yCoord;
    var scrollbar_track;
    var isHandleClicked = false;
    this.container = container;
    this.content = content;
    content.scrollTop = 0;
    if (dojo.byId(container.id + 'scrollbar_track')) {
        RemoveChildren(dojo.byId(container.id + 'scrollbar_track'));
        container.removeChild(dojo.byId(container.id + 'scrollbar_track'));
    }
    if (!dojo.byId(container.id + 'scrollbar_track')) {
        scrollbar_track = dojo.create('div');
        scrollbar_track.id = container.id + "scrollbar_track";
        scrollbar_track.className = "scrollbar_track";
    }
    else {
        scrollbar_track = dojo.byId(container.id + 'scrollbar_track');
    }

    var containerHeight = dojo.coords(container);
    if ((containerHeight.h - 6) > 0) {
        scrollbar_track.style.height = (containerHeight.h - 6) + "px";
    }
    scrollbar_track.style.right = 5 + 'px';

    var scrollbar_handle = dojo.create('div');
    scrollbar_handle.className = 'scrollbar_handle';
    scrollbar_handle.id = container.id + "scrollbar_handle";

    scrollbar_track.appendChild(scrollbar_handle);
    container.appendChild(scrollbar_track);

    if ((content.scrollHeight - content.offsetHeight) <= 5) {
        scrollbar_handle.style.display = 'none';
        scrollbar_track.style.display = 'none';
        return;
    }
    else {
        scrollbar_handle.style.display = 'block';
        scrollbar_track.style.display = 'block';
        scrollbar_handle.style.height = Math.max(this.content.offsetHeight * (this.content.offsetHeight / this.content.scrollHeight), 25) + 'px';
        yMax = this.content.offsetHeight - scrollbar_handle.offsetHeight;
        yMax = yMax - 5; //for getting rounded bottom of handle
        if (window.addEventListener) {
            content.addEventListener('DOMMouseScroll', ScrollDiv, false);
        }
        content.onmousewheel = function (evt) {
            console.log(content.id);
            ScrollDiv(evt);
        }
    }

    function ScrollDiv(evt) {
        var evt = window.event || evt //equalize event object
        var delta = evt.detail ? evt.detail * (-120) : evt.wheelDelta //delta returns +120 when wheel is scrolled up, -120 when scrolled down
        pxTop = scrollbar_handle.offsetTop;

        if (delta <= -120) {
            var y = pxTop + 10;
            if (y > yMax) y = yMax // Limit vertical movement
            if (y < 0) y = 0 // Limit vertical movement
            scrollbar_handle.style.top = y + "px";
            content.scrollTop = Math.round(scrollbar_handle.offsetTop / yMax * (content.scrollHeight - content.offsetHeight));
        }
        else {
            var y = pxTop - 10;
            if (y > yMax) y = yMax // Limit vertical movement
            if (y < 0) y = 2 // Limit vertical movement
            scrollbar_handle.style.top = (y - 2) + "px";
            content.scrollTop = Math.round(scrollbar_handle.offsetTop / yMax * (content.scrollHeight - content.offsetHeight));
        }
    }

    //Attaching events to scrollbar components
    scrollbar_track.onclick = function (evt) {
        if (!isHandleClicked) {
            evt = (evt) ? evt : event;
            pxTop = scrollbar_handle.offsetTop // Sliders vertical position at start of slide.
            var offsetY;
            if (!evt.offsetY) {
                var coords = dojo.coords(evt.target);
                offsetY = evt.layerY - coords.t;
            }
            else
                offsetY = evt.offsetY;
            if (offsetY < scrollbar_handle.offsetTop) {
                scrollbar_handle.style.top = offsetY + "px";
                content.scrollTop = Math.round(scrollbar_handle.offsetTop / yMax * (content.scrollHeight - content.offsetHeight));
            }
            else if (offsetY > (scrollbar_handle.offsetTop + scrollbar_handle.clientHeight)) {
                var y = offsetY - scrollbar_handle.clientHeight;
                if (y > yMax) y = yMax // Limit vertical movement
                if (y < 0) y = 0 // Limit vertical movement
                scrollbar_handle.style.top = y + "px";
                content.scrollTop = Math.round(scrollbar_handle.offsetTop / yMax * (content.scrollHeight - content.offsetHeight));
            }
            else {
                return;
            }
        }
        isHandleClicked = false;
    };

    //Attaching events to scrollbar components
    scrollbar_handle.onmousedown = function (evt) {
        isHandleClicked = true;
        evt = (evt) ? evt : event;
        evt.cancelBubble = true;
        if (evt.stopPropagation) evt.stopPropagation();
        pxTop = scrollbar_handle.offsetTop // Sliders vertical position at start of slide.
        yCoord = evt.screenY // Vertical mouse position at start of slide.
        document.body.style.MozUserSelect = 'none';
        document.body.style.userSelect = 'none';
        document.onselectstart = function () {
            return false;
        }
        document.onmousemove = function (evt) {
            evt = (evt) ? evt : event;
            evt.cancelBubble = true;
            if (evt.stopPropagation) evt.stopPropagation();
            var y = pxTop + evt.screenY - yCoord;
            if (y > yMax) y = yMax // Limit vertical movement
            if (y < 0) y = 0 // Limit vertical movement
            scrollbar_handle.style.top = y + "px";
            content.scrollTop = Math.round(scrollbar_handle.offsetTop / yMax * (content.scrollHeight - content.offsetHeight));
        }
    };

    document.onmouseup = function () {
        document.body.onselectstart = null;
        document.onmousemove = null;
    };
    scrollbar_handle.onmouseout = function (evt) {
        document.body.onselectstart = null;
    };
    var startPos;
    var scrollingTimer;

    dojo.connect(container, "touchstart", function (evt) {
        touchStartHandler(evt);
    });

    dojo.connect(container, "touchmove", function (evt) {
        touchMoveHandler(evt);
    });

    dojo.connect(container, "touchend", function (evt) {
        touchEndHandler(evt);
    });

    //Handlers for Touch Events
    function touchStartHandler(e) {
        startPos = e.touches[0].pageY;
    }

    function touchMoveHandler(e) {
        var touch = e.touches[0];
        e.cancelBubble = true;
        if (e.stopPropagation) e.stopPropagation();
        e.preventDefault();

        pxTop = scrollbar_handle.offsetTop;
        var y;
        if (startPos > touch.pageY) {
            y = pxTop + 10;
        }
        else {
            y = pxTop - 10;
        }

        //setting scrollbar Handel
        if (y > yMax) y = yMax // Limit vertical movement
        if (y < 0) y = 0 // Limit vertical movement
        scrollbar_handle.style.top = y + "px";

        //setting content position
        content.scrollTop = Math.round(scrollbar_handle.offsetTop / yMax * (content.scrollHeight - content.offsetHeight));

        scrolling = true;
        startPos = touch.pageY;
    }

    function touchEndHandler(e) {
        scrollingTimer = setTimeout(function () { clearTimeout(scrollingTimer); scrolling = false; }, 100);
    }
    //touch scrollbar end
}

function CreateFeatureLayerSelectionMode(featureLayerURL, featureLayerID, outFields, rendererColor, renderer, isFillColorSolid) {
    var tempLayer = new esri.layers.FeatureLayer(featureLayerURL, {
        mode: esri.layers.FeatureLayer.MODE_SELECTION,
        outFields: [outFields]
    });
    tempLayer.id = featureLayerID;
    var color;
    var symbol;
    var rederer;
    if (isFillColorSolid) {
        color = new dojo.Color([parseInt(rendererColor.substr(1, 2), 16), parseInt(rendererColor.substr(3, 2), 16), parseInt(rendererColor.substr(5, 2), 16), 0.4]);
        symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
                    new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, color, 6),
                    color);
        rederer = new esri.renderer.SimpleRenderer(symbol);
    }
    tempLayer.setRenderer(rederer);
    return tempLayer;
}

function CreatePointFeatureLayer(featureLayerURL, featureLayerID, outFields, rendererImage, renderer) {
    var tempLayer = new esri.layers.FeatureLayer(featureLayerURL, {
        mode: esri.layers.FeatureLayer.MODE_SELECTION,
        outFields: [outFields]
    });
    tempLayer.id = featureLayerID;
    if (renderer) {
        var pictureSymbol = new esri.symbol.PictureMarkerSymbol(rendererImage, 30, 30);
        var Renderer = new esri.renderer.SimpleRenderer(pictureSymbol);
        tempLayer.setRenderer(Renderer);
    }

    dojo.connect(tempLayer, "onClick", function (evtArgs) {
        if (!isMobileDevice) {
            ShowProgressIndicator();
            selectedGraphic = evtArgs.graphic.geometry;
            map.centerAt(selectedGraphic);
            setTimeout(function () {
                ShowInfoWindow(evtArgs.graphic.attributes, selectedGraphic, tempLayer);
            }, 500);

            evtArgs = (evtArgs) ? evtArgs : event;
            evtArgs.cancelBubble = true;
            if (evtArgs.stopPropagation) {
                evtArgs.stopPropagation();
            }
            setTimeout(function () {
            HideProgressIndicator();
        }, 1000);
        }
        else {
            map.infoWindow.hide();
            if (evtArgs.stopPropagation) {
                evtArgs.stopPropagation();
            }
            ConfigureRoute(mapPoint, evtArgs.graphic.geometry);
            selectedGraphic = evtArgs.graphic.geometry;
            map.centerAt(selectedGraphic);
            if (routeLayerId) {
                DisplayMblInfo(selectedGraphic, featureLayerID, evtArgs.graphic.attributes[infoWindowHeader]);
            }
        }
    });
    return tempLayer;
}

function ShowInfoWindow(attributes, geometry, layer, key) {
    dojo.byId("tdTitle").innerHTML = attributes[infoWindowHeader];
    selectedGraphic = geometry;

    if (!isMobileDevice) {
        if (isBrowser) {
            map.infoWindow.resize(infoPopupWidth, infoPopupHeight);
        }
        else {
            map.infoWindow.resize(infoPopupWidth + 95, infoPopupHeight+30);
        }
        var screenPoint = map.toScreen(geometry);
        screenPoint.y = map.height - screenPoint.y;
        map.infoWindow.show(screenPoint);
        RemoveChildren(dojo.byId("divInfoContent"));
    }
    else {
        var headerData = dojo.string.substitute(attributes[infoPopupFieldsCollection[0].FieldName]).trimString(Math.round(225 / 20));
        dojo.byId("tdListHeader").innerHTML = headerData;
    }
    var table = dojo.create("table");
    if (!isMobileDevice) {
        dojo.byId("divInfoContent").appendChild(table);
    }
    else {
        var containerDiv = dojo.create("div");
        containerDiv.id = "divRepresentativeDataPointContainer" + key;
        dojo.byId("divRepresentativeScrollContainer" + key).appendChild(containerDiv);

        var contentDiv = dojo.create("div");
        contentDiv.id = "divRepresentativeDataPointDetails" + key;
        contentDiv.className = "divRepresentativeScrollContent";
        containerDiv.appendChild(contentDiv);
        contentDiv.appendChild(table);
        dojo.byId('divRepresentativeDataPointDetails' + key).style.display = "block";
    }

    if (!isMobileDevice) {
        table.style.paddingLeft = "10px";
        table.style.width = "95%";
    }
    else {
        table.style.paddingLeft = "10px";
        table.style.width = "100%";
    }
    table.style.paddingTop = "5px";
    table.cellPadding = "0";
    table.cellSpacing = "0";
    var tbody = dojo.create("tbody");
    table.appendChild(tbody);
    for (var i = 0; i < infoPopupFieldsCollection.length; i++) {
        var tr = dojo.create("tr");
        tbody.appendChild(tr);

        var tdDisplay = dojo.create("td");
        tr.appendChild(tdDisplay);
        tdDisplay.style.paddingBottom = "3px";

        var tableDisplay = dojo.create("table");
        tableDisplay.cellPadding = "0";
        tableDisplay.cellSpacing = "0";
        tdDisplay.appendChild(tableDisplay);

        var tbodyDisplay = dojo.create("tbody");
        tableDisplay.appendChild(tbodyDisplay);
        var trDisplay = dojo.create("tr");
        tbodyDisplay.appendChild(trDisplay);

        var tdDisplayText = dojo.create("td");
        tdDisplayText.vAlign = "top";
        if (!isTablet) {
            tdDisplayText.width = "120px";
        }
        else {
            tdDisplayText.width = "160px";
        }
        trDisplay.appendChild(tdDisplayText);
        tdDisplayText.innerHTML = infoPopupFieldsCollection[i].DisplayText;

        var tdFieldName = dojo.create("td");
        tdFieldName.vAlign = "top";

        trDisplay.appendChild(tdFieldName);

        if (attributes[infoPopupFieldsCollection[i].FieldName] == null) {
            tdFieldName.innerHTML = showNullValueAs;

        }
        else {
            var value = attributes[infoPopupFieldsCollection[i].FieldName].split(" ");
            if (value.length > 1) {
                    tdFieldName.className = "tdBreak";
            }
            else {
                tdFieldName.className = "tdBreakWord";
            }
            tdFieldName.innerHTML = attributes[infoPopupFieldsCollection[i].FieldName];
            dojo.byId("menuList").style.display = "none";
            dojo.byId("goBack").style.display = "block";
            dojo.connect(dojo.byId("goBack"), "onclick", function () {
                dojo.destroy(dojo.byId("divRepresentativeDataPointContainer" + key));
                dojo.destroy("divRepresentativeDataPointDetails" + key);
                dojo.byId("tdListHeader").innerHTML = infoContent;
                dojo.byId("divRepresentativeScrollContent" + key).style.display = "block";
                if ((key) == selectedFieldName) {
                    dojo.byId('divDataDirectionsContainer' + key).style.display = "none";
                    dojo.byId("tblToggleHeader" + key).style.display = "block";
                    dojo.byId("divContent" + key).style.display = "block";
                    dojo.byId("divRepresentativeScrollContent" + key).style.display = "block";
                    SetContentHeight("divContent" + selectedFieldName, 80);
                    SetContentHeight("divRepresentativeScrollContent" + selectedFieldName, 80);
                    CreateScrollbar(dojo.byId("divRepresentativeScrollContainer" + key), dojo.byId("divContent" + key));
                }
                else {
                    dojo.byId("tblToggleHeader" + key).style.display = "none";
                    dojo.byId("divContent" + key).style.display = "none";
                    dojo.byId("divRepresentativeScrollContent" + key).style.display = "none";
                }
                dojo.byId("goBack").style.display = "none";
                dojo.byId("getDirection").style.display = "none";
                dojo.byId("menuList").style.display = "block";
            });
            dojo.byId("getDirection").style.display = "block";
        }
    }
    if (!isMobileDevice) {
        dojo.byId("divInfoContent").style.height = (dojo.coords("divInfoWindowContainer").h) - 60 + "px";
        CreateScrollbar(dojo.byId("divInfoContainer"), dojo.byId("divInfoContent"));
    }
    else {
        SetContentHeight("divRepresentativeDataPointDetails" + key, 60);
        CreateScrollbar(dojo.byId("divRepresentativeDataPointContainer" + key), dojo.byId('divRepresentativeDataPointDetails' + key));
    }
}

function HideInformationContainer() {
    map.infoWindow.hide();
    selectedGraphic = null;
}
/*******************************************************
 * Overlay Map Services
 *******************************************************/


function ShowOperationalLayers() {
    if (dojo.coords("divAppContainer").h > 0) {
        dojo.replaceClass("divAppContainer", "hideContainerHeight", "showContainerHeight");
        dojo.byId('divAppContainer').style.height = '0px';
    }
    if (dojo.coords("divLayerContainer").h > 0) {
        dojo.replaceClass("divLayerContainer", "hideContainerHeight", "showContainerHeight");
        dojo.byId('divLayerContainer').style.height = '0px';
    }

    if (!isMobileDevice) {
        if (dojo.coords("divAddressHolder").h > 0) {
            dojo.replaceClass("divAddressHolder", "hideContainerHeight", "showContainerHeight");
            dojo.byId('divAddressHolder').style.height = '0px';
        }
    }

    if (dojo.coords("divOperationalLayerContainer").h > 0) {
        dojo.replaceClass("divOperationalLayerContainer", "hideContainerHeight", "showContainerHeight");
        dojo.byId("divOperationalLayerContainer").style.height = "0px";
    }
    else {
        dojo.byId('divOperationalLayerContainer').style.height = Math.ceil(5 / 2) * (dojo.coords("divOperationalLayerHolder").h) + ((isTablet) ? 10 : 8) + "px";
        dojo.replaceClass("divOperationalLayerContainer", "showContainerHeight", "hideContainerHeight");
    }
}

//function to create checkbox
function CreateCheckBox(layerId, chkBoxValue, isChecked) {
    var cb = document.createElement("img");
    cb.id = "chk" + layerId;
    if (isMobileDevice) {
        cb.style.width = "44px";
        cb.style.height = "44px";
    }
    else {
        cb.style.width = "20px";
        cb.style.height = "20px";
    }
    if (isChecked) {
        cb.src = "images/checked.png";
        cb.setAttribute("state", "check");
    }
    else {
        cb.src = "images/unchecked.png";
        cb.setAttribute("state", "uncheck");
    }
    cb.setAttribute("value", chkBoxValue);
    cb.setAttribute("layerId", layerId);
    return cb;
}

//function for creating a dynamic layer and adding those values to a div container
function CreateDynamicServiceLayer(layerURL, layerIndex, layerId, isVisible, displayName, layerOpacity) {
    var imageParams = new esri.layers.ImageParameters();
    var lastindex = layerURL.lastIndexOf('/');
    imageParams.layerIds = [layerIndex];
    imageParams.layerOption = esri.layers.ImageParameters.LAYER_OPTION_SHOW;
    var dynamicLayer = layerURL.substring(0, lastindex);
    var dynamicMapService = new esri.layers.ArcGISDynamicMapServiceLayer(dynamicLayer, {
        id: layerId,
        imageParameters: imageParams,
        visible: isVisible,
        opacity:layerOpacity
    });

    dojo.io.script.get({
        url: layerURL + '?f=json',
        preventCache: true,
        callbackParamName: "callback",
        timeout: 10000,
        load: function (data) {
            layersCounter++;
            if (layersCounter == layers.length) {
                HideProgressIndicator();
            }
            var table = document.createElement("table");
            var tbody = document.createElement("tbody");
            table.appendChild(tbody);
            var tr = document.createElement("tr");
            tbody.appendChild(tr);

            var td = document.createElement("td");

            var checkbox = CreateCheckBox(layerId, layerIndex, isVisible);

            checkbox.onclick = function () {
                if (this.getAttribute("state") == "check") {
                    this.src = "images/unchecked.png";
                    this.setAttribute("state", "uncheck");
                    dynamicMapService.hide();
                    map.infoWindow.hide();
                }
                else {
                    this.src = "images/checked.png";
                    this.setAttribute("state", "check");
                    ShowProgressIndicator();
                    dynamicMapService.show();
                    map.infoWindow.hide();
                    selectedGraphic = null;
                    //map.getLayer(tempLayerId).clear();
                    //map.getLayer(tempParcelLayerId).clear();
                }
                HideProgressIndicator();
            };


            td.appendChild(checkbox);
            tr.appendChild(td);

            td = document.createElement("td");
            tr.appendChild(td);

            td = document.createElement("td");
            td.appendChild(document.createTextNode(displayName));

            tr.appendChild(td);

            dojo.byId('divLayers').appendChild(table);
        },
        error: function (error) {
            layersCounter++;
            if (layersCounter == layers.length) {
                HideProgressIndicator();
            }
        }
    });
    return dynamicMapService;
}

//function to get layerinfo based on key
function GetLayerInfo(key) {
    for (var i = 0; i < layers.length; i++) {
        if (layers[i].Key == key)
            return i;
    }
}


