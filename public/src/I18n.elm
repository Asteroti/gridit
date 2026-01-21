module I18n exposing (Language(..), TranslationKey(..), translate)

-- LANGUAGE TYPE


type Language
    = English
    | Spanish
    | Latin
    | Italian
    | Portuguese
    | French
    | Asturiano
    | Gaelic
    | Euskara
    | Japanese
    | Russian
    | Tuvan
    | Amharic
    | Hebrew



-- TRANSLATION KEYS
-- Define all the text keys used in the application


type TranslationKey
    = AppTitle
    | UploadImage
    | CustomizeIt
    | GridSize
    | Rectangles
    | GridColor
    | GridThickness
    | GridOpacity
    | OriginalImage
    | GriddedImage
    | DownloadGriddedImage
    | Nice
    | NiceCounter
    | NoImageYet
    | LanguageLabel
    | FileOperations
    | GridParameters
    | Actions
    | AppSubtitle
    | GridPreviewPlaceholder
    | UploadPlaceholder
    | StatusReady
    | ShowDiagonals
    | Download
    | Share
    | UploadNew
    | UploadPrompt
    | UploadDescription
    | ChooseFile
    | GridSettings
    | DiagonalGrid
    | WhatsThisAbout
    | WhatsThisDescription
    | PerfectForArtists
    | MaxFileSize
    | SupportedFormats
    | GriditScores
    | YourScore
    | ThatsNiceGridit
    | MadeInArgentina
    | WhatsGridit
    | FooterTooltip



-- TRANSLATIONS
-- Dictionary of all translations


translations : Language -> TranslationKey -> String
translations language key =
    case language of
        English ->
            englishTranslations key

        Spanish ->
            spanishTranslations key

        Latin ->
            latinTranslations key

        Italian ->
            italianTranslations key

        Portuguese ->
            portugueseTranslations key

        French ->
            frenchTranslations key

        Asturiano ->
            asturianoTranslations key

        Gaelic ->
            gaelicTranslations key

        Euskara ->
            euskaraTranslations key

        Japanese ->
            japaneseTranslations key

        Russian ->
            russianTranslations key

        Tuvan ->
            tuvanTranslations key

        Amharic ->
            amharicTranslations key

        Hebrew ->
            hebrewTranslations key



-- ENGLISH TRANSLATIONS


englishTranslations : TranslationKey -> String
englishTranslations key =
    case key of
        AppTitle ->
            "Gridit! 🐸"

        UploadImage ->
            "Upload Image"

        CustomizeIt ->
            "Customize it!"

        GridSize ->
            "Size"

        Rectangles ->
            " rectangles."

        GridColor ->
            "Color"

        GridThickness ->
            "Thickness"

        GridOpacity ->
            "Opacity"

        OriginalImage ->
            "Original Image"

        GriddedImage ->
            "Gridded Image"

        DownloadGriddedImage ->
            "Download your Gridded Image!!!"

        Nice ->
            "Nice! "

        NiceCounter ->
            "Nice Counter: "

        NoImageYet ->
            "No image yet! Click Upload Image to begin!"

        LanguageLabel ->
            "Language:"

        FileOperations ->
            "Start here"

        GridParameters ->
            "Customize the grid so you can see it properly over your image"

        Actions ->
            "🐸 🐸 🐸"

        AppSubtitle ->
            "Hello there. This helps you create a rectilinear grid over an image of your choosing"

        GridPreviewPlaceholder ->
            "Your gridded image will appear here"

        UploadPlaceholder ->
            "Upload an image to begin"

        StatusReady ->
            "Status: Ready"

        ShowDiagonals ->
            "Add diagonals"

        Download ->
            "Download"

        Share ->
            "Share"

        UploadNew ->
            "Upload New"

        UploadPrompt ->
            "Upload Image"

        UploadDescription ->
            "Choose a file or drag and drop here"

        ChooseFile ->
            "Choose File"

        GridSettings ->
            "Grid Settings"

        DiagonalGrid ->
            "Diagonal Grid"

        WhatsThisAbout ->
            "What's This About?"

        WhatsThisDescription ->
            "Gridit Baby! helps you apply perfect grids to your images - just like how frogs say \"gridit gridit\"! Upload any image, adjust the grid size and opacity, then use the grid as a guide for composition, drawing, or design work."

        PerfectForArtists ->
            "Perfect for artists, photographers, and anyone who loves precise layouts!"

        MaxFileSize ->
            "Max 5MB"

        SupportedFormats ->
            "JPG, PNG, GIF supported"

        GriditScores ->
            "Gridit Scores"

        YourScore ->
            "Your Score:"

        ThatsNiceGridit ->
            "That's Nice! Gridit!"

        MadeInArgentina ->
            "Made in Argentina with"

        WhatsGridit ->
            "What's Gridit?"

        FooterTooltip ->
            "Hi! I'm a developer who loves to code and paint. Gridit helps me transfer sketches to canvas using grids. Hope it helps you too!"



-- SPANISH TRANSLATIONS


