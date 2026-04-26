port module Main exposing (..)

import Browser
import Html exposing (Html, a, button, div, h1, h2, h3, img, input, label, option, p, select, span, text)
import Html.Attributes exposing (attribute, class, disabled, for, href, id, max, min, placeholder, rel, selected, src, step, style, target, type_, value)
import Html.Events exposing (on, onClick, onInput)
import I18n exposing (Language(..), TranslationKey, translate)
import Json.Decode
import Process
import Svg exposing (Svg)
import Svg.Attributes as SvgAttr
import Task



-- SVG ICON HELPERS


svgIcon : List (Html.Attribute msg) -> List (Svg msg) -> Html msg
svgIcon extraAttrs children =
    Svg.svg
        ([ SvgAttr.viewBox "0 0 20 20"
         , SvgAttr.width "20"
         , SvgAttr.height "20"
         , SvgAttr.fill "none"
         , SvgAttr.stroke "currentColor"
         , SvgAttr.strokeWidth "1.5"
         , attribute "aria-hidden" "true"
         , SvgAttr.class "svg-icon"
         ]
            ++ extraAttrs
        )
        children


iconFrogSized : String -> Html Msg
iconFrogSized size =
    svgIcon [ SvgAttr.width size, SvgAttr.height size ]
        [ Svg.circle [ SvgAttr.cx "6", SvgAttr.cy "6", SvgAttr.r "3" ] []
        , Svg.circle [ SvgAttr.cx "14", SvgAttr.cy "6", SvgAttr.r "3" ] []
        , Svg.circle [ SvgAttr.cx "6", SvgAttr.cy "6", SvgAttr.r "1", SvgAttr.fill "currentColor" ] []
        , Svg.circle [ SvgAttr.cx "14", SvgAttr.cy "6", SvgAttr.r "1", SvgAttr.fill "currentColor" ] []
        , Svg.path [ SvgAttr.d "M4 12 Q10 18 16 12", SvgAttr.strokeLinecap "round" ] []
        , Svg.line [ SvgAttr.x1 "0", SvgAttr.y1 "10", SvgAttr.x2 "20", SvgAttr.y2 "10", SvgAttr.opacity "0.6" ] []
        , Svg.line [ SvgAttr.x1 "10", SvgAttr.y1 "0", SvgAttr.x2 "10", SvgAttr.y2 "20", SvgAttr.opacity "0.6" ] []
        ]


iconFrogLarge : Html Msg
iconFrogLarge =
    iconFrogSized "48"


iconUpload : Html Msg
iconUpload =
    svgIcon []
        [ Svg.path [ SvgAttr.d "M10 3 L10 13", SvgAttr.strokeLinecap "round" ] []
        , Svg.path [ SvgAttr.d "M6 7 L10 3 L14 7", SvgAttr.strokeLinecap "round", SvgAttr.strokeLinejoin "round" ] []
        , Svg.path [ SvgAttr.d "M3 12 L3 16 Q3 17 4 17 L16 17 Q17 17 17 16 L17 12", SvgAttr.strokeLinecap "round", SvgAttr.strokeLinejoin "round" ] []
        ]


iconDownload : Html Msg
iconDownload =
    svgIcon []
        [ Svg.line [ SvgAttr.x1 "10", SvgAttr.y1 "3", SvgAttr.x2 "10", SvgAttr.y2 "13" ] []
        , Svg.polyline [ SvgAttr.points "6,10 10,14 14,10" ] []
        , Svg.line [ SvgAttr.x1 "4", SvgAttr.y1 "17", SvgAttr.x2 "16", SvgAttr.y2 "17" ] []
        ]


iconHeart : Html Msg
iconHeart =
    svgIcon []
        [ Svg.path [ SvgAttr.d "M10 17 C4 12 1 8 4 5 Q7 2 10 6 Q13 2 16 5 C19 8 16 12 10 17 Z" ] [] ]


iconGlobe : Html Msg
iconGlobe =
    svgIcon []
        [ Svg.circle [ SvgAttr.cx "10", SvgAttr.cy "10", SvgAttr.r "8" ] []
        , Svg.ellipse [ SvgAttr.cx "10", SvgAttr.cy "10", SvgAttr.rx "4", SvgAttr.ry "8" ] []
        , Svg.line [ SvgAttr.x1 "2", SvgAttr.y1 "10", SvgAttr.x2 "18", SvgAttr.y2 "10" ] []
        ]


iconLock : Html Msg
iconLock =
    svgIcon []
        [ Svg.rect [ SvgAttr.x "4", SvgAttr.y "9", SvgAttr.width "12", SvgAttr.height "9", SvgAttr.rx "2" ] []
        , Svg.path [ SvgAttr.d "M7 9 V6 Q7 2 10 2 Q13 2 13 6 V9" ] []
        , Svg.circle [ SvgAttr.cx "10", SvgAttr.cy "14", SvgAttr.r "1.5", SvgAttr.fill "currentColor" ] []
        ]


iconGrid : Html Msg
iconGrid =
    svgIcon []
        [ Svg.rect [ SvgAttr.x "2", SvgAttr.y "2", SvgAttr.width "16", SvgAttr.height "16" ] []
        , Svg.line [ SvgAttr.x1 "2", SvgAttr.y1 "7", SvgAttr.x2 "18", SvgAttr.y2 "7" ] []
        , Svg.line [ SvgAttr.x1 "2", SvgAttr.y1 "13", SvgAttr.x2 "18", SvgAttr.y2 "13" ] []
        , Svg.line [ SvgAttr.x1 "7", SvgAttr.y1 "2", SvgAttr.x2 "7", SvgAttr.y2 "18" ] []
        , Svg.line [ SvgAttr.x1 "13", SvgAttr.y1 "2", SvgAttr.x2 "13", SvgAttr.y2 "18" ] []
        ]


