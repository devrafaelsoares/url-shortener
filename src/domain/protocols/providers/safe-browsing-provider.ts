export interface SafeBrowsingProvider {
    /**
     * Verifica se uma URL é segura para encurtamento (Não é phishing, malware ou blacklist)
     * @param url A URL original enviada pelo usuário
     * @returns Promise<boolean> Retorna `true` se for segura e limpa.
     */
    isSafe(url: string): Promise<boolean>;
}