spanishTranslations : TranslationKey -> String
spanishTranslations key =
    case key of
        AppTitle ->
            "Gridit! 🐸"

        UploadImage ->
            "Subir una Imagen"

        CustomizeIt ->
            "Personalizá la grilla"

        GridSize ->
            "Tamaño"

        Rectangles ->
            " rectángulos"

        GridColor ->
            "Color"

        GridThickness ->
            "Grosor"

        GridOpacity ->
            "Opacidad"

        OriginalImage ->
            "Imagen Original"

        GriddedImage ->
            "Imagen con Grilla"

        DownloadGriddedImage ->
            "Descarga tu Imagen con Grilla!"

        Nice ->
            "Buenísimo! "

        NiceCounter ->
            "Contador de Buenísimo: "

        NoImageYet ->
            "Hacé click en Subir Imagen para empezar!"

        LanguageLabel ->
            "Idioma:"

        FileOperations ->
            "Empezá acá"

        GridParameters ->
            "Customizá la grilla para verla bien sobre tu imagen"

        Actions ->
            "🐸 🐸 🐸"

        AppSubtitle ->
            "Buenas. Agregale una grilla rectilinear a una imagen que elijas"

        GridPreviewPlaceholder ->
            "Tu imagen con grilla va a aparecer acá"

        UploadPlaceholder ->
            "Subí una imagen para empezar"

        StatusReady ->
            "Status: Listo"

        ShowDiagonals ->
            "Agregar diagonales"

        Download ->
            "Descargar"

        Share ->
            "Compartir"

        UploadNew ->
            "Subir Nuevo"

        UploadPrompt ->
            "Subir una Imagen"

        UploadDescription ->
            "Elige un archivo o arrástralo aquí"

        ChooseFile ->
            "Elegir Archivo"

        GridSettings ->
            "Ajustes de Cuadrícula"

        DiagonalGrid ->
            "Cuadrícula Diagonal"

        WhatsThisAbout ->
            "¿De qué se trata?"

        WhatsThisDescription ->
            "¡Gridit Baby! te ayuda a aplicar grillas perfectas a tus imágenes - ¡como cuando las ranas dicen \"gridit gridit\"! Subí cualquier imagen, ajustá el tamaño y opacidad de la grilla, y usala como guía para composición, dibujo o diseño."

        PerfectForArtists ->
            "¡Perfecto para artistas, fotógrafos y cualquiera que ame los diseños precisos!"

        MaxFileSize ->
            "Máx 5MB"

        SupportedFormats ->
            "JPG, PNG, GIF soportados"

        GriditScores ->
            "Puntuación Gridit"

        YourScore ->
            "Tu puntuación:"

        ThatsNiceGridit ->
            "¡Qué lindo! ¡Gridit!"

        MadeInArgentina ->
            "Hecho en Argentina con"

        WhatsGridit ->
            "¿Qué es Gridit?"

        FooterTooltip ->
            "¡Hola! Soy una desarrolladora que ama programar y pintar. Gridit me ayuda a transferir bocetos al lienzo usando grillas. ¡Espero que te sirva también!"



-- LATIN TRANSLATIONS


latinTranslations : TranslationKey -> String
latinTranslations key =
    case key of
        AppTitle ->
            "Gridit! 🐸"

        UploadImage ->
            "Imago Submittere"

        CustomizeIt ->
            "Personaliza!"

        GridSize ->
            "Magnitudinem"

        Rectangles ->
            " rectangula."

        GridColor ->
            "Color"

        GridThickness ->
            "Crassitudo"

        GridOpacity ->
            "Opacitas"

        OriginalImage ->
            "Imago Originalis"

        GriddedImage ->
            "Imago cum Craticula"

        DownloadGriddedImage ->
            "Imago cum Craticula Discaricare!!!"

        Nice ->
            "Bellus! "

        NiceCounter ->
            "Bellus Numerator: "

        NoImageYet ->
            "Nondum imago! Imago Submittere preme ut incipias!"

        LanguageLabel ->
            "Lingua:"

        FileOperations ->
            "Incipe hic"

        GridParameters ->
            "Personaliza cratem ut videas eam recte super imaginem tuam"

        Actions ->
            "🐸 🐸 🐸"

        AppSubtitle ->
            "Salve. Hoc te adiuvat creare reticulum rectilineare super imaginem tuam electam"

        GridPreviewPlaceholder ->
            "Imago tua cum craticula hic apparebit"

        UploadPlaceholder ->
            "Submitte imaginem ut incipias"

        StatusReady ->
            "Status: Paratus"

        ShowDiagonals ->
            "Adde diagonalia"

        Download ->
            "Discaricare"

        Share ->
            "Communicare"

        UploadNew ->
            "Nova Submittere"

        UploadPrompt ->
            "Imago Submittere"

        UploadDescription ->
            "Elige fasciculum aut trahe et demitte hic"

        ChooseFile ->
            "Eligere Fasciculum"

        GridSettings ->
            "Configuratio Reticulationis"

        DiagonalGrid ->
            "Reticulatio Diagonalis"

        WhatsThisAbout ->
            "Quid Hoc Est?"

        WhatsThisDescription ->
            "Gridit Baby! te adiuvat perfectas cratias imaginibus tuis applicare - sicut ranae dicunt \"gridit gridit\"! Quamlibet imaginem submitte, magnitudinem et opacitatem gratiae tempera, deinde ut duce ad compositionem, picturam vel opus designationis utere."

        PerfectForArtists ->
            "Perfectum pro artificibus, photographis, et omnibus qui dispositiones praecisas amant!"

        MaxFileSize ->
            "Max 5MB"

        SupportedFormats ->
            "JPG, PNG, GIF sustinetur"

        GriditScores ->
            "Puncta Gridit"

        YourScore ->
            "Puncta Tua:"

        ThatsNiceGridit ->
            "Pulchrum Est! Gridit!"

        MadeInArgentina ->
            "Factum in Argentina cum"

        WhatsGridit ->
            "Quid est Gridit?"

        FooterTooltip ->
            "Salve! Sum programmator qui amat codicem scribere et pingere. Gridit me adiuvat picturas ad telam transferre utens cratibulis. Spero tibi quoque prodesse!"



-- ITALIAN TRANSLATIONS


italianTranslations : TranslationKey -> String
italianTranslations key =
    case key of
        AppTitle ->
            "Gridit! 🐸"

        UploadImage ->
            "Carica Immagine"

        CustomizeIt ->
            "Personalizzalo!"

        GridSize ->
            "Dimensione"

        Rectangles ->
            " rettangoli."

        GridColor ->
            "Colore"

        GridThickness ->
            "Spessore"

        GridOpacity ->
            "Opacità"

        OriginalImage ->
            "Immagine Originale"

        GriddedImage ->
            "Immagine con Griglia"

        DownloadGriddedImage ->
            "Scarica la tua Immagine con Griglia!"

        Nice ->
            "Bello! "

        NiceCounter ->
            "Contatore Bello: "

        NoImageYet ->
            "Nessuna immagine ancora! Clicca su Carica Immagine per iniziare!"

        LanguageLabel ->
            "Lingua:"

        FileOperations ->
            "Inizia qui"

        GridParameters ->
            "Personalizza la griglia in modo da vederla correttamente sulla tua immagine"

        Actions ->
            "🐸 🐸 🐸"

        AppSubtitle ->
            "Ciao. Questo ti aiuta a creare una griglia rettilinea su un'immagine di tua scelta"

        GridPreviewPlaceholder ->
            "La tua immagine con griglia apparirà qui"

        UploadPlaceholder ->
            "Carica un'immagine per iniziare"

        StatusReady ->
            "Status: Pronto"

        ShowDiagonals ->
            "Aggiungi diagonali"

        Download ->
            "Scarica"

        Share ->
            "Condividi"

        UploadNew ->
            "Carica Nuovo"

        UploadPrompt ->
            "Carica un'Immagine"

        UploadDescription ->
            "Scegli un file o trascina e rilascia qui"

        ChooseFile ->
            "Scegli File"

        GridSettings ->
            "Impostazioni Griglia"

        DiagonalGrid ->
            "Griglia Diagonale"

        WhatsThisAbout ->
            "Di cosa si tratta?"

        WhatsThisDescription ->
            "Gridit Baby! ti aiuta ad applicare griglie perfette alle tue immagini - proprio come le rane dicono \"gridit gridit\"! Carica qualsiasi immagine, regola dimensione e opacità della griglia, poi usala come guida per composizione, disegno o design."

        PerfectForArtists ->
            "Perfetto per artisti, fotografi e chiunque ami layout precisi!"

        MaxFileSize ->
            "Max 5MB"

        SupportedFormats ->
            "JPG, PNG, GIF supportati"

        GriditScores ->
            "Punteggi Gridit"

        YourScore ->
            "Il tuo punteggio:"

        ThatsNiceGridit ->
            "Che bello! Gridit!"

        MadeInArgentina ->
            "Fatto in Argentina con"

        WhatsGridit ->
            "Cos'è Gridit?"

        FooterTooltip ->
            "Ciao! Sono una sviluppatrice che ama programmare e dipingere. Gridit mi aiuta a trasferire schizzi sulla tela usando griglie. Spero sia utile anche a te!"



