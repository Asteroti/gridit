module I18n exposing (Language(..), TranslationKey(..), translate)


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


type TranslationKey
    = GridSize
    | GridColor
    | GridThickness
    | GridOpacity
    | DownloadGriddedImage
    | Nice
    | NoImageYet
    | LanguageLabel
    | AppSubtitle
    | UploadPlaceholder
    | ChooseFile
    | GridSettings
    | DownloadStep
    | WhatsThisDescription
    | MaxFileSize
    | SupportedFormats
    | MadeInArgentina
    | WhatsGridit
    | FooterTooltip
    | ImagePrivacy
    | Downloaded
    | ToggleGridView
    | ShowGrid
    | HideGrid
    | AddDiagonalLines
    | CuriousAboutGrids
    | ChangeImage
    | AdaptiveGridDensity
    | AnalyzingImage
    | OffLabel
    | FileTooLarge
    | CommunityImagesGridded
    | CommunityCountriesWith
    | CommunityHearts
    | CommunityHeartsFrom
    | CommunityGriddersFrom
    | CommunitySpotlight
    | CommunitySentMost
    | CommunityWhatsThis
    | CommunityDisclaimerBody
    | RateLimitMessage
    | HeartLikedIt
    | HeartThanks


translate : Language -> TranslationKey -> String
translate language key =
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


englishTranslations : TranslationKey -> String
englishTranslations key =
    case key of

        GridSize ->
            "Size"

        GridColor ->
            "Color"

        GridThickness ->
            "Thickness"

        GridOpacity ->
            "Opacity"

        DownloadGriddedImage ->
            "Download!"

        Nice ->
            "Nice! "

        NoImageYet ->
            "No image yet! Click Upload Image to begin!"

        LanguageLabel ->
            "Language:"

        AppSubtitle ->
            "Hi. This helps you create a rectilinear grid over an image of your choice"

        UploadPlaceholder ->
            "Upload an image to begin"

        ChooseFile ->
            "Choose File"

        GridSettings ->
            "Grid Settings"

        DownloadStep ->
            "Download"

        WhatsThisDescription ->
            "Gridit, baby! Upload any image, overlay a grid, and use it to scale your drawing onto canvas. Artists have used this technique for centuries \u{2014} from Renaissance masters to modern illustrators \u{2014} to transfer and enlarge compositions with precision."

        MaxFileSize ->
            "Max 15MB"

        SupportedFormats ->
            "JPG, PNG, GIF supported"

        MadeInArgentina ->
            "Made in Argentina with"

        WhatsGridit ->
            "What's Gridit?"

        FooterTooltip ->
            "Hi! I'm a developer who loves to code and paint. Gridit helps me transfer sketches to canvas using grids. Hope it helps you too!"

        ImagePrivacy ->
            "Your image never leaves your device"

        Downloaded ->
            "Downloaded!"

        ToggleGridView ->
            "Toggle Grid"

        ShowGrid ->
            "Show Grid"

        HideGrid ->
            "Hide Grid"

        AddDiagonalLines ->
            "Add diagonal lines to grid"

        CuriousAboutGrids ->
            "Curious? Read more about this centuries-old method on Wikipedia:"

        ChangeImage ->
            "Choose another image"

        AdaptiveGridDensity ->
            "Adaptive density"

        AnalyzingImage ->
            "Analyzing..."

        OffLabel ->
            "Off"

        FileTooLarge ->
            "Image too large. Please use an image under 15MB."

        CommunityImagesGridded ->
            "images gridded across"

        CommunityCountriesWith ->
            "countries, with"

        CommunityHearts ->
            "hearts"

        CommunityGriddersFrom ->
            "People griddin' it around the globe:"

        CommunityHeartsFrom ->
            "Hearts from around the world:"

        CommunitySpotlight ->
            "This week's spotlight:"

        CommunitySentMost ->
            "sent the most"

        CommunityWhatsThis ->
            "what's this counter?"

        CommunityDisclaimerBody ->
            "when you download or heart, i log \"someone in [country] did the thing\". i dont use it for anything, just to show counters. when i was little, websites had visitor counters per country that made me feel i was not alone in the world. its my turn to pull my weight! — t"

        RateLimitMessage ->
            "whoa easy there cowboy — let the hearts catch their breath"

        HeartLikedIt ->
            "liked it?"

        HeartThanks ->
            "thankyouthankyouthankyou!!!!!!"


spanishTranslations : TranslationKey -> String
spanishTranslations key =
    case key of

        GridSize ->
            "Tama\u{00F1}o"

        GridColor ->
            "Color"

        GridThickness ->
            "Grosor"

        GridOpacity ->
            "Opacidad"

        DownloadGriddedImage ->
            "Descargar!"

        Nice ->
            "Buen\u{00ED}simo! "

        NoImageYet ->
            "Hace click en Subir Imagen para empezar!"

        LanguageLabel ->
            "Idioma:"

        AppSubtitle ->
            "Buenas. Agregale una grilla rectilinear a una imagen que elijas"

        UploadPlaceholder ->
            "Sub\u{00ED} una imagen para empezar"

        ChooseFile ->
            "Elegir imagen"

        GridSettings ->
            "Ajustes de Cuadr\u{00ED}cula"

        DownloadStep ->
            "Descarga"

        WhatsThisDescription ->
            "Gridit, baby! Sub\u{00ED} cualquier imagen, superpon\u{00E9} una grilla rectilinear y utilizala para escalar tu dibujo al medio que prefieras. Esta t\u{00E9}cnica es antiqu\u{00ED}sima y se mantiene fuerte como uno de los m\u{00E9}todos m\u{00E1}s confiables para escalar y traspasar composiciones con precisi\u{00F3}n."

        MaxFileSize ->
            "Max 15MB"

        SupportedFormats ->
            "JPG, PNG, GIF soportados"

        MadeInArgentina ->
            "Hecho en Argentina con"

        WhatsGridit ->
            "Qu\u{00E9} es Gridit?"

        FooterTooltip ->
            "Hola! Soy una desarrolladora que ama programar y pintar. Gridit me ayuda a transferir bocetos al lienzo usando grillas. Espero que te sirva!"

        ImagePrivacy ->
            "Tu imagen nunca sale de tu dispositivo"

        Downloaded ->
            "Descargado!"

        ToggleGridView ->
            "Alternar Grilla"

        ShowGrid ->
            "Mostrar Grilla"

        HideGrid ->
            "Ocultar Grilla"

        AddDiagonalLines ->
            "Agregar l\u{00ED}neas diagonales a la grilla"

        CuriousAboutGrids ->
            "Si quer\u{00E9}s saber m\u{00E1}s, ac\u{00E1} te dejo unos links sobre este m\u{00E9}todo centenario:"

        ChangeImage ->
            "Elegir otra imagen"

        AdaptiveGridDensity ->
            "Densidad adaptativa"

        AnalyzingImage ->
            "Analizando..."

        OffLabel ->
            "Apagado"

        FileTooLarge ->
            "Imagen demasiado grande. Usa una imagen menor a 15MB."

        CommunityImagesGridded ->
            "imágenes con grilla en"

        CommunityCountriesWith ->
            "países, con"

        CommunityHearts ->
            "corazones"

        CommunityGriddersFrom ->
            "Gente haciendo grillas alrededor del mundo:"

        CommunityHeartsFrom ->
            "Corazones desde todo el mundo:"

        CommunitySpotlight ->
            "Spotlight de la semana:"

        CommunitySentMost ->
            "mandó más"

        CommunityWhatsThis ->
            "¿qué es este contador?"

        CommunityDisclaimerBody ->
            "Cuando descargás o clickeás el corazón, registro \"alguien en [país] hizo la cosa\". no lo uso para nada, solo para mostrar estos contadores. Cuando era chica, las webs tenían contadores de visitas por país que me hacían sentir que no estaba sola en el mundo. Ahora me toca a mí! - t"

        RateLimitMessage ->
            "tranqui pibe — dejá que los corazones tomen aire"

        HeartLikedIt ->
            "te gustó?"

        HeartThanks ->
            "graciasgraciasgracias!!!!!!"


