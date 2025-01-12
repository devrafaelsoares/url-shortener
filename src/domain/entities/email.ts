export type EmailConfig = {
    host: string;
    port: number;
    username: string;
    password: string;
};

export enum SendEmail {
    TRUE,
    FALSE,
}

export type EmailProps = {
    from: string;
    to: string;
    subject: string;
    text?: string;
    html?: string;
    attachments?: Object[];
};

export type EmailPropsCreate = EmailProps;

export class Email implements EmailProps {
    private constructor(private props: EmailPropsCreate) {}

    static create(props: EmailPropsCreate) {
        return new Email(props);
    }

    get from(): string {
        return this.props.from;
    }

    set from(from: string) {
        this.props.from = from;
    }

    get to(): string {
        return this.props.to;
    }

    set to(to: string) {
        this.props.to = to;
    }

    get subject(): string {
        return this.props.subject;
    }

    set subject(subject: string) {
        this.props.subject = subject;
    }

    get text(): string | undefined {
        return this.props.text;
    }

    set text(text: string) {
        this.props.text = text;
    }

    get html(): string | undefined {
        return this.props.html;
    }

    set html(html: string) {
        this.props.html = html;
    }

    get attachments(): Object[] | undefined {
        return this.props.attachments;
    }

    set attachments(attachments: Object[]) {
        this.props.attachments = attachments;
    }
}
