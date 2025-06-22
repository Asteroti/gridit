port module Main exposing (..)

import Base64
import Browser
import Bytes exposing (Bytes)
import Bytes.Decode as BD
import Bytes.Encode as BE
import File exposing (File)
import File.Download
import File.Select as Select
import Html exposing (Html, button, div, h1, h2, h3, img, input, label, option, p, select, span, text)
import Html.Attributes exposing (disabled, for, id, max, min, placeholder, selected, src, step, style, type_, value)
import Html.Events exposing (on, onClick, onInput)
import I18n exposing (Language(..), TranslationKey(..), translate)
import Json.Decode
import Svg exposing (Svg)
import Svg.Attributes as SvgAttr
import Task



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
    }



-- MESSAGES


type Msg
    = PickImage
    | ImageSelected File
    | ImageLoaded String
    | GridSizeChanged Int
    | NiceButtonClicked
    | ImageSizeLoaded Int Int
    | DownloadClicked
    | GriddedReady String
    | GridColorChanged String
    | GridThicknessChanged Int
    | GridOpacityChanged Float
    | LanguageChanged Language



-- Debug port for logging


port debug : String -> Cmd msg


port requestPng : { url : String, width : Int, height : Int, grid : Int, color : String, thickness : Int, opacity : Float } -> Cmd msg


port receivePng : (String -> msg) -> Sub msg


port downloadImage : { dataUrl : String } -> Cmd msg



-- INITIAL STATE


init : Model
init =
    { uploadedImage = Nothing
    , gridSize = 10
    , niceCounter = 0
    , imageWidth = Nothing
    , imageHeight = Nothing
    , gridColor = "#80ED99"
    , gridThickness = 1
    , gridOpacity = 0.5
    , language = Spanish
    }



-- UPDATE


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        PickImage ->
            ( model, Select.file [ "image/*" ] ImageSelected )

        ImageSelected file ->
            ( model, Task.perform ImageLoaded (File.toUrl file) )

        ImageLoaded url ->
            ( { model | uploadedImage = Just url, imageWidth = Nothing, imageHeight = Nothing }, Cmd.none )

        GridSizeChanged size ->
            ( { model | gridSize = size }, Cmd.none )

        GridColorChanged color ->
            ( { model | gridColor = color }, Cmd.none )

        GridThicknessChanged thickness ->
            ( { model | gridThickness = thickness }, Cmd.none )

        GridOpacityChanged opacity ->
            ( { model | gridOpacity = opacity }, Cmd.none )

        NiceButtonClicked ->
            ( { model | niceCounter = model.niceCounter + 1 }, Cmd.none )

        ImageSizeLoaded width height ->
            ( { model | imageWidth = Just width, imageHeight = Just height }, Cmd.none )
            
        LanguageChanged newLanguage ->
            ( { model | language = newLanguage }, Cmd.none )

        DownloadClicked ->
            case ( model.uploadedImage, model.imageWidth, model.imageHeight ) of
                ( Just url, Just w, Just h ) ->
                    let
                        _ =
                            debug ("Elm: DownloadClicked with valid image data. Width: " ++ String.fromInt w ++ ", Height: " ++ String.fromInt h)

                        requestParams =
                            { url = url, width = w, height = h, grid = model.gridSize, color = model.gridColor, thickness = model.gridThickness, opacity = model.gridOpacity }
                    in
                    ( model, Cmd.batch [ debug "Elm: Sending requestPng command", requestPng requestParams ] )

                _ ->
                    ( model, debug "Elm: DownloadClicked but missing image data" )

        GriddedReady dataUrl ->
            -- Use JavaScript port to trigger download
            let
                _ =
                    debug ("Elm: GriddedReady received data URL of length: " ++ String.fromInt (String.length dataUrl))

                _ =
                    debug "Elm: Triggering download via downloadImage port"
            in
            ( model, Cmd.batch [ debug "Elm: Starting download...", downloadImage { dataUrl = dataUrl } ] )



-- SUBSCRIPTIONS


subscriptions _ =
    receivePng GriddedReady



-- VIEW