latinTranslations : TranslationKey -> String
latinTranslations key =
    case key of

        GridSize ->
            "Magnitudinem"

        GridColor ->
            "Color"

        GridThickness ->
            "Crassitudo"

        GridOpacity ->
            "Opacitas"

        DownloadGriddedImage ->
            "Imago cum Craticula Discaricare!"

        Nice ->
            "Bellus! "

        NoImageYet ->
            "Nondum imago! Imago Submittere preme ut incipias!"

        LanguageLabel ->
            "Lingua:"

        AppSubtitle ->
            "Salve. Hoc te adiuvat creare reticulum rectilineare super imaginem tuam electam"

        UploadPlaceholder ->
            "Submitte imaginem ut incipias"

        ChooseFile ->
            "Eligere Fasciculum"

        GridSettings ->
            "Configuratio Reticulationis"

        DownloadStep ->
            "Discaricare"

        WhatsThisDescription ->
            "Gridit, infans! Quamlibet imaginem submitte, reticulum superpone, et eo utere ut picturam tuam in tabulam transferas. Artifices hanc artem per saecula adhibuerunt \u{2014} a magistris Renascentiae ad illustratores modernos \u{2014} ut compositiones cum praecisione transferant et amplificent."

        MaxFileSize ->
            "Max 15MB"

        SupportedFormats ->
            "JPG, PNG, GIF sustinetur"

        MadeInArgentina ->
            "Factum in Argentina cum"

        WhatsGridit ->
            "Quid est Gridit?"

        FooterTooltip ->
            "Salve! Sum programmator qui amat codicem scribere et pingere. Gridit me adiuvat picturas ad telam transferre utens cratibulis. Spero tibi quoque prodesse!"

        ImagePrivacy ->
            "Imago tua numquam discedit de instrumento tuo"

        Downloaded ->
            "Discariatum!"

        ToggleGridView ->
            "Commutare Reticulationem"

        ShowGrid ->
            "Ostende Reticulationem"

        HideGrid ->
            "Cela Reticulationem"

        AddDiagonalLines ->
            "Adde lineas diagonales reticulationi"

        CuriousAboutGrids ->
            "Curiose? Lege plura de hac arte saeculari in Vicipaedia:"

        ChangeImage ->
            "Aliam imaginem eligere"

        AdaptiveGridDensity ->
            "Densitas adaptiva"

        AnalyzingImage ->
            "Analysi..."

        OffLabel ->
            "Inactivum"

        FileTooLarge ->
            "Imago nimium magna est. Utere imagine minore quam 15MB."

        CommunityImagesGridded ->
            "imagines cum craticula in"

        CommunityCountriesWith ->
            "civitatibus, cum"

        CommunityHearts ->
            "cordibus"

        CommunityGriddersFrom ->
            "Homines craticulantes per orbem:"

        CommunityHeartsFrom ->
            "Corda ex toto orbe:"

        CommunitySpotlight ->
            "Lumen huius hebdomadae:"

        CommunitySentMost ->
            "misit plurima"

        CommunityWhatsThis ->
            "quid est hic numerator?"

        CommunityDisclaimerBody ->
            "cum discaricas vel cor das, scribo \"aliquis in [civitate] hoc fecit\". nullo modo eo utor, solum ut numeratores ostendam. cum parva eram, telae habebant numeratores visitatorum per civitates qui me sentire faciebant me non solam in mundo esse. nunc mei est vicem reddere! — t"

        RateLimitMessage ->
            "lente lente, eques — sine corda spirare"

        HeartLikedIt ->
            "placuit?"

        HeartThanks ->
            "gratiasgratiasgratias!!!!!!"


italianTranslations : TranslationKey -> String
italianTranslations key =
    case key of

        GridSize ->
            "Dimensione"

        GridColor ->
            "Colore"

        GridThickness ->
            "Spessore"

        GridOpacity ->
            "Opacita"

        DownloadGriddedImage ->
            "Scarica la tua Immagine con Griglia!"

        Nice ->
            "Bello! "

        NoImageYet ->
            "Nessuna immagine ancora! Clicca su Carica Immagine per iniziare!"

        LanguageLabel ->
            "Lingua:"

        AppSubtitle ->
            "Ciao. Questo ti aiuta a creare una griglia rettilinea su un'immagine di tua scelta"

        UploadPlaceholder ->
            "Carica un'immagine per iniziare"

        ChooseFile ->
            "Scegli File"

        GridSettings ->
            "Impostazioni Griglia"

        DownloadStep ->
            "Scarica"

        WhatsThisDescription ->
            "Gridit, baby! Carica qualsiasi immagine, sovrapponi una griglia e usala per scalare il tuo disegno sulla tela. Gli artisti hanno usato questa tecnica per secoli \u{2014} dai maestri del Rinascimento agli illustratori moderni \u{2014} per trasferire e ingrandire composizioni con precisione."

        MaxFileSize ->
            "Max 15MB"

        SupportedFormats ->
            "JPG, PNG, GIF supportati"

        MadeInArgentina ->
            "Fatto in Argentina con"

        WhatsGridit ->
            "Cos'e Gridit?"

        FooterTooltip ->
            "Ciao! Sono una sviluppatrice che ama programmare e dipingere. Gridit mi aiuta a trasferire schizzi sulla tela usando griglie. Spero sia utile anche a te!"

        ImagePrivacy ->
            "La tua immagine non lascia mai il tuo dispositivo"

        Downloaded ->
            "Scaricato!"

        ToggleGridView ->
            "Mostra/Nascondi Griglia"

        ShowGrid ->
            "Mostra Griglia"

        HideGrid ->
            "Nascondi Griglia"

        AddDiagonalLines ->
            "Aggiungi linee diagonali alla griglia"

        CuriousAboutGrids ->
            "Curiosi? Scoprite di piu su questo metodo secolare su Wikipedia:"

        ChangeImage ->
            "Scegli un'altra immagine"

        AdaptiveGridDensity ->
            "Densit\u{00E0} adattiva"

        AnalyzingImage ->
            "Analisi..."

        OffLabel ->
            "Disattivo"

        FileTooLarge ->
            "Immagine troppo grande. Usa un'immagine sotto i 15MB."

        CommunityImagesGridded ->
            "immagini con griglia in"

        CommunityCountriesWith ->
            "paesi, con"

        CommunityHearts ->
            "cuori"

        CommunityGriddersFrom ->
            "Gente che fa griglie in giro per il mondo:"

        CommunityHeartsFrom ->
            "Cuori da tutto il mondo:"

        CommunitySpotlight ->
            "Spotlight della settimana:"

        CommunitySentMost ->
            "ha mandato di più"

        CommunityWhatsThis ->
            "cos'è questo contatore?"

        CommunityDisclaimerBody ->
            "quando scarichi o metti un cuore, registro \"qualcuno in [paese] ha fatto la cosa\". non lo uso per niente, solo per mostrare i contatori. quando ero piccola, i siti avevano contatori di visite per paese che mi facevano sentire che non ero sola al mondo. tocca a me restituire il favore! — t"

        RateLimitMessage ->
            "calma cowboy — fai respirare i cuori"

        HeartLikedIt ->
            "ti è piaciuto?"

        HeartThanks ->
            "graziegraziegrazie!!!!!!"