-- PORTUGUESE TRANSLATIONS


portugueseTranslations : TranslationKey -> String
portugueseTranslations key =
    case key of
        AppTitle ->
            "Gridit! 🐸"

        UploadImage ->
            "Carregar Imagem"

        CustomizeIt ->
            "Personalize!"

        GridSize ->
            "Tamanho"

        Rectangles ->
            " retângulos."

        GridColor ->
            "Cor"

        GridThickness ->
            "Espessura: "

        GridOpacity ->
            "Opacidade"

        OriginalImage ->
            "Imagem Original"

        GriddedImage ->
            "Imagem com Grade"

        DownloadGriddedImage ->
            "Baixe sua Imagem com Grade!"

        Nice ->
            "Legal! "

        NiceCounter ->
            "Contador Legal: "

        NoImageYet ->
            "Nenhuma imagem ainda! Clique em Carregar Imagem para começar!"

        LanguageLabel ->
            "Idioma:"

        FileOperations ->
            "Comece aqui"

        GridParameters ->
            "Personalize a grade para que você possa vê-la corretamente sobre sua imagem"

        Actions ->
            "🐸 🐸 🐸"

        AppSubtitle ->
            "Olá. Isto ajuda-te a criar uma grelha retilínea sobre uma imagem à tua escolha"

        GridPreviewPlaceholder ->
            "Sua imagem com grade aparecerá aqui"

        UploadPlaceholder ->
            "Carregue uma imagem para começar"

        StatusReady ->
            "Status: Pronto"

        ShowDiagonals ->
            "Adicionar diagonais"

        Download ->
            "Baixar"

        Share ->
            "Compartilhar"

        UploadNew ->
            "Carregar Novo"

        UploadPrompt ->
            "Carregar uma Imagem"

        UploadDescription ->
            "Escolha um arquivo ou arraste e solte aqui"

        ChooseFile ->
            "Escolher Arquivo"

        GridSettings ->
            "Configurações de Grade"

        DiagonalGrid ->
            "Grade Diagonal"

        WhatsThisAbout ->
            "Do que se trata?"

        WhatsThisDescription ->
            "Gridit Baby! ajuda-te a aplicar grades perfeitas às tuas imagens - tal como os sapos dizem \"gridit gridit\"! Carrega qualquer imagem, ajusta o tamanho e opacidade da grade, depois usa-a como guia para composição, desenho ou design."

        PerfectForArtists ->
            "Perfeito para artistas, fotógrafos e qualquer pessoa que ame layouts precisos!"

        MaxFileSize ->
            "Máx 5MB"

        SupportedFormats ->
            "JPG, PNG, GIF suportados"

        GriditScores ->
            "Pontuações Gridit"

        YourScore ->
            "Tua pontuação:"

        ThatsNiceGridit ->
            "Que legal! Gridit!"

        MadeInArgentina ->
            "Feito na Argentina com"

        WhatsGridit ->
            "O que é Gridit?"

        FooterTooltip ->
            "Olá! Sou uma desenvolvedora que ama programar e pintar. Gridit me ajuda a transferir esboços para a tela usando grades. Espero que te ajude também!"



-- FRENCH TRANSLATIONS


frenchTranslations : TranslationKey -> String
frenchTranslations key =
    case key of
        AppTitle ->
            "Gridit! 🐸"

        UploadImage ->
            "Télécharger une Image"

        CustomizeIt ->
            "Personnalisez-le!"

        GridSize ->
            "Taille"

        Rectangles ->
            " rectangles."

        GridColor ->
            "Couleur"

        GridThickness ->
            "Épaisseur"

        GridOpacity ->
            "Opacité"

        OriginalImage ->
            "Image Originale"

        GriddedImage ->
            "Image avec Grille"

        DownloadGriddedImage ->
            "Téléchargez votre Image avec Grille!"

        Nice ->
            "Sympa! "

        NiceCounter ->
            "Compteur Sympa: "

        NoImageYet ->
            "Pas encore d'image! Cliquez sur Télécharger une Image pour commencer!"

        LanguageLabel ->
            "Langue:"

        FileOperations ->
            "Commencez ici"

        GridParameters ->
            "Personnalisez la grille pour la voir correctement sur votre image"

        Actions ->
            "🐸 🐸 🐸"

        AppSubtitle ->
            "Bonjour. Ceci vous aide à créer une grille rectiligne sur une image de votre choix"

        GridPreviewPlaceholder ->
            "Votre image avec grille apparaîtra ici"

        UploadPlaceholder ->
            "Téléchargez une image pour commencer"

        StatusReady ->
            "Status: Prêt"

        ShowDiagonals ->
            "Ajouter des diagonales"

        Download ->
            "Télécharger"

        Share ->
            "Partager"

        UploadNew ->
            "Télécharger Nouveau"

        UploadPrompt ->
            "Télécharger une Image"

        UploadDescription ->
            "Choisissez un fichier ou glissez-déposez ici"

        ChooseFile ->
            "Choisir Fichier"

        GridSettings ->
            "Paramètres de Grille"

        DiagonalGrid ->
            "Grille Diagonale"

        WhatsThisAbout ->
            "De quoi s'agit-il?"

        WhatsThisDescription ->
            "Gridit Baby! vous aide à appliquer des grilles parfaites à vos images - comme les grenouilles disent \"gridit gridit\"! Téléchargez n'importe quelle image, ajustez la taille et l'opacité de la grille, puis utilisez-la comme guide pour la composition, le dessin ou le design."

        PerfectForArtists ->
            "Parfait pour les artistes, photographes et tous ceux qui aiment les mises en page précises!"

        MaxFileSize ->
            "Max 5Mo"

        SupportedFormats ->
            "JPG, PNG, GIF supportés"

        GriditScores ->
            "Scores Gridit"

        YourScore ->
            "Votre score:"

        ThatsNiceGridit ->
            "C'est sympa! Gridit!"

        MadeInArgentina ->
            "Fait en Argentine avec"

        WhatsGridit ->
            "C'est quoi Gridit?"

        FooterTooltip ->
            "Salut! Je suis une développeuse qui aime coder et peindre. Gridit m'aide à transférer des croquis sur toile en utilisant des grilles. J'espère que ça vous aide aussi!"