iconDiagonals : Html Msg
iconDiagonals =
    svgIcon []
        [ Svg.rect [ SvgAttr.x "2", SvgAttr.y "2", SvgAttr.width "16", SvgAttr.height "16" ] []
        , Svg.line [ SvgAttr.x1 "2", SvgAttr.y1 "2", SvgAttr.x2 "18", SvgAttr.y2 "18", SvgAttr.strokeLinecap "round" ] []
        , Svg.line [ SvgAttr.x1 "18", SvgAttr.y1 "2", SvgAttr.x2 "2", SvgAttr.y2 "18", SvgAttr.strokeLinecap "round" ] []
        ]


iconCheck : Html Msg
iconCheck =
    svgIcon []
        [ Svg.polyline [ SvgAttr.points "4,10 8,15 16,5", SvgAttr.strokeLinecap "round", SvgAttr.strokeLinejoin "round" ] [] ]


iconClose : Html Msg
iconClose =
    svgIcon []
        [ Svg.line [ SvgAttr.x1 "4", SvgAttr.y1 "4", SvgAttr.x2 "16", SvgAttr.y2 "16" ] []
        , Svg.line [ SvgAttr.x1 "16", SvgAttr.y1 "4", SvgAttr.x2 "4", SvgAttr.y2 "16" ] []
        ]


iconShare : Html Msg
iconShare =
    svgIcon []
        [ Svg.path
            [ SvgAttr.d "M18 2 L2 8 L9 11 L12 18 Z"
            , SvgAttr.strokeLinejoin "round"
            ]
            []
        , Svg.path
            [ SvgAttr.d "M18 2 L9 11"
            , SvgAttr.strokeLinecap "round"
            ]
            []
        ]


iconGreenHeart : Html Msg
iconGreenHeart =
    svgIcon [ SvgAttr.fill "currentColor", SvgAttr.stroke "none" ]
        [ Svg.path [ SvgAttr.d "M10 17 C4 12 1 8 4 5 Q7 2 10 6 Q13 2 16 5 C19 8 16 12 10 17 Z" ] [] ]



-- MODEL


type alias Model =
    { uploadedImage : Maybe String
    , gridSize : Int
    , niceCounter : Int
    , imageWidth : Maybe Int
    , imageHeight : Maybe Int
    , gridColor : String
    , gridThickness : Int
    , gridOpacity : Float
    , language : Language
    , downloadSuccess : Bool
    , showDiagonals : Bool
    , showGrid : Bool
    , isProcessing : Bool
    , imageName : String
    , canShare : Bool
    , shareAfterProcess : Bool
    , adaptiveSensitivity : Float
    , entropyData : Maybe (List Float)
    , isAnalyzing : Bool
    , gridHue : Int
    }



-- MESSAGES


type alias PickedImage =
    { name : String, size : Int, dataUrl : String }


type Msg
    = PickImage
    | ImagePicked PickedImage
    | GridSizeChanged Int
    | NiceButtonClicked
    | ImageSizeLoaded Int Int
    | DownloadClicked
    | GriddedReady String
    | GridColorChanged String
    | GridHueChanged Int
    | GridThicknessChanged Int
    | GridOpacityChanged Float
    | LanguageChanged Language
    | ResetDownloadSuccess
    | ToggleDiagonals Bool
    | ToggleGridView
    | SettingsLoaded Settings
    | ResetProcessing
    | BrowserLanguageReceived String
    | ShareClicked
    | ShareSupportReceived Bool
    | AdaptiveSensitivityChanged Float
    | EntropyDataReceived (List Float)



-- GRID HELPER TYPES AND FUNCTIONS


type alias Settings =
    { gridSize : Int
    , gridColor : String
    , gridThickness : Int
    , gridOpacity : Float
    , showDiagonals : Bool
    }


type alias Dimensions =
    { width : Int
    , height : Int
    }


settingsFromModel : Model -> Settings
settingsFromModel model =
    { gridSize = model.gridSize
    , gridColor = model.gridColor
    , gridThickness = model.gridThickness
    , gridOpacity = model.gridOpacity
    , showDiagonals = model.showDiagonals
    }

type alias SubdividedCell =
    { row : Int
    , col : Int
    }