portugueseTranslations : TranslationKey -> String
portugueseTranslations key =
    case key of

        GridSize ->
            "Tamanho"

        GridColor ->
            "Cor"

        GridThickness ->
            "Espessura"

        GridOpacity ->
            "Opacidade"

        DownloadGriddedImage ->
            "Baixe sua Imagem com Grade!"

        Nice ->
            "Legal! "

        NoImageYet ->
            "Nenhuma imagem ainda! Clique em Carregar Imagem para comecar!"

        LanguageLabel ->
            "Idioma:"

        AppSubtitle ->
            "Ola. Isto ajuda-te a criar uma grelha retilinea sobre uma imagem a tua escolha"

        UploadPlaceholder ->
            "Carregue uma imagem para comecar"

        ChooseFile ->
            "Escolher Arquivo"

        GridSettings ->
            "Configuracoes de Grade"

        DownloadStep ->
            "Baixar"

        WhatsThisDescription ->
            "Gridit, baby! Carrega qualquer imagem, sobrepe uma grelha e usa-a para escalar o teu desenho para a tela. Os artistas usam esta tecnica ha seculos \u{2014} dos mestres do Renascimento aos ilustradores modernos \u{2014} para transferir e ampliar composicoes com precisao."

        MaxFileSize ->
            "Max 15MB"

        SupportedFormats ->
            "JPG, PNG, GIF suportados"

        MadeInArgentina ->
            "Feito na Argentina com"

        WhatsGridit ->
            "O que e Gridit?"

        FooterTooltip ->
            "Ola! Sou uma desenvolvedora que ama programar e pintar. Gridit me ajuda a transferir esbocos para a tela usando grades. Espero que te ajude tambem!"

        ImagePrivacy ->
            "A sua imagem nunca sai do seu dispositivo"

        Downloaded ->
            "Baixado!"

        ToggleGridView ->
            "Alternar Grade"

        ShowGrid ->
            "Mostrar Grade"

        HideGrid ->
            "Ocultar Grade"

        AddDiagonalLines ->
            "Adicionar linhas diagonais a grade"

        CuriousAboutGrids ->
            "Curioso? Le mais sobre este metodo centenario na Wikipedia:"

        ChangeImage ->
            "Escolher outra imagem"

        AdaptiveGridDensity ->
            "Densidade adaptativa"

        AnalyzingImage ->
            "Analisando..."

        OffLabel ->
            "Desligado"

        FileTooLarge ->
            "Imagem muito grande. Use uma imagem com menos de 15MB."

        CommunityImagesGridded ->
            "imagens com grelha em"

        CommunityCountriesWith ->
            "países, com"

        CommunityHearts ->
            "corações"

        CommunityGriddersFrom ->
            "Gente fazendo grelhas pelo mundo:"

        CommunityHeartsFrom ->
            "Corações de todo o mundo:"

        CommunitySpotlight ->
            "Destaque da semana:"

        CommunitySentMost ->
            "enviou mais"

        CommunityWhatsThis ->
            "o que é este contador?"

        CommunityDisclaimerBody ->
            "quando descarregas ou dás um coração, registo \"alguém em [país] fez a coisa\". não uso para nada, só para mostrar contadores. quando eu era pequena, os sites tinham contadores de visitas por país que me faziam sentir que não estava sozinha no mundo. é a minha vez de retribuir! — t"

        RateLimitMessage ->
            "calma parceiro — deixa os corações respirarem"

        HeartLikedIt ->
            "gostou?"

        HeartThanks ->
            "obrigadoobrigadoobrigado!!!!!!"


frenchTranslations : TranslationKey -> String
frenchTranslations key =
    case key of

        GridSize ->
            "Taille"

        GridColor ->
            "Couleur"

        GridThickness ->
            "Epaisseur"

        GridOpacity ->
            "Opacite"

        DownloadGriddedImage ->
            "Telechargez votre Image avec Grille!"

        Nice ->
            "Sympa! "

        NoImageYet ->
            "Pas encore d'image! Cliquez sur Telecharger une Image pour commencer!"

        LanguageLabel ->
            "Langue:"

        AppSubtitle ->
            "Bonjour. Ceci vous aide a creer une grille rectiligne sur une image de votre choix"

        UploadPlaceholder ->
            "Telechargez une image pour commencer"

        ChooseFile ->
            "Choisir Fichier"

        GridSettings ->
            "Parametres de Grille"

        DownloadStep ->
            "Telecharger"

        WhatsThisDescription ->
            "Gridit, baby! Telechargez n'importe quelle image, superposez une grille et utilisez-la pour mettre a l'echelle votre dessin sur toile. Les artistes utilisent cette technique depuis des siecles \u{2014} des maitres de la Renaissance aux illustrateurs modernes \u{2014} pour transferer et agrandir des compositions avec precision."

        MaxFileSize ->
            "Max 15Mo"

        SupportedFormats ->
            "JPG, PNG, GIF supportes"

        MadeInArgentina ->
            "Fait en Argentine avec"

        WhatsGridit ->
            "C'est quoi Gridit?"

        FooterTooltip ->
            "Salut! Je suis une developpeuse qui aime coder et peindre. Gridit m'aide a transferer des croquis sur toile en utilisant des grilles. J'espere que ca vous aide aussi!"

        ImagePrivacy ->
            "Votre image ne quitte jamais votre appareil"

        Downloaded ->
            "Telecharge!"

        ToggleGridView ->
            "Basculer la Grille"

        ShowGrid ->
            "Afficher la Grille"

        HideGrid ->
            "Masquer la Grille"

        AddDiagonalLines ->
            "Ajouter des lignes diagonales a la grille"

        CuriousAboutGrids ->
            "Curieux ? Decouvrez cette methode seculaire sur Wikipedia :"

        ChangeImage ->
            "Choisir une autre image"

        AdaptiveGridDensity ->
            "Densit\u{00E9} adaptative"

        AnalyzingImage ->
            "Analyse..."

        OffLabel ->
            "Désactivé"

        FileTooLarge ->
            "Image trop grande. Utilisez une image de moins de 15 Mo."

        CommunityImagesGridded ->
            "images avec grille dans"

        CommunityCountriesWith ->
            "pays, avec"

        CommunityHearts ->
            "cœurs"

        CommunityGriddersFrom ->
            "Des gens qui font des grilles autour du globe :"

        CommunityHeartsFrom ->
            "Cœurs du monde entier :"

        CommunitySpotlight ->
            "Pleins feux cette semaine :"

        CommunitySentMost ->
            "en a envoyé le plus"

        CommunityWhatsThis ->
            "c'est quoi ce compteur ?"

        CommunityDisclaimerBody ->
            "quand tu télécharges ou tu mets un cœur, je note \"quelqu'un en [pays] a fait le truc\". je m'en sers pour rien, juste pour montrer les compteurs. quand j'étais petite, les sites avaient des compteurs de visites par pays qui me faisaient sentir que je n'étais pas seule au monde. à mon tour de rendre la pareille ! — t"

        RateLimitMessage ->
            "doucement cowboy — laisse les cœurs souffler"

        HeartLikedIt ->
            "ça t'a plu ?"

        HeartThanks ->
            "mercimercimerci!!!!!!"


