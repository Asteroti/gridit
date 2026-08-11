port module Main exposing (..)

import Browser
import Browser.Events
import Dict
import Html exposing (Html, a, button, div, h1, h2, h3, img, input, label, option, p, select, span, strong, text)
import Html.Attributes exposing (attribute, class, disabled, for, href, id, max, min, rel, selected, src, step, style, target, type_, value)
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


iconExternal : Html msg
iconExternal =
    svgIcon
        [ SvgAttr.width "12"
        , SvgAttr.height "12"
        , SvgAttr.class "svg-icon link-external"
        ]
        [ Svg.path [ SvgAttr.d "M9 4 H4 V16 H16 V11", SvgAttr.strokeLinecap "round", SvgAttr.strokeLinejoin "round" ] []
        , Svg.path [ SvgAttr.d "M11 3 H17 V9", SvgAttr.strokeLinecap "round", SvgAttr.strokeLinejoin "round" ] []
        , Svg.path [ SvgAttr.d "M10 10 L17 3", SvgAttr.strokeLinecap "round" ] []
        ]


iconGreenHeart : Html Msg
iconGreenHeart =
    svgIcon [ SvgAttr.fill "currentColor", SvgAttr.stroke "none" ]
        [ Svg.path [ SvgAttr.d "M10 17 C4 12 1 8 4 5 Q7 2 10 6 Q13 2 16 5 C19 8 16 12 10 17 Z" ] [] ]



-- MODEL


-- Grid dimensions are independent (rows × cols) but coupled in Auto mode
-- where a single slider sets both. Custom mode lets them diverge.
-- Persisted as a String ("Auto" | "Custom") to cross the Elm/JS port boundary.


type alias Model =
    { uploadedImage : Maybe String
    , gridRows : Int
    , gridCols : Int
    , gridMode : String
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
    , counters : Maybe Counters
    , showRateLimitToast : Bool
    , showCellLabels : Bool
    , imageDisplayedWidth : Maybe Float
    , imageDisplayedHeight : Maybe Float
    , canvasWidthCm : Maybe Float
    , canvasHeightCm : Maybe Float
    , imageFit : String
    , sliceMode : String
    , imageOffsetX : Float
    , imageOffsetY : Float
    , imageScale : Float
    , isDraggingImage : Bool
    , dragStartX : Float
    , dragStartY : Float
    , dragSvgWidthPx : Float
    , dragSvgHeightPx : Float
    , cellLabelSize : Int
    , showCommunityDisclaimer : Bool
    }


type alias CountryCount =
    { country : String, count : Int }


type alias Counters =
    { totalDownloaded : Int
    , totalHearted : Int
    , totalCountries : Int
    , heartsByCountry : List CountryCount
    , griddersByCountry : List CountryCount
    , spotlight : CountryCount
    , yourCountry : String
    }



-- MESSAGES


type alias PickedImage =
    { name : String, size : Int, dataUrl : String }


type Msg
    = PickImage
    | ImagePicked PickedImage
    | GridSizeChanged Int
    | GridRowsChanged Int
    | GridColsChanged Int
    | GridModeChanged String
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
    | ToggleCellLabels Bool
    | CellLabelSizeChanged Int
    | ToggleCommunityDisclaimer
    | ImageDisplaySizeReceived { width : Float, height : Float }
    | CanvasWidthCmChanged String
    | CanvasHeightCmChanged String
    | ClearCanvasCm
    | SnapToFiveCmCells
    | ImageFitChanged String
    | SliceModeChanged String
    | ImageDragStart Float Float Float Float
    | ImageDragMove Float Float
    | ImageDragEnd
    | ImageScaleChanged Float
    | ResetImagePosition
    | ToggleGridView
    | SettingsLoaded Settings
    | ResetProcessing
    | BrowserLanguageReceived String
    | ShareClicked
    | ShareSupportReceived Bool
    | AdaptiveSensitivityChanged Float
    | EntropyDataReceived (List Float)
    | CountersReceived Counters
    | RateLimited
    | DismissRateLimit



-- GRID HELPER TYPES AND FUNCTIONS


type alias Settings =
    { gridRows : Int
    , gridCols : Int
    , gridMode : String
    , gridColor : String
    , gridThickness : Int
    , gridOpacity : Float
    , showDiagonals : Bool
    , showCellLabels : Bool
    , canvasWidthCm : Maybe Float
    , canvasHeightCm : Maybe Float
    , imageFit : String
    , sliceMode : String
    , imageOffsetX : Float
    , imageOffsetY : Float
    , imageScale : Float
    , cellLabelSize : Int
    }


type alias Dimensions =
    { width : Int
    , height : Int
    }


settingsFromModel : Model -> Settings
settingsFromModel model =
    { gridRows = model.gridRows
    , gridCols = model.gridCols
    , gridMode = model.gridMode
    , gridColor = model.gridColor
    , gridThickness = model.gridThickness
    , gridOpacity = model.gridOpacity
    , showDiagonals = model.showDiagonals
    , showCellLabels = model.showCellLabels
    , canvasWidthCm = model.canvasWidthCm
    , canvasHeightCm = model.canvasHeightCm
    , imageFit = model.imageFit
    , sliceMode = model.sliceMode
    , imageOffsetX = model.imageOffsetX
    , imageOffsetY = model.imageOffsetY
    , imageScale = model.imageScale
    , cellLabelSize = model.cellLabelSize
    }

type alias SubdividedCell =
    { row : Int
    , col : Int
    , depth : Int -- 1 = split the cell 2×2, 2 = split it 4×4
    }