-- ASTURIANO TRANSLATIONS


asturianoTranslations : TranslationKey -> String
asturianoTranslations key =
    case key of
        AppTitle ->
            "Gridit! 🐸"

        UploadImage ->
            "Xubir Imaxe"

        CustomizeIt ->
            "¡Personalízalu!"

        GridSize ->
            "Tamañu"

        Rectangles ->
            " rectángulos."

        GridColor ->
            "Color"

        GridThickness ->
            "Grosor"

        GridOpacity ->
            "Opacidá"

        OriginalImage ->
            "Imaxe Orixinal"

        GriddedImage ->
            "Imaxe con Cuadrícula"

        DownloadGriddedImage ->
            "¡Descarga la to Imaxe con Cuadrícula!"

        Nice ->
            "¡Guapu! "

        NiceCounter ->
            "Contador Guapu: "

        NoImageYet ->
            "¡Entá nun hai imaxe! ¡Fai clic en Xubir Imaxe pa entamar!"

        LanguageLabel ->
            "Llingua:"

        FileOperations ->
            "Empieza equí"

        GridParameters ->
            "Personaliza la cuadrícula pa vela correutamente sobro la to imaxen"

        Actions ->
            "🐸 🐸 🐸"

        AppSubtitle ->
            "Hola. Esto ayúdate a crear una cuadrícula retilínia sobro una imaxen de la to eleición"

        GridPreviewPlaceholder ->
            "La to imaxe con cuadrícula apaecerá equí"

        UploadPlaceholder ->
            "Xube una imaxe pa entamar"

        StatusReady ->
            "Status: Llistu"

        ShowDiagonals ->
            "Añader diagonales"

        Download ->
            "Descargar"

        Share ->
            "Compartir"

        UploadNew ->
            "Xubir Nuevu"

        UploadPrompt ->
            "Xubir una Imaxe"

        UploadDescription ->
            "Escueyi un ficheru o arrastra y suelta equí"

        ChooseFile ->
            "Escueyi Ficheru"

        GridSettings ->
            "Axustes de Cuadrícula"

        DiagonalGrid ->
            "Cuadrícula Diagonal"

        WhatsThisAbout ->
            "¿De qué va eso?"

        WhatsThisDescription ->
            "¡Gridit Baby! ayúdate a aplicar cuadrícules perfectes a les tos imaxes - ¡como cuando les ranes dicen \"gridit gridit\"! Xube cualquier imaxe, axusta'l tamañu y opacidá de la cuadrícula, y úsala como guía pa composición, dibuxu o diseñu."

        PerfectForArtists ->
            "¡Perfectu pa artistes, fotógrafos y cualquiera que-y gusten los diseños precisos!"

        MaxFileSize ->
            "Máx 5MB"

        SupportedFormats ->
            "JPG, PNG, GIF soportaos"

        GriditScores ->
            "Puntuaciones Gridit"

        YourScore ->
            "La to puntuación:"

        ThatsNiceGridit ->
            "¡Qué guapu! ¡Gridit!"

        MadeInArgentina ->
            "Fechu n'Arxentina con"

        WhatsGridit ->
            "¿Qué ye Gridit?"

        FooterTooltip ->
            "¡Hola! Soi una desarrolladora que-y presta programar y pintar. Gridit ayúdame a tresferir bocetos al llienzu usando cuadrícules. ¡Espero que te sirva tamién!"



-- GAELIC TRANSLATIONS