asturianoTranslations : TranslationKey -> String
asturianoTranslations key =
    case key of

        GridSize ->
            "Tamanu"

        GridColor ->
            "Color"

        GridThickness ->
            "Grosor"

        GridOpacity ->
            "Opacida"

        DownloadGriddedImage ->
            "Descarga la to Imaxe con Cuadricula!"

        Nice ->
            "Guapu! "

        NoImageYet ->
            "Enta nun hai imaxe! Fai clic en Xubir Imaxe pa entamar!"

        LanguageLabel ->
            "Llingua:"

        AppSubtitle ->
            "Hola. Esto ayudate a crear una cuadricula retilinia sobro una imaxen de la to eleicion"

        UploadPlaceholder ->
            "Xube una imaxe pa entamar"

        ChooseFile ->
            "Escueyi Ficheru"

        GridSettings ->
            "Axustes de Cuadricula"

        DownloadStep ->
            "Descarga"

        WhatsThisDescription ->
            "Gridit, baby! Xube cualquier imaxe, superpone una cuadricula y usala pa escalar el to dibuxu al llenzu. Los artistes usaron esta tecnica durante sieglos \u{2014} dende los maestros del Renacimientu hasta los ilustradores modernos \u{2014} pa transferir y ampliar composiciones con precision."

        MaxFileSize ->
            "Max 15MB"

        SupportedFormats ->
            "JPG, PNG, GIF soportaos"

        MadeInArgentina ->
            "Fechu n'Arxentina con"

        WhatsGridit ->
            "Que ye Gridit?"

        FooterTooltip ->
            "Hola! Soi una desarrolladora que-y presta programar y pintar. Gridit ayudame a tresferir bocetos al llienzu usando cuadricules. Espero que te sirva tambien!"

        ImagePrivacy ->
            "La to imaxe nunca sal del to dispositivu"

        Downloaded ->
            "Descargau!"

        ToggleGridView ->
            "Alternar Cuadricula"

        ShowGrid ->
            "Amosar Cuadricula"

        HideGrid ->
            "Anubrir Cuadricula"

        AddDiagonalLines ->
            "Amestar llinies diagonales a la cuadricula"

        CuriousAboutGrids ->
            "Curiosu? Llee mas sobre esti metodu centenariu na Wikipedia:"

        ChangeImage ->
            "Escueyi otra imaxe"

        AdaptiveGridDensity ->
            "Densid\u{00E1} adaptativa"

        AnalyzingImage ->
            "Analizando..."

        OffLabel ->
            "Apagáu"

        FileTooLarge ->
            "Imaxe enforma grande. Usa una imaxe menor de 15MB."

        CommunityImagesGridded ->
            "imáxenes con cuadrícula en"

        CommunityCountriesWith ->
            "países, con"

        CommunityHearts ->
            "corazones"

        CommunityGriddersFrom ->
            "Xente faciendo grilles alredor del mundu:"

        CommunityHeartsFrom ->
            "Corazones de tol mundu:"

        CommunitySpotlight ->
            "Espoxigada esta selmana:"

        CommunitySentMost ->
            "mandó los más"

        CommunityWhatsThis ->
            "¿qué ye esti contador?"

        CommunityDisclaimerBody ->
            "cuando descargues o-y pongas un corazón, rexistro \"daquien en [país] fizo la cosa\". nun lu uso pa nada, namai pa amosar contadores. cuando yera neña, les webs tenían contadores de visites per país que me facían sentir que nun taba sola nel mundu. tocame a mi tornalo! — t"

        RateLimitMessage ->
            "tranqui vaqueru — dexa que los corazones respiren"

        HeartLikedIt ->
            "gustóute?"

        HeartThanks ->
            "graciesgraciesgracies!!!!!!"


gaelicTranslations : TranslationKey -> String
gaelicTranslations key =
    case key of

        GridSize ->
            "Meud"

        GridColor ->
            "Dath"

        GridThickness ->
            "Tiughad"

        GridOpacity ->
            "Dorchadas"

        DownloadGriddedImage ->
            "Luchdaich sios do Dhealbh le Griod!"

        Nice ->
            "Sgoinneil! "

        NoImageYet ->
            "Chan eil dealbh ann fhathast! Cliog air Luchdaich Dealbh gus toiseachadh!"

        LanguageLabel ->
            "Canan:"

        AppSubtitle ->
            "Halo. Bidh seo a' cuideachadh thu le bhith a' cruthachadh griod direach air iomhaigh de do roghainn"

        UploadPlaceholder ->
            "Luchdaich dealbh gus toiseachadh"

        ChooseFile ->
            "Tagh Faidhle"

        GridSettings ->
            "Suidheachaidhean Griod"

        DownloadStep ->
            "Luchdaich sios"

        WhatsThisDescription ->
            "Gridit, baby! Luchdaich dealbh sam bith, cuir griod air a mhuin agus cleachd e gus do dhealbh a sgaladh air canabhas. Tha luchd-ealain air an doigh seo a chleachdadh fad linntean \u{2014} bho mhaighstirean an Ath-bheothachaidh gu dealbhadairean an latha an-diugh \u{2014} gus co-dhealbhaidhean a ghluasad agus a mheudachadh le cinnt."

        MaxFileSize ->
            "Max 15MB"

        SupportedFormats ->
            "JPG, PNG, GIF le taic"

        MadeInArgentina ->
            "Air a dheanamh ann an Argentina le"

        WhatsGridit ->
            "De th' ann an Gridit?"

        FooterTooltip ->
            "Halo! Is mise leasaichear a tha gaolach air codadh agus peantadh. Tha Gridit gam chuideachadh gus sgeidseachan a ghluasad gu canabhas le griodaichean. Tha mi an dochas gun cuidich e thu cuideachd!"

        ImagePrivacy ->
            "Chan fhag an dealbh agad an t-inneal agad gu brath"

        Downloaded ->
            "Air a luchdachadh sios!"

        ToggleGridView ->
            "Tionndaidh Griod"

        ShowGrid ->
            "Seall Griod"

        HideGrid ->
            "Falaich Griod"

        AddDiagonalLines ->
            "Cuir loidhnichean trasna ris a' ghriod"

        CuriousAboutGrids ->
            "An e rud ur a tha seo? Leugh barrachd mu dheidhinn an doigh linntean a dh'aois seo air Wikipedia:"

        ChangeImage ->
            "Tagh dealbh eile"

        AdaptiveGridDensity ->
            -- English fallback (no native Gaelic translation).
            "Adaptive density"

        AnalyzingImage ->
            -- English fallback (no native Gaelic translation).
            "Analyzing..."

        OffLabel ->
            "Dheth"

        FileTooLarge ->
            "Tha an dealbh ro mhòr. Cleachd dealbh nas lugha na 15MB."

        CommunityImagesGridded ->
            "dè ideàlan air an cliath, ann an"

        CommunityCountriesWith ->
            "dùthchannan, le"

        CommunityHearts ->
            "cridheachan"

        CommunityGriddersFrom ->
            "Daoine a' dèanamh chliathagan air feadh an t-saoghail:"

        CommunityHeartsFrom ->
            "Cridheachan bhon t-saoghal:"

        CommunitySpotlight ->
            "Solas na seachdain seo:"

        CommunitySentMost ->
            "chuir am pàirt as motha"

        CommunityWhatsThis ->
            "dè an cunntair seo?"

        CommunityDisclaimerBody ->
            "nuair a luchdaicheas tu sios no a chuireas tu cridhe, sgriobhainn \"chuir cuideigin ann an [duthaich] an rud\". cha bhi mi 'ga chleachdadh airson rud sam bith, dim ach airson na cunntairean a shealltainn. nuair a bha mi beag, bha cunntairean luchd-tadhail aig laraichean-lin gach duthaich a thug orm faireachdainn nach robh mi nam aonar san t-saoghal. tha e ann an cuid mo cheart dhomh-sa! — t"

        RateLimitMessage ->
            "gabh socair a charaid — leig leis na cridheachan anail a tharraing"

        HeartLikedIt ->
            "an do chòrd e?"

        HeartThanks ->
            "tapaleatapaleatapalea!!!!!!"


