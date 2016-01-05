declare var analyticsUser:GA.User;

/**
 * OrangeGames angular translations
 */
declare module OG.AngularTranslations {
    /**
     * Services that translates
     */
    interface TranslationService {
        add(id:string, message:string, domain:string):void;
        trans(id:string, parameters?:OG.AngularTranslations.Parameters, domain?:string):string;
        transChoice(id:string, number:number, parameters?:OG.AngularTranslations.Parameters, domain?:string):string;
        parseData(data:OG.AngularTranslations.DomainContainer):void;
    }

    /**
     * Trans filter
     */
    interface TransFilter {
        (id:string, parameters?:OG.AngularTranslations.Parameters, domain?:string):string;
    }

    /**
     * Trans choice filter
     */
    interface TransChoiceFilter {
        (id:string, number:number, parameters?:OG.AngularTranslations.Parameters, domain?:string):string;
    }

    /**
     * Parameters used in translations
     */
    interface Parameters {
        [source:string]: string|number;
    }

    /**
     * Contains domains with their texts
     */
    interface DomainContainer {
        [domain:string]: TextContainer;
    }

    /**
     * Contains texts
     */
    interface TextContainer {
        [id:string]: string;
    }
}

/**
 * This variable contains the module itself
 */
declare var ogTranslationService:OG.AngularTranslations.TranslationService;

interface ScoreCombination {
    name: string;
    score: number;
}