computeSubdividedCells : Int -> Float -> List Float -> List SubdividedCell
computeSubdividedCells gridSize sensitivity entropyList =
    let
        minE = List.minimum entropyList |> Maybe.withDefault 0
        maxE = List.maximum entropyList |> Maybe.withDefault 1
        range = maxE - minE
        threshold = 1.0 - sensitivity

        indexedEntropy =
            List.indexedMap Tuple.pair entropyList
    in
    if range < 0.01 then
        []
    else
        indexedEntropy
            |> List.filterMap
                (\( idx, e ) ->
                    let
                        normalized = (e - minE) / range
                    in
                    if normalized > threshold then
                        Just { row = idx // gridSize, col = modBy gridSize idx }
                    else
                        Nothing
                )


subdivisionLines : Settings -> Dimensions -> List SubdividedCell -> List (Svg msg)
subdivisionLines config dims cells =
    let
        cellWidth = toFloat dims.width / toFloat config.gridSize
        cellHeight = toFloat dims.height / toFloat config.gridSize
    in
    List.concatMap
        (\cell ->
            let
                x0 = toFloat cell.col * cellWidth
                y0 = toFloat cell.row * cellHeight
                midX = x0 + cellWidth / 2
                midY = y0 + cellHeight / 2
            in
            [ svgLine config midX y0 midX (y0 + cellHeight)
            , svgLine config x0 midY (x0 + cellWidth) midY
            ]
        )
        cells


svgLine : Settings -> Float -> Float -> Float -> Float -> Svg msg
svgLine config x1 y1 x2 y2 =
    Svg.line
        [ SvgAttr.x1 (String.fromFloat x1)
        , SvgAttr.y1 (String.fromFloat y1)
        , SvgAttr.x2 (String.fromFloat x2)
        , SvgAttr.y2 (String.fromFloat y2)
        , SvgAttr.stroke config.gridColor
        , SvgAttr.strokeWidth (String.fromInt config.gridThickness)
        , SvgAttr.opacity (String.fromFloat config.gridOpacity)
        ]
        []

-- Generate all grid lines (vertical, horizontal, and optionally diagonal)
allGridLines : Settings -> Dimensions -> List SubdividedCell -> List (Svg msg)
allGridLines config dims adaptiveCells =
    let
        cellWidth = toFloat dims.width / toFloat config.gridSize
        cellHeight = toFloat dims.height / toFloat config.gridSize

        verticalLines =
            List.range 0 config.gridSize
                |> List.map (\i -> svgLine config (toFloat i * cellWidth) 0 (toFloat i * cellWidth) (toFloat dims.height))

        horizontalLines =
            List.range 0 config.gridSize
                |> List.map (\i -> svgLine config 0 (toFloat i * cellHeight) (toFloat dims.width) (toFloat i * cellHeight))

        diagonals =
            if config.showDiagonals then
                List.range 0 (config.gridSize - 1)
                    |> List.concatMap
                        (\row ->
                            List.range 0 (config.gridSize - 1)
                                |> List.concatMap
                                    (\col ->
                                        let
                                            x0 = toFloat col * cellWidth
                                            y0 = toFloat row * cellHeight
                                            x1 = x0 + cellWidth
                                            y1 = y0 + cellHeight
                                        in
                                        [ svgLine config x0 y0 x1 y1
                                        , svgLine config x1 y0 x0 y1
                                        ]
                                    )
                        )
            else
                []
    in
    verticalLines ++ horizontalLines ++ diagonals ++ subdivisionLines config dims adaptiveCells



port requestPng : { url : String, width : Int, height : Int } -> Cmd msg


port receivePng : (String -> msg) -> Sub msg


port downloadImage : { dataUrl : String, fileName : String } -> Cmd msg


port setHtmlLang : String -> Cmd msg


port setHtmlDir : String -> Cmd msg


port saveSettings : Settings -> Cmd msg


port loadSettings : (Settings -> msg) -> Sub msg


port resetProcessing : (() -> msg) -> Sub msg


port getBrowserLanguage : (String -> msg) -> Sub msg


port shareImageData : { dataUrl : String, fileName : String } -> Cmd msg


port receiveShareSupport : (Bool -> msg) -> Sub msg


port requestEntropyAnalysis : { url : String, width : Int, height : Int, grid : Int } -> Cmd msg


port receiveEntropyData : (List Float -> msg) -> Sub msg


port showFileError : { title : String, message : String } -> Cmd msg


port pickImageFile : () -> Cmd msg


port receivePickedImage : (PickedImage -> msg) -> Sub msg


maxImageBytes : Int
maxImageBytes =
    15 * 1024 * 1024


downloadSuccessHoldMs : Float
downloadSuccessHoldMs =
    2000



-- INITIAL STATE


init : () -> ( Model, Cmd Msg )
init _ =
    ( { uploadedImage = Nothing
      , gridSize = 10
      , niceCounter = 0
      , imageWidth = Nothing
      , imageHeight = Nothing
      , gridColor = "#80ED99"
      , gridThickness = 1
      , gridOpacity = 1
      , language = English
      , downloadSuccess = False
      , showDiagonals = False
      , showGrid = True
      , isProcessing = False
      , imageName = "image"
      , canShare = False
      , shareAfterProcess = False
      , adaptiveSensitivity = 0
      , entropyData = Nothing
      , isAnalyzing = False
      , gridHue = 180
      }
    , Cmd.none
    )



-- HELPERS


withSave : Model -> ( Model, Cmd Msg )
withSave model =
    ( model, saveSettings (settingsFromModel model) )


canAnalyze : Model -> Bool
canAnalyze model =
    case ( model.uploadedImage, model.imageWidth, model.imageHeight ) of
        ( Just _, Just _, Just _ ) ->
            True

        _ ->
            False


requestEntropy : Model -> Cmd Msg
requestEntropy model =
    case ( model.uploadedImage, model.imageWidth, model.imageHeight ) of
        ( Just url, Just w, Just h ) ->
            requestEntropyAnalysis { url = url, width = w, height = h, grid = model.gridSize }

        _ ->
            Cmd.none


triggerProcessing : Bool -> Model -> ( Model, Cmd Msg )
triggerProcessing shareAfterProcess model =
    case ( model.uploadedImage, model.imageWidth, model.imageHeight ) of
        ( Just url, Just w, Just h ) ->
            ( { model | isProcessing = True, shareAfterProcess = shareAfterProcess }
            , requestPng { url = url, width = w, height = h }
            )

        _ ->
            ( model, Cmd.none )


type alias LanguageInfo =
    { code : String
    , id : String
    , displayName : String
    , dir : String
    }


languageMeta : Language -> LanguageInfo
languageMeta language =
    case language of
        English ->
            { code = "en", id = "english", displayName = "English", dir = "ltr" }

        Spanish ->
            { code = "es", id = "spanish", displayName = "Español", dir = "ltr" }

        Latin ->
            { code = "la", id = "latin", displayName = "Latin", dir = "ltr" }

        Italian ->
            { code = "it", id = "italian", displayName = "Italiano", dir = "ltr" }

        Portuguese ->
            { code = "pt", id = "portuguese", displayName = "Português", dir = "ltr" }

        French ->
            { code = "fr", id = "french", displayName = "Français", dir = "ltr" }

        Asturiano ->
            { code = "ast", id = "asturiano", displayName = "Asturianu", dir = "ltr" }

        Gaelic ->
            { code = "gd", id = "gaelic", displayName = "Gàidhlig", dir = "ltr" }

        Euskara ->
            { code = "eu", id = "euskara", displayName = "Euskara", dir = "ltr" }

        Japanese ->
            { code = "ja", id = "japanese", displayName = "日本語", dir = "ltr" }

        Russian ->
            { code = "ru", id = "russian", displayName = "Русский", dir = "ltr" }

        Tuvan ->
            { code = "tyv", id = "tuvan", displayName = "Тыва дыл", dir = "ltr" }

        Amharic ->
            { code = "am", id = "amharic", displayName = "አማርኛ", dir = "ltr" }

        Hebrew ->
            { code = "he", id = "hebrew", displayName = "עברית", dir = "rtl" }


isValidHexColor : String -> Bool
isValidHexColor s =
    String.length s == 7
        && String.startsWith "#" s
        && String.all Char.isHexDigit (String.dropLeft 1 s)


hexDigitValue : Char -> Int
hexDigitValue c =
    case Char.toUpper c of
        '0' -> 0
        '1' -> 1
        '2' -> 2
        '3' -> 3
        '4' -> 4
        '5' -> 5
        '6' -> 6
        '7' -> 7
        '8' -> 8
        '9' -> 9
        'A' -> 10
        'B' -> 11
        'C' -> 12
        'D' -> 13
        'E' -> 14
        'F' -> 15
        _ -> 0


parseHexByte : String -> Int
parseHexByte s =
    case String.toList s of
        [ hi, lo ] ->
            hexDigitValue hi * 16 + hexDigitValue lo

        _ ->
            0


hexToHue : String -> Maybe Int
hexToHue hex =
    if not (isValidHexColor hex) then
        Nothing
    else
        let
            r = toFloat (parseHexByte (String.slice 1 3 hex)) / 255
            g = toFloat (parseHexByte (String.slice 3 5 hex)) / 255
            b = toFloat (parseHexByte (String.slice 5 7 hex)) / 255
            cmax = Basics.max r (Basics.max g b)
            cmin = Basics.min r (Basics.min g b)
            delta = cmax - cmin
        in
        if delta == 0 then
            Nothing
        else
            let
                rawHue =
                    if cmax == r then
                        60 * ((g - b) / delta)
                    else if cmax == g then
                        60 * ((b - r) / delta + 2)
                    else
                        60 * ((r - g) / delta + 4)
            in
            Just (round (if rawHue < 0 then rawHue + 360 else rawHue))


hslToHex : Int -> String
hslToHex hue =
    let
        hueNorm = toFloat hue / 360
        sat = 0.85
        light = 0.55

        hueToChannel lo hi hueOffset =
            let
                wrapped =
                    if hueOffset < 0 then hueOffset + 1
                    else if hueOffset > 1 then hueOffset - 1
                    else hueOffset
            in
            if wrapped < 1 / 6 then lo + (hi - lo) * 6 * wrapped
            else if wrapped < 1 / 2 then hi
            else if wrapped < 2 / 3 then lo + (hi - lo) * (2 / 3 - wrapped) * 6
            else lo

        upper = if light < 0.5 then light * (1 + sat) else light + sat - light * sat
        lower = 2 * light - upper

        r = round (hueToChannel lower upper (hueNorm + 1 / 3) * 255)
        g = round (hueToChannel lower upper hueNorm * 255)
        b = round (hueToChannel lower upper (hueNorm - 1 / 3) * 255)

        toHex2 n =
            let
                hexChar c = String.slice c (c + 1) "0123456789ABCDEF"
            in
            hexChar (n // 16) ++ hexChar (modBy 16 n)
    in
    "#" ++ toHex2 r ++ toHex2 g ++ toHex2 b


currentAdaptiveCells : Model -> List SubdividedCell
currentAdaptiveCells model =
    if model.adaptiveSensitivity > 0 then
        model.entropyData
            |> Maybe.map (computeSubdividedCells model.gridSize model.adaptiveSensitivity)
            |> Maybe.withDefault []
    else
        []



-- UPDATE


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        PickImage ->
            ( model, pickImageFile () )

        ImagePicked picked ->
            if picked.size > maxImageBytes then
                ( model
                , showFileError
                    { title = "File Too Large"
                    , message = translate model.language I18n.FileTooLarge
                    }
                )
            else
                ( { model
                    | uploadedImage = Just picked.dataUrl
                    , imageName = picked.name
                    , imageWidth = Nothing
                    , imageHeight = Nothing
                    , entropyData = Nothing
                  }
                , Cmd.none
                )

        GridSizeChanged size ->
            let
                willAnalyze = model.adaptiveSensitivity > 0 && canAnalyze model
                newModel = { model | gridSize = size, entropyData = Nothing, isAnalyzing = willAnalyze }
                entropyCmd =
                    if willAnalyze then
                        requestEntropy newModel
                    else
                        Cmd.none
            in
            ( newModel, Cmd.batch [ saveSettings (settingsFromModel newModel), entropyCmd ] )

        GridColorChanged color ->
            if isValidHexColor color then
                let
                    syncedHue = Maybe.withDefault model.gridHue (hexToHue color)
                in
                withSave { model | gridColor = color, gridHue = syncedHue }
            else
                ( model, Cmd.none )

        GridHueChanged hue ->
            withSave { model | gridColor = hslToHex hue, gridHue = hue }

        GridThicknessChanged thickness ->
            withSave { model | gridThickness = thickness }

        GridOpacityChanged opacity ->
            withSave { model | gridOpacity = opacity }

        NiceButtonClicked ->
            ( { model | niceCounter = model.niceCounter + 1 }, Cmd.none )

        ImageSizeLoaded width height ->
            let
                newModel = { model | imageWidth = Just width, imageHeight = Just height }
                willAnalyze = model.adaptiveSensitivity > 0 && canAnalyze newModel
                entropyCmd =
                    if willAnalyze then
                        requestEntropy newModel
                    else
                        Cmd.none
            in
            ( { newModel | isAnalyzing = willAnalyze }, entropyCmd )

        LanguageChanged newLanguage ->
            let
                meta = languageMeta newLanguage
            in
            ( { model | language = newLanguage }
            , Cmd.batch [ setHtmlLang meta.code, setHtmlDir meta.dir ]
            )

        ResetDownloadSuccess ->
            ( { model | downloadSuccess = False }, Cmd.none )

        ToggleDiagonals value ->
            withSave { model | showDiagonals = value }

        ToggleGridView ->
            ( { model | showGrid = not model.showGrid }, Cmd.none )

        SettingsLoaded settings ->
            ( { model
                | gridSize = settings.gridSize
                , gridColor = settings.gridColor
                , gridThickness = settings.gridThickness
                , gridOpacity = settings.gridOpacity
                , showDiagonals = settings.showDiagonals
                , gridHue = Maybe.withDefault model.gridHue (hexToHue settings.gridColor)
              }
            , Cmd.none
            )

        ResetProcessing ->
            ( { model | isProcessing = False }, Cmd.none )

        BrowserLanguageReceived langCode ->
            let
                detectedLanguage =
                    allLanguages
                        |> List.filter (\lang -> String.startsWith (languageMeta lang).code langCode)
                        |> List.head
                        |> Maybe.withDefault English

                meta = languageMeta detectedLanguage
            in
            ( { model | language = detectedLanguage }
            , Cmd.batch [ setHtmlLang meta.code, setHtmlDir meta.dir ]
            )

        DownloadClicked ->
            triggerProcessing False model

        ShareClicked ->
            triggerProcessing True model

        GriddedReady dataUrl ->
            let
                fileName = model.imageName ++ "-gridded.png"
                action =
                    if model.shareAfterProcess then
                        shareImageData { dataUrl = dataUrl, fileName = fileName }
                    else
                        downloadImage { dataUrl = dataUrl, fileName = fileName }
            in
            ( { model | downloadSuccess = True, isProcessing = False, shareAfterProcess = False }
            , Cmd.batch
                [ action
                , Task.perform (\_ -> ResetDownloadSuccess) (Process.sleep downloadSuccessHoldMs)
                ]
            )

        ShareSupportReceived supported ->
            ( { model | canShare = supported }, Cmd.none )

        AdaptiveSensitivityChanged value ->
            if value > 0 then
                let
                    willAnalyze = model.entropyData == Nothing && canAnalyze model
                    newModel = { model | adaptiveSensitivity = value, isAnalyzing = willAnalyze }
                in
                ( newModel
                , if willAnalyze then requestEntropy newModel else Cmd.none
                )
            else
                ( { model | adaptiveSensitivity = 0, entropyData = Nothing, isAnalyzing = False }, Cmd.none )

        EntropyDataReceived data ->
            ( { model | entropyData = Just data, isAnalyzing = False }, Cmd.none )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.batch
        [ receivePng GriddedReady
        , loadSettings SettingsLoaded
        , resetProcessing (\_ -> ResetProcessing)
        , getBrowserLanguage BrowserLanguageReceived
        , receiveShareSupport ShareSupportReceived
        , receiveEntropyData EntropyDataReceived
        , receivePickedImage ImagePicked
        ]



-- VIEW


view : Model -> Html Msg
view model =
    div [ class "page-wrapper" ]
        [ div [ class "app-container" ]
            [ viewHeader model
            , Html.node "main" [ class "main-content", id "main-content" ]
                [ viewPreviewRegion model
                , viewCardRegion model
                ]
            , viewWhatsThisAbout model
            ]
        , viewFooter model
        ]



-- VIEW COMPONENTS


viewHeader : Model -> Html Msg
viewHeader model =
    Html.node "header" [ class "app-header" ]
        [ div [ class "header-content" ]
            [ h1 [ class "app-title" ] [ text "Gridit, baby! ", iconFrogSized "30" ]
            , p [ class "app-subtitle" ] [ text (translate model.language I18n.AppSubtitle) ]
            ]
        , viewLanguageSelector model.language
        ]


viewWhatsThisAbout : Model -> Html Msg
viewWhatsThisAbout model =
    div [ class "about-section" ]
        [ h2 [ class "about-title" ] [ text (translate model.language I18n.WhatsGridit) ]
        , p [ class "about-text" ] [ text (translate model.language I18n.WhatsThisDescription) ]
        , p [ class "about-text about-curious" ]
            [ text (translate model.language I18n.CuriousAboutGrids) ]
        , p [ class "about-text about-links" ]
            [ a
                [ href "https://en.wikipedia.org/wiki/Grid_(graphic_design)"
                , target "_blank"
                , rel "noopener noreferrer"
                ]
                [ text "Grid in graphic design" ]
            , text " \u{00B7} "
            , a
                [ href "https://en.wikipedia.org/wiki/Grid_method"
                , target "_blank"
                , rel "noopener noreferrer"
                ]
                [ text "The grid method" ]
            , text " \u{00B7} "
            , a
                [ href "https://en.wikipedia.org/wiki/Scaling_(geometry)"
                , target "_blank"
                , rel "noopener noreferrer"
                ]
                [ text "Scaling in geometry" ]
            , text " \u{00B7} "
            , a
                [ href "https://gurneyjourney.blogspot.com/2009/11/scaling-up-with-grid.html"
                , target "_blank"
                , rel "noopener noreferrer"
                ]
                [ text "Gurney Journey: Scaling up" ]
            , text " \u{00B7} "
            , a
                [ href "https://www.gadsbys.co.uk/drawing-scaling-up-an-image-using-a-grid/"
                , target "_blank"
                , rel "noopener noreferrer"
                ]
                [ text "Gadsbys: Using a grid" ]
            ]
        ]



-- PREVIEW REGION (always visible)


viewPreviewRegion : Model -> Html Msg
viewPreviewRegion model =
    div [ class "preview-region" ]
        [ viewGridPreview model
        , case model.uploadedImage of
            Just _ ->
                div [ class "grid-toggle-container" ]
                    [ label [ class "light-switch" ]
                        [ input
                            [ type_ "checkbox"
                            , Html.Attributes.checked model.showGrid
                            , onClick ToggleGridView
                            , class "light-switch-input sr-only"
                            , attribute "aria-label" (if model.showGrid then translate model.language I18n.HideGrid else translate model.language I18n.ShowGrid)
                            ]
                            []
                        , span [ class "light-switch-track" ]
                            [ span [ class "light-switch-thumb" ] [ iconGrid ] ]
                        , span [ class "light-switch-label" ] [ text (if model.showGrid then translate model.language I18n.HideGrid else translate model.language I18n.ShowGrid) ]
                        ]
                    ]

            Nothing ->
                text ""
        ]


viewGridPreview : Model -> Html Msg
viewGridPreview model =
    div [ class "preview-card" ]
        [ case model.uploadedImage of
            Just _ ->
                viewGriddedImage model

            Nothing ->
                div [ class "preview-placeholder" ]
                    [ Svg.svg
                        [ SvgAttr.class "placeholder-grid-background"
                        , SvgAttr.width "100%"
                        , SvgAttr.height "100%"
                        , SvgAttr.preserveAspectRatio "xMidYMid slice"
                        , attribute "aria-hidden" "true"
                        ]
                        [ Svg.defs []
                            [ Svg.pattern
                                [ SvgAttr.id "placeholderGrid"
                                , SvgAttr.width "40"
                                , SvgAttr.height "40"
                                , SvgAttr.patternUnits "userSpaceOnUse"
                                ]
                                [ Svg.path
                                    [ SvgAttr.d "M 40 0 L 0 0 0 40"
                                    , SvgAttr.fill "none"
                                    , SvgAttr.stroke "#80ED99"
                                    , SvgAttr.strokeWidth "1"
                                    , SvgAttr.opacity "0.3"
                                    ]
                                    []
                                ]
                            ]
                        , Svg.rect
                            [ SvgAttr.width "100%"
                            , SvgAttr.height "100%"
                            , SvgAttr.fill "url(#placeholderGrid)"
                            ]
                            []
                        ]
                    , div [ class "placeholder-content" ]
                        [ span [ class "placeholder-icon" ] [ iconFrogLarge ]
                        , p [ class "placeholder-text" ] [ text (translate model.language I18n.UploadPlaceholder) ]
                        ]
                    ]
        ]



-- CARD REGION (single card, cross-fades between upload and controls)


viewCardRegion : Model -> Html Msg
viewCardRegion model =
    div [ class "card-region" ]
        [ case model.uploadedImage of
            Nothing ->
                viewUploadFace model

            Just _ ->
                viewControlsFace model
        ]


viewUploadFace : Model -> Html Msg
viewUploadFace model =
    div [ class "card card-face" ]
        [ button
            [ class "button button-upload button-upload--prominent"
            , onClick PickImage
            , attribute "data-testid" "upload-button"
            ]
            [ text (translate model.language I18n.ChooseFile), text " ", iconUpload ]
        , p [ class "card-text-small" ]
            [ text (translate model.language I18n.MaxFileSize ++ " \u{2022} " ++ translate model.language I18n.SupportedFormats) ]
        , p [ class "privacy-note" ] [ iconLock, text " ", text (translate model.language I18n.ImagePrivacy) ]
        ]


viewControlsFace : Model -> Html Msg
viewControlsFace model =
    div [ class "card card-face" ]
        [ h3 [ class "card-section-title" ] [ text (translate model.language I18n.GridSettings) ]
        , div [ class "grid-controls-grid" ]
            [ viewSizeControl model
            , viewDiagonalsToggle model
            , viewColorControl model
            , viewOpacityControl model
            , viewThicknessControl model
            , viewAdaptiveControl model
            ]
        , viewActionButtons model
        , button
            [ class "change-image-link"
            , onClick PickImage
            ]
            [ iconUpload, text (" " ++ translate model.language I18n.ChangeImage) ]
        ]


type alias SliderControl =
    { id : String
    , labelContent : List (Html Msg)
    , value : String
    , min : String
    , max : String
    , maybeStep : Maybe String
    , onChange : String -> Msg
    , sliderClass : String
    , valueDisplay : Html Msg
    , extra : List (Html Msg)
    }


viewSliderControl : SliderControl -> Html Msg
viewSliderControl c =
    let
        baseAttrs =
            [ type_ "range"
            , id c.id
            , Html.Attributes.min c.min
            , Html.Attributes.max c.max
            , value c.value
            , onInput c.onChange
            , class c.sliderClass
            ]

        attrs =
            case c.maybeStep of
                Just s -> baseAttrs ++ [ step s ]
                Nothing -> baseAttrs
    in
    div [ class "control-group" ]
        ([ div [ class "control-header" ]
            [ label [ class "control-label", for c.id ] c.labelContent
            , c.valueDisplay
            ]
         , input attrs []
         ]
            ++ c.extra
        )


viewSizeControl : Model -> Html Msg
viewSizeControl model =
    viewSliderControl
        { id = "grid-size-input"
        , labelContent = [ text (translate model.language I18n.GridSize) ]
        , value = String.fromInt model.gridSize
        , min = "2"
        , max = "32"
        , maybeStep = Nothing
        , onChange = \s -> GridSizeChanged (Maybe.withDefault 10 (String.toInt s))
        , sliderClass = "slider"
        , valueDisplay = span [ class "control-value" ] [ text (String.fromInt model.gridSize ++ "x" ++ String.fromInt model.gridSize) ]
        , extra = []
        }


viewOpacityControl : Model -> Html Msg
viewOpacityControl model =
    viewSliderControl
        { id = "grid-opacity-input"
        , labelContent = [ text (translate model.language I18n.GridOpacity) ]
        , value = String.fromFloat model.gridOpacity
        , min = "0.1"
        , max = "1"
        , maybeStep = Just "0.1"
        , onChange = \s -> GridOpacityChanged (Maybe.withDefault 0.5 (String.toFloat s))
        , sliderClass = "slider"
        , valueDisplay = span [ class "control-value" ] [ text (String.fromInt (round (model.gridOpacity * 100)) ++ "%") ]
        , extra = []
        }


viewThicknessControl : Model -> Html Msg
viewThicknessControl model =
    viewSliderControl
        { id = "grid-thickness-input"
        , labelContent = [ text (translate model.language I18n.GridThickness) ]
        , value = String.fromInt model.gridThickness
        , min = "1"
        , max = "5"
        , maybeStep = Nothing
        , onChange = \s -> GridThicknessChanged (Maybe.withDefault 1 (String.toInt s))
        , sliderClass = "slider"
        , valueDisplay = span [ class "control-value" ] [ text (String.fromInt model.gridThickness ++ "px") ]
        , extra = []
        }


colorPreset : String -> String -> String -> Html Msg
colorPreset hex ariaLabel currentColor =
    let
        selected =
            String.toUpper currentColor == hex

        classes =
            if selected then
                "color-swatch color-swatch--selected"
            else
                "color-swatch"
    in
    button
        [ class classes
        , style "background-color" hex
        , onClick (GridColorChanged hex)
        , attribute "aria-label" ariaLabel
        ]
        []


viewColorControl : Model -> Html Msg
viewColorControl model =
    viewSliderControl
        { id = "grid-color-input"
        , labelContent = [ text (translate model.language I18n.GridColor) ]
        , value = String.fromInt model.gridHue
        , min = "0"
        , max = "360"
        , maybeStep = Nothing
        , onChange = \s -> GridHueChanged (Maybe.withDefault 180 (String.toInt s))
        , sliderClass = "slider slider--hue"
        , valueDisplay = span [ class "color-preview", style "background-color" model.gridColor ] []
        , extra =
            [ div [ class "color-presets" ]
                [ colorPreset "#000000" "Black" model.gridColor
                , colorPreset "#FFFFFF" "White" model.gridColor
                ]
            ]
        }


viewDiagonalsToggle : Model -> Html Msg
viewDiagonalsToggle model =
    div [ class "control-group" ]
        [ label [ class "light-switch" ]
            [ input
                [ type_ "checkbox"
                , Html.Attributes.checked model.showDiagonals
                , Html.Events.onCheck ToggleDiagonals
                , class "light-switch-input sr-only"
                , id "diagonals"
                ]
                []
            , span [ class "light-switch-track" ]
                [ span [ class "light-switch-thumb" ] [ iconDiagonals ] ]
            , span [ class "light-switch-label" ] [ text (translate model.language I18n.AddDiagonalLines) ]
            ]
        ]


viewAdaptiveControl : Model -> Html Msg
viewAdaptiveControl model =
    let
        analyzingIndicator =
            if model.isAnalyzing then
                span [ class "analyzing-indicator" ]
                    [ text (" " ++ translate model.language I18n.AnalyzingImage) ]
            else
                text ""

        valueText =
            if model.adaptiveSensitivity == 0 then
                translate model.language I18n.OffLabel
            else
                String.fromInt (round (model.adaptiveSensitivity * 100)) ++ "%"
    in
    viewSliderControl
        { id = "adaptive-density-input"
        , labelContent = [ text (translate model.language I18n.AdaptiveGridDensity), analyzingIndicator ]
        , value = String.fromFloat model.adaptiveSensitivity
        , min = "0"
        , max = "1"
        , maybeStep = Just "0.1"
        , onChange = \s -> AdaptiveSensitivityChanged (Maybe.withDefault 0 (String.toFloat s))
        , sliderClass = "slider"
        , valueDisplay = span [ class "control-value" ] [ text valueText ]
        , extra = []
        }


viewActionButtons : Model -> Html Msg
viewActionButtons model =
    div [ class "action-buttons-wrapper" ]
        [ div [ class "action-buttons" ]
            [ button
                [ class "button button-primary button-download"
                , onClick DownloadClicked
                , disabled (model.uploadedImage == Nothing || model.isProcessing)
                ]
                [ span [ class "button-icon" ] [ if model.downloadSuccess then iconCheck else iconDownload ]
                , text
                    (if model.downloadSuccess then
                        translate model.language I18n.Downloaded
                     else if model.isProcessing then
                        "..."
                     else
                        translate model.language I18n.DownloadGriddedImage
                    )
                ]
            , if model.canShare then
                button
                    [ class "button button-share"
                    , onClick ShareClicked
                    , disabled (model.uploadedImage == Nothing || model.isProcessing)
                    ]
                    [ span [ class "button-icon" ] [ iconShare ]
                    ]
              else
                text ""
            ]
        , div [ class "nice-section" ]
            [ button
                [ class "button button-nice"
                , onClick NiceButtonClicked
                , attribute "aria-label" (translate model.language I18n.Nice)
                ]
                [ iconHeart ]
            , if model.niceCounter > 0 then
                span [ class "nice-counter" ] [ text ("\u{00D7}" ++ String.fromInt model.niceCounter) ]
              else
                text ""
            ]
        ]


viewFooter : Model -> Html Msg
viewFooter model =
    Html.node "footer" [ class "app-footer" ]
        [ div [ class "footer-content" ]
            [ div [ class "tooltip-container", attribute "aria-describedby" "footer-tooltip" ]
                [ span [ class "footer-text-main" ] [ text (translate model.language I18n.MadeInArgentina ++ " "), span [ class "heart-success" ] [ iconGreenHeart ], text " (\u{2579}\u{25E1}\u{2579}\u{0E51})" ]
                , span [ class "tooltip-content", Html.Attributes.tabindex 0, id "footer-tooltip", attribute "role" "tooltip" ] [ text (translate model.language I18n.FooterTooltip) ]
                ]
            ]
        ]



-- LANGUAGE SELECTOR HELPERS


allLanguages : List Language
allLanguages =
    [ English, Spanish, Latin, Italian, Portuguese, French
    , Asturiano, Gaelic, Euskara, Japanese, Russian, Tuvan, Amharic, Hebrew
    ]


parseLanguage : String -> Language
parseLanguage langValue =
    allLanguages
        |> List.filter (\lang -> (languageMeta lang).id == langValue)
        |> List.head
        |> Maybe.withDefault English


viewLanguageSelector : Language -> Html Msg
viewLanguageSelector currentLanguage =
    let
        languageOption language =
            let
                meta = languageMeta language
            in
            option
                [ value meta.id
                , selected (currentLanguage == language)
                , attribute "aria-label" meta.displayName
                ]
                [ text (meta.displayName ++ " (" ++ String.toUpper meta.code ++ ")") ]

        handleLanguageChange langValue =
            LanguageChanged (parseLanguage langValue)
    in
    div [ class "language-selector compact" ]
        [ span [ class "globe-icon" ] [ iconGlobe ]
        , label
            [ for "language-select"
            , class "sr-only"
            ]
            [ text (translate currentLanguage I18n.LanguageLabel) ]
        , select
            [ id "language-select"
            , on "change" (Json.Decode.map handleLanguageChange (Json.Decode.at [ "target", "value" ] Json.Decode.string))
            , class "language-dropdown compact"
            , attribute "aria-label" (translate currentLanguage I18n.LanguageLabel)
            ]
            (List.map languageOption allLanguages)
        ]


viewGriddedImage : Model -> Html Msg
viewGriddedImage model =
    case ( model.uploadedImage, model.imageWidth, model.imageHeight ) of
        ( Just url, Just width, Just height ) ->
            let
                config = settingsFromModel model
                dims = { width = width, height = height }
                gridLines = allGridLines config dims (currentAdaptiveCells model)
            in
            div [ class "gridded-image-container" ]
                [ img
                    [ src url
                    , class "gridded-base-image"
                    , Html.Attributes.alt "Uploaded image with grid overlay"
                    ]
                    []
                , Svg.svg
                    [ SvgAttr.width (String.fromInt width)
                    , SvgAttr.height (String.fromInt height)
                    , SvgAttr.viewBox ("0 0 " ++ String.fromInt width ++ " " ++ String.fromInt height)
                    , SvgAttr.class
                        (if model.showGrid then
                            "grid-overlay"
                         else
                            "grid-overlay grid-overlay--hidden"
                        )
                    , attribute "aria-hidden" "true"
                    ]
                    gridLines
                ]

        ( Just url, _, _ ) ->
            -- Image is loading, show it to trigger onload and get dimensions
            div [ class "gridded-image-container" ]
                [ img
                    [ src url
                    , class "gridded-base-image loading"
                    , Html.Attributes.alt "Uploaded image with grid overlay"
                    , on "load" (decodeImageSize ImageSizeLoaded)
                    ]
                    []
                ]

        _ ->
            text (translate model.language I18n.NoImageYet)



decodeImageSize : (Int -> Int -> Msg) -> Json.Decode.Decoder Msg
decodeImageSize tagger =
    Json.Decode.map2 tagger
        (Json.Decode.at [ "target", "naturalWidth" ] Json.Decode.int)
        (Json.Decode.at [ "target", "naturalHeight" ] Json.Decode.int)


main : Program () Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }
