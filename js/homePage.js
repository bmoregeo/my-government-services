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
dojo.require("dojo.date.locale");
dojo.require("dojo.window");
dojo.require("dojo.number");

dojo.require("dojox.mobile");
dojo.require("dojox.mobile.parser");

dojo.require("esri.map");
dojo.require("esri.tasks.geometry");
dojo.require("esri.layers.FeatureLayer");
dojo.require("esri.tasks.query");
dojo.require("esri.tasks.locator");
dojo.require("esri.tasks.route");

dojo.require("js.Config");
dojo.require("js.date");
dojo.require("js.InfoWindow");

dojo.require("esri.dijit.Legend");
// Currency Formatting
dojo.require("dojo.currency");
/*Global variables*/
var baseMapLayers;  //Variable for storing base map layers
var fontSize; //variable for storing font sizes for all devices.
var infoBoxWidth; //variable to store the width of the carousel pod

var isBrowser = false;
var isiOS = false; //flag set for ios devices(ipad, iphone)
var isMobileDevice = false;
var isTablet = false;

var locatorFields; //Variable for storing configurable address fields
var locatorMarkupSymbolPath; //variable for storing the locator marker image URL
var locatorURL; //variable to store locator object for geo-coding

var map;    //variable to store map object
var mapPoint;
var selectedGraphic = null;
var mapSharingOptions; //variable for storing the tiny service URL

var messages; //variable used for storing the error messages
var showNullValueAs; //variable to store the default value for replacing null values
var tempGraphicsLayerId = 'tempGraphicsLayerID';  //variable to store graphics layer ID

var services; //variable to store services from the config file
var numberOfServices = 0;
//CFRICKE
var layersCounter = 0; //variable to store counter for layers
var tempLayerId = "tempLayerID";


var zoomLevel;

var routeparams; // variable for storing the route parameters
var routeLayerId = "routeLayerId"; //variable to store graphics layer ID for routing
var routeSymbol; //Symbol to mark the route.
var routeTask; //Route Task to find the route.

var rendererColor;
var intervalIDs = new Array(); //Array of IntervalID of glow-effect.
var highlightPollLayerId = "highlightPollLayerId"; //Graphics layer object for displaying selected service

var rippleSize;
var infoPopupFieldsCollection;
var infoWindowHeader;

var selectedFieldName;
var firstClick = true; //check for the first click on the map used in order to destroy the Dom elements

var infoPopupHeight;
var infoPopupWidth;
var locatorNameFields;
var callOutAddress;

var locationFields;
var locationName;
//Function to initialize the map and read data from Configuration file
function Init() {
    esri.config.defaults.io.proxyUrl = "proxy.ashx";        //Setting to use proxy file
    esriConfig.defaults.io.alwaysUseProxy = false;
    esriConfig.defaults.io.timeout = 180000;    //esri request timeout value

    var userAgent = window.navigator.userAgent; //used to detect the type of devices

    if (userAgent.indexOf("iPhone") >= 0 || userAgent.indexOf("iPad") >= 0) {
        isiOS = true;
    }
    if (userAgent.indexOf("Android") >= 0 || userAgent.indexOf("iPhone") >= 0) {
        fontSize = 15;
        isMobileDevice = true;
        dojo.byId('dynamicStyleSheet').href = "styles/mobile.css";
    }
    else if (userAgent.indexOf("iPad") >= 0) {
        fontSize = 14;
        isTablet = true;
        dojo.byId('dynamicStyleSheet').href = "styles/tablet.css";
    }
    else {
        fontSize = 11;
        isBrowser = true;
        dojo.byId('dynamicStyleSheet').href = "styles/browser.css";

    }

    dojo.byId("divSplashContent").style.fontSize = fontSize + "px";
    var eventFired = false;
    dojo.connect(dojo.byId("txtAddress"), 'onkeyup', function (evt) {
        if (evt) {

            var keyCode = evt.keyCode;
            if (keyCode == 27) {
                dojo.byId('txtAddress').focus();
                RemoveChildren(dojo.byId('tblAddressResults'));
                RemoveScrollBar(dojo.byId('divAddressScrollContainer'));
                return;
            }
            if (!((keyCode > 46 && keyCode < 58) || (keyCode > 64 && keyCode < 91) || (keyCode > 95 && keyCode < 105) || keyCode == 8 || keyCode == 110 || keyCode == 188)) {
                evt = (evt) ? evt : event;
                evt.cancelBubble = true;
                if (evt.stopPropagation) evt.stopPropagation();
                return;
            }
            eventFired = true;
            dojo.byId("imgLocate").src = "images/searchLoader.gif";
            setTimeout(function () {
                if (eventFired) {
                    eventFired = false;
                    LocateAddress();
                }
            }, 1000);
        }
    });

    dojo.connect(dojo.byId("imgLocate"), 'onclick', function (evt) {
        if (dojo.byId('txtAddress').value.trim() == "") {
            alert(messages.getElementsByTagName("addressToLocate")[0].childNodes[0].nodeValue);
            dojo.byId("imgLocate").src = "images/locate.png";
            return;
        }
        dojo.byId("imgLocate").src = "images/searchLoader.gif";
        LocateAddress();
    });

    if (!Modernizr.geolocation) {
        dojo.byId("tdGeolocation").style.display = "none"; //geo location icon is made invisible for the non supported browsers
    }

    var responseObject = new js.Config();
    Initialize(responseObject);
}

//function calls at the initialize state
function Initialize(responseObject) {

    if (isMobileDevice) {
        dojo.replaceClass("divAddressHolder", "hideContainer", "hideContainerHeight");
        dojo.byId('divAddressContainer').style.display = "none";
        dojo.removeClass(dojo.byId('divAddressContainer'), "hideContainerHeight");
        dojo.byId('divSplashScreenContent').style.width = "95%";
        dojo.byId('divSplashScreenContent').style.height = "95%";
        dojo.byId("divLogo").style.display = "none";
        dojo.byId("lblAppName").style.display = "none";
        dojo.byId("lblAppName").style.width = "80%";
        dojo.byId("tblLayers").style.display = "none";
    }
    else {
        var imgBasemap = dojo.create('img');
        imgBasemap.src = "images/imgBaseMap.png";
        imgBasemap.className = "imgOptions";
        imgBasemap.title = "Switch Basemap";
        imgBasemap.id = "imgBaseMap";
        imgBasemap.style.cursor = "pointer";
        imgBasemap.onclick = function () {
            ShowBaseMaps();
        }
        dojo.byId("tdBaseMap").appendChild(imgBasemap);
        dojo.byId("tdBaseMap").className = "tdHeader";
        dojo.byId('divSplashScreenContent').style.width = "350px";
        dojo.byId('divSplashScreenContent').style.height = "290px";
        dojo.byId('divAddressContainer').style.display = "block";
        dojo.byId("divLogo").style.display = "block";
    }
    //Cfricke Add layers
    layers = responseObject.Layers;

    infoBoxWidth = responseObject.InfoBoxWidth;
    dojo.byId('imgApp').src = responseObject.ApplicationIcon;
    dojo.byId("lblAppName").innerHTML = responseObject.ApplicationName;
    dojo.byId('divSplashContent').innerHTML = responseObject.SplashScreenMessage;

    // Set page title
    window.document.title = responseObject.ApplicationTitle;

    dojo.xhrGet(
                    {
                        url: "ErrorMessages.xml",
                        handleAs: "xml",
                        preventCache: true,
                        load: function (xmlResponse) {
                            messages = xmlResponse;
                        }
                    });
    var infoWindow = new js.InfoWindow({
        domNode: dojo.create("div", null, dojo.byId("map"))
    });

    map = new esri.Map("map", {
        slider: true,
        infoWindow: infoWindow
    });

    ShowProgressIndicator();

    locatorFields = responseObject.LocatorFields.split(",");
    geometryService = new esri.tasks.GeometryService(responseObject.GeometryService);
    locatorURL = responseObject.LocatorURL;
    baseMapLayers = responseObject.BaseMapLayers;
    mapSharingOptions = responseObject.MapSharingOptions;
    locatorMarkupSymbolPath = responseObject.LocatorMarkupSymbolPath;
    showNullValueAs = responseObject.ShowNullValueAs;
    services = responseObject.Services;
    zoomLevel = responseObject.ZoomLevel;
    routeTask = new esri.tasks.RouteTask(responseObject.RouteServiceURL);
    rendererColor = responseObject.RendererColor;
    rippleSize = responseObject.RippleSize;
    infoPopupFieldsCollection = responseObject.InfoPopupFieldsCollection;
    infoWindowHeader = responseObject.InfoWindowHeader;
    infoPopupWidth = responseObject.InfoPopupWidth;
    infoPopupHeight = responseObject.InfoPopupHeight;
    callOutAddress = responseObject.CallOutAddress;
    locatorNameFields = responseObject.LocatorNameFields;

    dojo.connect(routeTask, "onSolveComplete", ShowRoute);
    dojo.connect(routeTask, "onError", ErrorHandler);
    routeSymbol = new esri.symbol.SimpleLineSymbol().setColor(responseObject.RouteColor).setWidth(responseObject.RouteWidth);

    CreateBaseMapComponent();

    if (!isMobileDevice) {
        CreateCarousel();
    }

    dojo.connect(map, "onLoad", function () {
        var zoomExtent;
        var extent = GetQuerystring('extent');
        if (extent != "") {
            zoomExtent = extent.split(',');
        }
        else {
            zoomExtent = responseObject.DefaultExtent.split(",");
        }
        var startExtent = new esri.geometry.Extent(parseFloat(zoomExtent[0]), parseFloat(zoomExtent[1]), parseFloat(zoomExtent[2]), parseFloat(zoomExtent[3]), map.spatialReference);
        map.setExtent(startExtent);
        MapInitFunction();
    });
    dojo.connect(map, "onExtentChange", function (evt) {
        if (dojo.coords("divAppContainer").h > 0) {
            ShareLink(false);
        }
        if (selectedGraphic) {
            var screenPoint = map.toScreen(selectedGraphic);
            screenPoint.y = map.height - screenPoint.y;
            setTimeout(function () {
                map.infoWindow.setLocation(screenPoint);
            }, 700);
            return;
        }
    });
    dojo.byId("txtAddress").setAttribute("defaultAddress", responseObject.LocatorDefaultAddress);
    dojo.byId('txtAddress').value = responseObject.LocatorDefaultAddress;
    dojo.connect(dojo.byId('imgHelp'), "onclick", function () {
        window.open(responseObject.HelpURL);
    });
}