euskaraTranslations : TranslationKey -> String
euskaraTranslations key =
    case key of

        GridSize ->
            "Tamaina"

        GridColor ->
            "Kolorea"

        GridThickness ->
            "Lodiera"

        GridOpacity ->
            "Opakutasuna"

        DownloadGriddedImage ->
            "Zure Saretadun Irudia Deskargatu!"

        Nice ->
            "Bikain! "

        NoImageYet ->
            "Oraindik ez dago irudirik! Egin klik Irudia Igo botoian hasteko!"

        LanguageLabel ->
            "Hizkuntza:"

        AppSubtitle ->
            "Kaixo. Honek hautatutako irudi baten gainean sareta zuzen bat sortzen laguntzen dizu"

        UploadPlaceholder ->
            "Igo irudi bat hasteko"

        ChooseFile ->
            "Fitxategia Aukeratu"

        GridSettings ->
            "Sareta Ezarpenak"

        DownloadStep ->
            "Deskargatu"

        WhatsThisDescription ->
            "Gridit, baby! Igo edozein irudi, gainjarri sareta bat eta erabili zure marrazkia mihisera eskalatzeko. Artistek teknika hau mendeetan zehar erabili dute \u{2014} Pizkundeko maisuengandik egungo ilustratzaileetara \u{2014} konposizioak zehaztasunez transferitzeko eta handitzeko."

        MaxFileSize ->
            "Gehienez 15MB"

        SupportedFormats ->
            "JPG, PNG, GIF onartuta"

        MadeInArgentina ->
            "Argentinan egina honekin"

        WhatsGridit ->
            "Zer da Gridit?"

        FooterTooltip ->
            "Kaixo! Programatzea eta margotzea maite duen garatzailea naiz. Gridit-ek zirriborroak oihalera transferitzen laguntzen dit saretak erabiliz. Espero dut zuri ere laguntzea!"

        ImagePrivacy ->
            "Zure irudia ez da inoiz zure gailutik ateratzen"

        Downloaded ->
            "Deskargatuta!"

        ToggleGridView ->
            "Sareta Txandakatu"

        ShowGrid ->
            "Sareta Erakutsi"

        HideGrid ->
            "Sareta Ezkutatu"

        AddDiagonalLines ->
            "Lerro diagonalak gehitu saretari"

        CuriousAboutGrids ->
            "Jakin-mina? Irakurri gehiago metodo mendetako honi buruz Wikipedian:"

        ChangeImage ->
            "Beste irudi bat aukeratu"

        AdaptiveGridDensity ->
            "Dentsitate moldagarria"

        AnalyzingImage ->
            "Aztertzen..."

        OffLabel ->
            "Itzalita"

        FileTooLarge ->
            "Irudia handiegia da. Erabili 15MB baino txikiagoa den irudia."

        CommunityImagesGridded ->
            "irudi sareta-rekin"

        CommunityCountriesWith ->
            "herrialdetan, eta"

        CommunityHearts ->
            "bihotz"

        CommunityGriddersFrom ->
            "Munduan zehar saretak egiten dabilen jendea:"

        CommunityHeartsFrom ->
            "Bihotzak mundu osotik:"

        CommunitySpotlight ->
            "Asteko izarra:"

        CommunitySentMost ->
            "gehien bidali ditu"

        CommunityWhatsThis ->
            "zer da kontagailu hau?"

        CommunityDisclaimerBody ->
            "deskargatzen edo bihotza jartzen duzunean, \"norbaitek [herrialdean] hori egin zuen\" idazten dut. ez dut ezertarako erabiltzen, kontagailuak erakusteko bakarrik. txikia nintzenean, webguneek herrialdeko bisita-kontagailuak zituzten, eta horrek munduan bakarrik ez nengoela sentiarazi zidaten. niri tokatzen zait orain itzultzea! — t"

        RateLimitMessage ->
            "lasai cowboy — utzi bihotzei arnasa hartzen"

        HeartLikedIt ->
            "gustatu zaizu?"

        HeartThanks ->
            "eskerrikaeskerrikaeskerrika!!!!!!"


japaneseTranslations : TranslationKey -> String
japaneseTranslations key =
    case key of

        GridSize ->
            "サイズ"

        GridColor ->
            "色"

        GridThickness ->
            "太さ"

        GridOpacity ->
            "不透明度"

        DownloadGriddedImage ->
            "グリッド付き画像をダウンロード!"

        Nice ->
            "いいね! "

        NoImageYet ->
            "まだ画像がありません!画像をアップロードをクリックして始めましょう!"

        LanguageLabel ->
            "言語:"

        AppSubtitle ->
            "こんにちは。これはあなたが選んだ画像上に直線グリッドを作成するのに役立ちます"

        UploadPlaceholder ->
            "画像をアップロードして始めましょう"

        ChooseFile ->
            "ファイル選択"

        GridSettings ->
            "グリッド設定"

        DownloadStep ->
            "ダウンロード"

        WhatsThisDescription ->
            "Gridit, baby! 画像をアップロードし、グリッドを重ねて、キャンバスへの拡大に活用しましょう。ルネサンスの巨匠から現代のイラストレーターまで、何世紀にもわたってアーティストたちが使ってきた技法です。"

        MaxFileSize ->
            "最大15MB"

        SupportedFormats ->
            "JPG、PNG、GIF対応"

        MadeInArgentina ->
            "アルゼンチン製"

        WhatsGridit ->
            "Griditとは?"

        FooterTooltip ->
            "こんにちは!プログラミングと絵を描くことが大好きな開発者です。Griditはグリッドを使ってスケッチをキャンバスに転写するのに役立ちます。あなたにも役立つことを願っています!"

        ImagePrivacy ->
            "画像はデバイスから離れません"

        Downloaded ->
            "ダウンロード完了!"

        ToggleGridView ->
            "グリッド切替"

        ShowGrid ->
            "グリッド表示"

        HideGrid ->
            "グリッド非表示"

        AddDiagonalLines ->
            "グリッドに対角線を追加"

        CuriousAboutGrids ->
            "\u{3082}\u{3063}\u{3068}\u{77E5}\u{308A}\u{305F}\u{3044}\u{FF1F}\u{3053}\u{306E}\u{4F55}\u{4E16}\u{7D00}\u{3082}\u{306E}\u{6B74}\u{53F2}\u{3042}\u{308B}\u{624B}\u{6CD5}\u{306B}\u{3064}\u{3044}\u{3066}Wikipedia\u{3067}\u{8AAD}\u{3080}\u{FF1A}"

        ChangeImage ->
            "\u{5225}\u{306E}\u{753B}\u{50CF}\u{3092}\u{9078}\u{629E}"

        AdaptiveGridDensity ->
            "\u{9069}\u{5FDC}\u{5BC6}\u{5EA6}"

        AnalyzingImage ->
            "\u{5206}\u{6790}\u{4E2D}..."

        OffLabel ->
            "\u{30AA}\u{30D5}"

        FileTooLarge ->
            "\u{753B}\u{50CF}\u{304C}\u{5927}\u{304D}\u{3059}\u{304E}\u{307E}\u{3059}\u{3002}15MB\u{4EE5}\u{4E0B}\u{306E}\u{753B}\u{50CF}\u{3092}\u{4F7F}\u{7528}\u{3057}\u{3066}\u{304F}\u{3060}\u{3055}\u{3044}\u{3002}"

        CommunityImagesGridded ->
            "枚の画像が"

        CommunityCountriesWith ->
            "ヶ国でグリッドされ、"

        CommunityHearts ->
            "個のハート"

        CommunityGriddersFrom ->
            "世界中でグリッドしてる人たち："

        CommunityHeartsFrom ->
            "世界中からのハート："

        CommunitySpotlight ->
            "今週のスポットライト："

        CommunitySentMost ->
            "が一番送った"

        CommunityWhatsThis ->
            "このカウンターは何？"

        CommunityDisclaimerBody ->
            "ダウンロードしたりハートを押したりすると、「[国名]の誰かがそれをした」と記録します。何にも使いません、カウンターを見せるだけです。小さい頃、ウェブサイトにあった国別訪問者カウンターを見て、世界でひとりじゃないと感じていました。今度は私がその番です！ — t"

        RateLimitMessage ->
            "おっとカウボーイ、落ち着いて — ハートを休ませてあげて"

        HeartLikedIt ->
            "気に入った？"

        HeartThanks ->
            "ありがとありがとありがと！！！！！！"


