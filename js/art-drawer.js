var TweetYourArt = (function(doc){
    "use strict";

    function drawLine( painter, brush, start, end, style ) {
        var style = style || "rgba(255, 255, 255, 0)";

        console.info("Draw from (" + start.x + ", " + start.y  + ") to (" + end.x + ", " + end.y + ")");

        painter.lineCap     = 'round';
        painter.strokeWidth = brush.width;
        painter.strokeStyle = style;

        painter.beginPath();

        painter.moveTo( start.x, start.y );
        painter.lineTo( end.x, end.y );

        painter.stroke();
    }

    function onCanvasMouseDown( event ) {
        var old_mouse_position = this.mouse_position,
            new_mouse_position = {x: event.pageX - this.canvasPosition.left, y: event.pageY - this.canvasPosition.top },
            painter            = this.canvas.getContext('2d'),
            brush              = this.brush,
            pressure           = this.wacomAPI ? this.wacomAPI.penAPI.pressure : 1.0,
            opacity            = brush.boldness * pressure,
            isEraser           = this.wacomAPI ? (this.wacomAPI.pointerType === 3) : false,
            style              = isEraser ? "white" : "rgba(" + brush.color.r + ", " + brush.color.g + ", " + brush.color.b + ", " + opacity + ")";

        if( old_mouse_position )
        {
            drawLine(painter, brush, old_mouse_position, new_mouse_position, style);
        }

        this.mouse_position = new_mouse_position;
    }

    function onCanvasMouseMove( event ) {
        var old_mouse_position = this.mouse_position,
            new_mouse_position = {x: event.pageX - this.canvasPosition.left, y: event.pageY - this.canvasPosition.top },
            painter            = this.canvas.getContext('2d'),
            brush              = this.brush,
            pressure           = this.wacomAPI ? this.wacomAPI.penAPI.pressure : 1.0,
            opacity            = brush.boldness * pressure,
            isEraser           = this.wacomAPI ? (this.wacomAPI.pointerType === 3) : false,
            style              = isEraser ? "white" : "rgba(" + brush.color.r + ", " + brush.color.g + ", " + brush.color.b + ", " + opacity + ")";

        if( old_mouse_position )
        {
            drawLine(painter, brush, old_mouse_position, new_mouse_position, style);
            this.mouse_position = new_mouse_position;
        }
    }

    function onCanvasMouseUp( event ) {
        this.mouse_position = undefined;
    }

    var _canvas = (function loadCanvas(doc){
            var _canvas = doc.getElementById('tya-sheet');
            if( undefined == _canvas )
            {
                console.error("TweetYourArt's canvas not found");
                return { };
            }
            else
            {
                return _canvas;
            }
        }(doc)),
        _canvas_position = (function findElementTopLeftCorner(el){
            var _position = { left: 0, top:0 };
            if( el.offsetParent )
            {
                do
                {
                    _position.left += el.offsetLeft;
                    _position.top  += el.offsetTop;
                }while( el = el.offsetParent );
            }
            return _position;
        }(_canvas)),
        _wacom_plugin = doc.getElementById('tya-wacom-plugin'),
        _wacom_api = (function loadWacomAPI(wplugin){
            var wacom_version = wplugin.version;
            if( undefined == wacom_version )
            {
                console.error("Wacom plugin not found on the platform");
                return undefined;
            }
            else
            {
                console.info("Wacom plugin version " + wacom_version );
            }
        }(_wacom_plugin)),
        _tweet_your_art =  {
            canvas: _canvas,
            canvasPosition: _canvas_position,
            wacomAPI: _wacom_api,
            brush: {
                color: { 
                    r: 0,
                    g: 0,
                    b: 0
                },
                boldness : 1.0,
                width: 25.0
            }
        };

    if( _canvas ) 
    {
        _canvas.onmousedown = onCanvasMouseDown.bind(_tweet_your_art);
        _canvas.onmouseup   = onCanvasMouseUp.bind(_tweet_your_art);
        _canvas.onmousemove = onCanvasMouseMove.bind(_tweet_your_art);
    }

    return _tweet_your_art;

}(window.document));
