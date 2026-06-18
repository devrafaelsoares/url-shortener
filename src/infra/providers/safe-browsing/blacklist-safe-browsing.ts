import { SafeBrowsingProvider } from "@domain/protocols/providers";

export class BlacklistSafeBrowsing implements SafeBrowsingProvider {
    private readonly maliciousPatterns: RegExp[] = [
        /(javascript|vbscript|data):/i, // Prevenção de XSS payloads
        /phishing-site\.com/i, // Exemplo de domínio de phishing
        /malware-download\.net/i, // Exemplo de domínio de malware
        /\.exe$/i, // Prevenção básica de downloads diretos de executáveis
        /(\b)(onS+)(\s*)=|javascript|(<\s*)(\/*)script/i // Prevenção de injeções de script na URL
    ];

    async isSafe(url: string): Promise<boolean> {
        // AppSec: Garantir que a URL maliciosa seja interceptada usando Regexes seguros
        for (const pattern of this.maliciousPatterns) {
            if (pattern.test(url)) {
                return false;
            }
        }
        
        // Simulação de latência de uma API real (ex: Google Safe Browsing)
        // await new Promise((resolve) => setTimeout(resolve, 50));

        return true;
    }
}