russianTranslations : TranslationKey -> String
russianTranslations key =
    case key of

        GridSize ->
            "Размер"

        GridColor ->
            "Цвет"

        GridThickness ->
            "Толщина"

        GridOpacity ->
            "Прозрачность"

        DownloadGriddedImage ->
            "Скачать изображение с сеткой!"

        Nice ->
            "Отлично! "

        NoImageYet ->
            "Изображения пока нет! Нажмите Загрузить изображение, чтобы начать!"

        LanguageLabel ->
            "Язык:"

        AppSubtitle ->
            "Здравствуйте. Это поможет вам создать прямоугольную сетку поверх выбранного вами изображения"

        UploadPlaceholder ->
            "Загрузите изображение, чтобы начать"

        ChooseFile ->
            "Выбрать Файл"

        GridSettings ->
            "Настройки Сетки"

        DownloadStep ->
            "Скачать"

        WhatsThisDescription ->
            "Gridit, baby! Загрузите любое изображение, наложите сетку и используйте её для масштабирования рисунка на холст. Художники используют эту технику веками \u{2014} от мастеров Ренессанса до современных иллюстраторов \u{2014} для точного переноса и увеличения композиций."

        MaxFileSize ->
            "Макс 15МБ"

        SupportedFormats ->
            "JPG, PNG, GIF поддерживаются"

        MadeInArgentina ->
            "Сделано в Аргентине с"

        WhatsGridit ->
            "Что такое Gridit?"

        FooterTooltip ->
            "Привет! Я разработчик, который любит программировать и рисовать. Gridit помогает мне переносить эскизы на холст с помощью сеток. Надеюсь, вам тоже пригодится!"

        ImagePrivacy ->
            "Ваше изображение никогда не покидает ваше устройство"

        Downloaded ->
            "Скачано!"

        ToggleGridView ->
            "Переключить сетку"

        ShowGrid ->
            "Показать сетку"

        HideGrid ->
            "Скрыть сетку"

        AddDiagonalLines ->
            "Добавить диагональные линии к сетке"

        CuriousAboutGrids ->
            "\u{041B}\u{044E}\u{0431}\u{043E}\u{043F}\u{044B}\u{0442}\u{043D}\u{043E}? \u{0427}\u{0438}\u{0442}\u{0430}\u{0439}\u{0442}\u{0435} \u{0431}\u{043E}\u{043B}\u{044C}\u{0448}\u{0435} \u{043E}\u{0431} \u{044D}\u{0442}\u{043E}\u{043C} \u{0432}\u{0435}\u{043A}\u{043E}\u{0432}\u{043E}\u{043C} \u{043C}\u{0435}\u{0442}\u{043E}\u{0434}\u{0435} \u{0432} \u{0412}\u{0438}\u{043A}\u{0438}\u{043F}\u{0435}\u{0434}\u{0438}\u{0438}:"

        ChangeImage ->
            "\u{0412}\u{044B}\u{0431}\u{0440}\u{0430}\u{0442}\u{044C} \u{0434}\u{0440}\u{0443}\u{0433}\u{043E}\u{0435} \u{0438}\u{0437}\u{043E}\u{0431}\u{0440}\u{0430}\u{0436}\u{0435}\u{043D}\u{0438}\u{0435}"

        AdaptiveGridDensity ->
            "\u{0410}\u{0434}\u{0430}\u{043F}\u{0442}\u{0438}\u{0432}\u{043D}\u{0430}\u{044F} \u{043F}\u{043B}\u{043E}\u{0442}\u{043D}\u{043E}\u{0441}\u{0442}\u{044C}"

        AnalyzingImage ->
            "\u{0410}\u{043D}\u{0430}\u{043B}\u{0438}\u{0437}..."

        OffLabel ->
            "\u{0412}\u{044B}\u{043A}\u{043B}."

        FileTooLarge ->
            "\u{0418}\u{0437}\u{043E}\u{0431}\u{0440}\u{0430}\u{0436}\u{0435}\u{043D}\u{0438}\u{0435} \u{0441}\u{043B}\u{0438}\u{0448}\u{043A}\u{043E}\u{043C} \u{0431}\u{043E}\u{043B}\u{044C}\u{0448}\u{043E}\u{0435}. \u{0418}\u{0441}\u{043F}\u{043E}\u{043B}\u{044C}\u{0437}\u{0443}\u{0439}\u{0442}\u{0435} \u{0438}\u{0437}\u{043E}\u{0431}\u{0440}\u{0430}\u{0436}\u{0435}\u{043D}\u{0438}\u{0435} \u{043C}\u{0435}\u{043D}\u{0435}\u{0435} 15\u{041C}\u{0411}."

        CommunityImagesGridded ->
            "изображений с сеткой в"

        CommunityCountriesWith ->
            "странах, с"

        CommunityHearts ->
            "сердечек"

        CommunityGriddersFrom ->
            "Люди, делающие сетки по всему миру:"

        CommunityHeartsFrom ->
            "Сердечки со всего мира:"

        CommunitySpotlight ->
            "Прожектор недели:"

        CommunitySentMost ->
            "прислало больше всего"

        CommunityWhatsThis ->
            "что это за счётчик?"

        CommunityDisclaimerBody ->
            "когда ты скачиваешь или ставишь сердечко, я записываю \"кто-то в [стране] сделал вещь\". я это ни для чего не использую, просто чтобы показать счётчики. когда я была маленькой, сайты имели счётчики посетителей по странам, и они давали мне ощущение, что я не одна в этом мире. теперь моя очередь внести свой вклад! — t"

        RateLimitMessage ->
            "эй ковбой, помедленнее — дай сердечкам отдышаться"

        HeartLikedIt ->
            "понравилось?"

        HeartThanks ->
            "спасибоспасибоспасибо!!!!!!"


tuvanTranslations : TranslationKey -> String
tuvanTranslations key =
    case key of

        GridSize ->
            "Хемчээл"

        GridColor ->
            "Он"

        GridThickness ->
            "Кылын"

        GridOpacity ->
            "Коскузу"

        DownloadGriddedImage ->
            "Шыйыглыг чурукту чудуруп алыр!"

        Nice ->
            "Эки! "

        NoImageYet ->
            "Чурук чок! Эгелээр дээш Чурукту киирер деп базынар!"

        LanguageLabel ->
            "Дыл:"

        AppSubtitle ->
            "Экии. Бо дээрге силерниин шилип алган чуруунарга дорт шыйыглар кылырынга дузалаар"

        UploadPlaceholder ->
            "Эгелээр дээш чурукту киирингер"

        ChooseFile ->
            "Файл Шилиир"

        GridSettings ->
            "Шыйыг Тургузуглары"

        DownloadStep ->
            "Чүдүрүп алыр"

        WhatsThisDescription ->
            "Gridit, baby! Кандыг-даа чурук киирип, шыйыгны углааш, холстуже чуруунарны улгаттырарынга ажыглаңар. Чурукчулар бо аргатты чүс-чүс чылдар дургузунда ажыглап келгеннер \u{2014} Ренессанстың улуг мастерлеринден амгы үениң иллюстраторларынга чедир."

        MaxFileSize ->
            "Эн хойу 15MB"

        SupportedFormats ->
            "JPG, PNG, GIF ажыглаттынар"

        MadeInArgentina ->
            "Аргентинага кылган"

        WhatsGridit ->
            "Gridit деп чуу?"

        FooterTooltip ->
            "Экии! Мен программировать база чуруур ынак программист мен. Gridit менээ шыйыглар ажыглап скетчтерни холстче кожуреерге дузалаар. Силерге база дузалаар деп идегеп тур мен!"

        ImagePrivacy ->
            "Силерниин чуруунар силерниин херекселинерден кажан-даа унмес"

        Downloaded ->
            "Чудурген!"

        ToggleGridView ->
            "Шыйыгны солуур"

        ShowGrid ->
            "Шыйыгны коргузер"

        HideGrid ->
            "Шыйыгны чажырар"

        AddDiagonalLines ->
            "Шыйыгга кыйгаар шыйыглар немээр"

        CuriousAboutGrids ->
            "\u{0421}\u{043E}\u{043D}\u{0443}\u{0443}\u{0440}\u{0433}\u{0430}\u{043B}\u{0434}\u{044B}\u{0433} \u{0431}\u{0435}? \u{0411}\u{043E} \u{044D}\u{0440}\u{0433}\u{0438} \u{0430}\u{0440}\u{0433}\u{0430} \u{0434}\u{0443}\u{0433}\u{0430}\u{0439}\u{044B}\u{043D}\u{0434}\u{0430} \u{0412}\u{0438}\u{043A}\u{0438}\u{043F}\u{0435}\u{0434}\u{0438}\u{044F}\u{0434}\u{0430} \u{043D}\u{043E}\u{043C}\u{0447}\u{0443}\u{04A3}\u{0430}\u{0440}:"

        ChangeImage ->
            "\u{04E8}\u{0441}\u{043A}\u{0435} \u{0447}\u{0443}\u{0440}\u{0443}\u{043A}\u{0442}\u{0443} \u{0448}\u{0438}\u{043B}\u{0438}\u{0438}\u{0440}"

        AdaptiveGridDensity ->
            -- English fallback (no native Tuvan translation).
            "Adaptive density"

        AnalyzingImage ->
            -- English fallback (no native Tuvan translation).
            "Analyzing..."

        OffLabel ->
            -- English fallback (no native Tuvan translation).
            "Off"

        FileTooLarge ->
            -- English fallback (no native Tuvan translation).
            "Image too large. Please use an image under 15MB."

        CommunityImagesGridded ->
            "көргүзAr дугайлалгалыг"

        CommunityCountriesWith ->
            "чурттарда,"

        CommunityHearts ->
            "чүрек"

        CommunityGriddersFrom ->
            -- English fallback (no native Tuvan translation).
            "People griddin' it around the globe:"

        CommunityHeartsFrom ->
            "Бо delgemnin чүректери:"

        CommunitySpotlight ->
            "Бо хөвсреҢ чарыгы:"

        CommunitySentMost ->
            "энө хөй чорутпан"

        CommunityWhatsThis ->
            "бо кандыы сан-чанаг чугаа?"

        CommunityDisclaimerBody ->
            -- English fallback (no native Tuvan translation).
            "when you download or heart, i log \"someone in [country] did the thing\". i dont use it for anything, just to show counters. when i was little, websites had visitor counters per country that made me feel i was not alone in the world. its my turn to pull my weight! — t"

        RateLimitMessage ->
            -- English fallback (no native Tuvan translation).
            "whoa easy there cowboy — let the hearts catch their breath"

        HeartLikedIt ->
            -- English fallback (no native Tuvan translation).
            "liked it?"

        HeartThanks ->
            -- English fallback (no native Tuvan translation).
            "thankyouthankyouthankyou!!!!!!"


amharicTranslations : TranslationKey -> String
amharicTranslations key =
    case key of

        GridSize ->
            "መጠን"

        GridColor ->
            "ቀለም"

        GridThickness ->
            "ውፍረት"

        GridOpacity ->
            "ግልጽነት"

        DownloadGriddedImage ->
            "የፍርግርግ ምስልዎን ያውርዱ!"

        Nice ->
            "ጥሩ! "

        NoImageYet ->
            "እስካሁን ምንም ምስል የለም! ለመጀመር ምስል ይጫኑ ጠቅ ያድርጉ!"

        LanguageLabel ->
            "ቋንቋ:"

        AppSubtitle ->
            "ሰላም። ይህ በእርስዎ ምርጫ ምስል ላይ አራት ማዕዘናዊ ፍርግርግ እንዲፈጥሩ ይረዳዎታል"

        UploadPlaceholder ->
            "ለመጀመር ምስል ይጫኑ"

        ChooseFile ->
            "ፋይል ይምረጡ"

        GridSettings ->
            "የፍርግርግ ቅንብሮች"

        DownloadStep ->
            "አውርድ"

        WhatsThisDescription ->
            "Gridit, baby! ማንኛውንም ምስል ይጫኑ፣ ፍርግርግ ያስቀምጡ እና ስዕልዎን ወደ ሸራ ለማስፋት ይጠቀሙበት። ከህዳሴው ጌቶች እስከ ዘመናዊ ሥዕላውያን ድረስ አርቲስቶች ይህን ዘዴ ለምዕተ ዓመታት ተጠቅመውበታል \u{2014} ቅንብሮችን በትክክል ለማስተላለፍ እና ለማስፋት።"

        MaxFileSize ->
            "ከፍተኛ 15MB"

        SupportedFormats ->
            "JPG፣ PNG፣ GIF ይደገፋል"

        MadeInArgentina ->
            "በአርጀንቲና ተሰርቷል በ"

        WhatsGridit ->
            "Gridit ምንድን ነው?"

        FooterTooltip ->
            "ሰላም! ኮድ መጻፍ እና መሳል የሚወድ ገንቢ ነኝ። Gridit ፍርግርጎችን በመጠቀም ስዕሎችን ወደ ሸራ ለማስተላለፍ ይረዳኛል። ለእርስዎም እንደሚረዳ ተስፋ አደርጋለሁ!"

        ImagePrivacy ->
            "ምስልዎ መሳሪያዎን ፈጽሞ አይለቅም"

        Downloaded ->
            "ወርዷል!"

        ToggleGridView ->
            "ፍርግርግ ቀያይር"

        ShowGrid ->
            "ፍርግርግ አሳይ"

        HideGrid ->
            "ፍርግርግ ደብቅ"

        AddDiagonalLines ->
            "ወደ ፍርግርግ ሰያፍ መስመሮችን ጨምር"

        CuriousAboutGrids ->
            "\u{1309}\u{1309}\u{1275} \u{12A0}\u{1208}\u{1205}? \u{1235}\u{1208}\u{12DA}\u{1205} \u{12E8}\u{12D8}\u{1218}\u{1293}\u{1275} \u{12D8}\u{12F4} \u{1260}\u{12CA}\u{12AA}\u{1354}\u{12F2}\u{12EB} \u{120B}\u{12ED} \u{1270}\u{132B}\u{121B}\u{122A} \u{12EB}\u{1295}\u{1265}\u{1261}:"

        ChangeImage ->
            "\u{120C}\u{120B} \u{121D}\u{1235}\u{120D} \u{12ED}\u{121D}\u{1228}\u{1321}"

        AdaptiveGridDensity ->
            -- English fallback (no native Amharic translation).
            "Adaptive density"

        AnalyzingImage ->
            -- English fallback (no native Amharic translation).
            "Analyzing..."

        OffLabel ->
            -- English fallback (no native Amharic translation).
            "Off"

        FileTooLarge ->
            -- English fallback (no native Amharic translation).
            "Image too large. Please use an image under 15MB."

        CommunityImagesGridded ->
            "ምስሎች ግርድ በ"

        CommunityCountriesWith ->
            "ጀንቶች, ጋር"

        CommunityHearts ->
            "ልብ"

        CommunityGriddersFrom ->
            -- English fallback (no native Amharic translation).
            "People griddin' it around the globe:"

        CommunityHeartsFrom ->
            "ከዓለም አቀፍ ልብ ሞች:"

        CommunitySpotlight ->
            "የዝህ ሳምንት ወርዋሉ:"

        CommunitySentMost ->
            "በበለጠ ልብ ላዪ"

        CommunityWhatsThis ->
            "ዪህ ቀጠሪ ምንድን ነው?"

        CommunityDisclaimerBody ->
            -- English fallback (no native Amharic translation).
            "when you download or heart, i log \"someone in [country] did the thing\". i dont use it for anything, just to show counters. when i was little, websites had visitor counters per country that made me feel i was not alone in the world. its my turn to pull my weight! — t"

        RateLimitMessage ->
            -- English fallback (no native Amharic translation).
            "whoa easy there cowboy — let the hearts catch their breath"

        HeartLikedIt ->
            -- English fallback (no native Amharic translation).
            "liked it?"

        HeartThanks ->
            -- English fallback (no native Amharic translation).
            "thankyouthankyouthankyou!!!!!!"


hebrewTranslations : TranslationKey -> String
hebrewTranslations key =
    case key of

        GridSize ->
            "גודל"

        GridColor ->
            "צבע"

        GridThickness ->
            "עובי"

        GridOpacity ->
            "שקיפות"

        DownloadGriddedImage ->
            "הורד את התמונה עם הרשת!"

        Nice ->
            "יפה! "

        NoImageYet ->
            "אין תמונה עדיין! לחץ על העלאת תמונה כדי להתחיל!"

        LanguageLabel ->
            "שפה:"

        AppSubtitle ->
            "שלום. זה עוזר לך ליצור רשת מלבנית על תמונה לבחירתך"

        UploadPlaceholder ->
            "העלה תמונה כדי להתחיל"

        ChooseFile ->
            "בחר קובץ"

        GridSettings ->
            "הגדרות רשת"

        DownloadStep ->
            "הורדה"

        WhatsThisDescription ->
            "Gridit, baby! העלו כל תמונה, הניחו רשת ושימשו בה כדי להגדיל את הציור על הבד. אמנים השתמשו בטכניקה הזו במשך מאות שנים \u{2014} ממאסטרי הרנסנס ועד מאיירים מודרניים \u{2014} כדי להעביר ולהגדיל קומפוזיציות בדיוק."

        MaxFileSize ->
            "מקסימום 15MB"

        SupportedFormats ->
            "JPG, PNG, GIF נתמכים"

        MadeInArgentina ->
            "נעשה בארגנטינה עם"

        WhatsGridit ->
            "מה זה Gridit?"

        FooterTooltip ->
            "שלום! אני מפתחת שאוהבת לתכנת ולצייר. Gridit עוזר לי להעביר סקיצות לקנבס באמצעות רשתות. מקווה שזה יעזור גם לך!"

        ImagePrivacy ->
            "התמונה שלך אף פעם לא עוזבת את המכשיר שלך"

        Downloaded ->
            "!הורד בהצלחה"

        ToggleGridView ->
            "הצג/הסתר רשת"

        ShowGrid ->
            "הצג רשת"

        HideGrid ->
            "הסתר רשת"

        AddDiagonalLines ->
            "הוסף קווים אלכסוניים לרשת"

        CuriousAboutGrids ->
            "\u{05E1}\u{05E7}\u{05E8}\u{05E0}\u{05D9}\u{05DD}? \u{05E7}\u{05E8}\u{05D0}\u{05D5} \u{05E2}\u{05D5}\u{05D3} \u{05E2}\u{05DC} \u{05D4}\u{05E9}\u{05D9}\u{05D8}\u{05D4} \u{05D4}\u{05E2}\u{05EA}\u{05D9}\u{05E7}\u{05D4} \u{05D4}\u{05D6}\u{05D5} \u{05D1}\u{05D5}\u{05D5}\u{05D9}\u{05E7}\u{05D9}\u{05E4}\u{05D3}\u{05D9}\u{05D4}:"

        ChangeImage ->
            "\u{05D1}\u{05D7}\u{05E8} \u{05EA}\u{05DE}\u{05D5}\u{05E0}\u{05D4} \u{05D0}\u{05D7}\u{05E8}\u{05EA}"

        AdaptiveGridDensity ->
            "\u{05E6}\u{05E4}\u{05D9}\u{05E4}\u{05D5}\u{05EA} \u{05DE}\u{05EA}\u{05D0}\u{05D9}\u{05DE}\u{05D4}"

        AnalyzingImage ->
            "\u{05DE}\u{05E0}\u{05EA}\u{05D7}..."

        OffLabel ->
            "\u{05DB}\u{05D1}\u{05D5}\u{05D9}"

        FileTooLarge ->
            "\u{05D4}\u{05EA}\u{05DE}\u{05D5}\u{05E0}\u{05D4} \u{05D2}\u{05D3}\u{05D5}\u{05DC}\u{05D4} \u{05DE}\u{05D3}\u{05D9}. \u{05D4}\u{05E9}\u{05EA}\u{05DE}\u{05E9} \u{05D1}\u{05EA}\u{05DE}\u{05D5}\u{05E0}\u{05D4} \u{05E7}\u{05D8}\u{05E0}\u{05D4} \u{05DE}\u{05A2} 15MB."

        CommunityImagesGridded ->
            "תמונות עם רשת בתוך"

        CommunityCountriesWith ->
            "מדינות, עם"

        CommunityHearts ->
            "לבות"

        CommunityGriddersFrom ->
            "אנשים שעושים רשתות מסביב לעולם:"

        CommunityHeartsFrom ->
            "לבות מכל העולם:"

        CommunitySpotlight ->
            "זרקור השבוע:"

        CommunitySentMost ->
            "שלחה את הכי הרבה"

        CommunityWhatsThis ->
            "מה זה המונה הזה?"

        CommunityDisclaimerBody ->
            "כשאת מורידה או נותנת לב, אני מתעדת \"מישהו ב[מדינה] עשה את זה\". אני לא משתמשת בזה לשום דבר, רק להציג מונים. כשהייתי קטנה, היו אתרים עם מוני מבקרים לפי מדינה שגרמו לי להרגיש שאני לא לבד בעולם. עכשיו תורי להחזיר! — t"

        RateLimitMessage ->
            "וואו לאט לך קאובוי — תן ללבבות לתפוס אוויר"

        HeartLikedIt ->
            "אהבת?"

        HeartThanks ->
            "תודהתודהתודה!!!!!!"