-- How an artist grids a reference: flat background gets nothing, a detailed
-- face gets subdivided — and its busiest parts subdivided AGAIN. This is
-- quadtree decomposition (split where detail is high, recurse into the
-- busiest quarters), done to a fixed max depth of 2 so the preview stays
-- readable.
--
-- Entropy is sampled at a fixed `entropyGridSize × entropyGridSize`
-- resolution (see the constant below), independent of display rows/cols, so
-- the analysis survives grid-size changes without re-running. Samples are
-- aggregated onto the user's MAIN grid and cells are RANKED by average
-- entropy:
--   * cells below a floor (calm background) are never subdivided
--   * sensitivity picks what fraction of the busy cells get split 2×2
--   * past 50%, the busiest of those get split again (4×4)
-- Rank-based so every slider step adds lines; a near-uniform image yields
-- nothing (there is no "busiest" spot worth marking).
computeMainGridCells : Int -> { rows : Int, cols : Int } -> Float -> List Float -> List SubdividedCell
computeMainGridCells eSize grid sensitivity entropyList =
    let
        minE = List.minimum entropyList |> Maybe.withDefault 0
        maxE = List.maximum entropyList |> Maybe.withDefault 1
    in
    if maxE - minE < 0.01 then
        []
    else
        let
            rows = Basics.max 1 grid.rows
            cols = Basics.max 1 grid.cols

            toMainCell idx =
                ( Basics.min (rows - 1) (floor (toFloat (idx // eSize) / toFloat eSize * toFloat rows))
                , Basics.min (cols - 1) (floor (toFloat (modBy eSize idx) / toFloat eSize * toFloat cols))
                )

            cellAverages =
                entropyList
                    |> List.indexedMap (\idx e -> ( toMainCell idx, e ))
                    |> List.foldl
                        (\( key, e ) acc ->
                            Dict.update key
                                (\existing ->
                                    case existing of
                                        Just ( n, total ) -> Just ( n + 1, total + e )
                                        Nothing -> Just ( 1, e )
                                )
                                acc
                        )
                        Dict.empty
                    |> Dict.toList
                    |> List.map (\( ( r, c ), ( n, total ) ) -> ( total / toFloat n, ( r, c ) ))

            cellMin = cellAverages |> List.map Tuple.first |> List.minimum |> Maybe.withDefault 0
            cellMax = cellAverages |> List.map Tuple.first |> List.maximum |> Maybe.withDefault 1
            cellRange = Basics.max 0.000001 (cellMax - cellMin)

            candidates =
                cellAverages
                    |> List.filter (\( avg, _ ) -> (avg - cellMin) / cellRange >= calmFloor)
                    |> List.sortBy (\( avg, _ ) -> negate avg)

            candidateCount = List.length candidates

            splitCount =
                ceiling (sensitivity * toFloat candidateCount)

            deepCount =
                ceiling (Basics.max 0 (sensitivity - 0.5) * 2 * toFloat candidateCount)
        in
        candidates
            |> List.take splitCount
            |> List.indexedMap
                (\i ( _, ( r, c ) ) ->
                    { row = r, col = c, depth = if i < deepCount then 2 else 1 }
                )


-- Cells whose normalized entropy sits below this are "calm background" and
-- are never subdivided, no matter the sensitivity — gridding a flat wall
-- helps nobody.
calmFloor : Float
calmFloor =
    0.2


-- Subdivision lines mark high-entropy regions, snapped to the user's MAIN
-- grid: `cells` arrive in main-grid (row, col) space, so the extra lines sit
-- on the same lattice as the visible grid instead of floating at off-grid
-- 1/16-positions.
subdivisionLines : Settings -> Dimensions -> List SubdividedCell -> List (Svg msg)
subdivisionLines config dims cells =
    subdivisionLinesAt config { x = 0, y = 0, w = toFloat dims.width, h = toFloat dims.height } cells


-- Same as subdivisionLines but parameterized by the image's bounding rect in
-- the SVG coordinate space. Used by the canvas-fit preview, where the image
-- doesn't fill the full SVG viewBox.
subdivisionLinesAt : Settings -> { x : Float, y : Float, w : Float, h : Float } -> List SubdividedCell -> List (Svg msg)
subdivisionLinesAt config rect cells =
    let
        rows = Basics.max 1 config.gridRows
        cols = Basics.max 1 config.gridCols
        cellWidth = rect.w / toFloat cols
        cellHeight = rect.h / toFloat rows
    in
    List.concatMap
        (\cell ->
            let
                x0 = rect.x + toFloat cell.col * cellWidth
                y0 = rect.y + toFloat cell.row * cellHeight

                -- depth 1 → one inner line each way (2×2); depth 2 → three
                -- inner lines each way (4×4).
                splits =
                    if cell.depth >= 2 then
                        [ 0.25, 0.5, 0.75 ]

                    else
                        [ 0.5 ]
            in
            List.concatMap
                (\f ->
                    [ svgLine config (x0 + cellWidth * f) y0 (x0 + cellWidth * f) (y0 + cellHeight)
                    , svgLine config x0 (y0 + cellHeight * f) (x0 + cellWidth) (y0 + cellHeight * f)
                    ]
                )
                splits
        )
        cells


-- Fixed resolution at which we analyze image entropy. Decoupled from display
-- rows/cols so the user can resize the grid without triggering re-analysis.
entropyGridSize : Int
entropyGridSize =
    16


-- Derive (rows, cols) from a single "size" value, the chosen grid mode, and
-- the image's natural dimensions. Rectilinear: rows = cols = size, grid
-- stretches to fill the image. Square: cellSize = shorter/size (exact),
-- rows/cols are the number of FULL square cells that fit. A trailing
-- partial cell may exist on the longer axis (rendered with a closing line
-- at the image edge so the user sees a narrow strip rather than nothing).
deriveRowsCols : Int -> String -> Maybe Int -> Maybe Int -> { rows : Int, cols : Int }
deriveRowsCols size mode maybeImgW maybeImgH =
    case ( mode, maybeImgW, maybeImgH ) of
        ( "square", Just w, Just h ) ->
            if w == 0 || h == 0 || size < 1 then
                { rows = size, cols = size }
            else
                let
                    shorter = Basics.min w h
                    cellSize = toFloat shorter / toFloat size
                    derivedRows = Basics.max 1 (floor (toFloat h / cellSize))
                    derivedCols = Basics.max 1 (floor (toFloat w / cellSize))
                in
                { rows = derivedRows, cols = derivedCols }

        _ ->
            { rows = size, cols = size }


-- The square cell size in image pixels, if mode is square. Used by renderers
-- to position grid lines at uniform cellSize spacing (vs. stretching cellW
-- and cellH separately to fill image dims as in rectilinear mode).
squareCellSize : { a | gridMode : String, gridRows : Int, gridCols : Int, imageWidth : Maybe Int, imageHeight : Maybe Int } -> Maybe Float
squareCellSize m =
    case ( m.gridMode, m.imageWidth, m.imageHeight ) of
        ( "square", Just w, Just h ) ->
            let
                size = if m.gridMode == "square" then Basics.min m.gridRows m.gridCols else m.gridRows
                shorter = Basics.min w h
            in
            if size < 1 || shorter == 0 then
                Nothing
            else
                Just (toFloat shorter / toFloat size)

        _ ->
            Nothing


-- The "size" value for the slider: in rectilinear mode it's rows (or cols,
-- they're equal); in square mode it's the count of cells on the shorter axis.
currentGridSize : { a | gridRows : Int, gridCols : Int, gridMode : String } -> Int
currentGridSize m =
    if m.gridMode == "square" then
        Basics.min m.gridRows m.gridCols
    else
        m.gridRows


-- Parse a cm-input string into a Maybe Float. Empty string and zero/negative
-- values become Nothing — the user can clear a value by emptying the input.
parseCmInput : String -> Maybe Float
parseCmInput raw =
    case String.toFloat (String.trim raw) of
        Just n ->
            if n > 0 then
                Just n
            else
                Nothing

        Nothing ->
            Nothing


-- Excel-style column letters: 0 → "A", 25 → "Z", 26 → "AA", 51 → "AZ", 52 → "BA".
columnLetter : Int -> String
columnLetter i =
    if i < 26 then
        String.fromChar (Char.fromCode (i + 65))
    else
        columnLetter ((i - 26) // 26) ++ String.fromChar (Char.fromCode (modBy 26 (i - 26) + 65))


-- SVG <text> labels at the top-left of each cell when showCellLabels is on.
-- Font size scales with the smaller cell dimension, clamped to a readable range.
-- bju.8 will auto-hide entirely below ~18px on-screen cell size.
cellLabelsSvg : Settings -> Maybe Float -> Dimensions -> List (Svg msg)
cellLabelsSvg config maybeCellSize dims =
    cellLabelsSvgAt config maybeCellSize { x = 0, y = 0, w = toFloat dims.width, h = toFloat dims.height }


-- Like cellLabelsSvg but parameterized by image rect in SVG coordinate space.
-- Used by the canvas-fit preview where the image doesn't fill the viewBox.
-- In square mode (maybeCellSize = Just), labels sit on the uniform cellSize
-- lattice the lines use — spacing by rows ÷ cols would drift right/down on
-- images that don't divide evenly. Only full cells get labels; the trailing
-- partial strip is skipped.
cellLabelsSvgAt : Settings -> Maybe Float -> { x : Float, y : Float, w : Float, h : Float } -> List (Svg msg)
cellLabelsSvgAt config maybeCellSize rect =
    if not config.showCellLabels then
        []
    else
        let
            ( ( cellWidth, cellHeight ), ( nCols, nRows ) ) =
                case maybeCellSize of
                    Just cs ->
                        ( ( cs, cs )
                        , ( Basics.max 1 (floor (rect.w / cs)), Basics.max 1 (floor (rect.h / cs)) )
                        )

                    Nothing ->
                        ( ( rect.w / toFloat config.gridCols, rect.h / toFloat config.gridRows )
                        , ( config.gridCols, config.gridRows )
                        )

            fontSize = config.cellLabelSize
            padding = toFloat fontSize * 0.4
        in
        List.concatMap
            (\row ->
                List.map
                    (\col ->
                        let
                            x = rect.x + toFloat col * cellWidth + padding
                            y = rect.y + toFloat row * cellHeight + padding + toFloat fontSize
                            labelText = columnLetter col ++ String.fromInt (row + 1)
                        in
                        Svg.text_
                            [ SvgAttr.x (String.fromFloat x)
                            , SvgAttr.y (String.fromFloat y)
                            , SvgAttr.fontSize (String.fromInt fontSize)
                            , SvgAttr.fill config.gridColor
                            , SvgAttr.fontFamily "ui-monospace, SFMono-Regular, Menlo, monospace"
                            , SvgAttr.opacity (String.fromFloat config.gridOpacity)
                            ]
                            [ Svg.text labelText ]
                    )
                    (List.range 0 (nCols - 1))
            )
            (List.range 0 (nRows - 1))


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

-- Generate all grid lines (vertical, horizontal, and optionally diagonal).
-- Rows and cols are independent; cellWidth follows cols, cellHeight follows
-- rows. If `maybeCellSize` is Just, the lines are positioned at uniform
-- cellSize spacing instead — that's square mode, where a closing line is
-- also drawn at the image edge if the cell count doesn't divide evenly
-- (the trailing partial cell).
allGridLines : Settings -> Dimensions -> List SubdividedCell -> List (Svg msg)
allGridLines config dims adaptiveCells =
    allGridLinesWith config dims Nothing adaptiveCells


allGridLinesWith : Settings -> Dimensions -> Maybe Float -> List SubdividedCell -> List (Svg msg)
allGridLinesWith config dims maybeCellSize adaptiveCells =
    let
        cellWidth =
            case maybeCellSize of
                Just s -> s
                Nothing -> toFloat dims.width / toFloat config.gridCols

        cellHeight =
            case maybeCellSize of
                Just s -> s
                Nothing -> toFloat dims.height / toFloat config.gridRows

        verticalXs =
            let base = List.range 0 config.gridCols |> List.map (\i -> toFloat i * cellWidth)
            in
            case maybeCellSize of
                Just _ ->
                    let lastFull = toFloat config.gridCols * cellWidth in
                    if toFloat dims.width - lastFull > 0.5 then base ++ [ toFloat dims.width ] else base
                Nothing ->
                    base

        horizontalYs =
            let base = List.range 0 config.gridRows |> List.map (\i -> toFloat i * cellHeight)
            in
            case maybeCellSize of
                Just _ ->
                    let lastFull = toFloat config.gridRows * cellHeight in
                    if toFloat dims.height - lastFull > 0.5 then base ++ [ toFloat dims.height ] else base
                Nothing ->
                    base

        verticalLines =
            verticalXs |> List.map (\x -> svgLine config x 0 x (toFloat dims.height))

        horizontalLines =
            horizontalYs |> List.map (\y -> svgLine config 0 y (toFloat dims.width) y)

        diagonals =
            if config.showDiagonals then
                List.range 0 (config.gridRows - 1)
                    |> List.concatMap
                        (\row ->
                            List.range 0 (config.gridCols - 1)
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
    verticalLines ++ horizontalLines ++ diagonals ++ subdivisionLines config dims adaptiveCells ++ cellLabelsSvg config maybeCellSize dims



port requestPng : { url : String, width : Int, height : Int } -> Cmd msg


port receivePng : (String -> msg) -> Sub msg


port downloadImage : { dataUrl : String, fileName : String } -> Cmd msg


port sliceAndDownload : { dataUrl : String, slice : String, baseName : String } -> Cmd msg


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


port reportEvent : String -> Cmd msg


port receiveCounters : (Counters -> msg) -> Sub msg


port receiveRateLimit : (() -> msg) -> Sub msg


port receiveImageDisplaySize : ({ width : Float, height : Float } -> msg) -> Sub msg


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
      , gridRows = 10
      , gridCols = 10
      , gridMode = "rectilinear"
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
      , counters = Nothing
      , showRateLimitToast = False
      , showCellLabels = False
      , imageDisplayedWidth = Nothing
      , imageDisplayedHeight = Nothing
      , canvasWidthCm = Nothing
      , canvasHeightCm = Nothing
      , imageFit = "fit-inside"
      , sliceMode = "none"
      , imageOffsetX = 0
      , imageOffsetY = 0
      , imageScale = 1.0
      , isDraggingImage = False
      , dragStartX = 0
      , dragStartY = 0
      , dragSvgWidthPx = 0
      , dragSvgHeightPx = 0
      , cellLabelSize = 14
      , showCommunityDisclaimer = False
      }
    , Cmd.none
    )



-- HELPERS


withSave : Model -> ( Model, Cmd Msg )
withSave model =
    ( model, saveSettings (settingsFromModel model) )


bumpCounter : String -> Maybe Counters -> Maybe Counters
bumpCounter event maybeCounters =
    Maybe.map
        (\c ->
            if event == "downloaded" then
                { c
                    | totalDownloaded = c.totalDownloaded + 1
                    , griddersByCountry = bumpCountryRow c.yourCountry c.griddersByCountry
                }
            else if event == "hearted" then
                { c
                    | totalHearted = c.totalHearted + 1
                    , heartsByCountry = bumpCountryRow c.yourCountry c.heartsByCountry
                }
            else
                c
        )
        maybeCounters


bumpCountryRow : String -> List CountryCount -> List CountryCount
bumpCountryRow country rows =
    if country == "" then
        rows
    else
        let
            ( seen, bumped ) =
                List.foldr
                    (\r ( found, acc ) ->
                        if r.country == country then
                            ( True, { r | count = r.count + 1 } :: acc )
                        else
                            ( found, r :: acc )
                    )
                    ( False, [] )
                    rows
        in
        if seen then
            bumped
        else
            -- New country with count=1 always sits at the bottom of a descending list;
            -- next /api/counters fetch will reorder authoritatively.
            rows ++ [ { country = country, count = 1 } ]


countryFlag : String -> String
countryFlag code =
    case String.toList (String.toUpper code) of
        [ a, b ] ->
            String.fromList
                [ Char.fromCode (Char.toCode a - Char.toCode 'A' + 0x0001F1E6)
                , Char.fromCode (Char.toCode b - Char.toCode 'A' + 0x0001F1E6)
                ]

        _ ->
            "\u{1F3F3}"


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
            requestEntropyAnalysis { url = url, width = w, height = h, grid = entropyGridSize }

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
    -- Rectilinear only: square mode's lattice (fixed cell size + partial
    -- trailing strip) has no clean rows × cols to aggregate entropy onto,
    -- so the control is hidden there and no cells are produced.
    if model.adaptiveSensitivity > 0 && model.gridMode /= "square" then
        model.entropyData
            |> Maybe.map
                (computeMainGridCells entropyGridSize
                    { rows = model.gridRows, cols = model.gridCols }
                    model.adaptiveSensitivity
                )
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
            -- Single slider for both modes:
            --   rectilinear → rows = cols = size (grid stretches to fill)
            --   square      → cells exact-square; size = cells on shorter axis
            let
                d = deriveRowsCols size model.gridMode model.imageWidth model.imageHeight
            in
            withSave { model | gridRows = d.rows, gridCols = d.cols }

        GridRowsChanged _ ->
            -- Deprecated: the two-input UI was removed when Custom → Square.
            ( model, Cmd.none )

        GridColsChanged _ ->
            -- Deprecated: see GridRowsChanged.
            ( model, Cmd.none )

        GridModeChanged newMode ->
            -- Mode change: re-derive rows/cols based on the current "size"
            -- (shorter axis in square, rows in rectilinear) and the new mode.
            let
                size = currentGridSize model
                d = deriveRowsCols size newMode model.imageWidth model.imageHeight
            in
            withSave { model | gridMode = newMode, gridRows = d.rows, gridCols = d.cols }

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
            ( { model
                | niceCounter = model.niceCounter + 1
                , counters = bumpCounter "hearted" model.counters
              }
            , reportEvent "hearted"
            )

        ImageSizeLoaded width height ->
            let
                withDims = { model | imageWidth = Just width, imageHeight = Just height }
                -- In square mode, the new image's aspect ratio changes which
                -- (rows, cols) produce square cells. Re-derive.
                reshaped =
                    if model.gridMode == "square" then
                        let
                            size = currentGridSize model
                            d = deriveRowsCols size "square" (Just width) (Just height)
                        in
                        { withDims | gridRows = d.rows, gridCols = d.cols }
                    else
                        withDims
                willAnalyze = model.adaptiveSensitivity > 0 && canAnalyze reshaped
                entropyCmd =
                    if willAnalyze then
                        requestEntropy reshaped
                    else
                        Cmd.none
            in
            ( { reshaped | isAnalyzing = willAnalyze }, entropyCmd )

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

        ToggleCellLabels value ->
            withSave { model | showCellLabels = value }

        CellLabelSizeChanged value ->
            withSave { model | cellLabelSize = value }

        ToggleCommunityDisclaimer ->
            ( { model | showCommunityDisclaimer = not model.showCommunityDisclaimer }, Cmd.none )

        ImageDisplaySizeReceived dims ->
            ( { model | imageDisplayedWidth = Just dims.width, imageDisplayedHeight = Just dims.height }, Cmd.none )

        CanvasWidthCmChanged raw ->
            withSave { model | canvasWidthCm = parseCmInput raw }

        CanvasHeightCmChanged raw ->
            withSave { model | canvasHeightCm = parseCmInput raw }

        ClearCanvasCm ->
            withSave { model | canvasWidthCm = Nothing, canvasHeightCm = Nothing }

        ImageFitChanged mode ->
            withSave { model | imageFit = mode }

        SliceModeChanged mode ->
            withSave { model | sliceMode = mode }

        ImageDragStart x y svgW svgH ->
            -- Capture the SVG's pixel size from the event itself so the
            -- pointer-px ↔ canvas-cm conversion uses a fresh measurement.
            -- Previously this relied on imageDisplayedWidth from the JS
            -- ResizeObserver, which raced the first mousemove and could
            -- fall back to 1 px = 1 cm (image flying off-screen).
            ( { model
                | isDraggingImage = True
                , dragStartX = x
                , dragStartY = y
                , dragSvgWidthPx = svgW
                , dragSvgHeightPx = svgH
              }
            , Cmd.none
            )

        ImageDragMove x y ->
            if model.isDraggingImage then
                let
                    -- Prefer the SVG dims captured at pointerdown; fall back
                    -- to the ResizeObserver-tracked image dims only if the
                    -- capture missed (legacy event sources without
                    -- currentTarget.clientWidth).
                    captureOrFallback captured maybeFallback =
                        if captured > 0 then
                            captured

                        else
                            case maybeFallback of
                                Just v -> v
                                Nothing -> 0

                    svgW = captureOrFallback model.dragSvgWidthPx model.imageDisplayedWidth
                    svgH = captureOrFallback model.dragSvgHeightPx model.imageDisplayedHeight

                    pxPerCmX =
                        case model.canvasWidthCm of
                            Just cw -> if cw > 0 && svgW > 0 then svgW / cw else 1.0
                            Nothing -> 1.0

                    pxPerCmY =
                        case model.canvasHeightCm of
                            Just ch -> if ch > 0 && svgH > 0 then svgH / ch else 1.0
                            Nothing -> 1.0

                    deltaX = (x - model.dragStartX) / pxPerCmX
                    deltaY = (y - model.dragStartY) / pxPerCmY

                    newOffsetX = model.imageOffsetX + deltaX
                    newOffsetY = model.imageOffsetY + deltaY
                in
                ( { model | imageOffsetX = newOffsetX, imageOffsetY = newOffsetY, dragStartX = x, dragStartY = y }, Cmd.none )
            else
                ( model, Cmd.none )

        ImageDragEnd ->
            -- Persist the final position once drag ends (avoids saving on every mousemove).
            if model.isDraggingImage then
                withSave { model | isDraggingImage = False }
            else
                ( model, Cmd.none )

        ImageScaleChanged value ->
            withSave { model | imageScale = value }

        ResetImagePosition ->
            withSave { model | imageOffsetX = 0, imageOffsetY = 0, imageScale = 1.0 }

        SnapToFiveCmCells ->
            -- Compute rows/cols so each cell ≈ 5cm on the canvas. Clamps to
            -- the 2..64 range used elsewhere. Flips Auto → Custom so the
            -- result sticks even if the user later moves the size slider.
            case ( model.canvasWidthCm, model.canvasHeightCm ) of
                ( Just w, Just h ) ->
                    let
                        snapCm = 5.0
                        newCols = clamp 2 64 (round (w / snapCm))
                        newRows = clamp 2 64 (round (h / snapCm))
                    in
                    withSave { model | gridRows = newRows, gridCols = newCols, gridMode = "Custom" }

                _ ->
                    ( model, Cmd.none )

        ToggleGridView ->
            ( { model | showGrid = not model.showGrid }, Cmd.none )

        SettingsLoaded settings ->
            ( { model
                | gridRows = settings.gridRows
                , gridCols = settings.gridCols
                , gridMode = settings.gridMode
                , gridColor = settings.gridColor
                , gridThickness = settings.gridThickness
                , gridOpacity = settings.gridOpacity
                , showDiagonals = settings.showDiagonals
                , showCellLabels = settings.showCellLabels
                -- Deliberately NOT restored: preview-on-canvas is a
                -- per-session tool. Restoring it dropped returning users
                -- into a confusing canvas view ("weird grid already there")
                -- before they had even picked an image. Values are still
                -- SAVED (schema unchanged); only the load path skips them.
                , canvasWidthCm = Nothing
                , canvasHeightCm = Nothing
                , imageFit = settings.imageFit
                , sliceMode = settings.sliceMode
                , imageOffsetX = settings.imageOffsetX
                , imageOffsetY = settings.imageOffsetY
                , imageScale = settings.imageScale
                , cellLabelSize = settings.cellLabelSize
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
                    else if model.sliceMode == "none" then
                        downloadImage { dataUrl = dataUrl, fileName = fileName }
                    else
                        sliceAndDownload
                            { dataUrl = dataUrl
                            , slice = model.sliceMode
                            , baseName = model.imageName ++ "-gridded"
                            }
            in
            ( { model
                | downloadSuccess = True
                , isProcessing = False
                , shareAfterProcess = False
                , counters = bumpCounter "downloaded" model.counters
              }
            , Cmd.batch
                [ action
                , reportEvent "downloaded"
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

        CountersReceived c ->
            ( { model | counters = Just c }, Cmd.none )

        RateLimited ->
            ( { model | showRateLimitToast = True }
            , Task.perform (\_ -> DismissRateLimit) (Process.sleep 4000)
            )

        DismissRateLimit ->
            ( { model | showRateLimitToast = False }, Cmd.none )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    let
        dragSubs =
            if model.isDraggingImage then
                Sub.batch
                    [ Browser.Events.onMouseMove
                        (Json.Decode.map2 ImageDragMove
                            (Json.Decode.field "clientX" Json.Decode.float)
                            (Json.Decode.field "clientY" Json.Decode.float)
                        )
                    , Browser.Events.onMouseUp (Json.Decode.succeed ImageDragEnd)
                    ]
            else
                Sub.none
    in
    Sub.batch
        [ receivePng GriddedReady
        , loadSettings SettingsLoaded
        , resetProcessing (\_ -> ResetProcessing)
        , getBrowserLanguage BrowserLanguageReceived
        , receiveShareSupport ShareSupportReceived
        , receiveEntropyData EntropyDataReceived
        , receivePickedImage ImagePicked
        , receiveCounters CountersReceived
        , receiveRateLimit (\_ -> RateLimited)
        , receiveImageDisplaySize ImageDisplaySizeReceived
        , dragSubs
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
            , viewCommunityCard model
            ]
        , viewFooter model
        , viewRateLimitToast model
        ]


viewRateLimitToast : Model -> Html Msg
viewRateLimitToast model =
    if model.showRateLimitToast then
        div
            [ class "rate-limit-toast"
            , attribute "role" "status"
            , attribute "aria-live" "polite"
            ]
            [ text (translate model.language I18n.RateLimitMessage) ]
    else
        text ""



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
            (List.intersperse (text " \u{00B7} ")
                [ externalLink "https://en.wikipedia.org/wiki/Grid_(graphic_design)" "Grid in graphic design"
                , externalLink "https://en.wikipedia.org/wiki/Grid_method" "The grid method"
                , externalLink "https://en.wikipedia.org/wiki/Scaling_(geometry)" "Scaling in geometry"
                , externalLink "https://gurneyjourney.blogspot.com/2009/11/scaling-up-with-grid.html" "Gurney Journey: Scaling up"
                , externalLink "https://www.gadsbys.co.uk/drawing-scaling-up-an-image-using-a-grid/" "Gadsbys: Using a grid"
                ]
            )
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
            [ Html.section [ class "group" ]
                [ Html.h4 [ class "group-header" ]
                    [ span [ class "group-num" ] [ text "1." ]
                    , text " "
                    , text (translate model.language I18n.GroupSetUpGrid)
                    ]
                , div [ class "group-controls group-controls--single" ]
                    [ viewSizeControl model ]
                ]
            , Html.section [ class "group" ]
                [ Html.h4 [ class "group-header" ]
                    [ span [ class "group-num" ] [ text "2." ]
                    , text " "
                    , text (translate model.language I18n.GroupStyle)
                    ]
                , div [ class "group-controls" ]
                    [ viewCellLabelsToggle model
                    , viewColorControl model
                    , viewThicknessControl model
                    , viewOpacityControl model
                    , viewDiagonalsToggle model
                    , if model.gridMode == "square" then
                        -- Adaptive density is rectilinear-only: square mode's
                        -- lattice has no clean rows × cols to subdivide.
                        text ""
                      else
                        viewAdaptiveControl model
                    ]
                ]

            -- Match-a-canvas (preview on canvas) is DORMANT pending its
            -- redesign — the artist model is "place a fixed canvas, drag the
            -- image over it", and the current fit-buttons version confused
            -- QA. Code + settings schema stay; only this render is removed.
            -- Re-enable by restoring: viewMatchCanvasSection model
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
    let
        isSquare = model.gridMode == "square"
        sliderValue = currentGridSize model

        modeToggle =
            div [ class "seg", attribute "role" "tablist", attribute "aria-label" "grid mode" ]
                [ button
                    [ class (if isSquare then "seg-btn" else "seg-btn seg-btn--active")
                    , attribute "role" "tab"
                    , attribute "aria-selected" (if isSquare then "false" else "true")
                    , onClick (GridModeChanged "rectilinear")
                    , type_ "button"
                    ]
                    [ text (translate model.language I18n.GridModeRectilinear) ]
                , button
                    [ class (if isSquare then "seg-btn seg-btn--active" else "seg-btn")
                    , attribute "role" "tab"
                    , attribute "aria-selected" (if isSquare then "true" else "false")
                    , onClick (GridModeChanged "square")
                    , type_ "button"
                    ]
                    [ text (translate model.language I18n.GridModeSquare) ]
                ]

        explainKey =
            if isSquare then
                I18n.GridModeSquareExplain
            else
                I18n.GridModeRectilinearExplain
    in
    div [ class "control-group" ]
        [ div [ class "control-header" ]
            [ label [ class "control-label", for "grid-size-input" ]
                [ text (translate model.language I18n.GridSize) ]
            , modeToggle
            ]
        , input
            [ type_ "range"
            , id "grid-size-input"
            , Html.Attributes.min "2"
            , Html.Attributes.max "32"
            , value (String.fromInt sliderValue)
            , onInput (\s -> GridSizeChanged (Maybe.withDefault 10 (String.toInt s)))
            , class "slider"
            ]
            []
        , p [ class "mode-explain" ]
            [ text (translate model.language explainKey) ]
        ]


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


externalLink : String -> String -> Html msg
externalLink url label_ =
    a
        [ href url
        , target "_blank"
        , rel "noopener noreferrer"
        , class "external-link"
        ]
        [ text label_, iconExternal ]


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


viewMatchCanvasSection : Model -> Html Msg
viewMatchCanvasSection model =
    let
        cmInputValue maybe =
            case maybe of
                Just n -> String.fromFloat n
                Nothing -> ""

        bothFilled =
            case ( model.canvasWidthCm, model.canvasHeightCm ) of
                ( Just _, Just _ ) -> True
                _ -> False

        readoutLine =
            case ( model.canvasWidthCm, model.canvasHeightCm ) of
                ( Just w, Just h ) ->
                    let
                        cellW = w / toFloat model.gridCols
                        cellH = h / toFloat model.gridRows
                    in
                    p [ class "match-canvas-readout" ]
                        [ text (translate model.language I18n.EachCellApprox ++ " ")
                        , strong [] [ text (formatCm cellW ++ " × " ++ formatCm cellH) ]
                        , text " cm."
                        ]

                _ ->
                    text ""

        snapButton =
            button
                [ class "snap-btn"
                , type_ "button"
                , onClick SnapToFiveCmCells
                , disabled (not bothFilled)
                ]
                [ text (translate model.language I18n.MakeFiveCmCells) ]

        clearButton =
            if model.canvasWidthCm == Nothing && model.canvasHeightCm == Nothing then
                text ""
            else
                button
                    [ class "canvas-clear-btn"
                    , type_ "button"
                    , onClick ClearCanvasCm
                    ]
                    [ text (translate model.language I18n.ClearCanvas) ]

        cmHint =
            if bothFilled then
                text ""
            else
                p [ class "cm-hint" ] [ text (translate model.language I18n.FillBothToSeeCanvas) ]

        aspectDiffers =
            case ( ( model.canvasWidthCm, model.canvasHeightCm ), ( model.imageWidth, model.imageHeight ) ) of
                ( ( Just cw, Just ch ), ( Just iw, Just ih ) ) ->
                    let
                        canvasRatio = cw / ch
                        imageRatio = toFloat iw / toFloat ih
                    in
                    abs (canvasRatio - imageRatio) / canvasRatio > 0.02

                _ ->
                    False

        fitSection =
            if aspectDiffers then
                viewFitOptions model
            else
                text ""
    in
    Html.details [ class "match-canvas", attribute "data-bothfilled" (if bothFilled then "true" else "false") ]
        [ Html.summary [ class "match-canvas-summary" ]
            [ span [ class "group-num" ] [ text "3." ]
            , text " "
            , text (translate model.language I18n.GroupMatchCanvas)
            , span [ class "group-opt" ] [ text (" " ++ translate model.language I18n.GroupOptional) ]
            ]
        , div [ class "match-canvas-body" ]
            [ div [ class "ctrl-label" ] [ text (translate model.language I18n.MyCanvasIs) ]
            , div [ class "cm-inputs" ]
                [ input
                    [ class "cm-input"
                    , id "canvas-width-cm"
                    , type_ "number"
                    , attribute "inputmode" "decimal"
                    , Html.Attributes.min "1"
                    , Html.Attributes.step "0.1"
                    , value (cmInputValue model.canvasWidthCm)
                    , onInput CanvasWidthCmChanged
                    , attribute "aria-label" (translate model.language I18n.CmWide)
                    ]
                    []
                , span [ class "cm-x" ] [ text (translate model.language I18n.CmWide ++ "  ×") ]
                , input
                    [ class "cm-input"
                    , id "canvas-height-cm"
                    , type_ "number"
                    , attribute "inputmode" "decimal"
                    , Html.Attributes.min "1"
                    , Html.Attributes.step "0.1"
                    , value (cmInputValue model.canvasHeightCm)
                    , onInput CanvasHeightCmChanged
                    , attribute "aria-label" (translate model.language I18n.CmTall)
                    ]
                    []
                , span [ class "cm-x" ] [ text (translate model.language I18n.CmTall) ]
                ]
            , cmHint
            , readoutLine
            , div [ class "canvas-btn-row" ] [ snapButton, clearButton ]
            , fitSection
            -- Slice export UI removed per QA feedback ("not sure we need
            -- that"). The SliceMode field + JS port stay dormant; can
            -- re-surface later if multi-sheet printing demand materializes.
            ]
        ]


viewSliceOptions : Model -> Html Msg
viewSliceOptions model =
    let
        opt val labelText =
            label [ class (if model.sliceMode == val then "slice-opt slice-opt--active" else "slice-opt") ]
                [ input
                    [ type_ "radio"
                    , Html.Attributes.name "slice-mode"
                    , Html.Attributes.checked (model.sliceMode == val)
                    , Html.Events.onClick (SliceModeChanged val)
                    ]
                    []
                , text labelText
                ]
    in
    div [ class "slice-section" ]
        [ div [ class "ctrl-label" ] [ text (translate model.language I18n.SplitIntoTiles) ]
        , div [ class "slice-options", attribute "role" "radiogroup", attribute "aria-label" "slice export" ]
            [ opt "none" (translate model.language I18n.SliceNone)
            , opt "2x2" "2×2"
            , opt "2x3" "2×3"
            , opt "3x3" "3×3"
            ]
        ]


-- The fit options block — radios + small SVG preview. Only rendered when
-- the image and canvas aspects actually differ (avoids false-positive
-- "you have a choice to make" when there's nothing to choose).
viewFitOptions : Model -> Html Msg
viewFitOptions model =
    let
        opt key labelKey =
            label [ class (if model.imageFit == key then "fit-opt fit-opt--active" else "fit-opt") ]
                [ input
                    [ type_ "radio"
                    , Html.Attributes.name "image-fit"
                    , Html.Attributes.checked (model.imageFit == key)
                    , Html.Events.onClick (ImageFitChanged key)
                    ]
                    []
                , span [ class ("fit-glyph fit-glyph--" ++ key) ] []
                , text (translate model.language labelKey)
                ]
    in
    div [ class "fit-section" ]
        [ div [ class "ctrl-label" ] [ text (translate model.language I18n.HowShouldImageFit) ]
        , div [ class "fit-options", attribute "role" "radiogroup", attribute "aria-label" "image fit mode" ]
            [ opt "fit-width" I18n.FitToWidth
            , opt "fit-height" I18n.FitToHeight
            , opt "fit-inside" I18n.FitInside
            ]
        , viewFitPreview model
        ]


-- Tiny SVG showing the canvas outline with the image rectangle positioned
-- inside it per the selected fit mode. 120×80 viewBox, scaled to canvas
-- aspect for clarity.
viewFitPreview : Model -> Html Msg
viewFitPreview model =
    case ( ( model.canvasWidthCm, model.canvasHeightCm ), ( model.imageWidth, model.imageHeight ) ) of
        ( ( Just cw, Just ch ), ( Just iw, Just ih ) ) ->
                    let
                        -- Normalize canvas to fit a 120×80 viewbox.
                        canvasAspect = cw / ch
                        ( cBoxW, cBoxH ) =
                            if canvasAspect > 1.5 then
                                ( 120.0, 120.0 / canvasAspect )
                            else
                                ( 80.0 * canvasAspect, 80.0 )

                        imageAspect = toFloat iw / toFloat ih

                        -- Compute image rect within canvas based on fit mode.
                        ( imgW, imgH ) =
                            case model.imageFit of
                                "fit-width" ->
                                    ( cBoxW, cBoxW / imageAspect )

                                "fit-height" ->
                                    ( cBoxH * imageAspect, cBoxH )

                                _ ->
                                    -- fit-inside (default): the smaller dimension constrains.
                                    if imageAspect > canvasAspect then
                                        ( cBoxW, cBoxW / imageAspect )
                                    else
                                        ( cBoxH * imageAspect, cBoxH )

                        imgX = (cBoxW - imgW) / 2
                        imgY = (cBoxH - imgH) / 2

                        offsetX = (120 - cBoxW) / 2
                        offsetY = (80 - cBoxH) / 2
                    in
            div [ class "fit-preview" ]
                [ Svg.svg
                    [ SvgAttr.viewBox "0 0 120 80"
                    , SvgAttr.class "fit-preview-svg"
                    , attribute "aria-hidden" "true"
                    ]
                    [ Svg.rect
                        [ SvgAttr.class "fit-preview-canvas"
                        , SvgAttr.x (String.fromFloat offsetX)
                        , SvgAttr.y (String.fromFloat offsetY)
                        , SvgAttr.width (String.fromFloat cBoxW)
                        , SvgAttr.height (String.fromFloat cBoxH)
                        ]
                        []
                    , Svg.rect
                        [ SvgAttr.class "fit-preview-image"
                        , SvgAttr.x (String.fromFloat (offsetX + imgX))
                        , SvgAttr.y (String.fromFloat (offsetY + imgY))
                        , SvgAttr.width (String.fromFloat imgW)
                        , SvgAttr.height (String.fromFloat imgH)
                        ]
                        []
                    ]
                ]

        _ ->
            text ""


formatCm : Float -> String
formatCm n =
    -- One decimal place, dropping trailing ".0".
    let
        rounded = toFloat (round (n * 10)) / 10
        str = String.fromFloat rounded
    in
    if String.endsWith ".0" str then
        String.dropRight 2 str
    else
        str


viewCellLabelsToggle : Model -> Html Msg
viewCellLabelsToggle model =
    div [ class "control-group cell-labels-group" ]
        [ label [ class "light-switch" ]
            [ input
                [ type_ "checkbox"
                , Html.Attributes.checked model.showCellLabels
                , Html.Events.onCheck ToggleCellLabels
                , class "light-switch-input sr-only"
                , id "cell-labels"
                ]
                []
            , span [ class "light-switch-track" ]
                [ span [ class "light-switch-thumb" ] [ text "A1" ] ]
            , span [ class "light-switch-label" ] [ text (translate model.language I18n.ShowCellLabels) ]
            ]
        , if model.showCellLabels then
            div [ class "cell-labels-size" ]
                [ label [ class "cell-labels-size-label", for "cell-label-size-input" ]
                    [ text (translate model.language I18n.LabelSize) ]
                , input
                    [ type_ "range"
                    , id "cell-label-size-input"
                    , Html.Attributes.min "8"
                    , Html.Attributes.max "40"
                    , value (String.fromInt model.cellLabelSize)
                    , onInput (\s -> CellLabelSizeChanged (Maybe.withDefault 14 (String.toInt s)))
                    , class "slider"
                    ]
                    []
                , span [ class "control-value" ] [ text (String.fromInt model.cellLabelSize ++ "px") ]
                ]
          else
            text ""
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

        -- Slider is on, analysis finished, but zero cells qualified (near-uniform
        -- entropy). Say so instead of silently drawing nothing.
        noDetailHint =
            if
                model.adaptiveSensitivity > 0
                    && not model.isAnalyzing
                    && model.entropyData /= Nothing
                    && List.isEmpty (currentAdaptiveCells model)
            then
                p [ class "adaptive-empty-hint" ] [ text (translate model.language I18n.AdaptiveNoDetail) ]

            else
                text ""
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
        , extra =
            [ p [ class "mode-explain" ] [ text (translate model.language I18n.AdaptiveGridDensityExplain) ]
            , noDetailHint
            ]
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
                    , attribute "aria-label" (translate model.language I18n.ShareImage)
                    ]
                    [ span [ class "button-icon" ] [ iconShare ]
                    ]
              else
                text ""
            ]
        , div [ class "nice-section" ]
            [ p [ class "nice-prompt" ] [ text (nicePromptText model) ]
            , button
                [ class "heart-pill"
                , onClick NiceButtonClicked
                , attribute "aria-label" (translate model.language I18n.Nice)
                ]
                [ iconHeart
                , text " "
                , text (translate model.language I18n.Nice)
                , if model.niceCounter > 0 then
                    text (" · " ++ String.fromInt model.niceCounter)
                  else
                    text ""
                ]
            ]
        ]


nicePromptText : Model -> String
nicePromptText model =
    let
        n = model.niceCounter
    in
    if n == 0 then
        translate model.language I18n.HeartLikedIt
    else if n < 10 then
        ":)"
    else if n < 25 then
        translate model.language I18n.HeartThanks
    else
        "aaaaaaaaaaaa!!!!!!"


-- One-line community ticker (replaces the multi-line card). Bigger frog
-- on the left (the brand's frog soul). Totals + top country flags in the
-- middle. Disclaimer pill on the right. The Spotlight line is dropped
-- (leaderboard-shaped — out of scope for "we're all making art together").
viewCommunityCard : Model -> Html Msg
viewCommunityCard model =
    case model.counters of
        Nothing ->
            text ""

        Just c ->
            div [ class "community-ticker", attribute "role" "region", attribute "aria-label" "community activity" ]
                [ div [ class "community-ticker__row" ]
                    [ span [ class "community-ticker__frog", attribute "aria-hidden" "true" ] [ iconFrogSized "32" ]
                    , p [ class "community-ticker__line" ]
                        [ strong [] [ text (String.fromInt c.totalDownloaded) ]
                        , text (" " ++ translate model.language I18n.CommunityImagesGridded ++ " · ")
                        , strong [] [ text (String.fromInt c.totalCountries) ]
                        , text (" " ++ translate model.language I18n.CommunityCountriesWith ++ " · ")
                        , strong [] [ text (String.fromInt c.totalHearted) ]
                        , text (" " ++ translate model.language I18n.CommunityHearts ++ " ")
                        , span [ class "heart-warm" ] [ iconHeart ]
                        , text " "
                        , span [ class "community-ticker__sep" ] [ text "·" ]
                        , text " "
                        , viewFlagList c.griddersByCountry
                        ]
                    , button
                        [ class "community-disclaimer-toggle"
                        , attribute "aria-label" (translate model.language I18n.CommunityWhatsThis)
                        , attribute "title" (translate model.language I18n.CommunityWhatsThis)
                        , attribute "aria-expanded" (if model.showCommunityDisclaimer then "true" else "false")
                        , Html.Events.onClick ToggleCommunityDisclaimer
                        , type_ "button"
                        ]
                        [ text "?" ]
                    ]
                , if model.showCommunityDisclaimer then
                    p [ class "community-disclaimer-body" ]
                        [ text (translate model.language I18n.CommunityDisclaimerBody) ]
                  else
                    text ""
                ]


viewFlagList : List CountryCount -> Html Msg
viewFlagList rows =
    span [ class "community-ticker__flags" ]
        (List.intersperse
            (text " · ")
            (List.map renderFlagCount (List.take 6 rows))
        )


renderFlagCount : CountryCount -> Html Msg
renderFlagCount cc =
    span [ class "community-flag", attribute "title" cc.country ]
        [ text (countryFlag cc.country)
        , text " "
        , text (String.fromInt cc.count)
        ]


-- Old disclaimer kept for compatibility; replaced inline in viewCommunityCard.
viewCommunityDisclaimer : Model -> Html Msg
viewCommunityDisclaimer model =
    Html.details [ class "community-disclaimer" ]
        [ Html.summary
            [ class "community-disclaimer-toggle"
            , attribute "aria-label" (translate model.language I18n.CommunityWhatsThis)
            , attribute "title" (translate model.language I18n.CommunityWhatsThis)
            ]
            [ text "?" ]
        , p [ class "community-disclaimer-body" ]
            [ text (translate model.language I18n.CommunityDisclaimerBody) ]
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
        ( Just url, Just imgWidth, Just imgHeight ) ->
            case ( model.canvasWidthCm, model.canvasHeightCm ) of
                ( Just cw, Just ch ) ->
                    viewCanvasFitMode model url imgWidth imgHeight cw ch

                _ ->
                    viewLegacyImageMode model url imgWidth imgHeight

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


-- Legacy rendering: <img> + SVG overlay, sized to image natural pixels.
-- Used when no canvas cm is set — the default for casual users.
viewLegacyImageMode : Model -> String -> Int -> Int -> Html Msg
viewLegacyImageMode model url width height =
    let
        labelsTooSmall =
            case ( model.imageDisplayedWidth, model.imageDisplayedHeight ) of
                ( Just dw, Just dh ) ->
                    dw / toFloat model.gridCols < 18 || dh / toFloat model.gridRows < 18

                _ ->
                    False

        baseConfig = settingsFromModel model
        config =
            if labelsTooSmall then
                { baseConfig | showCellLabels = False }
            else
                baseConfig
        dims = { width = width, height = height }
        gridLines = allGridLinesWith config dims (squareCellSize model) (currentAdaptiveCells model)
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


-- Canvas-fit rendering: SVG sized to canvas cm aspect, image placed inside
-- via <image> element, transformed by user's drag offset. Grid + labels are
-- in canvas-cm coordinates. The SVG is also the source of truth for the
-- downloaded composition (compositeOverlay reads .grid-overlay).
-- We scale canvas cm by this factor for the SVG viewBox. The choice is
-- arbitrary but makes 1 unit ≈ 1 screen pixel at typical render sizes,
-- so existing grid stroke widths (1-5) and label font sizes (6-14) feel
-- right without needing per-mode tuning.
canvasFitDrawScale : Float
canvasFitDrawScale =
    100


viewCanvasFitMode : Model -> String -> Int -> Int -> Float -> Float -> Html Msg
viewCanvasFitMode model url imgWidth imgHeight cw ch =
    let
        s = canvasFitDrawScale
        vbW = cw * s
        vbH = ch * s

        imgAspect = toFloat imgWidth / toFloat imgHeight
        canvasAspect = cw / ch

        ( baseW, baseH ) =
            case model.imageFit of
                "fit-width" ->
                    ( cw, cw / imgAspect )

                "fit-height" ->
                    ( ch * imgAspect, ch )

                _ ->
                    if imgAspect > canvasAspect then
                        ( cw, cw / imgAspect )
                    else
                        ( ch * imgAspect, ch )

        finalW = baseW * model.imageScale
        finalH = baseH * model.imageScale

        finalX = (cw - finalW) / 2 + model.imageOffsetX
        finalY = (ch - finalH) / 2 + model.imageOffsetY

        labelsTooSmall =
            case ( model.imageDisplayedWidth, model.imageDisplayedHeight ) of
                ( Just dw, Just dh ) ->
                    dw / toFloat model.gridCols < 18 || dh / toFloat model.gridRows < 18

                _ ->
                    False

        -- The viewBox is in cm × drawScale units, so the user's px-based
        -- label size renders microscopically on large canvases (a 50 cm
        -- canvas is a 5000-unit viewBox squeezed into ~900 screen px).
        -- Convert the on-screen px preference into viewBox units via the
        -- SVG's displayed width; fall back to a third of a cell.
        labelSizeFallbackVb =
            round (Basics.min (vbW / toFloat (Basics.max 1 model.gridCols)) (vbH / toFloat (Basics.max 1 model.gridRows)) / 3)

        labelSizeVb =
            case ( model.imageDisplayedWidth, model.imageDisplayedHeight ) of
                ( Just dw, Just dh ) ->
                    let
                        -- preserveAspectRatio "meet": when the element's
                        -- aspect differs from the viewBox (letterboxing, as
                        -- on narrow phone layouts), the effective scale is
                        -- the SMALLER of the two ratios — width alone
                        -- overestimates it and shrinks the labels.
                        vbScale = Basics.min (dw / vbW) (dh / vbH)
                    in
                    if vbScale > 0 then
                        round (toFloat model.cellLabelSize / vbScale)
                    else
                        labelSizeFallbackVb

                _ ->
                    labelSizeFallbackVb

        baseConfig = settingsFromModel model
        config =
            if labelsTooSmall then
                { baseConfig | showCellLabels = False, cellLabelSize = labelSizeVb }
            else
                { baseConfig | cellLabelSize = labelSizeVb }

        -- The grid is laid out in (cm × drawScale) viewBox units.
        canvasDims = { width = round vbW, height = round vbH }
        -- Subdivisions track the image's content, so position them within
        -- the image's rect in canvas-cm scaled space (not the whole canvas).
        imageRectInSvg =
            { x = finalX * s
            , y = finalY * s
            , w = finalW * s
            , h = finalH * s
            }
        adaptiveSubs = subdivisionLinesAt config imageRectInSvg (currentAdaptiveCells model)
        -- Labels follow the canvas grid (not the image rect), so they're
        -- positioned relative to the full canvas viewBox.
        labelsForCanvas = cellLabelsSvg config Nothing canvasDims
        gridLines = allGridLines { config | showCellLabels = False } canvasDims [] ++ adaptiveSubs ++ labelsForCanvas

        decodeDragStart =
            -- Capture the SVG's current pixel dimensions at pointerdown so
            -- the drag conversion has fresh, race-free measurements.
            -- clientWidth/clientHeight are integers; map to Float.
            Json.Decode.map4 ImageDragStart
                (Json.Decode.field "clientX" Json.Decode.float)
                (Json.Decode.field "clientY" Json.Decode.float)
                (Json.Decode.at [ "currentTarget", "clientWidth" ]
                    (Json.Decode.map toFloat Json.Decode.int)
                )
                (Json.Decode.at [ "currentTarget", "clientHeight" ]
                    (Json.Decode.map toFloat Json.Decode.int)
                )
    in
    div [ class "gridded-image-container canvas-fit-container" ]
        [ div [ class "canvas-side-label canvas-side-label--width" ]
            [ text (formatCm cw ++ " cm") ]
        , div [ class "canvas-fit-row" ]
            [ div
                [ class "canvas-stage"
                , style "aspect-ratio" (String.fromFloat cw ++ " / " ++ String.fromFloat ch)

                -- Explicit width = "largest box of this ratio fitting the row
                -- width AND the 80vh height cap". Leaving it to flex +
                -- aspect-ratio is engine-dependent: WebKit collapsed the
                -- stage to a sliver, Chromium squashed the ratio against the
                -- row's max-height.
                , style "width"
                    ("min(100%, calc((80vh - 24px) * " ++ String.fromFloat (cw / ch) ++ "))")
                ]
                [ Svg.svg
                    [ SvgAttr.viewBox ("0 0 " ++ String.fromFloat vbW ++ " " ++ String.fromFloat vbH)
                    , SvgAttr.preserveAspectRatio "xMidYMid meet"
                    , SvgAttr.class
                        (if model.showGrid then
                            "grid-overlay canvas-frame"
                         else
                            "grid-overlay canvas-frame grid-overlay--hidden"
                        )
                    , Html.Events.on "pointerdown" decodeDragStart
                    ]
                    ([ Svg.rect
                        [ SvgAttr.x "0"
                        , SvgAttr.y "0"
                        , SvgAttr.width (String.fromFloat vbW)
                        , SvgAttr.height (String.fromFloat vbH)
                        , SvgAttr.fill "white"
                        ]
                        []
                     , Svg.image
                        [ SvgAttr.xlinkHref url
                        , SvgAttr.x (String.fromFloat (finalX * s))
                        , SvgAttr.y (String.fromFloat (finalY * s))
                        , SvgAttr.width (String.fromFloat (finalW * s))
                        , SvgAttr.height (String.fromFloat (finalH * s))
                        , SvgAttr.preserveAspectRatio "none"
                        , SvgAttr.class "canvas-frame-image"
                        ]
                        []
                     ]
                        ++ gridLines
                    )
                ]
            , div [ class "canvas-side-label canvas-side-label--height" ]
                [ text (formatCm ch ++ " cm") ]
            ]
        ]


main : Program () Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }
