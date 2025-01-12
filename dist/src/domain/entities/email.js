"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Email = exports.SendEmail = void 0;
var SendEmail;
(function (SendEmail) {
    SendEmail[SendEmail["TRUE"] = 0] = "TRUE";
    SendEmail[SendEmail["FALSE"] = 1] = "FALSE";
})(SendEmail || (exports.SendEmail = SendEmail = {}));
class Email {
    constructor(props) {
        this.props = props;
    }
    static create(props) {
        return new Email(props);
    }
    get from() {
        return this.props.from;
    }
    set from(from) {
        this.props.from = from;
    }
    get to() {
        return this.props.to;
    }
    set to(to) {
        this.props.to = to;
    }
    get subject() {
        return this.props.subject;
    }
    set subject(subject) {
        this.props.subject = subject;
    }
    get text() {
        return this.props.text;
    }
    set text(text) {
        this.props.text = text;
    }
    get html() {
        return this.props.html;
    }
    set html(html) {
        this.props.html = html;
    }
    get attachments() {
        return this.props.attachments;
    }
    set attachments(attachments) {
        this.props.attachments = attachments;
    }
}
exports.Email = Email;
