module Main exposing (..)

import Browser
import File exposing (File)
import File.Select as Select
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
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
    }



-- MESSAGES


type Msg
    = PickImage
    | ImageSelected File
    | ImageLoaded String
    | GridSizeChanged Int
    | NiceButtonClicked
    | ImageSizeLoaded Int Int



-- INITIAL STATE


init : Model
init =
    { uploadedImage = Nothing
    , gridSize = 10
    , niceCounter = 0
    , imageWidth = Nothing
    , imageHeight = Nothing
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

        NiceButtonClicked ->
            ( { model | niceCounter = model.niceCounter + 1 }, Cmd.none )
            
        ImageSizeLoaded width height ->
            ( { model | imageWidth = Just width, imageHeight = Just height }, Cmd.none )



-- VIEW


view : Model -> Html Msg
view model =
    div [ style "padding" "20px", style "background-color" "#ffcc99" ]
        [ h1 [ style "color" "green" ]
            [ text "Gridit! 🐸" ]
        , div []
            [ button [ onClick PickImage ] [ text "Upload Image" ] ]
        , div [ style "margin-top" "20px" ]
            [ text "Grid Size: "
            , input 
                [ type_ "range"
                , Html.Attributes.min "2"
                , Html.Attributes.max "50"
                , value (String.fromInt model.gridSize)
                , onInput (String.toInt >> Maybe.withDefault 10 >> GridSizeChanged)
                ] []
            , text (String.fromInt model.gridSize)
            ]
        , div [ style "display" "flex", style "flex-wrap" "wrap", style "gap" "20px", style "margin-top" "20px" ]
            [ div [ style "flex" "1", style "min-width" "300px" ]
                [ h3 [] [ text "Original Image" ]
                , viewPreview model.uploadedImage
                ]
            , div [ style "flex" "1", style "min-width" "300px" ]
                [ h3 [] [ text "Gridded Image" ]
                , viewGriddedImage model
                ]
            ]
        , div []
            [ button [ onClick NiceButtonClicked ] [ text "Nice! " ] ]
        , div [ style "margin-top" "20px" ]
            [ text ("Nice Counter: " ++ String.fromInt model.niceCounter) ]
        ]



-- HELPER FUNCTIONS


viewPreview : Maybe String -> Html Msg
viewPreview maybeUrl =
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
            text "No image yet! Click Upload Image to begin! (｀_´)ゞ Come on!!!"


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
                        |> List.map (\i -> 
                            let 
                                x = toFloat i * cellWidth
                            in
                            Svg.line
                                [ SvgAttr.x1 (String.fromFloat x)
                                , SvgAttr.y1 "0"
                                , SvgAttr.x2 (String.fromFloat x)
                                , SvgAttr.y2 (String.fromInt height)
                                , SvgAttr.stroke "rgba(255, 0, 0, 0.5)"
                                , SvgAttr.strokeWidth "1"
                                ]
                                []
                        )
                
                horizontalLines =
                    List.range 0 model.gridSize
                        |> List.map (\i -> 
                            let 
                                y = toFloat i * cellHeight
                            in
                            Svg.line
                                [ SvgAttr.x1 "0"
                                , SvgAttr.y1 (String.fromFloat y)
                                , SvgAttr.x2 (String.fromInt width)
                                , SvgAttr.y2 (String.fromFloat y)
                                , SvgAttr.stroke "rgba(255, 0, 0, 0.5)"
                                , SvgAttr.strokeWidth "1"
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
            text "No image uploaded yet!"


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
        , subscriptions = \_ -> Sub.none
        }
