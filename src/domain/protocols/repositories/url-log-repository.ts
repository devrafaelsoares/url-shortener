import { UrlLog } from "@domain/entities";

export interface UrlLogRepository {
    create(url: UrlLog): Promise<UrlLog>;
}