view : Model -> Html Msg
view model =
    div [ style "padding" "20px", style "background-color" "#ffcc99" ]
        [ div [ style "display" "flex", style "justify-content" "space-between", style "align-items" "center" ]
            [ h1 [ style "color" "green" ]
                [ text (translate model.language AppTitle) ]
            , viewLanguageSelector model.language
            ]
        , div []
            [ button [ onClick PickImage ] [ text (translate model.language UploadImage) ] ]

        -- GRID user customization section
        , div [ style "margin-top" "20px", style "padding" "15px", style "border" "2px solid #4a4a4a", style "border-radius" "8px" ]
            [ h3 [] [ text (translate model.language CustomizeIt) ]
            , div [ style "margin-bottom" "15px" ]
                [ text (translate model.language GridSize)
                , input
                    [ type_ "range"
                    , Html.Attributes.min "2"
                    , Html.Attributes.max "50"
                    , value (String.fromInt model.gridSize)
                    , onInput (String.toInt >> Maybe.withDefault 10 >> GridSizeChanged)
                    ]
                    []
                , text (" " ++ String.fromInt model.gridSize ++ translate model.language Rectangles)
                ]
            , div [ style "margin-bottom" "15px" ]
                [ text (translate model.language GridColor)
                , input
                    [ type_ "color"
                    , value model.gridColor
                    , onInput GridColorChanged
                    , style "margin-left" "10px"
                    , style "width" "50px"
                    , style "height" "30px"
                    ]
                    []
                , text (" " ++ model.gridColor)
                ]
            , div [ style "margin-bottom" "15px" ]
                [ text (translate model.language GridThickness)
                , input
                    [ type_ "range"
                    , Html.Attributes.min "1"
                    , Html.Attributes.max "10"
                    , value (String.fromInt model.gridThickness)
                    , onInput (String.toInt >> Maybe.withDefault 1 >> GridThicknessChanged)
                    ]
                    []
                , text (" " ++ String.fromInt model.gridThickness ++ "px")
                ]
            , div [ style "margin-bottom" "15px" ]
                [ text (translate model.language GridOpacity)
                , input
                    [ type_ "range"
                    , Html.Attributes.min "0"
                    , Html.Attributes.max "1"
                    , Html.Attributes.step "0.1"
                    , value (String.fromFloat model.gridOpacity)
                    , onInput (String.toFloat >> Maybe.withDefault 1 >> GridOpacityChanged)
                    ]
                    []
                , text (" " ++ String.fromInt (round (model.gridOpacity * 100)) ++ "%")
                ]
            ]
        , div [ style "display" "flex", style "flex-wrap" "wrap", style "gap" "20px", style "margin-top" "20px" ]
            [ div [ style "flex" "1", style "min-width" "300px" ]
                [ h3 [] [ text (translate model.language OriginalImage) ]
                , viewPreview model.uploadedImage model.language
                ]
            , div [ style "flex" "1", style "min-width" "300px" ]
                [ h3 [] [ text (translate model.language GriddedImage) ]
                , viewGriddedImage model
                , button [ onClick DownloadClicked, disabled (model.uploadedImage == Nothing) ] [ text (translate model.language DownloadGriddedImage) ]
                ]
            ]
        , div []
            [ button [ onClick NiceButtonClicked ] [ text (translate model.language Nice) ] ]
        , div [ style "margin-top" "20px" ]
            [ text (translate model.language NiceCounter ++ String.fromInt model.niceCounter) ]
        ]



-- HELPER FUNCTIONS


viewLanguageSelector : Language -> Html Msg
viewLanguageSelector currentLanguage =
    let
        languageOption language displayName =
            option 
                [ value (languageToString language)
                , selected (currentLanguage == language)
                ]
                [ text displayName ]
                
        languageToString language =
            case language of
                English -> "english"
                Spanish -> "spanish"
                Latin -> "latin"
                Italian -> "italian"
                Portuguese -> "portuguese"
                French -> "french"
                Asturiano -> "asturiano"
                Gaelic -> "gaelic"
                Euskara -> "euskara"
                Japanese -> "japanese"
                
        handleLanguageChange value =
            case value of
                "english" -> LanguageChanged English
                "spanish" -> LanguageChanged Spanish
                "latin" -> LanguageChanged Latin
                "italian" -> LanguageChanged Italian
                "portuguese" -> LanguageChanged Portuguese
                "french" -> LanguageChanged French
                "asturiano" -> LanguageChanged Asturiano
                "gaelic" -> LanguageChanged Gaelic
                "euskara" -> LanguageChanged Euskara
                "japanese" -> LanguageChanged Japanese
                _ -> LanguageChanged English
    in
    div [ style "display" "flex", style "align-items" "center", style "gap" "10px" ]
        [ span [] [ text (translate currentLanguage LanguageLabel ++ " ") ]
        , select 
            [ on "change" (Json.Decode.map handleLanguageChange (Json.Decode.at ["target", "value"] Json.Decode.string))
            , style "padding" "5px"
            , style "border-radius" "4px"
            , style "border" "1px solid #ccc"
            , style "background-color" "#f8f8f8"
            , style "cursor" "pointer"
            ]
            [ languageOption English "English"
            , languageOption Spanish "Español"
            , languageOption Latin "Latin"
            , languageOption Italian "Italiano"
            , languageOption Portuguese "Português"
            , languageOption French "Français"
            , languageOption Asturiano "Asturianu"
            , languageOption Gaelic "Gàidhlig"
            , languageOption Euskara "Euskara"
            , languageOption Japanese "日本語"
            ]
        ]


viewPreview : Maybe String -> Language -> Html Msg
viewPreview maybeUrl language =
    case maybeUrl of
        Just url ->
            img
                [ src url
                , style "max-width" "500px"
                , style "margin-top" "20px"
                , on "load" (decodeImageSize ImageSizeLoaded)
                ]
                []

        Nothing ->
            text (translate language NoImageYet)


viewGriddedImage : Model -> Html Msg
viewGriddedImage model =
    case ( model.uploadedImage, model.imageWidth, model.imageHeight ) of
        ( Just url, Just width, Just height ) ->
            let
                -- cells
                -- interlinked
                -- within cells interlinked
                cellWidth =
                    toFloat width / toFloat model.gridSize

                cellHeight =
                    toFloat height / toFloat model.gridSize

                verticalLines =
                    List.range 0 model.gridSize
                        |> List.map
                            (\i ->
                                let
                                    x =
                                        toFloat i * cellWidth
                                in
                                Svg.line
                                    [ SvgAttr.x1 (String.fromFloat x)
                                    , SvgAttr.y1 "0"
                                    , SvgAttr.x2 (String.fromFloat x)
                                    , SvgAttr.y2 (String.fromInt height)
                                    , SvgAttr.stroke model.gridColor
                                    , SvgAttr.strokeWidth (String.fromInt model.gridThickness)
                                    , SvgAttr.opacity (String.fromFloat model.gridOpacity)
                                    ]
                                    []
                            )

                horizontalLines =
                    List.range 0 model.gridSize
                        |> List.map
                            (\i ->
                                let
                                    y =
                                        toFloat i * cellHeight
                                in
                                Svg.line
                                    [ SvgAttr.x1 "0"
                                    , SvgAttr.y1 (String.fromFloat y)
                                    , SvgAttr.x2 (String.fromInt width)
                                    , SvgAttr.y2 (String.fromFloat y)
                                    , SvgAttr.stroke model.gridColor
                                    , SvgAttr.strokeWidth (String.fromInt model.gridThickness)
                                    , SvgAttr.opacity (String.fromFloat model.gridOpacity)
                                    ]
                                    []
                            )
            in
            div [ style "position" "relative", style "display" "inline-block" ]
                [ img
                    [ src url
                    , style "max-width" "500px"
                    , style "display" "block"
                    ]
                    []
                , Svg.svg
                    [ SvgAttr.width (String.fromInt width)
                    , SvgAttr.height (String.fromInt height)
                    , SvgAttr.viewBox ("0 0 " ++ String.fromInt width ++ " " ++ String.fromInt height)
                    , style "position" "absolute"
                    , style "top" "0"
                    , style "left" "0"
                    , style "width" "100%"
                    , style "height" "100%"
                    , style "pointer-events" "none"
                    ]
                    (verticalLines ++ horizontalLines)
                ]

        _ ->
            text (translate model.language NoImageYet)


dataUrlToBytes : String -> Maybe Bytes
dataUrlToBytes dataUrl =
    -- Extract the base64 data from the data URL
    case String.split "," dataUrl of
        -- Data URLs have the format: data:[<mediatype>][;base64],<data>
        [ _, base64Data ] ->
            case Base64.decode base64Data of
                Ok decodedString ->
                    -- Convert the decoded string to bytes
                    let
                        -- Get string length
                        length =
                            String.length decodedString

                        -- Convert each character to its byte value
                        bytes =
                            String.toList decodedString
                                |> List.map (\c -> Char.toCode c)
                                |> List.map BE.unsignedInt8
                                |> BE.sequence
                                |> BE.encode
                    in
                    Just bytes

                Err _ ->
                    Nothing

        _ ->
            Nothing


decodeImageSize : (Int -> Int -> Msg) -> Json.Decode.Decoder Msg
decodeImageSize tagger =
    Json.Decode.map2 tagger
        (Json.Decode.at [ "target", "naturalWidth" ] Json.Decode.int)
        (Json.Decode.at [ "target", "naturalHeight" ] Json.Decode.int)


main =
    Browser.element
        { init = \() -> ( init, Cmd.none )
        , view = view
        , update = update
        , subscriptions = subscriptions
        }
