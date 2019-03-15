export abstract class SearchTokens {

    /**
     * pattern to match meta informations from tokens
     * relevant matches: $1 => count; $2 => from date; $3 => to date
     */
    public static readonly NAMED_LICENSE_META = /^EXCEL_NAMED;([0-9]+)(?:(?:;)([^;]*))?(?:;(.*?))?$/;

    /**
     * pattern to match meta informations from tokens
     * relevant matches: $1 => count; $2 => from date; $3 => to date
     */
    public static readonly TOKEN_LICENSE_META = /^EXCEL_TOKENS;([0-9]+)(?:(?:;)([^;]*))?(?:;(.*?))?$/;


    /** @todo implement pattern for user excel name, EXCEL_NAME is start, user; from; to */
    public static readonly USER = /^EXCEL_NAME;?([0-9]+)(?:(?:;)([^;]+))?;?([^;]+)?$/;
}