//function called when map is initialized
function MapInitFunction() {
    if (dojo.query('.logo-med', dojo.byId('map')).length > 0) {
        dojo.query('.logo-med', dojo.byId('map'))[0].id = "imgesriLogo";
    }
    else if (dojo.query('.logo-sm', dojo.byId('map')).length > 0) {
        dojo.query('.logo-sm', dojo.byId('map'))[0].id = "imgesriLogo";
    }
    dojo.addClass("imgesriLogo", "esriLogo");

    var gLayer = new esri.layers.GraphicsLayer();
    gLayer.id = tempGraphicsLayerId;
    map.addLayer(gLayer);

    gLayer = new esri.layers.GraphicsLayer();
    gLayer.id = highlightPollLayerId;
    map.addLayer(gLayer);

    routeParams = new esri.tasks.RouteParameters();
    routeParams.stops = new esri.tasks.FeatureSet();
    routeParams.returnRoutes = false;
    routeParams.returnDirections = true;
    routeParams.directionsLengthUnits = esri.Units.MILES;
    routeParams.outSpatialReference = map.spatialReference;

    var routeLayer = new esri.layers.GraphicsLayer();
    routeLayer.id = routeLayerId;
    map.addLayer(routeLayer);

    dojo.byId('divSplashScreenContainer').style.display = "block";
    dojo.replaceClass("divSplashScreenContent", "showContainer", "hideContainer");
    SetHeightSplashScreen();
    if (!isMobileDevice) {
        window.onresize = function () {
            ResizeHandler();
            ResetSlideControls();
        }
    }
    else {
        SetHeightAddressResults();
    }
    HideProgressIndicator();
    if (!isMobileDevice) {
        dojo.connect(map, "onClick", "GetServices");
    }
    else {
        dojo.connect(map, "onClick", function (evt) {
            map.infoWindow.hide();
            mapPoint = null;
            selectedGraphic = null;
            CreateCarousel();
            GetServices(evt);
            //CFRICKE - From Tax Parcel Viewer
            var checked = dojo.query('img[state = "check"]', dojo.byId('divLayers'));
            if (!draw) {
                if (checked.length == 0) {
                    LocateParcel(null, evt.mapPoint)
                    return;
                }
            }
        });
    }

    for (var i in services) {
        if (services[i].LayerVisibility) {
            var featureLayer;
            if (!services[i].distance) {
                featureLayer = CreateFeatureLayerSelectionMode(services[i].ServiceUrl, i, '*', services[i].Color, services[i].HasRendererImage, services[i].isRendererColor);
            }
            else {
                featureLayer = CreatePointFeatureLayer(services[i].ServiceUrl, i, '*', services[i].Image, services[i].HasRendererImage);
            }
            map.addLayer(featureLayer);
            featureLayer.hide();
        }
    }
    for (var i = 0; i < layers.length; i++) {
        if (layers[i].isDynamicMapService) {
            var lastindex = layers[i].ServiceURL.lastIndexOf('/');
            map.addLayer(CreateDynamicServiceLayer(layers[i].ServiceURL, layers[i].ServiceURL.substr(lastindex + 1), layers[i].Key, layers[i].isVisible, layers[i].Title, layers[i].opacity));
        }
        else {
            var featureLayer = new esri.layers.FeatureLayer(layers[i].ServiceURL, {
                mode: esri.layers.FeatureLayer.MODE_SELECTION,
                outFields: ["*"],
                id: layers[i].Key,
                displayOnPan: false
            });

            dojo.connect(map, "onExtentChange", function (evt) {
                mapScale = map.getLayer(baseMapLayers[0].Key).tileInfo.lods[map.getLevel()].scale;
                if (!isOrientationChanged) {
                    if (selectedGraphic) {
                        var screenPoint = map.toScreen(selectedGraphic);
                        screenPoint.y = map.height - screenPoint.y;
                        map.infoWindow.setLocation(screenPoint);
                        return;
                    }
                }
                dojo.byId("divShareContainer").setAttribute("mapScale", mapScale);
                if (dojo.coords("divShareContainer").h > 0) {
                    ShareLink(false);
                }
            });

            if (layers[i].UseColor) {
                var customLFillSymbol = new esri.symbol.SimpleFillSymbol();
                var customFillColor = new dojo.Color(layers[i].Color);
                customFillColor.a = Number(layers[i].Alpha);
                customLFillSymbol.setColor(customFillColor);
                var customRenderer = new esri.renderer.SimpleRenderer(customLFillSymbol);
                featureLayer.setRenderer(customRenderer);

            }
            map.addLayer(featureLayer);


            FixTabWidth();
        }
    }
}

