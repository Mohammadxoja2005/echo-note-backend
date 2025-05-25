"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Infrastructure = void 0;
exports.Infrastructure = {
    ASR: {
        OpenAI: Symbol.for("OpenAIASR"),
    },
    Converter: {
        Audio: Symbol.for("AudioConverter"),
    },
    Repository: {
        User: Symbol.for("UserRepository"),
        Note: Symbol.for("NoteRepository"),
    },
    PaymentProcessor: {
        LemonSqueezy: Symbol.for("PaymentProcessorLemonSqueezy"),
    },
    MailSender: Symbol.for("MailSender"),
};