gaelicTranslations : TranslationKey -> String
gaelicTranslations key =
    case key of
        AppTitle ->
            "Gridit! 🐸"

        UploadImage ->
            "Luchdaich Dealbh"

        CustomizeIt ->
            "Gnàthaich e!"

        GridSize ->
            "Meud"

        Rectangles ->
            " ceart-chearnagan."

        GridColor ->
            "Dath"

        GridThickness ->
            "Tiughad"

        GridOpacity ->
            "Dorchadas"

        OriginalImage ->
            "Dealbh Tùsail"

        GriddedImage ->
            "Dealbh le Griod"

        DownloadGriddedImage ->
            "Luchdaich sìos do Dhealbh le Griod!"

        Nice ->
            "Sgoinneil! "

        NiceCounter ->
            "Cunntair Sgoinneil: "

        NoImageYet ->
            "Chan eil dealbh ann fhathast! Cliog air Luchdaich Dealbh gus tòiseachadh!"

        LanguageLabel ->
            "Cànan:"

        FileOperations ->
            "Tòisich an seo"

        GridParameters ->
            "Gnàthaich an griod gus am faic thu e gu ceart thar do dhealbh"

        Actions ->
            "🐸 🐸 🐸"

        AppSubtitle ->
            "Halò. Bidh seo a' cuideachadh thu le bhith a' cruthachadh griod dìreach air ìomhaigh de do roghainn"

        GridPreviewPlaceholder ->
            "Nochdaidh do dhealbh le griod an seo"

        UploadPlaceholder ->
            "Luchdaich dealbh gus tòiseachadh"

        StatusReady ->
            "Status: Deiseil"

        ShowDiagonals ->
            "Cuir trasnanan ris"

        Download ->
            "Luchdaich sìos"

        Share ->
            "Co-roinn"

        UploadNew ->
            "Luchdaich Ùr"

        UploadPrompt ->
            "Luchdaich Dealbh"

        UploadDescription ->
            "Tagh faidhle no tarraing is leig às an seo"

        ChooseFile ->
            "Tagh Faidhle"

        GridSettings ->
            "Suidheachaidhean Griod"

        DiagonalGrid ->
            "Griod Trasnach"

        WhatsThisAbout ->
            "Dè tha seo mu dheidhinn?"

        WhatsThisDescription ->
            "Tha Gridit Baby! a' cuideachadh thu le bhith a' cur griodaichean foirfe air na dealbhan agad - dìreach mar a chanas losgannan \"gridit gridit\"! Luchdaich dealbh sam bith, atharraich meud agus dorchadas a' ghriod, an uairsin cleachd e mar stiùireadh airson co-dhèanamh, tarraing no obair dealbhaidh."

        PerfectForArtists ->
            "Foirfe airson luchd-ealain, dealbhadairean, agus duine sam bith a tha gràdhach air co-dhealbhaidhean mionaideach!"

        MaxFileSize ->
            "Max 5MB"

        SupportedFormats ->
            "JPG, PNG, GIF le taic"

        GriditScores ->
            "Sgòran Gridit"

        YourScore ->
            "Do sgòr:"

        ThatsNiceGridit ->
            "Tha sin sgoinneil! Gridit!"

        MadeInArgentina ->
            "Air a dhèanamh ann an Argentina le"

        WhatsGridit ->
            "Dè th' ann an Gridit?"

        FooterTooltip ->
            "Halò! Is mise leasaichear a tha gaolach air còdadh agus peantadh. Tha Gridit gam chuideachadh gus sgeidseachan a ghluasad gu canabhas le griodaichean. Tha mi an dòchas gun cuidich e thu cuideachd!"



-- EUSKARA TRANSLATIONS


euskaraTranslations : TranslationKey -> String
euskaraTranslations key =
    case key of
        AppTitle ->
            "Gridit! 🐸"

        UploadImage ->
            "Irudia Igo"

        CustomizeIt ->
            "Pertsonalizatu!"

        GridSize ->
            "Tamaina"

        Rectangles ->
            " laukizuzenak."

        GridColor ->
            "Kolorea"

        GridThickness ->
            "Lodiera"

        GridOpacity ->
            "Opakutasuna"

        OriginalImage ->
            "Jatorrizko Irudia"

        GriddedImage ->
            "Saretadun Irudia"

        DownloadGriddedImage ->
            "Zure Saretadun Irudia Deskargatu!"

        Nice ->
            "Bikain! "

        NiceCounter ->
            "Bikain Kontagailua: "

        NoImageYet ->
            "Oraindik ez dago irudirik! Egin klik Irudia Igo botoian hasteko!"

        LanguageLabel ->
            "Hizkuntza:"

        FileOperations ->
            "Hasi hemen"

        GridParameters ->
            "Pertsonalizatu sareta zure irudian behar bezala ikusteko"

        Actions ->
            "🐸 🐸 🐸"

        AppSubtitle ->
            "Kaixo. Honek hautatutako irudi baten gainean sareta zuzen bat sortzen laguntzen dizu"

        GridPreviewPlaceholder ->
            "Zure saretadun irudia hemen agertuko da"

        UploadPlaceholder ->
            "Igo irudi bat hasteko"

        StatusReady ->
            "Egoera: Prest"

        ShowDiagonals ->
            "Diagonalak gehitu"

        Download ->
            "Deskargatu"

        Share ->
            "Partekatu"

        UploadNew ->
            "Igo Berria"

        UploadPrompt ->
            "Igo Irudia"

        UploadDescription ->
            "Aukeratu fitxategia edo arrastatu eta jaregin hemen"

        ChooseFile ->
            "Fitxategia Aukeratu"

        GridSettings ->
            "Sareta Ezarpenak"

        DiagonalGrid ->
            "Sareta Diagonala"

        WhatsThisAbout ->
            "Zer da hau?"

        WhatsThisDescription ->
            "Gridit Baby!-k sareta perfektuak aplikatzen laguntzen dizu zure irudiei - igelak \"gridit gridit\" esaten duten bezala! Igo edozein irudi, doitu saretaren tamaina eta opakutasuna, eta gero erabili gida gisa konposiziorako, marrazkirako edo diseinurako."

        PerfectForArtists ->
            "Artista, argazkilari eta diseinu zehatzak maite dituen edonorentzat perfektua!"

        MaxFileSize ->
            "Gehienez 5MB"

        SupportedFormats ->
            "JPG, PNG, GIF onartuta"

        GriditScores ->
            "Gridit Puntuazioak"

        YourScore ->
            "Zure puntuazioa:"

        ThatsNiceGridit ->
            "Polita da! Gridit!"

        MadeInArgentina ->
            "Argentinan egina honekin"

        WhatsGridit ->
            "Zer da Gridit?"

        FooterTooltip ->
            "Kaixo! Programatzea eta margotzea maite duen garatzailea naiz. Gridit-ek zirriborroak oihalera transferitzen laguntzen dit saretak erabiliz. Espero dut zuri ere laguntzea!"



-- JAPANESE TRANSLATIONS


japaneseTranslations : TranslationKey -> String
japaneseTranslations key =
    case key of
        AppTitle ->
            "Gridit! 🐸"

        UploadImage ->
            "画像をアップロード"

        CustomizeIt ->
            "カスタマイズしよう！"

        GridSize ->
            "サイズ"

        Rectangles ->
            " 長方形"

        GridColor ->
            "色"

        GridThickness ->
            "太さ"

        GridOpacity ->
            "不透明度"

        OriginalImage ->
            "元の画像"

        GriddedImage ->
            "グリッド付き画像"

        DownloadGriddedImage ->
            "グリッド付き画像をダウンロード！"

        Nice ->
            "いいね！ "

        NiceCounter ->
            "いいねカウンター: "

        NoImageYet ->
            "まだ画像がありません！画像をアップロードをクリックして始めましょう！"

        LanguageLabel ->
            "言語:"

        FileOperations ->
            "ここから始める"

        GridParameters ->
            "画像上で適切に表示できるようにグリッドをカスタマイズする"

        Actions ->
            "🐸 🐸 🐸"

        AppSubtitle ->
            "こんにちは。これはあなたが選んだ画像上に直線グリッドを作成するのに役立ちます"

        GridPreviewPlaceholder ->
            "グリッド付き画像がここに表示されます"

        UploadPlaceholder ->
            "画像をアップロードして始めましょう"

        StatusReady ->
            "ステータス: 準備完了"

        ShowDiagonals ->
            "対角線を追加"

        Download ->
            "ダウンロード"

        Share ->
            "共有"

        UploadNew ->
            "新しくアップロード"

        UploadPrompt ->
            "画像をアップロード"

        UploadDescription ->
            "ファイルを選択するか、ここにドラッグ＆ドロップしてください"

        ChooseFile ->
            "ファイル選択"

        GridSettings ->
            "グリッド設定"

        DiagonalGrid ->
            "対角線グリッド"

        WhatsThisAbout ->
            "これは何？"

        WhatsThisDescription ->
            "Gridit Baby!は、あなたの画像に完璧なグリッドを適用するのを助けます - カエルが「gridit gridit」と言うように！どんな画像でもアップロードし、グリッドのサイズと不透明度を調整し、構図、描画、デザイン作業のガイドとして使用してください。"

        PerfectForArtists ->
            "アーティスト、写真家、そして正確なレイアウトを愛するすべての人に最適！"

        MaxFileSize ->
            "最大5MB"

        SupportedFormats ->
            "JPG、PNG、GIF対応"

        GriditScores ->
            "Griditスコア"

        YourScore ->
            "あなたのスコア："

        ThatsNiceGridit ->
            "いいね！Gridit！"

        MadeInArgentina ->
            "アルゼンチン製"

        WhatsGridit ->
            "Griditとは？"

        FooterTooltip ->
            "こんにちは！プログラミングと絵を描くことが大好きな開発者です。Griditはグリッドを使ってスケッチをキャンバスに転写するのに役立ちます。あなたにも役立つことを願っています！"



-- RUSSIAN TRANSLATIONS


russianTranslations : TranslationKey -> String
russianTranslations key =
    case key of
        AppTitle ->
            "Gridit! 🐸"

        UploadImage ->
            "Загрузить изображение"

        CustomizeIt ->
            "Настроить!"

        GridSize ->
            "Размер"

        Rectangles ->
            " прямоугольников"

        GridColor ->
            "Цвет"

        GridThickness ->
            "Толщина"

        GridOpacity ->
            "Прозрачность"

        OriginalImage ->
            "Исходное изображение"

        GriddedImage ->
            "Изображение с сеткой"

        DownloadGriddedImage ->
            "Скачать изображение с сеткой!"

        Nice ->
            "Отлично! "

        NiceCounter ->
            "Счетчик отлично: "

        NoImageYet ->
            "Изображения пока нет! Нажмите Загрузить изображение, чтобы начать!"

        LanguageLabel ->
            "Язык:"

        FileOperations ->
            "Начните здесь"

        GridParameters ->
            "Настройте сетку, чтобы она хорошо отображалась на вашем изображении"

        Actions ->
            "🐸 🐸 🐸"

        AppSubtitle ->
            "Здравствуйте. Это поможет вам создать прямоугольную сетку поверх выбранного вами изображения"

        GridPreviewPlaceholder ->
            "Ваше изображение с сеткой появится здесь"

        UploadPlaceholder ->
            "Загрузите изображение, чтобы начать"

        StatusReady ->
            "Статус: Готово"

        ShowDiagonals ->
            "Добавить диагонали"

        Download ->
            "Скачать"

        Share ->
            "Поделиться"

        UploadNew ->
            "Загрузить новое"

        UploadPrompt ->
            "Загрузить изображение"

        UploadDescription ->
            "Выберите файл или перетащите его сюда"

        ChooseFile ->
            "Выбрать Файл"

        GridSettings ->
            "Настройки Сетки"

        DiagonalGrid ->
            "Диагональная Сетка"

        WhatsThisAbout ->
            "О чём это?"

        WhatsThisDescription ->
            "Gridit Baby! помогает применять идеальные сетки к вашим изображениям - как лягушки говорят \"gridit gridit\"! Загрузите любое изображение, настройте размер и прозрачность сетки, затем используйте её как руководство для композиции, рисования или дизайна."

        PerfectForArtists ->
            "Идеально для художников, фотографов и всех, кто любит точные макеты!"

        MaxFileSize ->
            "Макс 5МБ"

        SupportedFormats ->
            "JPG, PNG, GIF поддерживаются"

        GriditScores ->
            "Очки Gridit"

        YourScore ->
            "Ваш счёт:"

        ThatsNiceGridit ->
            "Это круто! Gridit!"

        MadeInArgentina ->
            "Сделано в Аргентине с"

        WhatsGridit ->
            "Что такое Gridit?"

        FooterTooltip ->
            "Привет! Я разработчик, который любит программировать и рисовать. Gridit помогает мне переносить эскизы на холст с помощью сеток. Надеюсь, вам тоже пригодится!"



-- TUVAN TRANSLATIONS


tuvanTranslations : TranslationKey -> String
tuvanTranslations key =
    case key of
        AppTitle ->
            "Gridit! 🐸"

        UploadImage ->
            "Чурукту киирер"

        CustomizeIt ->
            "Таарыштырар!"

        GridSize ->
            "Хемчээл"

        Rectangles ->
            " дөрбелчиннер"

        GridColor ->
            "Өң"

        GridThickness ->
            "Кылын"

        GridOpacity ->
            "Көскүзү"

        OriginalImage ->
            "Баштайгы чурук"

        GriddedImage ->
            "Шыйыглыг чурук"

        DownloadGriddedImage ->
            "Шыйыглыг чурукту чүдүрүп алыр!"

        Nice ->
            "Эки! "

        NiceCounter ->
            "Эки саналга: "

        NoImageYet ->
            "Чурук чок! Эгелээр дээш Чурукту киирер деп базыңар!"

        LanguageLabel ->
            "Дыл:"

        FileOperations ->
            "Мындан эгелеңер"

        GridParameters ->
            "Шыйыгны чурукка эки көстүр кылдыр таарыштырыңар"

        Actions ->
            "🐸 🐸 🐸"

        AppSubtitle ->
            "Экии. Бо дээрге силерниң шилип алган чурууңарга дорт шыйыглар кылырынга дузалаар"

        GridPreviewPlaceholder ->
            "Силерниң шыйыглыг чурууңар мында көстүп кээр"

        UploadPlaceholder ->
            "Эгелээр дээш чурукту киириңер"

        StatusReady ->
            "Байдал: Белен"

        ShowDiagonals ->
            "Диагоналдар немээр"

        Download ->
            "Чүдүрүп алыр"

        Share ->
            "Үлежир"

        UploadNew ->
            "Чаа чүдүрер"

        UploadPrompt ->
            "Чурукту киирер"

        UploadDescription ->
            "Файлды шилиңер азы бээр чыгып каапкаш, салып каар"

        ChooseFile ->
            "Файл Шилиир"

        GridSettings ->
            "Шыйыг Тургузуглары"

        DiagonalGrid ->
            "Кыйгаар Шыйыглар"

        WhatsThisAbout ->
            "Бо чүү дугайында?"

        WhatsThisDescription ->
            "Gridit Baby! силерниң чуруктарыңарга эки шыйыглар кылырынга дузалаар - пагалар \"gridit gridit\" дээн ышкаш! Кандыг-даа чурук киирип, шыйыгның хемчээлин болгаш көскүзүн таарыштырыңар, оон ону композиция, чурулга азы дизайн кылырынга удуртулга кылып ажыглаңар."

        PerfectForArtists ->
            "Чурукчуларга, фото тырттырыкчыларга болгаш шын чуруктар ынак улуска дыка эки!"

        MaxFileSize ->
            "Эң хөйү 5MB"

        SupportedFormats ->
            "JPG, PNG, GIF ажыглаттынар"

        GriditScores ->
            "Gridit Санаашкыннары"

        YourScore ->
            "Силерниң санаашкыныңар:"

        ThatsNiceGridit ->
            "Эки! Gridit!"

        MadeInArgentina ->
            "Аргентинага кылган"

        WhatsGridit ->
            "Gridit деп чүү?"

        FooterTooltip ->
            "Экии! Мен программировать база чуруур ынак программист мен. Gridit меңээ шыйыглар ажыглап скетчтерни холстче көжүрерге дузалаар. Силерге база дузалаар деп идегеп тур мен!"



-- AMHARIC TRANSLATIONS


amharicTranslations : TranslationKey -> String
amharicTranslations key =
    case key of
        AppTitle ->
            "Gridit! 🐸"

        UploadImage ->
            "ምስል ይጫኑ"

        CustomizeIt ->
            "ያስተካክሉት!"

        GridSize ->
            "መጠን"

        Rectangles ->
            " አራት ማዕዘኖች"

        GridColor ->
            "ቀለም"

        GridThickness ->
            "ውፍረት"

        GridOpacity ->
            "ግልጽነት"

        OriginalImage ->
            "ዋናው ምስል"

        GriddedImage ->
            "ፍርግርግ ያለው ምስል"

        DownloadGriddedImage ->
            "የፍርግርግ ምስልዎን ያውርዱ!!!"

        Nice ->
            "ጥሩ! "

        NiceCounter ->
            "ጥሩ ቆጣሪ: "

        NoImageYet ->
            "እስካሁን ምንም ምስል የለም! ለመጀመር ምስል ይጫኑ ጠቅ ያድርጉ!"

        LanguageLabel ->
            "ቋንቋ:"

        FileOperations ->
            "እዚህ ይጀምሩ"

        GridParameters ->
            "ፍርግርጉን በምስልዎ ላይ በትክክል እንዲታይ ያስተካክሉት"

        Actions ->
            "🐸 🐸 🐸"

        AppSubtitle ->
            "ሰላም። ይህ በእርስዎ ምርጫ ምስል ላይ አራት ማዕዘናዊ ፍርግርግ እንዲፈጥሩ ይረዳዎታል"

        GridPreviewPlaceholder ->
            "የፍርግርግ ምስልዎ እዚህ ይታያል"

        UploadPlaceholder ->
            "ለመጀመር ምስል ይጫኑ"

        StatusReady ->
            "ሁኔታ: ዝግጁ"

        ShowDiagonals ->
            "ሰማያዊ መስመሮችን አክል"

        Download ->
            "አውርድ"

        Share ->
            "አጋራ"

        UploadNew ->
            "አዲስ ይጹኑ"

        UploadPrompt ->
            "ምስል ይጹኑ"

        UploadDescription ->
            "ፋይል ይምረፑ ወይም እዒህ ይገትቱ እና ይጣሉ"

        ChooseFile ->
            "ፋይል ይምረጡ"

        GridSettings ->
            "የፍርግርግ ቅንብሮች"

        DiagonalGrid ->
            "ሰማያዊ ፍርግርግ"

        WhatsThisAbout ->
            "ይህ ስለ ምን ነው?"

        WhatsThisDescription ->
            "Gridit Baby! ፍፁም ፍርግርጎችን በምስሎችዎ ላይ እንዲተገብሩ ይረዳዎታል - እንቁራሪቶች \"gridit gridit\" እንደሚሉት! ማንኛውንም ምስል ይጫኑ፣ የፍርግርጉን መጠን እና ግልጽነት ያስተካክሉ፣ ከዚያም ለስብጥር፣ ስእል ወይም ዲዛይን ስራ እንደ መመሪያ ይጠቀሙበት።"

        PerfectForArtists ->
            "ለአርቲስቶች፣ ፎቶግራፍ አንሺዎች እና ትክክለኛ ንድፎችን ለሚወዱ ሁሉ ፍፁም!"

        MaxFileSize ->
            "ከፍተኛ 5MB"

        SupportedFormats ->
            "JPG፣ PNG፣ GIF ይደገፋል"

        GriditScores ->
            "የGridit ውጤቶች"

        YourScore ->
            "ውጤትዎ:"

        ThatsNiceGridit ->
            "ጥሩ ነው! Gridit!"

        MadeInArgentina ->
            "በአርጀንቲና ተሰርቷል በ"

        WhatsGridit ->
            "Gridit ምንድን ነው?"

        FooterTooltip ->
            "ሰላም! ኮድ መጻፍ እና መሳል የሚወድ ገንቢ ነኝ። Gridit ፍርግርጎችን በመጠቀም ስዕሎችን ወደ ሸራ ለማስተላለፍ ይረዳኛል። ለእርስዎም እንደሚረዳ ተስፋ አደርጋለሁ!"



-- HEBREW TRANSLATIONS


hebrewTranslations : TranslationKey -> String
hebrewTranslations key =
    case key of
        AppTitle ->
            "Gridit! 🐸"

        UploadImage ->
            "העלאת תמונה"

        CustomizeIt ->
            "התאם אישית!"

        GridSize ->
            "גודל"

        Rectangles ->
            " מלבנים"

        GridColor ->
            "צבע"

        GridThickness ->
            "עובי"

        GridOpacity ->
            "שקיפות"

        OriginalImage ->
            "תמונה מקורית"

        GriddedImage ->
            "תמונה עם רשת"

        DownloadGriddedImage ->
            "הורד את התמונה עם הרשת!!!"

        Nice ->
            "יפה! "

        NiceCounter ->
            "מונה יפה: "

        NoImageYet ->
            "אין תמונה עדיין! לחץ על העלאת תמונה כדי להתחיל!"

        LanguageLabel ->
            "שפה:"

        FileOperations ->
            "התחל כאן"

        GridParameters ->
            "התאם את הרשת כדי שתוכל לראות אותה כראוי על התמונה שלך"

        Actions ->
            "🐸 🐸 🐸"

        AppSubtitle ->
            "שלום. זה עוזר לך ליצור רשת מלבנית על תמונה לבחירתך"

        GridPreviewPlaceholder ->
            "התמונה עם הרשת תופיע כאן"

        UploadPlaceholder ->
            "העלה תמונה כדי להתחיל"

        StatusReady ->
            "סטטוס: מוכן"

        ShowDiagonals ->
            "הוסף אלכסונים"

        Download ->
            "הורדה"

        Share ->
            "שיתוף"

        UploadNew ->
            "העלאה חדשה"

        UploadPrompt ->
            "העלאת תמונה"

        UploadDescription ->
            "בחר קובץ או גרור ושחרר כאן"

        ChooseFile ->
            "בחר קובץ"

        GridSettings ->
            "הגדרות רשת"

        DiagonalGrid ->
            "רשת אלכסונית"

        WhatsThisAbout ->
            "במה מדובר?"

        WhatsThisDescription ->
            "Gridit Baby! עוזר לך ליישם רשתות מושלמות על התמונות שלך - בדיוק כמו שצפרדעים אומרות \"gridit gridit\"! העלה כל תמונה, התאם את גודל הרשת והאטימות, ואז השתמש בה כמדריך לקומפוזיציה, ציור או עיצוב."

        PerfectForArtists ->
            "מושלם לאמנים, צלמים וכל מי שאוהב פריסות מדויקות!"

        MaxFileSize ->
            "מקסימום 5MB"

        SupportedFormats ->
            "JPG, PNG, GIF נתמכים"

        GriditScores ->
            "ניקוד Gridit"

        YourScore ->
            "הניקוד שלך:"

        ThatsNiceGridit ->
            "זה יפה! Gridit!"

        MadeInArgentina ->
            "נעשה בארגנטינה עם"

        WhatsGridit ->
            "מה זה Gridit?"

        FooterTooltip ->
            "שלום! אני מפתחת שאוהבת לתכנת ולצייר. Gridit עוזר לי להעביר סקיצות לקנבס באמצעות רשתות. מקווה שזה יעזור גם לך!"


tuvinianTranslations : TranslationKey -> String
tuvinianTranslations key =
    case key of
        AppTitle ->
            "Gridit! 🐸"

        UploadImage ->
            "Фото хүнү"

        CustomizeIt ->
            "Өөрчүлээр!"

        GridSize ->
            "Хемчээл"

        Rectangles ->
            " Чарыкчылар"

        GridColor ->
            "Өң"

        GridThickness ->
            "Калыңы"

        GridOpacity ->
            "Шынарлыг"

        OriginalImage ->
            "Эгелээр фото"

        GriddedImage ->
            "Чарыкчыларлыг фото"

        DownloadGriddedImage ->
            "Чарыкчыларлыг фотону хүлээ!!!"

        Nice ->
            "Чүрек! "

        NiceCounter ->
            "Чүрек санаашкын: "

        NoImageYet ->
            "Хүнүн эгелээр фото чок! Эгелээр фото хүнүп киир, шинчилээр!"

        LanguageLabel ->
            "Дыл:"

        FileOperations ->
            "Шинчилээр"

        GridParameters ->
            "Чарыкчыларны өөрчүлээр, фотоңарга дүгжүп турар"

        Actions ->
            "🐸 🐸 🐸"

        AppSubtitle ->
            "Сайын! Сен өөрүнүң фотоңарга чарыкчыларлыг тургузарынга дуза көргүзер."

        GridPreviewPlaceholder ->
            "Чарыкчыларлыг фотоңар эрге көстүр"

        UploadPlaceholder ->
            "Эгелээр фото хүнү"

        StatusReady ->
            "Тургустуң: дээди"

        ShowDiagonals ->
            "Диагоналдыг чарыкчыларны көргүзү"

        Download ->
            "Хүлээ"

        Share ->
            "Хөйүлдү"

        UploadNew ->
            "Чаңгыс фото хүнү"

        UploadPrompt ->
            "Фото хүнү"

        UploadDescription ->
            "Файлны сонуургаар, эскели эрге халдыр"

        ChooseFile ->
            "Файлны сонуургаар"

        GridSettings ->
            "Чарыкчыларның тургузуу"

        DiagonalGrid ->
            "Диагоналдыг чарыкчылар"

        WhatsThisAbout ->
            "Бо чүү дугайында?"

        WhatsThisDescription ->
            "Gridit Baby! силерниң чуруктарыңарга эки шыйыглар кылырынга дузалаар!"

        PerfectForArtists ->
            "Чурукчуларга болгаш фото тырттырыкчыларга дыка эки!"

        MaxFileSize ->
            "Эң хөйү 5MB"

        SupportedFormats ->
            "JPG, PNG, GIF"

        GriditScores ->
            "Gridit Санаашкыннары"

        YourScore ->
            "Санаашкын:"

        ThatsNiceGridit ->
            "Эки! Gridit!"

        MadeInArgentina ->
            "Аргентинага кылган"

        WhatsGridit ->
            "Gridit деп чүү?"

        FooterTooltip ->
            "Экии! Мен код бижиир база чуруур ынак программист мен. Gridit меңээ шыйыглар ажыглап скетчтерни холстче көжүрерге дузалаар!"


translate : Language -> TranslationKey -> String
translate language key =
    translations language key