function GetServices(evt) {

    newLeft = 0;
    if (!isMobileDevice) {
        dojo.byId("divCarouselDataContent").style.left = "0px";
        ResetSlideControls();
        map.infoWindow.hide();
        mapPoint = null;
        selectedGraphic = null;
    }
    else {
        if (!firstClick) {
            RemoveChildren(dojo.byId('divRepresentativeDataContainer'));
            dojo.byId('goBack').style.display = "none";
            dojo.byId('getDirection').style.display = "none";
            for (var i in services) {
                var thisDijit = dijit.byNode(dojo.byId("li_" + i));
                thisDijit.destroy();
            }
        }
        firstClick = false;
    }

    if (evt) {
        map.getLayer(tempGraphicsLayerId).clear();
        mapPoint = new esri.geometry.Point(evt.mapPoint.x, evt.mapPoint.y, map.spatialReference);
        map.centerAndZoom(mapPoint, zoomLevel);
        SelectedPointAddress();
    }
    ShowProgressIndicator();

    QueryService(mapPoint);

    if (isMobileDevice) {
        CallOutAddressDisplay(evt);
        CreateListLayOut();
    }
}


function CallOutAddressDisplay(evt) {
    var locator = new esri.tasks.Locator(locatorURL);
    if (evt) {
        locator.locationToAddress(mapPoint, 100);
    }
    else {
        locator.locationToAddress(mapPoint, 1);
    }
    var infoTemplate = new esri.InfoTemplate("Location", callOutAddress);
    dojo.connect(locator, "onLocationToAddressComplete", function (candidate) {
        if (candidate.address) {
            var infoData = new esri.Graphic(candidate.location, candidate.address, infoTemplate).symbol.Address;
            if (infoData != null) {
                infoContent = dojo.string.substitute(infoData).trimString(16);
                map.infoWindow.setContent(infoContent);
                dojo.byId("tdListHeader").innerHTML = infoContent;
            }
            else {
                var infoData = showNullValueAs;
                infoContent = dojo.string.substitute(infoData).trimString(16);
                map.infoWindow.setContent(infoContent);
                dojo.byId("tdListHeader").innerHTML = infoContent;
            }

        }
    });

}

function SelectedPointAddress() {
    var locator = new esri.tasks.Locator(locatorURL);
    locator.locationToAddress(mapPoint, 100);
    dojo.connect(locator, "onLocationToAddressComplete", function (candidate) {
        if (candidate.address) {
            var symbol = new esri.symbol.PictureMarkerSymbol(locatorMarkupSymbolPath, 25, 25);
            var attr = [];
            if (candidate.address.Loc_name == "US_Zipcode") {
                attr = { Address: candidate.address.Zip };
            }
            else {
                var address = [];
                var fields = "Address,City,State,Zip";
                for (var att = 0; att < fields.split(",").length; att++) {
                    if (candidate.address[fields.split(",")[att]]) {
                        address.push(candidate.address[fields.split(",")[att]]);
                    }
                }
                attr = { Address: address.join(',') };
            }
            var graphic = new esri.Graphic(mapPoint, symbol, attr, null);
            map.getLayer(tempGraphicsLayerId).add(graphic);
        }
    });

}

dojo.addOnLoad(Init);