export class TimeUtils {
    static parseDuration(duration: string): number | null {
        const match = duration.match(/^(\d+)([smhd])$/);
        if (!match) return null;

        const value = parseInt(match[1], 10);
        const unit = match[2];

        switch (unit) {
            case "s":
                return value;
            case "m":
                return value * 60;
            case "h":
                return value * 3600;
            case "d":
                return value * 86400;
            default:
                return null;
        }
    }

    static parseTime(time: number): string {
        const minutes = Math.floor(((time * 1000) / (60 * 1000)) % 60);
        const seconds = Math.floor((time * 1000) / 1000) % 60;

        const dateFormatted = [minutes, seconds].map(element => {
            return element < 10 ? "0" + element : element;
        });

        const [minutesFormatted, secondsFormatter] = dateFormatted;

        return `${minutesFormatted}:${secondsFormatter}`;
    }
}
